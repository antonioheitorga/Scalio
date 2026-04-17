# SCALIO — Mapa de Zonas de Conhecimento
**Versão 1.0 — Abril de 2026**

> Este documento define a arquitetura do conhecimento do SCALIO. É a espinha dorsal da camada de multiplicação — o que existe para aprender, quem cria, quem aprende e como o conhecimento flui dentro da plataforma.

---

## O que é uma Zona de Conhecimento

Uma zona de conhecimento é uma área temática ampla, dentro da qual existem subtópicos práticos e específicos para a realidade da Vila Jutaiteua. Diferente de um módulo sequencial, a zona é **exploratória** — o usuário entra pelo que tem curiosidade ou necessidade imediata, não por uma ordem imposta.

Cada zona é alimentada pelos agrônomos, validada na prática pelos agentes comunitários, e consumida pelas famílias agricultoras.

---

## Hierarquia de conteúdo

```
Zona de Conhecimento
└── Subtópico
    └── Conteúdo (texto, áudio ou formato a definir*)
        └── Relato prático (contribuição de agente)
```

*O formato de conteúdo será definido após pesquisa com a professora consultora. A arquitetura do sistema já prevê diferentes formatos — a decisão não impacta a estrutura das zonas.

---

## Os três perfis e seus papéis no conhecimento

**Agrônomo** — É a fonte técnica autorizada. Cria os subtópicos e publica o conteúdo dentro de cada zona. Tem acesso exclusivo para criar e editar conteúdo oficial.

**Agente Comunitário** — Aprende explorando as zonas. Aplica o conhecimento nas visitas às famílias que acompanha. Pode registrar relatos práticos ("apliquei isso e aconteceu X") que ficam visíveis como contribuição dentro do subtópico.

**Agricultor / Família** — Acessa o conhecimento de forma simplificada, geralmente guiado pelo agente durante ou após uma visita. Pode explorar as zonas por conta própria, mas o app não exige isso.

---

## Zonas mapeadas

As zonas abaixo foram identificadas a partir da imersão na Vila Jutaiteua, do pitch do projeto e das observações de campo. Elas representam as áreas de maior necessidade técnica real da comunidade.

---

### Zona 1 — Solo
**Por que existe:** A base de qualquer produção agrícola. A maioria dos agricultores da Vila não conhece as características do solo que cultivam, o que impacta diretamente a produtividade.

Subtópicos iniciais:
- O que é análise de solo e por que fazer
- Como coletar amostras de solo corretamente
- Interpretar um laudo de análise (linguagem simples)
- Tipos de solo presentes na região da Vila Jutaiteua
- Quando e como corrigir o pH do solo

---

### Zona 2 — Cultivo
**Por que existe:** As quatro culturas da Vila (açaí, mandioca, pimenta e cacau) têm ciclos, necessidades e vulnerabilidades específicas que a maioria dos agricultores aprende apenas por tentativa e erro.

Subtópicos iniciais:
- Período certo de plantar cada cultura na Vila
- Espaçamento e densidade de plantio
- Sinais de que uma planta está saudável vs com problema
- Manejo e poda básica
- Como aumentar a produtividade sem aumentar a área

---

### Zona 3 — Adubação e Insumos
**Por que existe:** O uso incorreto de insumos é um dos maiores geradores de custo desnecessário e de dano ao solo. Agricultores frequentemente aplicam o produto errado, na dose errada, na época errada.

Subtópicos iniciais:
- Diferença entre adubo orgânico e químico
- Adubação específica para cada cultura da Vila
- Como calcular a quantidade certa de insumo
- Fontes de insumo acessíveis na região
- Alternativas orgânicas e de baixo custo

---

### Zona 4 — Pragas e Doenças
**Por que existe:** Perdas por pragas não identificadas a tempo são um dos principais limitadores de renda. Sem diagnóstico correto, o agricultor gasta com tratamento errado ou perde a safra.

Subtópicos iniciais:
- Principais pragas de cada cultura na Vila
- Como identificar uma praga vs uma doença
- Quando tratar e quando o problema já passou do ponto
- Métodos de controle integrado (não só agrotóxico)
- O que fazer quando não sabe o que é o problema (protocolo de registro e acionamento do agrônomo)

---

### Zona 5 — Financeiro e Precificação
**Por que existe:** A maioria dos agricultores vende sem saber se está lucrando. Não registram custo de produção, não calculam preço mínimo, não sabem quanto ganharam no mês.

Subtópicos iniciais:
- O que é custo de produção e como calcular o seu
- Como definir o preço mínimo de venda (não vender abaixo disso)
- O que é margem e por que ela importa
- Como registrar receita e despesa de forma simples
- Estratégias de negociação com atravessadores

---

### Zona 6 — Planejamento de Safra
**Por que existe:** Sem planejamento, o agricultor reage ao que acontece em vez de antecipar. Isso resulta em falta de insumo na hora certa, colheita sem comprador definido e receita irregular.

Subtópicos iniciais:
- O que é o calendário agrícola e como montar o seu
- Como estimar quanto vai produzir antes da colheita
- Planejando a compra de insumos com antecedência
- Como lidar com safra ruim sem comprometer o próximo ciclo
- Diversificação de culturas como estratégia de risco

---

### Zona 7 — Comercialização
**Por que existe:** Produzir bem e vender mal é o problema mais comum. Falta de acesso a mercado, dependência de atravessadores e desconhecimento de alternativas limitam a renda mesmo quando a produção é boa.

Subtópicos iniciais:
- Canais de venda disponíveis para a produção da Vila
- O que é uma cooperativa e como funciona
- Como vender direto (feiras, programas governamentais)
- Documentação necessária para acessar mercados formais
- Como negociar preço e prazo de pagamento

---

## Fluxo do conhecimento

```
AGRÔNOMO
  │
  ├─ Cria subtópico dentro de uma zona
  ├─ Publica conteúdo técnico (específico para a Vila)
  │
  ▼
AGENTE COMUNITÁRIO
  │
  ├─ Explora zonas por interesse ou necessidade
  ├─ Aplica o conhecimento nas visitas às famílias
  ├─ Registra relato prático no subtópico ("funcionou assim aqui")
  │
  ▼
AGRICULTOR / FAMÍLIA
  │
  └─ Acessa conteúdo guiado pelo agente ou por conta própria
```

---

## O que define uma boa zona

Uma zona está bem estruturada quando qualquer agricultor da Vila consegue entrar nela, ler o primeiro subtópico e sair com uma ação prática para fazer ainda essa semana. Se o conteúdo for teórico demais ou genérico demais, a zona falhou.

Os agrônomos são responsáveis por garantir que todo conteúdo publicado passe por esse filtro antes de ir ao ar.

---

## Decisões em aberto

| Decisão | Status | Responsável |
|---|---|---|
| Formato do conteúdo (texto, áudio, vídeo) | Aguardando pesquisa com professora | Antonio Heitor |
| Validação das zonas com os agrônomos da Vila | Pendente | Time SCALIO |
| Ordem de publicação das zonas (qual vai primeiro) | Pendente | Agrônomos |
| Critério para um agente poder contribuir (qualquer agente ou só os formados?) | Pendente | Time SCALIO |

---

*SCALIO — Vila Jutaiteua, Pará, 2026*
*Atualizar este documento sempre que uma nova zona for identificada ou uma decisão em aberto for resolvida*
