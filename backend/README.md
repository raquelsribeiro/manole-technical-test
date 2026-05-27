# Backend

API REST de gerenciamento de tarefas desenvolvida com Node.js, Express, TypeORM e SQLite.

## Rodando com Docker

Para subir a aplicação completa com backend e frontend, rode o Docker Compose a partir da raiz do projeto:

```bash
cd ..
docker compose up --build
```

URL base da API disponível diretamente em:

```txt
http://localhost:3333
```

URL base da API disponível pelo proxy do frontend em:

```txt
http://localhost/api
```

Observação: a rota raiz (`http://localhost:3333/`) aponta para o healthcheck e retorna o status da aplicação.

## Rodando o backend individualmente

Use este modo quando quiser desenvolver ou testar apenas a API fora do Docker.

```bash
npm install
npm run dev
```

URL base da API disponível em:

```txt
http://localhost:3333
```

Para listar tarefas:

```txt
http://localhost:3333/tasks
```

Para buscar uma tarefa pelo id:

```txt
http://localhost:3333/tasks/1
```

Para pesquisar por título ou descrição:

```txt
http://localhost:3333/tasks?search=termo
```
