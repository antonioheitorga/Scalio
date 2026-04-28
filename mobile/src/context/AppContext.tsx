import * as Network from 'expo-network';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { auth, isFirebaseConfigured } from '../config/firebase';
import { initialState } from '../data/seed';
import { fetchFamilies, fetchVisits, pushFamilies, pushVisits } from '../services/syncService';
import { loadAppState, saveAppState } from '../storage/appStorage';
import type { AppState, Family, FamilySummary, Session, Visit, VisitType } from '../types';
import { isOlderThanDays, startOfCurrentMonth } from '../utils/date';
import { makeId } from '../utils/ids';

type AddFamilyInput = {
  name: string;
  cultures: string[];
  areaHectares: number;
};

type AddVisitInput = {
  familyId: string;
  date: string;
  type: VisitType;
  culture: string;
  quantity?: number;
  value?: number;
  notes: string;
  problemDescription?: string;
  problemResolved?: boolean;
};

type DashboardStats = {
  totalFamilies: number;
  monthlyVisits: number;
  staleFamilies: number;
  activeProblems: number;
};

type AppContextValue = {
  state: AppState;
  currentUser: AppState['agents'][number] | null;
  isHydrated: boolean;
  isSyncing: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  addFamily: (input: AddFamilyInput) => Family | null;
  addVisit: (input: AddVisitInput) => Visit | null;
  resolveProblem: (visitId: string, notes?: string) => boolean;
  getFamiliesForCurrentUser: () => FamilySummary[];
  getFamilyById: (familyId: string) => Family | undefined;
  getVisitsForFamily: (familyId: string) => Visit[];
  getVisitById: (visitId: string) => Visit | undefined;
  getDashboardStats: () => DashboardStats;
  syncPendingData: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function getCurrentUserFromSession(state: AppState, session: Session | null) {
  if (!session) return null;
  return state.agents.find((item) => item.id === session.agentId) ?? null;
}

async function checkOnline(): Promise<boolean> {
  const net = await Network.getNetworkStateAsync();
  return Boolean(net.isConnected && net.isInternetReachable !== false);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Garante uma sessão anônima no Firebase antes de qualquer operação no Firestore
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthReady(true);
      } else {
        signInAnonymously(auth).catch(() => {
          // Falha silenciosa — app continua offline
          setIsAuthReady(true);
        });
      }
    });

    return unsubscribe;
  }, []);

  // Ref para acessar o estado atual dentro de callbacks assíncronos sem deps stale
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    async function hydrate() {
      const persistedState = await loadAppState();
      setState(persistedState);
      setIsHydrated(true);
    }
    void hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    void saveAppState(state);
  }, [isHydrated, state]);

  const currentUser = useMemo(() => getCurrentUserFromSession(state, state.session), [state]);

  // Sync bidirecional: puxa remoto, mescla com local, empurra pendentes
  const syncForAgent = useCallback(async (agentId: string) => {
    if (!isFirebaseConfigured) return;

    setIsSyncing(true);

    try {
      const [remoteFamilies, remoteVisits] = await Promise.all([
        fetchFamilies(agentId),
        fetchVisits(agentId),
      ]);

      // Mescla: itens remotos que não existem localmente são adicionados
      setState((prev) => {
        const localFamilyIds = new Set(prev.families.map((f) => f.id));
        const localVisitIds = new Set(prev.visits.map((v) => v.id));

        return {
          ...prev,
          families: [
            ...prev.families,
            ...remoteFamilies.filter((f) => !localFamilyIds.has(f.id)),
          ],
          visits: [
            ...prev.visits,
            ...remoteVisits.filter((v) => !localVisitIds.has(v.id)),
          ],
        };
      });

      // Empurra dados locais para o Firestore
      const current = stateRef.current;
      const localFamilies = current.families.filter((f) => f.agentId === agentId);
      const pendingVisits = current.visits.filter(
        (v) => v.agentId === agentId && v.syncStatus === 'pending',
      );

      await Promise.all([
        pushFamilies(localFamilies),
        pushVisits(pendingVisits),
      ]);

      // Marca pendentes como sincronizados
      if (pendingVisits.length > 0) {
        const pendingIds = new Set(pendingVisits.map((v) => v.id));
        setState((prev) => ({
          ...prev,
          visits: prev.visits.map((v) =>
            pendingIds.has(v.id) ? { ...v, syncStatus: 'synced' } : v,
          ),
        }));
      }
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Auto-sync a cada 30s quando há conexão
  useEffect(() => {
    if (!currentUser || !isHydrated || !isAuthReady || !isFirebaseConfigured) return;

    let mounted = true;

    async function trySync() {
      if (!mounted) return;
      const online = await checkOnline();
      if (online && mounted) {
        try {
          await syncForAgent(currentUser!.id);
        } catch {
          // falha silenciosa — app funciona offline
        }
      }
    }

    void trySync();
    const interval = setInterval(() => void trySync(), 30_000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [currentUser, isHydrated, isAuthReady, syncForAgent]);

  const login = useCallback(
    (pin: string) => {
      const user = state.agents.find((item) => item.pin === pin);
      if (!user) return false;

      setState((prev) => ({ ...prev, session: { agentId: user.id } }));

      // Sync imediato ao fazer login (se online)
      void (async () => {
        const online = await checkOnline();
        if (online) {
          try {
            await syncForAgent(user.id);
          } catch {
            // silencioso
          }
        }
      })();

      return true;
    },
    [state.agents, syncForAgent],
  );

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, session: null }));
  }, []);

  const addFamily = useCallback(
    (input: AddFamilyInput) => {
      if (!currentUser) return null;

      const family: Family = {
        id: makeId('family'),
        agentId: currentUser.id,
        name: input.name,
        cultures: input.cultures,
        areaHectares: input.areaHectares,
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({ ...prev, families: [family, ...prev.families] }));

      // Tenta push imediato; falha silenciosa (sync depois)
      void (async () => {
        const online = await checkOnline();
        if (online && isFirebaseConfigured) {
          try {
            await pushFamilies([family]);
          } catch {
            // será sincronizado no próximo ciclo
          }
        }
      })();

      return family;
    },
    [currentUser],
  );

  const addVisit = useCallback(
    (input: AddVisitInput) => {
      if (!currentUser) return null;

      const visit: Visit = {
        id: makeId('visit'),
        agentId: currentUser.id,
        familyId: input.familyId,
        date: input.date,
        type: input.type,
        culture: input.culture,
        quantity: input.quantity,
        value: input.value,
        notes: input.notes,
        problemDescription: input.problemDescription,
        problemResolved: input.problemResolved,
        syncStatus: 'pending',
      };

      setState((prev) => ({ ...prev, visits: [visit, ...prev.visits] }));

      // Tenta push imediato e marca como synced
      void (async () => {
        const online = await checkOnline();
        if (online && isFirebaseConfigured) {
          try {
            await pushVisits([visit]);
            setState((prev) => ({
              ...prev,
              visits: prev.visits.map((v) =>
                v.id === visit.id ? { ...v, syncStatus: 'synced' } : v,
              ),
            }));
          } catch {
            // será sincronizado no próximo ciclo
          }
        }
      })();

      return visit;
    },
    [currentUser],
  );

  const resolveProblem = useCallback(
    (visitId: string, notes?: string) => {
      const target = stateRef.current.visits.find((v) => v.id === visitId);
      // Idempotente: ignora se nao existe, nao e problema, ou ja foi resolvido
      if (!target || target.type !== 'Problema' || target.problemResolved) return false;

      const trimmedNotes = notes?.trim();
      const resolvedAt = new Date().toISOString();

      // Spread condicional: campos opcionais ficam ausentes (nao undefined),
      // o que evita erro do Firestore com `set` e undefined.
      const updates: Partial<Visit> = {
        problemResolved: true,
        problemResolvedAt: resolvedAt,
        ...(trimmedNotes ? { problemResolutionNotes: trimmedNotes } : {}),
        syncStatus: 'pending',
      };

      setState((prev) => ({
        ...prev,
        visits: prev.visits.map((v) => (v.id === visitId ? { ...v, ...updates } : v)),
      }));

      void (async () => {
        const online = await checkOnline();
        if (!online || !isFirebaseConfigured) return;
        try {
          const updated: Visit = { ...target, ...updates } as Visit;
          await pushVisits([updated]);
          setState((prev) => ({
            ...prev,
            visits: prev.visits.map((v) =>
              v.id === visitId ? { ...v, syncStatus: 'synced' } : v,
            ),
          }));
        } catch {
          // sera sincronizado no proximo ciclo
        }
      })();

      return true;
    },
    [],
  );

  const getVisitsForFamily = useCallback(
    (familyId: string) =>
      state.visits
        .filter((visit) => visit.familyId === familyId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [state.visits],
  );

  const getFamilyById = useCallback(
    (familyId: string) => state.families.find((f) => f.id === familyId),
    [state.families],
  );

  const getVisitById = useCallback(
    (visitId: string) => state.visits.find((v) => v.id === visitId),
    [state.visits],
  );

  const getFamiliesForCurrentUser = useCallback(() => {
    if (!currentUser) return [];

    return state.families
      .filter((family) => family.agentId === currentUser.id)
      .map((family) => {
        const visits = getVisitsForFamily(family.id);
        const lastVisit = visits[0] ?? null;
        const hasActiveProblem = visits.some(
          (v) => v.type === 'Problema' && v.problemResolved !== true,
        );

        return {
          ...family,
          lastVisit,
          visitCount: visits.length,
          needsAttention: !lastVisit || isOlderThanDays(lastVisit.date, 15),
          hasActiveProblem,
        };
      })
      .sort((a, b) => {
        const aDate = a.lastVisit ? new Date(a.lastVisit.date).getTime() : 0;
        const bDate = b.lastVisit ? new Date(b.lastVisit.date).getTime() : 0;
        return bDate - aDate;
      });
  }, [currentUser, getVisitsForFamily, state.families]);

  const getDashboardStats = useCallback(() => {
    const families = getFamiliesForCurrentUser();
    const monthStart = startOfCurrentMonth();

    const monthlyVisits = families.reduce((count, family) => {
      return (
        count +
        getVisitsForFamily(family.id).filter((v) => new Date(v.date) >= monthStart).length
      );
    }, 0);

    return {
      totalFamilies: families.length,
      monthlyVisits,
      staleFamilies: families.filter((f) => f.needsAttention).length,
      activeProblems: families.filter((f) => f.hasActiveProblem).length,
    };
  }, [getFamiliesForCurrentUser, getVisitsForFamily]);

  const syncPendingData = useCallback(() => {
    if (!currentUser || !isFirebaseConfigured) return;
    void (async () => {
      const online = await checkOnline();
      if (!online) return;
      try {
        await syncForAgent(currentUser.id);
      } catch {
        // silencioso
      }
    })();
  }, [currentUser, syncForAgent]);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      currentUser,
      isHydrated,
      isSyncing,
      login,
      logout,
      addFamily,
      addVisit,
      resolveProblem,
      getFamiliesForCurrentUser,
      getFamilyById,
      getVisitsForFamily,
      getVisitById,
      getDashboardStats,
      syncPendingData,
    }),
    [
      addFamily,
      addVisit,
      resolveProblem,
      currentUser,
      getDashboardStats,
      getFamiliesForCurrentUser,
      getFamilyById,
      getVisitById,
      getVisitsForFamily,
      isHydrated,
      isSyncing,
      login,
      logout,
      state,
      syncPendingData,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
