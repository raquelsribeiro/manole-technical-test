# Conceitos

## 1. Diferença entre REST e GraphQL

REST é um padrão de arquitetura onde cada recurso possui endpoints específicos, como:

```http
GET /tasks
GET /tasks/1
POST /tasks
```

Já o GraphQL permite que o cliente escolha exatamente quais dados deseja receber através de uma única rota.

### Exemplo REST

```http
GET /users/1
```

Resposta:

```json
{
  "id": 1,
  "name": "Raquel",
  "email": "raquel@email.com",
  "address": "São Paulo"
}
```

Mesmo que o frontend precise apenas do nome.

### Exemplo GraphQL

```graphql
{
  user(id: 1) {
    name
  }
}
```

Resposta:

```json
{
  "data": {
    "user": {
      "name": "Raquel"
    }
  }
}
```

REST costuma ser mais simples e muito utilizado em APIs tradicionais.  
GraphQL oferece mais flexibilidade, principalmente em aplicações com muitos relacionamentos e diferentes necessidades de consumo de dados.

---

## 2. O que é transação em banco de dados

Uma transação é um conjunto de operações executadas como uma única unidade no banco de dados.

Isso significa que:

- ou todas as operações são concluídas com sucesso;
- ou todas são desfeitas em caso de erro, garantindo consistência dos dados.

### Exemplo

Em uma transferência bancária:

1. Remover saldo da conta A
2. Adicionar saldo na conta B

Se ocorrer um erro após remover o saldo da conta A, a transação garante que a operação seja desfeita para evitar inconsistência nos dados.

---

## 3. Diferença entre autenticação e autorização

Autenticação é o processo de identificar quem é o usuário.

### Exemplo

Login com:

- email e senha;
- conta Google;
- token JWT após validação das credenciais.

A autorização define o que o usuário pode acessar dentro do sistema.

### Exemplo

Um usuário autenticado pode:

- visualizar tarefas;
- mas talvez não tenha permissão para excluir tarefas de outros usuários.

Ou seja:

- autenticação = quem você é;
- autorização = o que você pode fazer.

---

## 4. Quando usar cache e quando evitar

Cache é utilizado para armazenar dados temporariamente e melhorar performance, reduzindo consultas repetidas.

### Quando usar

- Dados acessados com frequência
- Consultas pesadas
- APIs externas
- Informações que mudam pouco

### Exemplo

Lista de categorias de produtos ou resultados de uma API pública.

---

### Quando evitar

Cache deve ser evitado quando os dados mudam constantemente ou precisam ser atualizados em tempo real.

### Exemplo

Saldo bancário ou status de pagamento em tempo real.

Nesses casos, o cache pode retornar informações desatualizadas.
