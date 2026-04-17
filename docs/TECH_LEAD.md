# SCALIO — Histórias de Usuário (MVP)
**Versão 2.1 — Abril de 2026**

> Este documento define o que o app precisa fazer, do ponto de vista de quem vai usar. Cada história é uma unidade de trabalho para o dev. Nenhuma funcionalidade é construída sem uma história aprovada aqui.

---

## Perfis de usuário

O SCALIO tem três perfis com papéis distintos dentro da plataforma:

**Agrônomo** — Fonte técnica autorizada. Registra visitas de campo, acompanha famílias e é o único que cria e publica conteúdo oficial nas zonas de conhecimento. Usuários iniciais: os 2 engenheiros agrônomos da Vila Jutaiteua. **Único perfil implementado no código atualmente.**

**Agente Comunitário** — Liderança indicada pela comunidade e formada pelos agrônomos. Acompanha 1 a 7 famílias vizinhas, explora as zonas de conhecimento e registra relatos práticos do que aplicou em campo. **Não implementado ainda.**

**Agricultor / Família** — Acessa conteúdo das zonas de forma simplificada. Pode ser acompanhado por um agente ou explorar o app por conta própria. **Não implementado ainda.**

---

## Estrutura do documento

O app tem **duas camadas**. As histórias estão organizadas por camada:

**Camada 1 — Acompanhamento de campo:** o trabalho de registro e visitas. Já parcialmente implementado.

**Camada 2 — Zonas de conhecimento:** a multiplicação do saber técnico. Ainda não implementado.

---

## Camada 1 — Acompanhamento de Campo

### HU-01 — Acesso ao aplicativo (Agrônomo)
**Perfil:** Agrônomo
**Status:** Implementado

**História:**
Como agrônomo, eu quero entrar no app com um PIN de 4 dígitos, para que eu possa acessar minhas informações rapidamente mesmo em campo.

**O que está implementado:**
- Tela de login com PIN numérico de 4 dígitos
- Dois agrônomos cadastrados via seed: Joana Silva (PIN 1234) e Marcos Pereira (PIN 5678)
- Sessão persistida localmente — o agrônomo não precisa se identificar toda vez
- Cada agrônomo vê apenas suas próprias famílias
- Login funciona completamente offline
- Recuperação de acesso: reset manual pelo time (fora do app por enquanto)

**O que ainda NÃO existe:**
- Perfil de Agente Comunitário
- Perfil de Agricultor / Família
- Diferenciação de telas por perfil
- Cadastro de novos usuários dentro do app

---

### HU-02 — Ver lista de famílias acompanhadas
**Perfil:** Agrônomo, Agente Comunitário
**Status:** Implementado

**História:**
Como agrônomo ou agente, eu quero ver a lista das famílias que acompanho, para que eu saiba quem são meus acompanhados e quando visitei cada um pela última vez.

**Critérios de aceitação:**
- A tela exibe apenas as famílias do usuário logado
- Cada família mostra: nome, cultura principal e data da última visita
- Famílias sem visita há mais de 15 dias exibem indicador visual de atenção
- Famílias com problema ativo exibem indicador de alerta
- Funciona completamente offline

---

### HU-03 — Ver perfil de uma família
**Perfil:** Agrônomo, Agente Comunitário
**Status:** Implementado

**História:**
Como agrônomo ou agente, eu quero acessar o perfil completo de uma família, para que eu possa ver o histórico de tudo que foi registrado antes de fazer uma visita.

**Critérios de aceitação:**
- O perfil exibe: nome, cultura(s), área aproximada em hectares e número de visitas realizadas
- Exibe resumo dos últimos 3 registros
- Disponível offline

---

### HU-04 — Cadastrar nova família
**Perfil:** Agrônomo, Agente Comunitário
**Status:** Implementado

**História:**
Como agrônomo ou agente, eu quero cadastrar uma nova família, para que eu possa começar a registrar as visitas a ela.

**Critérios de aceitação:**
- Formulário pede: nome da família, cultura(s) e área aproximada
- Campos obrigatórios precisam estar preenchidos para salvar
- A família aparece imediatamente na lista após o cadastro
- Funciona offline e sincroniza quando houver internet

---

