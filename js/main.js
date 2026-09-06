/* ==========================================================================
   AURORA & CO. - MAIN APPLICATION LOGIC & LUXURY EFFECTS
   ========================================================================== */

/* ── Gold Range Slider Track Fill ── */
function updateRangeTrack(input) {
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 100;
  const val = parseFloat(input.value) || 0;
  const pct = ((val - min) / (max - min)) * 100;
  // Gold track fill via background gradient
  input.style.background = `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${pct}%, #232A3B ${pct}%, #232A3B 100%)`;
}

// Initialize all range inputs on page load
document.querySelectorAll('.range-input').forEach(inp => {
  updateRangeTrack(inp);
  inp.addEventListener('input', () => updateRangeTrack(inp));
});

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar & Active Navigation State
  const navbar = document.querySelector('.navbar-wrapper');
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active Section Indicator
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
    });

    // Close on mobile link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // 2. Interactive Gold Particle Ambient Canvas
  const canvas = document.getElementById('hero-particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        color: ['#F7E7B4', '#D4AF37', '#E6CA65', '#FFF'][Math.floor(Math.random() * 4)]
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // 3. Animated Number Counters
  const counterElements = document.querySelectorAll('.stat-counter');
  let countersAnimated = false;

  function animateCounters() {
    counterElements.forEach(counter => {
      const target = parseFloat(counter.dataset.target);
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const easeOut = 1 - (1 - progress) * (1 - progress);
        const currentVal = easeOut * target;

        counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = isDecimal ? target.toFixed(1) : target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // 4. Scroll Reveal & Intersection Observer
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const statsSection = document.querySelector('.hero-stats-bar');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  // 5. Interactive FAQ Search & Accordions
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearch = document.getElementById('faq-search-input');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const q = item.querySelector('.faq-question-btn')?.textContent.toLowerCase();
        const a = item.querySelector('.faq-answer')?.textContent.toLowerCase();
        if (q?.includes(val) || a?.includes(val)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 6. Sound / Ambient Audio Synthesizer (Harp Chime feedback)
  const soundBtn = document.getElementById('sound-toggle-btn');
  let audioCtx = null;

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        playGoldChime(audioCtx);
        if (window.showLuxuryToast) {
          window.showLuxuryToast("Harmonic audio ambience activated.", "info");
        }
      } catch (err) {
        console.log("Audio not supported or permitted", err);
      }
    });
  }

  function playGoldChime(ctx) {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (C Major luxury arpeggio)
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);

      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 1.3);
    });
  }

  // 7. Newsletter Subscription Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        if (window.showLuxuryToast) {
          window.showLuxuryToast("Welcome to Aurora Privé. Exclusive event invitations will be sent to your inbox.", "success");
        }
        newsletterForm.reset();
      }
    });
  }

  // 8. Direct Package Reservation Button links
  const packageBtns = document.querySelectorAll('.package-select-btn');
  packageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tier = btn.dataset.tier || "celestial";
      const bookingBudget = document.getElementById('booking-budget');
      if (bookingBudget) {
        if (tier === 'sovereign') bookingBudget.value = "Sovereign (₹25L+)";
        if (tier === 'celestial') bookingBudget.value = "Celestial (₹65L+)";
        if (tier === 'imperial') bookingBudget.value = "Imperial (Royal Bespoke)";
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 9. Interactive Card Spotlight & 3D Tilt Micro-Interactions
  const interactiveCards = document.querySelectorAll(
    '.pricing-card, .service-card, .portfolio-item, .estimator-radio-card, .testimonial-card, .about-card, .pillar-item'
  );

  interactiveCards.forEach(card => {
    card.classList.add('card-spotlight');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle 3D perspective tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 10. Luxury Button Click Ripple Effect
  const luxuryButtons = document.querySelectorAll('.btn, .social-circle-btn, .concierge-toggle-btn');
  luxuryButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;
      const rect = btn.getBoundingClientRect();

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('btn-ripple-effect');

      const existingRipple = btn.querySelector('.btn-ripple-effect');
      if (existingRipple) existingRipple.remove();

      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 700);
    });
  });
});

