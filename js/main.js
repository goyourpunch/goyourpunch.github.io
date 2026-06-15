// ─── PAGE SWITCHING ───
function showPage(name) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-links a")
    .forEach((a) => a.classList.remove("active-link"));
  const page = document.getElementById("page-" + name);
  const navBtn = document.getElementById("nav-" + name);
  if (page) page.classList.add("active");
  if (navBtn) navBtn.classList.add("active-link");
  if (page) {
    page
      .querySelectorAll(
        ".hero-headline,.about-box,.contacts-title,.contacts-subtitle,.contacts-grid,.contacts-divider,.future-grid,.photo-slot",
      )
      .forEach((el) => {
        el.style.animation = "none";
        el.offsetHeight;
        el.style.animation = "";
      });
  }
}

// ─── [1] CURSOR GLOW — follows mouse, highlights photos & text ───
(function () {
  document.querySelectorAll(".page").forEach((page) => {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    // insert after vignette so it's above canvas but below content
    const vignette = page.querySelector(".vignette");
    if (vignette) vignette.after(glow);
    else page.prepend(glow);

    page.addEventListener("mousemove", (e) => {
      const rect = page.getBoundingClientRect();
      glow.style.left = e.clientX - rect.left + "px";
      glow.style.top = e.clientY - rect.top + "px";
    });
  });
})();

// ─── CODE BACKGROUND ENGINE ───
const COLORS = {
  keyword: [197, 134, 192],
  type: [78, 201, 176],
  string: [206, 145, 120],
  variable: [156, 220, 254],
  comment: [106, 153, 85],
  fn: [220, 220, 170],
  number: [181, 206, 168],
  tag: [78, 201, 176],
  plain: [200, 200, 200],
};

const SNIPPETS = [
  [
    { t: "function ", k: "keyword" },
    { t: "init", k: "fn" },
    { t: "() {", k: "plain" },
  ],
  [
    { t: "  const ", k: "keyword" },
    { t: "goal", k: "variable" },
    { t: " = ", k: "plain" },
    { t: '"success"', k: "string" },
    { t: ";", k: "plain" },
  ],
  [
    { t: "  return ", k: "keyword" },
    { t: "goal", k: "variable" },
    { t: ";", k: "plain" },
  ],
  [{ t: "}", k: "plain" }],
  [
    { t: "class ", k: "keyword" },
    { t: "Developer", k: "type" },
    { t: " {", k: "plain" },
  ],
  [
    { t: "  constructor", k: "fn" },
    { t: "(name) {", k: "plain" },
  ],
  [
    { t: "    this", k: "keyword" },
    { t: ".name = ", k: "plain" },
    { t: "name", k: "variable" },
    { t: ";", k: "plain" },
  ],
  [
    { t: "    this", k: "keyword" },
    { t: ".skills = [];", k: "plain" },
  ],
  [
    { t: "  build", k: "fn" },
    { t: "() { ", k: "plain" },
    { t: "while", k: "keyword" },
    { t: "(", k: "plain" },
    { t: "learning", k: "variable" },
    { t: ") ", k: "plain" },
    { t: "grow", k: "fn" },
    { t: "(); }", k: "plain" },
  ],
  [{ t: "// code is language", k: "comment" }],
  [{ t: "// success is goal", k: "comment" }],
  [{ t: "// self-taught from Kherson", k: "comment" }],
  [{ t: "// TODO: build startup", k: "comment" }],
  [{ t: "// TODO: change the world", k: "comment" }],
  [
    { t: "import ", k: "keyword" },
    { t: "{ passion }", k: "variable" },
    { t: " from ", k: "plain" },
    { t: '"mikey"', k: "string" },
    { t: ";", k: "plain" },
  ],
  [
    { t: "export default ", k: "keyword" },
    { t: "Mikey", k: "type" },
    { t: ";", k: "plain" },
  ],
  [
    { t: "const ", k: "keyword" },
    { t: "skills", k: "variable" },
    { t: " = [", k: "plain" },
    { t: '"HTML"', k: "string" },
    { t: ", ", k: "plain" },
    { t: '"CSS"', k: "string" },
    { t: ", ", k: "plain" },
    { t: '"JS"', k: "string" },
    { t: "];", k: "plain" },
  ],
  [
    { t: "let ", k: "keyword" },
    { t: "experience", k: "variable" },
    { t: " = ", k: "plain" },
    { t: "0", k: "number" },
    { t: "; experience++;", k: "plain" },
  ],
  [
    { t: "if ", k: "keyword" },
    { t: "(", k: "plain" },
    { t: "hardWork", k: "variable" },
    { t: ") { return ", k: "plain" },
    { t: "success", k: "variable" },
    { t: "; }", k: "plain" },
  ],
  [
    { t: "console", k: "variable" },
    { t: ".log(", k: "plain" },
    { t: '"Mikey was here"', k: "string" },
    { t: ");", k: "plain" },
  ],
  [
    { t: "npm install ", k: "plain" },
    { t: "future", k: "string" },
  ],
  [
    { t: "git commit -m ", k: "plain" },
    { t: '"keep going"', k: "string" },
  ],
  [
    { t: "git push origin ", k: "plain" },
    { t: "main", k: "string" },
  ],
  [
    { t: "<", k: "tag" },
    { t: "div ", k: "tag" },
    { t: "class=", k: "plain" },
    { t: '"hero"', k: "string" },
    { t: ">", k: "tag" },
  ],
  [
    { t: "</", k: "tag" },
    { t: "div", k: "tag" },
    { t: ">", k: "tag" },
  ],
  [
    { t: "async ", k: "keyword" },
    { t: "function ", k: "keyword" },
    { t: "fetchGoal", k: "fn" },
    { t: "() {", k: "plain" },
  ],
  [
    { t: "  const ", k: "keyword" },
    { t: "res", k: "variable" },
    { t: " = await ", k: "plain" },
    { t: "fetch", k: "fn" },
    { t: "(", k: "plain" },
    { t: '"/api/grow"', k: "string" },
    { t: ");", k: "plain" },
  ],
  [
    { t: "  return ", k: "keyword" },
    { t: "res", k: "variable" },
    { t: ".json();", k: "plain" },
  ],
  [
    { t: "const ", k: "keyword" },
    { t: "PORT", k: "variable" },
    { t: " = ", k: "plain" },
    { t: "3000", k: "number" },
    { t: ";", k: "plain" },
  ],
  [
    { t: "@keyframes ", k: "keyword" },
    { t: "grow ", k: "fn" },
    { t: "{ ", k: "plain" },
    { t: "transform", k: "variable" },
    { t: ": ", k: "plain" },
    { t: "scale(", k: "fn" },
    { t: "1.2", k: "number" },
    { t: ") }", k: "plain" },
  ],
  [
    { t: "interface ", k: "keyword" },
    { t: "Developer", k: "type" },
    { t: " {", k: "plain" },
  ],
  [
    { t: "  name", k: "variable" },
    { t: ": ", k: "plain" },
    { t: "string", k: "type" },
    { t: ";", k: "plain" },
  ],
  [
    { t: "  skills", k: "variable" },
    { t: ": ", k: "plain" },
    { t: "string", k: "type" },
    { t: "[];", k: "plain" },
  ],
  [
    { t: "while", k: "keyword" },
    { t: "(", k: "plain" },
    { t: "true", k: "number" },
    { t: ") { ", k: "plain" },
    { t: "learn", k: "fn" },
    { t: "(); }", k: "plain" },
  ],
  [
    { t: "python3 ", k: "plain" },
    { t: "main.py", k: "string" },
  ],
  [
    { t: "pip install ", k: "plain" },
    { t: "flask numpy pandas", k: "string" },
  ],
  [
    { t: "SELECT ", k: "keyword" },
    { t: "* FROM ", k: "plain" },
    { t: "projects", k: "variable" },
    { t: " WHERE ", k: "keyword" },
    { t: "done = ", k: "plain" },
    { t: "false", k: "number" },
  ],
  [
    { t: "app", k: "variable" },
    { t: ".listen(", k: "plain" },
    { t: "PORT", k: "variable" },
    { t: ", () => ", k: "plain" },
    { t: "console", k: "variable" },
    { t: ".log(", k: "plain" },
    { t: '"running"', k: "string" },
    { t: "));", k: "plain" },
  ],
];

