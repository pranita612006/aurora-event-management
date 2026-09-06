/* ==========================================================================
   AURORA & CO. - INTERACTIVE BUDGET & EXPERIENCE ESTIMATOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const guestSlider = document.getElementById('estimator-guests');
  const guestDisplay = document.getElementById('estimator-guest-val');
  const typeCards = document.querySelectorAll('.estimator-type-card');
  const tierCards = document.querySelectorAll('.estimator-tier-card');
  const addonCheckboxes = document.querySelectorAll('.estimator-addon-input');
  
  const priceDisplay = document.getElementById('estimator-total-price');
  const breakdownType = document.getElementById('summary-event-type');
  const breakdownGuests = document.getElementById('summary-guest-count');
  const breakdownTier = document.getElementById('summary-prod-tier');
  const breakdownAddons = document.getElementById('summary-addons-total');
  const applyBtn = document.getElementById('apply-estimator-to-booking');

  if (!guestSlider || !priceDisplay) return;

  // Pricing Matrix Base Values (in INR)
  const typeBase = {
    weddings: { name: "Royal Wedding", base: 3500000, perGuest: 25000 },
    corporate: { name: "Corporate Gala", base: 4000000, perGuest: 18000 },
    concerts: { name: "Symphonic Concert", base: 5500000, perGuest: 12000 },
    parties: { name: "Private Soirée", base: 2500000, perGuest: 28000 },
    launches: { name: "Product Reveal", base: 4500000, perGuest: 22000 },
    fashion: { name: "Haute Runway", base: 4800000, perGuest: 24000 }
  };

  const tierMultipliers = {
    gold: { name: "Gold Elegance", multiplier: 1.0 },
    diamond: { name: "Diamond Prestige", multiplier: 1.45 },
    platinum: { name: "Platinum Royal", multiplier: 2.1 }
  };

  let state = {
    type: 'weddings',
    guests: parseInt(guestSlider.value, 10) || 150,
    tier: 'diamond',
    addons: []
  };

  function calculateEstimate() {
    const selectedType = typeBase[state.type] || typeBase.weddings;
    const selectedTier = tierMultipliers[state.tier] || tierMultipliers.diamond;

    // Base guest cost
    const baseCost = selectedType.base + (state.guests * selectedType.perGuest);
    const tieredCost = baseCost * selectedTier.multiplier;

    // Sum Addons
    let addonsTotal = 0;
    state.addons.forEach(cost => {
      addonsTotal += cost;
    });

    const grandTotal = tieredCost + addonsTotal;
    const lowerRange = Math.round(grandTotal * 0.95);
    const upperRange = Math.round(grandTotal * 1.12);

    // Format currency in Indian Rupees
    const formatCurr = (num) => '₹' + num.toLocaleString('en-IN');

    // Update UI elements
    priceDisplay.textContent = `${formatCurr(lowerRange)} - ${formatCurr(upperRange)}`;
    if (breakdownType) breakdownType.textContent = selectedType.name;
    if (breakdownGuests) breakdownGuests.textContent = `${state.guests} Guests`;
    if (breakdownTier) breakdownTier.textContent = selectedTier.name;
    if (breakdownAddons) breakdownAddons.textContent = formatCurr(addonsTotal);
    if (guestDisplay) guestDisplay.textContent = `${state.guests} Attendees`;
  }

  // Event Type Selection
  typeCards.forEach(card => {
    card.addEventListener('click', () => {
      typeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.type = card.dataset.type;
      calculateEstimate();
    });
  });

  // Tier Selection
  tierCards.forEach(card => {
    card.addEventListener('click', () => {
      tierCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.tier = card.dataset.tier;
      calculateEstimate();
    });
  });

  // Guest Count Slider
  guestSlider.addEventListener('input', (e) => {
    state.guests = parseInt(e.target.value, 10);
    if (typeof updateRangeTrack === 'function') updateRangeTrack(e.target);
    calculateEstimate();
  });

  // Addon Checkboxes
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const card = cb.closest('.addon-checkbox-card');
      if (cb.checked) {
        card.classList.add('checked');
      } else {
        card.classList.remove('checked');
      }

      state.addons = [];
      addonCheckboxes.forEach(box => {
        if (box.checked) {
          state.addons.push(parseInt(box.dataset.price, 10) || 0);
        }
      });
      calculateEstimate();
    });
  });

  // Apply to Booking Form
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      // Find booking form elements
      const bookingTypeSelect = document.getElementById('booking-event-type');
      const bookingGuestSlider = document.getElementById('booking-guests');
      const bookingGuestDisplay = document.getElementById('booking-guests-val');
      const bookingMessage = document.getElementById('booking-message');
      
      if (bookingTypeSelect) {
        bookingTypeSelect.value = state.type;
      }
      if (bookingGuestSlider) {
        bookingGuestSlider.value = state.guests;
        if (bookingGuestDisplay) bookingGuestDisplay.textContent = `${state.guests} Guests`;
      }
      if (bookingMessage) {
        const selectedType = typeBase[state.type]?.name || "Bespoke Event";
        const selectedTier = tierMultipliers[state.tier]?.name || "Diamond Prestige";
        bookingMessage.value = `Estimated Plan: ${selectedType} (${state.guests} guests, ${selectedTier} production level). Looking forward to discussing details.`;
      }

      // Smooth scroll to booking section
      const bookingSection = document.getElementById('contact');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        // Subtle highlight effect on booking form card
        const formCard = document.querySelector('.booking-form-card');
        if (formCard) {
          formCard.classList.add('animate-pulse-glow');
          setTimeout(() => {
            formCard.classList.remove('animate-pulse-glow');
          }, 3000);
        }
      }
    });
  }

  // Initial Calculation
  calculateEstimate();
});
