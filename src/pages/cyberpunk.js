import React, { useEffect, useRef } from 'react';
import Head from '@docusaurus/Head';

const B = '/painel/';

const CSS = `
html,body{height:100%;margin:0;background:#07060c}
#__docusaurus{height:100%}
.cp-viewport{position:fixed;inset:0;overflow:hidden;background:#07060c;z-index:1}
.cp-stage{position:absolute;left:0;top:0;width:2816px;height:1536px;transform-origin:0 0;will-change:transform;backface-visibility:hidden;
  background-image:url(${B}panel.jpg);background-position:center;background-size:cover;background-repeat:no-repeat}
@media (max-width:1100px){.cp-stage{background-image:url(${B}panel-1600.jpg)}}
.cp-slot{position:absolute;left:35.192%;top:24.870%;width:30.078%;height:37.826%;overflow:hidden;transform:translateZ(0);
  -webkit-mask-image:url(${B}screen-mask.png);mask-image:url(${B}screen-mask.png);
  -webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
.cp-glow{position:absolute;left:35.192%;top:24.870%;width:30.078%;height:37.826%;pointer-events:none;z-index:2;border-radius:40px/32px;
  box-shadow:inset 0 0 40px 12px rgba(0,0,0,.5),0 0 80px 14px rgba(35,229,229,.12)}
`;

const SW = 2816, SH = 1536;
const SLOT = { x: 0.35192 * SW, y: 0.2487 * SH, w: 0.30078 * SW, h: 0.37826 * SH };

