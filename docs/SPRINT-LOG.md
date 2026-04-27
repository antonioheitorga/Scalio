# SCALIO — Log de Sprints e Decisões Técnicas
**Última atualização: Abril de 2026**

> Este documento registra o que foi feito em cada sprint, as decisões técnicas tomadas e o motivo por trás delas. Serve como memória do projeto para o time e para qualquer pessoa que entrar depois.

---

## Sprint Atual — Sprint A (Quick Wins da Camada 1)

### O que foi entregue

**HU-20 — Buscar família por nome** ✅
**HU-19 — Marcar problema como resolvido** ✅

---

### HU-20 — Buscar família por nome

Filtro local em tempo real na lista de famílias. Sem internet, sem Firestore — 100% estado local.

#### Arquivos criados/modificados

| Arquivo | O que faz |
|---|---|
| `mobile/src/utils/text.ts` | `normalizeText`: normalização NFD + remoção de diacríticos, reaproveitável em buscas futuras |
| `mobile/src/components/SearchInput.tsx` | Input controlado com botão de limpar, estilo consistente com o resto do app |
| `mobile/src/screens/FamilyListScreen.tsx` | `useMemo` no filtro, stats no topo refletem o total real (não o filtrado), dois estados vazios distintos |

#### Decisões técnicas

- `normalizeText` extraído para `utils/` porque será reaproveitado em HU-10/HU-11 (busca de zonas e subtópicos) e HU-18 (lista de usuários).
- `SearchInput` como componente independente: mesmo visual dos campos de formulário, `hitSlop` generoso para uso com toque impreciso em campo.
- O painel de stats não filtra com a busca — "Problemas ativos: 3" continua sendo o total real, não o dos 2 resultados visíveis. Deliberado: a busca é para localizar, não para filtrar o painel de impacto.

---

### HU-19 — Marcar problema como resolvido

Ação explícita para encerrar um problema ativo. O registro permanece no histórico com status visível e data/nota de resolução.

#### Arquivos criados/modificados

| Arquivo | O que faz |
|---|---|
| `mobile/src/types.ts` | Campos opcionais `problemResolvedAt`, `problemResolutionNotes` em `Visit`; rota `ResolveProblem` em `RootStackParamList` |
| `mobile/src/context/AppContext.tsx` | Ação `resolveProblem(visitId, notes?)`: idempotente, push imediato + fallback no ciclo de 30s |
| `mobile/src/screens/ResolveProblemScreen.tsx` | Tela dedicada com resumo do problema, campo de nota opcional e confirmação |
| `mobile/src/screens/FamilyProfileScreen.tsx` | Seção "Problemas ativos" no topo, com botão "Marcar como resolvido" para cada problema |
| `mobile/src/screens/VisitDetailScreen.tsx` | Pill Ativo/Resolvido + bloco de resolução com data e nota; botão de resolução se ainda ativo |
| `mobile/src/components/VisitCard.tsx` | Pill do status do problema empilhado com o pill de sync; descrição riscada quando resolvido |
| `mobile/App.tsx` | Rota `ResolveProblem` registrada |
| `mobile/src/screens/index.ts` | Export de `ResolveProblemScreen` |
| `firestore.rules` | Validação opcional dos novos campos sem quebrar documentos antigos |

#### Decisões técnicas

- **Spread condicional (não `undefined`)**: o Firestore rejeita campos com valor `undefined`. O campo `problemResolutionNotes` só é incluído no objeto se a nota existir.
- **Idempotência**: `resolveProblem` ignora chamadas duplicadas (visita já resolvida, não-problema, ou inexistente). Sem risco de double-submit.
- **Tela dedicada, não modal**: `Alert.prompt` é iOS-only. Tela mantém o padrão de navegação plana do projeto.
- **`problemResolved` (bool) continua a flag canônica**: `hasActiveProblem` e o pill de "Atenção" continuam funcionando sem nenhuma mudança — qualquer visita com `problemResolved !== true` conta como ativa.
- **Compatibilidade retroativa**: visitas antigas com `problemResolved: true` mas sem `problemResolvedAt` exibem "Resolvido" sem mostrar a data. Não quebram.
- **`firestore.rules`**: usa `!('campo' in request.resource.data) || ...is tipo` — documentos antigos sem os campos são aceitos; campos com tipo errado são rejeitados. Precisa ser publicado manualmente no console Firebase.

---

