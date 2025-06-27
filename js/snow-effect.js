// Snow Effect Module
'use strict';
class SnowEffect {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'snow-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.resize();
    this.sizeMultiplier = this.getSizeMultiplier();
    window.addEventListener('resize', () => this.resize());

    this.flakes = [];
    // Snow density based on screen width
    this.flakeCount = Math.floor(window.innerWidth / 8); // Less dense than rain
    for (let i = 0; i < this.flakeCount; i++) {
      this.flakes.push(this.createFlake(true));
    }

    this.handleMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.handleMouseMove(e.touches[0]);
      }
    }, { passive: true });

    // Wind variables for gentle drift
    this.wind = 0;
    this.windTarget = 0;
    this.lastWindChange = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.sizeMultiplier = this.getSizeMultiplier();
  }

  getSizeMultiplier() {
    const ratio = window.innerWidth / 768;
    return Math.min(Math.max(ratio, 0.6), 1.2);
  }

  createFlake(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -20,
      size: (2 + Math.random() * 6) * this.sizeMultiplier, // Responsive snowflake size
      speed: 0.5 + Math.random() * 1.5, // Slower than rain
      opacity: 0.4 + Math.random() * 0.6, // More visible than rain
      drift: Math.random() * 0.5 - 0.25, // Side-to-side motion
      rotationSpeed: (Math.random() - 0.5) * 2, // Rotation for realism
      rotation: 0
    };
  }

  handleMouseMove(e) {
    const centerX = window.innerWidth / 2;
    const normalized = (e.clientX - centerX) / centerX;
    this.windTarget = normalized * 0.5;
  }

  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update wind every few seconds (gentler than rain)
    const now = performance.now();
    if (now - this.lastWindChange > 4000) {
      this.windTarget = (Math.random() * 2 - 1) * 0.5; // Gentle wind
      this.lastWindChange = now;
    }
    // Ease current wind toward target
    this.wind += (this.windTarget - this.wind) * 0.01;

    for (const flake of this.flakes) {
      ctx.globalAlpha = flake.opacity;
      
      // White snow with slight blue tint
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      
      ctx.save();
      ctx.translate(flake.x, flake.y);
      ctx.rotate(flake.rotation);
      
      // Draw snowflake as a simple circle or star shape
      if (flake.size > 4) {
        // Larger flakes get a star shape
        this.drawStar(ctx, 0, 0, flake.size / 2, flake.size / 4, 6);
      } else {
        // Smaller flakes are simple circles
        ctx.beginPath();
        ctx.arc(0, 0, flake.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();

      // Update flake position
      flake.x += this.wind + flake.drift;
      flake.y += flake.speed;
      flake.rotation += flake.rotationSpeed * 0.02;

      // Wrap around horizontally
      if (flake.x < -20) flake.x = this.canvas.width + 20;
      if (flake.x > this.canvas.width + 20) flake.x = -20;

      // Reset flake when it falls below viewport
      if (flake.y > this.canvas.height + 20) {
        Object.assign(flake, this.createFlake());
      }
    }

    requestAnimationFrame(this.animate);
  }

  // Draw a simple star shape for larger snowflakes
  drawStar(ctx, cx, cy, outerRadius, innerRadius, spikes) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}

// Snow effect functions
let snowEffect;
function enableSnow() {
  if (!snowEffect) {
    snowEffect = new SnowEffect();
    window.snowEffect = snowEffect;
  } else {
    snowEffect.canvas.style.display = '';
  }
}

function disableSnow() {
  if (snowEffect) {
    snowEffect.canvas.style.display = 'none';
  }
}

// Add CSS for snow canvas
const snowCSS = `
.snow-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.8;
}
`;

// Inject CSS
const snowStyle = document.createElement('style');
snowStyle.textContent = snowCSS;
document.head.appendChild(snowStyle);

// Make functions globally available
window.enableSnow = enableSnow;
window.disableSnow = disableSnow;

export { SnowEffect, enableSnow, disableSnow };