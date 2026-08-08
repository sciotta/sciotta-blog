// <terminal-gl> — o terminal inteiro desenhado em canvas 2D e composto por WebGL.
// A UI é rasterizada numa textura; o shader aplica curvatura, aberração cromática,
// bloom de fósforo, grade RGB, scanlines, ruído, varredura e falhas de sinal.
(function () {
  const W = 1230, H = 844;

  const C = {
    bg: '#07060c', panel: '#12101c', panel2: '#0d0b16', line: '#2a2740',
    muted: '#8d86a8', dim: '#c9c4dd', text: '#f2e3c6',
    cyan: '#23e5e5', amber: '#e0a83c', pink: '#ff2e88', deep: '#0a0813'
  };

  let LANG = 'pt';

  const STR = {
    pt: {
      projects: {
        tokens: {
          title: 'sciotta@tty1: ~/src/tokens-to-styles', name: 'tokens-to-styles',
          body: 'Converte tokens de design em variáveis CSS prontas para uso, mantendo Figma e código sincronizados.',
          url: 'https://tokens-to-styles.sciotta.com.br/', repo: 'https://github.com/sciotta/tokens-to-styles',
          color: C.cyan
        },
        color: {
          title: 'sciotta@tty1: ~/src/color-doctor', name: 'color-doctor',
          body: 'Mapeia e simplifica a paleta de cores do seu projeto React com um único comando.',
          url: 'https://color-doctor.sciotta.com.br/', repo: 'https://github.com/sciotta/color-doctor',
          color: C.amber
        }
      },
      boot: [
        'montando /dev/tty1 ................ ok',
        'verificando integridade do registro ... ok',
        'abrindo base CADASTRO.DB .......... 2 tabelas',
        'carregando REG #0001 .............. SCIOTTA, T.',
        'decodificando FOTO 64x64 .......... 4096 px',
        'sincronizando projetos ............ 2 itens',
        'resolvendo links externos ......... 3 hosts',
        'aplicando perfil de video ......... 9600 8N1',
        'pronto.'
      ],
      fields: [
        ['NOME .........', 'SCIOTTA, T.', C.cyan, null],
        ['OCUPACAO .....', 'Desenvolvedor de software, construindo coisas para a web.', C.text, null],
        ['LINKEDIN .....', 'linkedin.com/in/sciotta', C.text, 'https://www.linkedin.com/in/sciotta/'],
        ['GITHUB .......', 'github.com/thiagog3', C.text, 'https://github.com/thiagog3'],
        ['YOUTUBE ......', 'youtube.com/@sciotta', C.text, 'https://www.youtube.com/channel/UCfNbBxgDSTvcOJ3X5uD1jZQ'],
        ['STATUS .......', 'ONLINE', C.amber, null]
      ],
      loading: 'CARREGANDO', db: 'CADASTRO.DB  /dev/tty1', sync: '$ sync --registro 0001',
      winTitle: 'sciotta@tty1: ~/cadastro',
      menu: [
        { label: 'Arquivo', items: [{ id: 'reload', label: 'Recarregar registro' }, { id: 'quit', label: 'Encerrar sessão', disabled: true }] },
        { label: 'Idioma', items: [{ id: 'lang-pt', label: 'Português', radio: true }, { id: 'lang-en', label: 'English', radio: true }] },
        { label: 'Audio', items: [{ id: 'sound', label: 'Som ambiente', check: true }] },
        { label: 'Ajuda', items: [{ id: 'h1', keys: ['W', 'S'], label: 'andar', disabled: true }, { id: 'h2', keys: ['A', 'D'], label: 'olhar em volta', disabled: true }] }
      ],
      header: 'CADASTRO DE PESSOAS', reg: 'REG #0001',
      section: 'PROJETOS OPEN SOURCE', open: 'ABRIR ▸',
      blogTitle: 'ARQUIVO DE ARTIGOS', blogCount: 'REGISTROS', blogLoading: 'LENDO FEED',
      back: '◂ VOLTAR', prev: '◂ ANTERIOR', next: 'PROXIMA ▸', page: 'PAG',
      readOn: 'ABRIR NO BLOG ↗', offline: 'feed indisponível — lendo cópia local',
      noBody: 'texto completo disponível no blog', scrollHint: 'roda do mouse para rolar',
      wikiTitle: 'WIKI — ÍNDICE', wikiSections: 'SEÇÕES', wikiPages: 'PÁGINAS', wikiEmpty: 'seção vazia',
      viewSource: 'ver origem ↗'
    },
    en: {
      projects: {
        tokens: {
          title: 'sciotta@tty1: ~/src/tokens-to-styles', name: 'tokens-to-styles',
          body: 'Turns design tokens into ready-to-use CSS variables, keeping Figma and code in sync.',
          url: 'https://tokens-to-styles.sciotta.com.br/', repo: 'https://github.com/sciotta/tokens-to-styles',
          color: C.cyan
        },
        color: {
          title: 'sciotta@tty1: ~/src/color-doctor', name: 'color-doctor',
          body: 'Maps and simplifies your React project color palette with a single command.',
          url: 'https://color-doctor.sciotta.com.br/', repo: 'https://github.com/sciotta/color-doctor',
          color: C.amber
        }
      },
      boot: [
        'mounting /dev/tty1 ................ ok',
        'checking registry integrity ....... ok',
        'opening RECORDS.DB database ....... 2 tables',
        'loading REC #0001 ................. SCIOTTA, T.',
        'decoding PHOTO 64x64 .............. 4096 px',
        'syncing projects .................. 2 items',
        'resolving external links .......... 3 hosts',
        'applying video profile ............ 9600 8N1',
        'ready.'
      ],
      fields: [
        ['NAME .........', 'SCIOTTA, T.', C.cyan, null],
        ['OCCUPATION ...', 'Software developer, building things for the web.', C.text, null],
        ['LINKEDIN .....', 'linkedin.com/in/sciotta', C.text, 'https://www.linkedin.com/in/sciotta/'],
        ['GITHUB .......', 'github.com/thiagog3', C.text, 'https://github.com/thiagog3'],
        ['YOUTUBE ......', 'youtube.com/@sciotta', C.text, 'https://www.youtube.com/channel/UCfNbBxgDSTvcOJ3X5uD1jZQ'],
        ['STATUS .......', 'ONLINE', C.amber, null]
      ],
      loading: 'LOADING', db: 'RECORDS.DB  /dev/tty1', sync: '$ sync --record 0001',
      winTitle: 'sciotta@tty1: ~/records',
      menu: [
        { label: 'File', items: [{ id: 'reload', label: 'Reload record' }, { id: 'quit', label: 'End session', disabled: true }] },
        { label: 'Language', items: [{ id: 'lang-pt', label: 'Português', radio: true }, { id: 'lang-en', label: 'English', radio: true }] },
        { label: 'Audio', items: [{ id: 'sound', label: 'Ambient sound', check: true }] },
        { label: 'Help', items: [{ id: 'h1', keys: ['W', 'S'], label: 'walk', disabled: true }, { id: 'h2', keys: ['A', 'D'], label: 'look around', disabled: true }] }
      ],
      header: 'PERSONNEL RECORDS', reg: 'REC #0001',
      section: 'OPEN SOURCE PROJECTS', open: 'OPEN ▸',
      blogTitle: 'ARTICLE ARCHIVE', blogCount: 'RECORDS', blogLoading: 'READING FEED',
      back: '◂ BACK', prev: '◂ PREVIOUS', next: 'NEXT ▸', page: 'PAGE',
      readOn: 'OPEN ON BLOG ↗', offline: 'feed unavailable — reading local copy',
      noBody: 'full text available on the blog', scrollHint: 'mouse wheel to scroll',
      wikiTitle: 'WIKI — INDEX', wikiSections: 'SECTIONS', wikiPages: 'PAGES', wikiEmpty: 'empty section',
      viewSource: 'view source ↗'
    }
  };

  const T = () => STR[LANG] || STR.pt;
  const FIELDS_L = () => T().fields;

  const ps = s => s + 'px "Press Start 2P", monospace';
  const vt = s => s + 'px VT323, monospace';

  // ---- realce de sintaxe na paleta do terminal (ar de Darcula) ----
  const LANG_ALIAS = {
    js: 'js', javascript: 'js', jsx: 'js', mjs: 'js', node: 'js',
    ts: 'js', typescript: 'js', tsx: 'js',
    py: 'py', python: 'py',
    sh: 'sh', bash: 'sh', shell: 'sh', zsh: 'sh', console: 'sh',
    json: 'json', yaml: 'yaml', yml: 'yaml',
    css: 'css', scss: 'css', html: 'xml', xml: 'xml', md: null, markdown: null
  };
  const KEYWORDS = {
    js: 'const let var function return if else for while class extends implements interface type enum new await async import export from default try catch finally throw typeof instanceof of in this null undefined true false switch case break continue do delete void yield static get set public private readonly as super',
    py: 'def return if elif else for while class import from as with try except finally raise pass lambda None True False and or not in is global nonlocal yield async await del assert',
    sh: 'if then fi else elif for do done while until case esac function in export source local return exit set unset echo cd sudo',
    css: '', json: '', yaml: '', xml: ''
  };
  const KWSET = {};
  Object.keys(KEYWORDS).forEach(k => { KWSET[k] = new Set(KEYWORDS[k].split(' ').filter(Boolean)); });

  // devolve [{t: trecho, c: cor}] para uma linha de codigo
  function tokenize(line, lang) {
    const fam = LANG_ALIAS[String(lang || '').toLowerCase()];
    const out = [];
    if (!fam) return [{ t: line, c: C.cyan }];
    const push = (t, c) => { if (t) out.push({ t, c }); };
    let i = 0;
    const cmt = fam === 'js' || fam === 'css' ? '//' : '#';

    // yaml e json marcam a chave antes dos dois pontos
    if (fam === 'yaml') {
      const m = line.match(/^(\s*)([\w.-]+)(\s*:)/);
      if (m) { push(m[1] + m[2], C.pink); push(m[3], C.muted); i = m[0].length; }
    }

    while (i < line.length) {
      const rest = line.slice(i);
      let m;
      if (fam !== 'json' && rest.indexOf(cmt) === 0) { push(rest, C.muted); break; }
      if (fam === 'js' && (m = rest.match(/^\/\*[\s\S]*?(\*\/|$)/))) { push(m[0], C.muted); i += m[0].length; continue; }
      if ((m = rest.match(/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/))) {
        const isKey = (fam === 'json') && /^\s*:/.test(rest.slice(m[0].length));
        push(m[0], isKey ? C.pink : C.amber); i += m[0].length; continue;
      }
      if ((m = rest.match(/^-{1,2}[A-Za-z][\w-]*/)) && fam === 'sh') { push(m[0], C.cyan); i += m[0].length; continue; }
      if ((m = rest.match(/^\d[\w.]*/))) { push(m[0], C.cyan); i += m[0].length; continue; }
      if ((m = rest.match(/^[A-Za-z_$][\w$]*/))) {
        const w = m[0];
        const after = rest.slice(w.length);
        let c = C.text;
        if (KWSET[fam] && KWSET[fam].has(w)) c = C.pink;
        else if (/^\s*\(/.test(after)) c = C.dim;
        else if (/^[A-Z]/.test(w)) c = C.dim;
        else if (fam === 'json' || fam === 'yaml') c = C.text;
        push(w, c); i += w.length; continue;
      }
      if ((m = rest.match(/^[^\w\s$'"`]+/))) { push(m[0], C.muted); i += m[0].length; continue; }
      push(rest[0], C.text); i += 1;
    }
    return out;
  }

  const FRAG = `precision highp float;
uniform sampler2D tex; uniform vec2 res; uniform float t;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
vec2 warp(vec2 uv, float k){ vec2 c=uv*2.-1.; float r2=dot(c,c); return (c*(1.+k*r2))*.5+.5; }
vec3 tap(vec2 uv){ return texture2D(tex, uv).rgb; }
void main(){
  vec2 uv = gl_FragCoord.xy / res;
  uv.y = 1.0 - uv.y;
  vec2 uR = warp(uv, 0.070), uG = warp(uv, 0.062), uB = warp(uv, 0.054);
  float edge = (uG.x<0.||uG.x>1.||uG.y<0.||uG.y>1.) ? 0.0 : 1.0;

  vec3 col = vec3(tap(uR).r, tap(uG).g, tap(uB).b);

  // bloom de fosforo: dois aneis de amostras sobre o brilho
  vec3 bloom = vec3(0.0);
  float r1 = 2.6 / res.x, r2 = 7.5 / res.x;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.785398;
    vec2 d1 = vec2(cos(a), sin(a));
    bloom += max(tap(uG + d1 * r1) - 0.22, 0.0) * 0.085;
    bloom += max(tap(uG + d1 * r2 * 1.9) - 0.30, 0.0) * 0.055;
  }
  col += bloom;

  float ph = mod(gl_FragCoord.x, 3.0);
  vec3 mask = vec3(ph<1.?1.10:0.88, (ph>=1.&&ph<2.)?1.10:0.88, ph>=2.?1.10:0.88);
  col *= mask;

  float scan = 0.5 + 0.5 * sin(uG.y * 844.0 * 3.14159);
  col *= mix(0.78, 1.05, scan);

  float band = fract(uG.y + t * 0.07);
  col += smoothstep(0.0, 0.05, band) * smoothstep(0.13, 0.05, band) * 0.05;

  float n = hash(floor(gl_FragCoord.xy * 0.5) + floor(t * 24.0));
  col += (n - 0.5) * 0.055;

  float seed = floor(t * 2.5);
  float ty = fract(hash(vec2(seed, 3.0)) + t * 0.35);
  col += step(0.86, hash(vec2(seed, 7.0))) * smoothstep(0.016, 0.0, abs(uG.y - ty)) * 0.18;

  col *= 1.0 + 0.02 * sin(t * 38.0);

  vec2 cc = uG * 2.0 - 1.0;
  col *= mix(0.62, 1.0, smoothstep(2.4, 0.35, dot(cc, cc)));

  // queda de sinal ocasional
  float dropout = step(0.985, hash(vec2(floor(t * 3.0), 11.0)));
  col *= 1.0 - dropout * 0.75;

  gl_FragColor = vec4(col * edge, 1.0);
}`;

  class TerminalGL extends HTMLElement {
    static get observedAttributes() { return ['lang']; }
    attributeChangedCallback(name, _old, val) {
      if (name === 'lang' && val && STR[val]) LANG = val;
    }
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      this.style.cssText = 'display:block;width:100%;height:100%;position:relative';

      this.tex = document.createElement('canvas');
      this.tex.width = W; this.tex.height = H;
      this.g = this.tex.getContext('2d');

      this.cv = document.createElement('canvas');
      this.cv.width = W; this.cv.height = H;
      this.cv.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(this.cv);

      this.state = { phase: 0, nline: 0, lines: [], open: null, menu: null, screen: 'registry', page: 0, postIndex: 0, scroll: 0, hover: null, mouse: null, t0: performance.now() };
      const a = this.getAttribute('lang');
      if (a && STR[a]) LANG = a;
      this.soundOn = this.getAttribute('sound') !== 'off';
      this.hits = [];

      this.avatar = new Image();
      this.avatar.src = this.getAttribute('avatar') || 'assets/avatar.png';

      this.initGL();
      this.bindInput();

      const fonts = document.fonts
        ? Promise.all([document.fonts.load(ps(16)), document.fonts.load(vt(26))]).catch(() => {})
        : Promise.resolve();
      Promise.all([fonts, new Promise(r => { this.avatar.onload = this.avatar.onerror = r; })])
        .then(() => { this.ready = true; this.boot(); });

      this.loop();
    }

    disconnectedCallback() {
      if (this._onUpWin) window.removeEventListener('mouseup', this._onUpWin);
      cancelAnimationFrame(this._raf);
      (this._timers || []).forEach(clearTimeout);
      clearInterval(this._li);
      this._init = false;
    }

    boot() {
      this._timers = [];
      this._timers.push(setTimeout(() => {
        this.state.phase = 1;
        this._li = setInterval(() => {
          const n = this.state.nline || 0;
          if (n >= T().boot.length) {
            clearInterval(this._li);
            this._timers.push(setTimeout(() => { this.state.phase = 2; this.dispatchEvent(new CustomEvent('ready')); }, 600));
            return;
          }
          this.state.nline = n + 1;
        }, 230);
      }, 1900));
    }

    /* ---------- input ---------- */

    // o cursor é guardado em coordenadas de tela e reprojetado a cada quadro,
    // senão ele descola quando a câmera anda por baixo do ponteiro
    syncPointer() {
      const c = this.state.client;
      if (!c) { this.state.mouse = null; this.state.hover = null; return; }
      const r = this.cv.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const p = { x: (c.x - r.left) / r.width * W, y: (c.y - r.top) / r.height * H };
      if (this.drag) {
        const mw = 860, mh = 440;
        const nx = this.drag.ox + (p.x - this.drag.px), ny = this.drag.oy + (p.y - this.drag.py);
        const bx = (W - mw) / 2, by = (H - mh) / 2;
        // deixa encostar nas bordas (a distorção do tubo faz o resto), mas nunca sumir
        this.state.modalOff = {
          x: Math.max(-bx - mw + 200, Math.min(W - bx - 200, nx)),
          y: Math.max(-by - 4, Math.min(H - by - 60, ny))
        };
        if (Math.abs(p.x - this.drag.px) + Math.abs(p.y - this.drag.py) > 5) this.drag.moved = true;
        this.state.mouse = p; this.state.hover = 'mdrag';
        return;
      }
      this.state.mouse = p;
      const hit = this.hits.find(h => p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h);
      this.state.hover = hit ? hit.id : null;
    }

    bindInput() {
      this.addEventListener('mousemove', e => {
        this.state.client = { x: e.clientX, y: e.clientY };
        this.syncPointer();
        this.cv.style.cursor = 'none';
      });
      this.addEventListener('mouseleave', () => { this.state.client = null; this.state.mouse = null; this.state.hover = null; });
      this.addEventListener('wheel', e => {
        if (this.state.screen !== 'post') return;
        this.state.scroll = Math.max(0, (this.state.scroll || 0) + e.deltaY * 1.2);
        e.preventDefault();
      }, { passive: false });
      this.addEventListener('mousedown', e => {
        this.state.client = { x: e.clientX, y: e.clientY };
        this.syncPointer();
        const p = this.state.mouse;
        const hit = p && this.hits.find(h => p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h);
        if (hit && hit.action === 'drag') {
          const o = this.state.modalOff || { x: 0, y: 0 };
          this.drag = { px: p.x, py: p.y, ox: o.x, oy: o.y, moved: false };
          e.preventDefault();
        }
      });
      this._onUpWin = () => { if (this.drag) { this._dragged = this.drag.moved; this.drag = null; } };
      window.addEventListener('mouseup', this._onUpWin);
      this.addEventListener('click', e => {
        this.state.client = { x: e.clientX, y: e.clientY };
        this.syncPointer();
        if (this._dragged) { this._dragged = false; return; }
        const p = this.state.mouse;
        const hit = p && this.hits.find(h => p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h);
        if (!hit) { this.state.menu = null; return; }
        if (hit.action === 'menu') this.state.menu = this.state.menu === hit.index ? null : hit.index;
        else if (hit.action === 'menuitem') { this.state.menu = null; this.runMenu(hit.item); }
        else if (hit.action === 'open') { this.state.menu = null; this.state.modalOff = { x: 0, y: 0 }; this.state.open = hit.key; }
        else if (hit.action === 'close') this.state.open = null;
        else if (hit.action === 'link') {
          const r = this.resolveInternal(hit.url);
          if (r) this.openInternal(r);
          else window.open(hit.url, '_blank', 'noopener');
        }
        else if (hit.action === 'screen') { this.state.menu = null; this.state.screen = hit.screen; this.state.page = 0; this.state.listStart = null; this.state.wikiStart = null; }
        else if (hit.action === 'post') { this.state.menu = null; this.state.from = 'blog'; this.state.postIndex = hit.index; this.state.scroll = 0; this._linesFor = null; this.state.screen = 'post'; }
        else if (hit.action === 'ui') {
          this.state.menu = null;
          if (hit.key === 'blogback') this.state.screen = 'registry';
          else if (hit.key === 'wikiback') this.state.screen = 'registry';
          else if (hit.key.indexOf('sec:') === 0) { this.state.section = +hit.key.slice(4); this.state.wikiStart = null; }
          else if (hit.key.indexOf('wiki:') === 0) {
            const secs = (this.wiki && this.wiki.sections) || [];
            const sec = secs[Math.min(this.state.section || 0, secs.length - 1)];
            this.wikiPage = sec && sec.pages[+hit.key.slice(5)];
            if (this.wikiPage) { this.state.from = 'wiki'; this.state.scroll = 0; this._linesFor = null; this.state.screen = 'post'; }
          }
          else if (hit.key === 'blogprev') { this.state.page = Math.max(0, (this.state.page || 0) - 1); this.state.listStart = null; }
          else if (hit.key === 'blognext') { this.state.page = (this.state.page || 0) + 1; this.state.listStart = null; }
          else if (hit.key === 'postback') this.state.screen = this.state.from === 'wiki' ? 'wiki' : 'blog';
          else if (hit.key === 'postopen') {
            const p = this.currentPost();
            if (p) window.open(this.postLink(p), '_blank', 'noopener');
          }
        }
      });
    }

    /* ---------- webgl ---------- */

    initGL() {
      const gl = this.gl = this.cv.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
      const p = gl.createProgram();
      gl.attachShader(p, sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));
      gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(p); gl.useProgram(p); this.prog = p;
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(p, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      this.uRes = gl.getUniformLocation(p, 'res');
      this.uT = gl.getUniformLocation(p, 't');
      this.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.viewport(0, 0, W, H);
      gl.uniform2f(this.uRes, W, H);
    }

    loop = () => {
      this._raf = requestAnimationFrame(this.loop);
      const t = (performance.now() - this.state.t0) / 1000;
      this.syncPointer();
      this.paint(t);
      const gl = this.gl;
      gl.useProgram(this.prog);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.tex);
      gl.uniform1f(this.uT, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    /* ---------- desenho da UI ---------- */

    paint(t) {
      const g = this.g;
      this.hits = [];
      g.fillStyle = C.bg;
      g.fillRect(0, 0, W, H);
      if (!this.ready) return;

      if (this.state.phase === 2) {
        if (this.state.screen === 'post') this.drawPost(g, t);
        else if (this.state.screen === 'blog') this.drawBlog(g, t);
        else if (this.state.screen === 'wiki') this.drawWiki(g, t);
        else this.drawRegistry(g, t);
        if (this.state.open) this.drawModal(g, t, T().projects[this.state.open]);
      }
      else if (this.state.phase === 1) this.drawLog(g, t);
      else this.drawLoading(g, t);

      if (this.state.phase === 2 && this.state.menu != null && !this.state.open) this.drawMenuPopup(g);

      this.drawCursor(g);
    }

    box(g, x, y, w, h, color, lw) {
      g.strokeStyle = color; g.lineWidth = lw || 2;
      g.strokeRect(x + (lw || 2) / 2, y + (lw || 2) / 2, w - (lw || 2), h - (lw || 2));
    }

    dashRule(g, x, y, w, color) {
      g.fillStyle = color;
      for (let i = 0; i < w; i += 16) g.fillRect(x + i, y, 8, 4);
    }

    drawLoading(g, t) {
      const bw = 520, bh = 150, x = (W - bw) / 2, y = (H - bh) / 2;
      this.box(g, x, y, bw, bh, C.cyan, 3);
      g.fillStyle = C.text; g.font = ps(16); g.textBaseline = 'top';
      const dots = (t * 1.2 % 1) < 0.5 ? '...' : '';
      g.fillText(T().loading + dots, x + 34, y + 30);
      const barX = x + 34, barY = y + 72, barW = bw - 68;
      this.box(g, barX, barY, barW, 22, C.line, 2);
      const p = Math.min(1, t / 1.9);
      g.save(); g.beginPath(); g.rect(barX + 2, barY + 2, (barW - 4) * p, 18); g.clip();
      g.fillStyle = C.cyan;
      for (let i = 0; i < barW; i += 16) g.fillRect(barX + 2 + i, barY + 2, 12, 18);
      g.restore();
      g.fillStyle = C.muted; g.font = vt(22);
      g.fillText(T().db, barX, barY + 34);
    }

    drawLog(g, t) {
      g.textBaseline = 'top'; g.font = vt(26);
      let y = 40;
      g.fillStyle = C.cyan; g.fillText(T().sync, 40, y); y += 40;
      g.fillStyle = C.text;
      T().boot.slice(0, this.state.nline || 0).forEach(l => { g.fillText(l, 40, y); y += 38; });
      g.fillStyle = C.muted;
      g.fillText('$ ' + ((t * 2 % 2) < 1 ? '█' : ''), 40, y + 12);
    }

    drawRegistry(g, t) {
      g.textBaseline = 'top';
      const PAD = 30;
      let y = this.chrome(g, 26, PAD);

      // cabecalho do registro
      g.font = ps(14); g.fillStyle = C.cyan;
      g.fillText(T().header, PAD, y + 2);
      const headW = g.measureText(T().header).width;
      g.font = ps(12); g.fillStyle = C.muted;
      const regW = g.measureText(T().reg).width;
      g.fillText(T().reg, W - PAD - regW, y + 3);
      this.dashRule(g, PAD + headW + 16, y + 7, W - PAD * 2 - headW - regW - 32, C.cyan);
      y += 46;

      // retrato
      const pxSize = 320, fx = PAD, fy = y;
      g.fillStyle = C.deep; g.fillRect(fx, fy, pxSize + 20, pxSize + 20);
      this.box(g, fx, fy, pxSize + 20, pxSize + 20, C.line, 2);
      if (this.avatar.complete && this.avatar.naturalWidth) {
        g.imageSmoothingEnabled = false;
        g.drawImage(this.avatar, fx + 10, fy + 10, pxSize, pxSize);
        this.avatarGlitch(g, t, fx + 10, fy + 10, pxSize);
        g.imageSmoothingEnabled = true;
      }

      // campos
      const cx = fx + pxSize + 20 + 44;
      let cy = fy + 4;
      g.font = vt(26);
      FIELDS_L().forEach(([label, value, color, url], i) => {
        g.fillStyle = C.muted;
        g.fillText(label, cx, cy);
        g.fillStyle = color;
        const vx = cx + 210;
        let txt = value;
        if (label.indexOf('STATUS') === 0) txt = value + ' ' + ((t * 2 % 2) < 1 ? '█' : '');
        g.fillText(txt, vx, cy);
        if (url) {
          const w = g.measureText(value).width;
          const hov = this.state.hover === 'lnk' + i;
          g.fillStyle = hov ? C.pink : C.line;
          g.fillRect(vx, cy + 30, w, 2);
          if (hov) { g.fillStyle = C.pink; g.fillText(value, vx, cy); }
          this.hits.push({ id: 'lnk' + i, action: 'link', url, x: vx, y: cy, w, h: 30 });
        }
        cy += 44;
      });

      // acoes
      cy += 16;
      const btn = (label, bx, fill, fg, shadow, screen) => {
        g.font = ps(12);
        const w = g.measureText(label).width + 52, h = 48;
        const hov = this.state.hover === 'btn' + label;
        const off = hov ? 3 : 0;
        g.fillStyle = shadow; g.fillRect(bx, cy + 6, w, h);
        if (fill) { g.fillStyle = fill; g.fillRect(bx, cy + off, w, h); }
        else { g.fillStyle = C.bg; g.fillRect(bx, cy + off, w, h); this.box(g, bx, cy + off, w, h, fg, 3); }
        g.fillStyle = fill ? '#07060c' : fg;
        g.fillText(label, bx + 26, cy + off + 17);
        this.hits.push(screen
          ? { id: 'btn' + label, action: 'screen', screen, x: bx, y: cy, w, h: h + 6 }
          : { id: 'btn' + label, action: 'link', url: '/docs/intro', x: bx, y: cy, w, h: h + 6 });
        return bx + w + 18;
      };
      let bx = cx;
      bx = btn('BLOG', bx, C.amber, C.amber, '#8a5f14', 'blog');
      btn('WIKI', bx, null, C.cyan, '#0d6d6d', 'wiki');

      // projetos
      y = fy + pxSize + 20 + 46;
      g.font = ps(14); g.fillStyle = C.pink;
      g.fillText('SELECT ▸', PAD, y);
      const selW = g.measureText('SELECT ▸').width;
      g.fillStyle = C.text;
      g.fillText(T().section, PAD + selW + 16, y);
      const titW = g.measureText(T().section).width;
      this.dashRule(g, PAD + selW + titW + 32, y + 5, W - PAD * 2 - selW - titW - 32, C.pink);
      y += 44;

      const cardW = (W - PAD * 2 - 18) / 2, cardH = 128;
      const PROJETOS = T().projects;
      Object.keys(PROJETOS).forEach((key, i) => {
        const p = PROJETOS[key];
        const x = PAD + i * (cardW + 18);
        const hov = this.state.hover === 'card' + key;
        const oy = hov ? -6 : 0;
        if (hov) { g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x, y + oy + cardH, cardW, 8); }
        g.fillStyle = C.panel; g.fillRect(x, y + oy, cardW, cardH);
        this.box(g, x, y + oy, cardW, cardH, p.color, 4);
        // miniatura
        const tx = x + 24, ty = y + oy + 28, ts = 72;
        g.save(); g.beginPath(); g.rect(tx, ty, ts, ts); g.clip();
        if (i === 0) {
          for (let a = 0; a < ts; a += 18) for (let b = 0; b < ts; b += 18) {
            g.fillStyle = ((a + b) / 18) % 2 ? C.panel : C.pink;
            g.fillRect(tx + a, ty + b, 18, 18);
          }
        } else {
          g.fillStyle = C.panel; g.fillRect(tx, ty, ts, ts);
          g.strokeStyle = C.cyan; g.lineWidth = 8;
          for (let a = -ts; a < ts * 2; a += 22) { g.beginPath(); g.moveTo(tx + a, ty + ts); g.lineTo(tx + a + ts, ty); g.stroke(); }
        }
        g.restore();
        this.box(g, tx, ty, ts, ts, i === 0 ? C.pink : C.cyan, 2);

        g.font = ps(15); g.fillStyle = p.color;
        g.fillText(p.name, tx + ts + 18, y + oy + 54);

        g.font = ps(13);
        const cta = T().open, ctaW = g.measureText(cta).width + 36;
        const ctaX = x + cardW - ctaW - 24, ctaY = y + oy + 36;
        this.box(g, ctaX, ctaY, ctaW, 56, C.muted, 3);
        g.fillStyle = C.text; g.fillText(cta, ctaX + 18, ctaY + 21);

        // seta piscando
        if ((t * 1 % 1) < 0.5) { g.font = ps(14); g.fillStyle = C.amber; g.fillText('▶', x - 26, y + oy + 56); }

        this.hits.push({ id: 'card' + key, action: 'open', key, x, y: y + oy, w: cardW, h: cardH });
      });

      // chao
      this.floor(g, t);
    }

    drawModal(g, t, p) {
      // a modal captura toda a interação: descarta os alvos da tela de baixo
      this.hits = [];
      g.fillStyle = 'rgba(7,6,12,.86)'; g.fillRect(0, 0, W, H);
      const mw = 860, mh = 440;
      const off = this.state.modalOff || { x: 0, y: 0 };
      const x = (W - mw) / 2 + off.x, y = (H - mh) / 2 + off.y;
      g.fillStyle = '#0b0913'; g.fillRect(x, y, mw, mh);
      this.box(g, x, y, mw, mh, C.cyan, 4);

      g.fillStyle = C.cyan; g.fillRect(x + 4, y + 4, mw - 8, 52);
      g.fillStyle = '#07060c'; g.font = ps(11); g.textBaseline = 'top';
      g.fillText(p.title, x + 20, y + 22);
      const closeX = x + mw - 62, closeHover = this.state.hover === 'close';
      g.fillStyle = closeHover ? C.pink : C.cyan;
      g.fillRect(closeX, y + 4, 58, 52);
      g.fillStyle = '#07060c'; g.font = ps(14);
      g.fillText('X', closeX + 20, y + 22);
      this.hits.push({ id: 'close', action: 'close', x: closeX, y: y + 4, w: 58, h: 52 });
      this.hits.push({ id: 'mdrag', action: 'drag', x: x + 4, y: y + 4, w: mw - 74, h: 52 });

      let ty = y + 86;
      g.font = vt(22); g.fillStyle = C.muted;
      g.fillText('$ cat readme.md', x + 34, ty); ty += 34;
      g.font = vt(26); g.fillStyle = C.text;
      wrap(g, p.body, x + 34, ty, mw - 100, 34); ty += 82;
      g.font = vt(22); g.fillStyle = C.muted;
      g.fillText('$ xdg-open', x + 34, ty); ty += 34;

      g.font = vt(26);
      [[p.url, C.cyan, 'lurl'], [p.repo, C.amber, 'lrepo']].forEach(([u, col, id]) => {
        const hov = this.state.hover === id;
        g.fillStyle = hov ? C.pink : col;
        g.fillText(u + ' ↗', x + 34, ty);
        const w = g.measureText(u + ' ↗').width;
        g.fillRect(x + 34, ty + 30, w, 2);
        this.hits.push({ id, action: 'link', url: u, x: x + 34, y: ty, w, h: 30 });
        ty += 46;
      });

      g.fillStyle = C.muted;
      g.fillText('$ ' + ((t * 2 % 2) < 1 ? '█' : ''), x + 34, ty + 16);

      // barra de rolagem chunky (decorativa)
      g.fillStyle = C.panel; g.fillRect(x + mw - 30, y + 56, 26, mh - 60);
      g.fillStyle = C.cyan; g.fillRect(x + mw - 30, y + 56, 4, mh - 60);
      g.fillRect(x + mw - 26, y + 76, 18, 150);
    }

    drawMenuPopup(g) {
      const m = T().menu[this.state.menu], pos = this.menuBar && this.menuBar[this.state.menu];
      if (!m || !pos) return;
      g.font = vt(24); g.textBaseline = 'top';
      const ih = 38, padx = 18, mark = 26, cap = 26, capGap = 6;
      let w = 0;
      m.items.forEach(it => {
        const keyW = it.keys ? it.keys.length * (cap + capGap) + 6 : 0;
        w = Math.max(w, keyW + g.measureText(it.label).width);
      });
      w += padx * 2 + mark;
      const h = m.items.length * ih + 12;
      let x = pos.x, y = pos.top;
      if (x + w > W - 30) x = W - 30 - w;

      g.fillStyle = 'rgba(7,6,12,.55)'; g.fillRect(x + 6, y + 6, w, h);
      g.fillStyle = C.panel; g.fillRect(x, y, w, h);
      this.box(g, x, y, w, h, C.cyan, 2);

      m.items.forEach((it, i) => {
        const iy = y + 6 + i * ih;
        const hov = this.state.hover === 'mi' + i && !it.disabled;
        if (hov) { g.fillStyle = C.deep; g.fillRect(x + 2, iy, w - 4, ih); }
        const active = it.id === 'sound' ? this.soundOn
          : it.id === 'lang-pt' ? LANG === 'pt'
          : it.id === 'lang-en' ? LANG === 'en' : false;
        if (active) { g.fillStyle = C.cyan; g.fillText(it.radio ? '▸' : '✓', x + padx - 2, iy + 7); }
        let tx = x + padx + mark;
        if (it.keys) {
          it.keys.forEach(k => {
            g.fillStyle = C.dim;
            g.fillRect(tx, iy + 6, cap, cap);
            g.font = ps(11); g.fillStyle = C.panel;
            const kw = g.measureText(k).width;
            g.fillText(k, tx + (cap - kw) / 2, iy + 14);
            g.font = vt(24);
            tx += cap + capGap;
          });
          tx += 6;
        }
        g.fillStyle = it.disabled ? C.muted : (hov ? C.text : C.dim);
        g.fillText(it.label, tx, iy + 7);
        if (!it.disabled) this.hits.unshift({ id: 'mi' + i, action: 'menuitem', item: it.id, x: x + 2, y: iy, w: w - 4, h: ih });
      });
    }

    runMenu(id) {
      if (id === 'reload') { clearInterval(this._li); (this._timers || []).forEach(clearTimeout); this.state.open = null; this.state.nline = 0; this.state.phase = 0; this.state.t0 = performance.now(); this.boot(); }
      else if (id === 'lang-pt' || id === 'lang-en') {
        LANG = id === 'lang-pt' ? 'pt' : 'en';
        this.setAttribute('lang', LANG);
        this.dispatchEvent(new CustomEvent('langchange', { bubbles: true, detail: LANG }));
      }
      else if (id === 'sound') {
        this.soundOn = !this.soundOn;
        this.dispatchEvent(new CustomEvent('soundchange', { bubbles: true, detail: this.soundOn }));
      }
    }

    /* ---------- blog ---------- */

    chrome(g, y, PAD) {
      const winW = W - PAD * 2, barH = 44, menuH = 44;
      g.fillStyle = C.panel; g.fillRect(PAD, y, winW, barH);
      g.fillStyle = C.panel2; g.fillRect(PAD, y + barH, winW, menuH);
      this.box(g, PAD, y, winW, barH + menuH, C.line, 2);
      g.fillStyle = C.dim; g.font = ps(12);
      g.fillText(T().winTitle, PAD + 18, y + 15);
      g.fillStyle = C.muted; g.font = ps(12);
      ['_', '□', 'X'].forEach((s, i) => {
        const bx = PAD + winW - 52 * (3 - i);
        g.strokeStyle = C.line; g.lineWidth = 2;
        g.beginPath(); g.moveTo(bx, y); g.lineTo(bx, y + barH); g.stroke();
        g.fillText(s, bx + 20, y + 15);
      });
      g.font = vt(24);
      let mx = PAD + 18;
      this.menuBar = [];
      T().menu.forEach((m, i) => {
        const w = g.measureText(m.label).width;
        const openM = this.state.menu === i;
        const hovM = this.state.hover === 'mbar' + i;
        if (openM || hovM) { g.fillStyle = openM ? C.cyan : C.line; g.fillRect(mx - 10, y + barH + 6, w + 20, 32); }
        g.fillStyle = openM ? '#07060c' : (hovM ? C.dim : C.muted);
        g.fillText(m.label, mx, y + barH + 11);
        this.menuBar.push({ x: mx - 10, w: w + 20, top: y + barH + 38 });
        this.hits.push({ id: 'mbar' + i, action: 'menu', index: i, x: mx - 10, y: y + barH + 6, w: w + 20, h: 32 });
        mx += w + 34;
      });
      return y + barH + menuH + 26;
    }

    // falha de sinal no retrato: faixas deslocadas, um borrao e volta ao normal
    avatarGlitch(g, t, x, y, size) {
      const src = this.avatar.naturalWidth || 64;
      const gs = this._glitch || (this._glitch = { next: t + 1.5 + Math.random() * 4, end: 0, bands: [] });
      if (t >= gs.next && t >= gs.end) {
        gs.end = t + 0.05 + Math.random() * 0.2;
        gs.next = gs.end + 1.8 + Math.random() * 6;
        const n = 2 + Math.floor(Math.random() * 4);
        gs.bands = [];
        for (let i = 0; i < n; i++) {
          gs.bands.push({
            sy: Math.floor(Math.random() * src),
            sh: 1 + Math.floor(Math.random() * 5),
            dx: Math.round((Math.random() - 0.5) * 14),
            soft: Math.random() < 0.35,
            tint: Math.random() < 0.3 ? (Math.random() < 0.5 ? C.cyan : C.pink) : null
          });
        }
      }
      if (t >= gs.end) return;

      const k = size / src;
      g.save();
      g.beginPath(); g.rect(x, y, size, size); g.clip();
      gs.bands.forEach(b => {
        const dy = y + b.sy * k, dh = b.sh * k;
        g.fillStyle = C.deep; g.fillRect(x, dy, size, dh);
        g.imageSmoothingEnabled = b.soft;
        g.drawImage(this.avatar, 0, b.sy, src, b.sh, x + b.dx * k, dy, size, dh);
        g.imageSmoothingEnabled = false;
        if (b.tint) {
          g.globalAlpha = 0.35; g.fillStyle = b.tint;
          g.fillRect(x, dy, size, dh);
          g.globalAlpha = 1;
        }
      });
      g.restore();
    }

    // botao de texto reaproveitado pelas telas de blog
    tbtn(g, label, x, y, id, color) {
      g.font = ps(12);
      const w = g.measureText(label).width + 34, h = 40;
      const hov = this.state.hover === id;
      this.box(g, x, y, w, h, hov ? C.pink : (color || C.muted), 3);
      g.fillStyle = hov ? C.pink : C.dim;
      g.fillText(label, x + 17, y + 14);
      this.hits.push({ id, action: 'ui', key: id, x, y, w, h });
      return w;
    }

    floor(g, t) {
      const gy = H - 38, off = (t * 40) % 64;
      for (let x = -64; x < W + 64; x += 64) {
        g.fillStyle = '#241f33'; g.fillRect(x - off, gy, 32, 38);
        g.fillStyle = '#1a1626'; g.fillRect(x - off + 32, gy, 32, 38);
      }
      g.fillStyle = '#3a3150'; g.fillRect(0, gy - 4, W, 4);
    }

    loadFeed() {
      if (this._feed) return;
      this._feed = true;
      const done = (items, offline) => {
        this.posts = items; this.offline = offline; this.feedReady = true;
      };
      const cache = () => fetch(this.getAttribute('blog-cache') || 'assets/blog-cache.json')
        .then(r => r.json())
        .then(j => { this.rawBase = j.raw; done(j.items.map((it, i) => Object.assign({}, it, { reg: j.items.length - i, blob: j.blob + it.file })), true); })
        .catch(() => done([], true));

      fetch(this.getAttribute('feed') || '/blog/rss.xml')
        .then(r => { if (!r.ok) throw 0; return r.text(); })
        .then(txt => {
          const doc = new DOMParser().parseFromString(txt, 'application/xml');
          const nodes = [].slice.call(doc.querySelectorAll('item'));
          if (!nodes.length) throw 0;
          const n = nodes.length;
          done(nodes.map((it, i) => {
            const get = s => (it.querySelector(s) || {}).textContent || '';
            const html = get('encoded') || get('description');
            return {
              title: get('title'), link: get('link'), reg: n - i,
              date: (get('pubDate') || '').slice(5, 16),
              tags: [].slice.call(it.querySelectorAll('category')).map(c => c.textContent),
              html
            };
          }), false);
          // liga cada item ao arquivo no repositorio para o link "ver origem"
          fetch(this.getAttribute('blog-cache') || 'assets/blog-cache.json')
            .then(r => r.json())
            .then(j => {
              const bySlug = {};
              j.items.forEach(it => { bySlug[it.slug] = j.blob + it.file; });
              (this.posts || []).forEach(p => {
                const slug = String(p.link || '').replace(/\/+$/, '').split('/').pop();
                if (bySlug[slug]) p.blob = bySlug[slug];
              });
            })
            .catch(() => {});
        })
        .catch(cache);
    }

    postLink(p) {
      return p.link || ('/blog/' + p.slug);
    }

    drawBlog(g, t) {
      g.textBaseline = 'top';
      const PAD = 30;
      let y = this.chrome(g, 26, PAD);
      this.loadFeed();

      const items = this.posts || [];
      g.font = ps(14); g.fillStyle = C.cyan;
      g.fillText(T().blogTitle, PAD, y + 2);
      const headW = g.measureText(T().blogTitle).width;
      g.font = ps(12); g.fillStyle = C.muted;
      const cnt = this.feedReady ? items.length + ' ' + T().blogCount : T().blogLoading + ((t * 1.2 % 1) < 0.5 ? '...' : '');
      const cntW = g.measureText(cnt).width;
      g.fillText(cnt, W - PAD - cntW, y + 3);
      this.dashRule(g, PAD + headW + 16, y + 7, W - PAD * 2 - headW - cntW - 32, C.cyan);
      y += 52;

      if (!this.feedReady) {
        g.font = vt(26); g.fillStyle = C.muted;
        g.fillText('$ curl -s /blog/rss.xml ' + ((t * 2 % 2) < 1 ? '█' : ''), PAD, y + 20);
        this.state.listStart = null;
        this.floor(g, t);
        return;
      }

      const PER = 5, pages = Math.max(1, Math.ceil(items.length / PER));
      const page = Math.min(this.state.page || 0, pages - 1);
      const rowH = 98;
      if (this.state.listStart == null) this.state.listStart = t;
      const el = t - this.state.listStart;

      // linha de comando digitada antes da lista aparecer
      const cmd = '$ ls -t blog/ --page ' + String(page + 1).padStart(2, '0');
      const cmdP = Math.min(1, el / 0.5);
      g.font = vt(24); g.fillStyle = C.muted;
      g.fillText(cmd.slice(0, Math.ceil(cmd.length * cmdP)) + (cmdP < 1 || (t * 2 % 2) < 1 ? '█' : ''), PAD, y);
      y += 34;

      const typed = (s, p) => String(s).slice(0, Math.ceil(String(s).length * p));
      items.slice(page * PER, page * PER + PER).forEach((p, i) => {
        const rp = Math.max(0, Math.min(1, (el - 0.5 - i * 0.13) / 0.34));
        if (rp <= 0) return;
        const iy = y + i * rowH;
        const hov = rp === 1 && this.state.hover === 'post' + i;
        if (hov) { g.fillStyle = C.panel; g.fillRect(PAD, iy, W - PAD * 2, rowH - 12); }
        g.fillStyle = hov ? C.pink : C.cyan;
        g.fillRect(PAD, iy, 6, (rowH - 12) * rp);

        const tx = PAD + 24;
        g.font = ps(11); g.fillStyle = C.muted;
        g.fillText(typed('REG #' + String(p.reg).padStart(4, '0') + '   ' + (p.date || ''), rp), tx, iy + 8);

        g.font = ps(14); g.fillStyle = hov ? C.text : C.dim;
        g.fillText(typed(this.clip(g, p.title, W - PAD * 2 - 60), rp), tx, iy + 32);

        g.font = vt(24); g.fillStyle = C.muted;
        const sub = (p.tags && p.tags.length) ? p.tags.join(' · ') : this.postLink(p);
        g.fillText(typed(this.clip(g, sub, W - PAD * 2 - 60), rp), tx, iy + 58);

        if (rp === 1) this.hits.push({ id: 'post' + i, action: 'post', index: page * PER + i, x: PAD, y: iy, w: W - PAD * 2, h: rowH - 12 });
      });

      // rodape: paginacao estilo DOS
      const fy = y + PER * rowH + 6;
      if (el < 0.5 + PER * 0.13) { this.floor(g, t); return; }
      let bx = PAD;
      bx += this.tbtn(g, T().back, bx, fy, 'blogback') + 16;
      if (page > 0) bx += this.tbtn(g, T().prev, bx, fy, 'blogprev') + 16;
      g.font = ps(12); g.fillStyle = C.dim;
      g.fillText(T().page + ' ' + String(page + 1).padStart(2, '0') + '/' + String(pages).padStart(2, '0'), bx + 4, fy + 14);
      bx += g.measureText(T().page + ' 00/00').width + 24;
      if (page < pages - 1) this.tbtn(g, T().next, bx, fy, 'blognext');
      if (this.offline) {
        g.font = vt(22); g.fillStyle = C.line;
        const w = g.measureText(T().offline).width;
        g.fillText(T().offline, W - PAD - w, fy + 16);
      }

      this.floor(g, t);
    }

    clip(g, s, maxW) {
      if (g.measureText(s).width <= maxW) return s;
      let out = s;
      while (out.length > 4 && g.measureText(out + '…').width > maxW) out = out.slice(0, -1);
      return out + '…';
    }

    // html do feed -> blocos de texto de terminal
    toBlocks(html) {
      const doc = new DOMParser().parseFromString('<body>' + (html || '') + '</body>', 'text/html');
      const out = [];
      const push = (kind, el) => {
        const segs = typeof el === 'string' ? [{ t: el.replace(/\s+/g, ' ').trim() }] : this.htmlSegs(el);
        if (segs.some(s => s.t.trim())) out.push({ kind, segs });
      };
      [].slice.call(doc.body.children).forEach(el => {
        const tag = el.tagName.toLowerCase();
        if (/^h[1-6]$/.test(tag)) push('h', el);
        else if (tag === 'ul' || tag === 'ol') [].slice.call(el.querySelectorAll('li')).forEach(li => push('li', li));
        else if (tag === 'pre') {
          const code = el.querySelector('code');
          const lang = ((code && code.className) || '').match(/language-([\w+-]+)/);
          (el.textContent || '').split('\n').forEach(l => out.push({ kind: 'code', lang: lang && lang[1], text: l.replace(/\t/g, '  ') }));
        }
        else if (tag === 'blockquote') push('quote', el);
        else if (tag === 'img' || tag === 'figure') out.push({ kind: 'img', segs: [{ t: '[ imagem ]' }] });
        else push('p', el);
      });
      if (!out.length) push('p', doc.body.textContent);
      return out;
    }

    // texto de um elemento preservando os <a> como trechos com url
    htmlSegs(el) {
      const segs = [];
      const walk = (node, url) => {
        [].slice.call(node.childNodes).forEach(n => {
          if (n.nodeType === 3) segs.push({ t: n.nodeValue.replace(/\s+/g, ' '), url });
          else if (n.nodeType === 1) {
            const tag = n.tagName.toLowerCase();
            if (tag === 'img') return;
            walk(n, tag === 'a' ? (n.getAttribute('href') || url) : url);
          }
        });
      };
      walk(el, null);
      return segs.length ? segs : [{ t: (el.textContent || '').replace(/\s+/g, ' ') }];
    }

    // markdown inline -> trechos, mantendo [texto](url) como link
    inlineSegs(str) {
      const out = [];
      const clean = s => s
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
        .replace(/`([^`]+)`/g, '$1');
      const re = /\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g;
      let last = 0, m;
      while ((m = re.exec(str))) {
        if (m.index > last) out.push({ t: clean(str.slice(last, m.index)) });
        out.push({ t: clean(m[1]), url: m[2] });
        last = m.index + m[0].length;
      }
      if (last < str.length) out.push({ t: clean(str.slice(last)) });
      return out.length ? out : [{ t: clean(str) }];
    }

    // sem feed (preview/offline) busca o markdown original no repositorio
    loadBody(p) {
      if (p.html || p.body || p._loading || !p.file || !(p.raw || this.rawBase)) return;
      p._loading = true;
      fetch((p.raw || this.rawBase) + p.file)
        .then(r => { if (!r.ok) throw 0; return r.text(); })
        .then(md => { p.body = md; this._linesFor = null; })
        .catch(() => { p.body = ''; this._linesFor = null; });
    }

    // markdown -> blocos de texto de terminal
    mdBlocks(md) {
      let s = String(md).replace(/\r/g, '');
      const fm = s.match(/^---[\s\S]*?\n---\n/);
      const fmOffset = fm ? fm[0].split('\n').length - 1 : 0;   // linhas comidas pelo frontmatter
      s = s.replace(/^---[\s\S]*?\n---\n/, '');
      s = s.replace(/<!--[\s\S]*?-->/g, '');
      s = s.replace(/^import .*$/gm, '');
      const out = [];
      let inCode = false, codeLang = '', lineNo = fmOffset;
      s.split('\n').forEach(line => {
        lineNo++;
        if (/^```/.test(line)) {
          if (!inCode) codeLang = (line.replace(/^```/, '').trim().split(/\s+/)[0] || '').toLowerCase();
          inCode = !inCode;
          return;
        }
        if (inCode) { out.push({ kind: 'code', lang: codeLang, src: lineNo, text: line.replace(/\t/g, '  ') }); return; }
        const raw = line.trim();
        if (!raw) { out.push({ kind: 'gapblock' }); return; }
        if (/^!\[/.test(raw)) { out.push({ kind: 'img', segs: [{ t: '[ ' + (raw.match(/^!\[([^\]]*)\]/) || [, 'imagem'])[1] + ' ]' }] }); return; }
        const inline = t => t.replace(/^#+\s*/, '');
        if (/^#{1,6}\s/.test(raw)) out.push({ kind: 'h', segs: this.inlineSegs(inline(raw)) });
        else if (/^[-*+]\s/.test(raw)) out.push({ kind: 'li', segs: this.inlineSegs(raw.replace(/^[-*+]\s/, '')) });
        else if (/^\d+\.\s/.test(raw)) out.push({ kind: 'li', segs: this.inlineSegs(raw) });
        else if (/^>/.test(raw)) out.push({ kind: 'quote', segs: this.inlineSegs(raw.replace(/^>\s?/, '')) });
        else if (/^\|/.test(raw)) {
          const cells = raw.split('|').slice(1, -1).map(c => c.trim());
          if (!cells.length || cells.every(c => /^:?-{2,}:?$/.test(c))) return;
          out.push({ kind: 'row', cols: cells.map(c => this.inlineSegs(c)) });
        }
        else if (/^(-{3,}|_{3,})$/.test(raw)) out.push({ kind: 'gapblock' });
        else out.push({ kind: 'p', segs: this.inlineSegs(raw) });
      });
      // junta paragrafos consecutivos
      const merged = [];
      out.forEach(b => {
        const last = merged[merged.length - 1];
        if (b.kind === 'p' && last && last.kind === 'p') last.segs = last.segs.concat([{ t: ' ' }], b.segs);
        else if (b.kind === 'gapblock') { if (last && last.kind !== 'gapblock') merged.push(b); }
        else merged.push(b);
      });
      return merged.filter(b => b.kind !== 'gapblock' || true);
    }

    currentPost() {
      return this.state.from === 'wiki' ? this.wikiPage : (this.posts || [])[this.state.postIndex || 0];
    }

    postLines(g, p) {
      if (this._linesFor === p) return this._lines;
      const maxW = W - 30 * 2 - 90;
      const lines = [];
      const blocks = p.html ? this.toBlocks(p.html) : this.mdBlocks(p.body || '');
      let prev = null, head = null;
      blocks.forEach(b => {
        if (b.kind !== 'code' && head) { lines.push({ kind: 'codefoot' }); head = null; }
        if (b.kind === 'gapblock') { if (prev !== 'code') lines.push({ kind: 'gap' }); prev = 'gapblock'; return; }
        if (b.kind === 'row') { lines.push({ kind: 'row', cols: b.cols }); prev = 'row'; return; }
        const font = b.kind === 'h' ? ps(13) : b.kind === 'code' ? vt(24) : vt(26);
        g.font = font;
        const prefix = b.kind === 'li' ? '• ' : b.kind === 'quote' ? '| ' : '';
        if (prev === 'code' && b.kind !== 'code') lines.push({ kind: 'gap' });
        if (b.kind === 'h') lines.push({ kind: 'gap' });
        if (b.kind === 'code' && !head) {
          head = { kind: 'codehead', lang: b.lang, from: b.src, to: b.src };
          lines.push(head);
        }
        if (b.kind === 'code' && head && b.src) head.to = b.src;
        (b.kind === 'code'
          ? [[{ t: b.text }]]
          : this.wrapSegs(g, b.segs || [{ t: b.text || '' }], maxW, prefix)
        ).forEach(segs => lines.push({ kind: b.kind, segs, lang: b.lang }));
        // linhas de codigo formam um bloco continuo: nada de respiro entre elas
        if (b.kind !== 'code') lines.push({ kind: 'gap' });
        prev = b.kind;
      });
      if (head) lines.push({ kind: 'codefoot' });
      this._linesFor = p;
      while (lines.length && lines[lines.length - 1].kind === 'gap') lines.pop();
      this._lines = lines;
      return lines;
    }

    // quebra trechos (texto + link) em linhas, preservando os limites de cada trecho
    wrapSegs(g, segs, maxW, prefix) {
      const lines = [];
      let cur = [], w = 0;
      if (prefix) { cur.push({ t: prefix }); w = g.measureText(prefix).width; }
      segs.forEach(s => {
        const words = String(s.t).split(/(\s+)/).filter(x => x !== '');
        words.forEach(word => {
          const ww = g.measureText(word).width;
          if (w + ww > maxW && cur.length && /\S/.test(word)) {
            lines.push(cur); cur = []; w = 0;
          }
          if (!cur.length && !/\S/.test(word)) return;
          const last = cur[cur.length - 1];
          if (last && last.url === s.url) last.t += word;
          else cur.push({ t: word, url: s.url });
          w += ww;
        });
      });
      if (cur.length) lines.push(cur);
      return lines.length ? lines : [[{ t: '' }]];
    }

    wrapText(g, text, maxW) {
      const words = String(text).split(' ');
      const out = []; let line = '';
      words.forEach(w => {
        const test = line ? line + ' ' + w : w;
        if (g.measureText(test).width > maxW && line) { out.push(line); line = w; }
        else line = test;
      });
      if (line) out.push(line);
      return out;
    }

    drawPost(g, t) {
      g.textBaseline = 'top';
      const PAD = 30;
      let y = this.chrome(g, 26, PAD);
      const p = this.currentPost();
      if (!p) { this.state.screen = this.state.from === 'wiki' ? 'wiki' : 'blog'; return; }
      this.loadWiki(); this.loadFeed();      // indices usados para resolver links internos

      g.font = ps(11); g.fillStyle = C.muted;
      g.fillText(this.state.from === 'wiki' ? p.file : ('REG #' + String(p.reg).padStart(4, '0') + '   ' + (p.date || '')), PAD, y);
      y += 26;
      g.font = ps(15); g.fillStyle = C.cyan;
      this.wrapText(g, p.title, W - PAD * 2 - 40).slice(0, 2).forEach(l => { g.fillText(l, PAD, y); y += 30; });
      y += 6;
      this.dashRule(g, PAD, y, W - PAD * 2, C.cyan);
      y += 18;

      const top = y, bottom = H - 108, viewH = bottom - top;
      if (!p.html && p.body == null) this.loadBody(p);
      const has = !!(p.html || p.body);
      const lines = has ? this.postLines(g, p) : null;
      const LH = 32;
      // altura real: linhas de respiro ocupam menos que uma linha inteira
      const total = lines ? lines.reduce((h, l) => h + (l.kind === 'gap' ? LH * 0.4 : (l.kind === 'codefoot' ? 14 : LH)), 0) : 0;
      const max = Math.max(0, total - viewH);
      this.state.scroll = Math.max(0, Math.min(max, this.state.scroll || 0));

      g.save();
      const band = { top, bottom };
      const srcUrl = p.blob || null;
      g.beginPath(); g.rect(PAD, top, W - PAD * 2 - 40, viewH); g.clip();
      if (lines) {
        let ly = top - this.state.scroll;
        lines.forEach((l, li) => {
          if (ly > top - LH && ly < bottom) {
            const cardW = W - PAD * 2 - 40;
            if (l.kind === 'codehead') {
              g.fillStyle = C.panel2; g.fillRect(PAD, ly - 4, cardW, LH);
              g.fillStyle = C.line; g.fillRect(PAD, ly - 4, cardW, 2);
              g.fillRect(PAD, ly - 4, 2, LH); g.fillRect(PAD + cardW - 2, ly - 4, 2, LH);
              g.font = ps(10); g.fillStyle = C.muted;
              g.fillText((l.lang || 'txt').toUpperCase(), PAD + 14, ly + 5);
              if (srcUrl) {
                g.font = vt(22);
                const lbl = T().viewSource, lw2 = g.measureText(lbl).width;
                const lx2 = PAD + cardW - 14 - lw2;
                const hid = 'src' + li, hov = this.state.hover === hid;
                g.fillStyle = hov ? C.pink : C.cyan;
                g.fillText(lbl, lx2, ly + 2);
                g.fillRect(lx2, ly + 24, lw2, 2);
                if (ly >= band.top && ly + 26 <= band.bottom) {
                  this.hits.push({ id: hid, action: 'link', url: srcUrl + (l.from ? '#L' + l.from + '-L' + l.to : ''), x: lx2, y: ly, w: lw2, h: 26 });
                }
              }
              ly += LH; return;
            }
            if (l.kind === 'codefoot') {
              g.fillStyle = C.line;
              g.fillRect(PAD, ly - 4, cardW, 2);
              ly += 14; return;
            }
            if (l.kind === 'h') { g.font = ps(13); g.fillStyle = C.amber; }
            else if (l.kind === 'code') {
              g.fillStyle = C.panel2; g.fillRect(PAD, ly - 4, cardW, LH);
              g.fillStyle = C.line;
              g.fillRect(PAD, ly - 4, 2, LH); g.fillRect(PAD + cardW - 2, ly - 4, 2, LH);
              g.font = vt(24);
              if (!l.tok) l.tok = tokenize((l.segs && l.segs[0] && l.segs[0].t) || l.text || '', l.lang);
              let cxp = PAD + 18;
              l.tok.forEach(tk => { g.fillStyle = tk.c; g.fillText(tk.t, cxp, ly); cxp += g.measureText(tk.t).width; });
              ly += LH; return;
            }
            else if (l.kind === 'quote') { g.font = vt(26); g.fillStyle = C.dim; }
            else if (l.kind === 'img') { g.font = vt(24); g.fillStyle = C.line; }
            else if (l.kind === 'row') {
              g.font = vt(24);
              const avail = W - PAD * 2 - 40, colW = avail * 0.38;
              this.drawSegs(g, l.cols[0], PAD, ly, colW - 16, C.dim, 'mdr' + li + 'a', band);
              if (l.cols[1]) this.drawSegs(g, l.cols[1], PAD + colW, ly, avail - colW, C.muted, 'mdr' + li + 'b', band);
              ly += LH; return;
            }
            else { g.font = vt(26); g.fillStyle = C.text; }
            this.drawSegs(g, l.segs || [{ t: l.text || '' }], PAD, ly, W - PAD * 2 - 40, g.fillStyle, 'mdl' + li, band);
          }
          ly += l.kind === 'gap' ? LH * 0.4 : (l.kind === 'codefoot' ? 14 : LH);
        });
      } else {
        g.font = vt(26); g.fillStyle = C.muted;
        g.fillText(p.body === '' ? T().noBody : (T().blogLoading + ((t * 2 % 2) < 1 ? '█' : '')), PAD, top + 10);
      }
      g.restore();

      if (max > 0) {
        const trackX = W - PAD - 30;
        g.fillStyle = C.panel; g.fillRect(trackX, top, 26, viewH);
        g.fillStyle = C.cyan; g.fillRect(trackX, top, 4, viewH);
        const kh = Math.max(60, viewH * viewH / total);
        const ky = top + (viewH - kh) * (this.state.scroll / max);
        g.fillRect(trackX + 4, ky, 18, kh);
      }

      let bx = PAD;
      const fy = H - 92;
      bx += this.tbtn(g, T().back, bx, fy, 'postback') + 16;
      this.tbtn(g, T().readOn, bx, fy, 'postopen', C.amber);
      if (max > 0) {
        g.font = vt(22); g.fillStyle = C.line;
        const w = g.measureText(T().scrollHint).width;
        g.fillText(T().scrollHint, W - PAD - w, fy + 16);
      }

      this.floor(g, t);
    }

    loadWiki() {
      if (this._wiki) return;
      this._wiki = true;
      fetch(this.getAttribute('wiki-index') || 'assets/wiki-index.json')
        .then(r => r.json())
        .then(j => {
          j.sections.forEach(s => s.pages.forEach(p => {
            p.raw = j.raw; p.link = j.site + p.slug; p.section = s.label; p.blob = j.blob + p.file;
          }));
          this.wiki = j; this.wikiReady = true;
        })
        .catch(() => { this.wiki = { sections: [] }; this.wikiReady = true; });
    }

    drawWiki(g, t) {
      g.textBaseline = 'top';
      const PAD = 30;
      let y = this.chrome(g, 26, PAD);
      this.loadWiki();
      const secs = (this.wiki && this.wiki.sections) || [];
      const total = secs.reduce((n, s) => n + s.pages.length, 0);

      g.font = ps(14); g.fillStyle = C.cyan;
      g.fillText(T().wikiTitle, PAD, y + 2);
      const headW = g.measureText(T().wikiTitle).width;
      g.font = ps(12); g.fillStyle = C.muted;
      const cnt = this.wikiReady ? total + ' ' + T().wikiPages : T().blogLoading + ((t * 1.2 % 1) < 0.5 ? '...' : '');
      const cntW = g.measureText(cnt).width;
      g.fillText(cnt, W - PAD - cntW, y + 3);
      this.dashRule(g, PAD + headW + 16, y + 7, W - PAD * 2 - headW - cntW - 32, C.cyan);
      y += 46;

      if (!this.wikiReady) {
        g.font = vt(26); g.fillStyle = C.muted;
        g.fillText('$ find docs/ -name "*.md" ' + ((t * 2 % 2) < 1 ? '█' : ''), PAD, y + 20);
        this.floor(g, t);
        return;
      }

      const panelH = H - 108 - y, lw = 320, rx = PAD + lw + 18, rw = W - PAD * 2 - lw - 18;
      const si = Math.min(this.state.section || 0, Math.max(0, secs.length - 1));
      if (this.state.wikiStart == null) this.state.wikiStart = t;
      const el = t - this.state.wikiStart;

      // painel esquerdo: secoes
      g.fillStyle = C.panel2; g.fillRect(PAD, y, lw, panelH);
      g.fillStyle = C.panel; g.fillRect(PAD, y, lw, 34);
      this.box(g, PAD, y, lw, panelH, C.cyan, 2);
      g.font = ps(11); g.fillStyle = C.cyan;
      g.fillText(T().wikiSections, PAD + 14, y + 11);

      secs.forEach((s, i) => {
        const ry = y + 42 + i * 44;
        const sel = i === si, hov = this.state.hover === 'sec' + i;
        if (sel) { g.fillStyle = C.cyan; g.fillRect(PAD + 2, ry, lw - 4, 40); }
        else if (hov) { g.fillStyle = C.panel; g.fillRect(PAD + 2, ry, lw - 4, 40); }
        g.font = vt(26); g.fillStyle = sel ? '#07060c' : (hov ? C.text : C.dim);
        g.fillText((sel ? '▸ ' : '  ') + s.label, PAD + 16, ry + 8);
        const c = '(' + s.pages.length + ')';
        g.fillStyle = sel ? '#07060c' : C.muted;
        g.fillText(c, PAD + lw - 22 - g.measureText(c).width, ry + 8);
        this.hits.push({ id: 'sec' + i, action: 'ui', key: 'sec:' + i, x: PAD + 2, y: ry, w: lw - 4, h: 40 });
      });

      // painel direito: paginas da secao
      g.fillStyle = C.panel2; g.fillRect(rx, y, rw, panelH);
      g.fillStyle = C.panel; g.fillRect(rx, y, rw, 34);
      this.box(g, rx, y, rw, panelH, C.line, 2);
      const sec = secs[si];
      g.font = ps(11); g.fillStyle = C.dim;
      g.fillText('docs/' + (sec && sec.name !== 'raiz' ? sec.name + '/' : ''), rx + 14, y + 11);

      if (!sec || !sec.pages.length) {
        g.font = vt(26); g.fillStyle = C.muted;
        g.fillText(T().wikiEmpty, rx + 16, y + 56);
      } else {
        sec.pages.forEach((p, i) => {
          const rp = Math.max(0, Math.min(1, (el - i * 0.05) / 0.22));
          if (rp <= 0) return;
          const ry = y + 42 + i * 44;
          const hov = rp === 1 && this.state.hover === 'wp' + i;
          if (hov) { g.fillStyle = C.panel; g.fillRect(rx + 2, ry, rw - 4, 40); }
          g.fillStyle = hov ? C.pink : C.line;
          g.fillRect(rx + 2, ry + 6, 4, 28 * rp);

          const cut = s => String(s).slice(0, Math.ceil(String(s).length * rp));
          g.font = ps(12); g.fillStyle = hov ? C.text : C.dim;
          g.fillText(cut(this.clip(g, p.title, rw * 0.56)), rx + 18, ry + 10);
          g.font = vt(22); g.fillStyle = C.muted;
          const path = cut(p.file);
          g.fillText(path, rx + rw - 18 - g.measureText(path).width, ry + 12);
          if (rp === 1) this.hits.push({ id: 'wp' + i, action: 'ui', key: 'wiki:' + i, x: rx + 2, y: ry, w: rw - 4, h: 40 });
        });
      }

      this.tbtn(g, T().back, PAD, H - 92, 'wikiback');
      this.floor(g, t);
    }

    // desenha trechos em sequencia, links no estilo da ficha
    drawSegs(g, segs, x, ly, maxW, base, id, band) {
      let lx = x;
      (segs || []).forEach((s, si) => {
        if (!s.t) return;
        let txt = s.t;
        let w = g.measureText(txt).width;
        if (lx + w > x + maxW) {
          while (txt.length > 1 && lx + g.measureText(txt + '…').width > x + maxW) txt = txt.slice(0, -1);
          if (txt.length <= 1) return;
          txt += '…';
          w = g.measureText(txt).width;
        }
        if (s.url) {
          const hid = id + '_' + si;
          const hov = this.state.hover === hid;
          g.fillStyle = hov ? C.pink : C.cyan;
          g.fillText(txt, lx, ly);
          g.fillRect(lx, ly + 26, w, 2);
          this.hits.push({ id: hid, action: 'link', url: s.url, x: lx, y: ly, w, h: 28 });
          // fora da area de leitura o link nao pode capturar clique
          if (band && (ly < band.top || ly + 28 > band.bottom)) this.hits.pop();
        } else {
          g.fillStyle = base;
          g.fillText(txt, lx, ly);
        }
        lx += w;
      });
    }

    // link interno (outra pagina do wiki ou artigo do blog) -> abre no proprio terminal
    resolveInternal(url) {
      if (!url) return null;
      let u = String(url).split('#')[0].split('?')[0];
      if (/^(mailto|tel):/i.test(u)) return null;
      if (/^https?:\/\//i.test(u)) {
        if (!/^https?:\/\/(www\.)?sciotta\.com\.br/i.test(u)) return null;
        u = u.replace(/^https?:\/\/[^/]+/i, '');
      }
      const secs = (this.wiki && this.wiki.sections) || [];
      const pages = secs.reduce((a, s) => a.concat(s.pages), []);
      const norm = s => String(s).replace(/^\/+|\/+$/g, '');

      // caminho relativo ao arquivo atual
      if (!u.startsWith('/')) {
        const cur = this.currentPost();
        const base = (cur && cur.file || '').split('/').slice(0, -1);
        const parts = base.concat(u.split('/'));
        const stack = [];
        parts.forEach(x => {
          if (!x || x === '.') return;
          if (x === '..') stack.pop();
          else stack.push(x);
        });
        u = '/' + stack.join('/');
      }
      const path = norm(u);
      const noExt = path.replace(/\.mdx?$/, '').replace(/\/index$/, '');

      let page = pages.find(p => norm(p.file) === path);
      if (!page) page = pages.find(p => norm(p.file).replace(/\.mdx?$/, '').replace(/\/index$/, '') === noExt);
      if (!page) page = pages.find(p => 'docs/' + norm(p.slug) === noExt);
      if (page) return { type: 'wiki', page };

      const posts = this.posts || [];
      const bslug = noExt.replace(/^blog\//, '');
      const pi = posts.findIndex(p => (p.slug && p.slug === bslug) || (p.link && norm(String(p.link).replace(/^https?:\/\/[^/]+/i, '')) === noExt));
      if (pi >= 0) return { type: 'blog', index: pi };
      return null;
    }

    openInternal(r) {
      this.state.menu = null;
      this.state.scroll = 0;
      this._linesFor = null;
      if (r.type === 'wiki') { this.wikiPage = r.page; this.state.from = 'wiki'; }
      else { this.state.postIndex = r.index; this.state.from = 'blog'; }
      this.state.screen = 'post';
    }

    drawCursor(g) {
      const m = this.state.mouse;
      if (!m) return;
      const x = Math.round(m.x / 4) * 4, y = Math.round(m.y / 4) * 4;
      const px = 4;
      if (this.state.hover) {
        g.fillStyle = C.cyan;
        const s = [[0, 0, 3, 1], [0, 1, 1, 2], [6, 0, 3, 1], [8, 1, 1, 2], [0, 8, 3, 1], [0, 6, 1, 2], [6, 8, 3, 1], [8, 6, 1, 2], [4, 4, 1, 1]];
        s.forEach(([a, b, w, h]) => g.fillRect(x - 18 + a * px, y - 18 + b * px, w * px, h * px));
      } else {
        g.fillStyle = C.text;
        const s = [[0, 0, 1, 1], [0, 1, 2, 1], [0, 2, 3, 1], [0, 3, 4, 1], [0, 4, 5, 1], [0, 5, 6, 1], [0, 6, 2, 1], [3, 6, 2, 1], [0, 7, 1, 1], [3, 7, 2, 1], [4, 8, 2, 1]];
        s.forEach(([a, b, w, h]) => g.fillRect(x + a * px, y + b * px, w * px, h * px));
      }
    }
  }

  function wrap(g, text, x, y, maxW, lh) {
    const words = text.split(' ');
    let line = '';
    words.forEach(w => {
      const test = line ? line + ' ' + w : w;
      if (g.measureText(test).width > maxW) { g.fillText(line, x, y); y += lh; line = w; }
      else line = test;
    });
    if (line) g.fillText(line, x, y);
  }

  if (!customElements.get('terminal-gl')) customElements.define('terminal-gl', TerminalGL);
})();
