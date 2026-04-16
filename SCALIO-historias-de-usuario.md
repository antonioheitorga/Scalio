# SCALIO — Histórias de Usuário (MVP)
**Versão 1.0 — Abril de 2026**

> Este documento define o que o app precisa fazer, do ponto de vista de quem vai usar. Cada história aqui é uma unidade de trabalho para o dev. Nenhuma funcionalidade é construída sem uma história correspondente aprovada neste documento.

---

## Perfis de usuário (atores)

**Agrônomo** — Os 2 engenheiros agrônomos da Vila Jutaiteua. São os únicos usuários do MVP. Usam o app em campo, frequentemente sem internet.

---

## Como ler este documento

Cada história segue o formato:

- **ID** — identificador único da história (ex: HU-01)
- **Título** — nome curto da funcionalidade
- **História** — "Como [ator], eu quero [ação], para que [benefício]"
- **Critérios de aceitação** — condições objetivas que precisam ser verdadeiras para a história ser considerada concluída
- **Status** — Pendente / Em desenvolvimento / Concluída

---

## Módulo 1 — Autenticação

### HU-01 — Acesso ao aplicativo
**Status:** Pendente

**História:**
Como agrônomo, eu quero entrar no app com um código simples, para que eu possa acessar minhas informações rapidamente mesmo em campo.

**Critérios de aceitação:**
- O app apresenta uma tela de entrada com campo de identificação (pode ser um PIN numérico de 4 dígitos ou nome de usuário simples)
- Cada agrônomo tem um acesso próprio — o que um vê não aparece para o outro
- O app permanece logado entre sessões — o agrônomo não precisa se identificar toda vez que abre o app
- Se o app for aberto sem internet, o login ainda funciona com os dados salvos localmente
- Caso o agrônomo esqueça o acesso, existe uma forma de recuperação (a definir com o time)

---

## Módulo 2 — Gestão de Famílias

### HU-02 — Ver lista de famílias acompanhadas
**Status:** Pendente

**História:**
Como agrônomo, eu quero ver a lista das famílias que acompanho, para que eu saiba quem são meus acompanhados e quando visitei cada um pela última vez.

**Critérios de aceitação:**
- A tela inicial após o login exibe a lista de famílias do agrônomo logado
- Cada família na lista mostra: nome da família, cultura principal e data da última visita registrada
- Se uma família não foi visitada há mais de 15 dias, aparece um indicador visual de atenção
- A lista funciona completamente offline
- Famílias de um agrônomo não aparecem na lista do outro

---

### HU-03 — Ver perfil de uma família
**Status:** Pendente

**História:**
Como agrônomo, eu quero acessar o perfil completo de uma família, para que eu possa ver o histórico de tudo que já foi registrado sobre ela antes de fazer uma visita.

**Critérios de aceitação:**
- Ao tocar em uma família na lista, o app abre a tela de perfil dessa família
- O perfil exibe: nome da família, cultura(s) que produz, área aproximada (em hectares) e número de visitas realizadas
- O perfil exibe um resumo dos últimos registros (mínimo: os 3 mais recentes)
- Todas as informações do perfil estão disponíveis offline

---

### HU-04 — Adicionar uma nova família
**Status:** Pendente

**História:**
Como agrônomo, eu quero cadastrar uma nova família no app, para que eu possa começar a registrar as visitas a ela.

**Critérios de aceitação:**
- Existe uma opção visível na lista de famílias para adicionar uma nova
- O formulário de cadastro pede: nome da família, cultura(s) principal(is) e área aproximada
- Todos os campos marcados como obrigatórios precisam ser preenchidos para salvar
- Após salvar, a nova família aparece imediatamente na lista
- O cadastro funciona offline e sincroniza quando houver internet

---

## Módulo 3 — Registro de Visita

### HU-05 — Registrar uma visita de campo
**Status:** Pendente

**História:**
Como agrônomo, eu quero registrar o que aconteceu durante uma visita a uma família, para que esse conhecimento não se perca e possa ser consultado futuramente.

**Critérios de aceitação:**
- A partir do perfil de uma família, existe uma opção clara para registrar nova visita
- O formulário de visita contém: data da visita (preenchida automaticamente com a data atual, editável), tipo de registro (Produção / Venda / Insumo / Problema / Orientação técnica), cultura relacionada, quantidade (quando aplicável), valor (quando aplicável) e campo de observações em texto livre
- Todos os registros são salvos localmente no celular, sem precisar de internet
- Após salvar, o registro aparece imediatamente no histórico da família
- A data da última visita na lista de famílias é atualizada automaticamente

