/* ==========================================================================
   AURORA & CO. - GALLERY, LIGHTBOX & SERVICE DETAILS MODAL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Gallery Filtering
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const portfolioGrid = document.getElementById('portfolio-items-grid');

  if (portfolioGrid && typeof EVENT_DATA !== 'undefined') {
    // Render Portfolio Items
    renderPortfolio(EVENT_DATA.portfolio);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        const filteredItems = filter === 'all' 
          ? EVENT_DATA.portfolio 
          : EVENT_DATA.portfolio.filter(item => item.category === filter);

        renderPortfolio(filteredItems);
      });
    });
  }

  function renderPortfolio(items) {
    if (!portfolioGrid) return;
    portfolioGrid.innerHTML = '';

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'portfolio-item reveal-on-scroll is-visible';
      card.dataset.index = index;
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="portfolio-overlay">
          <div class="portfolio-cat">${item.category.toUpperCase()}</div>
          <h3 class="portfolio-title">${item.title}</h3>
          <div class="portfolio-meta">
            <span><i class="fa-solid fa-location-dot"></i> ${item.location}</span>
            <span><i class="fa-solid fa-users"></i> ${item.guests}</span>
          </div>
          <div class="portfolio-view-btn">
            <span>View Showcase</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openLightbox(items, index);
      });

      portfolioGrid.appendChild(card);
    });
  }

  // Lightbox Implementation
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxLocation = document.getElementById('lightbox-location');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGallery = [];
  let currentIndex = 0;

  function openLightbox(items, index) {
    if (!lightboxModal) return;
    currentGallery = items;
    currentIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = currentGallery[currentIndex];
    if (!item) return;

    if (lightboxImg) lightboxImg.src = item.image;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxLocation) lightboxLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${item.location} &bull; ${item.guests}`;
    if (lightboxDesc) lightboxDesc.textContent = item.description;
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
      updateLightboxContent();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % currentGallery.length;
      updateLightboxContent();
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  // Services Modal Handling
  const serviceModal = document.getElementById('service-detail-modal');
  const serviceModalClose = document.getElementById('service-modal-close');
  const serviceModalTitle = document.getElementById('service-modal-title');
  const serviceModalImg = document.getElementById('service-modal-img');
  const serviceModalDesc = document.getElementById('service-modal-desc');
  const serviceModalFeatures = document.getElementById('service-modal-features');
  const serviceBookBtn = document.getElementById('service-modal-book-btn');

  window.openServiceModal = function(serviceId) {
    if (!serviceModal || typeof EVENT_DATA === 'undefined') return;
    const service = EVENT_DATA.services.find(s => s.id === serviceId);
    if (!service) return;

    if (serviceModalTitle) serviceModalTitle.textContent = service.title;
    if (serviceModalImg) serviceModalImg.src = service.image;
    if (serviceModalDesc) serviceModalDesc.textContent = service.detailText || service.description;
    
    if (serviceModalFeatures) {
      serviceModalFeatures.innerHTML = service.features.map(f => `
        <li style="margin-bottom:8px; display:flex; align-items:center; gap:8px;">
          <i class="fa-solid fa-circle-check" style="color:var(--gold-400);"></i>
          <span>${f}</span>
        </li>
      `).join('');
    }

    if (serviceBookBtn) {
      serviceBookBtn.onclick = () => {
        serviceModal.classList.remove('open');
        document.body.style.overflow = '';
        const bookingSelect = document.getElementById('booking-event-type');
        if (bookingSelect) bookingSelect.value = service.id;
        const contactSection = document.getElementById('contact');
        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
      };
    }

    serviceModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  if (serviceModalClose) {
    serviceModalClose.addEventListener('click', () => {
      serviceModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) {
        serviceModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
});