### Branches

| Branch | Commit | Base |
|---|---|---|
| `feature/HU-20-busca-familia` | `12fdb9c` | `develop` |
| `feature/HU-19-resolver-problema` | `02f06c8` | `develop` |

---

## Sprint Anterior — Backend e Sincronização

### O que foi entregue

**HU-08 — Sincronização com backend real** ✅

O app funcionava completamente offline com AsyncStorage, mas os dados ficavam presos no aparelho. Esta sprint conectou o app a um banco de dados real na nuvem, mantendo o comportamento offline intacto.

---

### Decisões técnicas

#### Por que Firebase e não Supabase?

Avaliamos três opções:

| Opção | Offline | Complexidade | Decisão |
|---|---|---|---|
| Firebase Firestore | Nativa via SDK | Baixa | ✅ Escolhido |
| PowerSync + Supabase | Nativa via camada extra | Alta | ❌ |
| Supabase puro | Manual (a gente implementa) | Alta | ❌ |

O critério decisivo foi o **offline-first**: a Vila Jutaiteua tem conectividade intermitente. O Firebase Firestore resolve isso sem que a gente precise escrever a lógica de sync — o SDK cuida da fila, da retry e da merge. Supabase exigiria construir essa camada do zero.

#### Por que manter o AsyncStorage?

O SDK do Firebase JS (usado no Expo managed workflow) não suporta persistência offline nativa em React Native — isso só existe na versão nativa (`@react-native-firebase`), que exigiria ejetar do Expo. A solução foi manter o AsyncStorage como cache local principal e usar o Firestore como backend de sync. Os dois se complementam:

- **AsyncStorage** → dados disponíveis imediatamente, offline, sem latência
- **Firestore** → dados disponíveis em outros dispositivos, com histórico real

#### Por que Anonymous Auth?

Sem autenticação, as Firestore Rules não conseguem identificar quem está fazendo o request — e sem Rules, o banco fica aberto pra qualquer pessoa que descobrir o `projectId` (que está no bundle do app). A solução foi Firebase Anonymous Auth: o app obtém um UID descartável automaticamente ao abrir, sem que o usuário precise fazer nada. As Rules exigem `request.auth != null`, bloqueando acesso externo.

**Limitação conhecida:** o UID anônimo não tem relação com o PIN do agrônomo. Isso significa que, no servidor, qualquer sessão autenticada pode ler/escrever dados de qualquer agrônomo. Será resolvido em HU-16, quando implementarmos perfis reais com auth por PIN vinculada ao Firebase.

---

### Arquivos criados/modificados

| Arquivo | O que faz |
|---|---|
| `mobile/src/config/firebase.ts` | Inicializa o app Firebase, Auth com persistência e Firestore |
| `mobile/src/services/syncService.ts` | Push/pull de families e visits no Firestore |
| `mobile/src/context/AppContext.tsx` | Sync real: ao login, a cada 30s e após cada mutação |
| `firestore.rules` | Regras de segurança: exige auth + valida formato dos dados |
| `mobile/.env` | Variáveis de ambiente locais (não vai pro git) |
| `mobile/.env.example` | Template para novos devs configurarem o ambiente |

---

### Comportamento do sync

1. **Ao abrir o app:** sign-in anônimo automático no Firebase
2. **Ao fazer login (PIN):** puxa dados do Firestore, mescla com local, empurra pendentes
3. **Ao criar família ou visita:** salva localmente (instantâneo) + tenta push imediato pro Firestore
4. **A cada 30 segundos:** verifica conexão e sincroniza pendentes
5. **Offline:** tudo funciona normalmente pelo AsyncStorage; sync acontece quando a rede voltar

---

### Fix incluído nesta sprint

**Teclado decimal pt-BR no iOS**

O teclado `decimal-pad` no iOS com configuração pt-BR usa vírgula (`,`) como separador decimal, não ponto (`.`). O `Number("2,5")` retorna `NaN`. Corrigido com `.replace(',', '.')` antes da conversão em `AddFamilyScreen` e `VisitFormScreen`.

---

## Próximas Sprints

### Sprint A — Melhorias da Camada 1

Histórias pequenas que melhoram o que já existe. Podem ser feitas em paralelo com a Sprint B.

| HU | Título | Esforço estimado |
|---|---|---|
| **HU-20** | Buscar família por nome | Pequeno — filtro local, sem backend |
| **HU-19** | Marcar problema como resolvido | Médio — nova ação + atualização no Firestore |

