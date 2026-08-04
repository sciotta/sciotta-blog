# Destaque de Projetos Open Source na Home — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Nota sobre localização deste documento:** o padrão da skill de writing-plans é salvar em `docs/superpowers/plans/`, mas neste repositório `docs/` é conteúdo publicado do Docusaurus (wiki pessoal com sidebar autogerada a partir do sistema de arquivos). Salvar o plano ali faria com que ele virasse uma página pública do site. Por isso este documento fica em `plans/`, na raiz do repositório — mesma decisão já tomada para a spec em `specs/`.

**Spec de referência:** `specs/2026-08-04-homepage-open-source-projects-design.md`

**Goal:** Adicionar à home (`src/pages/index.js`) uma seção "Projetos Open Source" com dois cards (tokens-to-styles e color-doctor), cada um linkando ao site do projeto e, via ícone separado, ao repositório no GitHub.

**Architecture:** Alteração contida em dois arquivos existentes — `src/pages/index.js` (dados + JSX) e `src/pages/index.css` (estilos) — sem novos componentes, páginas ou dependências. Os dois cards vêm de um array de dados mapeado via `.map()`, evitando duplicar JSX. Cada card usa o padrão "stretched link" (link absoluto cobrindo o card inteiro para o site do projeto, com um segundo link menor por cima, em `z-index` maior, para o GitHub) para evitar `<a>` aninhado.

**Tech Stack:** React 18 (function components), Docusaurus 3 (SSR-safe: nenhum código deve assumir `window`/`document` fora de `useIsBrowser`, mas esta feature não precisa de acesso ao browser), CSS plano (sem CSS-in-JS, sem Tailwind) seguindo o padrão já usado em `index.css`.

## Global Constraints

- Sem novos componentes/arquivos: tudo em `src/pages/index.js` e `src/pages/index.css` (decisão explícita da spec).
- Sem novas dependências (`package.json` não muda).
- Sem cor de destaque: reaproveitar a paleta já usada (`#1a1a1a`/`#333`/`#666`/`#999`/`#ddd`/`#eee` no claro; `#f5f5f5`/`#ccc`/`#999`/`#444`/`#333` no escuro), igual ao restante de `index.css`.
- Reaproveitar o path SVG do ícone do GitHub já existente em `SocialIcon` — não duplicar o `<path>`.
- Todos os links externos usam `target="_blank" rel="noopener noreferrer"`, como já é o padrão em `SocialIcon`.
- **Sem test runner configurado neste projeto** (`package.json` não tem script `test`; não há Jest/RTL instalado). Verificação é manual: `yarn build` (pega erros de build/links quebrados, já que `onBrokenLinks: 'throw'` está ativo em `docusaurus.config.js`) + inspeção visual via `yarn start` e o browser. Não há suíte automatizada a escrever nesta feature.
- Copy exata dos dois projetos (não parafrasear):
  - **tokens-to-styles** — "Converte tokens de design em variáveis CSS prontas para uso, mantendo Figma e código sincronizados." — site `https://tokens-to-styles.sciotta.com.br/` — repo `https://github.com/sciotta/tokens-to-styles`
  - **color-doctor** — "Mapeia e simplifica a paleta de cores do seu projeto React com um único comando." — site `https://color-doctor.sciotta.com.br/` — repo `https://github.com/sciotta/color-doctor`

---

## File Structure

- **Modify `src/pages/index.js`** — extrai o ícone do GitHub para um componente `GitHubIcon`, adiciona o array `openSourceProjects`, e renderiza a nova `<section className="oss">` após a `<nav className="social-nav">` existente.
- **Modify `src/pages/index.css`** — adiciona as classes `.oss`, `.oss-title`, `.oss-grid`, `.oss-card`, `.oss-site-link`, `.oss-card-body`, `.oss-card-name`, `.oss-card-description`, `.oss-card-url`, `.oss-github-link`, com overrides de dark mode e o breakpoint responsivo de 600px já usado no arquivo.

---

### Task 1: Ícone do GitHub reutilizável, dados dos projetos e markup (sem estilo)

**Files:**
- Modify: `src/pages/index.js` (arquivo inteiro tem 57 linhas atualmente; ver conteúdo de referência abaixo)

**Interfaces:**
- Produces: componente `GitHubIcon({ size })` (default `size = 24`), array `openSourceProjects` (cada item: `{ name, description, siteUrl, githubUrl }`), nova `<section className="oss">` renderizada dentro de `<div className="home">` logo após `<nav className="social-nav">`.

- [x] **Step 1: Ler o arquivo atual para confirmar que não mudou desde a spec**

Conteúdo atual de referência (`src/pages/index.js`, 57 linhas): componente `Hello` renderiza `<div className="home"><section><article>` com logo, `<p className="intro">`, `<div className="links">` (pills Blog/Wiki), e `<nav className="social-nav">` com três `<SocialIcon>` (LinkedIn, GitHub, YouTube), cada um com um `<svg>` inline.

- [x] **Step 2: Extrair o ícone do GitHub para um componente `GitHubIcon`**

