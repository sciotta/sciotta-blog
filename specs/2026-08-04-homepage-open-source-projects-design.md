# Destaque de projetos open source na home

**Data:** 2026-08-04
**Status:** Implementado e revisado (branch worktree-homepage-oss-projects)

## Objetivo

Dar visibilidade, na página inicial do site, às duas bibliotecas open source mantidas por Thiago Sciotta:

- **tokens-to-styles** — https://tokens-to-styles.sciotta.com.br/ (repo: https://github.com/sciotta/tokens-to-styles)
- **color-doctor** — https://color-doctor.sciotta.com.br/ (repo: https://github.com/sciotta/color-doctor)

O objetivo é reforçar essas contribuições como parte da apresentação pessoal do site, sem alterar a identidade visual minimalista/monocromática já estabelecida na home.

## Nota sobre localização deste documento

O padrão da skill de brainstorming é salvar specs em `docs/superpowers/specs/`, mas neste repositório `docs/` é conteúdo publicado do Docusaurus (wiki pessoal, com sidebar autogerada a partir do sistema de arquivos). Salvar a spec ali faria com que ela aparecesse como página pública do site. Por isso este documento fica em `specs/`, na raiz do repositório, fora do conteúdo publicado.

## Escopo

Alteração restrita à home (`src/pages/index.js` e `src/pages/index.css`). Não inclui:
- Nova página dedicada a projetos.
- Novo componente React separado (decisão explícita: manter tudo em `index.js`, seguindo o padrão de arquivo único já usado na home).
- Alterações em `docusaurus.config.js`, navbar ou footer.

## Decisões de design (validadas visualmente com o usuário)

Todas as alternativas foram exploradas via mockups no companion visual de brainstorming antes de serem fechadas:

1. **Posicionamento:** nova seção "Projetos Open Source", inserida na home logo abaixo da navegação social existente (LinkedIn/GitHub/YouTube), com uma linha divisória sutil (`border-top`) separando-a do bloco atual. A home atual (logo, frase de intro, pills Blog/Wiki, ícones sociais) permanece inalterada.
2. **Título da seção:** "Projetos Open Source", no mesmo estilo de rótulo pequeno/uppercase/cinza usado no restante da home (ex.: `.link-pill`, `.social-icon`), sem novos elementos de estilo.
3. **Conteúdo de cada card:** somente texto — nome do projeto, uma descrição de uma linha, e o link do site. Sem screenshots, ícones de tecnologia ou badges (essas alternativas foram mostradas e descartadas em favor da simplicidade).
4. **Links:** cada card leva ao site do projeto (clique no corpo do card ou no link de texto); adicionalmente, um ícone pequeno do GitHub no canto superior direito do card abre o repositório em nova aba. Reutilizar o path SVG do ícone do GitHub já existente em `SocialIcon` (evitar duplicar asset).
5. **Ênfase visual:** nível discreto — mesmo estilo do restante da home (borda fina, tipografia igual, sem cor de destaque, sem fundo diferenciado). O usuário validou explicitamente que "destacar" aqui significa dar um espaço visível na home, não introduzir uma linguagem visual nova.
6. **Layout responsivo:** os dois cards ficam lado a lado (`display: flex`) em telas maiores e empilham verticalmente em telas pequenas, seguindo o mesmo breakpoint já usado em `index.css` (`@media (min-width: 600px)`).
7. **Abordagem técnica:** os dois projetos ficam definidos como um pequeno array de dados dentro de `index.js` (ex.: `const openSourceProjects = [...]`), mapeado para os cards via `.map()`. Evita duplicar JSX entre os dois cards sem introduzir um componente/arquivo novo para apenas dois itens.

## Conteúdo (copy final)

| Projeto | Descrição | Link do site | Link do GitHub |
|---|---|---|---|
| tokens-to-styles | Converte tokens de design em variáveis CSS prontas para uso, mantendo Figma e código sincronizados. | https://tokens-to-styles.sciotta.com.br/ | https://github.com/sciotta/tokens-to-styles |
| color-doctor | Mapeia e simplifica a paleta de cores do seu projeto React com um único comando. | https://color-doctor.sciotta.com.br/ | https://github.com/sciotta/color-doctor |

## Estrutura de componentes/dados (implementação de referência)

Dentro de `src/pages/index.js`:

```js
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

Renderizado como uma nova seção (`<section className="oss">`) após a `<nav className="social-nav">` existente, com um título (`<h2 className="oss-title">Projetos Open Source</h2>`) e um grid de cards (`<div className="oss-grid">`) mapeado a partir do array acima.

**Nota de implementação — evitar `<a>` aninhado:** como o card inteiro é clicável (leva a `siteUrl`) e o ícone do GitHub, sobreposto no canto do mesmo card, é um link independente (leva a `githubUrl`), não é válido aninhar um `<a>` dentro de outro. Cada card deve ser um `<div className="oss-card">` (não um `<a>`), contendo dois links irmãos:
1. Um link "stretched" (`position: absolute; inset: 0;`) sobre o card inteiro, apontando para `siteUrl`, com `aria-label` descritivo (ex.: "Abrir tokens-to-styles") e texto do card (nome/descrição/URL) como conteúdo não-interativo por cima.
2. Um segundo link menor, posicionado no canto superior direito com `z-index` maior que o link stretched, apontando para `githubUrl`, com o ícone do GitHub e `aria-label` próprio (ex.: "Repositório no GitHub de tokens-to-styles").

## Estilos (`index.css`)

Novas classes seguindo a nomenclatura já usada no arquivo (`.home .oss`, `.home .oss-title`, `.home .oss-grid`, `.home .oss-card`, etc.), reaproveitando os tokens visuais existentes:
- Cor de texto/borda igual aos `.link-pill` (`#333` claro / `#ccc` escuro).
- Título no mesmo padrão de rótulo pequeno uppercase (tamanho ~11px, `letter-spacing`, cor cinza `#999`/`#bbb`).
- Overrides de dark mode espelhando o bloco `[data-theme='dark'] .home ...` já existente no arquivo.
- Grid com `gap` semelhante ao `.links`/`.social-nav`, `flex-direction: column` abaixo de 600px e `row` a partir do breakpoint já usado.

## Fora de escopo / não perguntado

- Ordem de exibição dos dois cards: mantida a ordem da tabela acima (tokens-to-styles primeiro), sem necessidade de configuração.
- Métricas dinâmicas (estrelas do GitHub, downloads npm): descartadas nas opções visuais, não fazem parte deste escopo.

## Critério de verificação

- `yarn start`: seção aparece corretamente abaixo dos ícones sociais, em light e dark mode.
- Redimensionar a viewport para mobile (<600px): cards empilham verticalmente sem quebrar layout.
- Clique no card abre o site do projeto em nova aba; clique no ícone do GitHub abre o repositório em nova aba, sem disparar a navegação do card.
- `yarn build` conclui sem erros (checagem de link quebrado do Docusaurus, `onBrokenLinks: 'throw'`, não deve ser afetada já que os links são externos).