**Começar por HU-20:** campo de busca na lista de famílias. Filtro em tempo real, 100% local, sem tocar no Firestore. Boa história pra exercitar o ciclo tela → estado → UI sem risco.

---

### Sprint B — Zonas de Conhecimento (início da Camada 2)

| HU | Título | Dependência |
|---|---|---|
| **HU-10** | Explorar zonas de conhecimento | Nenhuma |
| **HU-11** | Acessar subtópico dentro de uma zona | HU-10 |
| **HU-12** | Criar conteúdo numa zona (agrônomo) | Decisão de formato de conteúdo ⚠️ |

**Bloqueador de HU-12:** o formato do conteúdo (texto, áudio, vídeo curto) ainda não foi definido. Essa decisão depende de pesquisa com a professora consultora. HU-10 e HU-11 podem começar sem essa decisão — são só navegação e leitura.

**Novas coleções no Firestore necessárias:**
- `zones` — as 7 zonas de conhecimento (Solo, Cultivo, Adubação, Pragas, Financeiro, Planejamento, Comercialização)
- `topics` — subtópicos dentro de cada zona, criados pelo agrônomo
- `reports` — relatos práticos de agentes (HU-13, Sprint D)

---

### Sprint C — Múltiplos Perfis de Usuário

| HU | Título | Dependência |
|---|---|---|
| **HU-22** | Recuperação de acesso (PIN esquecido) | Nenhuma — crítico antes de HU-16 |
| **HU-16** | Login e perfil de Agente Comunitário | HU-22 recomendada antes |
| **HU-18** | Cadastrar e gerenciar usuários (agrônomo) | HU-16 |
| **HU-17** | Login e perfil de Agricultor/Família | HU-16 |

**Impacto técnico de HU-16:** exige refatoração do `AppContext` e de `types.ts` para incluir `role: 'agronomo' | 'agente' | 'agricultor'` no tipo `Session`. O sistema de auth atual (`agronomistId` no estado local) precisa ser generalizado. Também é nesta sprint que a auth anônima será substituída por auth real vinculada ao PIN.

---

### Sprint D — Integração Zonas + Campo

| HU | Título | Dependência |
|---|---|---|
| **HU-13** | Relato prático de agente em subtópico | HU-11 + HU-16 |
| **HU-14** | Indicar zona durante visita | HU-11 + HU-16 |

---

### Sprint E — Visibilidade e Exportação

| HU | Título | Dependência |
|---|---|---|
| **HU-15** | Painel de impacto consolidado (agrônomo) | Sprint D concluída |
| **HU-21** | Editar ou excluir registro de visita | Soft delete no Firestore |
| **HU-23** | Exportar histórico de família (PDF) | Avaliar `expo-print` |

---

## Regras de segurança do Firestore — evolução planejada

| Sprint | O que muda nas Rules |
|---|---|
| Atual | `request.auth != null` + validação de formato |
| Sprint C (HU-16) | Associar UID Firebase ao agrônomo — leitura/escrita restrita aos próprios dados |
| Sprint E | Regras de auditoria para soft delete (HU-21) |

---

## Stack técnica atual

| Camada | Tecnologia |
|---|---|
| App mobile | React Native + Expo (managed workflow) |
| Linguagem | TypeScript |
| Navegação | React Navigation |
| Estado global | React Context + useReducer pattern |
| Cache offline | AsyncStorage |
| Banco de dados | Firebase Firestore |
| Autenticação | Firebase Anonymous Auth (temporária) |
| Verificação de rede | expo-network |
| Regras de segurança | Firestore Security Rules (versionadas em `firestore.rules`) |

---

## Convenções do projeto

- **Branches:** `feature/nome-da-historia` → merge em `develop` → merge em `main` só em release
- **Commits:** conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`)
- **Variáveis de ambiente:** prefixo `EXPO_PUBLIC_` para variáveis acessíveis no bundle. Nunca commitar `.env` — usar `.env.example` como template
- **Sync:** toda operação de escrita salva localmente primeiro, tenta Firestore depois. Falha silenciosa — retry no próximo ciclo de 30s
- **IDs:** gerados no cliente via `makeId()` (timestamp + sufixo aleatório) para garantir unicidade offline sem consultar o servidor

---

*SCALIO — Vila Jutaiteua, Pará, 2026*