Substituir o `<svg>` inline do GitHub dentro do `SocialIcon href="https://github.com/thiagog3"` por um componente reutilizável. Adicionar logo após a definição de `SocialIcon`:

```jsx
const GitHubIcon = ({ size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
```

E trocar o `<svg>` inline dentro do `SocialIcon` do GitHub (dentro de `<nav className="social-nav">`) por:

```jsx
<SocialIcon href="https://github.com/thiagog3" label="GitHub">
  <GitHubIcon />
</SocialIcon>
```

(Mantém o mesmo `href`/`label` que já existia — só troca o conteúdo do `<svg>` inline pelo componente.)

- [x] **Step 3: Adicionar o array `openSourceProjects`**

Logo após a definição de `GitHubIcon`, adicionar:

```jsx
const openSourceProjects = [
  {
    name: 'tokens-to-styles',
    description: 'Converte tokens de design em variáveis CSS prontas para uso, mantendo Figma e código sincronizados.',
    siteUrl: 'https://tokens-to-styles.sciotta.com.br/',
    githubUrl: 'https://github.com/sciotta/tokens-to-styles',
  },
  {
    name: 'color-doctor',
    description: 'Mapeia e simplifica a paleta de cores do seu projeto React com um único comando.',
    siteUrl: 'https://color-doctor.sciotta.com.br/',
    githubUrl: 'https://github.com/sciotta/color-doctor',
  },
];
```

- [x] **Step 4: Renderizar a seção `oss` após `<nav className="social-nav">`**

Dentro de `<article>`, logo depois do `</nav>` que fecha `social-nav` e antes do `</article>`, adicionar:

```jsx
<section className="oss">
  <h2 className="oss-title">Projetos Open Source</h2>
  <div className="oss-grid">
    {openSourceProjects.map((project) => (
      <div className="oss-card" key={project.name}>
        <a
          href={project.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="oss-site-link"
          aria-label={`Abrir ${project.name}`}
        />
        <div className="oss-card-body">
          <span className="oss-card-name">{project.name}</span>
          <p className="oss-card-description">{project.description}</p>
          <span className="oss-card-url">
            {project.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
          </span>
        </div>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="oss-github-link"
          aria-label={`Repositório no GitHub de ${project.name}`}
        >
          <GitHubIcon size={16} />
        </a>
      </div>
    ))}
  </div>
</section>
```

- [x] **Step 5: Verificar que o build não quebra**

Run: `yarn build`
Expected: termina com `[SUCCESS] Generated static files in "build".` e sem erros — em particular sem erro de link quebrado (os links são todos externos, `onBrokenLinks: 'throw'` não se aplica a eles).

- [x] **Step 6: Verificar visualmente (sem estilo ainda)**

Run: `yarn start` (mantém rodando em background), depois abrir `http://localhost:3000/` no browser.
Expected: a home carrega normalmente (logo, intro, pills, ícones sociais inalterados) e, abaixo dos ícones sociais, aparecem — sem estilo de card ainda — o texto "Projetos Open Source" e, para cada projeto, nome / descrição / URL abreviada, cada um clicável levando ao site correspondente. Nenhum erro no console do browser.
Parar o dev server depois de confirmar (`Ctrl+C` ou encerrar o processo em background).

- [x] **Step 7: Commit**

```bash
git add src/pages/index.js
git commit -m "feat: add open source projects section markup to homepage"
```

---

### Task 2: Estilizar a seção `oss` (light, dark, responsivo)

**Files:**
- Modify: `src/pages/index.css` (arquivo inteiro tem 111 linhas atualmente)

**Interfaces:**
- Consumes: classes `.oss`, `.oss-title`, `.oss-grid`, `.oss-card`, `.oss-site-link`, `.oss-card-body`, `.oss-card-name`, `.oss-card-description`, `.oss-card-url`, `.oss-github-link` produzidas no JSX da Task 1.

- [x] **Step 1: Adicionar os estilos base (modo claro) antes do bloco `/* Dark mode */`**

Em `src/pages/index.css`, logo antes do comentário `/* Dark mode */` (linha 83 do arquivo atual), inserir:

```css
/* Open Source section */
.home .oss {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #eee;
  text-align: left;
}

.home .oss-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  font-weight: 600;
  margin: 0 0 16px;
  text-align: center;
}

.home .oss-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.home .oss-card {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  transition: border-color 0.2s ease;
}

.home .oss-card:hover {
  border-color: #333;
}

.home .oss-site-link {
  position: absolute;
  inset: 0;
  border-radius: 8px;
}

.home .oss-card-body {
  padding-right: 28px;
}

.home .oss-card-name {
  display: block;
  font-weight: 700;
  font-size: 15px;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.home .oss-card-description {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 8px;
}

.home .oss-card-url {
  font-size: 12px;
  text-decoration: underline;
  color: #333;
}

.home .oss-github-link {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #666;
  transition: all 0.2s ease;
}

.home .oss-github-link:hover {
  color: #000;
  background: #f0f0f0;
}
```

