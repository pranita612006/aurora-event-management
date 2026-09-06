/* ==========================================================================
   AURORA & CO. - VIP CONCIERGE & CHATBOT ASSISTANT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('concierge-toggle-btn');
  const drawer = document.getElementById('concierge-drawer');
  const closeBtn = document.getElementById('concierge-close-btn');
  const messagesArea = document.getElementById('concierge-messages');
  const chatInput = document.getElementById('concierge-input');
  const sendBtn = document.getElementById('concierge-send-btn');
  const quickChips = document.querySelectorAll('.quick-chip-btn');

  if (!toggleBtn || !drawer) return;

  // Toggle Concierge
  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    if (drawer.classList.contains('open') && messagesArea.children.length === 0) {
      sendBotMessage("Greetings. I am Julian, your Aurora & Co. Private Concierge. How may I assist in orchestrating your upcoming masterpiece?");
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  // Quick Action Chips
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.dataset.query || chip.textContent.trim();
      handleUserMessage(query);
    });
  });

  // Sending message
  function handleUserMessage(text) {
    if (!text.trim()) return;

    // Append User Bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = text;
    messagesArea.appendChild(userBubble);
    messagesArea.scrollTop = messagesArea.scrollHeight;

    if (chatInput) chatInput.value = '';

    // Generate Concierge Response
    setTimeout(() => {
      const response = generateConciergeReply(text.toLowerCase());
      sendBotMessage(response);
    }, 700);
  }

  function sendBotMessage(text) {
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot';
    botBubble.innerHTML = text;
    messagesArea.appendChild(botBubble);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function generateConciergeReply(query) {
    const lower = query.toLowerCase();
    if (lower.includes('price') || lower.includes('cost') || lower.includes('budget') || lower.includes('package') || lower.includes('retainer') || lower.includes('rs') || lower.includes('rupee')) {
      return "Our bespoke productions typically range from <strong>₹25,00,000</strong> for The Sovereign to <strong>₹65,00,000+</strong> for The Celestial and custom tiers for royal galas. Would you like to use our <a href='#estimator' style='color:var(--gold-400); text-decoration:underline;' onclick='document.getElementById(\"concierge-drawer\").classList.remove(\"open\")'>Live Budget Estimator</a>?";
    } else if (query.includes('wedding') || query.includes('destination') || query.includes('lake como')) {
      return "We specialize in transcendent destination nuptials across Lake Como, French châteaux, and Santorini cliffs. We manage private aviation, Michelin dining, floral architecture, and 3-day guest itineraries. Shall we reserve a consultation date for you in our <a href='#contact' style='color:var(--gold-400); text-decoration:underline;' onclick='document.getElementById(\"concierge-drawer\").classList.remove(\"open\")'>Booking Atelier</a>?";
    } else if (query.includes('corporate') || query.includes('summit') || query.includes('gala')) {
      return "Our executive unit produces world-class summits, 360-degree LED dome galas, and investor conferences for Fortune 500 enterprises with full security protocols and broadcast-grade streaming.";
    } else if (query.includes('nda') || query.includes('privacy') || query.includes('confidential')) {
      return "Discretion is our foundational tenet. Every member of our team operates under ironclad non-disclosure agreements with encrypted communication channels and discreet security escorts.";
    } else if (query.includes('contact') || query.includes('book') || query.includes('consult')) {
      return "You can submit your direct inquiry using our <a href='#contact' style='color:var(--gold-400); text-decoration:underline;' onclick='document.getElementById(\"concierge-drawer\").classList.remove(\"open\")'>VIP Inquiry Form</a> or reach our Manhattan and London executive desks 24/7 at <strong>+1 (800) 892-LUXE</strong>.";
    } else {
      return "Delighted to assist. Our Senior Event Producers can tailor every architectural, acoustic, and culinary nuance for your celebration. Feel free to explore our curated packages or book an appointment below.";
    }
  }

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', () => {
      handleUserMessage(chatInput.value);
    });

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleUserMessage(chatInput.value);
      }
    });
  }
});
