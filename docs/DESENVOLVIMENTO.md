# SCALIO — Desenvolvimento: Estado Atual e Plano de Sprints

**Versão 1.0 — Abril de 2026**

> Este documento registra o que foi construído, as convenções de trabalho adotadas e o plano de sprints para as próximas entregas. É um documento vivo — atualizar a cada sprint concluída.

---

## Estado atual do projeto

### Camada 1 — Acompanhamento de Campo (base)

Implementada antes de Abril/2026. Cobre HU-01 a HU-09 com o perfil de Agrônomo funcionando completamente offline:

- Login por PIN, sessão persistida localmente
- Lista de famílias com indicadores de atenção e problema ativo
- Perfil de família com histórico de visitas
- Cadastro de família e registro de visita/problema
- Painel de resumo (dashboard)
- Armazenamento local com AsyncStorage

### HU-08 — Backend real (Abril/2026)

Concluída em Abril de 2026. Conecta o app ao Firebase Firestore com sincronização offline-first real.

**O que foi feito:**

- **Firebase Firestore** escolhido como banco de dados (offline-first nativo, free tier suficiente, SDK maduro para Expo)
- **`src/config/firebase.ts`** — inicialização com variáveis de ambiente (`EXPO_PUBLIC_*`) e Auth persistente via AsyncStorage
- **`src/services/syncService.ts`** — camada de acesso ao Firestore com `pushFamilies`, `pushVisits`, `fetchFamilies`, `fetchVisits`
- **`AppContext.tsx`** — sync real integrado: ao login, a cada 30s e após cada mutação. Merge bidirecional: remoto complementa local, pendentes vão pro servidor
- **Firebase Anonymous Auth** — sessão anônima automática protegendo todas as operações no Firestore
- **`firestore.rules`** — regras de segurança versionadas no repositório: exige auth, valida formato dos dados, bloqueia delete
- **Fix:** campo de hectares e valores numéricos aceitam vírgula (padrão pt-BR no iOS)

**Coleções no Firestore:**

| Coleção | Descrição |
|---|---|
| `families` | Famílias cadastradas, indexadas por `agronomistId` |
| `visits` | Visitas de campo, indexadas por `agronomistId` e `familyId` |

---

## Convenções de trabalho

### Git

- `main` → produção apenas
- `develop` → integração contínua
- Branches de feature: `feature/nome-da-hu` (ex: `feature/HU-20-busca-familia`)
- Commits em português com prefixo convencional: `feat:`, `fix:`, `refactor:`, `docs:`
- Push após todos os commits da sessão — nunca push intermediário

### Código

- TypeScript estrito — sem `any`, sem campos opcionais desnecessários
- Lógica de negócio fica no `AppContext`
- Acesso ao Firestore fica no `syncService` — telas não tocam em Firebase diretamente
- Telas são burras: só chamam contexto, exibem estado, disparam ações
- Falhas de sync são silenciosas — o app nunca quebra por falta de internet

### Banco de dados

- Toda nova coleção no Firestore precisa de regra correspondente em `firestore.rules`
- `syncStatus` é campo de controle local — nunca vai pro Firestore
- Delete bloqueado no banco até HU-21 implementar soft delete
- Novos campos opcionais não quebram documentos existentes — validar isso nas regras antes de publicar

---

## Plano de sprints

### Sprint A — Quick wins da Camada 1
*Histórias pequenas, sem dependência de backend novo. Boa pra pegar ritmo.*

#### HU-20 — Buscar família por nome
**Status:** ✅ Implementado (Sprint A, Abril/2026)

- Campo de busca na tela de lista, filtragem em tempo real local
- Sem internet, sem backend — puramente estado local
- Sem resultado exibe mensagem clara
- Ao limpar o campo, lista completa volta

**Arquivos envolvidos:** `FamilyListScreen.tsx`, possível novo componente `SearchInput.tsx`

---

#### HU-19 — Marcar problema como resolvido
**Status:** ✅ Implementado (Sprint A, Abril/2026)

- Ação explícita no perfil da família para encerrar problema ativo
- Campo de observação opcional sobre como foi resolvido
- Problema some dos alertas mas permanece no histórico com status "Resolvido" e data de encerramento
- Apenas quem registrou o problema ou um agrônomo pode marcar como resolvido
- Salvo offline, sincroniza quando houver internet

**Arquivos envolvidos:** `FamilyProfileScreen.tsx`, `AppContext.tsx`, `types.ts`, `syncService.ts`

---

