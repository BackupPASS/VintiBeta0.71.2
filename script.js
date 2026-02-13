let currentIndex = 0;
const images = [
    'image2.jpg',
];
const slideshow = document.getElementById('background-slideshow');

function changeBackground(index) {
    slideshow.style.backgroundImage = `url(${images[index]})`;
    currentIndex = index;
}

function nextBackground() {
    currentIndex = (currentIndex + 1) % images.length;
    changeBackground(currentIndex);
}

changeBackground(0);

setInterval(nextBackground, 5000);

document.addEventListener("DOMContentLoaded", () => {
  const MIN_MS = 650;
  const start = performance.now();

  window.addEventListener("load", () => {
    const elapsed = performance.now() - start;
    const remaining = Math.max(0, MIN_MS - elapsed);

    setTimeout(() => {
      document.body.classList.add("loaded");
    }, remaining);
  });
});

async function checkVintiStatus() {
  try {
    const res = await fetch("https://backuppass.github.io/Status-Centre/");
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const vintiCard = Array.from(doc.querySelectorAll(".card.col-12"))
      .find(card => card.querySelector("h2")?.textContent.trim() === "Vinti");

    if (!vintiCard) {
      console.warn("Vinti card not found.");
      return;
    }

    const statusRow = vintiCard.querySelector(".status-row");
    if (!statusRow) {
      console.warn("Status row not found inside Vinti card.");
      return;
    }

    const pill = statusRow.querySelector(".pill");
    if (!pill) {
      console.warn("No status pill found inside Vinti section.");
      return;
    }

    const status = pill.textContent.trim().toLowerCase();
    console.log("Vinti status:", status);

    if (["offline", "downtime", "error"].includes(status)) {
      window.location.href = "https://backuppass.github.io/Vinti-No-Server/";
    }

  } catch (err) {
    console.error("Status check failed:", err);
  }
}

checkVintiStatus();
setInterval(checkVintiStatus, 30000);

setTimeout(function() {
  showCookieNotice();
}, 1000);

function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

function setCookie(name, value, maxAgeSeconds) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
}

function hasAcceptedCookies() {
  return getCookie('cookieAccepted') === 'true';
}

function showCookieNotice() {
  const card = document.getElementById('cookie-card');
  if (!card) return;
  card.style.display = hasAcceptedCookies() ? 'none' : 'block';
}

function acceptCookies() {
  const card = document.getElementById('cookie-card');
  if (card) card.style.display = 'none';

  setCookie('cookieAccepted', 'true', 31536000); 
}


document.addEventListener('DOMContentLoaded', () => {
  setTimeout(showCookieNotice, 1000);
});

