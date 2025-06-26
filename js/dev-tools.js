/**
 * Development and Testing Utilities
 * Tools for browser testing, debugging, and quality assurance
 */

class DevelopmentTools {
  constructor() {
    this.isDebugMode = this.checkDebugMode();
    this.init();
  }
  
  init() {
    if (this.isDebugMode) {
      this.setupDebugTools();
      this.setupPerformanceMonitoring();
      this.setupResponsiveHelpers();
      this.setupAccessibilityChecker();
      this.logEnvironmentInfo();
    }
  }
  
  checkDebugMode() {
    return (
      localStorage.getItem('debug') === 'true' ||
      location.search.includes('debug=true') ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1'
    );
  }
  
  setupDebugTools() {
    // Add debug panel
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.innerHTML = `
      <div class="debug-header">
        <h3>Debug Tools</h3>
        <button id="debug-toggle">×</button>
      </div>
      <div class="debug-content">
        <div class="debug-section">
          <h4>Responsive Testing</h4>
          <div class="debug-buttons">
            <button onclick="devTools.simulateDevice('mobile')">Mobile</button>
            <button onclick="devTools.simulateDevice('tablet')">Tablet</button>
            <button onclick="devTools.simulateDevice('desktop')">Desktop</button>
            <button onclick="devTools.resetViewport()">Reset</button>
          </div>
        </div>
        <div class="debug-section">
          <h4>Theme Testing</h4>
          <div class="debug-buttons">
            <button onclick="devTools.testThemes()">Cycle Themes</button>
            <button onclick="devTools.testHighContrast()">High Contrast</button>
            <button onclick="devTools.testReducedMotion()">Reduced Motion</button>
          </div>
        </div>
        <div class="debug-section">
          <h4>Performance</h4>
          <div class="debug-info" id="perf-info">
            <div>Load Time: <span id="load-time">-</span>ms</div>
            <div>DOM Nodes: <span id="dom-count">-</span></div>
            <div>Images: <span id="image-count">-</span></div>
          </div>
        </div>
        <div class="debug-section">
          <h4>Accessibility</h4>
          <div class="debug-buttons">
            <button onclick="devTools.checkAccessibility()">Check A11y</button>
            <button onclick="devTools.showFocusOrder()">Focus Order</button>
            <button onclick="devTools.checkContrast()">Contrast Check</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(debugPanel);
    
    // Add debug styles
    this.addDebugStyles();
    
    // Setup panel toggle
    document.getElementById('debug-toggle').addEventListener('click', () => {
      debugPanel.classList.toggle('minimized');
    });
    
    // Make panel draggable
    this.makeDraggable(debugPanel);
  }
  
  addDebugStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #debug-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        background: #000;
        color: #fff;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(255,215,0,0.3);
        overflow: hidden;
      }
      
      #debug-panel.minimized .debug-content {
        display: none;
      }
      
      .debug-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #333;
        padding: 8px 12px;
        cursor: move;
      }
      
      .debug-header h3 {
        margin: 0;
        font-size: 14px;
      }
      
      .debug-header button {
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        width: 20px;
        height: 20px;
      }
      
      .debug-content {
        padding: 12px;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .debug-section {
        margin-bottom: 16px;
      }
      
      .debug-section h4 {
        margin: 0 0 8px 0;
        font-size: 12px;
        color: #ccc;
        border-bottom: 1px solid #444;
        padding-bottom: 4px;
      }
      
      .debug-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      
      .debug-buttons button {
        background: #444;
        border: none;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 10px;
      }
      
      .debug-buttons button:hover {
        background: #555;
      }
      
      .debug-info {
        font-size: 10px;
        color: #ccc;
      }
      
      .debug-info div {
        margin-bottom: 4px;
      }
      
      /* Accessibility checker highlights */
      .a11y-error {
        outline: 3px solid red !important;
        outline-offset: 2px !important;
      }
      
      .a11y-warning {
        outline: 3px solid orange !important;
        outline-offset: 2px !important;
      }
      
      .focus-order {
        position: relative;
      }
      
      .focus-order::after {
        content: attr(data-focus-order);
        position: absolute;
        top: -10px;
        left: -10px;
        background: red;
        color: white;
        padding: 2px 6px;
        font-size: 12px;
        border-radius: 2px;
        z-index: 1000;
      }
    `;
    document.head.appendChild(style);
  }
  
