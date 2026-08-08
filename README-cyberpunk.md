# Terminal CRT em `/cyberpunk`

Página independente da home — o `src/pages/index.js` não é tocado.

## Onde fica

```
src/pages/cyberpunk.js   componente da página
static/painel/           assets e scripts do terminal
```

O Docusaurus cria a rota pelo nome do arquivo: `src/pages/cyberpunk.js` vira `https://sciotta.com.br/cyberpunk`.

Conteúdo de `static/painel/`:

| Arquivo | O que é |
| --- | --- |
| `terminal-gl.js` | o terminal inteiro: canvas 2D rasterizado numa textura WebGL com curvatura, aberração cromática, scanlines e falhas de sinal |
| `ambience.js` | som ambiente sintetizado (motor, ventilação, campo estelar, teclado, beeps, passos) |
| `panel.jpg` / `panel-1600.jpg` | painel da nave, 2816px e 1600px (695 KB / 240 KB) |
| `screen-mask.png` | máscara que recorta a tela dentro do monitor |
| `avatar.png` | retrato em pixel art 64×64 |
| `blog-cache.json` | reserva do feed: 13 posts com título, slug, data, tags e arquivo de origem |
| `wiki-index.json` | índice de `docs/`: 4 seções, 17 páginas |

## De onde vem o conteúdo

- **Blog** — busca `/blog/rss.xml` (gerado pelo Docusaurus) em tempo real. O texto completo vem do próprio feed. Se a busca falhar, usa `blog-cache.json` e lê o markdown no raw do GitHub.
- **Wiki** — usa `wiki-index.json` e lê cada `docs/**/*.md` no raw do GitHub.
- **Links "ver origem"** nos blocos de código apontam para o arquivo no GitHub com o intervalo de linhas.

Quando publicar novos posts ou páginas, os dois JSON precisam ser atualizados (só afetam a reserva e o índice do wiki — o blog em si já vem do feed).

## Controles

- **W / S** — andar para frente e para trás
- **A / D** — olhar para os lados
- Menu da janela: Arquivo (recarregar), Idioma (PT/EN), Audio (liga/desliga), Ajuda

O som só começa depois do primeiro clique ou tecla — política de autoplay dos navegadores.

## Notas

- A página não usa `<Layout>`: sem navbar e sem footer, tela cheia.
- Requer as fontes Press Start 2P e VT323, carregadas do Google Fonts pelo próprio componente.
- Nada de build extra: `terminal-gl.js` e `ambience.js` são scripts comuns, carregados no cliente.
