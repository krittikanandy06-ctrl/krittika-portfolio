// =========================================================
// KRITTIKA NANDY · PORTFOLIO SCRIPT
// =========================================================

// ✏️ FILL THESE IN when you have them. Leave '' (empty) to hide that button.
const CONFIG = {
  live: {
    resumind: '',        // e.g. 'https://resumind.vercel.app'
    risebluemedia: '',   // e.g. 'https://rise-blue-media.vercel.app'
    crackpulse: '',
    signlanguage: ''
  },
  codechef: 'https://www.codechef.com/users/krittika06_n',          // e.g. 'https://www.codechef.com/users/your_username'
  leetcode: 'https://leetcode.com/u/zpid8J1yLa/',          // e.g. 'https://leetcode.com/u/your_username'
  formspree: ''          // e.g. 'https://formspree.io/f/abcdwxyz' (free at formspree.io)
};

// ✏️ The story of each project (shown when a card is clicked)
const PROJECTS = {
  resumind: {
    title: 'Resumind', sub: 'AI Resume Analyzer · May 2025',
    problem: 'Students send resumes without knowing if they are strong enough or match what recruiters look for.',
    built: ['An AI system that scores a resume and gives feedback on skills, keywords and overall profile strength', 'NLP techniques to pull out and analyse candidate details from the resume', 'Deployed on Vercel'],
    learned: 'How NLP can read real documents, and how to turn analysis into feedback people can act on.',
    tags: ['NLP', 'JavaScript', 'AI', 'Vercel']
  },
  crackpulse: {
    title: 'CrackPulse', sub: 'Giving structures a digital pulse',
    problem: 'Checking buildings and bridges for cracks and unusual vibration by hand is slow and easy to get wrong.',
    built: ['Crack detection from images using OpenCV', 'Vibration inspection to spot structural issues', 'An agentic workflow running on AWS'],
    learned: 'Computer vision with OpenCV and how to connect AI agents with cloud services.',
    tags: ['Python', 'OpenCV', 'AWS', 'Agentic AI']
  },
  risebluemedia: {
    title: 'Rise Blue Media', sub: 'Agency website',
    problem: 'A media brand needed a modern website that looks good on every screen.',
    built: ['A fully responsive multi-section agency website', 'Clean layout with a strong hero and clear calls to action', 'Deployed on Vercel'],
    learned: 'Responsive layouts, real-world design decisions and deploying a site for others to use.',
    tags: ['JavaScript', 'HTML', 'CSS', 'Vercel']
  },
  signlanguage: {
    title: 'Sign Language', sub: 'AI / ML project',
    problem: 'People who use sign language often face a communication gap with people who don’t know it.',
    built: ['A Python project that recognises sign language gestures', 'A machine learning pipeline from input to prediction'],
    learned: 'Working with image data and training models for real-time recognition.',
    tags: ['Python', 'AI / ML', 'Computer Vision']
  }
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ---------- 1. Loader ----------
window.addEventListener('load', () => {
  setTimeout(() => $('#loader').classList.add('done'), reduceMotion ? 0 : 900);
});
setTimeout(() => $('#loader').classList.add('done'), 2500); // safety net

// ---------- 2. Big red name: split into letters + fit screen ----------
const bigWord = $('#bigWord');
const word = bigWord.textContent.trim();
bigWord.setAttribute('aria-label', word);
bigWord.innerHTML = [...word].map((ch, i) => `<span style="--i:${i}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
function fitBigWord() {
  bigWord.style.fontSize = '';
  const size = parseFloat(getComputedStyle(bigWord).fontSize);
  const used = [...bigWord.children].reduce((s, el) => s + el.getBoundingClientRect().width, 0);
  if (used > bigWord.clientWidth) bigWord.style.fontSize = Math.floor(size * bigWord.clientWidth / used * 0.97) + 'px';
}
fitBigWord();
window.addEventListener('resize', fitBigWord);
if (document.fonts) document.fonts.ready.then(fitBigWord);

// ---------- 3. Photo fallback ----------
const photo = $('#myPhoto');
photo.addEventListener('error', () => photo.parentElement.classList.add('missing'));
if (photo.complete && photo.naturalWidth === 0) photo.parentElement.classList.add('missing');

// ---------- 4. Stats count up ----------
if (!reduceMotion) {
  $$('[data-count]').forEach(el => {
    const end = Number(el.dataset.count);
    const start = performance.now() + 1300;
    el.textContent = '0';
    (function tick(now) {
      const p = Math.max(0, Math.min(1, (now - start) / 1300));
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  });
}

// ---------- 5. Scroll: progress bar, reveal, timeline line ----------
const progress = $('#progress');
const timeline = $('#timeline');
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  if (!reduceMotion) {
    const r = timeline.getBoundingClientRect();
    const p = (innerHeight * 0.75 - r.top) / r.height;
    timeline.style.setProperty('--draw', Math.max(0, Math.min(1, p)));
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (!reduceMotion && 'IntersectionObserver' in window) {
  const items = $$('.reveal').filter(el => el.getBoundingClientRect().top > innerHeight);
  items.forEach(el => el.classList.add('wait'));
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.remove('wait'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  items.forEach(el => io.observe(el));
}

// ---------- 6. Custom cursor (desktop only) ----------
const cursor = $('#cursor');
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
  window.addEventListener('mousemove', e => {
    cursor.classList.add('show');
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
  document.addEventListener('mouseover', e => cursor.classList.toggle('grow', !!e.target.closest('a, button, .proj, .cert')));
  document.addEventListener('mouseleave', () => cursor.classList.remove('show'));
}

// ---------- 7. Project buttons + pop-up ----------
function linkButtons(key, codeUrl) {
  let html = '';
  if (CONFIG.live[key]) html += `<a class="live" href="${CONFIG.live[key]}" target="_blank" rel="noopener">Live demo ↗</a>`;
  if (codeUrl) html += `<a href="${codeUrl}" target="_blank" rel="noopener">GitHub</a>`;
  return html;
}
$$('.proj-links[data-live]').forEach(box => {
  box.innerHTML = linkButtons(box.dataset.live, box.dataset.code);
  box.addEventListener('click', e => e.stopPropagation()); // buttons shouldn't open the pop-up
  if (!box.innerHTML) box.remove();
});

const projModal = $('#projModal');
let lastFocus = null;
function openProject(card) {
  const key = card.dataset.project, p = PROJECTS[key];
  lastFocus = card;
  $('#mNum').textContent = card.querySelector('.n').textContent;
  $('#mTitle').textContent = p.title;
  $('#mSub').textContent = p.sub;
  $('#mProblem').textContent = p.problem;
  $('#mBuilt').innerHTML = p.built.map(b => `<li>${b}</li>`).join('');
  $('#mLearned').textContent = p.learned;
  $('#mTags').innerHTML = p.tags.map(t => `<span>${t}</span>`).join('');
  const linksBox = card.querySelector('.proj-links');
  $('#mLinks').innerHTML = linksBox ? linksBox.innerHTML : '';
  // Screenshot: images/projects/<key>.png if it exists, otherwise the animated preview
  const shot = $('#mShot');
  shot.innerHTML = '';
  const img = new Image();
  img.alt = p.title + ' screenshot';
  img.onload = () => { shot.innerHTML = ''; shot.appendChild(img); };
  shot.appendChild(card.querySelector('.shot').cloneNode(true));
  img.src = `images/projects/${key}.png`;
  projModal.hidden = false;
  $('#mClose').focus();
}
$$('.proj').forEach(card => {
  card.addEventListener('click', () => openProject(card));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(card); } });
});

// ---------- 8. Certificates: filter + viewer ----------
$('#certFilters').addEventListener('click', e => {
  const btn = e.target.closest('button'); if (!btn) return;
  $$('#certFilters button').forEach(b => b.classList.toggle('on', b === btn));
  let i = 0;
  $$('.cert').forEach(c => {
    const show = btn.dataset.f === 'all' || c.dataset.cat === btn.dataset.f;
    c.hidden = !show;
    if (show) { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = ''; c.style.animationDelay = (i++ * 40) + 'ms'; }
  });
});

const certModal = $('#certModal'), cImg = $('#cImg'), cMissing = $('#cMissing');
$$('.cert').forEach(c => c.addEventListener('click', () => {
  lastFocus = c;
  const title = c.querySelector('b').textContent, src = c.dataset.img;
  $('#cCap').innerHTML = `<b>${c.querySelector('time').textContent}</b> · ${title} · ${c.querySelector('span').textContent}`
    + (c.dataset.verify ? `<a class="verify" href="${c.dataset.verify}" target="_blank" rel="noopener">Verify on Credly ↗</a>` : '');
  cImg.hidden = false; cMissing.hidden = true; cImg.alt = title;
  cImg.onerror = () => { cImg.hidden = true; cMissing.hidden = false; cMissing.innerHTML = `Certificate image coming soon.<br>Save a screenshot as <code>${src}</code>`; };
  cImg.src = src;
  certModal.hidden = false;
  $('#cClose').focus();
}));

// ---------- 9. Close pop-ups (✕, Esc, click outside) ----------
function closeModals() {
  projModal.hidden = true; certModal.hidden = true;
  if (lastFocus) lastFocus.focus();
}
$('#mClose').addEventListener('click', closeModals);
$('#cClose').addEventListener('click', closeModals);
[projModal, certModal].forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModals(); }));

// ---------- 10. Coding profiles ----------
$$('[data-profile]').forEach(a => {
  const url = CONFIG[a.dataset.profile];
  if (url) { a.href = url; a.hidden = false; }
});

// ---------- 11. Contact form ----------
const form = $('#contactForm'), status = $('#formStatus');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = new FormData(form);
  if (!CONFIG.formspree) {
    // No Formspree yet: open the visitor's email app with the message filled in
    const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;
    location.href = `mailto:krittikanandy06@gmail.com?subject=${encodeURIComponent('Hi Krittika, from your portfolio')}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app…';
    return;
  }
  status.className = 'form-status'; status.textContent = 'Sending…';
  try {
    const res = await fetch(CONFIG.formspree, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error();
    form.reset(); status.className = 'form-status ok'; status.textContent = 'Message sent ✓ Thank you!';
  } catch {
    status.textContent = 'Could not send. Please email krittikanandy06@gmail.com directly.';
  }
});

