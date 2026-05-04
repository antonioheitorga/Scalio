# Sessão — SCALIO

## Última sessão (Maio/2026) — Sprint C, HU-17 ✅ Concluída

### O que foi entregue

**HU-17 — Login e perfil de Familiar** — branch `feature/HU-17-familiar-login` no GitHub, PR aberto para `develop`

Decisão estrutural tomada antes de codar: tipo único `User` com `role: 'agente' | 'familiar'`
(Opção A) em vez de tipos separados. Afeta toda Sprint C em diante.

Arquivos alterados:
- `types.ts` — `Agent → User`, `role`, `familyId?`, `Session.userId`, `AppState.users`, rota `FamiliarHome`
- `seed.ts` — agentes com `role: 'agente'`, dois familiares de teste (Antonio Souza PIN 2468, Maria Pinto PIN 1357)
- `storage/appStorage.ts` — `mergeSeedWithStored` (função canônica de merge seed↔storage), migration retro-compatível agents/agronomists → users
- `context/AppContext.tsx` — rename completo, sync e resetPin guardados para `role === 'agente'`
- `App.tsx` — navegação bifurcada por role
- `screens/FamiliarHomeScreen.tsx` — tela nova: família vinculada (nome, culturas, área) + Sair
- `screens/LoginScreen.tsx` — demo box mostra todos os users com label `[Agente]`/`[Familiar]`
- `screens/ForgotPinScreen.tsx` — picker filtrado para `role === 'agente'`
- `context.md`, `sessao.md` — documentação atualizada

### Estado atual

- Branch `feature/HU-17-familiar-login` pushed ✅
- PR aberto no GitHub para `develop` ✅
- Merge em `develop` → responsabilidade do usuário
- `firestore.rules` — não tocado (familiar não escreve nada ainda) ✅

### Débitos técnicos

**PIN por SMS (HU-22 futura):**
O fluxo atual usa código fixo no seed. Quando houver backend real:
- Remover picker de agente — tela individual por usuário
- Código enviado por SMS/WhatsApp no momento da solicitação
- Atender também o familiar (HU-17+)
- Pré-requisito: HU-16 (auth server-side) ou decisão de infra de SMS

**Regra de 30 dias no servidor (HU-21+):**
Hoje só validada no cliente. Quando vier multi-role (HU-16), endurecer no Firestore Rules.

**Método de login (sprint futura):**
Login atual busca apenas por PIN (`state.users.find(u => u.pin === pin)`). Dois usuarios
com mesmo PIN colidem silenciosamente — o primeiro encontrado loga, sem aviso. Decidido
em HU-17 manter como está para teste. Revisitar antes de escala.
Recomendação na mesa: "selecionar nome + PIN" (lista no aparelho → toca no nome → digita PIN),
resolve a colisão sem perder offline-first nem invalidar HU-22.

---

## Próxima implementação — HU-18

**Agente cadastra e gerencia familiares**

Depende de HU-17 mergeada em `develop`.

### O que será criado

- Tela de cadastro de familiar pelo agente (nome, PIN, família vinculada)
- Action `addUser` no `AppContext` (análoga a `addFamily`)
- Listagem de familiares no `FamilyProfileScreen` — seção "Familiares desta família"
- Seed de familiares passa a ser gerenciável via app (HU-18 é o primeiro passo)

### Decisão pendente antes de implementar

- **Onde ficam os familiares no Firestore?** Hoje `users` (agentes + familiares) vivem apenas
  no seed local/AsyncStorage. Na HU-18 o agente cria familiares — eles precisam persistir?
  - Opção A: continua só local (AsyncStorage). Simples, mas familiar só existe no aparelho do agente.
  - Opção B: nova coleção `users` no Firestore. Familiar persiste na nuvem, acessível de qualquer aparelho.
  - **Discutir com o usuário antes de iniciar.**
