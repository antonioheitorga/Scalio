export type Agronomist = {
  id: string;
  name: string;
  pin: string;
  initials: string;
};

export type VisitType =
  | 'Producao'
  | 'Venda'
  | 'Insumo'
  | 'Problema'
  | 'OrientacaoTecnica';

export type SyncStatus = 'synced' | 'pending';

export type Family = {
  id: string;
  agronomistId: string;
  name: string;
  cultures: string[];
  areaHectares: number;
  createdAt: string;
};

export type Visit = {
  id: string;
  familyId: string;
  agronomistId: string;
  date: string;
  type: VisitType;
  culture: string;
  quantity?: number;
  value?: number;
  notes: string;
  problemDescription?: string;
  problemResolved?: boolean;
  syncStatus: SyncStatus;
};

export type Session = {
  agronomistId: string;
};

export type AppState = {
  agronomists: Agronomist[];
  families: Family[];
  visits: Visit[];
  session: Session | null;
};

export type RootStackParamList = {
  Login: undefined;
  FamilyList: undefined;
  AddFamily: undefined;
  FamilyProfile: { familyId: string };
  VisitForm: { familyId: string };
  VisitDetail: { visitId: string };
  Dashboard: undefined;
};

export type FamilySummary = Family & {
  lastVisit: Visit | null;
  visitCount: number;
  needsAttention: boolean;
  hasActiveProblem: boolean;
};
