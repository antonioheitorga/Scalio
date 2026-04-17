# Como Contribuir

## Branches
- `main` → código estável, produção
- `develop` → integração e desenvolvimento
- `feature/xxx` → cada funcionalidade nova

## Fluxo de trabalho

### 1. Antes de começar
```bash
git checkout develop
git pull origin develop
```

### 2. Crie sua branch
```bash
git checkout -b feature/nome-da-funcionalidade
```

### 3. Faça seus commits
```bash
git add .
git commit -m "tipo: descrição curta do que foi feito"
```

**Tipos de commit:**
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação, sem mudança de lógica
- `refactor:` refatoração de código

### 4. Suba a branch
```bash
git push origin feature/nome-da-funcionalidade
```

### 5. Abra um Pull Request
- PR de `feature/xxx` → `develop`
- PR de `develop` → `main` apenas para releases