/* ============================================================
   A7C — MANIFESTO: cenas vetoriais monocromáticas, scroll-driven.
   Corpos celestes (círculos brancos luminosos) são protagonistas;
   o texto se funde à cena (título gigante atravessa os corpos,
   rótulos ligados por linha fina). Estritamente preto e branco.
   Render é função PURA do progresso de scroll → reversível.
   ============================================================ */
(function () {
  const canvas = document.getElementById("mani-canvas");
  const lineEl = document.getElementById("mani-line");
  const subEl = document.getElementById("mani-sub");
  const section = document.getElementById("scenes");
  const dotsWrap = document.getElementById("dots");
  if (!canvas || !section) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const KEYS = ["mani.1", "mani.2", "mani.3", "mani.4", "mani.5", "mani.6", "mani.7"];
  const N = KEYS.length;

  let W = 0, H = 0, DPR = 1, U = 0;
  let cx = 0, cy = 0;
  let stars = [];
  let labelQ = [];
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let curG = 0, targetG = 0;
  let lastTextScene = -1, lastLang = "", textState = "";
  let override = null;

  /* ---------- utils ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ss = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function lang() { return (window.A7C_I18N && (window.A7C_I18N.lang || window.A7C_I18N.current())) || "it"; }
  function text(key) { const d = (window.A7C_I18N && window.A7C_I18N.dict[lang()]) || {}; return d[key] || ""; }

  /* ---------- primitivas vetoriais (mono) ---------- */
  function ellipse(x, y, rx, ry, a, lw) {
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255," + a + ")"; ctx.lineWidth = lw || 1; ctx.stroke();
  }
  function dot(x, y, r, a) {
    ctx.beginPath(); ctx.arc(x, y, Math.max(0.4, r), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255," + a + ")"; ctx.fill();
  }
  function line(x1, y1, x2, y2, a) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = "rgba(255,255,255," + a + ")"; ctx.lineWidth = 1; ctx.stroke();
  }
  function arcStroke(x, y, r, a0, a1, a, lw) {
    ctx.beginPath(); ctx.arc(x, y, r, a0, a1);
    ctx.strokeStyle = "rgba(255,255,255," + a + ")"; ctx.lineWidth = lw || 1; ctx.stroke();
  }

  // corpo celeste: disco branco nítido + bloom luminoso (fonte de luz)
  function body(x, y, r, alpha, bright) {
    if (r < 0.4) { dot(x, y, r, alpha); return; }
    const gr = r * 1.7 + (bright ? 0.075 * U : 0.03 * U);
    const g = ctx.createRadialGradient(x, y, r * 0.55, x, y, gr);
    g.addColorStop(0, "rgba(255,255,255," + (0.5 * alpha * (bright ? 1.25 : 1)) + ")");
    g.addColorStop(0.5, "rgba(255,255,255," + (0.11 * alpha) + ")");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, gr, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255," + alpha + ")"; ctx.fill();
  }
  // assinatura mantida (key/cor ignorados — tudo monocromático)
  function sphere(id, x, y, r, key, alpha, venus) {
    body(x, y, r, alpha == null ? 1 : alpha, venus);
  }

  // rótulo dentro da cena, ligado ao corpo por linha fina ("OUR SUN")
  function label(x, y, r, key, side) {
    labelQ.push({ x: x, y: y, r: r, key: key, side: side || 1, a: ctx.globalAlpha });
  }
  function drawLabels() {
    ctx.save();
    ctx.font = '500 11px "Helvetica Neue", Helvetica, Arial, sans-serif';
    const hasLS = "letterSpacing" in ctx;
    if (hasLS) ctx.letterSpacing = "2.5px";
    ctx.textBaseline = "middle";
    for (const L of labelQ) {
      const a = L.a; if (a <= 0.02) continue;
      const dir = L.side;
      const x0 = L.x + dir * (L.r + 6);
      const x1 = L.x + dir * (L.r + 28);
      ctx.strokeStyle = "rgba(255,255,255," + (0.4 * a) + ")"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, L.y); ctx.lineTo(x1, L.y); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255," + (0.82 * a) + ")";
      ctx.textAlign = dir > 0 ? "left" : "right";
      ctx.fillText(text(L.key).toUpperCase(), x1 + dir * 7, L.y);
    }
    if (hasLS) ctx.letterSpacing = "0px";
    ctx.restore();
  }

  /* ============================================================
     CENAS — cada uma recebe p (0..1). Coreografia inalterada.
     ============================================================ */

  // 1 · três corpos convergem num único corpo "global"
  function scene1(p) {
    const e = easeInOut(clamp(p * 1.04, 0, 1));
    const starts = [-Math.PI / 2, -Math.PI / 2 + 2.094, -Math.PI / 2 + 4.189];
    const spin = [0.8, 1.0, 1.2];
    const dist = lerp(0.36 * U, 0.06 * U, e);
    const arrive = ss(0.6, 0.99, p);
    const smallA = (1 - arrive) * 0.85 + 0.14;
    for (let k = 0; k < 3; k++) {
      const ang = starts[k] + e * Math.PI * 1.1 * spin[k];
      const x = cx + Math.cos(ang) * dist;
      const y = cy + Math.sin(ang) * dist * 0.9;
      sphere("s1-" + k, x, y, lerp(0.075 * U, 0.045 * U, e), null, smallA);
    }
    if (arrive > 0.01) sphere("s1m", cx, cy, arrive * 0.16 * U, null, arrive, true);
    if (arrive > 0.5) label(cx, cy, arrive * 0.16 * U, "mani.tip.global", 1);
  }

  // 2 · o corpo se divide em três (tech · real estate · arte) em equilíbrio
  function scene2(p) {
    const bigA = (1 - ss(0, 0.34, p)) * 0.85;
    if (bigA > 0.02) sphere("s2big", cx, cy, 0.16 * U, null, bigA, true);
    const spread = ss(0.06, 0.6, p);
    const R = spread * 0.225 * U;
    const base = -Math.PI / 2 + easeInOut(clamp(p, 0, 1)) * Math.PI * 0.55;
    if (R > 1) ellipse(cx, cy, R, R * 0.92, 0.06 * spread);
    const lbls = ["mani.tip.tech", "mani.tip.realestate", "mani.tip.art"];
    for (let k = 0; k < 3; k++) {
      const ang = base + k * (Math.PI * 2 / 3);
      const x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R * 0.92;
      sphere("s2-" + k, x, y, 0.07 * U, null, 1);
      if (spread > 0.72) label(x, y, 0.07 * U, lbls[k], x >= cx ? 1 : -1);
    }
  }

  // 3 · afastam-se e convergem num único corpo central que brilha
  function scene3(p) {
    const base = -Math.PI / 2 + easeInOut(clamp(p, 0, 1)) * Math.PI * 0.5;
    let R;
    if (p < 0.45) R = lerp(0.225 * U, 0.34 * U, ss(0, 0.45, p));
    else R = lerp(0.34 * U, 0.0, ss(0.45, 0.88, p));
    const merge = ss(0.62, 0.95, p);
    const threeA = (1 - ss(0.68, 0.92, p));
    if (threeA > 0.02) for (let k = 0; k < 3; k++) {
      const ang = base + k * (Math.PI * 2 / 3);
      sphere("s3-" + k, cx + Math.cos(ang) * R, cy + Math.sin(ang) * R * 0.92, 0.07 * U, null, threeA);
    }
    if (merge > 0.01) sphere("s3m", cx, cy, merge * 0.14 * U, null, merge, true);
  }

  // 4 · ÁPICE — Vênus: o corpo maior/mais brilhante, sem lua, girando ao CONTRÁRIO;
  //      os outros corpos têm pequenas luas.
  function scene4(p) {
    const grow = ss(0, 0.42, p);
    const Rv = lerp(0.13 * U, 0.175 * U, grow);
    const fwd = p * Math.PI * 2 * 1.3;
    const planets = [
      { ang: -2.35, rad: 0.43, size: 0.05, moons: 2 },
      { ang: 0.62, rad: 0.5, size: 0.058, moons: 1 },
      { ang: 2.55, rad: 0.46, size: 0.043, moons: 2 }
    ];
    planets.forEach((pl, pi) => {
      const x = cx + Math.cos(pl.ang) * pl.rad * U;
      const y = cy + Math.sin(pl.ang) * pl.rad * U * 0.84;
      const mr = pl.size * U + 0.032 * U;
      ellipse(x, y, mr, mr * 0.9, 0.06);
      sphere("s4p" + pi, x, y, pl.size * U, null, 0.95);
      for (let m = 0; m < pl.moons; m++) {
        const ma = pl.ang + fwd * 1.5 + m * (Math.PI * 2 / pl.moons);
        sphere("s4p" + pi + "m" + m, x + Math.cos(ma) * mr, y + Math.sin(ma) * mr * 0.9, 0.012 * U, null, 0.9);
      }
    });
    sphere("venus", cx, cy, Rv, null, 1, true);
    const rev = -p * Math.PI * 2 * 1.25;
    const mx = cx + Math.cos(rev) * Rv * 0.58, my = cy + Math.sin(rev) * Rv * 0.58;
    ctx.beginPath(); ctx.arc(mx, my, 0.012 * U, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fill();
    arcStroke(cx, cy, Rv + 0.026 * U, rev, rev + Math.PI * 0.55, 0.3, 1.2);
    if (grow > 0.5) label(cx, cy, Rv, "mani.tip.venus", 1);
  }

  // 5 · leme (pequeno, firme) + vela (maior) movendo a composição
  function scene5(p) {
    const travel = easeInOut(clamp(p, 0, 1));
    const px = lerp(W * 0.3, W * 0.7, travel);
    const py = cy - Math.sin(travel * Math.PI) * 0.07 * H;
    const sm = { x: px + 0.07 * U, y: py + 0.055 * U, r: 0.03 * U };
    const bg = { x: px - 0.055 * U, y: py - 0.045 * U, r: 0.095 * U };
    line(sm.x, sm.y, bg.x, bg.y, 0.14);
    line(sm.x, sm.y, sm.x + 0.055 * U, sm.y - 0.012 * U, 0.22);
    sphere("s5big", bg.x, bg.y, bg.r, null, 1);
    sphere("s5sm", sm.x, sm.y, sm.r, null, 1);
    if (travel > 0.3 && travel < 0.9) {
      label(bg.x, bg.y, bg.r, "mani.tip.emotion", -1);
      label(sm.x, sm.y, sm.r, "mani.tip.reason", 1);
    }
  }

  // 6 · arco → flecha cruza o campo rumo a um alvo que recua ao infinito
  function scene6(p) {
    const e = easeInOut(clamp(p, 0, 1));
    const by = cy + 0.1 * H, bx = W * 0.17;
    const bowA = (1 - ss(0.18, 0.55, p)) * 0.5;
    if (bowA > 0.01) arcStroke(bx, by, 0.13 * U, -Math.PI * 0.42, Math.PI * 0.42, bowA, 1.4);
    const tx = W * 0.85, ty = cy - 0.14 * H;
    const targR = lerp(0.028 * U, 0.006 * U, e);
    ellipse(tx, ty, targR * 3 * (1 - e) + targR, (targR * 3 * (1 - e) + targR) * 0.9, 0.12 * (1 - e));
    sphere("s6t", tx, ty, targR, null, 0.5 + 0.5 * (1 - e));
    const ax = lerp(bx + 0.02 * U, tx, e);
    const ay = lerp(by, ty, e) - Math.sin(e * Math.PI) * 0.16 * H;
    const aR = lerp(0.055 * U, 0.016 * U, e);
    // trajetória fina (linha-guia)
    line(bx + 0.02 * U, by, ax, ay, 0.08);
    sphere("s6arrow", ax, ay, aR, null, 1);
  }

  // 7 · quatro corpos numa constelação serena, desacelerando até repousar
  function scene7(p) {
    const e = easeOut(clamp(p, 0, 1));
    const targets = [[0.30, 0.60], [0.44, 0.52], [0.58, 0.45], [0.72, 0.37]];
    const starts = [[0.12, 0.78], [0.86, 0.74], [0.22, 0.2], [0.9, 0.26]];
    const pts = [];
    for (let k = 0; k < 4; k++) {
      pts.push([lerp(starts[k][0], targets[k][0], e) * W, lerp(starts[k][1], targets[k][1], e) * H]);
    }
    const lA = ss(0.5, 0.96, p) * 0.18;
    for (let k = 0; k < pts.length - 1; k++) line(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], lA);
    for (let k = 0; k < pts.length; k++) sphere("s7-" + k, pts[k][0], pts[k][1], 0.05 * U, null, 1);
    if (e > 0.6) label(pts[3][0], pts[3][1], 0.05 * U, "mani.tip.love", 1);
  }

  const SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7];

  /* ---------- campo de estrelas discreto ---------- */
  function buildStars() {
    stars = [];
    const n = Math.round((W * H) / 12000);
    for (let i = 0; i < n; i++) stars.push({
      x: Math.random() * W, y: Math.random() * H,
      r: (Math.random() * 1 + 0.4), a: (Math.random() * 0.3 + 0.05),
      d: Math.random() * 0.3 + 0.05
    });
  }
  function drawStars() {
    for (const s of stars) dot(s.x + mouse.x * s.d * 16, s.y + mouse.y * s.d * 16, s.r, s.a);
  }

  /* ---------- texto sincronizado (título gigante + subtítulo + eyebrow) ---------- */
  function buildLine(key) {
    const words = text(key).split(" ");
    lineEl.innerHTML = "";
    words.forEach((w, i) => {
      const word = document.createElement("span"); word.className = "word";
      const inner = document.createElement("span"); inner.className = "inner";
      inner.textContent = w; inner.style.transitionDelay = (i * 0.04) + "s";
      word.appendChild(inner); lineEl.appendChild(word);
      lineEl.appendChild(document.createTextNode(" "));
    });
  }
  function updateText(i, p) {
    if (i !== lastTextScene || lang() !== lastLang) {
      buildLine(KEYS[i]);
      const k = document.getElementById("maniKicker");
      if (k) k.textContent = "Manifesto · 0" + (i + 1) + " / 07";
      if (subEl) subEl.textContent = text("msub." + (i + 1));
      lastTextScene = i; lastLang = lang(); textState = "";
      void lineEl.offsetWidth;
    }
    const want = (p > 0.1 && p < 0.86) ? "in" : "out";
    if (want !== textState) {
      lineEl.classList.toggle("in", want === "in");
      lineEl.classList.toggle("out", want === "out");
      if (subEl) { subEl.classList.toggle("in", want === "in"); subEl.classList.toggle("out", want === "out"); }
      textState = want;
    }
  }

  /* ---------- dots ---------- */
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    for (let i = 0; i < N; i++) { const d = document.createElement("span"); d.className = "scene-dot"; dotsWrap.appendChild(d); }
  }
  function updateDots(i) {
    if (!dotsWrap) return;
    [...dotsWrap.children].forEach((d, k) => d.classList.toggle("on", k === i));
  }

  /* ---------- progresso de scroll ---------- */
  function progress() {
    const rect = section.getBoundingClientRect();
    const movable = section.offsetHeight - window.innerHeight;
    const scrolled = clamp(-rect.top, 0, movable);
    return movable > 0 ? scrolled / movable : 0;
  }

  /* ---------- loop ---------- */
  function frame() {
    targetG = override != null ? override : clamp(progress() * N, 0, N - 0.0001);
    curG += (targetG - curG) * (reduce ? 1 : 0.14);
    if (Math.abs(targetG - curG) < 0.0004) curG = targetG;

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    cx = W * 0.5 + mouse.x * 18;
    cy = H * 0.52 + mouse.y * 16;

    ctx.clearRect(0, 0, W, H);
    drawStars();
    labelQ = [];

    const i = Math.floor(curG);
    const p = curG - i;
    const w = 0.16;

    ctx.globalAlpha = (p > 1 - w && i < N - 1) ? 1 - (p - (1 - w)) / w : 1;
    SCENES[i](p);
    if (p > 1 - w && i < N - 1) {
      ctx.globalAlpha = (p - (1 - w)) / w;
      SCENES[i + 1](0.001);
    }
    ctx.globalAlpha = 1;
    drawLabels();

    updateText(i, p);
    updateDots(i);
    requestAnimationFrame(frame);
  }

  /* ---------- resize / eventos ---------- */
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight; U = Math.min(W, H);
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    section.style.height = ((N * 0.92 + 1) * 100).toFixed(0) + "vh";
    buildStars();
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("mousemove", (e) => {
    mouse.tx = (e.clientX / W - 0.5) * 2; mouse.ty = (e.clientY / H - 0.5) * 2;
  }, { passive: true });
  document.addEventListener("a7c:lang", () => { lastTextScene = -1; });

  buildDots();
  resize();
  requestAnimationFrame(frame);

  window.A7C_MANI = { goTo: function (g) { override = g == null ? null : clamp(g, 0, N - 0.0001); }, clear: function () { override = null; } };
})();
