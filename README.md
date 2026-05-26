# Manole Technical Test

## Sobre o projeto

Aplicação fullstack de gerenciamento de tarefas desenvolvida como parte do desafio técnico da Manole.

O projeto permite:

- criar tarefas;
- listar tarefas;
- atualizar status;
- excluir tarefas;
- filtrar tarefas por status;
- visualizar informações de paginação.

A aplicação foi construída utilizando React no frontend e Node.js com Express no backend.

---

## Tecnologias utilizadas

### Frontend

- React
- TypeScript
- Vite
- Mantine UI
- Fetch API

### Backend

- Node.js
- Express
- TypeORM
- SQLite

### Testes

- Jest
- Supertest

### Infraestrutura

- Docker
- Docker Compose

---

## Funcionalidades

### Backend

- CRUD de tarefas
- Filtro por status
- Paginação
- Validação de dados
- Healthcheck da API
- Persistência com SQLite
- Testes automatizados
- Dockerização da aplicação

### Frontend

- Listagem de tarefas
- Criação de tarefas
- Atualização de status
- Exclusão de tarefas
- Filtro por status
- Pesquisa por título ou descrição na página atual
- Paginação integrada com a API
- Loading state
- Tratamento de erros
- Empty state
- UX amigável
- Responsividade
- Testes automatizados básicos

---

## Estrutura do projeto

```txt
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── entities
│   │   ├── routes
│   │   ├── tests
│   │   └── app.ts
│   └── Dockerfile
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── services
│   │   ├── types
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.ts
│
├── docker-compose.yml
└── challenges
    └── logic
```

---

## Como rodar com Docker

Use este caminho para subir backend e frontend juntos a partir da raiz do projeto:

```bash
docker compose up --build
```

Aplicação disponível em:

```txt
http://localhost
```

API disponível diretamente em:

```txt
http://localhost:3333
```

API disponível pelo proxy do frontend em:

```txt
http://localhost/api
```

---

## Como rodar individualmente

### Backend

Instalar dependências:

```bash
cd backend
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Servidor disponível em:

```txt
http://localhost:3333
```

---

### Frontend

Instalar dependências:

```bash
cd frontend
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Frontend disponível em:

```txt
http://localhost:5173
```

---

## Como executar os testes

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

### Challenge de lógica

```bash
cd challenges/logic
npm test
```

---

## Endpoints da API

### Healthcheck

```http
GET /health
```

---

### Listar tarefas

```http
GET /tasks
```

### Filtro por status

```http
GET /tasks?status=pendente
```

### Paginação

```http
GET /tasks?page=1&limit=10
```

### Busca por título ou descrição

```http
GET /tasks?search=typeorm
```

### Combinando busca, filtro e paginação

```http
GET /tasks?search=api&status=pendente&page=1&limit=6
```

---

### Buscar tarefa por ID

```http
GET /tasks/:id
```

---

### Criar tarefa

```http
POST /tasks
```

Body:

```json
{
  "title": "Estudar TypeORM",
  "description": "Criar CRUD da aplicação",
  "status": "pendente"
}
```

---

### Atualizar tarefa

```http
PUT /tasks/:id
```

Body:

```json
{
  "title": "Estudar TypeORM",
  "description": "Atualizar tarefa no CRUD",
  "status": "em andamento"
}
```

---

### Excluir tarefa

```http
DELETE /tasks/:id
```

Resposta esperada:

```txt
204 No Content
```

---

## Decisões técnicas

### React + Vite

O frontend foi desenvolvido utilizando React com Vite devido à simplicidade de configuração, rapidez no ambiente de desenvolvimento e excelente experiência para aplicações SPA.

---

### Mantine UI

Mantine UI foi adotado para melhorar a interface sem alterar a arquitetura do frontend. A escolha permite usar componentes acessíveis e consistentes para formulário, modal, cards, filtros, badges e paginação.

---

### TypeScript

TypeScript foi utilizado para melhorar a tipagem da aplicação, aumentar a segurança durante o desenvolvimento e facilitar manutenção e escalabilidade.

---

### TypeORM + SQLite

O backend utiliza TypeORM como ORM para abstração de acesso ao banco de dados e SQLite como banco local por ser leve, simples de configurar e ideal para o contexto do desafio técnico.

---

### Docker

Docker foi utilizado para padronizar a execução do backend e facilitar a reprodução do ambiente da aplicação.

---

### Jest + Supertest

Os testes automatizados utilizam Jest e Supertest para validar os principais fluxos da API e garantir o funcionamento do CRUD de tarefas.

---

## Melhorias futuras

Algumas melhorias que poderiam ser implementadas futuramente:

- autenticação de usuários;
- dark mode;
- deploy da aplicação;
- notificações/toasts;
- utilização de React Query;
- melhorias de acessibilidade;
- ordenação por data ou status;
- ampliar a cobertura de testes no frontend;

---

## Pontos fortes

- API REST simples, com CRUD completo, validação básica, persistência em SQLite e status HTTP adequados.
- Diferenciais implementados no backend: paginação, filtro por status, busca por texto, testes automatizados e Docker.
- Frontend em React com TypeScript, hooks, componentes separados e estados de loading, erro e vazio.
- Interface responsiva com Mantine UI, badges de status, filtro, busca global e paginação usando os dados da API.
- Testes básicos do frontend cobrindo título, empty state, abertura do modal e validação do botão de criação.

---

## Limitações conhecidas

- Não há autenticação/autorização porque esse fluxo não faz parte do escopo obrigatório do desafio.
- O banco SQLite usa `synchronize: true`, adequado para teste técnico e desenvolvimento local, mas não recomendado para produção.

---

## Considerações finais

O projeto foi desenvolvido com foco em organização, separação de responsabilidades, boas práticas e experiência de desenvolvimento.

Durante a implementação foram priorizados:

- arquitetura simples e escalável;
- tipagem com TypeScript;
- componentização;
- validação de dados;
- testes automatizados;
- padronização de ambiente com Docker.

Além dos requisitos obrigatórios, também foram implementados diferenciais como:

- paginação;
- filtros;
- testes de integração;
- Dockerização do backend;
- melhorias de UX no frontend.
