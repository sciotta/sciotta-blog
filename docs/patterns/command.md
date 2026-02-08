# Padrão Command

O Padrão Command é um dos padrões comportamentais que transforma uma solicitação em um objeto independente que contém toda a informação sobre a solicitação. Esta transformação permite parametrizar métodos com diferentes solicitações, atrasar ou enfileirar a execução de uma solicitação e implementar operações que podem ser desfeitas (undo/redo).

## Quando usar o Padrão Command?
- Quando você quer parametrizar objetos com operações.
- Quando você precisa enfileirar operações, agendar sua execução ou executá-las remotamente.
- Quando você precisa implementar operações reversíveis (undo/redo).
- Quando você quer manter um histórico de operações executadas.
- Quando você quer desacoplar o objeto que invoca a operação daquele que sabe como executá-la.

## Exemplo Prático em TypeScript

A seguir, veremos um exemplo de como o Padrão Command pode ser implementado em TypeScript. Suponha que estamos desenvolvendo um editor de texto que precisa suportar operações de escrita e exclusão com funcionalidades de desfazer (undo) e refazer (redo).

### Implementação

```typescript reference
https://github.com/sciotta/my-sandbox/blob/main/src/design-patterns/command.ts
```

### Exemplo de uso

```typescript
const editor = new EditorDeTexto();
const gerenciador = new GerenciadorDeComandos();

// Executando comandos
gerenciador.executar(new ComandoEscrever(editor, "Olá "));
gerenciador.executar(new ComandoEscrever(editor, "mundo!"));
console.log(editor.obterTexto());
// Output: Olá mundo!

// Desfazendo comandos
gerenciador.desfazer();
console.log(editor.obterTexto());
// Output: Olá 

gerenciador.desfazer();
console.log(editor.obterTexto());
// Output: (vazio)

// Refazendo comandos
gerenciador.refazer();
console.log(editor.obterTexto());
// Output: Olá 

gerenciador.refazer();
console.log(editor.obterTexto());
// Output: Olá mundo!
```

Neste exemplo, cada ação do editor (escrever ou apagar texto) é encapsulada em um objeto `Comando`. O `GerenciadorDeComandos` mantém um histórico dessas ações e pode desfazê-las ou refazê-las chamando os métodos apropriados de cada comando. Isso separa completamente a lógica de edição da lógica de gerenciamento de histórico.

## Conclusão

O padrão Command é poderoso para implementar sistemas com histórico de ações, operações reversíveis e filas de tarefas. Ele promove baixo acoplamento ao separar o objeto que invoca uma operação daquele que a executa. É amplamente usado em editores de texto, sistemas de transações, interfaces gráficas com undo/redo e sistemas de macro/script.

Explore os demais padrões de projeto nesta seção para aprofundar seu conhecimento e aprimorar suas habilidades de desenvolvimento de software, com exemplos práticos em TypeScript!