### Sprint B — Zonas de Conhecimento (navegação)
*Início da Camada 2. Depende de decisão sobre formato do conteúdo — ver seção de decisões em aberto.*

#### HU-10 — Explorar zonas de conhecimento
**Status:** Pendente

- Nova seção na navegação principal
- 7 zonas temáticas: Solo, Cultivo, Adubação e Insumos, Pragas e Doenças, Financeiro, Planejamento de Safra, Comercialização
- Cada zona exibe nome e descrição curta
- Conteúdo já baixado disponível offline; conteúdo não baixado indica necessidade de internet

**Firestore:** nova coleção `zones`

**Arquivos envolvidos:** `KnowledgeZonesScreen.tsx` (novo), componente `ZoneCard.tsx` (novo), `App.tsx` (navegação), `types.ts`

---

#### HU-11 — Acessar subtópico dentro de uma zona
**Status:** Pendente

- Subtópicos listados dentro de cada zona com título e descrição
- Exibe conteúdo técnico, autor (agrônomo) e data de publicação
- Exibe relatos práticos de agentes que já aplicaram aquele conhecimento
- Usuário pode marcar subtópico como "já apliquei"
- Disponível offline após primeiro acesso com internet

**Firestore:** nova coleção `topics`

**Arquivos envolvidos:** `ZoneDetailScreen.tsx` (novo), `TopicDetailScreen.tsx` (novo), `syncService.ts`, `firestore.rules`

---

#### HU-12 — Criar conteúdo em uma zona (agrônomo)
**Status:** Pendente — bloqueado por decisão de formato

- Agrônomo cria e publica conteúdo dentro de qualquer zona
- Suporte a rascunho antes de publicar
- Conteúdo editável e removível pelo autor
- Associado ao nome do agrônomo

> ⚠️ Bloqueado até decisão sobre formato do conteúdo (texto, áudio, vídeo curto). Ver seção de decisões em aberto.

---

### Sprint C — Novos perfis de usuário
*Maior refatoração do projeto. HU-16 é pré-requisito de tudo nesta sprint.*

#### HU-16 — Login e perfil de Agente Comunitário
**Status:** Pendente

- Novo tipo de usuário com PIN próprio, cadastrado pelo agrônomo
- Agente vê apenas suas famílias, não as do agrônomo
- Agente tem acesso a: lista de famílias, registro de visita, histórico, zonas de conhecimento
- Agente não tem acesso a: criação de conteúdo oficial, painel de impacto consolidado

**Impacto técnico (alto):**
- `types.ts`: adicionar `role: 'agronomo' | 'agente' | 'agricultor'` e `createdBy` ao modelo de usuário
- `AppContext.tsx`: refatorar `Session` e lógica de permissões por role
- Nova coleção `users` no Firestore unificando agrônomos e agentes
- Regras do Firestore endurecem: dados isolados por `userId` real
- `firestore.rules`: atualizar completamente

---

#### HU-18 — Cadastrar e gerenciar usuários
**Status:** Pendente — depende de HU-16

- Tela exclusiva do agrônomo para criar agentes comunitários
- Agrônomo pode desativar acesso sem excluir histórico
- Agrônomo pode redefinir PIN de qualquer usuário que cadastrou
- Sem auto-cadastro

**Arquivos envolvidos:** `UserManagementScreen.tsx` (novo), `AppContext.tsx`, `syncService.ts`

---

#### HU-22 — Recuperação de acesso (PIN esquecido)
**Status:** Pendente

- Opção "Esqueci meu PIN" na tela de login
- Agrônomo redefine PIN de qualquer usuário que cadastrou
- Para o próprio agrônomo: código de recuperação gerado no cadastro
- Fluxo offline para resets locais; resets pelo backend exigem internet

**Arquivos envolvidos:** `LoginScreen.tsx`, `AppContext.tsx`, `syncService.ts`

---

### Sprint D — Contribuição dos agentes

#### HU-17 — Login e perfil de Agricultor/Família
**Status:** Pendente — depende de HU-16

- Interface mais simples e visual que a do agente
- Agricultor vê: subtópicos indicados para ele, histórico de visitas, dados de produção
- Agricultor não registra visitas nem cria conteúdo

---

#### HU-13 — Relato prático em subtópico (agente)
**Status:** Pendente

- Agente registra experiência de campo em um subtópico
- Relato exibe: o que foi aplicado, com qual família, resultado observado e data
- Visualmente diferenciado do conteúdo oficial do agrônomo
- Agrônomo pode remover relato incorreto

