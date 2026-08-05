# Feed de Conteúdo (Blog + Wiki) em Masonry na Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Nota sobre localização deste documento:** mesma decisão já tomada nos planos anteriores — fica em `plans/` na raiz do repositório, não em `docs/superpowers/plans/`, porque `docs/` é conteúdo publicado do Docusaurus.

**Spec de referência:** `specs/2026-08-05-homepage-content-feed-design.md`

**Goal:** Adicionar à home um feed misto (posts do blog + páginas da wiki) em masonry sem borda, com 6 itens iniciais e botão "Carregar mais", alimentado por um novo plugin local do Docusaurus que gera os dados em build-time.

**Architecture:** Um plugin Docusaurus local (`plugins/homepage-feed/`) lê `blog/*.md` e `docs/**/*.md` diretamente do disco (com `gray-matter`, sem depender de APIs internas não-documentadas do `@docusaurus/plugin-content-blog`), gera uma lista combinada e ordenada, e expõe via `actions.setGlobalData()`. `src/pages/index.js` lê esses dados com `usePluginData` e controla quantos itens mostrar com `useState`. `src/pages/index.css` estiliza o masonry (colunas CSS, sem borda) e o botão de carregar mais.

**Tech Stack:** Node.js (plugin, roda só em build-time), `gray-matter` (nova devDependency, parsing de frontmatter), React 18 (`useState`, sem novos hooks de bibliotecas externas), CSS plano.

## Global Constraints

- Todos os valores exatos abaixo foram testados manualmente contra os arquivos reais deste repositório antes de entrarem neste plano — não são hipotéticos.
- **Sem test runner configurado neste projeto** — verificação via `yarn build`, inspeção de `.docusaurus/globalData.json` (onde o Docusaurus grava os dados que `setGlobalData` expõe — confirmado rodando `yarn build` neste repo: aparece em `.docusaurus/globalData.json`, uma chave por `name` de plugin), scripts `node -e` pontuais, e inspeção visual manual (light/dark, desktop/mobile).
- Formatação de data deve ser **determinística independente de timezone** (usar `getUTCDate()`/`getUTCMonth()`/`getUTCFullYear()`, nunca os equivalentes locais) — evita mismatch de hidratação entre o HTML gerado no build (SSR) e o React no browser do usuário, que pode estar em outro fuso.
- `gray-matter` já está disponível como dependência transitiva (`node_modules/gray-matter`, versão `4.0.3` resolvida neste repo), mas **precisa ser adicionado como devDependency direta** em `package.json` — depender de uma transitiva não declarada é frágil (pode sumir numa reinstalação futura se a árvore de dependências mudar).
- Nenhuma mudança nas páginas `/blog` ou `/docs` em si — o plugin só lê esse conteúdo, não altera como ele é renderizado.
- Nenhum novo componente/arquivo fora de `plugins/homepage-feed/`, `src/pages/index.js` e `src/pages/index.css` (mais o ajuste pontual em `.github/workflows/documentation.yml`).

---

## File Structure

- **Create `plugins/homepage-feed/excerpt.js`** — função utilitária de geração de resumo a partir de markdown, compartilhada entre blog e wiki.
- **Create `plugins/homepage-feed/blog.js`** — lê `blog/*.md`, retorna itens `{type: 'blog', ...}`.
- **Create `plugins/homepage-feed/wiki.js`** — lê `docs/**/*.md`, retorna itens `{type: 'wiki', ...}`.
- **Create `plugins/homepage-feed/index.js`** — plugin Docusaurus: combina os dois extratores, ordena, expõe via `setGlobalData`.
- **Modify `docusaurus.config.js`** — registra o plugin em `plugins: [...]`.
- **Modify `package.json`** — adiciona `gray-matter` como devDependency.
- **Modify `.github/workflows/documentation.yml`** — `fetch-depth: 0` nos checkouts, pra `git log` funcionar em produção.
- **Modify `src/pages/index.js`** — lê os dados via `usePluginData`, renderiza a seção `feed` com paginação client-side.
- **Modify `src/pages/index.css`** — estilos do masonry sem borda e do botão "Carregar mais".

---

### Task 1: Utilitário de excerpt + dependência `gray-matter`

