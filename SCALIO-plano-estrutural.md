# SCALIO — Plano Estrutural do Projeto
**Versão 1.0 — Abril de 2026**

> Este documento é a linha de raciocínio do projeto. Ele deve ser consultado regularmente, atualizado quando a realidade mudar e usado para saber exatamente onde o time está, para onde vai e o que precisa ser ajustado.

---

## 1. O que é o SCALIO

O SCALIO é um aplicativo mobile que digitaliza o acompanhamento técnico de famílias agricultoras na Vila Jutaiteua. Ele nasce de um problema real: apenas 2 técnicos de agronomia atendem toda a comunidade, sem nenhum mecanismo para registrar, acompanhar e multiplicar o conhecimento gerado nessas visitas.

O app resolve isso em três camadas: permite que os agrônomos registrem suas visitas de campo, organiza o histórico de cada família acompanhada e, com o tempo, forma novos agentes comunitários capazes de ampliar esse atendimento.

---

## 2. Ponto de partida real

É importante que o time tenha clareza sobre o contexto atual antes de qualquer decisão de produto.

**Quem são os primeiros usuários:** Os 2 engenheiros agrônomos já presentes na Vila Jutaiteua. Eles têm outras responsabilidades além do SCALIO — o app precisa ser leve o suficiente para caber na rotina deles.

**Quantas famílias no início:** Cada agrônomo acompanha de 1 a 2 famílias na fase inicial. O sistema já deve ser construído para suportar mais famílias no futuro, mas o foco e os testes começam com no máximo 4 famílias no total.

**O papel duplo dos agrônomos:** Eles são simultaneamente os primeiros usuários do app e os formadores dos futuros agentes comunitários. O que eles aprenderem usando o app será o que eles vão ensinar para os próximos.

**Conectividade:** A Vila tem acesso limitado à internet. O app precisa funcionar completamente offline e sincronizar os dados quando houver sinal disponível.

---

## 3. O que o MVP precisa fazer

O MVP (primeira versão entregável) deve resolver apenas o problema central: **os agrônomos não têm onde registrar o que fazem nas visitas de campo**.

Tudo que não resolve esse problema específico fica fora do MVP.

### Está dentro do MVP

**Registro de visita de campo**
O agrônomo abre o app, seleciona uma família, e registra o que aconteceu na visita: cultura trabalhada, quantidade produzida, orientação técnica dada, problema identificado ou venda realizada. Esse registro é salvo localmente, sem internet.

**Lista de famílias acompanhadas**
Cada agrônomo vê suas famílias com as informações básicas: última visita, o que foi registrado, se há algo pendente de atenção.

**Histórico por família**
Uma tela que mostra a linha do tempo de uma família — todas as visitas anteriores, o que foi registrado em cada uma, e como a produção foi evoluindo.

**Sincronização automática**
Quando o celular conectar à internet, todos os registros feitos offline sobem automaticamente para o banco de dados central.

**Painel de visão geral**
Uma tela simples mostrando o total de famílias acompanhadas, registros feitos e qualquer família que esteja sem visita há muito tempo.

### Está fora do MVP

Notificações automáticas, relatórios exportáveis, módulos de formação interativos, mapa da comunidade, sistema de pontos, perfis de agentes comunitários e qualquer outra funcionalidade que não seja o registro direto das visitas.

---

## 4. Fases do projeto

### Fase 0 — Preparação
**Duração estimada: 2 semanas**
**Status: Em andamento**

O objetivo desta fase é garantir que o time tenha tudo que precisa antes de começar a construir. Isso inclui ambiente de desenvolvimento configurado, repositório de código criado e alinhamento completo sobre o que vai ser construído.

O que deve ser concluído:
- Ambiente de desenvolvimento instalado e funcionando (Node.js, Expo)
- Repositório no GitHub criado com o time
- Todos os membros técnicos alinhados com este documento
- Decisão sobre quais 2 famílias participarão do teste inicial confirmada com os agrônomos

Critério de conclusão: o dev consegue rodar o projeto no celular via Expo sem erros.

---

### Fase 1 — Construção do MVP
**Duração estimada: 6 a 8 semanas**
**Status: Não iniciada**

O objetivo é construir e entregar as funcionalidades do MVP descritas acima. A ordem de construção importa — começar pelo que entrega valor mais cedo.

**Semanas 1–2:** Estrutura base do app, navegação entre telas e tela de login por perfil (Agrônomo).

**Semanas 3–4:** Formulário de registro de visita funcionando e salvando dados offline no celular.

**Semanas 5–6:** Lista de famílias com histórico de visitas e tela de detalhe de cada família.

**Semana 7:** Sincronização dos dados com o banco de dados online quando houver conexão.

**Semana 8:** Painel de visão geral e ajustes finais antes do teste.

Critério de conclusão: os 2 agrônomos conseguem registrar uma visita completa no app, os dados aparecem no painel, e tudo funciona sem internet durante a visita.

---

### Fase 2 — Teste real na Vila
**Duração estimada: 3 a 4 semanas**
**Status: Não iniciada**

O objetivo é colocar o app nas mãos dos 2 agrônomos em campo real e observar o que funciona e o que não funciona. Nenhuma funcionalidade nova é adicionada nessa fase — o foco é aprender.

O que deve acontecer:
- Instalação do app nos celulares dos agrônomos
- Acompanhamento de pelo menos 2 visitas reais para observar o uso do app
- Coleta de feedback direto dos agrônomos após cada uso
- Registro de todos os problemas e dificuldades encontrados

Critério de conclusão: os 2 agrônomos conseguem usar o app de forma autônoma em campo, sem precisar de ajuda do time técnico.

---

### Fase 3 — Ajuste e expansão
**Duração estimada: 4 a 6 semanas**
**Status: Não iniciada**

Com o feedback real da Fase 2, corrigir o que não funcionou e começar a preparar o app para os próximos usuários — os futuros agentes comunitários que os agrônomos vão formar.

Nessa fase, as decisões de novas funcionalidades são baseadas exclusivamente no que os agrônomos relataram como necessidade real durante os testes. Nada é adicionado por suposição.

Critério de conclusão: o app está estável o suficiente para ser apresentado a potenciais agentes comunitários como parte da formação.

---

## 5. Como usar este documento

**Revisão semanal:** Uma vez por semana, o time verifica em qual fase está e se o critério de conclusão da fase atual foi atingido.

**Quando ajustar:** Se uma fase estiver levando mais tempo do que o estimado, não se avança para a próxima. O plano é ajustado, o novo prazo é anotado aqui, e o motivo do atraso é registrado para aprendizado futuro.

**Quando adicionar funcionalidades:** Nenhuma funcionalidade nova entra no plano sem que a fase atual esteja concluída e sem que a necessidade venha de um usuário real (os agrônomos), não de uma suposição do time.

---

## 6. Histórico de atualizações

| Data | O que mudou | Por quê |
|---|---|---|
| Abril 2026 | Versão inicial criada | Início do projeto |
| Abril 2026 | Escopo do MVP reduzido para 1–2 famílias por agrônomo | Realidade operacional dos agrônomos — têm outros trabalhos |

---

*SCALIO — Vila Jutaiteua, Pará*
