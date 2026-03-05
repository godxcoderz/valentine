/* =========================
   Cute Valentine Page — JS
   ========================= */

const NAME = "Dilisha";

// ---------- Toast ----------
const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------- Reveal on scroll ----------
const revealEls = Array.from(document.querySelectorAll(".reveal"));
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    }
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// ---------- Type line ----------
const typeLine = document.getElementById("typeLine");
const phrases = [
  "a warm hug in slow motion",
  "a heart choosing you",
  "a soft, glowing yes",
  `a love letter for ${NAME}`
];

let typeIdx = 0;
let charIdx = 0;
let typingForward = true;

function tickType() {
  if (!typeLine) return;

  const current = phrases[typeIdx];
  if (typingForward) {
    charIdx++;
    typeLine.textContent = current.slice(0, charIdx);
    if (charIdx >= current.length) {
      typingForward = false;
      setTimeout(tickType, 1000);
      return;
    }
  } else {
    charIdx--;
    typeLine.textContent = current.slice(0, Math.max(0, charIdx));
    if (charIdx <= 0) {
      typingForward = true;
      typeIdx = (typeIdx + 1) % phrases.length;
    }
  }
  setTimeout(tickType, typingForward ? 45 : 22);
}
tickType();

// ---------- Countdown to next Feb 14 ----------
const countdownEl = document.getElementById("countdown");
function getNextValentines() {
  const now = new Date();
  const year = now.getFullYear();
  const v = new Date(year, 1, 14, 0, 0, 0); // Feb is month 1
  if (now > v) return new Date(year + 1, 1, 14, 0, 0, 0);
  return v;
}
function pad(n) { return String(n).padStart(2, "0"); }

function tickCountdown() {
  if (!countdownEl) return;

  const now = new Date();
  const target = getNextValentines();
  const diff = target - now;

  const d = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const h = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
  const m = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));

  countdownEl.textContent = `${d}d ${pad(h)}h ${pad(m)}m`;
}
setInterval(tickCountdown, 1000);
tickCountdown();

// ---------- Love meter ----------
const meterFill = document.getElementById("meterFill");
const meterValue = document.getElementById("meterValue");
const boostLove = document.getElementById("boostLove");
const meterBar = document.querySelector(".meter-bar");

let love = 0;
function setLove(v) {
  love = Math.max(0, Math.min(100, v));
  if (meterFill) meterFill.style.width = `${love}%`;
  if (meterValue) meterValue.textContent = `${love}%`;
  if (meterBar) meterBar.setAttribute("aria-valuenow", String(love));
}
setLove(72);

boostLove?.addEventListener("click", () => {
  const add = 7 + Math.floor(Math.random() * 13);
  setLove(love + add);
  showToast(`Love level increased for ${NAME}.`);
  if (love >= 100) {
    showToast(`${NAME}, it is officially maximum.`);
    burstConfetti();
  }
});

// ---------- Modal letter ----------
const letterModal = document.getElementById("letterModal");
const openLetter = document.getElementById("openLetter");
const closeLetter = document.getElementById("closeLetter");
const modalClose = document.getElementById("modalClose");
const modalYes = document.getElementById("modalYes");

openLetter?.addEventListener("click", () => {
  letterModal?.showModal();
});

function closeModal() {
  if (letterModal?.open) letterModal.close();
}

closeLetter?.addEventListener("click", closeModal);
modalClose?.addEventListener("click", closeModal);

// ---------- Buttons Yes / No behavior ----------
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");

function acceptLove() {
  burstConfetti();
  showToast(`Best choice, ${NAME}.`);
  setLove(100);

  // Open the letter as a nice follow-up
  setTimeout(() => letterModal?.showModal(), 450);
}

btnYes?.addEventListener("click", acceptLove);
modalYes?.addEventListener("click", () => {
  closeModal();
  acceptLove();
});

// "Not sure" button playfully runs away
btnNo?.addEventListener("pointerenter", () => {
  if (!btnNo) return;
  const parent = btnNo.closest(".hero-left") || document.body;
  const rect = parent.getBoundingClientRect();

  const x = Math.random() * (rect.width - 120);
  const y = Math.random() * (rect.height - 60);

  btnNo.style.position = "relative";
  btnNo.style.left = `${(x - rect.width / 3) * 0.2}px`;
  btnNo.style.top = `${(y - rect.height / 3) * 0.2}px`;
});

