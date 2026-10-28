
/* =========================================
   PIYUSH & KRIPANSHA
   Wedding Invitation Interactions
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const opening = document.getElementById("opening");
  const mainContent = document.getElementById("mainContent");
  const enterButton = document.getElementById("enterButton");
  const backToTop = document.getElementById("backToTop");

  let invitationOpened = false;


  /* =======================================
     OPEN THE INVITATION
  ======================================= */

  enterButton.addEventListener("click", () => {

    if (invitationOpened) return;

    invitationOpened = true;

    // Reveal the full invitation
    mainContent.classList.add("is-visible");

    // Animate the opening screen away
    opening.classList.add("is-opening");

    // Allow the opening animation to finish
    window.setTimeout(() => {
      opening.style.display = "none";

      // Begin at the welcome section
      document.getElementById("welcome").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 1000);

  });


  /* =======================================
     COUNTDOWN TIMER
     Wedding: 4 December 2026, 7 PM
  ======================================= */

  const weddingDate = new Date(2026, 11, 4, 19, 0, 0);

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  const countdownElements = [
    daysElement,
    hoursElement,
    minutesElement,
    secondsElement
  ];

  function updateCountdown() {

    const now = new Date().getTime();
    const difference = weddingDate.getTime() - now;

    if (difference <= 0) {

      countdownElements.forEach((element) => {
        element.textContent = "00";
      });

      document.querySelector(".countdown-date").textContent =
        difference < 0
          ? "The celebration has begun!"
          : "The celebration begins now!";

      return;
    }

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
      (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
      (difference / 1000) % 60
    );

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");

  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);


  /* =======================================
     SCROLL REVEAL ANIMATIONS
  ======================================= */

  const revealSections = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-visible");

            // Reveal each section only once
            currentObserver.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealSections.forEach((section) => {
      observer.observe(section);
    });

  } else {

    // Fallback for older browsers
    revealSections.forEach((section) => {
      section.classList.add("is-visible");
    });

  }


  /* =======================================
     BACK TO TOP
  ======================================= */

  backToTop.addEventListener("click", () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

});

/* ======================================
   SCRATCH TO REVEAL WEDDING DETAILS
====================================== */

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("scratchCanvas");
  const card = document.getElementById("scratchCard");

  if (!canvas || !card) return;

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true
  });

  if (!ctx) return;

  let scratching = false;
  let revealed = false;
  let lastCheck = 0;

  function paintScratchLayer() {
    const rect = card.getBoundingClientRect();

    if (!rect.width || !rect.height || revealed) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Rich maroon scratch surface
    const gradient = ctx.createLinearGradient(
      0, 0, rect.width, rect.height
    );

    gradient.addColorStop(0, "#401421");
    gradient.addColorStop(0.5, "#692b3b");
    gradient.addColorStop(1, "#35101b");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Fine antique-gold inner border
    ctx.strokeStyle = "rgba(221, 199, 151, 0.8)";
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, rect.width - 24, rect.height - 24);

    // Scratch instructions
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ddc797";
    ctx.font = "600 9px Arial";
    ctx.fillText(
      "A LITTLE SURPRISE FOR YOU",
      rect.width / 2,
      rect.height / 2 - 35
    );

    ctx.fillStyle = "#fff8ed";
    ctx.font = "italic 29px Georgia";
    ctx.fillText(
      "Scratch to reveal",
      rect.width / 2,
      rect.height / 2 + 1
    );

    ctx.fillStyle = "#ddc797";
    ctx.font = "10px Arial";
    ctx.fillText(
      "✧  YOUR WEDDING DETAILS  ✧",
      rect.width / 2,
      rect.height / 2 + 34
    );

    ctx.globalCompositeOperation = "destination-out";
  }

  function getPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function scratchAt(x, y) {
    if (revealed) return;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function checkReveal() {
    if (revealed) return;

    const pixels = ctx.getImageData(
      0, 0, canvas.width, canvas.height
    ).data;

    // Sample every 20th pixel for performance
    let transparent = 0;
    let total = 0;

    for (let i = 3; i < pixels.length; i += 80) {
      total++;

      if (pixels[i] < 100) {
        transparent++;
      }
    }

    // Reveal when roughly 40% of the surface is scratched
    if (total > 0 && transparent / total > 0.40) {
      revealed = true;
      canvas.classList.add("is-revealed");
    }
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (revealed) return;

    scratching = true;
    canvas.setPointerCapture(event.pointerId);

    const point = getPosition(event);
    scratchAt(point.x, point.y);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!scratching || revealed) return;

    const point = getPosition(event);
    scratchAt(point.x, point.y);

    const now = performance.now();

    if (now - lastCheck > 150) {
      lastCheck = now;
      checkReveal();
    }
  });

  function stopScratching() {
    if (!scratching) return;

    scratching = false;
    checkReveal();
  }

  canvas.addEventListener("pointerup", stopScratching);
  canvas.addEventListener("pointercancel", stopScratching);
  canvas.addEventListener("lostpointercapture", stopScratching);

  paintScratchLayer();

  // Repaint if the page changes size before scratching
  window.addEventListener("resize", () => {
    if (!revealed) paintScratchLayer();
  });
});