### HU-05 — Registrar uma visita de campo
**Perfil:** Agrônomo, Agente Comunitário
**Status:** Implementado

**História:**
Como agrônomo ou agente, eu quero registrar o que aconteceu em uma visita, para que esse conhecimento não se perca e possa ser consultado futuramente.

**Critérios de aceitação:**
- A partir do perfil da família, existe opção clara para novo registro
- O formulário contém: data (preenchida automaticamente, editável), tipo (Produção / Venda / Insumo / Problema / Orientação técnica), cultura relacionada, quantidade, valor e observações em texto livre
- Salvo localmente sem internet
- Aparece imediatamente no histórico da família
- Data da última visita atualizada automaticamente

---

### HU-06 — Registrar problema identificado
**Perfil:** Agrônomo, Agente Comunitário
**Status:** Implementado

**História:**
Como agrônomo ou agente, eu quero registrar um problema que identifiquei em campo, para que eu não esqueça de acompanhar e possa alertar outros se necessário.

**Critérios de aceitação:**
- Ao selecionar tipo "Problema", aparece campo específico para descrever
- O problema aparece com destaque visual no perfil da família
- Na lista de famílias, famílias com problema ativo exibem alerta
- O problema permanece ativo até que uma visita subsequente o marque como resolvido

---

### HU-07 — Consultar histórico de visitas
**Perfil:** Agrônomo, Agente Comunitário
**Status:** Implementado

**História:**
Como agrônomo ou agente, eu quero ver todas as visitas anteriores de uma família em ordem cronológica, para entender a evolução da situação ao longo do tempo.

**Critérios de aceitação:**
- Registros exibidos do mais recente para o mais antigo
- Cada registro exibe: data, tipo, cultura e observações
- Disponível offline
- Possível tocar em um registro para ver os detalhes completos

---

### HU-08 — Sincronizar dados quando houver internet
**Perfil:** Todos
**Status:** Parcialmente implementado (simulação local — backend pendente)

**História:**
Como usuário do SCALIO, eu quero que meus registros feitos offline sejam enviados automaticamente quando houver internet, para que eu não precise me preocupar com isso durante as visitas.

**Critérios de aceitação:**
- Sincronização automática em segundo plano ao detectar conexão
- O app indica se os dados estão sincronizados ou pendentes
- Falha na sincronização não apaga os dados locais — nova tentativa na próxima conexão
- Nenhum dado é perdido no processo
- O app permanece utilizável durante a sincronização

---

### HU-09 — Ver painel de resumo
**Perfil:** Agrônomo, Agente Comunitário
**Status:** Implementado

**História:**
Como agrônomo ou agente, eu quero ver um resumo rápido das minhas atividades, para que eu saiba o estado geral das minhas famílias sem entrar no perfil de cada uma.

**Critérios de aceitação:**
- Painel exibe: total de famílias, registros do mês atual, famílias sem visita há mais de 15 dias e famílias com problema ativo
- Funciona offline com dados locais
- Atualizado em tempo real conforme novos registros são feitos

---

## Camada 2 — Zonas de Conhecimento

### HU-10 — Explorar zonas de conhecimento
**Perfil:** Agrônomo, Agente Comunitário, Agricultor
**Status:** Pendente

**História:**
Como usuário do SCALIO, eu quero navegar pelas zonas de conhecimento disponíveis, para que eu possa encontrar rapidamente o que preciso aprender sem seguir uma ordem imposta.

**Critérios de aceitação:**
- Existe uma seção dedicada de zonas de conhecimento acessível pela navegação principal
- As zonas são exibidas como áreas temáticas (Solo, Cultivo, Adubação, Pragas, Financeiro, Planejamento, Comercialização)
- Cada zona exibe seu nome e uma descrição curta do que contém
- O usuário pode entrar em qualquer zona diretamente, sem pré-requisito
- Todo o conteúdo já baixado está disponível offline
- O que ainda não foi baixado indica que precisa de internet para o primeiro acesso

---

### HU-11 — Acessar subtópico dentro de uma zona
**Perfil:** Agrônomo, Agente Comunitário, Agricultor
**Status:** Pendente

**História:**
Como usuário do SCALIO, eu quero acessar um subtópico específico dentro de uma zona, para que eu possa ler ou ouvir o conteúdo técnico relevante para minha situação atual.

