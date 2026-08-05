# Harmonização da parte superior da home com a seção Open Source

**Data:** 2026-08-05
**Status:** Implementado e revisado (branch harmonize-homepage-upper)

## Objetivo

Depois de #20 (seção "Projetos Open Source"), a parte de cima da home (logo, subtítulo, botões Blog/Wiki, ícones sociais) ficou com uma linguagem visual destoante da nova seção: botões 100% arredondados com hover que inverte pra preto sólido, subtítulo bem maior que qualquer outro texto da página, e uma borda separando abruptamente as duas metades. O objetivo é aproximar as duas partes — mesma linguagem de forma, cor e espaçamento — sem perder a simplicidade/minimalismo que já é a identidade do site.

## Escopo

Alteração restrita a `src/pages/index.css` (nenhuma mudança de estrutura/JSX é necessária — `src/pages/index.js` não muda). Não inclui:
- Mudança de conteúdo (texto do subtítulo, labels dos botões, ícones sociais).
- Mudança de layout/posicionamento dos elementos (ordem continua: logo → subtítulo → botões → ícones sociais → projetos).
- Qualquer alteração na seção "Projetos Open Source" em si (ela já está no estado desejado — é a referência para harmonizar o resto).

## Decisões de design (validadas visualmente com o usuário)

Todas as alternativas foram exploradas via mockups no companion visual de brainstorming antes de serem fechadas:

1. **Botões Blog/Wiki viram "cards":** o raio de canto passa de totalmente arredondado (`border-radius: 999px`) para `8px` — o mesmo raio usado em `.oss-card`. O hover deixa de preencher o botão com fundo sólido preto/branco e passa a apenas escurecer (claro) / clarear (escuro) a borda, exatamente como `.oss-card:hover` já faz. O texto do botão não muda de cor no hover.
2. **Subtítulo reduzido:** o tamanho do texto "Software developer, building things for the web." cai de `20px` para `16px`. Cor, `line-height` e `margin-bottom` permanecem os mesmos — a mudança é só de escala, pra não competir tanto com o resto da página, que vai de 11px a 15px.
3. **Sem linha divisória:** a borda (`border-top: 1px solid #eee` / `#333` no escuro) que hoje separa os ícones sociais da seção "Projetos Open Source" é removida. A separação entre os dois blocos passa a ser feita só por espaçamento generoso (`margin-top`), sem elemento visual desenhado — mais minimalista, a quebra fica implícita.

## Valores exatos (antes → depois)

### `.home .intro`

| Propriedade | Antes | Depois |
|---|---|---|
| `font-size` | `20px` | `16px` |

Demais propriedades (`color: #555`, `margin-bottom: 32px`, `line-height: 1.6`) não mudam.

### `.home .link-pill`

| Propriedade | Antes | Depois |
|---|---|---|
| `border-radius` | `999px` | `8px` |

Demais propriedades (`padding: 10px 32px`, `border: 1.5px solid #333`, `color: #333`, `font-size: 16px`, `font-weight: 600`, `text-decoration: none`, `transition: all 0.2s ease`) não mudam.

### `.home .link-pill:hover`

| Antes | Depois |
|---|---|
| `background: #333; color: #fff; text-decoration: none;` | `border-color: #000; text-decoration: none;` |

O botão deixa de inverter para preenchimento sólido; só a borda escurece (de `#333` para `#000`), replicando o padrão de `.oss-card:hover { border-color: #333; }` (que vai de `#ddd` para `#333`) — aqui a base já é mais escura (`#333`), então o hover vai um degrau além, para `#000`.

### `[data-theme='dark'] .home .link-pill:hover`

| Antes | Depois |
|---|---|
| `background: #f0f0f0; color: #1a1a1a;` | `border-color: #fff;` |

Espelha o mesmo raciocínio no escuro: a borda clareia de `#ccc` (base) para `#fff` no hover, em vez de inverter o preenchimento.

### `.home .oss`

| Propriedade | Antes | Depois |
|---|---|---|
| `margin-top` | `40px` | `64px` |
| `padding-top` | `32px` | *(removida)* |
| `border-top` | `1px solid #eee` | *(removida)* |

`text-align: left` não muda.

### `[data-theme='dark'] .home .oss`

A regra inteira `[data-theme='dark'] .home .oss { border-top-color: #333; }` é **removida** — não há mais borda para estilizar no escuro.

## Fora de escopo / não perguntado

- Espaçamento interno entre logo/subtítulo/botões/ícones sociais (`margin-bottom` de `.logo`, `.intro`, `.links`): já eram múltiplos de 8px (`32px`, `32px`, `40px`) — não precisam mudar para ficarem "alinhados", então permanecem como estão.
- Tamanho/estilo dos ícones sociais: não foi mencionado como parte do pedido ("botões, subtítulo e espaçamentos") e não apareceu como ponto de atrito nos mockups revisados — permanece igual.
- Foco via teclado (`:focus-visible`) nos botões: não alterado nesta mudança: o outline padrão do navegador já contorna o botão inteiro corretamente hoje, e a mudança de raio/hover não afeta isso.

## Critério de verificação

- `yarn start`: botões aparecem como retângulos de canto arredondado (8px), hover só escurece/clareia a borda (sem preencher), em light e dark mode.
- Subtítulo visualmente menor, mais próximo da escala do resto da página.
- Não há mais linha horizontal entre os ícones sociais e "Projetos Open Source" — a separação é só espaço, mas os dois blocos continuam visualmente distintos.
- `yarn build` conclui sem erros.
