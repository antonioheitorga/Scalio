# Contexto do Projeto SCALIO

## O que é

App mobile offline-first para acompanhamento agrícola em comunidades rurais (Vila Jutaiteua, Pará).
Propósito social: conectar agentes educadores a famílias agricultoras em região com conectividade
intermitente. Desenvolvido por um dev solo.

O agente (educador técnico / agrônomo) usa o app para registrar visitas de campo, acompanhar
famílias, detectar problemas e gerar histórico de produção. O familiar é o segundo perfil
previsto para sprints futuras.

## Perfil do usuário

Dev solo, confortável com git/branches/Expo. Quer que Claude tome decisões técnicas e explique
o raciocínio — não apenas escreva código. Prioriza código otimizado, escalável e seguro.
Aprecia resumos detalhados de decisões ao final de cada sprint.

## Stack

| Camada | Tecnologia |
|---|---|
| Mobile | React Native + Expo (managed workflow) |
| Linguagem | TypeScript estrito |
| Navegação | React Navigation (native stack) |
| Estado | React Context + useReducer pattern |
| Cache local | AsyncStorage |
| Banco remoto | Firebase Firestore |
| Auth | Firebase Anonymous Auth |
| Rede | expo-network |

## Arquitetura de pastas relevante

```
mobile/src/
  context/AppContext.tsx   — estado global, ações, regras de negócio
  services/syncService.ts  — acesso ao Firestore (fetch + push)
  storage/appStorage.ts    — AsyncStorage (hidratação + persistência)
  data/seed.ts             — estado inicial e dados de teste
  screens/                 — telas (burras: só chamam contexto)
  components/              — componentes reutilizáveis
  utils/                   — format, date, ids, text
  types.ts                 — tipos TypeScript centralizados
firestore.rules             — regras de segurança do Firestore
```

## Utilitários relevantes

- `utils/text.normalizeText` — busca insensível a caixa e diacríticos (pt-BR)
- `utils/ids.makeId` — geração de ID offline-safe
- `utils/date.isOlderThanDays`, `startOfCurrentMonth` — lógica de datas
- `utils/format.formatDate`, `formatCurrency`, `formatQuantity` — formatação de exibição
- `components/SearchInput` — input de busca reutilizável
- `components/StatusPill` — pill de status com tones ok/warn/alert

## Modelo de dados principal

**Agent** — educador técnico (agente == agrônomo). Vive apenas no seed local (AsyncStorage).
Campos: `id`, `name`, `pin`, `initials`, `recoveryCode?`

**Family** — família agricultora acompanhada pelo agente.
Campos: `id`, `agentId`, `name`, `cultures[]`, `areaHectares`, `createdAt`

**Visit** — registro de visita de campo.
Campos: `id`, `familyId`, `agentId`, `date`, `type`, `culture`, `quantity?`, `value?`,
`notes`, `problemDescription?`, `problemResolved?`, `problemResolvedAt?`,
`problemResolutionNotes?`, `updatedAt?`, `updatedBy?`, `deletedAt?`, `syncStatus`

Tipos de visita: `Producao | Venda | Insumo | Problema | OrientacaoTecnica`

## Fluxo git

- `main` → produção apenas
- `develop` → integração contínua
- `feature/HU-XX-nome` → uma branch por HU, sempre a partir de `develop`
- Commits em pt-BR com prefixo: `feat:`, `fix:`, `refactor:`, `docs:`
- Docs e resumos de sprint: commitar no `develop`, nunca em branch de feature
- Não dar push sem autorização explícita do usuário

## Padrões de código

- Lógica de negócio fica no `AppContext` — telas são "burras"
- Acesso ao Firestore fica no `syncService` — telas não tocam Firebase
- Sync offline-first: salvar local primeiro, tentar Firestore depois, falha silenciosa
- Campos opcionais: usar spread condicional, nunca `undefined` explícito (Firestore rejeita)
- Toda nova coleção Firestore precisa de regra em `firestore.rules`
- `firestore.rules` precisa ser publicado manualmente no console Firebase após cada mudança
- `syncStatus` é controle local — nunca vai para o Firestore
- TypeScript estrito — sem `any`, sem campos opcionais desnecessários

## Decisões de arquitetura consolidadas

