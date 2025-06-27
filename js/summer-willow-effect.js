// Summer Willow Effect Module (青柳エフェクト)
'use strict';
class SummerWillowEffect {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'summer-willow-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.willowLeaves = [];
    // Willow leaf density - more delicate and flowing
    this.leafCount = Math.floor(window.innerWidth / 10); // Moderate density
    for (let i = 0; i < this.leafCount; i++) {
      this.willowLeaves.push(this.createWillowLeaf(true));
    }

    // Wind variables for gentle summer breeze
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

  createWillowLeaf(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -30,
      length: 15 + Math.random() * 25, // Willow leaves are long and narrow
      width: 3 + Math.random() * 4, // Much narrower than other leaves
      speed: 0.6 + Math.random() * 1.0, // Gentle falling speed
      opacity: 0.5 + Math.random() * 0.4, // Subtle visibility
      drift: Math.random() * 0.8 - 0.4, // Side-to-side motion
      rotationSpeed: (Math.random() - 0.5) * 1.5, // Gentle rotation
      rotation: Math.random() * Math.PI * 2,
      swayAmplitude: 30 + Math.random() * 40, // More pronounced sway for willow
      swaySpeed: 0.015 + Math.random() * 0.02, // Slower, more graceful
      swayOffset: Math.random() * Math.PI * 2,
      curvature: 0.1 + Math.random() * 0.3, // Natural curve of willow leaves
      color: this.getWillowColor()
    };
  }

  getWillowColor() {
    // 青柳 - various shades of green with blue tints
    const colors = [
      { r: 50, g: 150, b: 50 },   // 深い緑
      { r: 60, g: 180, b: 60 },   // 明るい緑
      { r: 40, g: 140, b: 80 },   // 青緑
      { r: 70, g: 160, b: 70 },   // 柔らかい緑
      { r: 80, g: 200, b: 80 },   // 新緑
      { r: 45, g: 130, b: 90 },   // 深い青緑
      { r: 90, g: 190, b: 90 }    // 薄い緑
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update wind every few seconds - gentle summer breeze
    const now = performance.now();
    if (now - this.lastWindChange > 4500) {
      this.windTarget = (Math.random() * 2 - 1) * 1.2; // Gentle wind
      this.lastWindChange = now;
    }
    // Ease current wind toward target
    this.wind += (this.windTarget - this.wind) * 0.012;

    for (const leaf of this.willowLeaves) {
      ctx.globalAlpha = leaf.opacity;
      
      const time = now * 0.001; // Convert to seconds
      const swayX = Math.sin(time * leaf.swaySpeed + leaf.swayOffset) * leaf.swayAmplitude;
      
      ctx.save();
      ctx.translate(leaf.x + swayX, leaf.y);
      ctx.rotate(leaf.rotation);
      
      // Set leaf color
      const { r, g, b } = leaf.color;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${leaf.opacity})`;
      ctx.strokeStyle = `rgba(${r - 20}, ${g - 20}, ${b - 10}, ${leaf.opacity * 0.8})`;
      ctx.lineWidth = 0.5;
      
      // Draw willow leaf - long, narrow, and slightly curved
      this.drawWillowLeaf(ctx, 0, 0, leaf.length, leaf.width, leaf.curvature);
      
      ctx.restore();

      // Update leaf position with more graceful movement
      leaf.x += this.wind + leaf.drift;
      leaf.y += leaf.speed;
      leaf.rotation += leaf.rotationSpeed * 0.015; // Slower rotation

      // Wrap around horizontally
      if (leaf.x < -60) leaf.x = this.canvas.width + 60;
      if (leaf.x > this.canvas.width + 60) leaf.x = -60;

      // Reset leaf when it falls below viewport
      if (leaf.y > this.canvas.height + 60) {
        Object.assign(leaf, this.createWillowLeaf());
      }
    }

    requestAnimationFrame(this.animate);
  }

  // Draw a willow leaf shape (青柳の葉)
  drawWillowLeaf(ctx, cx, cy, length, width, curvature) {
    ctx.beginPath();
    
    // Create a curved, elongated leaf shape
    const halfLength = length / 2;
    const halfWidth = width / 2;
    
    // Control points for a curved willow leaf
    ctx.moveTo(cx, cy - halfLength);
    
    // Right side curve
    ctx.quadraticCurveTo(
      cx + halfWidth + curvature * 10, cy - halfLength * 0.3,
      cx + halfWidth, cy
    );
    ctx.quadraticCurveTo(
      cx + halfWidth - curvature * 5, cy + halfLength * 0.3,
      cx, cy + halfLength
    );
    
    // Left side curve
    ctx.quadraticCurveTo(
      cx - halfWidth + curvature * 5, cy + halfLength * 0.3,
      cx - halfWidth, cy
    );
    ctx.quadraticCurveTo(
      cx - halfWidth - curvature * 10, cy - halfLength * 0.3,
      cx, cy - halfLength
    );
    
    ctx.closePath();
    ctx.fill();
    
    // Add a subtle center line for realism
    ctx.beginPath();
    ctx.moveTo(cx, cy - halfLength * 0.8);
    ctx.quadraticCurveTo(
      cx + curvature * 3, cy,
      cx, cy + halfLength * 0.8
    );
    ctx.stroke();
  }
}

// Summer willow effect functions
let summerWillowEffect;
function enableSummerWillow() {
  console.log('[SummerWillowEffect] enableSummerWillow called');
  if (!summerWillowEffect) {
    summerWillowEffect = new SummerWillowEffect();
    window.summerWillowEffect = summerWillowEffect;
  } else {
    summerWillowEffect.canvas.style.display = '';
  }
}

function disableSummerWillow() {
  console.log('[SummerWillowEffect] disableSummerWillow called');
  if (summerWillowEffect) {
    summerWillowEffect.canvas.style.display = 'none';
  }
}

// Add CSS for summer willow canvas
const summerWillowCSS = `
.summer-willow-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.85;
}
`;

// Inject CSS
const summerWillowStyle = document.createElement('style');
summerWillowStyle.textContent = summerWillowCSS;
document.head.appendChild(summerWillowStyle);

// Make functions globally available
window.enableSummerWillow = enableSummerWillow;
window.disableSummerWillow = disableSummerWillow;

export { SummerWillowEffect, enableSummerWillow, disableSummerWillow };