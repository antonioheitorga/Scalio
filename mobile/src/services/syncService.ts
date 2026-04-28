import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';

import { db } from '../config/firebase';
import type { Family, Visit } from '../types';

const FAMILIES = 'families';
const VISITS = 'visits';

export async function pushFamilies(families: Family[]): Promise<void> {
  if (families.length === 0) return;
  const batch = writeBatch(db);
  families.forEach((family) => {
    batch.set(doc(db, FAMILIES, family.id), family);
  });
  await batch.commit();
}

export async function pushVisits(visits: Visit[]): Promise<void> {
  if (visits.length === 0) return;
  const batch = writeBatch(db);
  visits.forEach((visit) => {
    // syncStatus é controle local — não vai pro Firestore
    const { syncStatus, ...data } = visit;
    batch.set(doc(db, VISITS, visit.id), data);
  });
  await batch.commit();
}

// Helper: remove o campo legado 'agronomistId' e garante 'agentId'
// Retro-compatibilidade com documentos criados antes do refator.
function normalizeAgentField<T>(data: Record<string, unknown>): T {
  const { agronomistId, ...rest } = data;
  return {
    ...rest,
    agentId: (data.agentId as string | undefined) ?? (agronomistId as string | undefined),
  } as T;
}

export async function fetchFamilies(agentId: string): Promise<Family[]> {
  // Dupla query: doc novo (agentId) + doc legado (agronomistId).
  // Mantém docs antigos visíveis até serem atualizados pelo app, quando
  // o set substitui pelo formato novo.
  const [snapNew, snapOld] = await Promise.all([
    getDocs(query(collection(db, FAMILIES), where('agentId', '==', agentId))),
    getDocs(query(collection(db, FAMILIES), where('agronomistId', '==', agentId))),
  ]);

  const merged = new Map<string, Family>();
  [...snapNew.docs, ...snapOld.docs].forEach((d) => {
    merged.set(d.id, normalizeAgentField<Family>(d.data()));
  });
  return Array.from(merged.values());
}

export async function fetchVisits(agentId: string): Promise<Visit[]> {
  const [snapNew, snapOld] = await Promise.all([
    getDocs(query(collection(db, VISITS), where('agentId', '==', agentId))),
    getDocs(query(collection(db, VISITS), where('agronomistId', '==', agentId))),
  ]);

  const merged = new Map<string, Visit>();
  [...snapNew.docs, ...snapOld.docs].forEach((d) => {
    const normalized = normalizeAgentField<Omit<Visit, 'syncStatus'>>(d.data());
    merged.set(d.id, { ...normalized, syncStatus: 'synced' } as Visit);
  });
  return Array.from(merged.values());
}