- [x] **Step 2: Adicionar os overrides de dark mode**

Dentro do bloco `/* Dark mode */` já existente (após `[data-theme='dark'] .home .social-icon:hover { color: #fff; }`, antes do `@media only screen and (min-width: 600px)` final), adicionar:

```css
[data-theme='dark'] .home .oss {
  border-top-color: #333;
}

[data-theme='dark'] .home .oss-title {
  color: #bbb;
}

[data-theme='dark'] .home .oss-card {
  border-color: #444;
}

[data-theme='dark'] .home .oss-card:hover {
  border-color: #ccc;
}

[data-theme='dark'] .home .oss-card-name {
  color: #f5f5f5;
}

[data-theme='dark'] .home .oss-card-description {
  color: #aaa;
}

[data-theme='dark'] .home .oss-card-url {
  color: #ddd;
}

[data-theme='dark'] .home .oss-github-link {
  color: #999;
}

[data-theme='dark'] .home .oss-github-link:hover {
  color: #fff;
  background: #333;
}
```

- [x] **Step 3: Adicionar o breakpoint responsivo**

Dentro do bloco `@media only screen and (min-width: 600px) { .home article { width: 60vw; } }` já existente no final do arquivo, adicionar a regra do grid ao lado de `.home article`:

```css
@media only screen and (min-width: 600px) {
  .home article {
    width: 60vw;
  }

  .home .oss-grid {
    flex-direction: row;
  }

  .home .oss-card {
    flex: 1;
  }
}
```

- [x] **Step 4: Verificar visualmente — modo claro, desktop**

Run: `yarn start`, abrir `http://localhost:3000/` com a janela larga (≥600px).
Expected: os dois cards aparecem lado a lado, com borda fina cinza, título "PROJETOS OPEN SOURCE" pequeno e centralizado acima, mesmo estilo tipográfico do resto da home. Hover no card escurece a borda; hover no ícone do GitHub (canto superior direito do card) mostra um fundo cinza claro circular.

- [x] **Step 5: Verificar visualmente — modo escuro**

No mesmo browser, alternar para dark mode (toggle do Docusaurus no navbar).
Expected: borda e textos usam os tons claros definidos nos overrides (`#444`/`#f5f5f5`/`#aaa`/`#ddd`/`#999`), sem nenhum elemento com contraste ilegível.

- [x] **Step 6: Verificar visualmente — mobile**

Redimensionar a janela do browser (ou usar o modo responsivo do DevTools) para menos de 600px de largura.
Expected: os dois cards empilham verticalmente, cada um ocupando a largura total do artigo, sem overflow horizontal.
Parar o dev server depois de confirmar.

- [x] **Step 7: Commit**

```bash
git add src/pages/index.css
git commit -m "style: add light/dark/responsive styles for open source section"
```

---

### Task 3: Verificação final end-to-end

**Files:**
- Nenhum arquivo novo — apenas verificação sobre o resultado das Tasks 1 e 2.

- [x] **Step 1: Rodar o build de produção**

Run: `yarn build`
Expected: `[SUCCESS] Generated static files in "build".`, sem warnings novos relacionados a `src/pages/index.js` ou `src/pages/index.css`.

- [x] **Step 2: Servir o build e abrir no browser**

Run: `yarn serve`, abrir a URL impressa no terminal (por padrão `http://localhost:3000/`).

- [x] **Step 3: Checklist de comportamento dos links**

No card do **tokens-to-styles**:
- Clicar em qualquer ponto do card fora do ícone do GitHub → abre `https://tokens-to-styles.sciotta.com.br/` em nova aba.
- Clicar especificamente no ícone do GitHub (canto superior direito) → abre `https://github.com/sciotta/tokens-to-styles` em nova aba, **sem** também disparar a navegação para o site.

Repetir os dois cliques para o card do **color-doctor**, confirmando `https://color-doctor.sciotta.com.br/` e `https://github.com/sciotta/color-doctor` respectivamente.

- [x] **Step 4: Checklist de acessibilidade básica**

Abrir o DevTools, inspecionar os dois `<a>` de cada card e confirmar:
- O link do card (stretched) tem `aria-label="Abrir tokens-to-styles"` / `aria-label="Abrir color-doctor"`.
- O link do ícone do GitHub tem `aria-label="Repositório no GitHub de tokens-to-styles"` / `aria-label="Repositório no GitHub de color-doctor"`.
- Nenhum dos dois `<a>` está aninhado dentro do outro (devem ser irmãos dentro de `.oss-card`).

- [x] **Step 5: Navegar por teclado**

Usar Tab a partir do início da página até chegar nos cards.
Expected: dá pra alcançar e ativar (Enter) tanto o link do card quanto o ícone do GitHub via teclado, na ordem em que aparecem no DOM.

- [x] **Step 6: Encerrar o servidor**

Parar o processo do `yarn serve`.

Nenhum commit nesta task — é só verificação. Se algum item do checklist falhar, voltar à Task correspondente (1 para markup/comportamento, 2 para estilo), corrigir, e repetir a Task 3 do zero.
