---
slug: abortcontroller-javascript-cancelar-qualquer-coisa
title: "AbortController: A API mais subestimada do JavaScript"
author: Thiago Sciotta
author_title: Principal Engineer
author_url: https://github.com/thiagog3
author_image_url: https://avatars.githubusercontent.com/u/1863045?v=4
tags: [javascript, webdev, react, performance, clean-code]
image: https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200
enableComments: true
---

Todo mundo conhece o `AbortController` pra cancelar `fetch()`. Beleza, caso de uso clássico. Mas se isso é tudo que você sabe, tá usando 10% do que ele oferece.

O `AbortController` é um **primitivo universal de cancelamento**. Ele cancela fetch, event listeners, streams, operações de arquivo no Node.js, e qualquer coisa async que aceite um `signal`. E o padrão é sempre o mesmo: criar, passar, cancelar.

<!--truncate-->

## O básico que todo mundo conhece

```javascript
const controller = new AbortController();

fetch('/api/data', { signal: controller.signal });

// Precisa cancelar? Uma linha:
controller.abort();
```

Três passos. Sempre os mesmos. Mas o que pouca gente sabe é que esse mesmo padrão funciona em **muito mais lugares**.

## 1. Event listeners com auto-remoção

Já escreveu isso?

```javascript
el.addEventListener('click', handler);
el.addEventListener('keydown', handler);
el.addEventListener('scroll', handler);

// Depois, lá embaixo no código...
el.removeEventListener('click', handler);
el.removeEventListener('keydown', handler);
el.removeEventListener('scroll', handler);
```

Verbose demais. E fácil de esquecer. Com `AbortController`:

```javascript
const ctrl = new AbortController();

el.addEventListener('click', handler, { signal: ctrl.signal });
el.addEventListener('keydown', handler, { signal: ctrl.signal });
el.addEventListener('scroll', handler, { signal: ctrl.signal });

// Um abort() remove TODOS de uma vez
ctrl.abort();
```

Um `abort()` limpa tudo. Sem precisar guardar referência de cada listener. Essa feature existe desde 2021 e a maioria dos devs não sabe.

## 2. React useEffect sem memory leak

Esse aqui é clássico. Quantas vezes você já viu (ou escreveu) isso?

```javascript
// ❌ Memory leak: seta state em componente desmontado
useEffect(() => {
  fetch('/api/users')
    .then(r => r.json())
    .then(setUsers);
}, []);
```

O componente desmonta, o fetch termina, e o React reclama que você tá tentando atualizar state de um componente que não existe mais. A fix:

```javascript
// ✅ Cleanup correto: cancela no unmount
useEffect(() => {
  const ctrl = new AbortController();

  fetch('/api/users', { signal: ctrl.signal })
    .then(r => r.json())
    .then(setUsers)
    .catch(e => {
      if (e.name !== 'AbortError') throw e;
    });

  return () => ctrl.abort();
}, []);
```

O `return () => ctrl.abort()` é chamado automaticamente quando o componente desmonta. O fetch é cancelado. Sem memory leak. Sem warning no console.

## 3. Timeout nativo com AbortSignal.timeout()

Antes, pra colocar timeout num fetch, você precisava de um `setTimeout` + `AbortController` manual. Agora:

```javascript
// Cancela automaticamente depois de 5 segundos
const res = await fetch('/api/slow-endpoint', {
  signal: AbortSignal.timeout(5000)
});
```

Uma linha. Sem `setTimeout`. Sem cleanup. Built into the platform.

## 4. Combinar múltiplos sinais com AbortSignal.any()

E se você precisa cancelar uma requisição se **o usuário clicar em cancelar** OU **se passar 5 segundos**? 

```javascript
const ctrl = new AbortController();
const timeoutSignal = AbortSignal.timeout(5000);

const combined = AbortSignal.any([
  ctrl.signal,    // cancelamento manual
  timeoutSignal   // timeout de 5s
]);

// Aborta se: usuário cancela OU timeout
await fetch('/api/data', { signal: combined });
```

`AbortSignal.any()` combina múltiplas condições de cancelamento. Suportado em todos os browsers modernos desde 2024.

## 5. Cancelar streams

Download grande que o usuário quer cancelar no meio?

```javascript
const ctrl = new AbortController();

const response = await fetch('/api/large-file', {
  signal: ctrl.signal
});

const reader = response.body.getReader();

// Usuário clica em "Cancelar download"
ctrl.abort(); // Stream para imediatamente
```

O stream é interrompido na hora. Sem esperar o download terminar. Sem desperdiçar banda.

## 6. Operações de arquivo no Node.js

No backend também funciona:

```javascript
import { readFile } from 'fs/promises';

const ctrl = new AbortController();

// Cancela se demorar mais de 1 segundo
setTimeout(() => ctrl.abort(), 1000);

const data = await readFile('huge-file.txt', {
  signal: ctrl.signal
});
```

## O padrão universal

Não importa o que você tá cancelando. O padrão é **sempre** o mesmo:

```
1. Criar:   const ctrl = new AbortController()
2. Passar:  { signal: ctrl.signal }
3. Cancelar: ctrl.abort()
```

Um controller. Múltiplas operações. Um `abort()` cancela tudo.

## Quando usar

| Cenário | Sem AbortController | Com AbortController |
|---------|-------------------|-------------------|
| Cleanup de listeners | `removeEventListener()` pra cada um | Um `abort()` remove todos |
| React unmount | Memory leak ou flag `isMounted` | `return () => ctrl.abort()` |
| Timeout em fetch | `setTimeout` + controller manual | `AbortSignal.timeout(ms)` |
| Cancelar múltiplas condições | Lógica custom complexa | `AbortSignal.any([...])` |
| Download cancelável | Flag manual + check no loop | `ctrl.abort()` no botão |

## Quando NÃO usar

- **Operações síncronas** — AbortController é pra async. Se é síncrono, não precisa.
- **Fire and forget** — Se você não precisa cancelar, não complique. Nem toda requisição precisa de um controller.
- **Quando o cleanup não importa** — Se o componente não vai desmontar, se a página vai recarregar, não adicione complexidade desnecessária.

Como sempre: use quando resolve um problema real, não pra mostrar que sabe.

---

O `AbortController` é provavelmente a API mais subestimada do JavaScript. Todo mundo conhece o caso de uso básico, mas quase ninguém explora o potencial completo. É simples, elegante, e já tá no seu browser. Só falta usar.
