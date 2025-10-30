/* LifeLink - cleaned / single-file fixes
   Replace your existing script.js with this file (minimal invasive fixes).
*/

/* ---------- Config (single source) ---------- */
const API_BASE = 'http://localhost:8080'; // base (we append /api in apiFetch)
const TOKEN_KEY = 'lifelink_token';
let isUserSignedIn = false;
let currentUserData = {
  fullName: '',
  email: '',
  studentId: '',
  branch: '',
  bloodGroup: '',
  mobile: '',
  pinCode: '',
  lastDonated: ''
};

/* ---------- Small DOM helpers ---------- */
const $ = (sel) => { try { return document.querySelector(sel); } catch { return null; } };
const $$ = (sel) => { try { return Array.from(document.querySelectorAll(sel)); } catch { return []; } };

/* ---------- Safe API helper ---------- */
/**
 * apiFetch('/auth/register', { method: 'POST', body: {...} })
 * will call `${API_BASE}/api/auth/register`
 */
async function apiFetch(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}/api${path}`;
  const headers = Object.assign({}, opts.headers || {});

  // set content-type only when body present and not FormData
  if (opts.body != null && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const fetchOpts = {
    method: opts.method || 'GET',
    headers,
    body: opts.body == null ? null : (headers['Content-Type'] === 'application/json' ? JSON.stringify(opts.body) : opts.body)
  };

  try {
    const res = await fetch(url, fetchOpts);
    return res;
  } catch (err) {
    console.error('Network error:', err);
    throw err;
  }
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}

/* ---------- Token helpers ---------- */
function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event('storage'));
}
function getToken() { return localStorage.getItem(TOKEN_KEY); }
function removeToken() { localStorage.removeItem(TOKEN_KEY); window.dispatchEvent(new Event('storage')); }

/* ---------- Message box (safe) ---------- */
// REPLACE your existing showMessageBox with this improved version
function showMessageBox(title = 'Info', message = '', type = 'info', autoCloseMs = 0) {
  const box = document.getElementById('message-box');
  if (!box) { console[type === 'error' ? 'error' : 'log'](`${title}: ${message}`); return; }

  // Elements inside box
  const titleEl = document.getElementById('message-box-title');
  const textEl = document.getElementById('message-box-text');
  const okBtn = document.getElementById('message-box-ok-btn');
  if (titleEl) titleEl.textContent = title;
  if (textEl) textEl.textContent = message;

  // Styling classes
  box.classList.remove('premium-message-box-success', 'premium-message-box-error');
  if (type === 'success') box.classList.add('premium-message-box-success');
  if (type === 'error') box.classList.add('premium-message-box-error');

  // show
  box.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Close helpers
  const close = () => {
    box.style.display = 'none';
    document.body.style.overflow = '';
    // remove listeners to avoid leaks / duplicate handlers
    okBtn && okBtn.removeEventListener('click', okHandler);
    box.removeEventListener('click', overlayHandler);
    document.removeEventListener('keydown', escHandler);
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
  };

  const okHandler = (e) => { e && e.preventDefault(); close(); };
  const overlayHandler = (e) => { if (e.target === box) close(); };
  const escHandler = (e) => { if (e.key === 'Escape') close(); };

  // attach handlers (remove previous first to prevent duplicates)
  okBtn && okBtn.removeEventListener('click', okHandler);
  okBtn && okBtn.addEventListener('click', okHandler);
  box.removeEventListener('click', overlayHandler);
  box.addEventListener('click', overlayHandler);
  document.removeEventListener('keydown', escHandler);
  document.addEventListener('keydown', escHandler);

  // Optional auto-close (useful for ephemeral success messages)
  let autoCloseTimer = null;
  if (autoCloseMs && Number(autoCloseMs) > 0) {
    autoCloseTimer = setTimeout(close, Number(autoCloseMs));
  }
}


/* ---------- Elements (safe retrieval, used later) ---------- */
const signInModal = $('#signin-modal');
const registerModal = $('#register-modal');
const donateOptionsModal = $('#donate-options-modal');
const receiveOptionsModal = $('#receive-options-modal');
const messageBox = $('#message-box');

/* ---------- Single register handler (prevent double-wiring) ---------- */
(function wireRegister() {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;
  if (registerForm.dataset.wired === '1') return;
  registerForm.dataset.wired = '1';

  registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!this.consent || !this.consent.checked) {
      showMessageBox('Consent Required', 'Please agree to the data usage terms to register.', 'error');
      return;
    }

    // Build payload: match backend keys — confirm with backend if studentId key differs
    const payload = {
      email: this['register-email'] ? this['register-email'].value : '',
      password: this['register-password'] ? this['register-password'].value : '',
      fullName: this.name ? this.name.value : '',
      studentId: this['student-id'] ? this['student-id'].value : '',
      branch: this.branch ? this.branch.value : '',
      bloodGroup: this['blood-group'] ? this['blood-group'].value : '',
      mobileNumber: this.mobile ? this.mobile.value : null,
      pincode: this['register-pincode'] ? this['register-pincode'].value : null,
      dob: this.dob ? this.dob.value : null,
      weight: this.weight ? this.weight.value : null,
      lastDonated: this['last-donated'] ? this['last-donated'].value : null
    };

    try {
      const res = await apiFetch('/auth/register', { method: 'POST', body: payload });
      const data = await safeJson(res);
      if (res.ok) {
        showMessageBox('Registration Successful', 'Welcome! Please sign in now.', 'success');
        this.reset();
        if (registerModal) registerModal.style.display = 'none';
      } else {
        // show backend message if present
        const errMsg = (data && (data.error || data.message)) || `Status ${res.status}`;
        showMessageBox('Registration Failed', errMsg, 'error');
      }
    } catch (err) {
      showMessageBox('Network Error', err.message || String(err), 'error');
    }
  });
})();

/* ---------- Single signin handler (prevent double-wiring) ---------- */
(function wireSignin() {
  const signinForm = document.getElementById('signin-form');
  if (!signinForm) return;
  if (signinForm.dataset.wired === '1') return;
  signinForm.dataset.wired = '1';

  signinForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = this['signin-email'] ? this['signin-email'].value : '';
    const password = this['signin-password'] ? this['signin-password'].value : '';

    try {
      const res = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
      const data = await safeJson(res);
      if (res.ok && data && data.token) {
        saveToken(data.token);
        isUserSignedIn = true;
        if (signInModal) signInModal.style.display = 'none';
        showMessageBox('Signed In', 'Welcome back!', 'success');
        // call your existing flow to update profile UI
        await updateUIAfterLogin();
      } else {
        const errMsg = (data && (data.error || data.message)) || 'Invalid credentials';
        showMessageBox('Sign In Failed', errMsg, 'error');
      }
    } catch (err) {
      showMessageBox('Network Error', err.message || String(err), 'error');
    }
  });
})();

/* ---------- Profile fetch + update UI ---------- */
async function fetchProfile() {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) {
      if (res.status === 401) removeToken();
      return null;
    }
    return await safeJson(res);
  } catch (err) {
    console.error('fetchProfile error', err);
    return null;
  }
}

async function updateUIAfterLogin() {
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const profileMenu = document.getElementById('profileMenu');

  if (!loginBtn || !registerBtn || !profileMenu) return;

  const token = getToken();
  if (token) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    profileMenu.style.display = 'inline-block';

    const profile = await fetchProfile();
    if (profile) {
      currentUserData.fullName = profile.fullName || profile.fullname || profile.email || currentUserData.fullName;
      currentUserData.email = profile.email || currentUserData.email;
      currentUserData.studentId = profile.studentId || profile.userId || currentUserData.studentId;
      const pn = document.getElementById('profileName'), pe = document.getElementById('profileEmail'), pi = document.getElementById('profileInitial');
      if (pn) pn.textContent = currentUserData.fullName || 'User';
      if (pe) pe.textContent = currentUserData.email || '';
      if (pi) pi.textContent = (currentUserData.fullName || 'U').trim().charAt(0).toUpperCase();
    } else {
      // token invalid
      removeToken();
      loginBtn.style.display = 'inline-block';
      registerBtn.style.display = 'inline-block';
      profileMenu.style.display = 'none';
      return;
    }
  } else {
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    profileMenu.style.display = 'none';
  }
}

function updateUIAfterLogin() {
  const token = localStorage.getItem('lifelink_token');
  const loginBtn = document.querySelector('#loginBtn');
  const registerBtn = document.querySelector('#registerBtn');
  const profileMenu = document.querySelector('#profileMenu');

  if (token) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    profileMenu.style.display = 'block';
  } else {
    loginBtn.style.display = 'block';
    registerBtn.style.display = 'block';
    profileMenu.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('lifelink_token');
  updateUIAfterLogin();
}

window.onload = updateUIAfterLogin;

/* ---------- Profile dropdown & logout ---------- */
function setupProfileDropdown() {
  const profileBtn = document.getElementById('profileBtn');
  const dropdown = document.getElementById('profileDropdown');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!profileBtn || !dropdown) return;
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.style.display === 'block';
    dropdown.style.display = isOpen ? 'none' : 'block';
    profileBtn.setAttribute('aria-expanded', String(!isOpen));
  });
  dropdown.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', () => { dropdown.style.display = 'none'; profileBtn && profileBtn.setAttribute('aria-expanded', 'false'); });
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      removeToken();
      isUserSignedIn = false;
      updateUIAfterLogin();
      // optional: location.href = '/';
    });
  }
}

/* ---------- Nav dropdowns (Awareness / More) ---------- */
function setupNavDropdowns() {
  $$('.dropdown').forEach(dd => {
    const btn = dd.querySelector('.dropbtn');
    const menu = dd.querySelector('.dropdown-content');
    if (!btn || !menu) return;
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const open = menu.style.display === 'block';
      $$('.dropdown .dropdown-content').forEach(m => { if (m !== menu) m.style.display = 'none'; });
      menu.style.display = open ? 'none' : 'block';
    });
    btn.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); btn.click(); } });
  });
  document.addEventListener('click', () => $$('.dropdown .dropdown-content').forEach(m => m.style.display = 'none'));
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') $$('.dropdown .dropdown-content').forEach(m => m.style.display = 'none'); });
}

/* ---------- Other wiring (hero, compatibility, donation flow) ----------
   Kept intact — call each function if elements exist in DOM.
   I did NOT change behaviour here; just protected against missing nodes.
*/

function initHeroSlider() {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const sliderContainer = document.getElementById('hero-slider');
  if (!slides.length || !sliderContainer) return;
  const totalSlides = slides.length;

  // set container width and each slide width (inline so it beats CSS)
  sliderContainer.style.width = `${totalSlides * 100}%`;
  slides.forEach(slide => {
    slide.style.width = `${100 / totalSlides}%`;
    slide.style.flex = `0 0 ${100 / totalSlides}%`;
  });

  // current slide index (integer)
  sliderContainer.dataset.current = sliderContainer.dataset.current || '0';

  function goTo(index) {
    const idx = ((Number(index) % totalSlides) + totalSlides) % totalSlides;
    sliderContainer.dataset.current = String(idx);
    // translate by percentage of the container (container is totalSlides*100% wide)
    const movePercent = idx * (100 / totalSlides);
    sliderContainer.style.transform = `translateX(-${movePercent}%)`;
  }

  // expose (same API name) but do not duplicate bindings
  window.changeSlide = (dir) => {
    const current = Number(sliderContainer.dataset.current || 0);
    goTo(current + Number(dir));
  };

  // Bind nav buttons via data-dir (prevents duplication & accidental reverse)
  const navButtons = Array.from(document.querySelectorAll('.slider-nav button'));
  navButtons.forEach(btn => {
    // remove previous handlers (safe)
    btn.replaceWith(btn.cloneNode(true));
  });
  const freshNavButtons = Array.from(document.querySelectorAll('.slider-nav button'));
  freshNavButtons.forEach(btn => {
    const dir = Number(btn.getAttribute('data-dir') || 0);
    if (dir === 0) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.changeSlide(dir);
      resetAuto();
    });
  });

  // keyboard support, but don't reattach if already attached
  if (!document._heroSliderKeybound) {
    document._heroSliderKeybound = true;
    document.addEventListener('keydown', (e) => {
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      const editable = document.activeElement && (document.activeElement.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag));
      if (editable) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); window.changeSlide(-1); resetAuto(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); window.changeSlide(1); resetAuto(); }
    });
  }

  // auto-advance
  let autoTimer = setInterval(() => window.changeSlide(1), 5000);
  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => window.changeSlide(1), 5000);
  }

  // ensure layout correct immediately
  goTo(Number(sliderContainer.dataset.current || 0));

  // reposition on resize (debounced)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // recompute widths in case CSS/layout changed
      sliderContainer.style.width = `${slides.length * 100}%`;
      slides.forEach(slide => slide.style.width = `${100 / slides.length}%`);
      goTo(Number(sliderContainer.dataset.current || 0));
    }, 120);
  });
}


function wireCompatibility() {
  const selectorContainer = document.getElementById('blood-type-selector');
  const donateList = document.getElementById('donate-list');
  const receiveList = document.getElementById('receive-list');
  if (!selectorContainer || !donateList || !receiveList) return;

  const compatibilityData = {
    "A+": { donate: ["A+", "AB+"], receive: ["A+", "A-", "O+", "O-"] },
    "A-": { donate: ["A+", "A-", "AB+", "AB-"], receive: ["A-", "O-"] },
    "B+": { donate: ["B+", "AB+"], receive: ["B+", "B-", "O+", "O-"] },
    "B-": { donate: ["B+", "B-", "AB+", "AB-"], receive: ["B-", "O-"] },
    "AB+": { donate: ["AB+"], receive: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    "AB-": { donate: ["AB+", "AB-"], receive: ["AB-", "A-", "B-", "O-"] },
    "O+": { donate: ["O+", "A+", "B+", "AB+"], receive: ["O+", "O-"] },
    "O-": { donate: ["O-", "A-", "B-", "AB-", "O+", "A+", "B+", "AB+"], receive: ["O-"] }
  };

  selectorContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.blood-type-button');
    if (!button) return;
    $$('.blood-type-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const bloodType = button.dataset.type;
    const data = compatibilityData[bloodType] || { donate: [], receive: [] };
    donateList.innerHTML = data.donate.map(t => `<span>${t}</span>`).join('') || '<p>No data available</p>';
    receiveList.innerHTML = data.receive.map(t => `<span>${t}</span>`).join('') || '<p>No data available</p>';
  });
}

/* ---------- Donation/donation-page helpers (kept as-is, protected) ---------- */
function setInfoFieldsReadonly(readonlyState) {
  const ids = ['#book-name-main', '#book-student-id-main', '#book-email-main', '#book-blood-group-main', '#book-mobile-main', '#book-pincode-main', '#book-last-donated', '#book-branch-main'];
  ids.forEach(sel => {
    const el = $(sel); if (!el) return;
    if (el.tagName === 'SELECT') el.disabled = readonlyState;
    else el.readOnly = readonlyState;
    el.classList.toggle('form-group-readonly', readonlyState);
  });
}

function prefillDonationFormMain() {
  const map = { '#book-name-main': 'fullName', '#book-email-main': 'email', '#book-student-id-main': 'studentId', '#book-branch-main': 'branch', '#book-blood-group-main': 'bloodGroup', '#book-mobile-main': 'mobile', '#book-pincode-main': 'pinCode', '#book-last-donated': 'lastDonated' };
  Object.entries(map).forEach(([sel, key]) => { const el = $(sel); if (!el) return; el.value = currentUserData[key] || ''; });
}

/* summary update wrapper (safe) */
function updateSummary() {
  const by = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  by('summary-name', ($('#book-name-main') && $('#book-name-main').value) || 'N/A');
  by('summary-blood-group', ($('#book-blood-group-main') && $('#book-blood-group-main').value) || 'N/A');
  by('summary-mobile', ($('#book-mobile-main') && $('#book-mobile-main').value) || 'N/A');
  by('summary-date', ($('#donation-date-main' && $('#donation-date-main').value) ? new Date($('#donation-date-main').value).toDateString() : 'N/A'));
  by('summary-time', ($('#time-slot-main') && $('#time-slot-main').value) || 'N/A');
}

/* ---------- Small wiring for modal open/close (kept minimal) ---------- */
function wireModalButtons() {
  const openSignInBtn = $('#loginBtn'),
    openRegisterBtn = $('#registerBtn'),
    openDonateCta = $('#open-donate-cta'),
    openReceiveCta = $('#open-receive-cta');

  const goToRegisterBtn = $('#go-to-register-btn'),
    goToSigninBtn = $('#go-to-signin-btn');

  // Top-bar buttons
  if (openSignInBtn && signInModal)
    openSignInBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signInModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });

  if (openRegisterBtn && registerModal)
    openRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      registerModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });

  // Donate / Receive CTAs
  if (openDonateCta)
    openDonateCta.addEventListener('click', (e) => {
      e.preventDefault();
      if (isUserSignedIn) {
        showPage && showPage('donation-page');
        prefillDonationFormMain();
        setInfoFieldsReadonly(true);
      } else if (donateOptionsModal)
        donateOptionsModal.style.display = 'flex';
    });

  if (openReceiveCta && receiveOptionsModal)
    openReceiveCta.addEventListener('click', (e) => {
      e.preventDefault();
      receiveOptionsModal.style.display = 'flex';
    });

  // **NEW: handle choices inside donate modal**
  if (goToRegisterBtn)
    goToRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (donateOptionsModal) donateOptionsModal.style.display = 'none';
      if (registerModal) {
        registerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });

  if (goToSigninBtn)
    goToSigninBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (donateOptionsModal) donateOptionsModal.style.display = 'none';
      if (signInModal) {
        signInModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });

  // Close modals (same as before)
  $$('.auth-modal .close-btn').forEach(btn =>
    btn.addEventListener('click', (ev) => {
      const modal = ev.target.closest('.auth-modal');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    })
  );

  $$('.auth-modal').forEach(modal =>
    modal.addEventListener('click', (ev) => {
      if (ev.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    })
  );

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      $$('.auth-modal').forEach(m => m.style.display = 'none');
      $$('.dropdown .dropdown-content').forEach(m => m.style.display = 'none');
      document.body.style.overflow = '';
    }
  });

  // --- Fix: link toggles that match your HTML IDs ---
  const switchToSignin = $('#switch-to-signin');   // "Sign In here" in register modal
  const switchToRegister = $('#switch-to-register'); // "Register here" in signin modal

  if (switchToSignin) {
    switchToSignin.addEventListener('click', (e) => {
      e.preventDefault();
      if (registerModal) { registerModal.style.display = 'none'; document.body.style.overflow = ''; }
      if (signInModal) { signInModal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    });
  }

  if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      if (signInModal) { signInModal.style.display = 'none'; document.body.style.overflow = ''; }
      if (registerModal) { registerModal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    });
  }

}


/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    setupProfileDropdown();
    setupLogout && setupLogout(); // if present later in file
    setupNavDropdowns();
    initHeroSlider && initHeroSlider();
    wireCompatibility && wireCompatibility();
    wireModalButtons();
    await updateUIAfterLogin();
    console.log('lifelink script loaded');
  } catch (err) {
    console.error('init error', err);
  }
});

/* ---------- Helpers that might exist later in file (kept safe) ---------- */
function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;
  logoutBtn.addEventListener('click', (e) => { e.preventDefault(); removeToken(); updateUIAfterLogin(); window.location.href = '/'; });
}