**Files:**
- Create: `plugins/homepage-feed/excerpt.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `excerpt(markdown, maxLength = 150)` — função pura, recebe uma string markdown e devolve um resumo em texto puro (sem sintaxe markdown), cortado em até `maxLength` caracteres na última palavra completa, com `…` no final se cortado. Usada pelas Tasks 2 e 3.

- [ ] **Step 1: Adicionar `gray-matter` ao `package.json`**

Em `package.json`, dentro de `devDependencies` (que hoje tem `@docusaurus/module-type-aliases` e `@docusaurus/types`), adicionar:

```json
"gray-matter": "^4.0.3",
```

- [ ] **Step 2: Rodar `yarn install` pra confirmar que resolve sem mudar de versão**

Run: `yarn install`
Expected: termina sem erro; `gray-matter` continua resolvendo pra `4.0.3` (`yarn why gray-matter` deve mostrar `4.0.3` como versão instalada).

- [ ] **Step 3: Criar `plugins/homepage-feed/excerpt.js`**

```js
function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/\r/g, '')
    .trim();
}

function excerpt(markdown, maxLength = 150) {
  const text = stripMarkdown(markdown).replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) {
    return text;
  }
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

module.exports = {excerpt};
```

- [ ] **Step 4: Verificar manualmente com um script Node**

Run:
```bash
node -e "
const {excerpt} = require('./plugins/homepage-feed/excerpt');
console.log(excerpt('# Título\n\nUm texto **importante** com [link](http://x.com) e \`código\`.'));
console.log(excerpt('a'.repeat(200)));
"
```
Expected (segunda linha vira 149 \`a\`s + reticências, já que não há espaço pra cortar):
```
Título Um texto importante com link e código.
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa…
```

- [ ] **Step 5: Commit**

```bash
git add package.json yarn.lock plugins/homepage-feed/excerpt.js
git commit -m "feat: add markdown excerpt utility for homepage feed"
```

---

### Task 2: Extrator do blog

**Files:**
- Create: `plugins/homepage-feed/blog.js`

**Interfaces:**
- Consumes: `excerpt` de `./excerpt.js` (Task 1).
- Produces: `getBlogItems()` — retorna um array de `{type: 'blog', title, description, date, permalink, image}`, um item por arquivo em `blog/*.md`. `date` é uma string ISO 8601 UTC. Consumido pela Task 4.

- [ ] **Step 1: Criar `plugins/homepage-feed/blog.js`**

```js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const {excerpt} = require('./excerpt');

const BLOG_DIR = path.resolve(__dirname, '..', '..', 'blog');
const TRUNCATE_MARKER = /<!--\s*truncate\s*-->/;
const FILENAME_DATE = /^(\d{4}-\d{2}-\d{2})-/;

function getBlogItems() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const filePath = path.join(BLOG_DIR, name);
      const raw = fs.readFileSync(filePath, 'utf8');
      const {data: frontmatter, content} = matter(raw);
      const dateMatch = name.match(FILENAME_DATE);
      const beforeTruncate = content.split(TRUNCATE_MARKER)[0];
      return {
        type: 'blog',
        title: frontmatter.title,
        description: excerpt(beforeTruncate),
        date: dateMatch ? new Date(dateMatch[1]).toISOString() : fs.statSync(filePath).mtime.toISOString(),
        permalink: `/blog/${frontmatter.slug}`,
        image: frontmatter.image ?? null,
      };
    });
}

module.exports = {getBlogItems};
```

- [ ] **Step 2: Verificar manualmente contra os 13 posts reais**

Run:
```bash
node -e "
const {getBlogItems} = require('./plugins/homepage-feed/blog');
const items = getBlogItems();
console.log('total:', items.length);
console.log(JSON.stringify(items[0], null, 2));
console.log('sem título:', items.filter((i) => !i.title).length);
console.log('sem imagem:', items.filter((i) => !i.image).length);
console.log('sem permalink válido:', items.filter((i) => !i.permalink.startsWith('/blog/')).length);
"
```
Expected: `total: 13`; o primeiro item impresso tem `type: "blog"`, `title`, `description` (texto corrido sem markdown), `date` no formato `"...T00:00:00.000Z"`, `permalink` começando com `/blog/`, `image` uma URL; as três últimas linhas são todas `0` (nenhum post sem título/imagem/permalink válido nos 13 arquivos atuais).

- [ ] **Step 3: Commit**

```bash
git add plugins/homepage-feed/blog.js
git commit -m "feat: add blog post extractor for homepage feed"
```

---

### Task 3: Extrator da wiki

**Files:**
- Create: `plugins/homepage-feed/wiki.js`

**Interfaces:**
- Consumes: `excerpt` de `./excerpt.js` (Task 1).
- Produces: `getWikiItems()` — retorna um array de `{type: 'wiki', title, description, date, permalink, image: null}`, um item por arquivo `.md` sob `docs/` (recursivo). Consumido pela Task 4.

- [ ] **Step 1: Criar `plugins/homepage-feed/wiki.js`**

```js
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const matter = require('gray-matter');
const {excerpt} = require('./excerpt');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DOCS_DIR = path.join(REPO_ROOT, 'docs');

function listMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listMarkdownFiles(fullPath);
    }
    return entry.name.endsWith('.md') ? [fullPath] : [];
  });
}

function getFileDate(filePath) {
  try {
    const output = execSync(`git log -1 --format=%aI -- "${filePath}"`, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    }).trim();
    if (output) {
      return output;
    }
  } catch (error) {
    // sem histórico git disponível (ex: clone raso) — cai no fallback abaixo
  }
  return fs.statSync(filePath).mtime.toISOString();
}

function derivePermalink(filePath, frontmatter) {
  if (frontmatter.slug) {
    return frontmatter.slug.startsWith('/') ? frontmatter.slug : `/docs/${frontmatter.slug}`;
  }
  const relative = path.relative(DOCS_DIR, filePath).replace(/\\/g, '/');
  let withoutExt = relative.replace(/\.md$/, '');
  if (withoutExt.endsWith('/index')) {
    withoutExt = withoutExt.slice(0, -'/index'.length);
  } else if (withoutExt === 'index') {
    withoutExt = '';
  }
  return `/docs/${withoutExt}`.replace(/\/$/, '') || '/docs';
}

function getTitle(frontmatter, content) {
  if (frontmatter.title) {
    return frontmatter.title;
  }
  const heading = content.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : 'Wiki';
}

function getWikiItems() {
  return listMarkdownFiles(DOCS_DIR).map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const {data: frontmatter, content} = matter(raw);
    return {
      type: 'wiki',
      title: getTitle(frontmatter, content),
      description: excerpt(content),
      date: getFileDate(filePath),
      permalink: derivePermalink(filePath, frontmatter),
      image: null,
    };
  });
}

module.exports = {getWikiItems};
```

- [ ] **Step 2: Verificar manualmente contra os 17 arquivos reais da wiki**

Run:
```bash
node -e "
const {getWikiItems} = require('./plugins/homepage-feed/wiki');
const items = getWikiItems();
console.log('total:', items.length);
items.forEach((i) => console.log(i.permalink, '|', i.title));
"
```
Expected: `total: 17`; a lista inclui (entre outras) `/docs/intro | Wiki Pessoal`, `/docs/patterns | Design Patterns`, `/docs/patterns/singleton | Padrão Singleton`, `/docs/tests | Testes de Software`, `/docs/links-interessantes | 🔗 Links Interessantes` — sem nenhuma linha com `undefined` ou permalink duplicado.

- [ ] **Step 3: Commit**

```bash
git add plugins/homepage-feed/wiki.js
git commit -m "feat: add wiki page extractor for homepage feed"
```

---

### Task 4: Plugin Docusaurus, registro e correção de CI

**Files:**
- Create: `plugins/homepage-feed/index.js`
- Modify: `docusaurus.config.js`
- Modify: `.github/workflows/documentation.yml`

**Interfaces:**
- Consumes: `getBlogItems` (Task 2), `getWikiItems` (Task 3).
- Produces: global data acessível via `usePluginData('homepage-feed-plugin')` — um array ordenado (mais recente primeiro) de itens `{type, title, description, date, permalink, image}`. Consumido pela Task 5.

- [ ] **Step 1: Criar `plugins/homepage-feed/index.js`**

```js
const {getBlogItems} = require('./blog');
const {getWikiItems} = require('./wiki');

module.exports = function homepageFeedPlugin() {
  return {
    name: 'homepage-feed-plugin',
    async loadContent() {
      const items = [...getBlogItems(), ...getWikiItems()];
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return items;
    },
    async contentLoaded({content, actions}) {
      actions.setGlobalData(content);
    },
  };
};
```

- [ ] **Step 2: Registrar o plugin em `docusaurus.config.js`**

Trocar:
```js
  plugins: [],
```
por:
```js
  plugins: ['./plugins/homepage-feed'],
```

- [ ] **Step 3: Adicionar `fetch-depth: 0` ao workflow de deploy**

Em `.github/workflows/documentation.yml`, os dois jobs (`checks` e `gh-release`) têm um step `uses: actions/checkout@v1`. Trocar os dois por:

```yaml
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
```

(Atualiza de `@v1` pra `@v4` — `@v1` está bem desatualizado e não é a forma recomendada de passar `fetch-depth` de qualquer forma; `@v4` é a versão estável atual da action.)

- [ ] **Step 4: Rodar o build e inspecionar os dados gerados**

Run: `yarn build`
Expected: `[SUCCESS] Generated static files in "build".`

Run:
```bash
node -e "
const data = JSON.parse(require('fs').readFileSync('.docusaurus/globalData.json', 'utf8'));
const feed = data['homepage-feed-plugin'].default;
console.log('total:', feed.length);
console.log('primeiro:', feed[0].type, feed[0].date, feed[0].title);
console.log('ordenado:', feed.every((item, i) => i === 0 || new Date(feed[i - 1].date) >= new Date(item.date)));
"
```
Expected: `total: 30` (13 posts + 17 páginas da wiki); `primeiro` mostra o item de data mais recente (hoje, o post `2026-03-22-triagem-automatica-sentry-linear-claude-copilot.md`, a menos que algum arquivo da wiki tenha sido commitado depois — conferir contra `git log -1` se o valor não bater); `ordenado: true`.

- [ ] **Step 5: Commit**

```bash
git add plugins/homepage-feed/index.js docusaurus.config.js .github/workflows/documentation.yml
git commit -m "feat: wire up homepage feed plugin and fix CI checkout depth"
```

---

### Task 5: Renderização do feed em `src/pages/index.js`

**Files:**
- Modify: `src/pages/index.js`

**Interfaces:**
- Consumes: `usePluginData('homepage-feed-plugin')` (Task 4), retornando o array ordenado de itens.

- [ ] **Step 1: Adicionar os imports necessários**

No topo de `src/pages/index.js`, adicionar (mantendo o `import React from 'react';` existente, que passa a incluir `useState`):

```js
import React, {useState} from 'react';
import {usePluginData} from '@docusaurus/useGlobalData';
```

- [ ] **Step 2: Adicionar a função de formatação de data**

Logo após a definição de `openSourceProjects` (antes de `export default function Hello()`), adicionar:

```js
const FEED_MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatFeedDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = FEED_MONTHS_PT[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

const FEED_INITIAL_VISIBLE = 6;
const FEED_LOAD_MORE_BATCH = 6;
```

(Usar `getUTCDate`/`getUTCMonth`/`getUTCFullYear`, não os equivalentes locais — evita mismatch de hidratação entre o HTML gerado no build e o que o React monta no browser do usuário, que pode estar em outro fuso horário.)

- [ ] **Step 3: Ler os dados e controlar a paginação dentro do componente `Hello`**

Dentro de `export default function Hello() { ... }`, logo após `const logoUrl = useLogo();`, adicionar:

```js
  const feedItems = usePluginData('homepage-feed-plugin');
  const [visibleCount, setVisibleCount] = useState(FEED_INITIAL_VISIBLE);
  const visibleFeedItems = feedItems.slice(0, visibleCount);
  const hasMoreFeedItems = visibleCount < feedItems.length;
```

- [ ] **Step 4: Renderizar a seção `feed` depois da seção `oss`**

Dentro de `<article>`, logo depois do `</section>` que fecha `className="oss"` e antes do `</article>` final, adicionar:

```jsx
          <section className="feed">
            <h2 className="feed-title">Conteúdo</h2>
            <div className="feed-grid">
              {visibleFeedItems.map((item) => (
                <article className="feed-item" key={item.permalink}>
                  <a href={item.permalink} className="feed-item-link" aria-label={item.title}>
                    {item.image ? (
                      <img src={item.image} alt="" className="feed-item-image" />
                    ) : (
                      <div className="feed-item-image feed-item-image--fallback" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 4h11a2 2 0 012 2v14H6a2 2 0 01-2-2V4z" />
                          <path d="M4 4a2 2 0 012-2h9v16" />
                        </svg>
                      </div>
                    )}
                    <span className="feed-item-type">{item.type === 'blog' ? 'Artigo' : 'Wiki'}</span>
                    <h3 className="feed-item-title">{item.title}</h3>
                    <p className="feed-item-description">{item.description}</p>
                    <span className="feed-item-date">{formatFeedDate(item.date)}</span>
                  </a>
                </article>
              ))}
            </div>
            {hasMoreFeedItems && (
              <button
                type="button"
                className="feed-load-more"
                onClick={() => setVisibleCount((count) => count + FEED_LOAD_MORE_BATCH)}
              >
                Carregar mais
              </button>
            )}
          </section>
```

- [ ] **Step 5: Verificar que o build não quebra**

Run: `yarn build`
Expected: `[SUCCESS] Generated static files in "build".`, sem erros (em particular, sem warning de hidratação — o build estático não roda hidratação, mas confirma que o JSX está sintaticamente correto e que `feedItems` não é `undefined` no momento da renderização, já que o build falharia com "Cannot read properties of undefined" se o plugin não estivesse registrado corretamente).

- [ ] **Step 6: Verificar visualmente (sem estilo ainda)**

Run: `yarn start`, abrir `http://localhost:3000/`.
Expected: abaixo da seção "Projetos Open Source", aparecem — sem estilo de masonry ainda, só a ordem do DOM — o texto "Conteúdo" e 6 itens (título completo, resumo, data, e "Artigo"/"Wiki" como rótulo), cada um levando pra URL correspondente ao clicar. Um botão "Carregar mais" aparece depois dos 6; clicar nele revela mais 6 itens e, quando não sobra mais nada (30 itens no total), o botão desaparece. Nenhum erro no console do browser.

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.js
git commit -m "feat: render mixed blog+wiki feed with load-more on homepage"
```

---

### Task 6: Estilos do masonry sem borda e do botão "Carregar mais"

**Files:**
- Modify: `src/pages/index.css`

**Interfaces:**
- Consumes: classes `feed`, `feed-title`, `feed-grid`, `feed-item`, `feed-item-link`, `feed-item-image`, `feed-item-image--fallback`, `feed-item-type`, `feed-item-title`, `feed-item-description`, `feed-item-date`, `feed-load-more` produzidas no JSX da Task 5.

- [ ] **Step 1: Adicionar os estilos base (modo claro)**

No final de `src/pages/index.css`, antes do bloco `@media only screen and (min-width: 600px)` existente, adicionar:

```css
/* Content feed (blog + wiki) */
.home .feed {
  margin-top: 56px;
  text-align: left;
}

