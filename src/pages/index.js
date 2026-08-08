import React, { useEffect, useRef, useState } from 'react';
import Head from '@docusaurus/Head';
import './index.css';
import avatarUrl from '@site/static/img/sciotta-avatar.png';

const BOOT = [
  'montando /dev/tty1 ................ ok',
  'verificando integridade do registro ... ok',
  'abrindo base CADASTRO.DB .......... 2 tabelas',
  'carregando REG #0001 .............. SCIOTTA, T.',
  'decodificando FOTO 64x64 .......... 4096 px',
  'sincronizando projetos ............ 2 itens',
  'resolvendo links externos ......... 3 hosts',
  'aplicando perfil de video ......... 9600 8N1',
  'pronto.',
];

const PROJETOS = {
  tokens: {
    title: 'sciotta@tty1: ~/src/tokens-to-styles',
    name: 'tokens-to-styles',
    body: 'Converte tokens de design em variáveis CSS prontas para uso, mantendo Figma e código sincronizados.',
    url: 'https://tokens-to-styles.sciotta.com.br/',
    repo: 'https://github.com/sciotta/tokens-to-styles',
  },
  color: {
    title: 'sciotta@tty1: ~/src/color-doctor',
    name: 'color-doctor',
    body: 'Mapeia e simplifica a paleta de cores do seu projeto React com um único comando.',
    url: 'https://color-doctor.sciotta.com.br/',
    repo: 'https://github.com/sciotta/color-doctor',
  },
};

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FRAG = `precision highp float;
uniform vec2 res;uniform float t;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 uv=gl_FragCoord.xy/res;
  vec2 c=uv*2.-1.;
  float r2=dot(c,c);
  vec2 d=c*(1.+0.045*r2);
  vec2 duv=d*.5+.5;
  float edge=(duv.x<0.||duv.x>1.||duv.y<0.||duv.y>1.)?0.:1.;
  float ph=mod(gl_FragCoord.x,3.);
  vec3 mask=vec3(ph<1.?1.12:0.86,(ph>=1.&&ph<2.)?1.12:0.86,ph>=2.?1.12:0.86);
  float scan=0.5+0.5*sin(duv.y*res.y*3.14159);
  float scanl=mix(0.74,1.06,scan);
  float band=fract(duv.y+t*0.07);
  float sweep=smoothstep(0.0,0.05,band)*smoothstep(0.13,0.05,band);
  float n=hash(floor(gl_FragCoord.xy*0.5)+floor(t*24.0));
  float seed=floor(t*2.5);
  float ty=fract(hash(vec2(seed,3.0))+t*0.35);
  float tear=step(0.86,hash(vec2(seed,7.0)))*smoothstep(0.018,0.0,abs(duv.y-ty));
  float flick=1.0+0.02*sin(t*38.0)+0.015*hash(vec2(floor(t*12.0),1.0));
  vec3 col=vec3(0.5)*mask*scanl*flick;
  col+=sweep*0.09;
  col+=(n-0.5)*0.085;
  col+=tear*0.22;
  float vig=smoothstep(2.05,0.35,r2);
  col*=mix(0.30,1.0,vig);
  col=mix(vec3(0.0),col,edge);
  gl_FragColor=vec4(col,1.0);
}`;

function CrtCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'res');
    const uT = gl.getUniformLocation(prog, 't');
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.max(1, Math.round(cv.clientWidth * dpr));
      cv.height = Math.max(1, Math.round(cv.clientHeight * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    const t0 = performance.now();
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      gl.uniform1f(uT, (performance.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return <canvas ref={ref} className="crt-canvas" />;
}

function PixelCursor({ screenRef }) {
  const cur = useRef(null);
  const arrow = useRef(null);
  const hand = useRef(null);
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;
    const move = (e) => {
      const r = screen.getBoundingClientRect();
      const x = Math.round((e.clientX - r.left) / 4) * 4;
      const y = Math.round((e.clientY - r.top) / 4) * 4;
      if (!cur.current) return;
      cur.current.style.transform = `translate(${x}px,${y}px)`;
      cur.current.style.opacity = '1';
      const over = !!(e.target.closest && e.target.closest('a,button,[role="button"]'));
      if (arrow.current) arrow.current.style.display = over ? 'none' : 'block';
      if (hand.current) hand.current.style.display = over ? 'block' : 'none';
    };
    const leave = () => {
      if (cur.current) cur.current.style.opacity = '0';
    };
    screen.addEventListener('mousemove', move);
    screen.addEventListener('mouseleave', leave);
    return () => {
      screen.removeEventListener('mousemove', move);
      screen.removeEventListener('mouseleave', leave);
    };
  }, [screenRef]);

  return (
    <div ref={cur} className="pixel-cursor">
      <svg ref={arrow} className="cur-arrow" width="24" height="36" viewBox="0 0 6 9" shapeRendering="crispEdges">
        <g fill="#f2e3c6">
          <rect x="0" y="0" width="1" height="1" /><rect x="0" y="1" width="2" height="1" />
          <rect x="0" y="2" width="3" height="1" /><rect x="0" y="3" width="4" height="1" />
          <rect x="0" y="4" width="5" height="1" /><rect x="0" y="5" width="6" height="1" />
          <rect x="0" y="6" width="2" height="1" /><rect x="3" y="6" width="2" height="1" />
          <rect x="0" y="7" width="1" height="1" /><rect x="3" y="7" width="2" height="1" />
          <rect x="4" y="8" width="2" height="1" />
        </g>
      </svg>
      <svg ref={hand} className="cur-target" width="36" height="36" viewBox="0 0 9 9" shapeRendering="crispEdges">
        <g fill="#23e5e5">
          <rect x="0" y="0" width="3" height="1" /><rect x="0" y="1" width="1" height="2" />
          <rect x="6" y="0" width="3" height="1" /><rect x="8" y="1" width="1" height="2" />
          <rect x="0" y="8" width="3" height="1" /><rect x="0" y="6" width="1" height="2" />
          <rect x="6" y="8" width="3" height="1" /><rect x="8" y="6" width="1" height="2" />
          <rect x="4" y="4" width="1" height="1" />
        </g>
      </svg>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState(0);
  const [lines, setLines] = useState([]);
  const [open, setOpen] = useState(null);
  const [mem, setMem] = useState(2400);
  const screenRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 1900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 1) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setLines(BOOT.slice(0, i));
      if (i >= BOOT.length) {
        clearInterval(id);
        setTimeout(() => setPhase(2), 600);
      }
    }, 230);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    const id = setInterval(() => setMem((m) => m + 100), 900);
    return () => clearInterval(id);
  }, []);

  const p = open ? PROJETOS[open] : null;

  return (
    <>
      <Head>
        <title>Sciotta</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap"
        />
      </Head>

      <div className="crt-screen crt-cursor" ref={screenRef}>
        <svg width="0" height="0" className="crt-defs" aria-hidden="true">
          <defs>
            <filter id="crtwarp" x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
              <feImage href="/img/barrel-map.png" x="0%" y="0%" width="100%" height="100%" preserveAspectRatio="none" result="map" />
              <feDisplacementMap in="SourceGraphic" in2="map" scale="58" xChannelSelector="R" yChannelSelector="G" result="dR" />
              <feColorMatrix in="dR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="R" />
              <feDisplacementMap in="SourceGraphic" in2="map" scale="50" xChannelSelector="R" yChannelSelector="G" result="dG" />
              <feColorMatrix in="dG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="G" />
              <feDisplacementMap in="SourceGraphic" in2="map" scale="42" xChannelSelector="R" yChannelSelector="G" result="dB" />
              <feColorMatrix in="dB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="B" />
              <feBlend in="R" in2="G" mode="screen" result="RG" />
              <feBlend in="RG" in2="B" mode="screen" />
            </filter>
          </defs>
        </svg>

        <div className="warp">
          {phase === 2 && (
            <>
              <section className="hero-pad">
                <div className="win">
                  <div className="win-bar">
                    <span className="win-title">sciotta@tty1: ~/cadastro</span>
                    <div className="win-btns">
                      <span>_</span>
                      <span>□</span>
                      <span>X</span>
                    </div>
                  </div>
                  <div className="win-menu">
                    <span className="on">Arquivo</span><span>Editar</span><span>Ver</span><span>Registro</span><span>Ajuda</span>
                  </div>
                </div>

                <div className="reg-head">
                  <span className="reg-head-title">CADASTRO DE PESSOAS</span>
                  <span className="reg-head-rule" />
                  <span className="reg-head-id">REG #0001</span>
                </div>

                <div className="reg-body">
                  <div className="px-portrait">
                    <div className="px-frame">
                      <img src={avatarUrl} alt="Sciotta em pixel art" className="px-img" />
                    </div>
                  </div>

                  <div className="fields">
                    <div className="row r1"><span className="lbl">NOME .........</span><span className="val-accent">SCIOTTA, T.</span></div>
                    <div className="row r2"><span className="lbl">OCUPACAO .....</span><span>Software developer, building things for the web.</span></div>
                    <div className="row r3"><span className="lbl">LINKEDIN .....</span><a href="https://www.linkedin.com/in/sciotta/" target="_blank" rel="noopener noreferrer">linkedin.com/in/sciotta</a></div>
                    <div className="row r4"><span className="lbl">GITHUB .......</span><a href="https://github.com/thiagog3" target="_blank" rel="noopener noreferrer">github.com/thiagog3</a></div>
                    <div className="row r5"><span className="lbl">YOUTUBE ......</span><a href="https://www.youtube.com/channel/UCfNbBxgDSTvcOJ3X5uD1jZQ" target="_blank" rel="noopener noreferrer">youtube.com/@sciotta</a></div>
                    <div className="row r6"><span className="lbl">STATUS .......</span><span className="val-amber">ONLINE <span className="blink">█</span></span></div>

                    <div className="actions">
                      <a className="btn-solid" href="/blog">BLOG</a>
                      <a className="btn-outline" href="/docs/intro">WIKI</a>
                    </div>
                  </div>
                </div>
              </section>

              <section className="hero-pad">
                <div className="sec-head">
                  <span className="sec-head-title">SELECT ▸</span>
                  <span className="sec-head-name">PROJETOS OPEN SOURCE</span>
                  <span className="sec-head-rule" />
                </div>
                <div className="proj-grid">
                  <div role="button" tabIndex={0} className="proj cyan" onClick={() => setOpen('tokens')} onKeyDown={(e) => e.key === 'Enter' && setOpen('tokens')}>
                    <span className="sel">▶</span>
                    <span className="thumb thumb-checker" />
                    <span className="proj-name">tokens-to-styles</span>
                    <span className="proj-cta">ABRIR ▸</span>
                  </div>
                  <div role="button" tabIndex={0} className="proj amber" onClick={() => setOpen('color')} onKeyDown={(e) => e.key === 'Enter' && setOpen('color')}>
                    <span className="sel sel-b">▶</span>
                    <span className="thumb thumb-stripes" />
                    <span className="proj-name">color-doctor</span>
                    <span className="proj-cta">ABRIR ▸</span>
                  </div>
                </div>
              </section>

              <div className="ground" />
            </>
          )}
        </div>

        {phase < 2 && (
          <div className="boot">
            {phase === 0 && (
              <div className="boot-box">
                <div className="boot-title">CARREGANDO<span className="blink">...</span></div>
                <div className="boot-bar"><div className="boot-fill" /></div>
                <div className="boot-sub">CADASTRO.DB &nbsp;/dev/tty1</div>
              </div>
            )}
            {phase === 1 && (
              <div className="boot-log">
                <div className="cmd">$ sync --registro 0001</div>
                {lines.map((l) => (<div key={l}>{l}</div>))}
                <div className="cmd-dim">$ <span className="blink">█</span></div>
              </div>
            )}
          </div>
        )}

        {p && (
          <div className="modal-back">
            <div className="modal">
              <div className="modal-bar">
                <span>{p.title}</span>
                <button type="button" onClick={() => setOpen(null)} aria-label="Fechar">X</button>
              </div>
              <div className="term-scroll modal-body">
                <div className="cmd-dim">$ cat readme.md</div>
                <p>{p.body}</p>
                <div className="cmd-dim mt">$ xdg-open</div>
                <a className="lnk-cyan" href={p.url} target="_blank" rel="noopener noreferrer">{p.url} ↗</a>
                <div className="mt"><a className="lnk-amber" href={p.repo} target="_blank" rel="noopener noreferrer">{p.repo} ↗</a></div>
                <div className="cmd-dim mt">$ <span className="blink">█</span></div>
              </div>
            </div>
          </div>
        )}

        <div className="bloom bloom-near" />
        <div className="bloom bloom-far" />
        <div className="crt-layer"><CrtCanvas /></div>
        <div className="dropout" />
        <PixelCursor screenRef={screenRef} />
        <span className="mem">MEM {String(mem).padStart(6, '0')}K</span>
      </div>
    </>
  );
}