const FONT_SIZE = 13;
const FONT = `${FONT_SIZE}px "Share Tech Mono", monospace`;
const LINE_GAP = 30;

function startCodeCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W,
    H,
    lines = [];

  function measureSnippet(spans) {
    ctx.font = FONT;
    return spans.reduce((sum, s) => sum + ctx.measureText(s.t).width, 0);
  }

  function makeLine(y) {
    const snip = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
    const alpha = 0.12 + Math.random() * 0.22;
    const speed = 0.12 + Math.random() * 0.3;
    const dir = Math.random() > 0.5 ? 1 : -1;
    const w = measureSnippet(snip);
    const x = Math.random() * W;
    return { snip, alpha, speed, dir, x, y, w };
  }

  function init() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    lines = [];
    const rows = Math.ceil(H / LINE_GAP);
    for (let r = 0; r < rows; r++) {
      const baseY = 16 + r * LINE_GAP;
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const ln = makeLine(baseY + Math.random() * 8);
        ln.x = Math.random() * (W + 400) - 200;
        lines.push(ln);
      }
    }
  }

  function drawLine(line) {
    ctx.font = FONT;
    let x = line.x;
    for (const span of line.snip) {
      const [r, g, b] = COLORS[span.k];
      ctx.fillStyle = `rgba(${r},${g},${b},${line.alpha})`;
      ctx.fillText(span.t, x, line.y);
      x += ctx.measureText(span.t).width;
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const ln of lines) {
      ln.x += ln.speed * ln.dir;
      if (ln.dir > 0 && ln.x > W + 60) ln.x = -ln.w - 60;
      if (ln.dir < 0 && ln.x + ln.w < -60) ln.x = W + 60;
      drawLine(ln);
    }
    requestAnimationFrame(tick);
  }

  const ro = new ResizeObserver(() => {
    init();
  });
  ro.observe(canvas);
  init();
  tick();
}

window.addEventListener("DOMContentLoaded", () => {
  startCodeCanvas("code-canvas-about");
  startCodeCanvas("code-canvas-contacts");
});

// ─── CONTACT FORM ───
document
  .getElementById("contact-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const status = document.getElementById("form-status");
    const data = new FormData(this);

    status.textContent = "Sending...";
    status.style.color = "rgba(255,255,255,0.5)";

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      if (json.success) {
        status.textContent = "✓ Message sent!";
        status.style.color = "rgba(255,255,255,0.8)";
        this.reset();
      } else {
        status.textContent = "✗ Something went wrong. Try again.";
        status.style.color = "rgba(255,100,100,0.8)";
      }
    } catch {
      status.textContent = "✗ Connection error.";
      status.style.color = "rgba(255,100,100,0.8)";
    }
  });
