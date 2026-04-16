import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { initialState } from '../data/seed';
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
  currentUser: AppState['agronomists'][number] | null;
  isHydrated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
  addFamily: (input: AddFamilyInput) => Family | null;
  addVisit: (input: AddVisitInput) => Visit | null;
  getFamiliesForCurrentUser: () => FamilySummary[];
  getFamilyById: (familyId: string) => Family | undefined;
  getVisitsForFamily: (familyId: string) => Visit[];
  getVisitById: (visitId: string) => Visit | undefined;
  getDashboardStats: () => DashboardStats;
  syncPendingData: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function getCurrentUserFromSession(state: AppState, session: Session | null) {
  if (!session) {
    return null;
  }

  return state.agronomists.find((item) => item.id === session.agronomistId) ?? null;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function hydrate() {
      const persistedState = await loadAppState();
      setState(persistedState);
      setIsHydrated(true);
    }

    void hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void saveAppState(state);
  }, [isHydrated, state]);

  const currentUser = useMemo(() => getCurrentUserFromSession(state, state.session), [state]);

  const login = useCallback((pin: string) => {
    const user = state.agronomists.find((item) => item.pin === pin);

    if (!user) {
      return false;
    }

    setState((previous) => ({
      ...previous,
      session: {
        agronomistId: user.id,
      },
    }));

    return true;
  }, [state.agronomists]);

  const logout = useCallback(() => {
    setState((previous) => ({
      ...previous,
      session: null,
    }));
  }, []);

  const addFamily = useCallback((input: AddFamilyInput) => {
    if (!currentUser) {
      return null;
    }

    const family: Family = {
      id: makeId('family'),
      agronomistId: currentUser.id,
      name: input.name,
      cultures: input.cultures,
      areaHectares: input.areaHectares,
      createdAt: new Date().toISOString(),
    };

    setState((previous) => ({
      ...previous,
      families: [family, ...previous.families],
    }));

    return family;
  }, [currentUser]);

  const addVisit = useCallback((input: AddVisitInput) => {
    if (!currentUser) {
      return null;
    }

    const visit: Visit = {
      id: makeId('visit'),
      agronomistId: currentUser.id,
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

    setState((previous) => ({
      ...previous,
      visits: [visit, ...previous.visits],
    }));

    return visit;
  }, [currentUser]);

  const getVisitsForFamily = useCallback((familyId: string) => {
    return state.visits
      .filter((visit) => visit.familyId === familyId)
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
  }, [state.visits]);

  const getFamilyById = useCallback((familyId: string) => {
    return state.families.find((family) => family.id === familyId);
  }, [state.families]);

  const getVisitById = useCallback((visitId: string) => {
    return state.visits.find((visit) => visit.id === visitId);
  }, [state.visits]);

  const getFamiliesForCurrentUser = useCallback(() => {
    if (!currentUser) {
      return [];
    }

    return state.families
      .filter((family) => family.agronomistId === currentUser.id)
      .map((family) => {
        const visits = getVisitsForFamily(family.id);
        const lastVisit = visits[0] ?? null;
        const hasActiveProblem = visits.some(
          (visit) => visit.type === 'Problema' && visit.problemResolved !== true,
        );

        return {
          ...family,
          lastVisit,
          visitCount: visits.length,
          needsAttention: !lastVisit || isOlderThanDays(lastVisit.date, 15),
          hasActiveProblem,
        };
      })
      .sort((left, right) => {
        const leftDate = left.lastVisit ? new Date(left.lastVisit.date).getTime() : 0;
        const rightDate = right.lastVisit ? new Date(right.lastVisit.date).getTime() : 0;

        return rightDate - leftDate;
      });
  }, [currentUser, getVisitsForFamily, state.families]);

  const getDashboardStats = useCallback(() => {
    const families = getFamiliesForCurrentUser();
    const monthStart = startOfCurrentMonth();

    const monthlyVisits = families.reduce((count, family) => {
      const familyVisits = getVisitsForFamily(family.id).filter(
        (visit) => new Date(visit.date) >= monthStart,
      );
      return count + familyVisits.length;
    }, 0);

    return {
      totalFamilies: families.length,
      monthlyVisits,
      staleFamilies: families.filter((family) => family.needsAttention).length,
      activeProblems: families.filter((family) => family.hasActiveProblem).length,
    };
  }, [getFamiliesForCurrentUser, getVisitsForFamily]);

  const syncPendingData = useCallback(() => {
    setState((previous) => ({
      ...previous,
      visits: previous.visits.map((visit) =>
        visit.syncStatus === 'pending' ? { ...visit, syncStatus: 'synced' } : visit,
      ),
    }));
  }, []);

  const value = useMemo<AppContextValue>(() => ({
    state,
    currentUser,
    isHydrated,
    login,
    logout,
    addFamily,
    addVisit,
    getFamiliesForCurrentUser,
    getFamilyById,
    getVisitsForFamily,
    getVisitById,
    getDashboardStats,
    syncPendingData,
  }), [
    addFamily,
    addVisit,
    currentUser,
    getDashboardStats,
    getFamiliesForCurrentUser,
    getFamilyById,
    getVisitById,
    getVisitsForFamily,
    isHydrated,
    login,
    logout,
    state,
    syncPendingData,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}
