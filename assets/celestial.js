/* ============================================================
   A7C — CÉU CELESTE
   Corpos celestes (círculos de tamanhos variados) em órbita
   lenta, com parallax suave de mouse + scroll.
   Assinatura: UM corpo (Vênus) orbita no sentido CONTRÁRIO.
   Reusado em todas as páginas como fio condutor.
   ============================================================ */
(function () {
  const canvas = document.getElementById('celestial');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, DPR = 1;
  let bodies = [];
  let stars = [];
  let mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollY = 0;
  let t = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function build() {
    // Centro orbital base — ligeiramente fora da tela à direita,
    // como um sistema solar enquadrado de forma editorial.
    const cx = W * 0.72;
    const cy = H * 0.46;

    bodies = [];

    // Conjunto de "planetas/luas" em órbitas concêntricas.
    // depth = fator de parallax (corpos distantes movem menos).
    const defs = [
      // radius(px), orbitR(frac of min(W,H)), speed, size(px), tone, depth, fill?
      { o: 0.10, sp: 0.055, r: 4,   tone: 0.55, depth: 0.18, fill: true },
      { o: 0.17, sp: 0.038, r: 2.5, tone: 0.40, depth: 0.26, fill: true },
      { o: 0.26, sp: 0.027, r: 9,   tone: 0.16, depth: 0.34, fill: false },
      { o: 0.36, sp: 0.020, r: 3,   tone: 0.50, depth: 0.46, fill: true },
      { o: 0.50, sp: 0.014, r: 16,  tone: 0.11, depth: 0.6,  fill: false },
      { o: 0.66, sp: 0.010, r: 5,   tone: 0.30, depth: 0.78, fill: true },
      { o: 0.86, sp: 0.0075,r: 26,  tone: 0.08, depth: 1.0,  fill: false },
      { o: 1.12, sp: 0.0052,r: 7,   tone: 0.22, depth: 1.25, fill: true },
    ];
    const unit = Math.min(W, H);
    defs.forEach((d, i) => {
      bodies.push({
        cx, cy,
        orbit: d.o * unit,
        angle: rand(0, Math.PI * 2),
        speed: d.sp,
        size: d.r,
        tone: d.tone,
        depth: d.depth,
        fill: d.fill,
        dir: 1,
        venus: false,
      });
    });

    // ---- VÊNUS: órbita no sentido CONTRÁRIO. Assinatura do site. ----
    bodies.push({
      cx, cy,
      orbit: 0.40 * unit,
      angle: rand(0, Math.PI * 2),
      speed: 0.016,
      size: 11,
      tone: 0.78,
      depth: 0.52,
      fill: true,
      dir: -1,          // <- contrário
      venus: true,
    });

    // ---- Estrelas (pontinhos estáticos com leve cintilar) ----
    stars = [];
    const n = Math.round((W * H) / 14000);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: rand(0.4, 1.3),
        a: rand(0.05, 0.4),
        tw: rand(0.4, 1.6),
        ph: rand(0, Math.PI * 2),
        depth: rand(0.05, 0.25),
      });
    }
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
  }

  function draw() {
    t += 1;
    ctx.clearRect(0, 0, W, H);

    // Parallax do mouse (suavizado)
    mouse.x += (mouse.tx - mouse.x) * 0.045;
    mouse.y += (mouse.ty - mouse.y) * 0.045;

    // Estrelas
    for (const s of stars) {
      const px = s.x + mouse.x * s.depth * 14 + 0;
      const py = s.y + mouse.y * s.depth * 14 - scrollY * s.depth * 0.12;
      const tw = s.a * (0.6 + 0.4 * Math.sin(t * 0.01 * s.tw + s.ph));
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + tw.toFixed(3) + ')';
      ctx.fill();
    }

    // Corpos em órbita
    for (const b of bodies) {
      if (!reduce) b.angle += b.speed * b.dir * 0.016;

      const ox = mouse.x * b.depth * 26;
      const oy = mouse.y * b.depth * 26 - scrollY * b.depth * 0.18;

      const x = b.cx + Math.cos(b.angle) * b.orbit + ox;
      const y = b.cy + Math.sin(b.angle) * b.orbit * 0.86 + oy;

      // trilha orbital fininha (só para alguns)
      if (b.size >= 9) {
        ctx.beginPath();
        ctx.ellipse(b.cx + ox, b.cy + oy, b.orbit, b.orbit * 0.86, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.035)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y, b.size, 0, Math.PI * 2);
      if (b.fill) {
        ctx.fillStyle = 'rgba(255,255,255,' + b.tone + ')';
        ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,' + b.tone + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Vênus: anel duplo discreto que a torna reconhecível
      if (b.venus) {
        ctx.beginPath();
        ctx.arc(x, y, b.size + 7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.28)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  function loop() { draw(); requestAnimationFrame(loop); }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / W - 0.5) * 2;
    mouse.ty = (e.clientY / H - 0.5) * 2;
  }, { passive: true });
  window.addEventListener('scroll', () => { scrollY = window.scrollY || window.pageYOffset; }, { passive: true });

  resize();
  loop();
})();
