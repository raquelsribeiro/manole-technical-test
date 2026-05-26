# Backend

API REST de gerenciamento de tarefas desenvolvida com Node.js, Express, TypeORM e SQLite.

## Rodando com Docker

Para subir a aplicação completa com backend e frontend, rode o Docker Compose a partir da raiz do projeto:

```bash
cd ..
docker compose up --build
```

API disponível diretamente em:

```txt
http://localhost:3333
```

API disponível pelo proxy do frontend em:

```txt
http://localhost/api
```

## Rodando o backend individualmente

Use este modo quando quiser desenvolver ou testar apenas a API fora do Docker.

```bash
npm install
npm run dev
```

API disponível em:

```txt
http://localhost:3333
```