---

### HU-06 — Registrar um problema identificado
**Status:** Pendente

**História:**
Como agrônomo, eu quero registrar um problema que identifiquei na visita, para que eu não esqueça de acompanhar a situação e possa alertar outros se necessário.

**Critérios de aceitação:**
- Ao selecionar o tipo "Problema" no registro de visita, aparece um campo específico para descrever o problema
- O problema registrado aparece com destaque visual no perfil da família (diferente dos outros registros)
- Na lista de famílias, famílias com problema ativo exibem um indicador de alerta
- Um problema permanece ativo até que o agrônomo registre uma visita subsequente marcando-o como resolvido

---

## Módulo 4 — Histórico

### HU-07 — Consultar histórico de visitas de uma família
**Status:** Pendente

**História:**
Como agrônomo, eu quero ver todas as visitas anteriores de uma família em ordem cronológica, para que eu possa entender a evolução da situação dela ao longo do tempo.

**Critérios de aceitação:**
- O perfil da família exibe todos os registros em ordem do mais recente para o mais antigo
- Cada registro exibe: data, tipo, cultura e observações
- O histórico completo está disponível offline
- É possível tocar em um registro para ver os detalhes completos dele

---

## Módulo 5 — Sincronização

### HU-08 — Sincronizar dados quando houver internet
**Status:** Pendente

**História:**
Como agrônomo, eu quero que meus registros feitos offline sejam enviados automaticamente quando o celular tiver internet, para que eu não precise me preocupar com isso durante as visitas.

**Critérios de aceitação:**
- Quando o app detecta conexão com a internet, inicia a sincronização automaticamente em segundo plano
- O agrônomo consegue ver no app se seus dados estão sincronizados ou pendentes
- Se a sincronização falhar, os dados permanecem salvos no celular e uma nova tentativa é feita na próxima vez que houver internet
- Nenhum dado é perdido durante o processo de sincronização
- A sincronização não trava o app — o agrônomo pode continuar usando normalmente enquanto ela acontece

---

## Módulo 6 — Painel de Visão Geral

### HU-09 — Ver resumo geral das atividades
**Status:** Pendente

**História:**
Como agrônomo, eu quero ver um resumo rápido das minhas atividades, para que eu saiba em que estado estão minhas famílias sem precisar entrar no perfil de cada uma.

**Critérios de aceitação:**
- Existe uma tela de painel acessível a partir da navegação principal
- O painel exibe: total de famílias acompanhadas, total de registros feitos no mês atual, famílias sem visita há mais de 15 dias e famílias com problema ativo
- O painel funciona offline com os dados disponíveis localmente
- Os números são atualizados em tempo real conforme novos registros são feitos

---

## Controle de histórias

| ID | Título | Módulo | Status |
|---|---|---|---|
| HU-01 | Acesso ao aplicativo | Autenticação | Pendente |
| HU-02 | Ver lista de famílias | Famílias | Pendente |
| HU-03 | Ver perfil de uma família | Famílias | Pendente |
| HU-04 | Adicionar nova família | Famílias | Pendente |
| HU-05 | Registrar visita de campo | Registro | Pendente |
| HU-06 | Registrar problema identificado | Registro | Pendente |
| HU-07 | Consultar histórico de visitas | Histórico | Pendente |
| HU-08 | Sincronizar dados com internet | Sincronização | Pendente |
| HU-09 | Ver resumo geral das atividades | Painel | Pendente |

---

## Ordem de desenvolvimento sugerida

As histórias devem ser desenvolvidas na seguinte sequência, pois cada uma depende da anterior:

**Sprint 1** — HU-01 + HU-02 + HU-04
O agrônomo consegue entrar no app e ver/adicionar suas famílias.

**Sprint 2** — HU-03 + HU-05
O agrônomo consegue acessar o perfil de uma família e fazer o primeiro registro de visita.

**Sprint 3** — HU-06 + HU-07
Registro de problemas e visualização do histórico completo.

**Sprint 4** — HU-08 + HU-09
Sincronização offline e painel de resumo — app completo e pronto para teste real.

---

*SCALIO — Vila Jutaiteua, Pará*
*Atualizar o status de cada história conforme o desenvolvimento avançar*
