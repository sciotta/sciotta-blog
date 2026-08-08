# Chamada para o /cyberpunk na Home — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Nota sobre localização deste documento:** o padrão da skill de writing-plans é `docs/superpowers/plans/`, mas neste repositório `docs/` é conteúdo publicado do Docusaurus (wiki pessoal com sidebar autogerada a partir do sistema de arquivos). Um plano ali viraria página pública do site. Por isso este documento fica em `plans/`, na raiz — mesma decisão já tomada para a spec em `specs/`.

**Spec de referência:** `specs/2026-08-08-home-cyberpunk-teaser-design.md`

**Goal:** Adicionar à home uma linha discreta que convida para o terminal CRT em `/cyberpunk`, visível somente para visitantes com apontador de precisão (mouse ou trackpad).

**Architecture:** Alteração contida em dois arquivos existentes — `src/pages/index.js` (um componente local `CyberpunkTeaser`, no mesmo padrão de `SocialIcon` e `GitHubIcon` que já vivem ali) e `src/pages/index.css` (classes `.lab`, `.lab-link`, `.lab-caret`). O elemento fica sempre no HTML; quem decide a visibilidade é o CSS, via `@media (hover: hover) and (pointer: fine)`. Nenhum JavaScript participa da decisão.

**Tech Stack:** React 18 (function components), Docusaurus 3 (site estático; nada aqui toca `window` ou `document`), CSS plano seguindo o padrão já usado em `index.css`.

## Global Constraints

- Sem novos arquivos: tudo em `src/pages/index.js` e `src/pages/index.css`, seguindo a decisão já tomada para a seção de open source.
- Sem novas dependências — `package.json` não muda.
- Sem JavaScript na decisão de visibilidade. O site é estático e servido por CDN; `matchMedia` no cliente ou renderiza depois da pintura (piscada) ou diverge da hidratação.
- Texto exato da chamada, sem parafrasear: `experimento: terminal CRT` seguido de `→`.
- Cores de hover exatas: `#087a7a` no tema claro, `#23e5e5` no escuro. **Não usar `#0a8f8f`** — sobre branco dá ~3,9:1, abaixo do mínimo de 4,5:1 para texto de 12px.
- Cor de repouso: `#767676` no claro e `#bbb` no escuro — os mesmos valores que `.oss-title` já usa no arquivo.
- Link interno, mesma aba: `href="/cyberpunk"` sem `target="_blank"`, como as pills Blog e Wiki.
- **Sem test runner neste projeto** (`package.json` não tem script `test`; não há Jest nem RTL instalado). A verificação é `yarn build` — que também exercita o `onBrokenLinks: 'throw'` de `docusaurus.config.js` — mais inspeção visual no browser. Não há suíte automatizada a escrever.

---

## File Structure

- **Modify `src/pages/index.js`** — adiciona o componente `CyberpunkTeaser` após `GitHubIcon` e o renderiza dentro do `<article>`, logo depois do fechamento da `<section className="oss">`.
- **Modify `src/pages/index.css`** — adiciona o bloco `.lab` / `.lab-link` / `.lab-caret` antes do bloco `/* Dark mode */`, dois overrides no bloco de dark mode, e duas media queries no fim do arquivo.

---

### Task 1: Markup e estilos da chamada

Ao fim desta tarefa a linha aparece em qualquer tamanho de tela. A regra que a esconde no celular é a Task 2 — não a antecipe, senão não há como verificar visualmente o que foi feito aqui.

**Files:**
- Modify: `src/pages/index.js` (108 linhas hoje; `GitHubIcon` termina na linha 24, a `<section className="oss">` fecha na linha 103)
- Modify: `src/pages/index.css` (235 linhas hoje; `/* Dark mode */` começa na linha 168, o bloco dark termina na linha 221, o `@media only screen and (min-width: 600px)` ocupa as linhas 223-235)

**Interfaces:**
- Produces: componente `CyberpunkTeaser` (sem props) e as classes CSS `.home .lab`, `.home .lab-link`, `.home .lab-caret`, mais a animação `lab-blink`. A Task 2 altera a regra de `.home .lab` e a animação de `.home .lab-caret`.

- [ ] **Step 1: Conferir que os arquivos estão como o plano espera**

Ler `src/pages/index.js` e `src/pages/index.css` e localizar os quatro pontos de inserção:

| Arquivo | Marcador | Linha esperada |
|---|---|---|
| `index.js` | fim do componente `GitHubIcon` | 24 |
| `index.js` | `</section>` da seção open source, seguido de `</article>` | 103-104 |
| `index.css` | comentário `/* Dark mode */` | 168 |
| `index.css` | `@media only screen and (min-width: 600px)` | 223 |