/* ======================================
   COUNTDOWN SCRATCH TO REVEAL
====================================== */

(() => {
  const canvas = document.getElementById("countdownScratchCanvas");
  const wrapper = document.getElementById("countdownScratch");

  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true
  });

  if (!ctx) return;

  let isScratching = false;
  let isRevealed = false;
  let lastCheck = 0;

  function drawCover() {
    if (isRevealed) return;

    const rect = wrapper.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const gradient = ctx.createLinearGradient(
      0, 0, rect.width, rect.height
    );

    gradient.addColorStop(0, "#3b101e");
    gradient.addColorStop(0.5, "#702d40");
    gradient.addColorStop(1, "#421522");

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Fine antique-gold border
    ctx.strokeStyle = "#c8a76b";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      8, 8, rect.width - 16, rect.height - 16
    );

    // Instructions on the scratch surface
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ddc797";
    ctx.font = "600 9px Arial";
    ctx.fillText(
      "A LITTLE SURPRISE",
      rect.width / 2,
      rect.height / 2 - 15
    );

    ctx.fillStyle = "#fff8ed";
    ctx.font = "italic 20px Georgia";
    ctx.fillText(
      "Scratch to reveal",
      rect.width / 2,
      rect.height / 2 + 12
    );

    ctx.globalCompositeOperation = "destination-out";
  }

  function scratch(event) {
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function checkReveal() {
    if (isRevealed) return;

    const pixels = ctx.getImageData(
      0, 0, canvas.width, canvas.height
    ).data;

    let transparent = 0;
    let total = 0;

    // Sample pixels for faster checking
    for (let i = 3; i < pixels.length; i += 80) {
      total++;

      if (pixels[i] < 100) {
        transparent++;
      }
    }

    if (total && transparent / total > 0.40) {
      isRevealed = true;
      canvas.classList.add("is-revealed");
    }
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (isRevealed) return;

    isScratching = true;
    canvas.setPointerCapture(event.pointerId);
    scratch(event);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!isScratching || isRevealed) return;

    scratch(event);

    const now = performance.now();

    if (now - lastCheck > 150) {
      lastCheck = now;
      checkReveal();
    }
  });

  function stopScratching() {
    if (!isScratching) return;

    isScratching = false;
    checkReveal();
  }

  canvas.addEventListener("pointerup", stopScratching);
  canvas.addEventListener("pointercancel", stopScratching);

  drawCover();

  window.addEventListener("resize", () => {
    if (!isRevealed) drawCover();
  });
})();

/* ==========================================
   PIYUSH & KRIPANSHA — GOLDEN DUST EFFECT
========================================== */