.home .feed-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #767676;
  font-weight: 600;
  margin: 0 0 20px;
  text-align: center;
}

.home .feed-grid {
  column-count: 1;
  column-gap: 24px;
}

.home .feed-item {
  break-inside: avoid;
  margin-bottom: 24px;
}

.home .feed-item-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.home .feed-item-image {
  display: block;
  width: 100%;
  border-radius: 4px;
  margin-bottom: 8px;
  object-fit: cover;
}

.home .feed-item-image--fallback {
  height: 96px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
}

.home .feed-item-type {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
}

.home .feed-item-title {
  font-weight: 700;
  font-size: 14px;
  line-height: 1.35;
  margin: 2px 0 0;
}

.home .feed-item-description {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  margin: 6px 0 0;
}

.home .feed-item-date {
  display: block;
  font-size: 11px;
  color: #999;
  margin-top: 6px;
}

.home .feed-load-more {
  display: block;
  margin: 8px auto 0;
  padding: 10px 32px;
  border: 1.5px solid #333;
  border-radius: 8px;
  background: none;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.home .feed-load-more:hover {
  border-color: #000;
}
```

- [ ] **Step 2: Adicionar os overrides de dark mode**

Dentro do bloco `/* Dark mode */` já existente, depois das regras de `.oss-github-link`, adicionar:

```css
[data-theme='dark'] .home .feed-title {
  color: #bbb;
}

[data-theme='dark'] .home .feed-item-image--fallback {
  background: #2a2a2a;
  color: #555;
}

[data-theme='dark'] .home .feed-item-type,
[data-theme='dark'] .home .feed-item-date {
  color: #999;
}

[data-theme='dark'] .home .feed-item-description {
  color: #aaa;
}

[data-theme='dark'] .home .feed-load-more {
  border-color: #ccc;
  color: #ccc;
}

[data-theme='dark'] .home .feed-load-more:hover {
  border-color: #fff;
}
```

- [ ] **Step 3: Adicionar o breakpoint responsivo**

Dentro do bloco `@media only screen and (min-width: 600px) { ... }` já existente, adicionar:

```css
  .home .feed-grid {
    column-count: 3;
  }
```

- [ ] **Step 4: Verificar visualmente — desktop, light e dark**

Run: `yarn start`, abrir `http://localhost:3000/` com a janela larga (≥600px).
Expected: os itens do feed aparecem em 3 colunas, sem nenhuma borda visível, separados só por espaço; imagens reais de capa aparecem pros posts, um bloco cinza claro com ícone de documento aparece pras páginas da wiki. Alternar pra dark mode: bloco de fallback fica escuro, textos claros, botão "Carregar mais" com borda clara. Botão "Carregar mais" tem a mesma aparência (8px de raio, hover só na borda) dos botões Blog/Wiki.

- [ ] **Step 5: Verificar visualmente — mobile**

Redimensionar a janela (ou DevTools em modo responsivo) pra menos de 600px.
Expected: o feed cai pra 1 coluna, sem overflow horizontal, título e resumo continuam legíveis.
Parar o dev server depois de confirmar.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.css
git commit -m "style: add masonry feed styles (no borders, load more, dark mode)"
```

---

### Task 7: Verificação final end-to-end

**Files:**
- Nenhum arquivo novo — apenas verificação sobre o resultado das Tasks 1-6.

- [ ] **Step 1: Build de produção**

Run: `yarn build`
Expected: `[SUCCESS] Generated static files in "build".`, sem warnings novos.

- [ ] **Step 2: Servir o build e abrir no browser**

Run: `yarn serve`, abrir a URL impressa no terminal.

- [ ] **Step 3: Checklist do feed**

- 6 itens aparecem de imediato, misturando tipo "Artigo" e "Wiki".
- Título aparece completo (sem cortar/ellipsis), mesmo os mais longos (ex: "Automatizei a triagem de bugs: Sentry detecta, Linear organiza, Copilot resolve").
- Resumo de 1-2 linhas aparece abaixo do título, tanto em posts quanto em páginas da wiki.
- Clicar em um item de blog leva pra URL `/blog/<slug>` correspondente; clicar num item de wiki leva pra `/docs/<caminho>` correspondente.
- Clicar em "Carregar mais" revela mais 6 itens; repetir até esgotar os 30 (13 posts + 17 páginas) — o botão desaparece nesse ponto.
- Nenhum item tem borda; a separação entre colunas/itens é só espaço.
- Página da wiki sem imagem mostra o bloco cinza com ícone; posts do blog mostram a imagem real.

- [ ] **Step 4: Confirmar que a seção Open Source não foi afetada**

Visualmente, a seção "Projetos Open Source" (cards com borda, criada em #20/#21) continua exatamente igual — nenhuma classe `.oss-*` foi tocada nas Tasks 5/6.

- [ ] **Step 5: Encerrar o servidor**

Parar o processo do `yarn serve`.

Nenhum commit nesta task — é só verificação. Se algum item falhar, voltar à task correspondente, corrigir, e repetir a Task 7 do zero.
