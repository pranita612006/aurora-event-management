/* ==========================================================================
   AURORA & CO. - SMART BOOKING ENGINE & CONFIRMATION SYSTEM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('event-booking-form');
  const dateInput = document.getElementById('booking-date');
  const guestSlider = document.getElementById('booking-guests');
  const guestDisplay = document.getElementById('booking-guests-val');
  const eventPills = document.querySelectorAll('.booking-event-pill');
  const typeSelect = document.getElementById('booking-event-type');

  // Success Receipt Modal Elements
  const receiptModal = document.getElementById('receipt-modal');
  const receiptClose = document.getElementById('receipt-modal-close');
  const receiptCode = document.getElementById('receipt-ref-code');
  const receiptClient = document.getElementById('receipt-client-name');
  const receiptEmail = document.getElementById('receipt-client-email');
  const receiptType = document.getElementById('receipt-event-type');
  const receiptDate = document.getElementById('receipt-event-date');
  const receiptGuests = document.getElementById('receipt-event-guests');
  const receiptBudget = document.getElementById('receipt-event-budget');
  const downloadReceiptBtn = document.getElementById('btn-download-receipt');
  const calendarInviteBtn = document.getElementById('btn-calendar-invite');

  // Set minimum date to 3 days from today
  if (dateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // Guest count slider feedback
  if (guestSlider && guestDisplay) {
    guestSlider.addEventListener('input', (e) => {
      guestDisplay.textContent = `${e.target.value} Guests`;
    });
  }

  // Event Type Pill Sync with Select Dropdown
  if (eventPills && typeSelect) {
    eventPills.forEach(pill => {
      pill.addEventListener('click', () => {
        eventPills.forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        typeSelect.value = pill.dataset.value;
      });
    });

    typeSelect.addEventListener('change', () => {
      eventPills.forEach(p => {
        if (p.dataset.value === typeSelect.value) {
          p.classList.add('selected');
        } else {
          p.classList.remove('selected');
        }
      });
    });
  }

  // Active state for stored last booking
  let lastBookingData = null;

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather form values
      const fullName = document.getElementById('booking-name')?.value.trim();
      const email = document.getElementById('booking-email')?.value.trim();
      const phone = document.getElementById('booking-phone')?.value.trim();
      const eventType = typeSelect?.options[typeSelect.selectedIndex]?.text || "Bespoke Gala";
      const eventDate = dateInput?.value;
      const guests = guestSlider?.value || 150;
      const budgetTier = document.getElementById('booking-budget')?.value || "Imperial";
      const message = document.getElementById('booking-message')?.value.trim() || "No additional remarks.";

      // Basic Validation
      if (!fullName || !email || !eventDate) {
        showToast("Please provide all required fields (Name, Email & Date).", "error");
        return;
      }

      // Generate Luxury Booking Reference (e.g. AUR-2026-8492)
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      const refCode = `AUR-${year}-${randomDigits}`;

      lastBookingData = {
        refCode,
        fullName,
        email,
        phone,
        eventType,
        eventDate,
        guests,
        budgetTier,
        message,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      // Populate Receipt Modal
      if (receiptCode) receiptCode.textContent = refCode;
      if (receiptClient) receiptClient.textContent = fullName;
      if (receiptEmail) receiptEmail.textContent = email;
      if (receiptType) receiptType.textContent = eventType;
      if (receiptDate) receiptDate.textContent = new Date(eventDate).toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
      if (receiptGuests) receiptGuests.textContent = `${guests} Attendees`;
      if (receiptBudget) receiptBudget.textContent = budgetTier;

      // Show Receipt Modal
      if (receiptModal) {
        receiptModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }

      // Reset form
      bookingForm.reset();
      if (guestDisplay) guestDisplay.textContent = "150 Guests";
      showToast("Inquiry received! Your VIP booking dossier has been generated.", "success");
    });
  }

  // Close Receipt Modal
  if (receiptClose && receiptModal) {
    receiptClose.addEventListener('click', () => {
      receiptModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Download Receipt / Print Functionality
  if (downloadReceiptBtn) {
    downloadReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Generate .ics Calendar Event File
  if (calendarInviteBtn) {
    calendarInviteBtn.addEventListener('click', () => {
      if (!lastBookingData) return;

      const eventStartDate = lastBookingData.eventDate.replace(/-/g, '');
      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Aurora & Co Bespoke Events//Event Consultation//EN",
        "BEGIN:VEVENT",
        `SUMMARY:Aurora & Co. Event: ${lastBookingData.eventType}`,
        `DESCRIPTION:Ref: ${lastBookingData.refCode} - VIP Event Planning Consultation for ${lastBookingData.fullName}`,
        `DTSTART:${eventStartDate}T100000Z`,
        `DTEND:${eventStartDate}T120000Z`,
        "LOCATION:Aurora & Co. Global Atelier / Virtual Suite",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `${lastBookingData.refCode}_Consultation.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Calendar invitation (.ics) downloaded!", "success");
    });
  }

  // Toast Notification Helper
  function showToast(message, type = "info") {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: rgba(16, 20, 29, 0.95);
      border: 1px solid ${type === 'error' ? '#FF4D4F' : 'var(--gold-500)'};
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      color: var(--text-pure);
      padding: 14px 24px;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 12px;
      backdrop-filter: blur(16px);
      animation: fadeInUp 0.3s ease;
      pointer-events: auto;
    `;

    const icon = type === 'error' 
      ? '<i class="fa-solid fa-circle-exclamation" style="color:#FF4D4F"></i>' 
      : '<i class="fa-solid fa-crown" style="color:var(--gold-400)"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  window.showLuxuryToast = showToast;
});