  makeDraggable(element) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    const header = element.querySelector('.debug-header');
    
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = element.offsetLeft;
      startTop = element.offsetTop;
      
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
    });
    
    function drag(e) {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        element.style.left = (startLeft + deltaX) + 'px';
        element.style.top = (startTop + deltaY) + 'px';
        element.style.right = 'auto';
      }
    }
    
    function stopDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
    }
  }
  
  setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        // Use modern Performance Observer API if available
        let loadTime = 0;
        if (performance.getEntriesByType) {
          const navigationEntries = performance.getEntriesByType('navigation');
          if (navigationEntries.length > 0) {
            loadTime = navigationEntries[0].loadEventEnd - navigationEntries[0].startTime;
          }
        }
        
        const domNodes = document.querySelectorAll('*').length;
        const images = document.querySelectorAll('img').length;
        
        const loadTimeElement = document.getElementById('load-time');
        const domCountElement = document.getElementById('dom-count');
        const imageCountElement = document.getElementById('image-count');
        
        if (loadTimeElement) loadTimeElement.textContent = Math.round(loadTime);
        if (domCountElement) domCountElement.textContent = domNodes;
        if (imageCountElement) imageCountElement.textContent = images;
        
        this.checkPerformanceIssues(loadTime, domNodes);
      }, 100);
    });
    
    // Monitor console errors
    const originalError = console.error;
    console.error = (...args) => {
      this.logError('Console Error', args);
      originalError.apply(console, args);
    };
    
    // Monitor unhandled errors
    window.addEventListener('error', (e) => {
      this.logError('JavaScript Error', e);
    });
  }
  
  setupResponsiveHelpers() {
    // Add viewport size indicator
    const viewportIndicator = document.createElement('div');
    viewportIndicator.id = 'viewport-indicator';
    viewportIndicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(viewportIndicator);
    
    const updateViewportInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const devicePixelRatio = window.devicePixelRatio;
      viewportIndicator.textContent = `${width}×${height} (${devicePixelRatio}x)`;
    };
    
    updateViewportInfo();
    window.addEventListener('resize', updateViewportInfo);
  }
  
  setupAccessibilityChecker() {
    // Check for common accessibility issues
    this.a11yChecks = [
      {
        name: 'Images without alt text',
        check: () => document.querySelectorAll('img:not([alt])'),
        level: 'error'
      },
      {
        name: 'Links without text',
        check: () => Array.from(document.querySelectorAll('a')).filter(a => !a.textContent.trim()),
        level: 'error'
      },
      {
        name: 'Buttons without text',
        check: () => Array.from(document.querySelectorAll('button')).filter(b => !b.textContent.trim() && !b.getAttribute('aria-label')),
        level: 'error'
      },
      {
        name: 'Form inputs without labels',
        check: () => Array.from(document.querySelectorAll('input')).filter(input => {
          const id = input.id;
          return id && !document.querySelector(`label[for="${id}"]`) && !input.getAttribute('aria-label');
        }),
        level: 'warning'
      }
    ];
  }
  
  // Public methods for debug panel
  simulateDevice(device) {
    const devices = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1200, height: 800 }
    };
    
    if (devices[device]) {
      const { width, height } = devices[device];
      window.resizeTo(width, height);
      console.log(`Simulating ${device}: ${width}×${height}`);
    }
  }
  
  resetViewport() {
    window.resizeTo(1200, 800);
    console.log('Viewport reset to default');
  }
  
  testThemes() {
    const themes = ['light', 'dark', 'auto'];
    let currentIndex = 0;
    
    const cycleTheme = () => {
      if (window.themeManager) {
        window.themeManager.setTheme(themes[currentIndex]);
        currentIndex = (currentIndex + 1) % themes.length;
        
        if (currentIndex === 0) {
          console.log('Theme cycling complete');
        } else {
          setTimeout(cycleTheme, 2000);
        }
      }
    };
    
    cycleTheme();
  }
  
  testHighContrast() {
    document.documentElement.style.filter = 
      document.documentElement.style.filter ? '' : 'contrast(2) brightness(1.2)';
    console.log('High contrast toggled');
  }
  
  testReducedMotion() {
    const style = document.getElementById('reduced-motion-test') || document.createElement('style');
    style.id = 'reduced-motion-test';
    
    if (!style.parentNode) {
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
      console.log('Reduced motion enabled');
    } else {
      style.remove();
      console.log('Reduced motion disabled');
    }
  }
  
  checkAccessibility() {
    // Clear previous highlights
    document.querySelectorAll('.a11y-error, .a11y-warning').forEach(el => {
      el.classList.remove('a11y-error', 'a11y-warning');
    });
    
    let issues = [];
    
    this.a11yChecks.forEach(check => {
      const elements = check.check();
      if (elements.length > 0) {
        issues.push({
          name: check.name,
          count: elements.length,
          level: check.level,
          elements
        });
        
        elements.forEach(el => {
          el.classList.add(check.level === 'error' ? 'a11y-error' : 'a11y-warning');
        });
      }
    });
    
    console.log('Accessibility Check Results:', issues);
    
    if (issues.length === 0) {
      console.log('✅ No accessibility issues found!');
    } else {
      issues.forEach(issue => {
        console.warn(`${issue.level.toUpperCase()}: ${issue.name} (${issue.count} elements)`);
      });
    }
    
    return issues;
  }
  
  showFocusOrder() {
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    // Clear previous focus order indicators
    document.querySelectorAll('.focus-order').forEach(el => {
      el.classList.remove('focus-order');
      el.removeAttribute('data-focus-order');
    });
    
    focusableElements.forEach((el, index) => {
      el.classList.add('focus-order');
      el.setAttribute('data-focus-order', index + 1);
    });
    
    console.log(`Focus order shown for ${focusableElements.length} elements`);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      document.querySelectorAll('.focus-order').forEach(el => {
        el.classList.remove('focus-order');
        el.removeAttribute('data-focus-order');
      });
    }, 10000);
  }
  
  checkContrast() {
    // Simple contrast checker (would need more sophisticated implementation for production)
    const elements = document.querySelectorAll('*');
    let checkedElements = 0;
    
    elements.forEach(el => {
      const style = getComputedStyle(el);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      // This is a simplified check - real implementation would calculate actual contrast ratios
      if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        checkedElements++;
        // Placeholder for contrast calculation
        // In reality, you'd need to parse RGB values and calculate luminance
      }
    });
    
    console.log(`Contrast check completed for ${checkedElements} elements`);
  }
  
  logEnvironmentInfo() {
    const info = {
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}×${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio,
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      touchDevice: 'ontouchstart' in window,
      connection: navigator.connection?.effectiveType || 'unknown'
    };
    
    console.log('Environment Info:', info);
  }
  
  checkPerformanceIssues(loadTime, domNodes) {
    const issues = [];
    
    if (loadTime > 3000) {
      issues.push(`Slow load time: ${loadTime}ms (target: <3000ms)`);
    }
    
    if (domNodes > 1500) {
      issues.push(`High DOM complexity: ${domNodes} nodes (target: <1500)`);
    }
    
    if (issues.length > 0) {
      console.warn('Performance Issues:', issues);
    } else {
      console.log('✅ Performance looks good!');
    }
  }
  
  logError(type, details) {
    console.log(`[DEBUG] ${type}:`, details);
    
    // In production, you might send this to an error tracking service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `${type}: ${details}`,
        fatal: false
      });
    }
  }
}

// Initialize development tools
let devTools;
  const month = new Date().getMonth()+1;
  let season = "spring";
  if([6,7,8].includes(month)) season = "summer";
  else if([9,10,11].includes(month)) season = "autumn";
  else if([12,1,2].includes(month)) season = "winter";
  document.body.dataset.season = season;
// WINDSURF_END SeasonColor


export { DevelopmentTools };
