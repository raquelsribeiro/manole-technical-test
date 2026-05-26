# Frontend

Frontend da aplicação de gerenciamento de tarefas desenvolvido com React, Vite e TypeScript.

## Rodando com Docker

Para subir a aplicação completa com frontend e backend, rode o Docker Compose a partir da raiz do projeto:

```bash
cd ..
docker compose up --build
```

Aplicação disponível em:

```txt
http://localhost
```

Neste modo, o frontend é servido pelo Nginx na porta 80. A API fica disponível pelo proxy:

```txt
http://localhost/api
```

## Rodando o frontend individualmente

Use este modo quando quiser desenvolver apenas o frontend com o servidor do Vite.

```bash
npm install
npm run dev
```

Aplicação disponível em:

```txt
http://localhost:5173
```