**Critérios de aceitação:**
- Dentro de cada zona, os subtópicos são listados com título e descrição curta
- Ao abrir um subtópico, o conteúdo técnico criado pelo agrônomo é exibido
- O conteúdo é específico para a realidade da Vila Jutaiteua — não genérico
- O subtópico indica quem criou o conteúdo e quando foi publicado
- O subtópico exibe os relatos práticos de agentes que já aplicaram aquele conhecimento em campo
- O usuário pode marcar um subtópico como "já apliquei" para referência futura
- Disponível offline após o primeiro acesso com internet

---

### HU-12 — Criar conteúdo em uma zona (agrônomo)
**Perfil:** Agrônomo
**Status:** Pendente

**História:**
Como agrônomo, eu quero criar e publicar conteúdo dentro de uma zona de conhecimento, para que agentes e agricultores tenham acesso ao conhecimento técnico específico da Vila.

**Critérios de aceitação:**
- O agrônomo tem acesso a uma opção de criação de conteúdo dentro de qualquer zona
- O formulário de criação pede: zona, título do subtópico, conteúdo (formato a definir após pesquisa com professora) e cultura relacionada (opcional)
- O conteúdo só fica visível para outros usuários após o agrônomo publicar explicitamente
- É possível salvar como rascunho antes de publicar
- O agrônomo pode editar ou remover um conteúdo que publicou
- O conteúdo publicado fica associado ao nome do agrônomo que criou

---

### HU-13 — Registrar relato prático em um subtópico (agente)
**Perfil:** Agente Comunitário
**Status:** Pendente

**História:**
Como agente comunitário, eu quero registrar o que aconteceu quando apliquei um conhecimento em campo, para que outros agentes e agricultores aprendam com a experiência real da Vila.

**Critérios de aceitação:**
- Dentro de qualquer subtópico, existe opção para o agente adicionar um relato prático
- O relato pede: o que foi aplicado, com qual família, o resultado observado e quando aconteceu
- O relato aparece no subtópico como contribuição do agente, visualmente diferenciado do conteúdo oficial do agrônomo
- O relato fica associado ao nome do agente que registrou
- O agrônomo pode remover um relato se o conteúdo for incorreto ou prejudicial
- O relato é salvo offline e sincronizado quando houver internet

---

### HU-14 — Indicar zona de conhecimento para uma família durante visita
**Perfil:** Agrônomo, Agente Comunitário
**Status:** Pendente

**História:**
Como agrônomo ou agente, eu quero indicar um subtópico de conhecimento durante o registro de uma visita, para que fique registrado o que foi ensinado naquela ocasião e a família possa acessar depois.

**Critérios de aceitação:**
- No formulário de registro de visita, existe opção para vincular um subtópico de uma zona
- Ao vincular, o subtópico aparece no histórico da visita como "conhecimento compartilhado"
- No perfil da família, é possível ver quais subtópicos já foram indicados para ela
- A família, ao acessar o app com seu perfil, vê os subtópicos que foram indicados para ela em destaque

---

### HU-15 — Ver rastreabilidade de impacto (agrônomo)
**Perfil:** Agrônomo
**Status:** Pendente

**História:**
Como agrônomo, eu quero ver dados consolidados sobre o uso das zonas de conhecimento, para que eu possa entender quais conteúdos estão sendo mais acessados e onde o conhecimento ainda não chegou.

**Critérios de aceitação:**
- Existe uma tela de impacto acessível pelo perfil do agrônomo
- Exibe: total de agentes ativos, total de famílias acompanhadas, zonas mais acessadas e subtópicos com mais relatos práticos registrados
- Exibe famílias que ainda não receberam nenhum conteúdo indicado
- Dados atualizados a cada sincronização

---

---

### HU-16 — Login e perfil de Agente Comunitário
**Perfil:** Agente Comunitário
**Status:** Pendente

**História:**
Como agente comunitário, eu quero entrar no app com meu próprio acesso, para que eu possa ver apenas as famílias que acompanho e as funcionalidades do meu perfil.