(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.id = "goldenGlitterCanvas";
  canvas.setAttribute("aria-hidden", "true");

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  let width = 0;
  let height = 0;
  let particles = [];
  let animationId;

  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  const particleCount = isMobile ? 28 : 55;

  const goldColors = [
    "rgba(218, 180, 100, 0.65)",
    "rgba(255, 225, 160, 0.8)",
    "rgba(185, 139, 58, 0.55)",
    "rgba(255, 245, 215, 0.75)"
  ];

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = Array.from(
      { length: particleCount },
      () => createParticle(true)
    );
  }

  function createParticle(randomY = false) {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 5,
      radius: Math.random() * 1.5 + 0.4,
      speedY: Math.random() * 0.22 + 0.06,
      speedX: (Math.random() - 0.5) * 0.18,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.018 + 0.006,
      color: goldColors[
        Math.floor(Math.random() * goldColors.length)
      ]
    };
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const time = performance.now() * 0.001;

    particles.forEach((p) => {
      p.x += p.speedX + Math.sin(time + p.phase) * 0.12;
      p.y -= p.speedY;
      p.phase += p.twinkleSpeed;

      if (p.y < -5 || p.x < -5 || p.x > width + 5) {
        Object.assign(p, createParticle(false));
      }

      const twinkle = 0.35 + (
        (Math.sin(p.phase) + 1) / 2
      ) * 0.65;

      ctx.globalAlpha = twinkle;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Occasional delicate four-point sparkle
      if (twinkle > 0.85 && p.radius > 1.3) {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.moveTo(p.x - 3, p.y);
        ctx.lineTo(p.x + 3, p.y);
        ctx.moveTo(p.x, p.y - 3);
        ctx.lineTo(p.x, p.y + 3);
        ctx.stroke();
      }
    });

    ctx.globalAlpha = 1;
    animationId = requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();

  window.addEventListener("resize", resizeCanvas);

  // Pause the animation when the tab is not visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      cancelAnimationFrame(animationId);
      animate();
    }
  });
})();

/* ==========================================
   MAGICAL GOLD SCRATCH EFFECT
========================================== */

(() => {
  const wrapper = document.getElementById("countdownScratch");
  const scratchCanvas = document.getElementById("countdownScratchCanvas");

  if (!wrapper || !scratchCanvas) return;

  const glowCanvas = document.createElement("canvas");
  glowCanvas.id = "scratchGlowCanvas";
  wrapper.appendChild(glowCanvas);

  const ctx = glowCanvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let frameId = null;
  let active = true;

  function resize() {
    const rect = wrapper.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = rect.width;
    height = rect.height;

    glowCanvas.width = Math.round(width * dpr);
    glowCanvas.height = Math.round(height * dpr);
    glowCanvas.style.width = width + "px";
    glowCanvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function addSparkles(x, y) {
    // Small burst of champagne-gold particles
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.1 + 0.3;

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: Math.random() * 2 + 0.7
      });
    }

    // Keep the effect lightweight on mobile
    if (particles.length > 100) {
      particles.splice(0, particles.length - 100);
    }
  }

  wrapper.addEventListener("pointermove", (event) => {
    if (!active || scratchCanvas.classList.contains("is-revealed")) {
      return;
    }

    const rect = wrapper.getBoundingClientRect();

    addSparkles(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
  });

  function animate() {
    if (!active) return;

    ctx.clearRect(0, 0, width, height);

    particles = particles.filter(p => p.life > 0.04);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.012;
      p.life *= 0.94;

      // Soft golden glow
      ctx.save();
      ctx.globalAlpha = p.life * 0.75;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#e5bd70";
      ctx.fillStyle = "#f5d995";

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Tiny cross-shaped sparkle
      ctx.globalAlpha = p.life;
      ctx.strokeStyle = "#fff1c7";
      ctx.lineWidth = 0.7;

      ctx.beginPath();
      ctx.moveTo(p.x - 3, p.y);
      ctx.lineTo(p.x + 3, p.y);
      ctx.moveTo(p.x, p.y - 3);
      ctx.lineTo(p.x, p.y + 3);
      ctx.stroke();

      ctx.restore();
    });

    // Hide the sparkle canvas once the scratch is complete
    if (scratchCanvas.classList.contains("is-revealed")) {
      particles = [];
      ctx.clearRect(0, 0, width, height);
      active = false;
      return;
    }

    frameId = requestAnimationFrame(animate);
  }

  resize();
  animate();

  window.addEventListener("resize", resize);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
    } else if (active) {
      cancelAnimationFrame(frameId);
      animate();
    }
  });
})();
