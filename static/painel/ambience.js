// Ambiente sonoro da nave: motor, ventilação, campo estelar, teclado, beeps e passos.
(function () {
  class Ambience {
    constructor() {
      this.started = false;
      this.enabled = true;
      this._timers = [];
    }

    ensure() {
      if (this.ctx) return this.ctx;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      // encerra qualquer contexto órfão de uma instancia anterior (hot reload)
      const all = (window.__ambienceCtxs = window.__ambienceCtxs || []);
      all.forEach(c => { try { c.close(); } catch (e) {} });
      all.length = 0;
      const ctx = (this.ctx = new AC());
      all.push(ctx);
      const master = (this.master = ctx.createGain());
      master.gain.value = 0;
      master.connect(ctx.destination);
      return ctx;
    }

    noiseBuffer(seconds = 2) {
      if (this._nb) return this._nb;
      const ctx = this.ctx, len = ctx.sampleRate * seconds;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      return (this._nb = buf);
    }

    start() {
      const ctx = this.ensure();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();
      if (this.started) return;
      this.started = true;
      const t = ctx.currentTime;

      // --- casco / motor: graves batendo devagar
      const hum = ctx.createGain(); hum.gain.value = 0.16; hum.connect(this.master);
      const humLP = ctx.createBiquadFilter(); humLP.type = "lowpass"; humLP.frequency.value = 190; humLP.connect(hum);
      [43, 57.5, 86.5].forEach((f, i) => {
        const o = ctx.createOscillator(); o.type = i === 2 ? "triangle" : "sawtooth"; o.frequency.value = f;
        const g = ctx.createGain(); g.gain.value = i === 2 ? 0.06 : 0.14;
        o.connect(g).connect(humLP); o.start();
        // batimento lento, como um motor que respira
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.055 + i * 0.021;
        const la = ctx.createGain(); la.gain.value = g.gain.value * 0.45;
        lfo.connect(la).connect(g.gain); lfo.start();
      });

      // --- ventilação: ar passando por dutos
      const vent = ctx.createGain(); vent.gain.value = 0.22; vent.connect(this.master);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 420; bp.Q.value = 0.9; bp.connect(vent);
      const hiss = ctx.createBufferSource(); hiss.buffer = this.noiseBuffer(4); hiss.loop = true;
      const hissG = ctx.createGain(); hissG.gain.value = 0.075;
      hiss.connect(hissG).connect(bp); hiss.start();
      const swell = ctx.createOscillator(); swell.frequency.value = 0.07;
      const swellA = ctx.createGain(); swellA.gain.value = 210;
      swell.connect(swellA).connect(bp.frequency); swell.start();

      // --- campo estelar: pad frio e distante
      const pad = ctx.createGain(); pad.gain.value = 0.004; pad.connect(this.master);
      const padLP = ctx.createBiquadFilter(); padLP.type = "lowpass"; padLP.frequency.value = 340; padLP.connect(pad);
      [87.3, 130.8, 174.6].forEach((f, i) => {
        const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f * (1 + (i % 2 ? 0.0013 : -0.0011));
        const g = ctx.createGain(); g.gain.value = 0.16;
        o.connect(g).connect(padLP); o.start();
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.031 + i * 0.017;
        const la = ctx.createGain(); la.gain.value = 0.12;
        lfo.connect(la).connect(g.gain); lfo.start();
      });
      // brilho de vácuo
      const shim = ctx.createBufferSource(); shim.buffer = this.noiseBuffer(4); shim.loop = true;
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 3800;
      const shimG = ctx.createGain(); shimG.gain.value = 0.008;
      shim.connect(hp).connect(shimG).connect(this.master); shim.start();

      this.master.gain.setValueAtTime(0.0001, t);
      this.master.gain.exponentialRampToValueAtTime(this.enabled ? 0.9 : 0.0001, t + 3.5);

      this.scheduleTyping();
      this.scheduleBeeps();
    }

    // ---- eventos aleatórios -------------------------------------------------
    later(fn, ms) { const id = setTimeout(fn, ms); this._timers.push(id); return id; }

    scheduleTyping() {
      const delay = 9000 + Math.random() * 22000;
      this.later(() => { this.typing(); this.scheduleTyping(); }, delay);
    }

    scheduleBeeps() {
      const delay = 11000 + Math.random() * 26000;
      this.later(() => { this.beepPhrase(); this.scheduleBeeps(); }, delay);
    }

    typing() {
      if (!this.ctx || !this.enabled) return;
      const n = 6 + Math.floor(Math.random() * 22);
      let t = this.ctx.currentTime + 0.05;
      for (let i = 0; i < n; i++) {
        this.key(t, 0.5 + Math.random() * 0.6);
        t += 0.055 + Math.random() * 0.09 + (Math.random() < 0.12 ? 0.28 : 0);
      }
    }

    key(t, vol) {
      const ctx = this.ctx;
      const src = ctx.createBufferSource(); src.buffer = this.noiseBuffer(2);
      src.playbackRate.value = 0.8 + Math.random() * 0.5;
      const f = ctx.createBiquadFilter(); f.type = "bandpass";
      f.frequency.value = 1800 + Math.random() * 1600; f.Q.value = 1.6;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.05 * vol, t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
      src.connect(f).connect(g).connect(this.master);
      src.start(t); src.stop(t + 0.08);
    }

    beepPhrase() {
      if (!this.ctx || !this.enabled) return;
      const scale = [523.25, 587.33, 698.46, 783.99, 1046.5];
      const n = 1 + Math.floor(Math.random() * 3);
      let t = this.ctx.currentTime + 0.05;
      for (let i = 0; i < n; i++) {
        this.beep(t, scale[Math.floor(Math.random() * scale.length)]);
        t += 0.11 + Math.random() * 0.1;
      }
    }

    beep(t, freq) {
      const ctx = this.ctx;
      const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.035, t + 0.006);
      g.gain.setValueAtTime(0.035, t + 0.055);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      o.connect(g).connect(this.master);
      o.start(t); o.stop(t + 0.12);
    }

    // ---- passos em plataforma de metal --------------------------------------
    step(intensity = 1) {
      if (!this.ctx || !this.enabled) return;
      const ctx = this.ctx, t = ctx.currentTime + 0.01;
      const v = Math.max(0.25, Math.min(1, intensity));

      // impacto abafado da bota
      const thud = ctx.createBufferSource(); thud.buffer = this.noiseBuffer(2);
      thud.playbackRate.value = 0.45 + Math.random() * 0.2;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 240;
      const tg = ctx.createGain();
      tg.gain.setValueAtTime(0.0001, t);
      tg.gain.exponentialRampToValueAtTime(0.34 * v, t + 0.008);
      tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      thud.connect(lp).connect(tg).connect(this.master);
      thud.start(t); thud.stop(t + 0.26);

      // cavidade sob a chapa: ruído por filtro bem ressonante = som oco
      const boom = ctx.createBufferSource(); boom.buffer = this.noiseBuffer(2);
      boom.playbackRate.value = 0.5 + Math.random() * 0.3;
      const res = ctx.createBiquadFilter(); res.type = "bandpass";
      res.frequency.value = 130 + Math.random() * 40; res.Q.value = 11;
      const res2 = ctx.createBiquadFilter(); res2.type = "bandpass";
      res2.frequency.value = 275 + Math.random() * 60; res2.Q.value = 8;
      const bg = ctx.createGain();
      bg.gain.setValueAtTime(0.0001, t);
      bg.gain.exponentialRampToValueAtTime(0.5 * v, t + 0.012);
      bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
      boom.connect(res).connect(bg); boom.connect(res2).connect(bg);
      bg.connect(this.master);
      boom.start(t); boom.stop(t + 0.5);

      // chapa ressoando — discreta, só para dar o metal
      const partials = [186, 322, 517];
      partials.forEach((f, i) => {
        const o = ctx.createOscillator(); o.type = "sine";
        o.frequency.value = f * (0.94 + Math.random() * 0.12);
        const g = ctx.createGain();
        const amp = (0.055 * v) / (i + 1.2);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(amp, t + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4 + i * 0.09);
        o.connect(g).connect(this.master);
        o.start(t); o.stop(t + 0.6);
      });

      // raspar da sola
      const scuff = ctx.createBufferSource(); scuff.buffer = this.noiseBuffer(2);
      const sf = ctx.createBiquadFilter(); sf.type = "bandpass"; sf.frequency.value = 1500; sf.Q.value = 0.9;
      const sg = ctx.createGain();
      sg.gain.setValueAtTime(0.0001, t);
      sg.gain.exponentialRampToValueAtTime(0.022 * v, t + 0.012);
      sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
      scuff.connect(sf).connect(sg).connect(this.master);
      scuff.start(t); scuff.stop(t + 0.2);
    }

    setEnabled(on) {
      this.enabled = on;
      if (!this.ctx) { if (on) this.start(); return; }
      const t = this.ctx.currentTime;
      const g = this.master.gain;
      g.cancelScheduledValues(t);
      g.setValueAtTime(Math.max(0.0001, g.value), t);
      g.linearRampToValueAtTime(on ? 0.9 : 0, t + 0.35);
      if (on) { if (this.ctx.state === "suspended") this.ctx.resume(); }
      else this._timers.forEach(clearTimeout), this._timers = [];
      if (on && !this._timers.length) { this.scheduleTyping(); this.scheduleBeeps(); }
    }

    dispose() {
      this._timers.forEach(clearTimeout);
      this._timers = [];
      if (this.ctx) { try { this.ctx.close(); } catch (e) {} }
      this.ctx = null; this.started = false;
    }
  }

  window.Ambience = Ambience;
  Ambience.get = function () {
    if (!window.__ambience) window.__ambience = new Ambience();
    return window.__ambience;
  };})();
