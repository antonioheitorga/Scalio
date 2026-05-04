# SCALIO

> Conhecimento técnico que nasce da comunidade e cresce com ela.

SCALIO é um aplicativo mobile **offline-first** para registro e acompanhamento técnico de famílias agricultoras na Vila Jutaiteua, Pará. Ele digitaliza o trabalho dos agentes de campo — sem depender de internet — e centraliza o histórico de produção, problemas identificados e orientações técnicas de cada família acompanhada. Familiares agricultores também têm acesso ao app para consultar informações da sua família.

---

## O problema que resolve

A Vila Jutaiteua tem 411 moradores e produz açaí, mandioca, pimenta e cacau. Apenas 2 agentes técnicos atendem toda a comunidade — e nenhum registro das visitas é mantido. Quando o agente não está presente, o conhecimento desaparece com ele.

O SCALIO muda isso: cada visita vira um registro. Cada registro vira histórico. O histórico vira dado para tomar decisões melhores.

---

## Status atual

O projeto está na **Fase 1 — Construção do MVP**, Sprint C em andamento.

---

## O que já está implementado

**Agente de campo**
- Login por PIN com sessão local persistente
- Recuperação de PIN por código de recuperação (offline)
- Lista de famílias com data da última visita, indicador de atenção e alerta de problema ativo
- Busca de família por nome
- Cadastro de nova família com salvamento offline
- Perfil da família com resumo e registros recentes
- Registro de visita de campo (produção, venda, insumo, problema, orientação técnica)
- Resolução de problema com notas
- Edição e exclusão de visita (janela de 30 dias)
- Painel com total de famílias, registros do mês, visitas atrasadas e problemas ativos
- Separação de dados por agente (cada agente vê apenas suas famílias)

**Familiar agricultor**
- Login por PIN com sessão local persistente
- Perfil com visualização da família vinculada (culturas, área)
- Stack de navegação isolada (familiar não acessa área do agente)

**Infraestrutura**
- Armazenamento local com AsyncStorage (offline-first)
- Sincronização real com Firebase Firestore
- Autenticação anônima automática (sessão protegida)
- Regras de segurança no Firestore validando formato dos dados
- Migration retro-compatível (dados de versões anteriores são preservados)

---

## Tech stack

| Camada | Tecnologia |
|---|---|
| App mobile | React Native + Expo (managed workflow) |
| Linguagem | TypeScript estrito |
| Navegação | React Navigation (native stack) |
| Armazenamento local | AsyncStorage |
| Verificação de rede | expo-network |
| Banco de dados | Firebase Firestore |
| Autenticação | Firebase Anonymous Auth |

---

## Como rodar

**Pré-requisitos:** Node.js e o app Expo Go instalado no celular.

```bash
cd mobile
npm install
npx expo start
```

Escaneie o QR code com o Expo Go. O app abre em segundos, sem precisar de emulador.

```bash
npm run android   # emulador Android
npm run ios       # simulador iOS (Mac apenas)
npm run web       # versão web no browser
```

---

## Acesso para testes

O app inclui usuários de teste pré-cadastrados em `mobile/src/data/seed.ts`.

**Agentes**

| Nome | PIN | Código de recuperação |
|---|---|---|
| Joana Silva | `1234` | `JOANA-7421` |
| Marcos Pereira | `5678` | `MARCOS-3158` |

**Familiares**

| Nome | PIN | Família vinculada |
|---|---|---|
| Antonio Souza | `2468` | Familia Souza |
| Maria Pinto | `1357` | Familia Pinto |

---

## Estrutura do projeto

```
scalio/
├── README.md
├── CLAUDE.md          # Diretrizes de desenvolvimento
├── context.md         # Contexto técnico do projeto
├── sessao.md          # Log de sprints e decisões de arquitetura
├── firestore.rules    # Regras de segurança do Firestore
└── mobile/
    ├── App.tsx                     # Entrada do app e navegação por role
    └── src/
        ├── components/             # Componentes reutilizáveis
        ├── config/                 # Configuração do Firebase
        ├── context/
        │   └── AppContext.tsx      # Estado global, login, famílias, visitas, sync
        ├── data/
        │   └── seed.ts             # Dados iniciais para teste
        ├── screens/                # Telas do app por perfil
        ├── services/
        │   └── syncService.ts      # Acesso ao Firestore (fetch + push)
        ├── storage/
        │   └── appStorage.ts       # Persistência local e migration
        ├── utils/                  # Formatação, datas, IDs, texto
        └── types.ts                # Tipos do domínio
```

---

## Comportamento offline

O app foi construído para funcionar sem internet:

- Estado carregado do armazenamento local ao abrir
- Alterações salvas automaticamente no AsyncStorage
- Login funciona com dados locais
- Famílias e visitas disponíveis sem conexão
- Novos registros criados com status `pending`
- Sincronização iniciada automaticamente quando há conexão

---

## Limitações atuais (a resolver)

- Regras do Firestore ainda não isolam dados por agente no servidor — depende de HU-16 (auth real)
- PIN em texto claro no AsyncStorage e Firestore — aceitável no MVP, endurecer em HU-16
- Colisão silenciosa de PIN: dois usuários com mesmo PIN — o primeiro encontrado loga sem aviso. Revisitar antes de escala (recomendação: selecionar nome + digitar PIN)
- Sem testes automatizados

---

## Próximos passos

1. **HU-18** — Agente cadastra e gerencia familiares (com persistência no Firestore)
2. **HU-NEW** — Recomendação do agente para o familiar
3. **HU-NEW** — Feedback do familiar
4. **HU-15** — Painel de impacto
5. **HU-16** — Auth real vinculada ao PIN no servidor

---

## Time

| Nome | Papel |
|---|---|
| Antonio Heitor Gomes Azevedo | — |
| Deivison Rayan Brito Tavares | — |
| Gustavo Yuji Virgolino Nishimura | — |
| Heitor Yasuo Yamamoto | — |
| Pedro Henrique de Macedo Monteiro | — |
| Pedro Unger | — |

---

*Projeto desenvolvido no eixo temático de Educação — Vila Jutaiteua, Pará, 2026.*
*Alinhado aos ODS 4, 8 e 10.*
