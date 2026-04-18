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

export async function fetchFamilies(agronomistId: string): Promise<Family[]> {
  const snap = await getDocs(
    query(collection(db, FAMILIES), where('agronomistId', '==', agronomistId)),
  );
  return snap.docs.map((d) => d.data() as Family);
}

export async function fetchVisits(agronomistId: string): Promise<Visit[]> {
  const snap = await getDocs(
    query(collection(db, VISITS), where('agronomistId', '==', agronomistId)),
  );
  return snap.docs.map((d) => ({ ...d.data(), syncStatus: 'synced' as const }) as Visit);
}