// Copy email
$('#copy').addEventListener('click', e => {
  const btn = e.currentTarget;
  navigator.clipboard.writeText($('#mail').textContent)
    .then(() => { btn.textContent = 'Copied ✓'; setTimeout(() => (btn.textContent = 'Copy'), 1600); })
    .catch(() => (btn.textContent = 'Select it'));
});

// ---------- 12. Terminal easter egg (press ~) ----------
const term = $('#terminal'), termOut = $('#termOut'), termInput = $('#termInput'), termBody = $('#termBody');
const CMDS = {
  help: () => `Commands:
  <span class="r">about</span>         who I am
  <span class="r">education</span>     where I study
  <span class="r">experience</span>    my internships
  <span class="r">projects</span>      things I built
  <span class="r">skills</span>        what I work with
  <span class="r">certificates</span>  what I learned
  <span class="r">resume</span>        open my resume
  <span class="r">contact</span>       reach me
  <span class="r">clear</span> · <span class="r">exit</span>
  <span class="m">psst… try "sudo hire-me"</span>`,
  about: () => `Hi, I'm <span class="w">Krittika Nandy</span> 👋
Full-Stack Web Developer & B.Tech CSE (AI & ML) student at ABES.
I build web apps with JavaScript, React, Node.js and Python.
Status: <span class="r">open to internships</span>`,
  education: () => `B.Tech CSE (AI & ML) · ABES Engineering College · 2024–2028 · CGPA 8.0
Class XII · Ryan International School · CBSE · 2022
Class X  · St. Xavier's Institution, Kolkata · ICSE · 2020`,
  experience: () => `<span class="w">Generative AI Intern</span> · IBM SkillsBuild · Mar–Jun 2025
<span class="w">Cyber Security Intern</span> · IBM SkillsBuild · 2025`,
  projects: () => Object.values(PROJECTS).map((p, i) => `<span class="r">0${i + 1}</span> ${p.title}`).join('\n'),
  skills: () => $$('.chips span').map(s => s.textContent).join(' · '),
  certificates: () => $$('.cert').map(c => `• ${c.querySelector('b').textContent} <span class="m">(${c.querySelector('span').textContent})</span>`).join('\n'),
  contact: () => `email     krittikanandy06@gmail.com
phone     +91 93307 42456
github    github.com/krittikanandy06-ctrl
linkedin  linkedin.com/in/krittika-nandy-fsdpythonwebdeveloper`,
  resume: () => { window.open('resume/Krittika-Nandy-Resume.pdf', '_blank'); return 'Opening resume…'; },
  'sudo hire-me': () => `[sudo] password for recruiter: ********
<span class="r">✔ Access granted.</span>
Scheduling interview… just kidding 😄
Email me at <span class="w">krittikanandy06@gmail.com</span> and let's talk!`,
  whoami: () => 'a very curious visitor 👀'
};
function print(cmd) {
  const c = cmd.trim().toLowerCase();
  const line = document.createElement('div');
  line.innerHTML = `<span class="r">➜ ~</span> ${cmd.replace(/</g, '&lt;')}`;
  termOut.appendChild(line);
  if (c === 'clear') { termOut.innerHTML = ''; return; }
  if (c === 'exit') { toggleTerminal(false); return; }
  if (!c) return;
  const res = document.createElement('div');
  res.innerHTML = CMDS[c] ? CMDS[c]() : `command not found: <span class="r">${c.replace(/</g, '&lt;')}</span> · type <span class="w">help</span>`;
  termOut.appendChild(res);
  termBody.scrollTop = termBody.scrollHeight;
}
function toggleTerminal(show = term.hidden) {
  term.hidden = !show;
  if (show) {
    if (!termOut.innerHTML) print('help');
    termInput.focus();
  }
}
$('#termForm').addEventListener('submit', e => { e.preventDefault(); print(termInput.value); termInput.value = ''; });
$('#termOpen').addEventListener('click', () => toggleTerminal(true));
$('#termClose').addEventListener('click', () => toggleTerminal(false));
termBody.addEventListener('click', () => termInput.focus());

document.addEventListener('keydown', e => {
  const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && document.activeElement !== termInput;
  if ((e.key === '~' || e.key === '`') && !typing) { e.preventDefault(); toggleTerminal(); }
  if (e.key === 'Escape') { if (!term.hidden) toggleTerminal(false); closeModals(); }
});

// ---------- 13. Footer year ----------
$('#year').textContent = new Date().getFullYear();