- **Offline-first:** salvar local (AsyncStorage) sempre. Tentar Firestore depois. Falha silenciosa.
- **Soft delete:** visitas não são deletadas — recebem `deletedAt`. Helper `isVisitVisible` filtra em todos os getters.
- **Sync retro-compatível:** dual query Firestore (`agentId` + `agronomistId`) para docs antigos. Migration no `migrateLegacyState` do AsyncStorage.
- **Merge seed↔AsyncStorage:** ao hidratar agentes, base é o seed (fonte da verdade estrutural), AsyncStorage sobrescreve estado mutável (PIN). Garante campos novos do seed em dados antigos.
- **IDs no cliente:** `makeId()` — timestamp + sufixo aleatório. Funciona offline.
- **Janela de edição:** 30 dias (`EDIT_WINDOW_DAYS`). Só no cliente por ora. Servidor fica como TODO HU-21+.
- **Campos opcionais no Firestore:** spread condicional — nunca `undefined` explícito.

## Roadmap

| Sprint | HU | Conteúdo | Status |
|---|---|---|---|
| A | HU-19 | Resolver problema | ✅ |
| A | HU-20 | Busca de família | ✅ |
| B | Refator | agronomista → agente | ✅ |
| B | HU-21 | Editar/excluir visita | ✅ |
| B | HU-22 | Recuperação de PIN | ✅ |
| C | HU-17 | Login e perfil de Familiar | 🔜 |
| C | HU-18 | Agente cadastra familiares | 🔜 |
| — | HU-NEW | Recomendação agente→familiar | 🔜 |
| — | HU-NEW | Feedback familiar | 🔜 |
| — | HU-NEW | Avaliação do familiar | 🔜 |
| — | HU-15 | Painel de impacto | 🔜 |
| — | HU-10~14 | Zonas de Conhecimento | ⏸ aguarda formato de conteúdo |
| — | HU-23 | Exportar histórico PDF | ⏸ última |

## Decisões técnicas históricas

**Por que Firebase Firestore e não Supabase:**
Firebase foi escolhido pelo offline-first nativo via SDK — o SDK cuida da fila, retry e merge sem código extra. Supabase exigiria construir essa camada do zero. PowerSync+Supabase tem offline nativo mas complexidade alta. Critério decisivo: Vila Jutaiteua tem conectividade intermitente.

**Por que manter AsyncStorage junto com Firestore:**
O SDK Firebase JS (usado no Expo managed workflow) não suporta persistência offline nativa em React Native — isso só existe na versão nativa (`@react-native-firebase`), que exigiria ejetar do Expo. AsyncStorage = cache local imediato. Firestore = sync entre dispositivos. Os dois se complementam.

**Limitação conhecida do Anonymous Auth:**
O UID anônimo não tem relação com o PIN do agente. Qualquer sessão autenticada pode ler/escrever dados de qualquer agente no servidor. Será resolvido quando implementarmos auth real vinculada ao PIN (HU-16).

## Zonas de Conhecimento (Camada 2 — futura)

7 zonas temáticas exploratórias — o usuário entra pelo que tem necessidade, sem ordem imposta. Conteúdo criado pelos agrônomos, validado pelos agentes, consumido pelas famílias.

| Zona | Foco |
|---|---|
| 1 — Solo | Análise, tipos, correção de pH — base de qualquer produção |
| 2 — Cultivo | Ciclos e manejo das 4 culturas da Vila (açaí, mandioca, pimenta, cacau) |
| 3 — Adubação e Insumos | Uso correto de insumos, dosagem, alternativas orgânicas |
| 4 — Pragas e Doenças | Identificação, controle integrado, protocolo de acionamento do agrônomo |
| 5 — Financeiro e Precificação | Custo de produção, preço mínimo, margem, negociação |
| 6 — Planejamento de Safra | Calendário agrícola, estimativa de produção, diversificação |
| 7 — Comercialização | Canais de venda, cooperativas, mercados formais, negociação |

**Hierarquia:** Zona → Subtópico → Conteúdo → Relato prático (contribuição do agente)

**Decisão em aberto:** formato do conteúdo (texto, áudio ou vídeo curto) — aguarda pesquisa com professora consultora. Bloqueia HU-12 (criação de conteúdo). HU-10 e HU-11 (navegação) podem avançar sem essa decisão.

**Firestore:** novas coleções `zones`, `topics`, `reports` quando implementar.

## Débitos técnicos documentados

**PIN por SMS (HU-22 futura):**
O fluxo atual usa código fixo no seed. Quando houver backend real:
- Remover picker de agente — tela individual por usuário
- Código enviado por SMS/WhatsApp no momento da solicitação
- Atender também o familiar (HU-17+)
- Pré-requisito: HU-16 (auth server-side) ou decisão de infra de SMS

**Regra de 30 dias no servidor (HU-21+):**
Hoje só validada no cliente. Quando vier multi-role (HU-16), endurecer no Firestore Rules.
