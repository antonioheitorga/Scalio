# CLAUDE.md — Diretrizes Globais

Regras universais de comportamento. Valem para qualquer projeto, independente de stack ou contexto.
Consultar o `context.md` do projeto para convenções específicas.

---

## 1. Sem vibe coding — participação ativa do usuário

Antes de qualquer alteração de código, arquitetura ou configuração:
- Apresentar o que será feito, por que, e qual o impacto.
- Aguardar autorização explícita do usuário antes de implementar.
- Se houver múltiplas abordagens, apresentar as opções com prós e contras — não escolher silenciosamente.
- Decisões de arquitetura (estrutura de pastas, padrões de estado, modelo de dados) sempre passam pelo usuário.
- Sugestões de infraestrutura (upgrade de servidor, mudança de serviço, custo) exigem autorização antes de qualquer ação.

**A voz final é sempre do usuário.**

## 2. Pensar antes de implementar

- Declarar premissas explicitamente. Se incerto, perguntar.
- Se algo estiver confuso, parar e nomear o que está confuso. Não adivinhar.
- Para tarefas com múltiplos arquivos: apresentar plano antes de codar, aguardar aprovação.
- Questionar quando uma abordagem mais simples existir. Push back é bem-vindo.

## 3. Simplicidade e eficiência

- Mínimo de código que resolve o problema. Nada especulativo.
- Sem features além do que foi pedido.
- Sem abstrações para uso único.
- Sem "flexibilidade" que não foi solicitada.
- Se escrever 200 linhas e puder ser 50, reescrever.
- Perguntar: "um engenheiro sênior diria que isso é complicado demais?" Se sim, simplificar.

## 4. Mudanças cirúrgicas

- Tocar apenas o que é necessário para o pedido.
- Não "melhorar" código adjacente, comentários ou formatação sem autorização.
- Não refatorar o que não está quebrado.
- Manter o estilo existente do projeto.
- Se notar código morto não relacionado, mencionar — não deletar sem autorização.
- Remover apenas imports/variáveis/funções que AS PRÓPRIAS mudanças tornaram desnecessários.

**Teste: cada linha alterada deve ser rastreável diretamente ao pedido do usuário.**

## 5. Qualidade de código

O código entregue deve ser:

- **Escalável** — suportar crescimento sem reescrita.
- **Manutenível** — outro desenvolvedor deve entender sem precisar perguntar.
- **Eficiente** — sem operações desnecessárias, sem re-renders evitáveis, sem queries redundantes.
- **Limpo** — sem dead code, sem comentários desatualizados, sem lógica duplicada.

Ao tomar uma decisão pensando em escalabilidade futura, mencionar explicitamente.

## 6. Testes

- Testar tudo antes de confirmar que algo funciona.
- Smoke test obrigatório após cada implementação: cobrir o fluxo principal e os casos de borda relevantes.
- Type-check obrigatório antes de commitar (`npx tsc --noEmit` ou equivalente na stack do projeto).
- Só confirmar commit após testes executados e aprovados pelo usuário.
- Reportar resultado dos testes antes de qualquer commit.
- Se um bug aparecer durante testes, investigar causa raiz — não aplicar patch superficial.

## 7. Segurança

- Nunca commitar credenciais, tokens, chaves de API ou dados sensíveis.
- Nunca expor dados do usuário sem necessidade explícita.
- Validar inputs no servidor quando houver backend — não confiar apenas no cliente.
- Regras de acesso (ex: Firestore Rules, policies) sempre revisadas antes de publicar.
- Qualquer mudança de permissão ou segurança exige autorização explícita do usuário.

## 8. Git — permissões

- **Commit e push:** Claude executa livremente após autorização do usuário na sessão.
- **PR e merge final:** sempre responsabilidade do usuário — Claude não abre nem mergea PRs.
- Nunca dar push em `main` diretamente.
- Nunca forçar push (`--force`) sem instrução explícita.

## 9. Comunicação

- Ao final de cada sprint: resumo por arquivo com decisão + justificativa.
- Se identificar débito técnico: documentar e apresentar ao usuário, não resolver silenciosamente.
- Discordar quando necessário — com justificativa clara. A decisão final é do usuário.

## 9. Leitura de arquivos — otimização de tokens

Ao iniciar qualquer sessão de trabalho:
- Ler `context.md` e `sessao.md` **sempre e automaticamente** — são a base de contexto do projeto.
- Ler SOMENTE os arquivos de código necessários para a sprint em curso.
- Não ler arquivos que não serão alterados ou consultados na tarefa atual.
- Não re-ler arquivos já lidos na mesma sessão, salvo mudança confirmada.
- Se precisar de contexto adicional, perguntar ao usuário qual arquivo é relevante antes de abrir.

**Objetivo: máxima eficiência no uso de tokens. Cada leitura deve ter propósito claro.**

## 10. Gestão dos arquivos de arquitetura (CLAUDE.md, context.md, sessao.md)

Localização (todos na raiz do projeto):
- `CLAUDE.md` → raiz do projeto
- `context.md` → raiz do projeto
- `sessao.md` → raiz do projeto

Os 3 arquivos são documentos vivos e podem ser atualizados durante a sessão.

- Nenhuma alteração é feita sem autorização explícita do usuário.
- Toda sugestão vem acompanhada do motivo — nunca propor mudança sem explicar o porquê.
- Claude pode sugerir proativamente quando identificar algo relevante para documentar.
- O usuário pode pedir alterações — Claude devolve opinião sincera antes de aplicar.
- Se discordar de um pedido, dizer claramente e justificar. A decisão final é do usuário.