Se os números divergirem, siga pelos marcadores de texto — o resto do plano continua válido, porque todas as inserções são descritas em relação a eles.

- [ ] **Step 2: Adicionar o componente `CyberpunkTeaser` em `index.js`**

Inserir logo após o fechamento de `GitHubIcon` (linha 24) e antes de `const openSourceProjects`:

```jsx
const CyberpunkTeaser = () => (
  <div className="lab">
    <a className="lab-link" href="/cyberpunk">
      <span className="lab-caret" aria-hidden="true" />
      experimento: terminal CRT
      <span aria-hidden="true">→</span>
    </a>
  </div>
);
```

Os três filhos do `.lab-link` (o cursor, o texto solto e a seta) viram itens flex — o texto vira um item anônimo. O espaçamento entre eles vem do `gap` no CSS, não de espaços no JSX, então não acrescente `{' '}` em lugar nenhum.

- [ ] **Step 3: Renderizar o componente na home**

Em `index.js`, inserir `<CyberpunkTeaser />` entre o `</section>` que fecha a seção de open source e o `</article>`:

```jsx
          </section>
          <CyberpunkTeaser />
        </article>
```

- [ ] **Step 4: Adicionar o bloco de estilos em `index.css`**

Inserir imediatamente antes do comentário `/* Dark mode */`:

```css
/* Experimento — chamada para /cyberpunk */
.home .lab {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.home .lab-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #767676;
  text-decoration: none;
  transition: color 0.2s ease;
}

.home .lab-link:hover {
  color: #087a7a;
}

.home .lab-caret {
  width: 7px;
  height: 13px;
  background: currentColor;
  animation: lab-blink 1.1s steps(1) infinite;
}

@keyframes lab-blink {
  50% {
    opacity: 0;
  }
}
```

- [ ] **Step 5: Adicionar os overrides de dark mode**

Ainda em `index.css`, no fim do bloco de dark mode — depois da regra `[data-theme='dark'] .home .oss-github-link:hover` e antes do `@media only screen and (min-width: 600px)`:

```css
[data-theme='dark'] .home .lab-link {
  color: #bbb;
}

[data-theme='dark'] .home .lab-link:hover {
  color: #23e5e5;
}
```

- [ ] **Step 6: Subir o dev server e verificar no tema claro**

Run:
```bash
yarn start --port 3001
```

Abrir `http://localhost:3001/` no browser, no tema claro. Esperado:
- a linha `EXPERIMENTO: TERMINAL CRT →` aparece centrada abaixo dos dois cards de open source, em maiúsculas e cinza;
- um bloco sólido pisca à esquerda do texto, com pausas de pouco mais de um segundo;
- passar o mouse sobre a linha muda a cor para o teal `#087a7a`;
- clicar leva a `/cyberpunk` na mesma aba.

- [ ] **Step 7: Verificar no tema escuro**

Alternar o tema do site para escuro e conferir na mesma página. Esperado: a linha fica `#bbb` em repouso e ciano `#23e5e5` no hover.

- [ ] **Step 8: Rodar o build**

Run:
```bash
yarn build
```

Esperado: `[SUCCESS] Generated static files in "build".` sem erro. Se aparecer erro de link quebrado apontando para `/cyberpunk`, é sinal de que `src/pages/cyberpunk.js` não está presente — confirme que a branch saiu de um `main` que já contém o PR #24.

- [ ] **Step 9: Commit**

```bash
git add src/pages/index.js src/pages/index.css
git commit -m "feat: chamada para o terminal /cyberpunk na home"
```

---

### Task 2: Esconder a chamada de quem não tem apontador de precisão

**Files:**
- Modify: `src/pages/index.css`

**Interfaces:**
- Consumes: as classes `.home .lab` e `.home .lab-caret` criadas na Task 1.
- Produces: o comportamento final de visibilidade. Nenhuma tarefa posterior depende de novos nomes.

- [ ] **Step 1: Trocar a regra base de `.home .lab` para escondida**

Em `index.css`, no bloco `/* Experimento — chamada para /cyberpunk */`, substituir:

```css
.home .lab {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
```

por:

```css
.home .lab {
  display: none;
}
```

- [ ] **Step 2: Verificar que a chamada sumiu**

Com o dev server rodando, recarregar `http://localhost:3001/`. Esperado: a linha não aparece mais em nenhum tamanho de tela, e a página termina nos cards de open source. Isso confirma que a regra base pegou — o próximo passo devolve a linha ao desktop.

- [ ] **Step 3: Devolver a chamada a quem tem apontador de precisão**

Acrescentar ao fim de `index.css`, depois do `@media only screen and (min-width: 600px)` que já existe:

```css
/* A chamada só existe para quem tem mouse ou trackpad: a experiência do
   terminal depende de apontar e clicar, e não se sustenta no toque. */
@media (hover: hover) and (pointer: fine) {
  .home .lab {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}
```

A regra precisa vir **depois** da regra base do Step 1: as duas têm a mesma especificidade, então quem vence é a última do arquivo.

- [ ] **Step 4: Desligar a piscada para quem pediu menos movimento**

Acrescentar logo em seguida, no fim do arquivo:

```css
@media (prefers-reduced-motion: reduce) {
  .home .lab-caret {
    animation: none;
  }
}
```

- [ ] **Step 5: Verificar que a chamada voltou no desktop**

Recarregar `http://localhost:3001/` num browser de desktop com mouse. Esperado: a linha voltou a aparecer, idêntica ao que foi verificado na Task 1.

- [ ] **Step 6: Verificar que ela some com emulação de toque**

No Chrome, abrir o DevTools (`Cmd+Opt+I`), ativar a barra de dispositivo (`Cmd+Shift+M`), escolher um preset de celular — iPhone ou Pixel — e recarregar a página. O recarregamento é necessário: a emulação muda como as media queries de ponteiro são avaliadas e a página precisa reavaliá-las.

Esperado: a linha não aparece, e a página termina nos cards de open source, exatamente como antes desta feature.

Para confirmar que é a media query agindo, e não o elemento ter sumido do HTML, rodar no console do DevTools:

```js
document.querySelector('.lab') !== null && getComputedStyle(document.querySelector('.lab')).display
```

Esperado: `"none"` — o elemento está no documento, apenas não é exibido.

- [ ] **Step 7: Verificar a redução de movimento**

Ainda no DevTools, abrir o menu de comandos (`Cmd+Shift+P`), rodar `Emulate CSS prefers-reduced-motion: reduce` e voltar para o modo desktop. Esperado: o bloco do cursor aparece sólido e parado, e o resto da linha continua igual.

Desligar a emulação ao terminar.

- [ ] **Step 8: Rodar o build**

Run:
```bash
yarn build
```

Esperado: `[SUCCESS] Generated static files in "build".` sem erro.

- [ ] **Step 9: Commit**

```bash
git add src/pages/index.css
git commit -m "feat: mostra a chamada do /cyberpunk apenas para apontador de precisao"
```

---

### Task 3: Verificação no build de produção

As tarefas anteriores foram verificadas no dev server. Esta confirma o mesmo comportamento no HTML estático que vai realmente para o ar — é onde um erro de ordem de regras no CSS minificado ou um elemento que não sobreviveu ao SSR apareceria.

**Files:**
- Nenhum arquivo é modificado nesta tarefa.

**Interfaces:**
- Consumes: o resultado das Tasks 1 e 2.

- [ ] **Step 1: Parar o dev server e servir o build**

Run:
```bash
yarn build && yarn serve --port 3001 --no-open
```

- [ ] **Step 2: Confirmar que a chamada está no HTML gerado**

Run:
```bash
grep -o 'class="lab[^"]*"' build/index.html
```

Esperado: as ocorrências de `class="lab"` e `class="lab-link"` — confirma que o elemento é servido no HTML estático para todo mundo, e que a decisão é mesmo do CSS.

- [ ] **Step 3: Conferir a home no browser**

Abrir `http://localhost:3001/` e repetir as checagens que já passaram no dev server: a linha aparece no desktop, nos dois temas, com o hover na cor certa, e some com emulação de celular.

- [ ] **Step 4: Conferir que o destino funciona**

Clicar na linha. Esperado: navega para `/cyberpunk` na mesma aba, e o terminal inicia normalmente — a câmera se aproxima do painel e a tela de cadastro monta.

- [ ] **Step 5: Conferir que a home não regrediu**

Voltar para `/` e confirmar que o resto da página está intacto: logo, frase de intro, pills Blog e Wiki, os três ícones sociais e os dois cards de open source, nos dois temas.

- [ ] **Step 6: Encerrar o servidor**

Run:
```bash
pkill -f "docusaurus serve"
```

- [ ] **Step 7: Marcar o spec como implementado**

Em `specs/2026-08-08-home-cyberpunk-teaser-design.md`, trocar a linha de status:

```markdown
**Status:** Implementado e revisado (branch feat/home-cyberpunk-teaser)
```

- [ ] **Step 8: Commit**

```bash
git add specs/2026-08-08-home-cyberpunk-teaser-design.md plans/2026-08-08-home-cyberpunk-teaser.md
git commit -m "docs: marca a chamada do /cyberpunk como implementada"
```
