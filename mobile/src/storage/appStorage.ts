import AsyncStorage from '@react-native-async-storage/async-storage';

import { initialState } from '../data/seed';
import type { AppState, User } from '../types';

const STORAGE_KEY = 'scalio-app-state';

// Merge seed↔storage por id: seed é a fonte da verdade estrutural (garante
// novos entries do seed em storages antigos), storage sobrescreve estado
// mutavel (ex.: PIN). Items so no storage (edge case) também entram.
// Regra consolidada em context.md — implementação canonica aqui.
function mergeSeedWithStored<T extends { id: string }>(seed: T[], stored: T[]): T[] {
  const storedById = new Map(stored.map((item) => [item.id, item]));
  const merged = seed.map((seedItem) => {
    const storedItem = storedById.get(seedItem.id);
    return storedItem ? { ...seedItem, ...storedItem } : seedItem;
  });
  for (const item of stored) {
    if (!merged.some((m) => m.id === item.id)) merged.push(item);
  }
  return merged;
}

// Migration retro-compativel:
// - Pre-Sprint B (refator agronomista→agente): coleções `agronomists` e
//   `agronomistId` em family/visit/session.
// - Pre-Sprint C (HU-17): coleção `agents` e `Session.agentId`, sem campo
//   `role` no usuario. Defaultamos `role: 'agente'` (versao legada so tinha agentes).
function migrateLegacyState(parsed: unknown): AppState {
  const raw = (parsed ?? {}) as Record<string, unknown>;

  const legacyUsers = raw.users ?? raw.agents ?? raw.agronomists;
  const storedUsers: User[] = Array.isArray(legacyUsers)
    ? (legacyUsers as Array<Record<string, unknown>>).map((u) => ({
        ...(u as User),
        role: ((u as User).role ?? 'agente') as User['role'],
      }))
    : [];
  const users = mergeSeedWithStored(initialState.users, storedUsers);

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
    const userId =
      (s.userId as string | undefined) ??
      (s.agentId as string | undefined) ??
      (s.agronomistId as string | undefined);
    if (typeof userId === 'string') {
      session = { userId };
    }
  }

  return { users, families, visits, session };
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