export default function Cyberpunk() {
  const stageRef = useRef(null);
  const slotRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const st = { walk: 0, vel: 0, speed: 0, lean: 0, stepPhase: 0, foot: null, keys: null, moving: false };
    let raf = 0, raf2 = 0, gone = false, amb = null;

    const fit = () => {
      if (!stage) return;
      const vw = window.innerWidth, vh = window.innerHeight, e = st.walk;
      const sFar = Math.max(vw / SW, vh / SH);
      const sNear = Math.max(Math.min((vw * 0.74) / SLOT.w, (vh * 0.78) / SLOT.h), sFar);
      const s = sFar + (sNear - sFar) * e;
      const fx = SW / 2, fy = SH * 0.46;
      const nx = SLOT.x + SLOT.w / 2, ny = SLOT.y + SLOT.h / 2;
      const cx = fx + (nx - fx) * e, cy = fy + (ny - fy) * e;
      const f = 1.25;
      const entering = !st.keys;
      const t = st.moving ? st.stepPhase : performance.now() / 1000;
      const amp = entering ? 34 * Math.max(0, 1 - e) : 18 * st.speed;
      const bobY = Math.sin(t * 2 * Math.PI * f) * amp;
      const bobX = Math.sin(t * Math.PI * f) * amp * 1.15;
      const ss = s * (1 + Math.sin(t * 2 * Math.PI * f) * 0.004 * (amp / 34));
      footsteps(t * f, amp);
      const leanPx = st.lean * SLOT.w * 0.16 * ss;
      let px = vw / 2 - cx * ss + bobX - leanPx, py = vh / 2 - cy * ss + bobY;
      px = Math.min(0, Math.max(vw - SW * ss, px));
      py = Math.min(0, Math.max(vh - SH * ss, py));
      stage.style.transform = 'translate(' + px + 'px,' + py + 'px) scale(' + ss + ')';
    };

    const footsteps = (phase, amp) => {
      if (amp < 3.5 || !amb) { st.foot = null; return; }
      const slot = Math.floor(phase + 0.25);
      if (st.foot === null) { st.foot = slot; return; }
      if (slot !== st.foot) { st.foot = slot; amb.step(0.35 + (amp / 34) * 0.75); }
    };

    const SPEED = 0.34;
    const stepLoop = () => {
      if (st.moving) return;
      st.moving = true;
      let last = performance.now();
      const tick = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const dir = (st.keys.w ? 1 : 0) - (st.keys.s ? 1 : 0);
        const k = dir !== 0 ? 5.5 : 2.6;
        st.vel += (dir * SPEED - st.vel) * Math.min(1, dt * k);
        const before = st.walk;
        st.walk = Math.max(0, Math.min(1, st.walk + st.vel * dt));
        if (st.walk === before && dir === 0) st.vel *= 0.6;
        st.speed = Math.abs(st.vel) / SPEED;
        st.stepPhase += dt * 1.25 * st.speed;
        const side = (st.keys.d ? 1 : 0) - (st.keys.a ? 1 : 0);
        const lean = st.lean + (side - st.lean) * Math.min(1, dt * (side ? 4.5 : 3.2));
        st.lean = Math.abs(lean) < 0.002 && side === 0 ? 0 : lean;
        fit();
        if (dir !== 0 || side !== 0 || Math.abs(st.vel) > 0.004 || Math.abs(st.lean) > 0.002) raf2 = requestAnimationFrame(tick);
        else { st.vel = 0; st.speed = 0; st.lean = 0; st.moving = false; fit(); }
      };
      tick();
    };

    const MAP = { w: 'w', arrowup: 'w', s: 's', arrowdown: 's', a: 'a', arrowleft: 'a', d: 'd', arrowright: 'd' };
    let onDown, onUp;
    const enableKeys = () => {
      if (st.keys) return;
      st.keys = { w: false, s: false, a: false, d: false };
      const set = (e, down) => {
        const key = MAP[(e.key || '').toLowerCase()];
        if (!key) return;
        st.keys[key] = down;
        e.preventDefault();
        stepLoop();
      };
      onDown = e => set(e, true);
      onUp = e => set(e, false);
      window.addEventListener('keydown', onDown);
      window.addEventListener('keyup', onUp);
    };

    const approach = () => {
      const D = 6200, t0 = performance.now();
      const step = () => {
        const p = Math.min(1, (performance.now() - t0) / D);
        st.walk = 1 - Math.pow(1 - p, 3);
        fit();
        if (p < 1) raf = requestAnimationFrame(step);
        else { st.walk = 1; fit(); enableKeys(); }
      };
      step();
    };

    const loadScript = src => new Promise(res => {
      if (document.querySelector('script[src="' + src + '"]')) return res();
      const s = document.createElement('script');
      s.src = src; s.onload = s.onerror = res;
      document.head.appendChild(s);
    });

    const preload = () => {
      const urls = [window.innerWidth > 1100 ? B + 'panel.jpg' : B + 'panel-1600.jpg', B + 'screen-mask.png', B + 'avatar.png'];
      const imgs = urls.map(u => new Promise(res => { const im = new Image(); im.onload = im.onerror = res; im.src = u; }));
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      return Promise.race([Promise.all(imgs.concat([fonts])), new Promise(res => setTimeout(res, 6000))]);
    };

    // som ambiente: so pode iniciar apos um gesto do usuario
    const wake = () => {
      if (!amb && window.Ambience) amb = window.Ambience.get();
      if (amb) { amb.start(); amb.setEnabled(soundOn); }
    };
    let soundOn = true;
    const onSound = e => { soundOn = e.detail; wake(); };

    const slot = slotRef.current;
    if (slot) slot.addEventListener('soundchange', onSound);
    window.addEventListener('resize', fit);
    window.addEventListener('pointerdown', wake);
    window.addEventListener('keydown', wake);
    fit();

    Promise.all([loadScript(B + 'ambience.js'), loadScript(B + 'terminal-gl.js')])
      .then(preload)
      .then(() => { if (!gone) { wake(); approach(); } });

    return () => {
      gone = true;
      window.removeEventListener('resize', fit);
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('keydown', wake);
      if (onDown) window.removeEventListener('keydown', onDown);
      if (onUp) window.removeEventListener('keyup', onUp);
      if (slot) slot.removeEventListener('soundchange', onSound);
      if (amb) amb.setEnabled(false);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <>
      <Head>
        <title>sciotta — terminal</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" />
        <link rel="preload" as="image" href={B + 'panel.jpg'} media="(min-width:1101px)" />
        <link rel="preload" as="image" href={B + 'panel-1600.jpg'} media="(max-width:1100px)" />
        <style>{CSS}</style>
      </Head>
      <div className="cp-viewport">
        <div className="cp-stage" ref={stageRef}>
          <div className="cp-glow" />
          <div className="cp-slot" ref={slotRef}>
            <terminal-gl
              avatar={B + 'avatar.png'}
              lang="pt"
              sound="on"
              feed="/blog/rss.xml"
              blog-cache={B + 'blog-cache.json'}
              wiki-index={B + 'wiki-index.json'}
            />
          </div>
        </div>
      </div>
    </>
  );
}
