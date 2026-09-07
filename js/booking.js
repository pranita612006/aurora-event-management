/* ==========================================================================
   AURORA & CO. - SMART BOOKING ENGINE, OWNER NOTIFICATIONS & PORTAL
   Target Owner Email: ppawar612006@gmail.com
   ========================================================================== */

const OWNER_EMAIL = "ppawar612006@gmail.com";
const STORAGE_KEY = "aurora_vip_bookings_v2";

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

  // Owner Portal Elements
  const ownerPortalBtn = document.getElementById('owner-portal-btn');
  const ownerPortalFooterBtn = document.getElementById('owner-portal-footer-btn');
  const ownerModal = document.getElementById('owner-portal-modal');
  const ownerModalClose = document.getElementById('owner-portal-close');
  const ownerBookingsList = document.getElementById('owner-bookings-list');
  const ownerBookingsCount = document.getElementById('owner-bookings-count');
  const ownerPendingCount = document.getElementById('owner-pending-count');
  const ownerAcceptedCount = document.getElementById('owner-accepted-count');
  const ownerClearBtn = document.getElementById('owner-clear-all-btn');

  // Customer Reply Composer Elements
  const replyModal = document.getElementById('reply-composer-modal');
  const replyModalClose = document.getElementById('reply-composer-close');
  const replyModalTitle = document.getElementById('reply-modal-title');
  const replyClientInfo = document.getElementById('reply-client-info');
  const replySubjectInput = document.getElementById('reply-subject-input');
  const replyBodyInput = document.getElementById('reply-body-input');
  const replyTemplateAccept = document.getElementById('reply-template-accept');
  const replyTemplateDecline = document.getElementById('reply-template-decline');
  const replyTemplateConsult = document.getElementById('reply-template-consult');
  const btnReplyGmail = document.getElementById('btn-reply-gmail');
  const btnReplyMailto = document.getElementById('btn-reply-mailto');
  const btnReplyCopy = document.getElementById('btn-reply-copy');

  let activeReplyBooking = null;

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

  // Load bookings from LocalStorage
  function getStoredBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Storage read error", e);
      return [];
    }
  }

  // Save bookings to LocalStorage
  function saveBookings(bookings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      renderOwnerPortal();
    } catch (e) {
      console.error("Storage write error", e);
    }
  }

  // Active state for stored last booking
  let lastBookingData = null;

  // ── Form Submission & Email Dispatch ──
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('btn-submit-booking');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

      // Gather form values
      const fullName = document.getElementById('booking-name')?.value.trim();
      const email = document.getElementById('booking-email')?.value.trim();
      const phone = document.getElementById('booking-phone')?.value.trim() || "Not provided";
      const eventType = typeSelect?.options[typeSelect.selectedIndex]?.text || "Bespoke Gala";
      const eventDate = dateInput?.value;
      const guests = guestSlider?.value || 150;
      const budgetTier = document.getElementById('booking-budget')?.value || "Imperial";
      const message = document.getElementById('booking-message')?.value.trim() || "No additional remarks.";

      // Validation
      if (!fullName || !email || !eventDate) {
        showToast("Please provide all required fields (Name, Email & Date).", "error");
        return;
      }

      // Generate Luxury Booking Reference (e.g. AUR-2026-8492)
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      const refCode = `AUR-${year}-${randomDigits}`;

      const newBooking = {
        id: Date.now(),
        refCode,
        fullName,
        email,
        phone,
        eventType,
        eventDate,
        guests,
        budgetTier,
        message,
        status: "Pending", // 'Pending' | 'Accepted' | 'Declined'
        createdAt: new Date().toLocaleString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        })
      };

      lastBookingData = newBooking;

      // 1. Save booking to local store
      const allBookings = getStoredBookings();
      allBookings.unshift(newBooking);
      saveBookings(allBookings);

      // 2. Prepare Email Notification to Owner
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Securing Booking Dossier...</span>`;
      }

      const emailPayload = {
        _subject: `👑 VIP Booking Dossier: ${fullName} - ${eventType} [${refCode}]`,
        _replyto: email,
        _template: "table",
        _captcha: "false",
        "Booking Reference": refCode,
        "Client Name": fullName,
        "Client Email": email,
        "Contact Phone": phone,
        "Event Discipline": eventType,
        "Desired Date": eventDate,
        "Guest Count": `${guests} Attendees`,
        "Investment Budget": budgetTier,
        "Vision & Remarks": message,
        "Direct Reply": `Hit 'Reply' in your email app to respond directly to ${fullName} (${email}), or use the Aurora Owner Atelier Portal.`
      };

      // Send to Owner Email via FormSubmit API
      try {
        const response = await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(emailPayload)
        });
        const resData = await response.json().catch(() => ({}));
        if (resData.message && resData.message.includes("activate")) {
          showToast(`FormSubmit activation link sent to ${OWNER_EMAIL}. Click it once to enable direct inbox alerts.`, "info");
        }
      } catch (err) {
        console.log("Background email dispatch caught:", err);
      }

      // Restore submit button state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }

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
      showToast(`Inquiry sent! Booking dossier (${refCode}) logged & sent to owner.`, "success");
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

  // ── OWNER PORTAL MANAGEMENT LOGIC ──

  function renderOwnerPortal() {
    if (!ownerBookingsList) return;
    const bookings = getStoredBookings();

    // Stats Counters
    if (ownerBookingsCount) ownerBookingsCount.textContent = bookings.length;
    const pendingCount = bookings.filter(b => b.status === "Pending").length;
    const acceptedCount = bookings.filter(b => b.status === "Accepted").length;
    if (ownerPendingCount) ownerPendingCount.textContent = pendingCount;
    if (ownerAcceptedCount) ownerAcceptedCount.textContent = acceptedCount;

    if (bookings.length === 0) {
      ownerBookingsList.innerHTML = `
        <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
          <i class="fa-solid fa-inbox" style="font-size:2.5rem; margin-bottom:12px; color:rgba(212,175,55,0.4);"></i>
          <h4 style="color:var(--text-pure); margin-bottom:6px;">No Bookings Yet</h4>
          <p style="font-size:0.88rem;">Customer bookings submitted on the website will instantly appear here and notify ${OWNER_EMAIL}.</p>
        </div>
      `;
      return;
    }

    ownerBookingsList.innerHTML = '';

    bookings.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'owner-booking-card';

      let statusBadgeColor = '#22D3EE'; // cyan for pending
      let statusBg = 'rgba(34, 211, 238, 0.15)';
      if (item.status === 'Accepted') {
        statusBadgeColor = '#52c41a';
        statusBg = 'rgba(82,196,26,0.15)';
      } else if (item.status === 'Declined') {
        statusBadgeColor = '#ff4d4f';
        statusBg = 'rgba(255,77,79,0.15)';
      }

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:10px;">
          <div>
            <span style="font-family:var(--font-serif); font-weight:700; color:var(--gold-300); font-size:1.05rem;">${item.refCode}</span>
            <span style="font-size:0.75rem; color:var(--text-muted); margin-left:8px;">${item.createdAt}</span>
          </div>
          <span class="booking-status-badge" style="background:${statusBg}; color:${statusBadgeColor}; padding:4px 12px; border-radius:20px; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">
            ${item.status === 'Accepted' ? '✓ Accepted' : item.status === 'Declined' ? '✗ Declined' : '⏳ Pending'}
          </span>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; font-size:0.88rem; margin-bottom:14px;">
          <div><strong style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; display:block;">Client Name:</strong> ${item.fullName}</div>
          <div><strong style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; display:block;">Email Address:</strong> <a href="mailto:${item.email}" style="color:var(--gold-400); text-decoration:underline;">${item.email}</a></div>
          <div><strong style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; display:block;">Phone:</strong> ${item.phone}</div>
          <div><strong style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; display:block;">Event Type:</strong> ${item.eventType}</div>
          <div><strong style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; display:block;">Target Date:</strong> ${item.eventDate}</div>
          <div><strong style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; display:block;">Scale / Budget:</strong> ${item.guests} Guests &bull; ${item.budgetTier}</div>
        </div>

        <div style="background:rgba(0,0,0,0.25); padding:10px 14px; border-radius:6px; font-size:0.84rem; color:var(--text-secondary); margin-bottom:14px; border-left:2px solid var(--gold-500);">
          <strong style="color:var(--gold-400);">Vision Note:</strong> "${item.message}"
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; align-items:center;">
          <button class="btn btn-sm btn-accept" data-id="${item.id}" style="background:rgba(82,196,26,0.18); color:#95de64; border:1px solid rgba(82,196,26,0.4); padding:8px 15px; font-size:0.8rem; font-weight:600; border-radius:4px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-check"></i> Accept &amp; Email Client
          </button>
          <button class="btn btn-sm btn-decline" data-id="${item.id}" style="background:rgba(255,77,79,0.18); color:#ffa39e; border:1px solid rgba(255,77,79,0.4); padding:8px 15px; font-size:0.8rem; font-weight:600; border-radius:4px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-xmark"></i> Reject &amp; Email Client
          </button>
          <button class="btn btn-sm btn-delete" data-id="${item.id}" style="background:rgba(255,255,255,0.06); color:var(--text-muted); border:1px solid rgba(255,255,255,0.1); padding:8px 12px; font-size:0.8rem; border-radius:4px; cursor:pointer;" title="Delete Record">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;

      // Accept Handler -> Auto-fills Acceptance Template & opens composer
      const acceptBtn = card.querySelector('.btn-accept');
      acceptBtn?.addEventListener('click', () => {
        item.status = "Accepted";
        saveBookings(bookings);
        showToast(`Booking ${item.refCode} marked as ACCEPTED! Opening email draft...`, "success");
        openReplyComposer(item, 'accept');
      });

      // Decline Handler -> Auto-fills Decline Template & opens composer
      const declineBtn = card.querySelector('.btn-decline');
      declineBtn?.addEventListener('click', () => {
        item.status = "Declined";
        saveBookings(bookings);
        showToast(`Booking ${item.refCode} marked as DECLINED. Opening email draft...`, "info");
        openReplyComposer(item, 'decline');
      });

      // Delete Handler
      const deleteBtn = card.querySelector('.btn-delete');
      deleteBtn?.addEventListener('click', () => {
        if (confirm(`Remove booking ${item.refCode}?`)) {
          const updated = bookings.filter(b => b.id !== item.id);
          saveBookings(updated);
          showToast(`Booking ${item.refCode} removed.`, "info");
        }
      });

      ownerBookingsList.appendChild(card);
    });
  }

  // ── Fully Automatic Email Dispatch to Client (0-Typing) ──
  async function sendAutomaticDecisionEmail(booking, decision, triggerBtn = null) {
    if (!booking || !booking.email) return;

    // Retrieve stored booking details if available
    const allBookings = getStoredBookings();
    const stored = allBookings.find(b => b.refCode === booking.refCode || (b.id && b.id === booking.id));
    const fullName = (stored && stored.fullName) || booking.fullName || "VIP Client";
    const eventType = (stored && stored.eventType) || booking.eventType || "Bespoke Production";
    const eventDate = (stored && stored.eventDate) || booking.eventDate || "Requested Date";
    const refCode = booking.refCode || (stored && stored.refCode) || "AUR-2026";
    const guests = (stored && stored.guests) || booking.guests || 150;
    const budgetTier = (stored && stored.budgetTier) || booking.budgetTier || "Imperial";

    const originalHtml = triggerBtn ? triggerBtn.innerHTML : '';
    if (triggerBtn) {
      triggerBtn.disabled = true;
      triggerBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending to Client...`;
    }

    let payload = {};
    if (decision === 'accept') {
      payload = {
        _subject: `👑 VIP Booking Confirmed: Aurora & Co. [${refCode}]`,
        _replyto: OWNER_EMAIL,
        _template: "table",
        _captcha: "false",
        "Booking Status": "OFFICIALLY ACCEPTED & CONFIRMED",
        "Dossier Reference": refCode,
        "Client Name": fullName,
        "Event Discipline": eventType,
        "Confirmed Date": eventDate,
        "Estimated Scale": `${guests} Attendees`,
        "Investment Tier": budgetTier,
        "Executive Management": "Pranita Pawar & Julian Vance (Aurora & Co. Executive Atelier)",
        "Atelier Confirmation": `Dear ${fullName}, we are delighted to inform you that your VIP booking dossier (${refCode}) for ${eventType} on ${eventDate} has been OFFICIALLY ACCEPTED by Aurora & Co. Our Executive Producer Julian Vance will be in direct contact to proceed with your bespoke event consultation.`
      };
    } else {
      payload = {
        _subject: `Booking Inquiry Update: Aurora & Co. [${refCode}]`,
        _replyto: OWNER_EMAIL,
        _template: "table",
        _captcha: "false",
        "Booking Status": "DECLINED (Schedule Fully Booked)",
        "Dossier Reference": refCode,
        "Client Name": fullName,
        "Event Discipline": eventType,
        "Requested Date": eventDate,
        "Atelier Notice": `Dear ${fullName}, thank you for reaching out to Aurora & Co. Regarding your booking inquiry (${refCode}) for ${eventDate}, our atelier calendar is currently at maximum capacity for this date and we cannot accept new productions. We warmly invite you to explore alternative dates.`
      };
    }

    // 1. Send automatic email directly to client's email inbox
    try {
      await fetch(`https://formsubmit.co/ajax/${booking.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.log("Auto email dispatch background caught:", err);
    }

    // 2. Update booking status in local storage
    if (stored) {
      stored.status = decision === 'accept' ? 'Accepted' : 'Declined';
      saveBookings(allBookings);
    } else {
      renderOwnerPortal();
    }

    if (triggerBtn) {
      triggerBtn.disabled = false;
      triggerBtn.innerHTML = originalHtml;
    }

    if (decision === 'accept') {
      showToast(`👑 Booking ${refCode} ACCEPTED! Acceptance email sent automatically to ${booking.email}`, "success");
    } else {
      showToast(`Booking ${refCode} DECLINED. Notification email sent automatically to ${booking.email}`, "info");
    }
  }

  // ── Handle Automatic Decision from Email URL Click ──
  const urlParams = new URLSearchParams(window.location.search);
  const autoAction = urlParams.get('auto_action');
  if (autoAction && (autoAction === 'accept' || autoAction === 'decline')) {
    const ref = urlParams.get('ref') || 'VIP Booking';
    const email = urlParams.get('email');

    if (email) {
      const autoBooking = {
        refCode: ref,
        email: email
      };
      setTimeout(() => {
        sendAutomaticDecisionEmail(autoBooking, autoAction);
        openOwnerPortal();
      }, 400);

      // Clean the query parameters from URL bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  // ── Reply Composer Helper Functions ──
  function generateReplyTemplate(type, booking) {
    if (!booking) return { subject: '', body: '' };
    if (type === 'accept') {
      return {
        subject: `VIP Booking APPROVED: Aurora & Co. [${booking.refCode}]`,
        body: `Dear ${booking.fullName},\n\nWe are delighted to inform you that your VIP booking dossier (${booking.refCode}) for ${booking.eventType} on ${booking.eventDate} has been OFFICIALLY ACCEPTED by Aurora & Co.\n\nOur Executive Producer Julian Vance is currently coordinating your private event atelier consultation.\n\nWarm regards,\nPranita Pawar\nAurora & Co. Executive Atelier\nEmail: ${OWNER_EMAIL}`
      };
    } else if (type === 'decline') {
      return {
        subject: `Booking Update: Aurora & Co. [${booking.refCode}]`,
        body: `Dear ${booking.fullName},\n\nThank you for considering Aurora & Co. for your upcoming ${booking.eventType}.\n\nRegarding your booking inquiry (${booking.refCode}) for ${booking.eventDate}, our production calendar is currently at maximum capacity for this date, and we are unable to accept new commissions.\n\nWe warmly invite you to explore alternative dates with our atelier.\n\nWarm regards,\nPranita Pawar\nAurora & Co. Executive Atelier\nEmail: ${OWNER_EMAIL}`
      };
    } else {
      return {
        subject: `Private Consultation Scheduling: Aurora & Co. [${booking.refCode}]`,
        body: `Dear ${booking.fullName},\n\nThank you for your VIP booking inquiry (${booking.refCode}) regarding your upcoming ${booking.eventType}.\n\nWe would love to schedule a dedicated 30-minute private consultation (Virtual or In-Atelier) to review your event vision, guest experience architecture, and investment scope.\n\nPlease reply with your preferred days and time slots this week.\n\nWarm regards,\nPranita Pawar\nAurora & Co. Executive Atelier\nEmail: ${OWNER_EMAIL}`
      };
    }
  }

  function openReplyComposer(booking, initialType = 'accept') {
    if (!replyModal) return;
    activeReplyBooking = booking;

    if (replyModalTitle) {
      replyModalTitle.textContent = initialType === 'accept' ? 'Accept & Email Client' : initialType === 'decline' ? 'Decline & Email Client' : 'Executive Client Dispatch';
    }

    if (replyClientInfo) {
      replyClientInfo.innerHTML = `
        Recipient: <strong style="color:var(--text-pure);">${booking.fullName}</strong> &bull; 
        Email: <a href="mailto:${booking.email}" style="color:var(--gold-400); text-decoration:underline;">${booking.email}</a> &bull;
        Dossier: <span style="color:var(--gold-300); font-weight:700;">${booking.refCode}</span>
      `;
    }

    const tpl = generateReplyTemplate(initialType, booking);
    if (replySubjectInput) replySubjectInput.value = tpl.subject;
    if (replyBodyInput) replyBodyInput.value = tpl.body;

    replyModal.classList.add('open');
  }

  function closeReplyComposer() {
    if (replyModal) replyModal.classList.remove('open');
  }

  if (replyModalClose) replyModalClose.addEventListener('click', closeReplyComposer);

  // Template switchers
  if (replyTemplateAccept) {
    replyTemplateAccept.addEventListener('click', () => {
      if (activeReplyBooking) {
        const tpl = generateReplyTemplate('accept', activeReplyBooking);
        if (replySubjectInput) replySubjectInput.value = tpl.subject;
        if (replyBodyInput) replyBodyInput.value = tpl.body;
      }
    });
  }

  if (replyTemplateDecline) {
    replyTemplateDecline.addEventListener('click', () => {
      if (activeReplyBooking) {
        const tpl = generateReplyTemplate('decline', activeReplyBooking);
        if (replySubjectInput) replySubjectInput.value = tpl.subject;
        if (replyBodyInput) replyBodyInput.value = tpl.body;
      }
    });
  }

  if (replyTemplateConsult) {
    replyTemplateConsult.addEventListener('click', () => {
      if (activeReplyBooking) {
        const tpl = generateReplyTemplate('consult', activeReplyBooking);
        if (replySubjectInput) replySubjectInput.value = tpl.subject;
        if (replyBodyInput) replyBodyInput.value = tpl.body;
      }
    });
  }

  // 1-Click Gmail Web Composer
  if (btnReplyGmail) {
    btnReplyGmail.addEventListener('click', () => {
      if (!activeReplyBooking) return;
      const to = encodeURIComponent(activeReplyBooking.email);
      const su = encodeURIComponent(replySubjectInput ? replySubjectInput.value : '');
      const body = encodeURIComponent(replyBodyInput ? replyBodyInput.value : '');
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`;
      window.open(gmailUrl, '_blank');
      showToast("Opening Gmail composer in new tab...", "success");
    });
  }

  // Default Mail App Dispatch
  if (btnReplyMailto) {
    btnReplyMailto.addEventListener('click', () => {
      if (!activeReplyBooking) return;
      const to = activeReplyBooking.email;
      const su = encodeURIComponent(replySubjectInput ? replySubjectInput.value : '');
      const body = encodeURIComponent(replyBodyInput ? replyBodyInput.value : '');
      const mailtoUrl = `mailto:${to}?subject=${su}&body=${body}`;
      
      const link = document.createElement('a');
      link.href = mailtoUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Opening default mail app...", "info");
    });
  }

  // Copy Formatted Reply to Clipboard
  if (btnReplyCopy) {
    btnReplyCopy.addEventListener('click', () => {
      if (!activeReplyBooking) return;
      const recipient = activeReplyBooking.email;
      const subject = replySubjectInput ? replySubjectInput.value : '';
      const body = replyBodyInput ? replyBodyInput.value : '';
      const fullContent = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullContent).then(() => {
          showToast("Email reply copied to clipboard!", "success");
        }).catch(() => {
          showToast("Copied to clipboard!", "info");
        });
      } else {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = fullContent;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
        showToast("Email reply copied to clipboard!", "success");
      }
    });
  }

  // Open Owner Portal
  function openOwnerPortal() {
    if (!ownerModal) return;
    renderOwnerPortal();
    ownerModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Close Owner Portal
  function closeOwnerPortal() {
    if (!ownerModal) return;
    ownerModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (ownerPortalBtn) ownerPortalBtn.addEventListener('click', openOwnerPortal);
  if (ownerPortalFooterBtn) ownerPortalFooterBtn.addEventListener('click', openOwnerPortal);
  if (ownerModalClose) ownerModalClose.addEventListener('click', closeOwnerPortal);

  // Clear All Bookings
  if (ownerClearBtn) {
    ownerClearBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear all booking records?")) {
        localStorage.removeItem(STORAGE_KEY);
        renderOwnerPortal();
        showToast("All booking records cleared.", "info");
      }
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
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: rgba(16, 20, 29, 0.96);
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
  window.openOwnerPortalModal = openOwnerPortal;
});
