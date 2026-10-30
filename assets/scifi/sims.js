// Small live toy simulations, one per paper on the research page.
// Each <figure class="sim" data-sim="..."> gets a canvas; it only animates while on screen.
(function () {
  "use strict";
  var CY = "78,240,255", VI = "176,124,255", GR = "124,255,178", AM = "255,207,92";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function gauss() { // Box-Muller
    var u = 1 - Math.random(), v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185 * v);
  }
  function rgba(c, a) { return "rgba(" + c + "," + a + ")"; }
  function label(ctx, txt, x, y, c, align) {
    ctx.font = "11px 'JetBrains Mono', monospace"; ctx.textAlign = align || "left";
    ctx.fillStyle = rgba(c, 0.9); ctx.fillText(txt, x, y);
  }

  var sims = {};

  // 1. Memory on a ring manifold: one bump with fast synapses only drifts a lot,
  //    one with fast + slow synapses is anchored and drifts far less.
  sims.ring = function (ctx, W, H) {
    var N = 64, T = 260, a = [0, 0], hist = [[], []], D = [0.035, 0.006];
    return function () {
      ctx.clearRect(0, 0, W, H);
      var r = Math.min(H * 0.34, W * 0.13), cx = [W * 0.17, W * 0.17], cy = [H * 0.5, H * 0.5];
      cx[0] = W * 0.12; cx[1] = W * 0.12 + r * 2.4;
      if (W < 520) { cx[0] = W * 0.2; cx[1] = W * 0.2; cy[0] = H * 0.28; cy[1] = H * 0.72; r = H * 0.17; }
      for (var k = 0; k < 2; k++) {
        a[k] += D[k] * gauss();
        hist[k].push(a[k]); if (hist[k].length > T) hist[k].shift();
        var col = k ? CY : VI;
        for (var i = 0; i < N; i++) {
          var th = (i / N) * 6.283, d = Math.cos(th - a[k]);
          var act = Math.exp(4 * (d - 1));
          ctx.fillStyle = rgba(col, 0.12 + 0.88 * act);
          ctx.beginPath(); ctx.arc(cx[k] + r * Math.cos(th), cy[k] + r * Math.sin(th), 2 + 3.5 * act, 0, 6.283); ctx.fill();
        }
        label(ctx, W < 520 ? (k ? "fast+slow" : "fast") : (k ? "fast + slow synapses" : "fast synapses only"), cx[k], cy[k] + 4, col, "center");
      }
      // traces of the stored angle over time
      var x0 = W < 520 ? W * 0.42 : W * 0.12 + r * 3.8, x1 = W - 16, y0 = 18, y1 = H - 22;
      ctx.strokeStyle = rgba(CY, 0.15); ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
      ctx.beginPath(); ctx.moveTo(x0, (y0 + y1) / 2); ctx.lineTo(x1, (y0 + y1) / 2); ctx.stroke();
      for (k = 0; k < 2; k++) {
        ctx.strokeStyle = rgba(k ? CY : VI, 0.9); ctx.lineWidth = 1.6; ctx.beginPath();
        for (i = 0; i < hist[k].length; i++) {
          var x = x0 + (i / (T - 1)) * (x1 - x0), y = (y0 + y1) / 2 - hist[k][i] * (y1 - y0) / 4;
          y = Math.max(y0, Math.min(y1, y));
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke(); ctx.lineWidth = 1;
      }
      label(ctx, "stored angle vs. time", x0 + 6, y1 + 15, CY);
    };
  };

  // 2. Stochastic consolidation: efficacies decay, random reactivations push them up,
  //    and those that cross the critical level are consolidated for good.
  sims.consolidation = function (ctx, W, H) {
    var M = 26, T = 220, mem = [], crit = 0.85;
    function add(wait) { return { e: 0.5 + 0.2 * Math.random(), h: [], done: false, wait: wait || 0 }; }
    for (var i = 0; i < M; i++) mem.push(add(Math.random() * 2 * T));
    return function () {
      ctx.clearRect(0, 0, W, H);
      var x0 = 34, x1 = W - 14, y0 = 14, y1 = H - 24, yc = y1 - crit * (y1 - y0);
      ctx.strokeStyle = rgba(CY, 0.15); ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = rgba(AM, 0.6);
      ctx.beginPath(); ctx.moveTo(x0, yc); ctx.lineTo(x1, yc); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, "consolidation threshold", x1 - 4, yc + 14, AM, "right");
      for (var i = 0; i < mem.length; i++) {
        var m = mem[i];
        if (m.wait > 0) { m.wait--; continue; }
        if (!m.done) {
          // reactivation is more likely for memories that are still strong
          m.e += -0.012 * m.e + 0.008 * gauss() + (Math.random() < 0.35 * m.e * m.e * m.e ? 0.05 + 0.07 * Math.random() : 0);
          if (m.e > crit) m.done = true;
        } else { m.e += 0.02 * (0.93 - m.e) + 0.003 * gauss(); }
        m.e = Math.max(0, Math.min(1, m.e));
        m.h.push(m.e); if (m.h.length > T) m.h.shift();
        if (m.e < 0.03 || (m.h.length >= T && m.done && Math.random() < 0.004)) mem[i] = add(Math.random() * 40);
        ctx.strokeStyle = m.done ? rgba(GR, 0.8) : rgba(VI, m.e < 0.15 ? 0.25 : 0.6);
        ctx.beginPath();
        var off = T - m.h.length;
        for (var j = 0; j < m.h.length; j++) {
          var x = x0 + ((j + off) / (T - 1)) * (x1 - x0), y = y1 - m.h[j] * (y1 - y0);
          j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      label(ctx, "memory strength", 8, y0 + 10, CY);
      label(ctx, "time →", x1, y1 + 16, CY, "right");
      label(ctx, "● consolidated", x0, y1 + 16, GR);
      label(ctx, "● fading", x0 + 120, y1 + 16, VI);
    };
  };

  // 3. Fixational drift: eye position diffuses around the fixation target.
  sims.drift = function (ctx, W, H) {
    var p = [0, 0], trail = [], T = 420;
    return function () {
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2, s = Math.min(W, H) * 0.42;
      p[0] += 0.03 * gauss() - 0.006 * p[0]; p[1] += 0.03 * gauss() - 0.006 * p[1];
      if (Math.random() < 0.004) { p[0] *= 0.15; p[1] *= 0.15; trail.push(null); } // corrective microsaccade
      trail.push([p[0], p[1]]); if (trail.length > T) trail.shift();
      for (var r = 1; r <= 3; r++) {
        ctx.strokeStyle = rgba(CY, 0.08 + 0.04 * r);
        ctx.beginPath(); ctx.arc(cx, cy, s * r / 3, 0, 6.283); ctx.stroke();
      }
      ctx.strokeStyle = rgba(CY, 0.2);
      ctx.beginPath(); ctx.moveTo(cx - s, cy); ctx.lineTo(cx + s, cy); ctx.moveTo(cx, cy - s); ctx.lineTo(cx, cy + s); ctx.stroke();
      ctx.fillStyle = rgba(AM, 0.95); ctx.beginPath(); ctx.arc(cx, cy, 3, 0, 6.283); ctx.fill();
      for (var i = 1; i < trail.length; i++) {
        if (!trail[i] || !trail[i - 1]) continue;
        ctx.strokeStyle = rgba(GR, (0.85 * i / trail.length).toFixed(3));
        ctx.beginPath();
        ctx.moveTo(cx + trail[i - 1][0] * s, cy + trail[i - 1][1] * s);
        ctx.lineTo(cx + trail[i][0] * s, cy + trail[i][1] * s); ctx.stroke();
      }
      ctx.fillStyle = rgba(GR, 1); ctx.beginPath(); ctx.arc(cx + p[0] * s, cy + p[1] * s, 4, 0, 6.283); ctx.fill();
      label(ctx, "gaze position", 12, 18, GR);
      label(ctx, "+ fixation target", 12, 34, AM);
    };
  };

  // 4. Chaotic balanced network: irregular spikes from neurons ordered by preferred
  //    angle; the remembered angle (bump of higher rates) diffuses slowly.
  sims.balanced = function (ctx, W, H) {
    var N = 70, cols = [], C = 0, bump = 3.14, path = [];
    return function () {
      var colW = 3, maxC = Math.floor((W - 20) / colW);
      bump += 0.03 * gauss();
      var spikes = [];
      for (var i = 0; i < N; i++) {
        var th = (i / N) * 6.283, rate = 0.04 + 0.32 * Math.exp(3 * (Math.cos(th - bump) - 1));
        if (Math.random() < rate) spikes.push(i);
      }
      cols.push(spikes); path.push(bump);
      if (cols.length > maxC) { cols.shift(); path.shift(); }
      ctx.clearRect(0, 0, W, H);
      var y0 = 14, y1 = H - 22, dy = (y1 - y0) / N;
      for (var c = 0; c < cols.length; c++) {
        var x = 10 + c * colW, a = 0.25 + 0.75 * (c / cols.length);
        for (var k = 0; k < cols[c].length; k++) {
          ctx.fillStyle = rgba(CY, a.toFixed(2));
          ctx.fillRect(x, y0 + cols[c][k] * dy, 2, Math.max(1.5, dy - 0.6));
        }
      }
      ctx.strokeStyle = rgba(AM, 0.9); ctx.lineWidth = 1.5; ctx.beginPath();
      for (c = 0; c < path.length; c++) {
        var b = ((path[c] % 6.283) + 6.283) % 6.283, yy = y0 + (b / 6.283) * (y1 - y0);
        if (c && Math.abs(path[c] - path[c - 1]) < 1 && Math.abs(yy - (y0 + ((((path[c - 1] % 6.283) + 6.283) % 6.283) / 6.283) * (y1 - y0))) < 40) ctx.lineTo(10 + c * colW, yy);
        else ctx.moveTo(10 + c * colW, yy);
      }
      ctx.stroke(); ctx.lineWidth = 1;
      label(ctx, "spikes (neurons sorted by preferred angle)", 10, y1 + 16, CY);
      label(ctx, "— remembered angle", W - 10, y1 + 16, AM, "right");
    };
  };

  // 5. Cosmic ray air shower: a primary particle cascades down through the atmosphere.
  //    The particle count grows, peaks and dies out; the depth of the peak (Xmax) is
  //    what the measurements are about.
  sims.shower = function (ctx, W, H) {
    var segs, rows, xmaxY, t = 0, REVEAL = 100, CYCLE = 320, DY = 2.4;
    function build() {
      segs = []; rows = [];
      var live = [{ x: W * (0.4 + 0.2 * Math.random()), vx: (Math.random() - 0.5) * 0.3, e: 1 }];
      for (var r = 0; live.length && r * DY < H; r++) {
        var next = [], y = r * DY;
        rows.push(live.length);
        for (var i = 0; i < live.length; i++) {
          var p = live[i], nx = p.x + p.vx;
          segs.push([p.x, y, nx, y + DY, p.e]);
          p.x = nx;
          if (p.e > 1 / 96 && Math.random() < 0.11) {
            var kick = 0.4 + 0.9 * Math.random();
            next.push({ x: p.x, vx: p.vx - kick * Math.random(), e: p.e / 2 });
            next.push({ x: p.x, vx: p.vx + kick * Math.random(), e: p.e / 2 });
          } else if (p.e > 1 / 96 || Math.random() > 0.04) next.push(p);
        }
        live = next;
      }
      var best = 0;
      for (var k = 0; k < rows.length; k++) if (rows[k] > rows[best]) best = k;
      xmaxY = best * DY;
    }
    build();
    return function () {
      t++;
      if (t > CYCLE) { t = 0; build(); }
      ctx.clearRect(0, 0, W, H);
      var front = (Math.min(t, REVEAL) / REVEAL) * H;
      for (var i = 0; i < segs.length; i++) {
        var s = segs[i];
        if (s[1] > front) continue;
        ctx.strokeStyle = rgba(s[4] > 0.12 ? AM : (s[4] > 0.02 ? CY : VI), 0.8);
        ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); ctx.stroke();
      }
      if (front > xmaxY + 10) {
        ctx.setLineDash([4, 4]); ctx.strokeStyle = rgba(GR, 0.6);
        ctx.beginPath(); ctx.moveTo(0, xmaxY); ctx.lineTo(W, xmaxY); ctx.stroke(); ctx.setLineDash([]);
        label(ctx, "shower maximum (Xmax)", W - 12, xmaxY - 6, GR, "right");
      }
      label(ctx, "top of the atmosphere", 12, 16, CY);
      label(ctx, "depth ↓", 12, H - 10, CY);
    };
  };

  function setup(fig) {
    var make = sims[fig.getAttribute("data-sim")];
    if (!make) return;
    var canvas = document.createElement("canvas");
    fig.insertBefore(canvas, fig.firstChild);
    var ctx = canvas.getContext("2d"), step = null, visible = false, running = false;
    var lastW = 0;
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2), W = canvas.clientWidth, H = canvas.clientHeight;
      if (W === lastW) return;
      lastW = W;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      step = make(ctx, W, H);
      for (var i = 0; i < 300; i++) step(); // start with some history on screen
    }
    function loop() {
      if (!visible) { running = false; return; }
      step(); requestAnimationFrame(loop);
    }
    size();
    window.addEventListener("resize", size);
    if (reduced) return;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && !running) { running = true; loop(); }
      }).observe(fig);
    } else { visible = true; running = true; loop(); }
  }
  Array.prototype.forEach.call(document.querySelectorAll("figure.sim"), setup);
})();