**Critérios de aceitação:**
- O sistema suporta um novo tipo de usuário: Agente Comunitário
- O agente entra com PIN próprio, assim como o agrônomo
- O agente é cadastrado no sistema pelo agrônomo — não há auto-cadastro
- Após o login, o agente vê sua própria lista de famílias (não as do agrônomo)
- O agente tem acesso a: lista de famílias, registro de visita, histórico e zonas de conhecimento
- O agente não tem acesso a: criação de conteúdo oficial nas zonas, painel de impacto consolidado
- O sistema de autenticação atual (baseado em `agronomistId`) precisa ser refatorado para suportar múltiplos tipos de usuário

**Dependência técnica:** requer refatoração do `AppContext` e do tipo `Session` em `types.ts` para incluir o papel do usuário (`role: 'agronomo' | 'agente' | 'agricultor'`).

---

### HU-17 — Login e perfil de Agricultor / Família
**Perfil:** Agricultor / Família
**Status:** Pendente

**História:**
Como agricultor, eu quero entrar no app com meu próprio acesso, para que eu possa ver o conteúdo que foi indicado para mim e acompanhar minha produção registrada.

**Critérios de aceitação:**
- O sistema suporta um novo tipo de usuário: Agricultor / Família
- O agricultor é cadastrado no sistema pelo agente ou agrônomo que o acompanha
- Após o login, o agricultor vê: subtópicos de zonas que foram indicados para ele, histórico de visitas que o agente registrou sobre ele e seus dados de produção
- O agricultor não tem acesso a: registro de visitas, cadastro de famílias, criação de conteúdo ou painel de impacto
- A interface para o agricultor é mais simples e visual do que a do agente ou agrônomo

**Dependência técnica:** depende de HU-16 estar concluída primeiro.

---

### HU-18 — Cadastrar e gerenciar usuários do sistema
**Perfil:** Agrônomo
**Status:** Pendente

**História:**
Como agrônomo, eu quero cadastrar novos usuários (agentes comunitários e outros agrônomos) e gerenciar seus acessos, para que eu possa incluir quem vai usar o app sem depender do time técnico.

**Critérios de aceitação:**
- Existe uma tela de gerenciamento de usuários acessível somente pelo perfil de Agrônomo
- O agrônomo pode cadastrar um novo Agente Comunitário informando: nome, comunidade/bairro e PIN inicial
- O agrônomo pode desativar o acesso de um agente sem excluir seus dados históricos
- O agrônomo pode redefinir o PIN de qualquer usuário que ele tenha cadastrado
- Não existe auto-cadastro — todo usuário precisa ser criado por um agrônomo
- O novo usuário é visível no app imediatamente após ser cadastrado (offline-first)

**Dependência técnica:** requer que HU-16 (perfil de Agente) esteja implementada primeiro. O modelo de usuário em `types.ts` precisa suportar `role` e `createdBy` (agronomistId que cadastrou).

---

### HU-19 — Marcar problema como resolvido
**Perfil:** Agrônomo, Agente Comunitário
**Status:** Pendente

**História:**
Como agrônomo ou agente, eu quero marcar explicitamente que um problema identificado foi resolvido, para que o alerta suma da lista e o histórico registre quando e como o problema foi encerrado.

**Critérios de aceitação:**
- No perfil da família, problemas ativos têm uma ação visível para "Marcar como resolvido"
- Ao marcar como resolvido, o sistema pede uma observação breve (opcional) sobre como foi resolvido
- O problema some dos alertas ativos mas permanece visível no histórico com status "Resolvido" e a data de encerramento
- A flag de "problema ativo" na lista de famílias some imediatamente após a resolução
- A ação é salva offline e sincronizada quando houver internet
- Apenas quem registrou o problema ou um agrônomo pode marcá-lo como resolvido

**Nota:** Atualmente HU-06 menciona que "uma visita subsequente o marque como resolvido" — isso é ambíguo e cria risco de problemas nunca serem encerrados formalmente. Esta história define o comportamento explícito.

---

### HU-20 — Buscar família por nome
**Perfil:** Agrônomo, Agente Comunitário
**Status:** Pendente

**História:**
Como agrônomo ou agente, eu quero buscar uma família pelo nome, para que eu possa encontrá-la rapidamente quando a lista crescer sem precisar rolar tela abaixo.

