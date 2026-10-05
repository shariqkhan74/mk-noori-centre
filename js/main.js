/**
 * MK Noori Centre - 2026 Modern 3D SaaS Travel & Financial Platform
 * Interactive 3D Card Tilt, Counter Animations, Live Currency Converter & Booking Handlers
 */

(function ($) {
  "use strict";

  // 1. Preloader Spinner
  $(window).on('load', function () {
    if ($('#spinner').length > 0) {
      $('#spinner').removeClass('show');
    }
  });
  setTimeout(function () {
    $('#spinner').removeClass('show');
  }, 600);

  // 2. WOW.js Animation Initializer
  if (typeof WOW === 'function') {
    new WOW({
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 60,
      mobile: true,
      live: true
    }).init();
  }

  // 3. Sticky Navbar Blur Effect
  $(window).scroll(function () {
    if ($(this).scrollTop() > 25) {
      $('.navbar').addClass('sticky-top');
    } else {
      $('.navbar').removeClass('sticky-top');
    }
  });

  // Mobile Navbar Auto-Close & Hamburger State Synchronization
  $(document).on('show.bs.collapse', '#navbarCollapse', function () {
    $('.custom-hamburger').attr('aria-expanded', 'true');
  });

  $(document).on('hide.bs.collapse', '#navbarCollapse', function () {
    $('.custom-hamburger').attr('aria-expanded', 'false');
  });

  $(document).on('click', '.navbar-nav .nav-link', function () {
    if ($(window).width() < 992) {
      $('#navbarCollapse').collapse('hide');
    }
  });

  $(document).on('click', function (e) {
    if ($(window).width() < 992) {
      const isNavbar = $(e.target).closest('.navbar').length > 0;
      if (!isNavbar && $('#navbarCollapse').hasClass('show')) {
        $('#navbarCollapse').collapse('hide');
      }
    }
  });

  // 4. Back to Top Button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.back-to-top').addClass('show');
    } else {
      $('.back-to-top').removeClass('show');
    }
  });

  $('.back-to-top').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 800, 'swing');
    return false;
  });

  // 5. 3D Card Mouse Tilt Effect (Subtle, GPU-accelerated & Smooth)
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isReducedMotion && !isTouchDevice) {
    const tiltElements = document.querySelectorAll('.tilt-3d, .service-card-3d, .hero-card-main, .kpi-card');

    tiltElements.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7; // max 7 deg tilt
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // 6. SaaS KPI Metric Counter Animation
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseFloat(target.getAttribute('data-count'));
          const isDecimal = countTo % 1 !== 0;
          const duration = 1800;
          const frameDuration = 1000 / 60;
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;

          const counterInterval = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentCount = countTo * progress;

            if (isDecimal) {
              target.innerText = currentCount.toFixed(1);
            } else {
              target.innerText = Math.floor(currentCount).toLocaleString();
            }

            if (frame === totalFrames) {
              clearInterval(counterInterval);
              if (isDecimal) {
                target.innerText = countTo.toFixed(1);
              } else {
                target.innerText = countTo.toLocaleString();
              }
            }
          }, frameDuration);

          observer.unobserve(target);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  // 7. Interactive Hero Tab Switcher
  $(document).on('click', '.widget-tab-btn', function () {
    const targetTab = $(this).data('tab');
    $('.widget-tab-btn').removeClass('active');
    $(this).addClass('active');

    $('.tab-pane-content').removeClass('active');
    $('#' + targetTab).addClass('active');
  });

  // 8. Live Interactive Currency Converter Logic
  const exchangeRates = {
    USD: 86.40,
    EUR: 93.20,
    GBP: 111.50,
    AED: 23.52,
    SAR: 23.04,
    AUD: 56.80,
    CAD: 62.40,
    KWD: 281.50
  };

  function updateCurrencyCalc() {
    const amount = parseFloat($('#calc-amount').val()) || 0;
    const currency = $('#calc-currency').val() || 'USD';
    const rate = exchangeRates[currency] || 86.40;
    const totalINR = (amount * rate).toFixed(2);

    $('#calc-rate-display').text(`1 ${currency} ≈ ₹${rate.toFixed(2)} INR`);
    $('#calc-result').text(`₹ ${parseFloat(totalINR).toLocaleString('en-IN')}`);
  }

  $(document).on('input change', '#calc-amount, #calc-currency', updateCurrencyCalc);
  if ($('#calc-amount').length > 0) {
    updateCurrencyCalc();
  }

  // Quick Currency Booking via WhatsApp
  $(document).on('click', '#btn-lock-rate', function (e) {
    e.preventDefault();
    const amount = $('#calc-amount').val() || '1000';
    const currency = $('#calc-currency').val() || 'USD';
    const rate = exchangeRates[currency] || 86.40;
    const totalINR = (amount * rate).toFixed(2);

    const msg = `Hello MK Noori Centre,%0A%0AI want to exchange currency:%0A- Currency: ${amount} ${currency}%0A- Approx Total: ₹${totalINR} INR%0A- Please share current best rate and branch availability.`;
    window.open(`https://wa.me/919860687254?text=${msg}`, '_blank');
  });

  // 9. Quick Booking Widget WhatsApp Handlers
  window.bookTourPackage = function (e) {
    if (e) e.preventDefault();
    const destination = $('#hero-tour-dest').val() || 'Goa Tour';
    const guests = $('#hero-tour-guests').val() || '2 Persons';
    const travelDate = $('#hero-tour-date').val() || 'Flexible';

    const msg = `Hello MK Noori Centre,%0A%0AI want to book a Tour Package:%0A- Destination: ${destination}%0A- Guests: ${guests}%0A- Date: ${travelDate}%0A- Please provide package quotation & itinerary.`;
    window.open(`https://wa.me/919860687254?text=${msg}`, '_blank');
  };

  window.bookFlightTrain = function (e) {
    if (e) e.preventDefault();
    const mode = $('#hero-transport-type').val() || 'Flight';
    const fromCity = $('#hero-from-city').val() || 'Goa';
    const toCity = $('#hero-to-city').val() || 'Mumbai';
    const date = $('#hero-travel-date').val() || 'Upcoming';

    const msg = `Hello MK Noori Centre,%0A%0AI need ticket booking:%0A- Mode: ${mode}%0A- From: ${fromCity}%0A- To: ${toCity}%0A- Date: ${date}%0A- Please check seat availability & ticket pricing.`;
    window.open(`https://wa.me/919860687254?text=${msg}`, '_blank');
  };

  window.sendTransferInquiry = function (e) {
    if (e) e.preventDefault();
    const type = $('#hero-transfer-type').val() || 'Domestic Transfer';
    const amount = $('#hero-transfer-amount').val() || '50,000';

    const msg = `Hello MK Noori Centre,%0A%0AI want to inquire about Money Transfer service:%0A- Transfer Type: ${type}%0A- Estimated Amount: ₹${amount}%0A- Please assist with secure transfer process.`;
    window.open(`https://wa.me/919860687254?text=${msg}`, '_blank');
  };

  // 10. Main Contact Form WhatsApp Sender (Preserved & Enhanced)
  window.sendMessage = function (e) {
    if (e) e.preventDefault();

    const name = document.getElementById("name") ? document.getElementById("name").value.trim() : "";
    const email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";
    const serviceType = document.getElementById("service-type") ? document.getElementById("service-type").value : "General Inquiry";
    const subject = document.getElementById("subject") ? document.getElementById("subject").value.trim() : "Travel & Financial Inquiry";
    const message = document.getElementById("message") ? document.getElementById("message").value.trim() : "";

    if (!name || !message) {
      alert("Please enter your name and message.");
      return;
    }

    const fullMessage =
      "⭐ *New Inquiry - MK Noori Centre Web Portal* ⭐%0A" +
      "------------------------------------------%0A" +
      "👤 *Name:* " + encodeURIComponent(name) + "%0A" +
      "📧 *Email:* " + encodeURIComponent(email || "Not Provided") + "%0A" +
      "📌 *Service:* " + encodeURIComponent(serviceType) + "%0A" +
      "📝 *Subject:* " + encodeURIComponent(subject) + "%0A" +
      "💬 *Message:* " + encodeURIComponent(message);

    const phone = "919860687254";
    window.open("https://wa.me/" + phone + "?text=" + fullMessage, "_blank");
  };

})(jQuery);
