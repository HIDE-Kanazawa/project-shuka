class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeIcon = document.querySelector('.theme-icon');
    this.prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    this.currentTheme = this.getInitialTheme();
    
    this.init();
  }
  
  init() {
    this.applyTheme(this.currentTheme, false);
    this.bindEvents();
    this.updateToggleButton();
  }
  
  bindEvents() {
    // Theme toggle button
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
      this.themeToggle.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    // Listen for system theme changes
    this.prefersDarkScheme.addEventListener('change', () => this.handleSystemThemeChange());
    
    // Listen for storage changes (sync across tabs)
    window.addEventListener('storage', (e) => this.handleStorageChange(e));
  }
  
  getInitialTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      return savedTheme;
    }
    
    // Default to auto (follow system preference)
    return 'auto';
  }
  
  getEffectiveTheme(theme = this.currentTheme) {
    if (theme === 'auto') {
      return this.prefersDarkScheme.matches ? 'dark' : 'light';
    }
    return theme;
  }
  
  toggleTheme() {
    const themeOrder = ['light', 'dark', 'auto'];
    const currentIndex = themeOrder.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    
    this.setTheme(themeOrder[nextIndex]);
  }
  
  setTheme(theme) {
    if (!['light', 'dark', 'auto'].includes(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return;
    }
    
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.saveTheme(theme);
    this.updateToggleButton();
    this.announceThemeChange(theme);
  }
  
  applyTheme(theme, animate = true) {
    const effectiveTheme = this.getEffectiveTheme(theme);
    const html = document.documentElement;
    
    // Add transition class for smooth theme switching
    if (animate) {
      html.classList.add('theme-transitioning');
    }
    
    // Apply theme
    html.setAttribute('data-theme', effectiveTheme);
    
    // Update meta theme-color for mobile browsers
    this.updateThemeColor(effectiveTheme);
    
    // Remove transition class after animation
    if (animate) {
      setTimeout(() => {
        html.classList.remove('theme-transitioning');
      }, 300);
    }
  }
  
  updateThemeColor(theme) {
    let themeColorElement = document.querySelector('meta[name="theme-color"]');
    
    if (!themeColorElement) {
      themeColorElement = document.createElement('meta');
      themeColorElement.name = 'theme-color';
      document.head.appendChild(themeColorElement);
    }
    
    const colors = {
      light: '#ffffff',
      dark: '#111827'
    };
    
    themeColorElement.content = colors[theme] || colors.light;
  }
  
  updateToggleButton() {
    if (!this.themeToggle || !this.themeIcon) return;
    
    const effectiveTheme = this.getEffectiveTheme();
    const themeData = this.getThemeData();
    
    // Update icon
    this.themeIcon.textContent = themeData.icon;
    
    // Update aria-label and title
    this.themeToggle.setAttribute('aria-label', themeData.ariaLabel);
    this.themeToggle.setAttribute('title', themeData.title);
    
    // Update button appearance
    this.themeToggle.classList.toggle('dark-mode', effectiveTheme === 'dark');
  }
  
  getThemeData() {
    const themeConfig = {
      light: {
        icon: '🌙',
        ariaLabel: 'ダークモードに切り替える',
        title: 'ダークモードに切り替える'
      },
      dark: {
        icon: '☀️',
        ariaLabel: 'ライトモードに切り替える',
        title: 'ライトモードに切り替える'
      },
      auto: {
        icon: '🌓',
        ariaLabel: 'テーマを手動で設定する',
        title: 'システム設定に従う'
      }
    };
    
    return themeConfig[this.currentTheme] || themeConfig.auto;
  }
  
  saveTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Could not save theme preference:', error);
    }
  }
  
  handleKeydown(e) {
    // Allow Enter and Space to trigger theme toggle
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggleTheme();
    }
  }
  
  handleSystemThemeChange() {
    // Only respond to system changes if theme is set to auto
    if (this.currentTheme === 'auto') {
      this.applyTheme('auto');
    }
  }
  
  handleStorageChange(e) {
    // Sync theme changes across tabs
    if (e.key === 'theme' && e.newValue) {
      this.currentTheme = e.newValue;
      this.applyTheme(this.currentTheme);
      this.updateToggleButton();
    }
  }
  
  announceThemeChange(theme) {
    const themeNames = {
      light: 'ライトモード',
      dark: 'ダークモード',
      auto: 'システム設定に従うモード'
    };
    
    const announcement = `${themeNames[theme]}に切り替わりました`;
    
    // Create or update live region for screen readers
    let liveRegion = document.getElementById('theme-announcer');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'theme-announcer';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'visually-hidden';
      document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = announcement;
  }
  
  // Public methods
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  getEffectiveThemePublic() {
    return this.getEffectiveTheme();
  }
  
  isDarkMode() {
    return this.getEffectiveTheme() === 'dark';
  }
}

// Add CSS for smooth theme transitions
const themeTransitionCSS = `
  .theme-transitioning,
  .theme-transitioning *,
  .theme-transitioning *:before,
  .theme-transitioning *:after {
    transition: background-color 0.3s ease-in-out,
                border-color 0.3s ease-in-out,
                color 0.3s ease-in-out,
                fill 0.3s ease-in-out,
                stroke 0.3s ease-in-out,
                box-shadow 0.3s ease-in-out !important;
  }
`;

// Inject theme transition CSS
const style = document.createElement('style');
style.textContent = themeTransitionCSS;
document.head.appendChild(style);

// Initialize theme manager when DOM is loaded
function setTheme(theme) {
  if (window.themeManager && typeof window.themeManager.setTheme === 'function') {
    window.themeManager.setTheme(theme);
  }
}

function toggleTheme() {
  if (window.themeManager && typeof window.themeManager.toggleTheme === 'function') {
    window.themeManager.toggleTheme();
  }
}

function getCurrentTheme() {
  if (window.themeManager && typeof window.themeManager.getCurrentTheme === 'function') {
    return window.themeManager.getCurrentTheme();
  }
  return 'auto';
}


export { ThemeManager, setTheme, toggleTheme, getCurrentTheme };
