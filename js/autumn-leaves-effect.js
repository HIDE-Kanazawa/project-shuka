// Autumn Leaves Effect Module
'use strict';
class AutumnLeavesEffect {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'autumn-leaves-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.leaves = [];
    // Leaf density based on screen width
    this.leafCount = Math.floor(window.innerWidth / 12); // Moderate density
    for (let i = 0; i < this.leafCount; i++) {
      this.leaves.push(this.createLeaf(true));
    }

    this.handleMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.handleMouseMove(e.touches[0]);
      }
    }, { passive: true });

    // Wind variables for natural leaf movement
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

  createLeaf(randomY = false) {
    const leafTypes = ['maple', 'ginkgo']; // もみじとイチョウ
    const type = leafTypes[Math.floor(Math.random() * leafTypes.length)];
    
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -50,
      type: type,
      size: 8 + Math.random() * 16, // Varied leaf sizes
      speed: 0.8 + Math.random() * 1.2, // Natural falling speed
      opacity: 0.6 + Math.random() * 0.4, // More visible
      drift: Math.random() * 1 - 0.5, // Side-to-side motion
      rotationSpeed: (Math.random() - 0.5) * 3, // Spinning motion
      rotation: Math.random() * Math.PI * 2,
      swayAmplitude: 20 + Math.random() * 30, // How much it sways
      swaySpeed: 0.02 + Math.random() * 0.03, // Speed of swaying
      swayOffset: Math.random() * Math.PI * 2, // Phase offset for varied movement
      color: this.getLeafColor(type)
    };
  }

  getLeafColor(type) {
    if (type === 'maple') {
      // もみじの色 - 赤、オレンジ、黄色
      const colors = [
        { r: 220, g: 20, b: 20 },   // 赤
        { r: 255, g: 69, b: 0 },    // オレンジ赤
        { r: 255, g: 140, b: 0 },   // オレンジ
        { r: 255, g: 165, b: 0 },   // 明るいオレンジ
        { r: 255, g: 215, b: 0 }    // 黄色
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      // イチョウの色 - 黄色系
      const colors = [
        { r: 255, g: 215, b: 0 },   // 金色
        { r: 255, g: 223, b: 0 },   // 明るい金色
        { r: 255, g: 255, b: 0 },   // 黄色
        { r: 238, g: 221, b: 130 }, // 薄い黄色
        { r: 255, g: 239, b: 145 }  // クリーム色
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  handleMouseMove(e) {
    const centerX = window.innerWidth / 2;
    const normalized = (e.clientX - centerX) / centerX;
    this.windTarget = normalized * 1.5;
  }

  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update wind every few seconds
    const now = performance.now();
    if (now - this.lastWindChange > 3500) {
      this.windTarget = (Math.random() * 2 - 1) * 1.5; // Moderate wind
      this.lastWindChange = now;
    }
    // Ease current wind toward target
    this.wind += (this.windTarget - this.wind) * 0.015;

    for (const leaf of this.leaves) {
      ctx.globalAlpha = leaf.opacity;
      
      const time = now * 0.001; // Convert to seconds
      const swayX = Math.sin(time * leaf.swaySpeed + leaf.swayOffset) * leaf.swayAmplitude;
      
      ctx.save();
      ctx.translate(leaf.x + swayX, leaf.y);
      ctx.rotate(leaf.rotation);
      
      // Set leaf color
      const { r, g, b } = leaf.color;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${leaf.opacity})`;
      
      // Draw leaf shape based on type
      if (leaf.type === 'maple') {
        this.drawMapleLeaf(ctx, 0, 0, leaf.size);
      } else {
        this.drawGinkgoLeaf(ctx, 0, 0, leaf.size);
      }
      
      ctx.restore();

      // Update leaf position
      leaf.x += this.wind + leaf.drift;
      leaf.y += leaf.speed;
      leaf.rotation += leaf.rotationSpeed * 0.02;

      // Wrap around horizontally
      if (leaf.x < -50) leaf.x = this.canvas.width + 50;
      if (leaf.x > this.canvas.width + 50) leaf.x = -50;

      // Reset leaf when it falls below viewport
      if (leaf.y > this.canvas.height + 50) {
        Object.assign(leaf, this.createLeaf());
      }
    }

    requestAnimationFrame(this.animate);
  }

  // Draw a maple leaf shape (もみじ)
  drawMapleLeaf(ctx, cx, cy, size) {
    const scale = size / 20;
    
    ctx.beginPath();

    // Stylized maple leaf using curves for a softer shape
    ctx.moveTo(cx, cy - 10 * scale);
    ctx.bezierCurveTo(
      cx - 2 * scale, cy - 12 * scale,
      cx - 8 * scale, cy - 8 * scale,
      cx - 4 * scale, cy - 4 * scale
    );
    ctx.bezierCurveTo(
      cx - 8 * scale, cy - 2 * scale,
      cx - 10 * scale, cy + 4 * scale,
      cx - 5 * scale, cy + 4 * scale
    );
    ctx.bezierCurveTo(
      cx - 8 * scale, cy + 8 * scale,
      cx - 2 * scale, cy + 8 * scale,
      cx, cy + 10 * scale
    );
    ctx.bezierCurveTo(
      cx + 2 * scale, cy + 8 * scale,
      cx + 8 * scale, cy + 8 * scale,
      cx + 5 * scale, cy + 4 * scale
    );
    ctx.bezierCurveTo(
      cx + 10 * scale, cy + 4 * scale,
      cx + 8 * scale, cy - 2 * scale,
      cx + 4 * scale, cy - 4 * scale
    );
    ctx.bezierCurveTo(
      cx + 8 * scale, cy - 8 * scale,
      cx + 2 * scale, cy - 12 * scale,
      cx, cy - 10 * scale
    );

    ctx.closePath();
    ctx.fill();
  }

  // Draw a ginkgo leaf shape (イチョウ)
  drawGinkgoLeaf(ctx, cx, cy, size) {
    const scale = size / 20;
    
    ctx.beginPath();

    // Soft fan-shaped ginkgo leaf
    ctx.moveTo(cx, cy + 8 * scale);
    ctx.quadraticCurveTo(cx - 8 * scale, cy + 6 * scale, cx - 8 * scale, cy);
    ctx.quadraticCurveTo(cx - 8 * scale, cy - 6 * scale, cx, cy - 8 * scale);
    ctx.quadraticCurveTo(cx + 8 * scale, cy - 6 * scale, cx + 8 * scale, cy);
    ctx.quadraticCurveTo(cx + 8 * scale, cy + 6 * scale, cx, cy + 8 * scale);
    ctx.closePath();
    ctx.fill();

    // Characteristic notch at the center
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(cx - 2 * scale, cy - 2 * scale, cx, cy - 4 * scale);
    ctx.quadraticCurveTo(cx + 2 * scale, cy - 2 * scale, cx, cy);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
}

// Autumn leaves effect functions
let autumnLeavesEffect;
function enableAutumnLeaves() {
  console.log('[AutumnLeavesEffect] enableAutumnLeaves called');
  if (!autumnLeavesEffect) {
    autumnLeavesEffect = new AutumnLeavesEffect();
    window.autumnLeavesEffect = autumnLeavesEffect;
  } else {
    autumnLeavesEffect.canvas.style.display = '';
  }
}

function disableAutumnLeaves() {
  console.log('[AutumnLeavesEffect] disableAutumnLeaves called');
  if (autumnLeavesEffect) {
    autumnLeavesEffect.canvas.style.display = 'none';
  }
}

// Add CSS for autumn leaves canvas
const autumnLeavesCSS = `
.autumn-leaves-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.9;
}
`;

// Inject CSS
const autumnLeavesStyle = document.createElement('style');
autumnLeavesStyle.textContent = autumnLeavesCSS;
document.head.appendChild(autumnLeavesStyle);

// Make functions globally available
window.enableAutumnLeaves = enableAutumnLeaves;
window.disableAutumnLeaves = disableAutumnLeaves;

export { AutumnLeavesEffect, enableAutumnLeaves, disableAutumnLeaves };