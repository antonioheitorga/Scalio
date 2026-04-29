# Sessão — SCALIO

## Última sessão (Abril/2026) — Sprint B ✅ Concluída

### O que foi entregue

**Refator `agronomista → agente`** — mergeado em develop
Unificação do conceito. `Agronomist→Agent`, `agronomistId→agentId`, `agronomists→agents`
em 7 arquivos. Migration retro-compatível no AsyncStorage. Dual query no Firestore para
docs antigos. `firestore.rules` atualizado.

**HU-22 — Recuperação de PIN** — mergeado em develop
Fluxo "Esqueci meu PIN" offline via código de recuperação. `ForgotPinScreen`,
`resetPinWithRecoveryCode`, link no `LoginScreen`. Fix: comparação case-insensitive +
merge `{ ...seed, ...stored }` para garantir `recoveryCode` em agentes antigos do AsyncStorage.
Códigos do seed: `JOANA7421`, `MARCOS3158`.

**HU-21 — Editar e excluir visita** — mergeado em develop
Soft delete via `deletedAt`. Log de edição (`updatedAt`, `updatedBy`). Janela de 30 dias.
Helper `isVisitVisible` DRY em todos os getters. `VisitFormScreen` reaproveitado em modo
edição. Botões Editar/Excluir no `VisitDetailScreen`. `firestore.rules` atualizado.

**Arquitetura de docs** — simplificada
`CLAUDE.md` (raiz), `context.md` e `sessao.md` substituem os 4 arquivos antigos da pasta `docs/`.

### Estado atual

- Tudo mergeado em `develop` ✅
- `develop` mergeado em `main` ✅
- `firestore.rules` publicado no console Firebase? → **confirmar com usuário**

---

## Próxima implementação — Sprint C

**Tema: Familiar como segundo perfil**

### Decisão pendente antes de implementar

Antes de escrever qualquer código, definir a estrutura de usuários:

**Opção A — Tipo `User` genérico com `role`:**
```ts
type User = { id, name, pin, initials, role: 'agente' | 'familiar', recoveryCode? }
```
Mais escalável. Um único sistema de auth serve para todos os perfis futuros.

**Opção B — Tipos separados `Agent` e `Familiar`:**
Mais simples agora, mais trabalhoso quando vier HU-16 (auth server-side) e HU-18 (gerenciar usuários).

**Recomendação:** Opção A. Afeta toda a estrutura das sprints seguintes — melhor resolver agora.
Discutir com o usuário antes de iniciar.

### HU-17 — Login e perfil de Familiar

O que será criado:
- Tipo `Familiar` (ou `User` com role) em `types.ts`
- Tela de login simplificada para familiar
- Perfil básico do familiar (nome, família vinculada)
- Rota protegida separada da rota do agente no `App.tsx`
- Seed com familiares de teste

### HU-18 — Agente cadastra e gerencia familiares

Depende de HU-17 mergeada. O que será criado:
- Tela de cadastro de familiar pelo agente
- Vinculação familiar↔família em `types.ts` e `AppContext`
- Listagem de familiares no `FamilyProfileScreen`