btnNo?.addEventListener("click", () => {
  showToast(`Take your time, ${NAME}. I will still be here.`);
});

// ---------- Confetti (simple, no library) ----------
let confettiEnabled = true;

function burstConfetti() {
  if (!confettiEnabled) return;

  const count = 110;
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "90";
  document.body.appendChild(container);

  const colors = ["#ff4d8d", "#b36bff", "#ffd1dc", "#ffffff"];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    const size = 6 + Math.random() * 8;
    const left = 10 + Math.random() * 80;
    const delay = Math.random() * 0.2;
    const duration = 1.8 + Math.random() * 1.2;

    piece.style.position = "absolute";
    piece.style.top = "-10px";
    piece.style.left = `${left}vw`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 0.7}px`;
    piece.style.opacity = "0.95";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > 0.5 ? "2px" : "999px";
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;

    piece.animate(
      [
        { transform: `translateY(0px) rotate(0deg)`, opacity: 1 },
        { transform: `translateY(${window.innerHeight + 80}px) rotate(${720 + Math.random() * 720}deg)`, opacity: 0.95 }
      ],
      { duration: duration * 1000, delay: delay * 1000, easing: "cubic-bezier(.2,.7,.2,1)" }
    );

    // drift side-to-side
    piece.animate(
      [
        { marginLeft: "0px" },
        { marginLeft: `${(Math.random() * 2 - 1) * 140}px` }
      ],
      { duration: duration * 1000, delay: delay * 1000, easing: "ease-in-out" }
    );

    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 3200);
}

// ---------- Floating hearts canvas ----------
const canvas = document.getElementById("heartsCanvas");
const ctx = canvas?.getContext("2d");

let motionOn = true;
const toggleMotion = document.getElementById("toggleMotion");

toggleMotion?.addEventListener("click", () => {
  motionOn = !motionOn;
  toggleMotion.textContent = `Motion: ${motionOn ? "On" : "Off"}`;
  toggleMotion.setAttribute("aria-pressed", String(!motionOn));
  showToast(motionOn ? "Motion enabled." : "Motion reduced.");
});

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const hearts = [];
function rand(min, max) { return min + Math.random() * (max - min); }

function spawnHeart() {
  hearts.push({
    x: rand(0, window.innerWidth),
    y: window.innerHeight + rand(10, 120),
    s: rand(8, 18),
    vy: rand(0.35, 1.1),
    vx: rand(-0.25, 0.25),
    a: rand(0.22, 0.65),
    wobble: rand(0, Math.PI * 2),
    hue: Math.random() > 0.5 ? "pink" : "violet"
  });
}

function drawHeart(x, y, size, alpha, tone) {
  if (!ctx) return;

  const fill =
    tone === "pink"
      ? `rgba(255, 77, 141, ${alpha})`
      : `rgba(179, 107, 255, ${alpha})`;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 18, size / 18);

  ctx.beginPath();
  // Heart shape with bezier curves
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(0, -4, -10, -6, -10, 2);
  ctx.bezierCurveTo(-10, 10, 0, 14, 0, 18);
  ctx.bezierCurveTo(0, 14, 10, 10, 10, 2);
  ctx.bezierCurveTo(10, -6, 0, -4, 0, 5);
  ctx.closePath();

  ctx.fillStyle = fill;
  ctx.shadowColor = "rgba(0,0,0,.35)";
  ctx.shadowBlur = 12;
  ctx.fill();

  ctx.restore();
}

let last = performance.now();
function loop(now) {
  if (!ctx || !canvas) return;
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (motionOn) {
    // spawn rate depends on viewport
    const spawnCount = window.innerWidth < 600 ? 1 : 2;
    for (let i = 0; i < spawnCount; i++) {
      if (Math.random() < 0.22) spawnHeart();
    }
  } else {
    // if motion off, keep a very low spawn rate
    if (Math.random() < 0.03) spawnHeart();
  }

  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i];
    h.wobble += dt * 2.2;
    const wob = Math.sin(h.wobble) * (motionOn ? 0.7 : 0.25);

    h.y -= h.vy * 60 * dt;
    h.x += (h.vx * 60 * dt) + wob;

    drawHeart(h.x, h.y, h.s, h.a, h.hue);

    if (h.y < -80 || h.x < -120 || h.x > window.innerWidth + 120) {
      hearts.splice(i, 1);
    }
  }

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Small welcome
setTimeout(() => showToast(`Hi ${NAME}. This page is just for you.`), 900);