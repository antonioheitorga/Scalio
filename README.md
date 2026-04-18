# SCALIO

> Conhecimento técnico que nasce da comunidade e cresce com ela.

SCALIO é um aplicativo mobile **offline-first** para registro e acompanhamento técnico de famílias agricultoras na Vila Jutaiteua, Pará. Ele digitaliza o trabalho dos engenheiros agrônomos em campo — sem depender de internet — e centraliza o histórico de produção, problemas identificados e orientações técnicas de cada família acompanhada.

---

## O problema que resolve

A Vila Jutaiteua tem 411 moradores e produz açaí, mandioca, pimenta e cacau. Apenas 2 técnicos de agronomia atendem toda a comunidade — e nenhum registro das visitas é mantido. Quando o técnico não está presente, o conhecimento desaparece com ele.

O SCALIO muda isso: cada visita vira um registro. Cada registro vira histórico. O histórico vira dado para tomar decisões melhores.

---

## Status atual

O projeto está na **Fase 1 — Construção do MVP**.

A primeira versão do app já está rodando com os fluxos principais implementados. Veja a seção [O que já está implementado](#o-que-já-está-implementado) abaixo.

| Documento | Descrição |
|---|---|
| [Zonas de conhecimento](./docs/Scalio-zonas-de-conhecimento.md) | Zonas de conhecimento que serão implementadas |
| [Histórias de Usuário](./docs/SCALIO-historias-de-usuario.md) | Funcionalidades com critérios de aceitação |

---

## O que já está implementado

- Login por PIN com sessão local persistente
- Separação de dados por agrônomo (cada um vê apenas suas famílias)
- Lista de famílias com data da última visita, indicador de atenção e alerta de problema ativo
- Cadastro de nova família com salvamento offline
- Perfil da família com resumo e registros recentes
- Registro de visita de campo
- Registro de problema como parte de uma visita
- Tela de detalhe de um registro
- Histórico completo de visitas por família
- Painel com total de famílias, registros do mês, visitas atrasadas e problemas ativos
- Armazenamento local com AsyncStorage (offline-first)
- Sincronização real com Firebase Firestore
- Autenticação anônima automática (sessão protegida)
- Regras de segurança no Firestore validando formato dos dados

---

## Tech stack

| Camada | Tecnologia |
|---|---|
| App mobile | React Native + Expo |
| Linguagem | TypeScript |
| Navegação | React Navigation |
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

O app inclui dois agrônomos de teste pré-cadastrados:

| Nome | PIN |
|---|---|
| Joana Silva | `1234` |
| Marcos Pereira | `5678` |

Definidos em `mobile/src/data/seed.ts`.

---

## Estrutura do projeto

```
scalio/
├── README.md
├── docs/
│   ├── SCALIO-historias-de-usuario.md  # O que o app precisa fazer
│   └── SCALIO-zonas-de-conhecimento.md # Arquitetura do conhecimento
└── mobile/
    ├── App.tsx                          # Entrada do app e navegação
    ├── app.json
    └── src/
        ├── components/                  # Componentes reutilizáveis
        ├── context/
        │   └── AppContext.tsx           # Estado global, login, famílias, visitas, sync
        ├── data/
        │   └── seed.ts                  # Dados iniciais para teste
        ├── hooks/
        ├── screens/                     # Telas do app por módulo
        ├── storage/
        │   └── appStorage.ts            # Camada de persistência (AsyncStorage)
        ├── utils/
        └── types.ts                     # Tipos do domínio
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

- Autenticação por PIN local — sem recuperação de acesso implementada (HU-22)
- Regras do Firestore ainda não isolam dados por agrônomo no servidor — depende de HU-16
- Sem testes automatizados

---

## Próximos passos

1. HU-20 — Buscar família por nome
2. HU-10/HU-11 — Zonas de conhecimento (Camada 2)
3. HU-16 — Perfil de Agente Comunitário + auth real por PIN no servidor
4. HU-22 — Recuperação de acesso (PIN esquecido)
5. Testes com os 2 agrônomos reais da Vila Jutaiteua

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
