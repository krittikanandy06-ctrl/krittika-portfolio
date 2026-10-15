// =========================================================
// CONNECTS THE WEBSITE TO KRITTIKA'S BACKEND
// - contact form → saves messages in MongoDB
// - visitor counter in the footer
// - Simba pet counter
// =========================================================

// ✏️ Your backend address:
//    while testing on your computer → 'http://localhost:5000'
//    after deploying on Render     → 'https://your-app-name.onrender.com'
const API_URL = 'http://localhost:5000';

(function () {
  if (!API_URL) return;
  const api = (path, options = {}) =>
    fetch(API_URL + path, { headers: { 'Content-Type': 'application/json' }, ...options })
      .then(r => r.json());

  // ---------- 1. Visitor counter (counts each visitor once per browser tab session) ----------
  const footer = document.querySelector('.footbar');
  const visitsEl = document.createElement('span');
  visitsEl.textContent = '👀 … visitors';
  if (footer) footer.insertBefore(visitsEl, footer.lastElementChild);

  let counted = false;
  try { counted = sessionStorage.getItem('counted') === '1'; } catch (e) {}
  (counted ? api('/api/stats') : api('/api/visit', { method: 'POST' }))
    .then(d => {
      visitsEl.textContent = `👀 ${Number(d.visits).toLocaleString('en-IN')} visitors`;
      try { sessionStorage.setItem('counted', '1'); } catch (e) {}
    })
    .catch(() => visitsEl.remove()); // backend asleep or offline: just hide it

  // ---------- 2. Contact form → backend ----------
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    // hidden trap field: real people never see it, spam bots fill it
    const trap = document.createElement('input');
    trap.name = 'website'; trap.tabIndex = -1; trap.autocomplete = 'off';
    trap.style.cssText = 'position:absolute;left:-9999px;opacity:0;height:0';
    trap.setAttribute('aria-hidden', 'true');
    form.appendChild(trap);

    // runs before the old handler in script.js and replaces it
    document.addEventListener('submit', async e => {
      if (e.target !== form) return;
      e.preventDefault();
      e.stopPropagation();
      const data = Object.fromEntries(new FormData(form));
      status.className = 'form-status';
      status.textContent = 'Sending…';
      try {
        const res = await api('/api/contact', { method: 'POST', body: JSON.stringify(data) });
        if (!res.ok) throw new Error(res.error);
        form.reset();
        status.className = 'form-status ok';
        status.textContent = 'Message sent ✓ Thank you! I’ll reply soon.';
        if (window.Simba) window.Simba.say('Message delivered! 📬');
      } catch (err) {
        status.textContent = (err && err.message) || 'Could not send. Please email krittikanandy06@gmail.com directly.';
      }
    }, true);
  }

  // ---------- 3. Simba pet counter ----------
  document.addEventListener('click', e => {
    if (!e.target.closest('.simba')) return;
    api('/api/simba/pet', { method: 'POST' })
      .then(d => {
        if (window.Simba && d.ok) setTimeout(() => window.Simba.say(`I’ve been petted ${d.pets} times! 💛`), 1600);
      })
      .catch(() => {});
  }, true);
})();
