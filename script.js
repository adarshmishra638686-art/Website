/* ============================================================
   NexaGrow – Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  function handleNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar();

  /* ---- Mobile hamburger menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---- Scroll-reveal animation ---- */
  const revealElements = document.querySelectorAll(
    '.service-card, .result-card, .testimonial-card, .process-step, ' +
    '.about-inner, .contact-inner, .section-header, .hero-stats'
  );

  revealElements.forEach(function (el) {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---- Staggered card reveal ---- */
  function staggerCards(selector, delayStep) {
    document.querySelectorAll(selector).forEach(function (card, i) {
      card.style.transitionDelay = (i * (delayStep || 90)) + 'ms';
    });
  }
  staggerCards('.service-card',      90);
  staggerCards('.result-card',       100);
  staggerCards('.testimonial-card',  100);

  /* ---- Contact form submission ---- */
  const contactForm  = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const requiredFields = contactForm.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(function (field) {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#ef4444';
        valid = false;
      }
    });

    if (!valid) return;

    // Simulate form submission
    const submitBtn = contactForm.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(function () {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      formSuccess.classList.add('visible');
      contactForm.reset();

      setTimeout(function () {
        formSuccess.classList.remove('visible');
      }, 6000);
    }, 1200);
  });

  /* ---- Smooth active nav link highlighting ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(function (a) {
          a.classList.remove('active-nav');
          if (a.getAttribute('href') === '#' + id) {
            a.classList.add('active-nav');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---- Animated counter for stats ---- */
  function animateCounter(el, target, suffix, duration) {
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(function () {
      start += Math.ceil(target / (duration / 16));
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = start + suffix;
    }, 16);
  }

  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        statsObserver.unobserve(entry.target);

        entry.target.querySelectorAll('.stat strong').forEach(function (el) {
          const text = el.textContent.trim();
          const match = text.match(/^([+$]?)(\d+)([KkMm%+]?)(\+?)(.*)$/);
          if (!match) return;
          const prefix = match[1];
          const num    = parseInt(match[2], 10);
          const suffix = match[3] + match[4] + match[5];

          el.textContent = prefix + '0' + suffix;
          animateCounter({ set: function (v) { el.textContent = prefix + v + suffix; } }, num, '', 1200);

          let count = 0;
          const interval = setInterval(function () {
            count += Math.ceil(num / 75);
            if (count >= num) { count = num; clearInterval(interval); }
            el.textContent = prefix + count + suffix;
          }, 16);
        });
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

})();