**Firestore:** subcoleção `topics/{topicId}/reports`

---

#### HU-14 — Indicar zona durante visita
**Status:** Pendente

- No formulário de visita, opção para vincular um subtópico
- Subtópico aparece no histórico da visita como "conhecimento compartilhado"
- No perfil da família, lista de subtópicos já indicados para ela

**Arquivos envolvidos:** `VisitFormScreen.tsx`, `FamilyProfileScreen.tsx`, `types.ts`

---

### Sprint E — Impacto e relatórios

#### HU-15 — Rastreabilidade de impacto (agrônomo)
**Status:** Pendente

- Painel consolidado: agentes ativos, famílias acompanhadas, zonas mais acessadas, subtópicos com mais relatos
- Famílias que ainda não receberam conteúdo indicado
- Dados atualizados a cada sincronização

---

#### HU-21 — Editar ou excluir registro de visita
**Status:** Pendente

- Edição mantém histórico com log de alteração (`updatedAt`, `updatedBy`)
- Exclusão é soft delete (`deletedAt`) — não some apenas localmente
- Somente o autor ou um agrônomo pode editar
- Registro com mais de 30 dias não pode ser editado

**Impacto técnico:** `types.ts` ganha `updatedAt`, `updatedBy`, `deletedAt` em `Visit`. `appStorage.ts` e `syncService.ts` precisam suportar esses campos. `firestore.rules` atualizado para permitir delete lógico.

---

#### HU-23 — Exportar histórico de família (agrônomo)
**Status:** Pendente — baixa prioridade, Sprint E ou posterior

- Relatório em PDF gerado localmente sem internet
- Inclui: dados da família, visitas por período, problemas e zonas indicadas
- Agrônomo define o período (último mês, 3 meses, desde o início)
- Compartilhamento via share nativo do sistema (WhatsApp, e-mail, etc.)

**Decisão técnica pendente:** avaliar `expo-print` vs `react-native-html-to-pdf` antes de implementar.

---

## Decisões em aberto

| Decisão | Bloqueia | Responsável | Prazo |
|---|---|---|---|
| Formato do conteúdo das zonas (texto, áudio ou vídeo) | HU-12 | Professora consultora + time | Antes do Sprint B |
| Refatoração do sistema de auth para múltiplos roles | HU-16, 17, 18, 22 | Dev | Início do Sprint C |
| Biblioteca de geração de PDF | HU-23 | Dev | Início do Sprint E |

---

## Tabela de controle atualizada

| ID | Título | Sprint | Status |
|---|---|---|---|
| HU-01 | Acesso ao aplicativo | — | ✅ Implementado |
| HU-02 | Ver lista de famílias | — | ✅ Implementado |
| HU-03 | Ver perfil de família | — | ✅ Implementado |
| HU-04 | Cadastrar nova família | — | ✅ Implementado |
| HU-05 | Registrar visita | — | ✅ Implementado |
| HU-06 | Registrar problema | — | ✅ Implementado |
| HU-07 | Consultar histórico | — | ✅ Implementado |
| HU-08 | Sincronizar dados | — | ✅ Implementado |
| HU-09 | Ver painel de resumo | — | ✅ Implementado |
| HU-19 | Marcar problema como resolvido | Sprint A | ✅ Implementado |
| HU-20 | Buscar família por nome | Sprint A | ✅ Implementado |
| HU-10 | Explorar zonas de conhecimento | Sprint B | 🔲 Pendente |
| HU-11 | Acessar subtópico | Sprint B | 🔲 Pendente |
| HU-12 | Criar conteúdo (agrônomo) | Sprint B | ⛔ Bloqueado |
| HU-16 | Login e perfil de Agente Comunitário | Sprint C | 🔲 Pendente |
| HU-18 | Cadastrar e gerenciar usuários | Sprint C | 🔲 Pendente |
| HU-22 | Recuperar acesso ao app | Sprint C | 🔲 Pendente |
| HU-13 | Registrar relato prático | Sprint D | 🔲 Pendente |
| HU-14 | Indicar zona durante visita | Sprint D | 🔲 Pendente |
| HU-17 | Login e perfil de Agricultor/Família | Sprint D | 🔲 Pendente |
| HU-15 | Rastreabilidade de impacto | Sprint E | 🔲 Pendente |
| HU-21 | Editar ou excluir registro de visita | Sprint E | 🔲 Pendente |
| HU-23 | Exportar histórico de família | Sprint E | 🔲 Pendente |

---

*SCALIO — Vila Jutaiteua, Pará, 2026*
