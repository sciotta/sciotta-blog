# Harmonização da Parte Superior da Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Nota sobre localização deste documento:** mesma decisão já tomada nos planos anteriores — fica em `plans/` na raiz do repositório, não em `docs/superpowers/plans/`, porque `docs/` é conteúdo publicado do Docusaurus (wiki pessoal com sidebar autogerada a partir do sistema de arquivos).

**Spec de referência:** `specs/2026-08-05-homepage-upper-harmonization-design.md`

**Goal:** Ajustar `src/pages/index.css` para que os botões Blog/Wiki, o subtítulo e o espaçamento acima da seção "Projetos Open Source" usem a mesma linguagem visual discreta já estabelecida nos cards dessa seção (PR #20).

**Architecture:** Alteração pontual em um único arquivo CSS já existente — nenhuma mudança de JSX, nenhum novo arquivo, nenhuma nova dependência. Cinco blocos de regras são editados: `.home .intro`, `.home .link-pill`, `.home .link-pill:hover`, `.home .oss`, e o override de dark mode `.home .link-pill:hover` / a remoção do override `.home .oss` no escuro.

**Tech Stack:** CSS plano (sem CSS-in-JS), mesmo arquivo `src/pages/index.css` já usado pela home.

## Global Constraints

- Único arquivo tocado: `src/pages/index.css`. `src/pages/index.js` não muda.
- Sem novas dependências, sem novos seletores fora dos já listados na spec.
- **Sem test runner configurado neste projeto** — verificação via `yarn build` + inspeção visual manual (light mode, dark mode), mesma convenção já usada nos planos anteriores deste repositório.
- Valores exatos (copiados verbatim da spec, `specs/2026-08-05-homepage-upper-harmonization-design.md`):
  - `.home .intro` → `font-size: 16px` (era `20px`); demais propriedades inalteradas.
  - `.home .link-pill` → `border-radius: 8px` (era `999px`); demais propriedades inalteradas.
  - `.home .link-pill:hover` → `border-color: #000; text-decoration: none;` (remove `background: #333;` e `color: #fff;`).
  - `[data-theme='dark'] .home .link-pill:hover` → `border-color: #fff;` (remove `background: #f0f0f0;` e `color: #1a1a1a;`).
  - `.home .oss` → `margin-top: 64px;` (era `40px`); remove `padding-top: 32px;` e `border-top: 1px solid #eee;`; `text-align: left` inalterado.
  - `[data-theme='dark'] .home .oss { border-top-color: #333; }` → regra inteira **removida** (não há mais borda a estilizar).

---

## File Structure

- **Modify `src/pages/index.css`** — apenas os cinco blocos de regras listados acima. Nenhum novo seletor é criado; nenhum seletor existente muda de nome.

---

### Task 1: Harmonizar botões, subtítulo e espaçamento em `index.css`

**Files:**
- Modify: `src/pages/index.css` (arquivo inteiro tem 244 linhas atualmente, conteúdo de referência abaixo)

**Interfaces:**
- Consumes: nenhuma — edição direta de regras CSS já existentes, sem depender de nenhuma outra task.
- Produces: nenhuma interface nova — este é o único task do plano.

- [x] **Step 1: Confirmar que o arquivo não mudou desde a spec**

Ler `src/pages/index.css` e confirmar que os seguintes blocos existem com o conteúdo abaixo (se algo divergir, PARAR e reportar NEEDS_CONTEXT em vez de adivinhar):

```css
.home .intro {
  font-size: 20px;
  color: #555;
  margin-bottom: 32px;
  line-height: 1.6;
}
```

```css
.home .link-pill {
  display: inline-block;
  padding: 10px 32px;
  border: 1.5px solid #333;
  border-radius: 999px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.home .link-pill:hover {
  background: #333;
  color: #fff;
  text-decoration: none;
}
```

```css
.home .oss {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #eee;
  text-align: left;
}
```

```css
[data-theme='dark'] .home .link-pill {
  border-color: #ccc;
  color: #ccc;
}

[data-theme='dark'] .home .link-pill:hover {
  background: #f0f0f0;
  color: #1a1a1a;
}
```

```css
[data-theme='dark'] .home .oss {
  border-top-color: #333;
}
```

- [x] **Step 2: Reduzir o subtítulo**

Em `.home .intro`, trocar `font-size: 20px;` por `font-size: 16px;`. Nenhuma outra propriedade do bloco muda:

```css
.home .intro {
  font-size: 16px;
  color: #555;
  margin-bottom: 32px;
  line-height: 1.6;
}
```

- [x] **Step 3: Suavizar o raio dos botões e trocar o hover para "só borda"**

Em `.home .link-pill`, trocar `border-radius: 999px;` por `border-radius: 8px;`. Em `.home .link-pill:hover`, substituir o bloco inteiro:

```css
.home .link-pill {
  display: inline-block;
  padding: 10px 32px;
  border: 1.5px solid #333;
  border-radius: 8px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.home .link-pill:hover {
  border-color: #000;
  text-decoration: none;
}
```

- [x] **Step 4: Espelhar o hover no dark mode**

Substituir `[data-theme='dark'] .home .link-pill:hover` (o bloco `[data-theme='dark'] .home .link-pill` que define `border-color`/`color` da base **não muda**, só o `:hover`):

```css
[data-theme='dark'] .home .link-pill {
  border-color: #ccc;
  color: #ccc;
}

[data-theme='dark'] .home .link-pill:hover {
  border-color: #fff;
}
```

- [x] **Step 5: Remover a linha divisória acima de "Projetos Open Source"**

Em `.home .oss`, remover `padding-top: 32px;` e `border-top: 1px solid #eee;`, e trocar `margin-top: 40px;` por `margin-top: 64px;`:

```css
.home .oss {
  margin-top: 64px;
  text-align: left;
}
```

Remover completamente o bloco `[data-theme='dark'] .home .oss { border-top-color: #333; }` (não sobra nenhuma propriedade dark-mode-específica para `.oss` em si — os filhos como `.oss-title`, `.oss-card` etc. mantêm seus próprios overrides de dark mode, que não mudam nesta task).

- [x] **Step 6: Verificar que o build não quebra**

Run: `yarn build`
Expected: termina com `[SUCCESS] Generated static files in "build".`, sem erros.

- [x] **Step 7: Verificar visualmente — light mode**

Run: `yarn start`, abrir `http://localhost:3000/`.
Expected:
- Os botões "Blog" e "Wiki" aparecem como retângulos de cantos arredondados (8px, não mais cápsula), com borda `#333`.
- Passar o mouse sobre um botão escurece a borda para preto (`#000`) — o botão **não** fica com fundo preto/texto branco como antes.
- O texto "Software developer, building things for the web." está visivelmente menor que antes (16px), mais próximo da escala do resto da página.
- Não há mais nenhuma linha horizontal entre os ícones sociais e o título "PROJETOS OPEN SOURCE" — só espaço.

- [x] **Step 8: Verificar visualmente — dark mode**

No mesmo browser, alternar para dark mode (toggle do Docusaurus no navbar de qualquer página que não seja a home, já que a home não renderiza `<Layout>`/navbar — ou definir `data-theme="dark"` via DevTools no `<html>` e recarregar `/`).
Expected:
- Botões com borda `#ccc`; hover clareia a borda para `#fff` (sem inverter para fundo claro/texto escuro como antes).
- Nenhuma linha divisória acima da seção Open Source (mesma ausência de borda que no claro).
Parar o dev server depois de confirmar.

- [x] **Step 9: Commit**

```bash
git add src/pages/index.css
git commit -m "style: harmonize homepage buttons, subtitle and spacing with oss section"
```