**Critérios de aceitação:**
- Existe um campo de busca na tela de lista de famílias
- A busca filtra em tempo real conforme o usuário digita
- A busca é feita localmente, sem necessidade de internet
- Sem resultado exibe mensagem clara ("Nenhuma família encontrada com esse nome")
- Ao limpar o campo, a lista completa volta a ser exibida

---

### HU-21 — Editar ou excluir um registro de visita
**Perfil:** Agrônomo, Agente Comunitário
**Status:** Pendente

**História:**
Como agrônomo ou agente, eu quero poder editar ou excluir um registro que criei, para corrigir erros de digitação ou remover um registro feito por engano.

**Critérios de aceitação:**
- No detalhe de um registro, existe opção para editar e outra para excluir
- Apenas o usuário que criou o registro pode editá-lo ou excluí-lo; agrônomos podem editar registros de agentes sob sua supervisão
- A edição mantém o histórico original com log de alteração (quem editou, quando, o que mudou)
- A exclusão pede confirmação antes de executar
- Registros já sincronizados com o backend marcam a exclusão para sincronizar — não somem apenas localmente
- Um registro não pode ser editado se estiver há mais de 30 dias (regra de integridade de dados — pode ser ajustada)

**Dependência técnica:** o modelo de `Visit` em `types.ts` precisa incluir campos `updatedAt`, `updatedBy` e `deletedAt` (soft delete). A camada de storage em `appStorage.ts` precisa suportar esses campos.

---

### HU-22 — Recuperar acesso ao app (PIN esquecido ou trocado)
**Perfil:** Todos
**Status:** Pendente

**História:**
Como usuário que esqueceu meu PIN, eu quero ter uma forma de recuperar meu acesso sem precisar acionar o time técnico, para que eu não fique bloqueado no meio de uma visita de campo.

**Critérios de aceitação:**
- Na tela de login, existe uma opção "Esqueci meu PIN"
- O fluxo de recuperação permite que um agrônomo redefina o PIN de qualquer usuário que ele tenha cadastrado (fluxo admin)
- Para o próprio agrônomo, a recuperação é feita por um código de recuperação gerado no momento do cadastro (salvo offline e no backend)
- O fluxo funciona offline para resets locais; resets que dependem do backend exigem internet
- Após o reset, o usuário é orientado a criar um novo PIN de sua escolha

**Nota:** Atualmente isso é "reset manual pelo time" — inaceitável para usuários em campo sem acesso ao time. Esta história elimina o gargalo.

---

### HU-23 — Exportar histórico de uma família
**Perfil:** Agrônomo
**Status:** Pendente

**História:**
Como agrônomo, eu quero exportar o histórico completo de uma família em formato de relatório, para que eu possa compartilhar com parceiros, ONGs ou órgãos governamentais como evidência de acompanhamento.

**Critérios de aceitação:**
- No perfil de uma família, existe opção para gerar um relatório
- O relatório inclui: dados da família, número de visitas, registros de produção por período, problemas identificados e resolvidos, e zonas de conhecimento indicadas
- O relatório é gerado localmente (sem precisar de internet) como arquivo compartilhável (PDF ou texto formatado)
- O agrônomo pode definir o período do relatório (último mês, últimos 3 meses, desde o início)
- O arquivo pode ser compartilhado via qualquer app de mensagens instalado no celular (share nativo do sistema)

**Dependência técnica:** avaliar biblioteca de geração de PDF no React Native (react-native-html-to-pdf ou expo-print). Decisão de biblioteca precisa considerar suporte offline e tamanho do bundle.

---

## Tabela de controle

