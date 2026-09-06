/* ==========================================================================
   AURORA & CO. - TESTIMONIALS CAROUSEL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonial-dots');

  if (!track || typeof EVENT_DATA === 'undefined') return;

  const testimonials = EVENT_DATA.testimonials;
  let currentIndex = 0;
  let autoplayTimer = null;

  // Render Testimonial Slides
  track.innerHTML = '';
  testimonials.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'testimonial-slide';
    
    // Generate gold stars with twinkle micro-animation
    const stars = Array(item.rating).fill('<i class="fa-solid fa-star animate-star-twinkle"></i>').join('');

    slide.innerHTML = `
      <div class="testimonial-card">
        <div class="quote-icon"><i class="fa-solid fa-quote-left"></i></div>
        <div class="testimonial-rating">${stars}</div>
        <p class="testimonial-text">"${item.quote}"</p>
        <div class="testimonial-author-box">
          <img src="${item.avatar}" alt="${item.name}" class="testimonial-avatar" loading="lazy">
          <div class="testimonial-author-info">
            <h4 class="author-name">${item.name}</h4>
            <span class="author-title">${item.title}</span>
          </div>
        </div>
      </div>
    `;
    track.appendChild(slide);
  });

  // Render Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    testimonials.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((d, idx) => {
        d.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    updateCarousel();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      resetAutoplay();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
      resetAutoplay();
    }
  }, { passive: true });

  // Autoplay
  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 6500);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  track.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  track.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
});
