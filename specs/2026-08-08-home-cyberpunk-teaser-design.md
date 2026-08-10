# Chamada para o /cyberpunk na home

**Data:** 2026-08-08
**Status:** Implementado e revisado (branch feat/home-cyberpunk-teaser)

## Objetivo

Convidar visitantes da home para o terminal CRT em `/cyberpunk`, que hoje só é alcançável por quem digita a URL. A rota foi adicionada no PR #24 e não é linkada de lugar nenhum.

A chamada aparece somente para quem tem um apontador de precisão — mouse ou trackpad. Em celular a experiência do terminal não se sustenta, então lá a chamada não existe.

## Nota sobre a localização deste documento

Segue a convenção já estabelecida em `specs/`, na raiz do repositório. `docs/` é conteúdo publicado do Docusaurus (a wiki, com sidebar gerada a partir do sistema de arquivos); uma spec ali viraria página pública do site.

## Escopo

Alteração restrita a `src/pages/index.js` e `src/pages/index.css`. Não inclui:

- mudanças em `src/pages/cyberpunk.js` ou em `static/painel/`;
- entrada na navbar, no footer ou em `docusaurus.config.js`;
- qualquer ajuste na câmera do terminal para telas estreitas (registrado abaixo como problema conhecido, fora deste escopo).

## Decisões de design (validadas visualmente com o usuário)

As três alternativas de formato foram renderizadas na home real, com o `index.css` do repositório, nos dois temas, antes da escolha.

1. **Formato: linha discreta.** Uma única linha centrada abaixo da seção de projetos open source. As alternativas descartadas foram um card de experimento (fica idêntico aos cards de open source e lê como "mais um projeto", além de alongar a página) e uma terceira pill ao lado de Blog e Wiki (promove um experimento a item de navegação principal e desequilibra a fileira, já que "Cyberpunk" é mais largo que os vizinhos).

2. **Texto: `experimento: terminal CRT →`.** Diz o que é e o que esperar sem prometer uma ferramenta.

3. **Critério de exibição: `@media (hover: hover) and (pointer: fine)`.** Mostra para mouse e trackpad; esconde em celular e em tablet sem apontador.

   Foram descartados um piso de largura mínima e uma condição de proporção de tela. A medição feita durante o desenho mostrou que o transbordamento da tela do terminal é função da proporção, não da largura: em 1024×768, 820×620 e 768×1024 a tela aparece inteira, e o corte só ocorre quando a altura passa de aproximadamente 1,8× a largura — o formato de celular (375×812 = 2,17×). Um piso de largura excluiria janelas que funcionam bem, como um laptop com a janela pela metade.

4. **CSS e não JavaScript.** O site é estático e servido por CDN. Uma decisão em `matchMedia` no cliente ou renderiza depois da pintura (piscada) ou diverge da hidratação. O elemento fica sempre no HTML e o CSS decide a visibilidade.

5. **Cor.** A home é inteiramente monocromática. O hover traz o ciano do glow do painel do terminal (`rgba(35,229,229,…)` em `src/pages/cyberpunk.js`) como ponte visual para o que vem depois do clique. É a única cor da página, e só no hover.

6. **Cursor piscando.** Um bloco sólido antes do texto, no ritmo de um cursor de terminal, antecipando o destino sem precisar explicá-lo.

## Estrutura (implementação de referência)

Em `src/pages/index.js`, um componente local no mesmo padrão de `SocialIcon` e `GitHubIcon`, que já vivem nesse arquivo:

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

Renderizado dentro do `<article>`, imediatamente após o fechamento da `<section className="oss">`.

Notas:

- **Mesma aba.** `/cyberpunk` é rota interna, tratada como Blog e Wiki. Sem `target="_blank"`.
- **Decoração marcada como tal.** O cursor e a seta levam `aria-hidden="true"`; o leitor de tela anuncia apenas "experimento: terminal CRT, link".
- **Sem `aria-hidden` no container.** `display: none` já remove o elemento da árvore de acessibilidade, então em celular ele não é anunciado.

## Estilos (`index.css`)

Bloco novo com o comentário `/* Experimento — chamada para /cyberpunk */`, inserido antes do bloco `/* Dark mode */`, preservando a organização atual do arquivo (base → dark mode → breakpoint).

Tokens herdados da home: 12px, uppercase, `letter-spacing: 1px`, peso 600, e a cor do `.oss-title` (`#767676` no claro, `#bbb` no escuro).

Visibilidade e espaçamento:

```css
.home .lab { display: none; }

@media (hover: hover) and (pointer: fine) {
  .home .lab {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}

.home .lab-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  text-decoration: none;
  transition: color 0.2s ease;
}
```

O `margin-top` fica junto do `display` dentro da media query por organização — assim tudo que só existe no desktop está num lugar só. Fora da media query ele seria inócuo de qualquer forma, já que um elemento com `display: none` não gera caixa.

Cores de hover, com o contraste verificado:

| Tema | Cor | Fundo | Contraste |
|---|---|---|---|
| Claro | `#087a7a` | `#fff` | ~5,2:1 |
| Escuro | `#23e5e5` | `#1b1b1d` | ~11:1 |

O `#0a8f8f` usado no mockup foi descartado: sobre branco dá ~3,9:1, abaixo do mínimo de 4,5:1 exigido para texto de 12px.

Movimento:

```css
.home .lab-caret {
  width: 7px;
  height: 13px;
  background: currentColor;
  animation: lab-blink 1.1s steps(1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .home .lab-caret { animation: none; }
}
```

## Critério de verificação

O repositório não tem suíte de testes; a verificação segue o que o repo já pratica.

- `yarn build` conclui sem erros. `onBrokenLinks: 'throw'` passa a avaliar o link para `/cyberpunk`, que existe desde o PR #24 — o build é a própria checagem disso.
- Desktop, tema claro e escuro: a linha aparece abaixo dos cards, e o hover muda para o ciano correspondente.
- Preset mobile com emulação de toque: a linha não aparece, e a página termina nos cards como antes.
- O clique leva a `/cyberpunk` na mesma aba.

## Problema conhecido, fora deste escopo

Em telas com proporção acima de ~1,8:1 (celular em retrato) a tela do terminal transborda a viewport e as laterais ficam cortadas. Este trabalho contorna o problema escondendo a chamada nesses aparelhos; não o corrige. A correção seria no enquadramento da câmera em `src/pages/cyberpunk.js`, onde `fit()` usa o maior valor entre cobrir a viewport e enquadrar o monitor.
