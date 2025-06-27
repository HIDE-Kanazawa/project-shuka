// Rain Effect Module
'use strict';
class RainEffect {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'rain-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.drops = [];
    // Increase rain density for more immersive tsuyu effect
    this.dropCount = Math.floor(window.innerWidth / 2.5); // More dense rain
    for (let i = 0; i < this.dropCount; i++) {
      this.drops.push(this.createDrop(true));
    }

    this.handleMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.handleMouseMove(e.touches[0]);
      }
    }, { passive: true });

    // Wind variables
    this.wind = 0;
    this.windTarget = 0;
    this.lastWindChange = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createDrop(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -20,
      length: 15 + Math.random() * 25, // Longer raindrops for tsuyu
      speed: 3 + Math.random() * 5, // Varied speed for more natural feel
      opacity: 0.3 + Math.random() * 0.4, // Slightly more visible
      thickness: 0.8 + Math.random() * 0.7 // Variable thickness
    };
  }

  handleMouseMove(e) {
    const centerX = window.innerWidth / 2;
    const normalized = (e.clientX - centerX) / centerX;
    this.windTarget = normalized * 2;
  }

  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.lineCap = 'round';

    // Update wind every few seconds
    const now = performance.now();
    if (now - this.lastWindChange > 3000) {
      this.windTarget = (Math.random() * 2 - 1) * 2; // Stronger wind for tsuyu
      this.lastWindChange = now;
    }
    // Ease current wind toward target for smoother gusts
    this.wind += (this.windTarget - this.wind) * 0.015;

    for (const d of this.drops) {
      ctx.globalAlpha = d.opacity;
      ctx.lineWidth = d.thickness;
      
      // Bluish-white rain for tsuyu atmosphere
      ctx.strokeStyle = `rgba(200, 220, 255, ${d.opacity})`;
      
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + this.wind * 3, d.y + d.length); // More pronounced slant
      ctx.stroke();

      // Add occasional water splash effect at bottom
      if (d.y > this.canvas.height - 50 && Math.random() < 0.02) {
        ctx.globalAlpha = d.opacity * 0.5;
        ctx.strokeStyle = `rgba(123, 167, 212, ${d.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(d.x, this.canvas.height - 10, 2 + Math.random() * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update drop position
      d.x += this.wind * (d.speed / 4);
      d.y += d.speed;

      // Wrap around horizontally
      if (d.x < -30) d.x = this.canvas.width + 30;
      if (d.x > this.canvas.width + 30) d.x = -30;

      // Reset drop when it falls below viewport
      if (d.y > this.canvas.height + 10) {
        Object.assign(d, this.createDrop());
      }
    }

    requestAnimationFrame(this.animate);
  }
}

// Rain effect will be toggled based on the active season
let rainEffect;
function enableRain() {
  if (!rainEffect) {
    rainEffect = new RainEffect();
    window.rainEffect = rainEffect;
  } else {
    rainEffect.canvas.style.display = '';
  }
}
function disableRain() {
  if (rainEffect) {
    rainEffect.canvas.remove();
    rainEffect = null;
    window.rainEffect = null;
  }
}

/** Handle logo click - scroll to home and set season to tsuyu */
window.handleLogoClick = (event) => {
  event.preventDefault();
  
  // Scroll to home section
  if (typeof scrollToSection === 'function') {
    scrollToSection('home');
  } else {
    // Fallback scroll
    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Set season to tsuyu but keep summer gallery visible
  if (window.seasonsGallery && typeof window.seasonsGallery.switchToSeason === 'function') {
    // Wait a bit for scroll to start, then change season
    setTimeout(() => {
      // Set the current season to tsuyu for rain effects and body attributes
      window.seasonsGallery.currentSeason = 'tsuyu';
      
      // Update body season for styling
      document.body.setAttribute('data-season', 'tsuyu');
      
      // Reset hero background to initial main visual
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('./img/秀歌-メインビジュアル.webp')`;
        hero.style.backgroundPosition = 'left top';
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
          heroContent.style.paddingTop = '';
        }
      }
      
      // Enable rain effect
      if (typeof window.enableRain === 'function') {
        window.enableRain();
      }
      
      // Keep summer gallery panel visible
      window.seasonsGallery.updateSeasonButtons('summer');
      window.seasonsGallery.updateSeasonPanels('summer', false);
      
      // Update URL to reflect tsuyu season
      window.seasonsGallery.updateURL('tsuyu');
    }, 300);
  }
  
  // Close mobile menu if open
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  if (navMenu && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
};

export { RainEffect, enableRain, disableRain, handleLogoClick };
