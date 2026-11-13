/* =========================================================
   NIVAQUINE – Digital Solutions
   Interactions du site
   ---------------------------------------------------------
   1. En-tête : ombre au défilement
   2. Menu mobile
   3. Navigation active selon la section affichée
   4. Animations d'apparition au défilement
   5. Bascule de langue FR / EN
   6. Validation du formulaire de contact
   7. Année du copyright
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 1. En-tête : ombre au défilement ---------- */
  const header = document.getElementById('site-header');

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Menu mobile ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function setMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label',
      menuToggle.dataset[open ? 'labelOpen' : 'labelClose'] ||
      (open ? 'Fermer le menu' : 'Ouvrir le menu'));
    mobileMenu.hidden = !open;
    // Empêche le défilement de la page derrière le menu ouvert
    document.body.style.overflow = open ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', function () {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  // Fermeture au clic sur un lien
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  // Fermeture avec la touche Échap
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });

  // Réinitialisation si l'on repasse en affichage bureau
  const desktopQuery = window.matchMedia('(min-width: 1024px)');
  desktopQuery.addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  /* ---------- 3. Navigation active selon la section ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (link) {
        link.classList.toggle('is-active',
          link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(function (section) { sectionObserver.observe(section); });

  /* ---------- 4. Animations d'apparition ---------- */
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  /* ---------- 5. Bascule de langue FR / EN ---------- */
  const langButtons = document.querySelectorAll('.lang-btn');
  const FRENCH_LABELS = {
    fr: { open: 'Ouvrir le menu', close: 'Fermer le menu' },
    en: { open: 'Open menu', close: 'Close menu' }
  };

  // Mémorise le stockage local (silencieux si indisponible)
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }
  function recall(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function applyLanguage(lang) {
    const isEnglish = lang === 'en';

    // 1. Textes simples : bascule entre le contenu FR et l'attribut data-en
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (!el.dataset.fr) el.dataset.fr = el.textContent.trim();
      el.textContent = isEnglish ? el.dataset.en : el.dataset.fr;
    });

    // 2. Placeholders
    document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
      if (!el.dataset.frPlaceholder) el.dataset.frPlaceholder = el.getAttribute('placeholder') || '';
      el.setAttribute('placeholder', isEnglish ? el.dataset.enPlaceholder : el.dataset.frPlaceholder);
    });

    // 3. Libellés ARIA (accessibilité)
    document.querySelectorAll('[data-en-label]').forEach(function (el) {
      if (!el.dataset.frLabel) el.dataset.frLabel = el.getAttribute('aria-label') || '';
      el.setAttribute('aria-label', isEnglish ? el.dataset.enLabel : el.dataset.frLabel);
    });

    // 4. Attribut lang du document + bouton actif
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;

    langButtons.forEach(function (btn) {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    // 5. Libellés du bouton burger selon la langue
    setMenuLabels(lang);
    store('nq-lang', lang);
  }

  function setMenuLabels(lang) {
    const labels = FRENCH_LABELS[lang] || FRENCH_LABELS.fr;
    menuToggle.dataset.labelOpen = labels.open;
    menuToggle.dataset.labelClose = labels.close;
    menuToggle.setAttribute('aria-label',
      menuToggle.getAttribute('aria-expanded') === 'true' ? labels.close : labels.open);
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { applyLanguage(btn.dataset.lang); });
  });

  const savedLang = recall('nq-lang') || 'fr';
  setMenuLabels(savedLang);
  if (savedLang === 'en') applyLanguage('en');

  /* ---------- 6. Validation du formulaire de contact ---------- */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  const validators = {
    nom: function (v) { return v.trim().length >= 2; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    sujet: function (v) { return v !== ''; },
    message: function (v) { return v.trim().length >= 10; }
  };

  function checkField(field) {
    const validate = validators[field.name];
    if (!validate) return true;

    const valid = validate(field.value);
    field.classList.toggle('is-invalid', !valid);
    field.setAttribute('aria-invalid', String(!valid));

    const error = document.getElementById(field.name + '-error');
    if (error) error.hidden = valid;

    return valid;
  }

  // Validation à la sortie de chaque champ (dès le premier essai)
  let formTouched = false;
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('blur', function () {
      if (formTouched || field.value !== '') checkField(field);
    });
    field.addEventListener('input', function () {
      if (field.classList.contains('is-invalid')) checkField(field);
    });
  });

  function showStatus(message, ok) {
    status.textContent = message;
    status.hidden = false;
    status.classList.toggle('is-success', ok);
    status.classList.toggle('is-error', !ok);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    formTouched = true;

    const fields = Array.from(form.querySelectorAll('[required]'));
    const allValid = fields.map(checkField).every(Boolean);

    if (!allValid) {
      const lang = document.documentElement.lang;
      showStatus(
        lang === 'en'
          ? 'Please correct the highlighted fields before sending.'
          : 'Veuillez corriger les champs signalés avant l’envoi.',
        false
      );
      form.querySelector('.is-invalid').focus();
      return;
    }

    // Envoi : brancher ici votre service (Formulaire, API, e-mail…)
    // Exemple : fetch('/api/contact', { method: 'POST', body: new FormData(form) })
    submitBtn.classList.add('is-loading');

    window.setTimeout(function () {
      submitBtn.classList.remove('is-loading');
      const lang = document.documentElement.lang;

      showStatus(
        lang === 'en'
          ? 'Thank you! Your message has been sent. We will get back to you shortly.'
          : 'Merci ! Votre message a bien été envoyé. Nous revenons vers vous très vite.',
        true
      );
      form.reset();
      formTouched = false;
      fields.forEach(function (field) {
        field.classList.remove('is-invalid');
        field.removeAttribute('aria-invalid');
        const error = document.getElementById(field.name + '-error');
        if (error) error.hidden = true;
      });
    }, 700);
  });

  /* ---------- 7. Année du copyright ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
