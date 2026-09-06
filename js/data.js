/* ==========================================================================
   AURORA & CO. - DATA STORE & CONTENT REPOSITORY
   ========================================================================== */

const EVENT_DATA = {
  services: [
    {
      id: "weddings",
      title: "Royal Destination Weddings",
      badge: "Signature Craft",
      icon: "fa-solid fa-crown",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      description: "Bespoke fairy-tale ceremonies in Tuscan villas, French châteaux, and private coastal sanctuaries with haute couture styling.",
      features: [
        "Full-scope concept & architectural floral design",
        "Michelin-tier culinary orchestration & sommelier",
        "Celebrity performance booking & sound engineering",
        "VIP guest concierge, charter logistics & luxury stays"
      ],
      detailText: "From historic royal estates to secluded private archipelagos, our wedding atelier crafts transcendent multi-day celebrations that merge intimate romance with world-class grand luxury."
    },
    {
      id: "corporate",
      title: "High-Profile Corporate Galas",
      badge: "Enterprise Prestige",
      icon: "fa-solid fa-gem",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      description: "Immersive summits, executive award banquets, and visionary shareholder galas designed to redefine industry benchmarks.",
      features: [
        "Next-gen 3D projection mapping & holographic stages",
        "High-security executive handling & discreet protocols",
        "Global livestreaming & broadcast-grade media hubs",
        "Custom keynote speaker staging & artistic interludes"
      ],
      detailText: "We engineer experiences that communicate authority, elevate enterprise prestige, and build deep lasting relationships among global industry titans."
    },
    {
      id: "concerts",
      title: "Symphonic & Elite Concerts",
      badge: "Acoustic Wonder",
      icon: "fa-solid fa-compact-disc",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      description: "Arena-scale stadium productions, private orchestra recitals, and VIP music festivals engineered with acoustic mastery.",
      features: [
        "Dolby Atmos stage acoustic design & intelligent lighting",
        "Pyrotechnics, laser choreography & kinetic rigging",
        "Artist green rooms, security escorts & riders",
        "VIP backstage lounges & champagne receptions"
      ],
      detailText: "Merging cutting-edge audio technology with ethereal stage architecture to create spine-tingling acoustic memories for tens of thousands or an exclusive circle."
    },
    {
      id: "parties",
      title: "Exclusive Private Soirées",
      badge: "Pure Discretion",
      icon: "fa-solid fa-champagne-glasses",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
      description: "Ultra-luxury milestone birthdays, masquerade balls, and private superyacht gatherings curated with utmost privacy.",
      features: [
        "Themed sensory environments & custom scents",
        "Master mixology bars & vintage champagne cellars",
        "International DJ curation & immersive performers",
        "Non-disclosure agreements & encrypted guest registries"
      ],
      detailText: "Tailored for discerning luminaries and royal families, our private parties remain unforgettable celebrations cloaked in absolute elegance."
    },
    {
      id: "launches",
      title: "Luxury Product & Auto Reveals",
      badge: "Futuristic Luxe",
      icon: "fa-solid fa-wand-magic-sparkles",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
      description: "Spectacular automotive unveilings, haute horlogerie showcases, and global luxury product launches that dominate media headlines.",
      features: [
        "Synchronized drone swarm light choreography",
        "Kinetic reveals, motorized lifts & smoke curtains",
        "Global press junkets & influencer experiential zones",
        "Interactive digital showrooms & AR product pods"
      ],
      detailText: "We turn brand moments into cultural phenomena through theatrical storytelling, high-precision engineering, and viral visual spectacles."
    },
    {
      id: "fashion",
      title: "Haute Couture Runway & Galas",
      badge: "Art & Glamour",
      icon: "fa-solid fa-vest-patches",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
      description: "Dramatic fashion week runways, museum charity galas, and art biennial soirees wrapped in avant-garde architectural splendor.",
      features: [
        "Custom catwalk fabrication & mirrored runways",
        "Front-row VIP hospitality & celebrity styling suites",
        "Architectural lighting matrices & mood pacing",
        "Fine art auction coordination & donor lounges"
      ],
      detailText: "Where high fashion meets spatial mastery. Our creative directorship elevates designer visions into unforgettable cultural milestones."
    }
  ],

  portfolio: [
    {
      id: 1,
      category: "weddings",
      title: "The Solstice Palace Nuptials",
      location: "Lake Como, Italy",
      guests: "320 Guests",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      description: "A 3-day imperial celebration featuring 50,000 fresh white orchids, floating water stages, and a private fireworks symphony over the lake."
    },
    {
      id: 2,
      category: "corporate",
      title: "Global Tech Luminary Summit",
      location: "Dubai Opera House",
      guests: "1,800 Delegates",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      description: "A futuristic AI keynote amphitheater featuring a 360-degree LED dome, holographic presenters, and executive black-tie gala dinner."
    },
    {
      id: 3,
      category: "concerts",
      title: "Elysium Classical Symphony Gala",
      location: "Royal Albert Hall, London",
      guests: "4,200 Attendees",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      description: "An acoustic triumph combining 90-piece philharmonic orchestra with dynamic golden laser architecture and live world broadcast."
    },
    {
      id: 4,
      category: "parties",
      title: "The Venetian Gold Masquerade",
      location: "Palazzo Pisani Moretta, Venice",
      guests: "180 VIPs",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
      description: "An opulent 18th-century masked gala with candelabras, operatic secret performances, and private gondola arrivals."
    },
    {
      id: 5,
      category: "launches",
      title: "Hypercar Odyssey World Premiere",
      location: "Monaco Marina Port",
      guests: "450 Press & VIPs",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      description: "A floating helipad reveal backed by 500 synchronized drones drawing constellations and the vehicle silhouette in the night sky."
    },
    {
      id: 6,
      category: "weddings",
      title: "Château de Chantilly Grand Celebration",
      location: "Paris, France",
      guests: "260 Guests",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      description: "A royal French celebration with custom glass pavilions, crystal chandeliers suspended among royal gardens, and Michelin 3-star menu."
    }
  ],

  testimonials: [
    {
      name: "Lord Sterling & Lady Genevieve",
      title: "Lake Como Royal Wedding",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      quote: "Aurora & Co. transformed our wedding into pure magic. Every detail—from the floating glass aisle to the midnight fireworks over Lake Como—was executed with royal precision and effortless grace.",
      rating: 5
    },
    {
      name: "Marcus Vance",
      title: "Chief Executive, Vance Capital Global",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      quote: "Our annual Global Leadership Gala for 2,000 dignitaries was our highest-rated event in company history. Their production standards rival Olympic ceremonies. Exceptional partners.",
      rating: 5
    },
    {
      name: "Elena Rostova",
      title: "Creative Director, Maison de Luxe",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      quote: "Working in haute couture demands perfection. Aurora & Co. not only understood our artistic vision for Paris Fashion Week but amplified it with architectural light and sound that stunned the industry.",
      rating: 5
    },
    {
      name: "H.E. Sheikh Tariq Al Mansoori",
      title: "Private Family Office, Dubai",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      quote: "Utmost confidentiality, refined taste, and seamless execution. The bespoke desert pavilion they erected for our family celebration was an architectural marvel.",
      rating: 5
    }
  ],

  faqs: [
    {
      q: "How far in advance should we engage Aurora & Co. for an event?",
      a: "For large-scale destination weddings, multi-day summits, and arena concerts, we recommend 6 to 14 months in advance. However, our rapid-response bespoke unit can orchestrate high-profile private soirées and product reveals in as little as 4 to 8 weeks."
    },
    {
      q: "Do you manage international destination events?",
      a: "Yes. Over 65% of our portfolio spans international luxury hubs including Lake Como, Paris, Monaco, Dubai, Kyoto, Aspen, St. Moritz, and the Caribbean Islands. We manage all cross-border logistics, visas, permits, and private aviation."
    },
    {
      q: "How do you ensure client privacy and event confidentiality?",
      a: "We maintain strict non-disclosure agreements (NDAs) for our entire crew and subcontractor network. For celebrity and high-net-worth clients, we deploy discreet counter-drone shields, encrypted communications, and private security protocols."
    },
    {
      q: "What is your typical pricing structure and minimum engagement?",
      a: "Our signature packages start with curated production retainers plus transparent management percentages. We customize all line items with zero hidden markups. See our interactive Budget Estimator above to model your vision."
    },
    {
      q: "Can you source exclusive celebrity performers and Michelin-starred chefs?",
      a: "Yes. Our direct relationships with elite talent agencies and Michelin culinary masters allow us to book world-renowned artists, conductors, and private guest chefs exclusively for your evening."
    }
  ],

  packages: [
    {
      id: "sovereign",
      name: "The Sovereign",
      subtitle: "Essential Luxury Excellence",
      price: "₹25,00,000+",
      features: [
        "Full Event Concept & Aesthetic Direction",
        "Dedicated Lead Producer & On-Site Team",
        "Curated 5-Star Venue Selection",
        "Floral & Architectural Lighting Design",
        "Vendor Coordination & Timeline Mastery",
        "Standard Concierge & Guest Services"
      ]
    },
    {
      id: "celestial",
      name: "The Celestial",
      subtitle: "Grand Luxe & High Production",
      price: "₹65,00,000+",
      featured: true,
      features: [
        "Everything in Sovereign tier",
        "Immersive 3D Spatial & Scenic Architecture",
        "Haute Cuisine & Master Mixology Design",
        "Celebrity / Top-Tier Artist Booking",
        "Synchronized Light & Drone Spectacle",
        "Private VIP Aviation & Chauffeur Logistics",
        "4K Cinematic Multi-Cam Film & Teasers"
      ]
    },
    {
      id: "imperial",
      name: "The Imperial",
      subtitle: "Royal Bespoke & Infinite Splendor",
      price: "Custom Bespoke",
      features: [
        "Unlimited Bespoke Concept Architecture",
        "Custom Pavilion / Glasshouse Construction",
        "3-Star Michelin Chef & Sommelier Curation",
        "Global A-List Headline Performers",
        "Military-Grade Privacy & NDA Shielding",
        "Dedicated 24/7 VIP Concierge Atelier",
        "Private Jet Charters & Superyacht Access"
      ]
    }
  ]
};
