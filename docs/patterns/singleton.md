# Padrão Singleton

O Padrão Singleton é um dos padrões criacionais que garante a existência de uma única instância de uma classe e fornece um ponto global de acesso a essa instância. Este padrão é útil quando exatamente um objeto é necessário para coordenar ações em todo o sistema.

## Quando usar o Padrão Singleton?
- Quando uma única instância de uma classe é necessária para controlar a ação em todo o sistema.
- Quando você precisa de um ponto global de acesso para uma instância única.
- Quando você deseja controlar o número de instâncias criadas de uma classe.

## Exemplo Prático em TypeScript

A seguir, veremos um exemplo de como o Padrão Singleton pode ser implementado em TypeScript. Suponha que estamos desenvolvendo um sistema de configuração de jogo onde queremos garantir que apenas uma única instância das configurações do jogo esteja ativa.

### Implementação

```typescript reference
https://github.com/sciotta/my-sandbox/blob/main/src/design-patterns/singleton.ts
```

### Exemplo de uso

```typescript
const configuracoes1 = ConfiguracoesDoJogo.obterInstancia();
const configuracoes2 = ConfiguracoesDoJogo.obterInstancia();

console.log(configuracoes1.configuracoes);
// Output: { volume: 50, brilho: 70, dificuldade: 'normal' }
console.log(configuracoes2.configuracoes);
// Output: { volume: 50, brilho: 70, dificuldade: 'normal' }

// Verificando se as instâncias são iguais
console.log(configuracoes1 === configuracoes2); // Output: true
```

Neste exemplo, a classe ConfiguracoesDoJogo possui um construtor privado e um método estático obterInstancia que garante que apenas uma única instância da classe seja criada. As chamadas para ConfiguracoesDoJogo.obterInstancia() retornam a mesma instância, garantindo que o padrão Singleton seja seguido.

## Conclusão

O padrão Singleton é útil em vários cenários, como gerenciar configurações de aplicativos, conexões de banco de dados, arquivos de configuração, ou quaisquer recursos compartilhados que exigem uma única instância em todo o aplicativo.

Explore os demais padrões de projeto nesta seção para aprofundar seu conhecimento e aprimorar suas habilidades de desenvolvimento de software, com exemplos práticos em TypeScript!