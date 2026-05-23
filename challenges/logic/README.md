# Desafio de Lógica

## Objetivo

Implementar uma função que recebe uma lista de valores e retorna:

- A soma dos números pares
- A média dos números ímpares
- Ignora valores inválidos, como `null`, `undefined`, strings, objetos e arrays

---

## Exemplo

### Entrada

```ts
[1, 2, 3, 4, 5, "a", null];
```

### Saída

```ts
{
  somaPares: 6,
  mediaImpares: 3
}
```

---

## Estrutura

```txt
analyzeNumbers.ts
analyzeNumbers.test.ts
```

- `analyzeNumbers.ts`: implementação da função
- `analyzeNumbers.test.ts`: testes unitários

---

## Decisões técnicas

A função recebe um array do tipo `unknown[]` para permitir diferentes tipos de entrada sem perder segurança de tipagem.

Antes dos cálculos, os valores são filtrados para considerar apenas números inteiros válidos utilizando:

```ts
typeof value === "number" && Number.isInteger(value);
```

Também foi adicionado tratamento para cenários onde não existam números pares ou ímpares, evitando comportamentos inesperados como divisão por zero.

---

## Casos testados

Os testes cobrem:

- Cenário principal do desafio
- Valores inválidos
- Array vazio
- Apenas números pares
- Apenas números ímpares
- Números negativos

---

## Como executar

### Rodar testes

```bash
npm test
```

### Executar manualmente

```bash
npm run dev
```
