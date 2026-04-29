import AsyncStorage from '@react-native-async-storage/async-storage';

import { initialState } from '../data/seed';
import type { AppState } from '../types';

const STORAGE_KEY = 'scalio-app-state';

// Migration retro-compativel: AsyncStorage de versoes anteriores ao
// refator agronomista→agente guarda os campos com nome antigo. Ao
// hidratar, normalizamos. Persistencias futuras ja usam o nome novo
// (saveAppState recebe AppState ja tipado).
function migrateLegacyState(parsed: unknown): AppState {
  const raw = (parsed ?? {}) as Record<string, unknown>;

  const legacyAgents = raw.agents ?? raw.agronomists;
  const agents = Array.isArray(legacyAgents)
    ? (legacyAgents as AppState['agents'])
    : initialState.agents;

  const families = Array.isArray(raw.families)
    ? (raw.families as Array<Record<string, unknown>>).map((f) => {
        const { agronomistId, ...rest } = f;
        return {
          ...rest,
          agentId: (f.agentId as string | undefined) ?? (agronomistId as string | undefined),
        } as AppState['families'][number];
      })
    : [];

  const visits = Array.isArray(raw.visits)
    ? (raw.visits as Array<Record<string, unknown>>).map((v) => {
        const { agronomistId, ...rest } = v;
        return {
          ...rest,
          agentId: (v.agentId as string | undefined) ?? (agronomistId as string | undefined),
        } as AppState['visits'][number];
      })
    : [];

  let session: AppState['session'] = null;
  if (raw.session && typeof raw.session === 'object') {
    const s = raw.session as Record<string, unknown>;
    const agentId = (s.agentId as string | undefined) ?? (s.agronomistId as string | undefined);
    if (typeof agentId === 'string') {
      session = { agentId };
    }
  }

  return { agents, families, visits, session };
}

export async function loadAppState(): Promise<AppState> {
  const rawState = await AsyncStorage.getItem(STORAGE_KEY);

  if (!rawState) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(rawState);
    return migrateLegacyState(parsed);
  } catch {
    return initialState;
  }
}

export async function saveAppState(state: AppState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
