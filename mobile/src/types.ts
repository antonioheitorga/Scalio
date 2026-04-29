export type Agent = {
  id: string;
  name: string;
  pin: string;
  initials: string;
  // Codigo de recuperacao gerado uma vez no cadastro do agente.
  // Texto-claro e aceitavel no MVP (seed local). Endurecer em HU-16
  // quando agentes forem persistidos no Firestore.
  recoveryCode?: string;
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
  agentId: string;
  name: string;
  cultures: string[];
  areaHectares: number;
  createdAt: string;
};

export type Visit = {
  id: string;
  familyId: string;
  agentId: string;
  date: string;
  type: VisitType;
  culture: string;
  quantity?: number;
  value?: number;
  notes: string;
  problemDescription?: string;
  problemResolved?: boolean;
  problemResolvedAt?: string;
  problemResolutionNotes?: string;
  // Campos de auditoria (HU-21):
  // updatedAt: ultima edicao | updatedBy: agente que editou | deletedAt: soft delete
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
  syncStatus: SyncStatus;
};

export type Session = {
  agentId: string;
};

export type AppState = {
  agents: Agent[];
  families: Family[];
  visits: Visit[];
  session: Session | null;
};

export type RootStackParamList = {
  Login: undefined;
  ForgotPin: undefined;
  FamilyList: undefined;
  AddFamily: undefined;
  FamilyProfile: { familyId: string };
  VisitForm: { familyId: string; visitId?: string };
  VisitDetail: { visitId: string };
  ResolveProblem: { visitId: string };
  Dashboard: undefined;
};

export type FamilySummary = Family & {
  lastVisit: Visit | null;
  visitCount: number;
  needsAttention: boolean;
  hasActiveProblem: boolean;
};
