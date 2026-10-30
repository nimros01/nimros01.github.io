// Background "neural field", typed tagline and table of contents.
(function () {
  "use strict";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- neural field: drifting nodes, nearby ones linked, spikes travel along links ----
  var canvas = document.getElementById("field");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [], spikes = [], W = 0, H = 0, LINK = 150;

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(110, (W * H) / 14000));
      nodes = [];
      for (var i = 0; i < n; i++) {
        nodes.push({ x: Math.random() * W, y: Math.random() * H,
                     vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
                     hue: Math.random() < 0.75 ? 0 : 1, glow: 0 });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b, dx, dy, d;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < -20) a.x = W + 20; if (a.x > W + 20) a.x = -20;
        if (a.y < -20) a.y = H + 20; if (a.y > H + 20) a.y = -20;
        a.glow *= 0.94;
      }
      ctx.lineWidth = 1;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y; d = dx * dx + dy * dy;
          if (d < LINK * LINK) {
            ctx.strokeStyle = "rgba(78,240,255," + (0.13 * (1 - Math.sqrt(d) / LINK)).toFixed(3) + ")";
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      // fire a spike from a random node to one of its neighbours
      if (!reduced && Math.random() < 0.08 && nodes.length) {
        a = nodes[(Math.random() * nodes.length) | 0];
        for (j = 0; j < nodes.length; j++) {
          b = nodes[j];
          if (b !== a && Math.abs(a.x - b.x) < LINK && Math.abs(a.y - b.y) < LINK) {
            spikes.push({ a: a, b: b, t: 0 }); a.glow = 1; break;
          }
        }
      }
      for (i = spikes.length - 1; i >= 0; i--) {
        var s = spikes[i]; s.t += 0.025;
        if (s.t >= 1) { s.b.glow = 1; spikes.splice(i, 1); continue; }
        var x = s.a.x + (s.b.x - s.a.x) * s.t, y = s.a.y + (s.b.y - s.a.y) * s.t;
        ctx.fillStyle = "rgba(124,255,178,0.9)";
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 6.283); ctx.fill();
      }
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        var col = a.hue ? "176,124,255" : "78,240,255";
        ctx.fillStyle = "rgba(" + col + "," + (0.45 + 0.55 * a.glow).toFixed(2) + ")";
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.6 + 2.2 * a.glow, 0, 6.283); ctx.fill();
      }
      if (!reduced) requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener("resize", resize);
    frame();
  }

  // ---- typed tagline ----
  var typed = document.querySelector(".typed");
  if (typed) {
    var out = typed.querySelector(".typed-out");
    var lines = (typed.getAttribute("data-lines") || "").split("|");
    if (reduced) { out.textContent = lines[0]; }
    else {
      var li = 0, ci = 0, del = false;
      (function tick() {
        var line = lines[li];
        out.textContent = line.slice(0, ci);
        if (!del && ci < line.length) { ci++; setTimeout(tick, 45 + Math.random() * 40); }
        else if (!del) { del = true; setTimeout(tick, 1900); }
        else if (ci > 0) { ci--; setTimeout(tick, 18); }
        else { del = false; li = (li + 1) % lines.length; setTimeout(tick, 300); }
      })();
    }
  }

  // ---- videos: load the YouTube player only when clicked ----
  Array.prototype.forEach.call(document.querySelectorAll("button[data-yt]"), function (btn) {
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + btn.getAttribute("data-yt") + "?autoplay=1&rel=0";
      f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      f.allowFullscreen = true; f.title = btn.getAttribute("aria-label");
      var box = document.createElement("div");
      box.className = "frame"; box.appendChild(f);
      btn.parentNode.replaceChild(box, btn);
    });
  });

  // ---- collapsible sections: each h2 and what follows it becomes a card that expands ----
  var foldRoot = document.querySelector(".content.collapsible");
  if (foldRoot) {
    var folds = [];
    Array.prototype.slice.call(foldRoot.querySelectorAll(":scope > h2")).forEach(function (h) {
      var d = document.createElement("details"), sum = document.createElement("summary"), body = document.createElement("div");
      d.className = "fold"; body.className = "fold-body";
      h.parentNode.insertBefore(d, h);
      sum.appendChild(h);
      var n = d.nextSibling;
      // the first paragraph (authors or a one-line description) stays visible as a teaser
      while (n && n.nodeType !== 1) n = n.nextSibling;
      if (n && n.tagName === "P") { var t = n; n = n.nextSibling; t.classList.add("teaser"); sum.appendChild(t); }
      while (n && !(n.nodeType === 1 && (n.tagName === "H2" || n.tagName === "HR"))) {
        var next = n.nextSibling; body.appendChild(n); n = next;
      }
      d.appendChild(sum); d.appendChild(body);
      d.addEventListener("toggle", function () { if (d.open) window.dispatchEvent(new Event("resize")); });
      folds.push(d);
    });
    if (folds.length) {
      var bar = document.createElement("div"), btn = document.createElement("button");
      bar.className = "fold-bar"; btn.type = "button"; btn.className = "fold-all"; btn.textContent = "Expand all";
      btn.addEventListener("click", function () {
        var open = folds.some(function (d) { return !d.open; });
        folds.forEach(function (d) { d.open = open; });
        btn.textContent = open ? "Collapse all" : "Expand all";
      });
      bar.appendChild(btn);
      folds[0].parentNode.insertBefore(bar, folds[0]);
    }
    var openHash = function () {
      var el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      var d = el && el.closest ? el.closest("details.fold") : null;
      if (d && !d.open) { d.open = true; el.scrollIntoView(); }
    };
    window.addEventListener("hashchange", openHash); openHash();
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (a && a.getAttribute("href") === location.hash) setTimeout(openHash, 0);
    });
  }

  // ---- table of contents from h2s, with scroll spy ----
  var list = document.getElementById("toc-list");
  if (list) {
    var heads = document.querySelectorAll(".content h2[id]");
    var links = [];
    Array.prototype.forEach.call(heads, function (h) {
      var li = document.createElement("li"), a = document.createElement("a");
      a.href = "#" + h.id; a.textContent = h.textContent;
      li.appendChild(a); list.appendChild(li); links.push([h, a]);
    });
    var spy = function () {
      var cur = null;
      links.forEach(function (p) { if (p[0].getBoundingClientRect().top < 140) cur = p[1]; });
      links.forEach(function (p) { p[1].classList.toggle("on", p[1] === cur); });
    };
    window.addEventListener("scroll", spy, { passive: true }); spy();
  }
})();
