# Feed de conteúdo (blog + wiki) em masonry na home

**Data:** 2026-08-05
**Status:** Aprovado, aguardando plano de implementação

## Objetivo

Adicionar à home uma seção que mistura posts do blog (`blog/`) e páginas da wiki pessoal (`docs/`) num grid estilo masonry, visual "jornal" (sem borda nos cards, separação só por espaço em branco), com carregamento incremental via botão "Carregar mais". Depois de tentar reaproveitar a linguagem de card com borda da seção "Projetos Open Source" (#20/#21) e sentir a home "embolada" com muita coisa em cards parecidos, a direção validada foi diferente: mais editorial, tipográfica, com hierarquia por espaço em vez de linhas.

## Escopo

- Nova seção na home (`src/pages/index.js` / `src/pages/index.css`), depois da seção "Projetos Open Source".
- Novo plugin local do Docusaurus (`plugins/homepage-feed/`) que gera, em build-time, uma lista combinada e ordenada de posts do blog + páginas da wiki, exposta via `setGlobalData`.
- Não inclui: mudanças na página `/blog` ou na wiki `/docs` em si (o plugin só lê esse conteúdo, não altera como ele é renderizado nas próprias páginas); paginação "de verdade" (tudo já é buscado em build-time, "carregar mais" só revela mais itens já carregados no cliente); busca ou filtro por tag/tipo.

## Por que não dá pra usar a API pronta do Docusaurus

Investigação técnica (ver notas abaixo) confirmou que nenhuma API oficial do Docusaurus resolve isso direto:

- **Blog:** o plugin `@docusaurus/plugin-content-blog` NÃO expõe seus posts via `setGlobalData` — só passa os dados pra `@theme/BlogListPage`/`@theme/BlogPostPage` via rotas do React Router. `usePluginData('docusaurus-plugin-content-blog')` retorna `undefined`.
- **Wiki (docs):** `@docusaurus/plugin-content-docs` até chama `setGlobalData`, mas o formato só tem `{ id, path, sidebar }` por doc — sem título, data ou descrição. Inútil pra um feed.
- **Feeds RSS/JSON** (`/blog/feed.json` etc.) são gerados no hook `postBuild`, que roda depois da home já ter sido renderizada estaticamente — não dá pra ler o feed durante o build da própria home. Também não têm campo de imagem.
- Nenhuma página da wiki tem data de publicação (frontmatter só tem `sidebar_position`) nem imagem de capa hoje.

**Solução:** um plugin local (`plugins/homepage-feed/index.js`) que, no hook `loadContent()`, gera os dois conjuntos de dados diretamente (reaproveitando `generateBlogPosts` do próprio `@docusaurus/plugin-content-blog/lib/blogUtils` pro blog, e lendo `docs/**/*.md` manualmente pra wiki), combina, ordena e expõe tudo via `actions.setGlobalData()`. A home lê com `usePluginData('homepage-feed-plugin')` de `@docusaurus/useGlobalData`. Isso roda 100% em build-time — sem chamada de rede no cliente, sem `useIsBrowser`/`BrowserOnly` necessário pra buscar os dados (só pro comportamento de "carregar mais", que é puramente client-side sobre dados já embutidos no bundle).

## Decisões de design (validadas visualmente com o usuário)

Todas as alternativas foram exploradas via mockups no companion visual de brainstorming antes de serem fechadas:

1. **Masonry real, sem borda nos cards.** Layout em colunas CSS (`column-count`), cada item com altura natural (imagem + texto), sem borda nem fundo diferenciado — separação só por espaço em branco generoso entre itens e colunas (sem `column-rule`, testado e descartado — a versão só-espaço ganhou). Rompe deliberadamente com o padrão de card usado em "Projetos Open Source": ali fazia sentido (poucos itens, comparação lado a lado); aqui, com um feed maior e misto, a linguagem "jornal" ficou mais limpa que repetir cards com borda.
2. **Feed misto, não só blog.** Posts do blog e páginas da wiki aparecem juntos, ordenados cronologicamente pela mesma régua (ver seção de ordenação abaixo). Cada item tem um rótulo pequeno acima do título indicando o tipo: "Artigo" (blog) ou "Wiki" (docs).
3. **Conteúdo de cada item:** imagem de capa (ou um bloco neutro com ícone de documento, pras páginas da wiki, que não têm imagem) + rótulo de tipo + título completo (sem truncar/cortar, quebra em quantas linhas precisar) + resumo de 1-2 linhas + data.
4. **6 itens carregados de imediato**, organizados em 3 colunas no desktop (≈2 "linhas" de altura média, como pedido) — 1 coluna em telas estreitas (mesmo breakpoint de 600px já usado no resto da home).
5. **"Carregar mais" via botão**, não scroll infinito automático — mais previsível, não esconde o rodapé, mais acessível. Cada clique revela mais 6 itens (mesmo tamanho do lote inicial) dos que já foram buscados em build-time; o botão some quando não sobra mais nada pra carregar.
6. **Ordenação cronológica única:** posts do blog usam a data já embutida no nome do arquivo (`YYYY-MM-DD-slug.md`, é o que o Docusaurus já usa como `date`); páginas da wiki usam a data do último commit git que tocou o arquivo (mais barato que ativar `showLastUpdateTime` do Docusaurus, que exigiria de qualquer forma um plugin próprio pra expor isso globalmente). Blog e wiki entram misturados na mesma lista, do mais recente pro mais antigo.

**Suposição a confirmar na revisão da spec:** usei "Conteúdo" como rótulo da seção (mesmo padrão visual do rótulo "Projetos Open Source" acima dela) já que mistura blog + wiki. Se preferir outro texto (ex: "Blog & Wiki", "Escritos"), é só trocar na revisão.

## Arquitetura

### 1. Plugin local: `plugins/homepage-feed/index.js`

Novo plugin Docusaurus, registrado em `docusaurus.config.js` (`plugins: [...]`, hoje vazio).

**`loadContent()`** gera dois conjuntos de itens e combina:

- **Blog:** chama `generateBlogPosts` (importado de `@docusaurus/plugin-content-blog/lib/blogUtils`) com as mesmas opções já usadas pelo preset `classic` pro blog (`contentPath: 'blog'`, etc. — reaproveita a config existente de `docusaurus.config.js`, não duplica valores). Cada post gera um item:
  ```
  { type: 'blog', title, description, date, permalink, image: frontMatter.image ?? null }
  ```
  `description` vem pronto do próprio Docusaurus (gerado a partir do `<!--truncate-->`, que todo post já usa).

- **Wiki:** varre `docs/**/*.md` (glob recursivo), lê frontmatter com `gray-matter` (já presente como dependência transitiva do próprio Docusaurus — adicionar como devDependency direta em `package.json`, já que hoje só é resolvida de forma implícita e isso é frágil). Pra cada arquivo:
  - `title`: do frontmatter, ou do primeiro `# heading` do corpo se não houver.
  - `description`: gerada a partir do corpo — remove sintaxe markdown (headers, links, ênfase, blocos de código) e pega os primeiros ~150 caracteres, cortando na última palavra completa.
  - `date`: `git log -1 --format=%aI -- <caminho-do-arquivo>` (via `child_process.execSync`, chamado uma vez por arquivo em build-time).
  - `permalink`: derivado do caminho do arquivo dentro de `docs/` (mesma lógica de slug que o Docusaurus já usa pra gerar as URLs de `/docs/...`).
  - `image`: sempre `null` (nenhuma página da wiki tem imagem hoje).
  ```
  { type: 'wiki', title, description, date, permalink, image: null }
  ```

- Combina os dois arrays, ordena por `date` decrescente (mais recente primeiro), e retorna a lista completa.

**`contentLoaded({content, actions})`** chama `actions.setGlobalData(content)`.

**Risco de CI (clone raso):** `git log -1 --format=%aI -- <arquivo>` só funciona corretamente se o clone usado no build tiver o histórico completo do arquivo. O workflow de deploy (`.github/workflows/documentation.yml`) usa `actions/checkout@v1` sem `fetch-depth: 0`, então em produção o clone pode vir raso (`depth=1`) e a busca não encontrar o commit real de um arquivo que não foi tocado no último commit do repo — resultando em data vazia/incorreta. Duas coisas precisam entrar no plano de implementação:
1. Adicionar `fetch-depth: 0` (ou `fetch-depth: 0` via `actions/checkout@v4`, já que `@v1` está bem desatualizado) ao step de checkout em `.github/workflows/documentation.yml`, nos dois jobs (`checks` e `gh-release`).
2. Mesmo assim, o plugin precisa de um fallback defensivo: se `git log -1` não retornar nada pra um arquivo (histórico ausente, arquivo novo ainda não commitado, etc.), usar a data de modificação do arquivo no filesystem (`fs.statSync(caminho).mtime`) em vez de quebrar o build.

### 2. Leitura em `src/pages/index.js`

```js
import {usePluginData} from '@docusaurus/useGlobalData';

const INITIAL_VISIBLE = 6;
const LOAD_MORE_BATCH = 6;

// dentro do componente Hello:
const feedItems = usePluginData('homepage-feed-plugin');
const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
const visibleItems = feedItems.slice(0, visibleCount);
const hasMore = visibleCount < feedItems.length;
```

O botão "Carregar mais" chama `setVisibleCount(c => c + LOAD_MORE_BATCH)` e não é renderizado quando `hasMore` é `false`. Não precisa de `useIsBrowser`/`BrowserOnly`: `feedItems` já vem embutido no HTML estático (SSR-safe), e o `useState` de paginação é comportamento puramente client-side normal do React, sem acessar `window`/`document`.

### 3. Markup e estilos

Nova seção depois de `<section className="oss">`:

```jsx
<section className="feed">
  <h2 className="feed-title">Conteúdo</h2>
  <div className="feed-grid">
    {visibleItems.map((item) => (
      <article className="feed-item" key={item.permalink}>
        <a href={item.permalink} className="feed-item-link" aria-label={item.title}>
          {item.image ? (
            <img src={item.image} alt="" className="feed-item-image" />
          ) : (
            <div className="feed-item-image feed-item-image--fallback" aria-hidden="true">
              {/* ícone de documento */}
            </div>
          )}
          <span className="feed-item-type">{item.type === 'blog' ? 'Artigo' : 'Wiki'}</span>
          <h3 className="feed-item-title">{item.title}</h3>
          <p className="feed-item-description">{item.description}</p>
          <span className="feed-item-date">{/* data formatada, ex: "22 mar 2026" */}</span>
        </a>
      </article>
    ))}
  </div>
  {hasMore && (
    <button type="button" className="feed-load-more" onClick={() => setVisibleCount((c) => c + LOAD_MORE_BATCH)}>
      Carregar mais
    </button>
  )}
</section>
```

CSS novo em `index.css`, seguindo o padrão já usado (`.home` prefix, light rule → dark override, breakpoint de 600px):

- `.home .feed-grid`: `column-count: 1` por padrão, `column-count: 3` a partir de 600px, `column-gap` generoso (ex: 24px), sem `column-rule`.
- `.home .feed-item`: sem borda, sem fundo — só `break-inside: avoid` e `margin-bottom` pro espaçamento vertical entre itens.
- `.home .feed-item-image`: `border-radius` pequeno (ex: 4px, mais discreto que os 8px dos cards), `width: 100%`, `object-fit: cover`, altura natural pra imagens reais (sem forçar proporção fixa — é isso que dá o efeito masonry) e altura fixa pro fallback (`.feed-item-image--fallback`, fundo neutro `#f2f2f2`/escuro correspondente, ícone centralizado).
- `.home .feed-item-type`: mesmo tratamento tipográfico do `.oss-title` (uppercase, pequeno, `#767676`/`#bbb` no escuro) mas em escala de item, não de seção.
- `.home .feed-item-title`, `.feed-item-description`, `.feed-item-date`: hierarquia tipográfica compatível com `.oss-card-name`/`.oss-card-description`/`.oss-card-url` já existentes, sem reinventar tamanhos/cores do zero.
- `.home .feed-load-more`: **mesmo estilo dos botões Blog/Wiki já harmonizados** (`border-radius: 8px`, hover só na borda — não um pill arredondado; um pill destoaria do padrão estabelecido em #21).
- `.home .feed-item-link`: cobre o item inteiro (título, imagem, resumo, data todos dentro do mesmo `<a>` — diferente do padrão "stretched link" dos cards de Open Source, aqui não há um segundo link concorrente tipo GitHub, então um `<a>` simples envolvendo tudo já resolve sem o truque de link esticado).

## Fora de escopo / não perguntado

- Coluna intermediária (2 colunas) pra tablets: só foi validado 1 coluna (mobile) e 3 colunas (desktop, ≥600px), mesmo padrão de breakpoint único já usado no resto da home.
- Tamanho do lote de "carregar mais": assumido igual ao inicial (6), não foi uma pergunta separada.
- Busca/filtro por tipo ou tag no feed.
- Qualquer mudança nas páginas `/blog` ou `/docs` em si — o plugin só lê esse conteúdo.

## Critério de verificação

- `yarn build` conclui sem erros (inclui rodar o novo plugin em build-time — testar especialmente a chamada de `git log` por arquivo, que precisa funcionar dentro do processo de build).
- Home mostra 6 itens misturados (blog + wiki) em 3 colunas no desktop, 1 coluna no mobile, ordenados do mais recente pro mais antigo.
- Páginas da wiki aparecem com o bloco neutro + ícone no lugar da imagem; posts do blog mostram a imagem de capa real.
- "Carregar mais" revela mais 6 itens por clique e desaparece quando não há mais itens.
- Título completo aparece sempre (sem `text-overflow: ellipsis` cortando no meio), com resumo de 1-2 linhas abaixo.
- Nenhuma borda visível nos itens do feed — só espaçamento; a separação em colunas é legível em light e dark mode.
- O botão "Carregar mais" usa a mesma aparência (8px de raio, hover só na borda) dos botões Blog/Wiki já harmonizados.
- `.github/workflows/documentation.yml` tem `fetch-depth: 0` nos steps de checkout, e o plugin não quebra o build mesmo se `git log` não encontrar histórico pra algum arquivo (fallback pra `mtime`).
