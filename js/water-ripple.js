
class WaterRippleEffect {
  constructor() {
    this.container = document.getElementById('ripple-container');
    this.isActive = true;
    this.lastRippleTime = 0;
    this.throttleDelay = 400; // ms (tranquil, slow ripple frequency for Japanese aesthetic)
    this.maxRipples = 12;
    this.ripples = [];
    this.petalLimit = 100; // max active petals
    this.frameTime = 0;
    this.performanceOptimized = false;
    
    this.init();
  }
  
  init() {
    if (!this.container) {
      console.error('Ripple container not found');
      return;
    }
    
    this.checkUserPreferences();
    this.bindEvents();
  }
  
  checkUserPreferences() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.isActive = false;
      this.container.style.display = 'none';
      return;
    }

    // Disable ripples on small screens (smartphones)
    const smallScreenQuery = window.matchMedia('(max-width: 768px)');
    if (smallScreenQuery.matches) {
      this.isActive = false;
      this.container.style.display = 'none';
      return;
    }
    
    // Check for low-end device - maintain tranquil aesthetic while optimizing
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      this.throttleDelay = 600; // Even slower for performance
      this.maxRipples = 8;
    }
  }
  
  bindEvents() {
    if (!this.isActive) return;
    
    // Mouse move ripples (throttled)
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    // Click ripples (immediate)
    document.addEventListener('click', (e) => this.handleClick(e));
    
    // Touch ripples for mobile
    document.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: true });
    
    // Listen for preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        this.disable();
      } else {
        this.enable();
      }
    });

    // Disable ripples if the viewport becomes small
    const smallScreenQuery = window.matchMedia('(max-width: 768px)');
    smallScreenQuery.addEventListener('change', (e) => {
      if (e.matches) {
        this.disable();
      } else {
        this.enable();
      }
    });
    
    // Clean up old ripples periodically
    setInterval(() => this.cleanupRipples(), 2000);
    
    // Monitor performance and adjust if needed
    this.monitorPerformance();
  }
  
  handleMouseMove(e) {
    if (!this.isActive || !this.shouldCreateRipple()) return;
    
    // Create tranquil koi pond ripples with minimal overlapping
    this.createTranquilRipples(e.clientX, e.clientY);
    this.lastRippleTime = Date.now();
  }
  
  handleClick(e) {
    if (!this.isActive) return;

    const { clientX: x, clientY: y } = e;
    // Luxurious Japanese-style click effect
    this.createLuxuriousClickEffect(x, y);
  }
  
  handleTouch(e) {
    if (!this.isActive || !e.touches[0]) return;
    
    const touch = e.touches[0];
    this.createRipple(touch.clientX, touch.clientY, 'medium');
  }
  
  shouldCreateRipple() {
    const now = Date.now();
    return (now - this.lastRippleTime) > this.throttleDelay; // Gentle, tranquil timing
  }
  
  createRipple(x, y, size = 'medium', color = 'default') {
    if (!this.isActive || this.ripples.length >= this.maxRipples) return;
    
    const ripple = document.createElement('div');
    ripple.className = `ripple ${size} ${color}`;
    
    // Calculate ripple size based on type
    const sizeMap = {
      small: Math.random() * 120 + 80,     // 80-200px (larger)
      medium: Math.random() * 200 + 150,   // 150-350px
      large: Math.random() * 300 + 200,    // 200-500px (much larger)
      huge: Math.random() * 400 + 300      // 300-700px (spectacular)
    };
    
    const rippleSize = sizeMap[size] || sizeMap.medium;
    
    // Position the ripple
    ripple.style.width = `${rippleSize}px`;
    ripple.style.height = `${rippleSize}px`;
    ripple.style.left = `${x - rippleSize / 2}px`;
    ripple.style.top = `${y - rippleSize / 2}px`;
    
    // Add rotation and initial scale
    const rotation = Math.random() * 360;
    ripple.style.transform = `scale(0) rotate(${rotation}deg)`;
    
    // Add color effects
    if (color === 'rainbow') {
      const hue = Math.random() * 360;
      ripple.style.background = `radial-gradient(circle, hsla(${hue}, 80%, 70%, 0.8) 0%, hsla(${hue + 60}, 70%, 60%, 0.4) 40%, transparent 80%)`;
    } else if (color === 'gold') {
      ripple.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 165, 0, 0.6) 30%, rgba(255, 140, 0, 0.3) 60%, transparent 90%)';
    }
    
    // Add to container and track
    this.container.appendChild(ripple);
    this.ripples.push({
      element: ripple,
      createdAt: Date.now()
    });
    
    // Remove after animation completes
    const animationDuration = size === 'huge' ? 3500 : size === 'large' ? 2800 : size === 'small' ? 1200 : 1800;
    setTimeout(() => {
      this.removeRipple(ripple);
    }, animationDuration);
  }
  
  removeRipple(rippleElement) {
    if (rippleElement && rippleElement.parentNode) {
      rippleElement.parentNode.removeChild(rippleElement);
    }
    
    // Remove from tracking array
    this.ripples = this.ripples.filter(ripple => ripple.element !== rippleElement);
  }
  
  cleanupRipples() {
    const now = Date.now();
    const oldRipples = this.ripples.filter(ripple => {
      return (now - ripple.createdAt) > 3000; // Remove ripples older than 3 seconds
    });
    
    oldRipples.forEach(ripple => {
      this.removeRipple(ripple.element);
    });
  }

  /**
   * Create tranquil koi pond ripples for mouse movement - Japanese aesthetic
   */
  createTranquilRipples(x, y) {
    // Primary gentle ripple - like a stone dropped in still water
    this.createRipple(x, y, 'small', 'elegant');
    
    // Occasional secondary ripple with sumi-e ink bleeding effect
    if (Math.random() < 0.12) { // Less frequent for more tranquility
      setTimeout(() => {
        const offsetX = (Math.random() * 20 - 10); // Smaller offset for subtlety
        const offsetY = (Math.random() * 20 - 10);
        this.createRipple(x + offsetX, y + offsetY, 'small', 'subtle');
      }, Math.random() * 500 + 200); // Delayed for natural feel
    }
    
    // Very rare larger ripple for depth variation
    if (Math.random() < 0.05) {
      setTimeout(() => {
        this.createRipple(x, y, 'medium', 'subtle');
      }, Math.random() * 800 + 400);
    }
  }

  /**
   * Create zen-inspired subtle click effect - 禅の美学に基づく上品なクリックエフェクト
   */
  createZenClickEffect(x, y) {
    // 墨滴の滲み
    this.createInkDrops(x, y, 6);
    
    // 浮遊する葉
    setTimeout(() => {
      this.createFloatingLeaves(x, y, 4);
    }, 200);
    
    // 微かな光の滲み
    setTimeout(() => {
      this.createSubtleGlow(x, y, 120);
    }, 100);
    
    // 静寂の点
    this.createTranquilDots(x, y, 8);
  }


  /**
   * Create ink drops - 墨滴の滲み
   */
  createInkDrops(x, y, count) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div');
      drop.className = 'ink-drop';
      
      // 控えめなサイズ
      const size = Math.random() * 4 + 3; // 3-7px
      drop.style.width = `${size}px`;
      drop.style.height = `${size}px`;
      drop.style.left = `${x - size / 2}px`;
      drop.style.top = `${y - size / 2}px`;
      
      // 穏やかな拡散
      const angle = (360 / count) * i + (Math.random() * 60 - 30);
      const distance = 30 + Math.random() * 50; // 控えめな距離
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 0.8 + 1.5).toFixed(2); // 1.5-2.3秒
      
      drop.style.setProperty('--dx', `${dx}px`);
      drop.style.setProperty('--dy', `${dy}px`);
      drop.style.animationDuration = `${duration}s`;
      
      this.container.appendChild(drop);
      setTimeout(() => drop.remove(), duration * 1000);
    }
  }

  /**
   * Create subtle glow - 微かな光の滲み
   */
  createSubtleGlow(x, y, size) {
    if (!this.container) return;
    
    const glow = document.createElement('div');
    glow.className = 'subtle-glow';
    glow.style.width = `${size}px`;
    glow.style.height = `${size}px`;
    glow.style.left = `${x - size / 2}px`;
    glow.style.top = `${y - size / 2}px`;
    
    this.container.appendChild(glow);
    setTimeout(() => glow.remove(), 2000);
  }

  /**
   * Create floating leaves - 浮遊する葉
   */
  createFloatingLeaves(x, y, count) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'floating-leaf';
      
      // 自然なサイズの葉
      const width = Math.random() * 4 + 2; // 2-6px
      const height = Math.random() * 3 + 2; // 2-5px
      leaf.style.width = `${width}px`;
      leaf.style.height = `${height}px`;
      leaf.style.left = `${x - width / 2}px`;
      leaf.style.top = `${y - height / 2}px`;
      
      // ゆっくりと舞い散る
      const angle = Math.random() * 360;
      const distance = 40 + Math.random() * 60; // 控えめな距離
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 1.5 + 2).toFixed(2); // 2-3.5秒
      
      leaf.style.setProperty('--dx', `${dx}px`);
      leaf.style.setProperty('--dy', `${dy}px`);
      leaf.style.animationDuration = `${duration}s`;
      
      // ランダムなグラデーション角度
      const leafAngle = Math.random() * 360;
      leaf.style.setProperty('--leaf-angle', `${leafAngle}deg`);
      
      this.container.appendChild(leaf);
      setTimeout(() => leaf.remove(), duration * 1000);
    }
  }

  /**
   * Create tranquil dots - 静寂の点
   */
  createTranquilDots(x, y, count) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'tranquil-dot';
      dot.style.left = `${x - 1}px`;
      dot.style.top = `${y - 1}px`;
      
      // 静かに放射状に拡散
      const angle = (360 / count) * i;
      const distance = 20 + Math.random() * 40; // 控えめな距離
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 0.5 + 1).toFixed(2); // 1-1.5秒
      
      dot.style.setProperty('--dx', `${dx}px`);
      dot.style.setProperty('--dy', `${dy}px`);
      dot.style.animationDuration = `${duration}s`;
      
      this.container.appendChild(dot);
      setTimeout(() => dot.remove(), duration * 1000);
    }
  }

  /**
   * Burst of sakura petals for a luxurious click effect
   */
  createSakuraBurst(x, y, count = 8) {
    if (!this.container) return;

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'sakura-petal';

      const size = Math.random() * 12 + 8; // 8-20px
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.left = `${x - size / 2}px`;
      petal.style.top = `${y - size / 2}px`;

      const angle = Math.random() * 360;
      const distance = 80 + Math.random() * 80;
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 1 + 2).toFixed(2);

      petal.style.setProperty('--dx', `${dx}px`);
      petal.style.setProperty('--dy', `${dy}px`);
      petal.style.animationDuration = `${duration}s`;

      this.container.appendChild(petal);
      setTimeout(() => petal.remove(), duration * 1000);
    }
  }

  /**
   * Spectacular Japanese-style click effect
   */
  createLuxuriousClickEffect(x, y) {
    this.createRipple(x, y, 'huge', 'gold');
    this.createSakuraBurst(x, y, 14);
    this.createKabukiSwirls(x, y, 2);
    this.createFloatingElements(x, y, 12);
    this.createSubtleGlow(x, y, 200);
    this.createClickFlash(x, y);
  }

  /**
   * Kabuki-inspired swirl accents
   */
  createKabukiSwirls(x, y, count = 2) {
    if (!this.container) return;

    for (let i = 0; i < count; i++) {
      const swirl = document.createElement('div');
      swirl.className = 'kabuki-swirl';

      const size = 40 + Math.random() * 20;
      swirl.style.width = `${size}px`;
      swirl.style.height = `${size}px`;
      swirl.style.left = `${x - size / 2}px`;
      swirl.style.top = `${y - size / 2}px`;
      swirl.style.animationDuration = `${(Math.random() * 0.4 + 0.8).toFixed(2)}s`;

      this.container.appendChild(swirl);
      setTimeout(() => swirl.remove(), 1000);
    }
  }

  /**
   * Create floating elements like cherry blossom petals on water
   */
  createFloatingElements(x, y, count = 6) {
    if (!this.container) return;
    const activeParticles = this.container.querySelectorAll('.refined-particle').length;
    if (activeParticles >= 15) return; // Lower limit for tranquility

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'refined-particle';
      const size = Math.random() * 3 + 2; // 2-5px - very small and delicate
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x - size / 2}px`;
      particle.style.top = `${y - size / 2}px`;

      // More organic, less organized spread pattern
      const angle = Math.random() * 360; // Completely random direction
      const distance = 60 + Math.random() * 60; // Gentler spread
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const dur = (Math.random() * 1.2 + 2).toFixed(2); // 2-3.2s - very slow and graceful
      
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);
      particle.style.animationDuration = `${dur}s`;

      // Add subtle color variation for naturalism
      const opacity = 0.3 + Math.random() * 0.3; // 0.3-0.6 opacity
      particle.style.background = `radial-gradient(
        circle,
        rgba(75, 85, 99, ${opacity}) 0%,
        rgba(107, 114, 128, ${opacity * 0.6}) 50%,
        transparent 100%
      )`;

      this.container.appendChild(particle);
      setTimeout(() => particle.remove(), dur * 1000);
    }
  }

  /**
   * Creates a brief radial flash at click location
   */
  createClickFlash(x, y){
    if(!this.container) return;
    const flash=document.createElement('div');
    flash.className='click-flash';
    const size=20;
    flash.style.width=`${size}px`;
    flash.style.height=`${size}px`;
    flash.style.left=`${x-size/2}px`;
    flash.style.top=`${y-size/2}px`;
    this.container.appendChild(flash);
    setTimeout(()=>flash.remove(),600);
  }

  enable() {
    this.isActive = true;
    if (this.container) {
      this.container.style.display = 'block';
    }
  }
  
  disable() {
    this.isActive = false;
    if (this.container) {
      this.container.style.display = 'none';
    }
    
    // Clear all existing ripples
    this.ripples.forEach(ripple => {
      this.removeRipple(ripple.element);
    });
  }
  
  // Public methods for external control
  toggle() {
    if (this.isActive) {
      this.disable();
    } else {
      this.enable();
    }
  }
  
  createCustomRipple(x, y, color, size = 200) {
    if (!this.isActive) return;
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.background = `radial-gradient(circle, ${color}40 0%, ${color}20 20%, ${color}10 40%, transparent 80%)`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;
    
    this.container.appendChild(ripple);
    
    setTimeout(() => {
      this.removeRipple(ripple);
    }, 1500);
  }
  
  /**
   * Monitor performance and dynamically optimize for 60fps
   */
  monitorPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const checkPerformance = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) { // Check every second
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // If FPS drops below 50, optimize
        if (fps < 50 && !this.performanceOptimized) {
          this.optimizeForPerformance();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(checkPerformance);
    };
    
    requestAnimationFrame(checkPerformance);
  }
  
  /**
   * Optimize settings for better performance
   */
  optimizeForPerformance() {
    this.performanceOptimized = true;
    this.throttleDelay = Math.max(this.throttleDelay * 1.5, 600); // Slower ripples
    this.maxRipples = Math.max(this.maxRipples - 3, 6); // Fewer ripples
    
    // Reduce existing ripples
    while (this.ripples.length > this.maxRipples) {
      const oldestRipple = this.ripples.shift();
      this.removeRipple(oldestRipple.element);
    }
  }
}

// Initialize ripple effect when DOM is loaded
function toggleRipples() {
  if (window.waterRipples) {
    window.waterRipples.toggle();
  }
}

function createCustomRipple(x, y, color, size) {
  if (window.waterRipples) {
    window.waterRipples.createCustomRipple(x, y, color, size);
  }
}


// Make functions globally available
window.WaterRippleEffect = WaterRippleEffect;
window.toggleRipples = toggleRipples;
window.createCustomRipple = createCustomRipple;
