// =========================================================
// SIMBA 🐶 · a little golden retriever who roams the website
// - walks around on his own, sits, and naps
// - click anywhere empty on the page: he runs to that spot
// - click Simba: he jumps, wags and says something
// To remove Simba: delete the <script src="js/simba.js"> line in index.html
// =========================================================
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LINES = [
    'Woof! I’m Simba 🐾',
    'Hire Krittika! 🦴',
    'She writes clean code, I chew shoes 🐕',
    'Have you seen her projects? 👀',
    'Pet me again! 💛',
    'Psst… press ~ for a secret terminal',
    'Krittika is open to internships! 🔴'
  ];

  // ---------- styles ----------
  const css = `
    .simba{position:fixed;left:0;top:0;width:35px;height:30px;z-index:65;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;will-change:transform}
  .simba .flip{width:100%;height:100%;transition:transform .15s}
  .simba.left .flip{transform:scaleX(-1)}
  .simba svg{width:100%;height:100%;overflow:visible;filter:drop-shadow(0 6px 6px rgba(0,0,0,.45))}
  .simba .leg{transform-box:fill-box;transform-origin:50% 0}
  .simba.walking .leg.a{animation:sb-step .32s ease-in-out infinite}
  .simba.walking .leg.b{animation:sb-step .32s ease-in-out infinite reverse}
  .simba.running .leg.a{animation-duration:.18s}.simba.running .leg.b{animation-duration:.18s}
  .simba.walking .body-group{animation:sb-bob .32s ease-in-out infinite}
  .simba.running .body-group{animation-duration:.18s}
  @keyframes sb-step{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-22deg)}}
  @keyframes sb-bob{50%{transform:translateY(-1.5px)}}
  .simba .tail{transform-box:fill-box;transform-origin:100% 100%;animation:sb-wag .5s ease-in-out infinite}
  .simba:hover .tail,.simba.happy .tail{animation-duration:.16s}
  @keyframes sb-wag{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(18deg)}}
  .simba .ear{transform-box:fill-box;transform-origin:50% 0;transition:transform .2s}
  .simba.happy .ear{transform:rotate(-18deg)}
  .simba .tongue{opacity:0;transition:opacity .2s}
  .simba.happy .tongue,.simba.running .tongue{opacity:1}
  .simba .head{transform-box:fill-box;transform-origin:30% 80%;transition:transform .3s}
  .simba.sitting .head{animation:sb-tilt 3s ease-in-out infinite}
  @keyframes sb-tilt{0%,60%,100%{transform:rotate(0)}70%,90%{transform:rotate(-8deg)}}
  .simba .eye-open{animation:sb-blink 4s infinite;transform-box:fill-box;transform-origin:50% 50%}
  @keyframes sb-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
  .simba .eye-closed{display:none}
  .simba.sleeping .eye-open{display:none}.simba.sleeping .eye-closed{display:block}
  .simba.sleeping .tail{animation:none;transform:rotate(25deg)}
  .simba.sleeping .head{transform:translateY(10px) rotate(6deg)}
  .simba.sleeping .body-group:not(.head){transform:translateY(6px);transform-box:fill-box}
  .simba.sleeping .leg{opacity:0}
  .simba.jump .flip{animation:sb-jump .55s cubic-bezier(.3,1.6,.5,1)}
  @keyframes sb-jump{40%{transform:translateY(-34px) rotate(-6deg)}}
  .simba.left.jump .flip{animation-name:sb-jump-l}
  @keyframes sb-jump-l{0%,100%{transform:scaleX(-1)}40%{transform:scaleX(-1) translateY(-34px) rotate(-6deg)}}
  .simba-bubble{position:fixed;z-index:66;pointer-events:none;background:#f5f2ef;color:#0a0a0b;font:600 13px 'Inter Tight',system-ui,sans-serif;padding:8px 12px;border-radius:12px;white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,.4);transform:translate(-50%,-100%);animation:sb-pop .25s cubic-bezier(.3,1.6,.5,1)}
  .simba-bubble::after{content:"";position:absolute;left:50%;bottom:-6px;margin-left:-6px;border:6px solid transparent;border-bottom:0;border-top-color:#f5f2ef}
  @keyframes sb-pop{from{transform:translate(-50%,-80%) scale(.6);opacity:0}}
  .simba-zzz{position:fixed;z-index:66;pointer-events:none;color:#f5f2ef;font:700 16px 'Anton',Impact,sans-serif;animation:sb-zzz 2.4s ease-out infinite}
  @keyframes sb-zzz{0%{transform:translate(0,0) scale(.6);opacity:0}30%{opacity:1}100%{transform:translate(18px,-34px) scale(1.2);opacity:0}}
  .simba-heart{position:fixed;z-index:66;pointer-events:none;color:#e3142b;font-size:18px;animation:sb-heart 1s ease-out forwards}
  @keyframes sb-heart{to{transform:translate(var(--dx),-60px) scale(1.4);opacity:0}}
  .simba-tag{position:fixed;z-index:66;pointer-events:none;font:700 10px 'Inter Tight',system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#e3142b;background:#0a0a0b;border:1px solid #26262b;padding:3px 7px;border-radius:99px;opacity:0;transition:opacity .2s;transform:translateX(-50%)}
  @media (max-width:560px){.simba{width:70px;height:56px}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- the dog (side view, facing right) ----------
  const svg = `
  <svg viewBox="0 0 124 100" aria-hidden="true">
    <defs>
      <radialGradient id="sbFur" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#f7c674"/><stop offset="1" stop-color="#e09a3e"/></radialGradient>
      <radialGradient id="sbHead" cx="40%" cy="30%" r="70%"><stop offset="0" stop-color="#fbd287"/><stop offset="1" stop-color="#e6a246"/></radialGradient>
      <linearGradient id="sbEar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d98c33"/><stop offset="1" stop-color="#b9701f"/></linearGradient>
    </defs>

    <!-- shadow -->
    <ellipse cx="58" cy="94" rx="40" ry="4" fill="#000" opacity=".25"/>

    <!-- back legs -->
    <g class="back-legs">
      <g class="leg a"><rect x="24" y="68" width="12" height="20" rx="6" fill="#d9923a"/><ellipse cx="30" cy="88" rx="7" ry="4" fill="#fbe3b8"/></g>
      <g class="leg b"><rect x="37" y="70" width="12" height="18" rx="6" fill="#e9a84c"/><ellipse cx="43" cy="88" rx="7" ry="4" fill="#fff0d4"/></g>
    </g>

    <g class="body-group">
      <!-- fluffy tail -->
      <g class="tail">
        <path d="M24 60 C8 58 2 42 8 30 C10 38 14 44 20 46 C14 40 14 32 18 26 C20 38 26 48 32 52 Z" fill="url(#sbFur)"/>
        <path d="M10 33 C9 38 11 42 14 44" stroke="#fbe3b8" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>
      </g>
      <!-- body -->
      <ellipse cx="52" cy="62" rx="31" ry="19" fill="url(#sbFur)"/>
      <path d="M30 56 Q36 52 42 56 M46 52 Q52 48 58 52" stroke="#fbe3b8" stroke-width="2" fill="none" stroke-linecap="round" opacity=".55"/>
      <ellipse cx="70" cy="68" rx="14" ry="12" fill="#fbe3b8"/>
    </g>

    <!-- front legs -->
    <g class="leg b"><rect x="60" y="70" width="12" height="18" rx="6" fill="#d9923a"/><ellipse cx="66" cy="88" rx="7" ry="4" fill="#fbe3b8"/></g>
    <g class="leg a"><rect x="73" y="68" width="12" height="20" rx="6" fill="#e9a84c"/><ellipse cx="79" cy="88" rx="7" ry="4" fill="#fff0d4"/></g>

    <g class="body-group head">
      <!-- back ear -->
      <path d="M66 22 C56 24 54 44 58 56 C62 60 68 56 70 48 C72 38 72 28 66 22 Z" fill="#c97d27"/>
      <!-- head -->
      <circle cx="84" cy="38" r="26" fill="url(#sbHead)"/>
      <!-- fluffy tuft -->
      <path d="M76 13 Q80 6 84 12 Q87 5 91 13" fill="#f7c674" stroke="#e6a246" stroke-width="1.2" stroke-linejoin="round"/>
      <!-- muzzle -->
      <ellipse cx="99" cy="49" rx="15" ry="11" fill="#fff0d4"/>
      <!-- nose -->
      <ellipse cx="111" cy="44" rx="5.5" ry="4.2" fill="#3b2416"/>
      <ellipse cx="109.5" cy="42.6" rx="1.8" ry="1.1" fill="#fff" opacity=".7"/>
      <!-- mouth -->
      <path d="M111 48 Q111 53 106 53 M111 48 Q111 53 115 52.5" stroke="#3b2416" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path class="tongue" d="M105 53 Q108 62 112 53 Z" fill="#ff7a93"/>
      <!-- blush -->
      <ellipse cx="88" cy="50" rx="6" ry="3.5" fill="#ff8fa3" opacity=".55"/>
      <!-- eyes (open) -->
      <g class="eye-open">
        <ellipse cx="78" cy="36" rx="4.6" ry="5.8" fill="#2b1a10"/>
        <ellipse cx="96" cy="35" rx="5.4" ry="6.6" fill="#2b1a10"/>
        <circle cx="79.6" cy="33.6" r="1.8" fill="#fff"/><circle cx="76.8" cy="38.6" r=".9" fill="#fff"/>
        <circle cx="97.8" cy="32.4" r="2.1" fill="#fff"/><circle cx="94.6" cy="38" r="1" fill="#fff"/>
      </g>
      <!-- eyes (sleeping) -->
      <g class="eye-closed">
        <path d="M74 37 Q78 40.5 82 37" stroke="#2b1a10" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M91 36 Q96 40 101 36" stroke="#2b1a10" stroke-width="2" fill="none" stroke-linecap="round"/>
      </g>
      <!-- front ear -->
      <path class="ear" d="M70 18 C60 22 60 42 64 52 C68 56 75 52 76 44 C77 34 76 24 70 18 Z" fill="url(#sbEar)"/>
      <!-- red collar + gold tag -->
      <path d="M64 58 Q82 68 102 60 L101 65 Q82 73 63 63 Z" fill="#e3142b"/>
      <circle cx="84" cy="70" r="4" fill="#f2c94c" stroke="#b8860b" stroke-width=".9"/>
      <text x="84" y="71.6" text-anchor="middle" font-size="4.2" font-family="Arial" font-weight="700" fill="#8a5a00">S</text>
    </g>
  </svg>`;

  const dog = document.createElement('div');
  dog.className = 'simba sitting';
  dog.setAttribute('role', 'button');
  dog.setAttribute('aria-label', 'Simba the dog. Click to say hi.');
  dog.tabIndex = 0;
  dog.innerHTML = `<div class="flip">${svg}</div>`;
  document.body.appendChild(dog);

  const tag = document.createElement('div');
  tag.className = 'simba-tag';
  tag.textContent = 'Simba 🐾';
  document.body.appendChild(tag);

  // ---------- state ----------
  const size = () => ({ w: dog.offsetWidth, h: dog.offsetHeight });
  let x = innerWidth - 140, y = innerHeight - 90;
  let tx = x, ty = y, speed = 70;
  let mode = 'sit';                // 'walk' | 'run' | 'sit' | 'sleep'
  let waitUntil = performance.now() + 2500;
  let restCount = 0, zzz = null, bubble = null, bubbleTimer = null;

  function setMode(m) {
    mode = m;
    dog.classList.toggle('walking', m === 'walk' || m === 'run');
    dog.classList.toggle('running', m === 'run');
    dog.classList.toggle('sitting', m === 'sit');
    dog.classList.toggle('sleeping', m === 'sleep');
    if (m !== 'sleep' && zzz) { zzz.remove(); zzz = null; }
    if (m === 'sleep' && !zzz) { zzz = document.createElement('div'); zzz.className = 'simba-zzz'; zzz.textContent = 'z z z'; document.body.appendChild(zzz); }
  }

  function randomTarget() {
    const { w, h } = size();
    const pad = 20;
    // mostly stays near the bottom, sometimes explores the whole screen
    tx = pad + Math.random() * (innerWidth - w - pad * 2);
    ty = Math.random() < 0.6
      ? innerHeight - h - pad - Math.random() * 60
      : pad + 60 + Math.random() * (innerHeight - h - pad * 2 - 60);
  }

  function goTo(px, py, run) {
    const { w, h } = size();
    tx = Math.max(10, Math.min(innerWidth - w - 10, px - w / 2));
    ty = Math.max(10, Math.min(innerHeight - h - 10, py - h / 2));
    speed = run ? 200 : 70;
    setMode(run ? 'run' : 'walk');
  }

  function say(text, ms = 2200) {
    if (bubble) bubble.remove();
    clearTimeout(bubbleTimer);
    bubble = document.createElement('div');
    bubble.className = 'simba-bubble';
    bubble.textContent = text;
    document.body.appendChild(bubble);
    placeExtras();
    bubbleTimer = setTimeout(() => { bubble && bubble.remove(); bubble = null; }, ms);
  }

  function hearts() {
    for (let i = 0; i < 5; i++) {
      const hEl = document.createElement('span');
      hEl.className = 'simba-heart';
      hEl.textContent = '♥';
      hEl.style.left = (x + size().w / 2 + (Math.random() * 30 - 15)) + 'px';
      hEl.style.top = (y + 4) + 'px';
      hEl.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
      hEl.style.animationDelay = (i * 90) + 'ms';
      document.body.appendChild(hEl);
      setTimeout(() => hEl.remove(), 1300);
    }
  }

  function placeExtras() {
    const { w } = size();
    dog.style.transform = `translate(${x}px, ${y}px)`;
    tag.style.left = (x + w / 2) + 'px';
    tag.style.top = (y - 18) + 'px';
    if (bubble) { bubble.style.left = (x + w / 2) + 'px'; bubble.style.top = (y - 10) + 'px'; }
    if (zzz) { zzz.style.left = (x + w * (dog.classList.contains('left') ? 0.1 : 0.75)) + 'px'; zzz.style.top = (y - 6) + 'px'; }
  }

  // ---------- main loop ----------
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (mode === 'walk' || mode === 'run') {
      const dx = tx - x, dy = ty - y, dist = Math.hypot(dx, dy);
      if (Math.abs(dx) > 1) dog.classList.toggle('left', dx < 0);
      if (dist < 3) {
        restCount++;
        if (restCount % 6 === 0) { setMode('sleep'); waitUntil = now + 9000; }
        else { setMode('sit'); waitUntil = now + 1800 + Math.random() * 3500; }
      } else {
        const step = Math.min(dist, speed * dt);
        x += (dx / dist) * step;
        y += (dy / dist) * step;
      }
    } else if (now > waitUntil && !reduceMotion) {
      randomTarget();
      speed = 70;
      setMode('walk');
    }
    placeExtras();
    requestAnimationFrame(loop);
  }

  // ---------- interactions ----------
  function pet() {
    setMode('sit');
    waitUntil = performance.now() + 3000;
    dog.classList.add('happy', 'jump');
    setTimeout(() => dog.classList.remove('jump'), 560);
    setTimeout(() => dog.classList.remove('happy'), 2200);
    say(LINES[Math.floor(Math.random() * LINES.length)]);
    hearts();
  }
  dog.addEventListener('click', e => { e.stopPropagation(); pet(); });
  dog.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pet(); } });
  dog.addEventListener('mouseenter', () => (tag.style.opacity = 1));
  dog.addEventListener('mouseleave', () => (tag.style.opacity = 0));

  // Click on an empty part of the page: Simba runs there
  document.addEventListener('click', e => {
    if (reduceMotion) return;
    if (e.target.closest('a, button, input, textarea, label, .proj, .cert, .modal, .terminal, .simba')) return;
    goTo(e.clientX, e.clientY, true);
  });

  // Keep him on screen when the window size changes
  addEventListener('resize', () => {
    const { w, h } = size();
    x = Math.min(x, innerWidth - w - 10); y = Math.min(y, innerHeight - h - 10);
    tx = Math.min(tx, innerWidth - w - 10); ty = Math.min(ty, innerHeight - h - 10);
  });

  // Say hi once the page has loaded
  setTimeout(() => say('Hi! I’m Simba 🐾 Click me!', 3000), 2200);
  placeExtras();
  requestAnimationFrame(loop);

  // Other scripts (like the terminal) can talk to Simba
  window.Simba = { pet, say };
})();