document.addEventListener('DOMContentLoaded', function() {
  const showPopup = document.getElementById('showPopup');
  const popup = document.getElementById('iosPopup');
  const closeBtn = document.querySelector('.popup .close');

  showPopup.addEventListener('click', function() {
    popup.style.display = 'block';
  });

  closeBtn.addEventListener('click', function() {
    popup.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target == popup) {
      popup.style.display = 'none';
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('accept-cookies');
  if (btn) btn.addEventListener('click', acceptCookies);
});
function $(id) { return document.getElementById(id); }

(function startSnow() {
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let w = 0, h = 0, dpr = 1;

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1); 
    w = canvas.width  = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function makeFlakeSprite(px, blurMult = 2.2) {
    const s = Math.ceil(px * 5);
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d');

    const cx = s / 2, cy = s / 2;
    const r = px;

    const grad = g.createRadialGradient(cx, cy, 0, cx, cy, r * blurMult);
    grad.addColorStop(0.0, 'rgba(255,255,255,0.95)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.55)');
    grad.addColorStop(0.75, 'rgba(255,255,255,0.18)');
    grad.addColorStop(1.0, 'rgba(255,255,255,0.0)');

    g.fillStyle = grad;
    g.beginPath();
    g.arc(cx, cy, r * blurMult, 0, Math.PI * 2);
    g.fill();

    return c;
  }
  const sprites = [
    makeFlakeSprite(0.7 * dpr, 2.0), // far
    makeFlakeSprite(1.2 * dpr, 2.2), // mid
    makeFlakeSprite(2.0 * dpr, 2.7), // near
  ];
  const LAYERS = [
    { count: 55, baseSpeed: 0.55, baseDrift: 0.35, baseAlpha: 0.28, sprite: 0 }, // far
    { count: 45, baseSpeed: 0.95, baseDrift: 0.70, baseAlpha: 0.50, sprite: 1 }, // mid
    { count: 25, baseSpeed: 1.55, baseDrift: 1.15, baseAlpha: 0.72, sprite: 2 }, // near
  ];

  const flakes = [];
  for (let li = 0; li < LAYERS.length; li++) {
    const L = LAYERS[li];
    for (let i = 0; i < L.count; i++) {

      const sizeVar = (Math.random() * 0.45 + 0.80);
      const speedVar = (Math.random() * 0.55 + 0.75);
      const driftVar = (Math.random() * 0.60 + 0.70);

      flakes.push({
        layer: li,
        x: Math.random() * w,
        y: Math.random() * h,

        vy: L.baseSpeed * speedVar * dpr,
        vyJitter: (Math.random() * 0.25 + 0.05) * dpr,

        phase: Math.random() * Math.PI * 2,
        wobble: L.baseDrift * driftVar * dpr,
        spin: (Math.random() * 0.020 + 0.010),

        tumble: Math.random() * 1.0 + 0.3,

        alpha: Math.min(1, L.baseAlpha + Math.random() * 0.18),

        scale: sizeVar,
      });
    }
  }

  const MAX_FPS = 45;
  const frameMS = 1000 / MAX_FPS;

  let last = performance.now();
  let acc = 0;

  let wind = 0;
  let windTarget = 0;
  let windTimer = 0;

  function tick(now) {
    const dt = now - last;
    last = now;
    acc += dt;

    windTimer += dt;
    if (windTimer > 900) {
      windTimer = 0;
      windTarget = (Math.random() * 2 - 1) * 0.75 * dpr; 
    }
 
    wind += (windTarget - wind) * 0.012;

    if (acc >= frameMS) {
      acc = acc % frameMS;

      ctx.clearRect(0, 0, w, h);

      for (let li = 0; li < LAYERS.length; li++) {
        const L = LAYERS[li];
        const img = sprites[L.sprite];

        for (let i = 0; i < flakes.length; i++) {
          const f = flakes[i];
          if (f.layer !== li) continue;

          f.phase += f.spin * (0.8 + f.tumble * 0.4);

          const flutter = Math.sin(f.phase * 0.9) * f.vyJitter;
          const drift = Math.sin(f.phase) * (0.35 * f.wobble);

          const windInfluence = (0.55 + li * 0.35);
          f.x += (wind * windInfluence) + drift;

          f.y += f.vy + flutter;

          // wrap
          if (f.y > h + 60) { f.y = -60; f.x = Math.random() * w; }
          if (f.x > w + 60) f.x = -60;
          if (f.x < -60) f.x = w + 60;

          ctx.globalAlpha = f.alpha;

          const iw = img.width * f.scale;
          const ih = img.height * f.scale;
          ctx.drawImage(img, f.x - iw / 2, f.y - ih / 2, iw, ih);

          if (li === 2 && (f.vy + flutter) > 2.1 * dpr && Math.random() < 0.015) {
            ctx.globalAlpha = f.alpha * 0.35;
            ctx.beginPath();
            ctx.moveTo(f.x, f.y);
            ctx.lineTo(f.x - (wind * 2.2), f.y - (f.vy * 3.2));
            ctx.strokeStyle = 'rgba(255,255,255,0.35)';
            ctx.lineWidth = 1 * dpr;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();



let editTargetLink = null;
let editTargetId = null;

function normalizeUrl(input) {
  const v = (input || "").trim();
  if (!v) return "";
  if (!/^https?:\/\//i.test(v)) return "https://" + v;
  return v;
}

function openEditLinkModal(link, id) {
  editTargetLink = link;
  editTargetId = id;

  const overlay = document.getElementById("edit-link-overlay");
  const nameEl = document.getElementById("edit-link-name");
  const urlEl  = document.getElementById("edit-link-url");

  if (!overlay || !nameEl || !urlEl) return;

  nameEl.value = link.textContent || "";
  urlEl.value  = link.href || "";

  overlay.style.display = "flex";

  setTimeout(() => nameEl.focus(), 0);
}

function closeEditLinkModal() {
  const overlay = document.getElementById("edit-link-overlay");
  if (overlay) overlay.style.display = "none";
  editTargetLink = null;
  editTargetId = null;
}

function saveEditLinkModal() {
  if (!editTargetLink || !editTargetId) return;

  const nameEl = document.getElementById("edit-link-name");
  const urlEl  = document.getElementById("edit-link-url");
  if (!nameEl || !urlEl) return;

  const newName = (nameEl.value || "").trim();
  const newUrl  = normalizeUrl(urlEl.value);

  if (!newName || !newUrl) return; 

  editTargetLink.textContent = newName;
  editTargetLink.href = newUrl;

  localStorage.setItem(
    "vinti_link_" + editTargetId,
    JSON.stringify({ name: newName, url: newUrl })
  );

  closeEditLinkModal();
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("edit-link-overlay");
  const btnSave = document.getElementById("edit-link-save");
  const btnCancel = document.getElementById("edit-link-cancel");

  if (btnSave) btnSave.addEventListener("click", saveEditLinkModal);
  if (btnCancel) btnCancel.addEventListener("click", closeEditLinkModal);

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeEditLinkModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeEditLinkModal();
  });
});


document.addEventListener("DOMContentLoaded", () => {

  const HOVER_TIME = 3000;
  const LONG_PRESS_TIME = 2000;

  document.querySelectorAll(".editable-link").forEach(link => {
    const id = link.dataset.id;

    const saved = localStorage.getItem("vinti_link_" + id);
    if (saved) {
      const { name, url } = JSON.parse(saved);
      link.textContent = name;
      link.href = url;
    }

    let hoverTimer = null;
    let pressTimer = null;
    let suppressClick = false;
    let editing = false;

    function openEditor(e) {
  suppressClick = true;
  editing = true;
  e?.preventDefault();

  openEditLinkModal(link, id);

  const overlay = document.getElementById("edit-link-overlay");
  const release = () => {
    overlay?.removeEventListener("transitionend", release);
    editing = false;
    setTimeout(() => suppressClick = false, 50);
  };

  setTimeout(release, 100);
}

    function reset() {
      editing = false;
      setTimeout(() => suppressClick = false, 50);
    }

    link.addEventListener("click", e => {
      if (suppressClick || editing) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });

    link.addEventListener("mouseenter", () => {
      hoverTimer = setTimeout(() => openEditor(), HOVER_TIME);
    });

    link.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimer);
    });

    link.addEventListener("pointerdown", e => {
      pressTimer = setTimeout(() => openEditor(e), LONG_PRESS_TIME);
    });

    link.addEventListener("pointerup", () => {
      clearTimeout(pressTimer);
    });

    link.addEventListener("pointerleave", () => {
      clearTimeout(pressTimer);
    });
  });
});

function isVintiBrowser() {
  return /\bVinti\/[^\s]+/i.test(navigator.userAgent || "");
}

document.addEventListener("DOMContentLoaded", () => {
  const pill = document.getElementById("antimalware-pill");
  if (!pill) return;
  pill.style.display = isVintiBrowser() ? "inline-flex" : "none";
});