| ID | Título | Camada | Perfil | Status |
|---|---|---|---|---|
| HU-01 | Acesso ao aplicativo | Campo | Agrônomo | ✅ Implementado |
| HU-02 | Ver lista de famílias | Campo | Agrônomo | ✅ Implementado |
| HU-03 | Ver perfil de família | Campo | Agrônomo | ✅ Implementado |
| HU-04 | Cadastrar nova família | Campo | Agrônomo | ✅ Implementado |
| HU-05 | Registrar visita | Campo | Agrônomo | ✅ Implementado |
| HU-06 | Registrar problema | Campo | Agrônomo | ✅ Implementado |
| HU-07 | Consultar histórico | Campo | Agrônomo | ✅ Implementado |
| HU-08 | Sincronizar dados | Campo | Agrônomo | ⚠️ Parcial (sem backend) |
| HU-09 | Ver painel de resumo | Campo | Agrônomo | ✅ Implementado |
| HU-10 | Explorar zonas de conhecimento | Conhecimento | Todos | 🔲 Pendente |
| HU-11 | Acessar subtópico | Conhecimento | Todos | 🔲 Pendente |
| HU-12 | Criar conteúdo (agrônomo) | Conhecimento | Agrônomo | 🔲 Pendente |
| HU-13 | Registrar relato prático | Conhecimento | Agente | 🔲 Pendente |
| HU-14 | Indicar zona durante visita | Conhecimento | Agrônomo, Agente | 🔲 Pendente |
| HU-15 | Rastreabilidade de impacto | Conhecimento | Agrônomo | 🔲 Pendente |
| HU-16 | Login e perfil de Agente Comunitário | Campo | Agente | 🔲 Pendente |
| HU-17 | Login e perfil de Agricultor/Família | Campo | Agricultor | 🔲 Pendente |
| HU-18 | Cadastrar e gerenciar usuários | Campo | Agrônomo | 🔲 Pendente |
| HU-19 | Marcar problema como resolvido | Campo | Agrônomo, Agente | 🔲 Pendente |
| HU-20 | Buscar família por nome | Campo | Agrônomo, Agente | 🔲 Pendente |
| HU-21 | Editar ou excluir registro de visita | Campo | Agrônomo, Agente | 🔲 Pendente |
| HU-22 | Recuperar acesso ao app | Campo | Todos | 🔲 Pendente |
| HU-23 | Exportar histórico de família | Campo | Agrônomo | 🔲 Pendente |

---

## Ordem de desenvolvimento sugerida

**Estado atual real:** A Camada 1 está implementada para o perfil de Agrônomo. Dois agrônomos existem via seed. Nenhum outro perfil existe no código.

**Prioridade imediata — HU-08:** Conectar a sincronização ao backend real (Supabase). Hoje a sync é uma simulação local. Sem backend, nenhum dado sai do celular e não há rastreabilidade de impacto real.

**Depois do backend — Camada 2, Sprint A:** HU-10 + HU-11 — as zonas de conhecimento existem no app e o agrônomo consegue navegar e ler o conteúdo.

**Sprint B:** HU-12 — o agrônomo consegue criar e publicar conteúdo dentro das zonas. Depende da decisão sobre formato de conteúdo (pesquisa com professora).

**Sprint C:** HU-16 + HU-17 — criar os perfis de Agente Comunitário e Agricultor, com login próprio e telas adequadas a cada perfil. Isso exige refatorar o sistema de autenticação atual para suportar múltiplos tipos de usuário.

**Sprint D:** HU-13 + HU-14 — o agente contribui com relatos e vincula zonas às visitas.

**Sprint E:** HU-15 — painel de impacto consolidado para o agrônomo.

**Melhorias Camada 1 (paralelizável com Sprints A–E):**
HU-19 (marcar problema resolvido) e HU-20 (busca de família) são pequenas e podem entrar em qualquer sprint com capacidade disponível. HU-21 (edição de registro) requer cuidado no backend (soft delete). HU-22 (recuperação de PIN) é crítica para adoção pelos agentes — entrar antes ou junto com Sprint C. HU-23 (exportar histórico) é baixa prioridade para MVP mas importante para evidência de impacto — Sprint E ou posterior.

---

## Decisão em aberto que bloqueia HU-10 a HU-13

O **formato do conteúdo** (texto, áudio, vídeo curto) ainda não foi definido. Essa decisão sai da pesquisa com a professora consultora. Ela não bloqueia o mapeamento das zonas nem a navegação (HU-10), mas bloqueia a criação de conteúdo (HU-12) porque o dev precisa saber o que vai renderizar.

Prazo para essa decisão: antes do início do Sprint B.

---

*SCALIO — Vila Jutaiteua, Pará, 2026*
*Versão 2.2 — Adicionadas HU-18 a HU-23: gerenciamento de usuários, resolução explícita de problemas, busca, edição de registros, recuperação de PIN e exportação de histórico*
