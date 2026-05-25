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
- Loading state
- Tratamento de erros
- UX básica
- Responsividade

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
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── services
│   │   ├── types
│   │   └── App.tsx
│   └── vite.config.ts
│
└── challenges
    └── logic
```

---

## Como rodar o backend

### Instalar dependências

```bash
cd backend
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

Servidor disponível em:

```txt
http://localhost:3333
```

---

## Como rodar o frontend

### Instalar dependências

```bash
cd frontend
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

Frontend disponível em:

```txt
http://localhost:5173
```

---

## Como rodar com Docker

```bash
cd backend
docker compose up --build
```

API disponível em:

```txt
http://localhost:3333
```

---

## Como executar os testes

### Backend

```bash
cd backend
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

---

### Excluir tarefa

```http
DELETE /tasks/:id
```

---

## Decisões técnicas

### React + Vite

O frontend foi desenvolvido utilizando React com Vite devido à simplicidade de configuração, rapidez no ambiente de desenvolvimento e excelente experiência para aplicações SPA.

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

- paginação no frontend;
- filtros visuais de status;
- autenticação de usuários;
- dark mode;
- deploy da aplicação;
- notificações/toasts;
- testes frontend;
- utilização de React Query;
- melhorias de acessibilidade;
- melhorias visuais na interface.

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
