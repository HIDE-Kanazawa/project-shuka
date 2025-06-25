/**
 * Navigation Module
 * Handles mobile menu toggle and smooth scrolling
 */

class Navigation {
  constructor() {
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    this.header = document.getElementById('header');
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.handleScroll();
  }
  
  bindEvents() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Smooth scrolling for anchor links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
    
    // Handle scroll events for header styling
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Handle escape key for mobile menu
    document.addEventListener('keydown', (e) => this.handleEscapeKey(e));
  }
  
  toggleMobileMenu() {
    const isActive = this.navMenu.classList.contains('active');
    
    if (isActive) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.navMenu.classList.add('active');
    this.navToggle.classList.add('active');
    this.navToggle.setAttribute('aria-expanded', 'true');
    this.navToggle.setAttribute('aria-label', 'メニューを閉じる');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const firstFocusableElement = this.navMenu.querySelector('a, button');
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }
  }
  
  closeMobileMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');
    this.navToggle.setAttribute('aria-label', 'メニューを開く');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to toggle button
    this.navToggle.focus();
  }
  
  handleSmoothScroll(e) {
    e.preventDefault();
    
    const targetId = e.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Close mobile menu if open
      if (this.navMenu.classList.contains('active')) {
        this.closeMobileMenu();
      }
      
      // Calculate offset for fixed header
      const headerHeight = this.header.offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      // Smooth scroll to target
      this.smoothScrollTo(targetPosition);
      
      // Update URL without triggering scroll
      history.pushState(null, null, `#${targetId}`);
      
      // Update active nav link
      this.updateActiveNavLink(targetId);
    }
  }
  
  smoothScrollTo(targetPosition) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;
    
    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function (ease-in-out-cubic)
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
      
      window.scrollTo(0, startPosition + distance * easeInOutCubic);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  }
  
  updateActiveNavLink(activeId) {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      if (href === activeId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
  
  handleOutsideClick(e) {
    const isClickInsideNav = this.navMenu.contains(e.target) || this.navToggle.contains(e.target);
    
    if (!isClickInsideNav && this.navMenu.classList.contains('active')) {
      this.closeMobileMenu();
    }
  }
  
  handleEscapeKey(e) {
    if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
      this.closeMobileMenu();
    }
  }
  
  handleScroll() {
    const scrolled = window.pageYOffset;
    const threshold = 100;
    
    // Add/remove scrolled class for header styling
    if (scrolled > threshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    // Update active navigation based on scroll position
    this.updateActiveNavOnScroll();
  }
  
  updateActiveNavOnScroll() {
    const sections = ['home', 'about', 'gallery', 'contact'];
    const headerHeight = this.header.offsetHeight;
    const scrollPosition = window.pageYOffset + headerHeight + 100;
    
    let activeSection = 'home';
    
    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);
      if (section && scrollPosition >= section.offsetTop) {
        activeSection = sectionId;
      }
    }
    
    this.updateActiveNavLink(activeSection);
  }
}

// Utility functions for external use
window.scrollToSection = () => {}; // auto-scroll disabled


  


    const targetPosition = targetElement.offsetTop - headerHeight;
    



    ;

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}/**
 * Seasons Module
 * Handles seasonal gallery switching with animations and accessibility
 */

class SeasonsGallery {
  constructor() {
    this.seasonButtons = document.querySelectorAll('.season-btn');
    this.seasonPanels = document.querySelectorAll('.season-panel');
    this.currentSeason = 'spring';
    this.audioElements = [];
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.setupAudioElements();
    this.loadInitialSeason();
  }
  
  bindEvents() {
    this.seasonButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleSeasonChange(e));
      button.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    });
    
    // Handle audio events for better UX
    document.addEventListener('play', (e) => this.handleAudioPlay(e), true);
    document.addEventListener('pause', (e) => this.handleAudioPause(e), true);
  }
  
  setupAudioElements() {
    this.audioElements = Array.from(document.querySelectorAll('audio'));
    
    this.audioElements.forEach(audio => {
      // Set preload to none for performance
      audio.preload = 'none';
      
      // Add accessibility attributes
      const trackTitle = audio.parentElement.querySelector('.track-title')?.textContent || 'Track';
      audio.setAttribute('aria-label', `${trackTitle}の音楽プレーヤー`);
    });
  }
  
  loadInitialSeason() {
    // Set initial season based on current date or URL hash
    const urlSeason = this.getSeasonFromURL();
    const dateSeason = this.getSeasonFromDate();
    
    this.currentSeason = urlSeason || dateSeason || 'spring';
    this.switchToSeason(this.currentSeason, false);
  }
  
  getSeasonFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const season = urlParams.get('season');
    
    if (['spring', 'summer', 'autumn', 'winter'].includes(season)) {
      return season;
    }
    
    return null;
  }
  
  getSeasonFromDate() {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }
  
  handleSeasonChange(e) {
    e.preventDefault();
    
    const button = e.currentTarget;
    const season = button.getAttribute('data-season');
    
    if (season && season !== this.currentSeason) {
      this.switchToSeason(season);
    }
  }
  
  handleKeyboardNavigation(e) {
    const currentIndex = Array.from(this.seasonButtons).indexOf(e.currentTarget);
    let nextIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % this.seasonButtons.length;
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + this.seasonButtons.length) % this.seasonButtons.length;
        break;
        
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
        
      case 'End':
        e.preventDefault();
        nextIndex = this.seasonButtons.length - 1;
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.handleSeasonChange(e);
        return;
        
      default:
        return;
    }
    
    this.seasonButtons[nextIndex].focus();
  }
  
  switchToSeason(season, animate = true) {
    // Validate season
    if (!['spring', 'summer', 'autumn', 'winter'].includes(season)) {
      console.warn(`Invalid season: ${season}`);
      return;
    }
    
    // Stop all currently playing audio
    this.stopAllAudio();
    
    // Update button states
    this.updateSeasonButtons(season);
    
    // Update panel states with animation
    this.updateSeasonPanels(season, animate);
    
    // Update current season
    this.currentSeason = season;
    
    // Update URL without page reload
    this.updateURL(season);
    
    // Update hero background if needed
    this.updateHeroBackground(season);
    
    // Announce change for screen readers
    this.announceSeasonChange(season);
  }
  
  updateSeasonButtons(activeSeason) {
    this.seasonButtons.forEach(button => {
      const buttonSeason = button.getAttribute('data-season');
      const isActive = buttonSeason === activeSeason;
      
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive.toString());
      
      if (isActive) {
        button.setAttribute('tabindex', '0');
      } else {
        button.setAttribute('tabindex', '-1');
      }
    });
  }
  
  updateSeasonPanels(activeSeason, animate) {
    this.seasonPanels.forEach(panel => {
      const panelSeason = panel.getAttribute('data-season');
      const isActive = panelSeason === activeSeason;
      
      if (isActive) {
        this.showPanel(panel, animate);
      } else {
        this.hidePanel(panel, animate);
      }
    });
  }
  
  showPanel(panel, animate) {
    if (animate) {
      // Fade in animation
      panel.style.opacity = '0';
      panel.style.display = 'grid';
      panel.classList.add('active');
      
      // Trigger reflow
      panel.offsetHeight;
      
      panel.style.transition = 'opacity 0.3s ease-in-out';
      panel.style.opacity = '1';
      
      // Clean up after animation
      setTimeout(() => {
        panel.style.transition = '';
        panel.style.opacity = '';
      }, 300);
    } else {
      panel.style.display = 'grid';
      panel.classList.add('active');
    }
    
    // Update ARIA attributes
    panel.setAttribute('aria-hidden', 'false');
    
    // Focus management
    const firstFocusable = panel.querySelector('audio, button, a');
    if (firstFocusable && document.activeElement === document.body) {
      firstFocusable.focus();
    }
  }
  
  hidePanel(panel, animate) {
    if (animate) {
      panel.style.transition = 'opacity 0.3s ease-in-out';
      panel.style.opacity = '0';
      
      setTimeout(() => {
        panel.style.display = 'none';
        panel.classList.remove('active');
        panel.style.transition = '';
        panel.style.opacity = '';
      }, 300);
    } else {
      panel.style.display = 'none';
      panel.classList.remove('active');
    }
    
    // Update ARIA attributes
    panel.setAttribute('aria-hidden', 'true');
  }
  
  updateURL(season) {
    const url = new URL(window.location);
    url.searchParams.set('season', season);
    
    // Update URL without triggering navigation
    history.replaceState(null, '', url.toString());
  }
  
  updateHeroBackground(season) {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const seasonImages = {
      spring: './img/秀歌-春.png',
      summer: './img/秀歌-夏.png',
      autumn: './img/秀歌-秋.png',
      winter: './img/秀歌-冬.png'
    };
    
    const imageUrl = seasonImages[season];
    if (imageUrl) {
      // Preload image before changing
      const img = new Image();
      img.onload = () => {
        hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageUrl}')`;
      };
      img.src = imageUrl;
    }
  }
  
  announceSeasonChange(season) {
    const seasonNames = {
      spring: '春',
      summer: '夏',
      autumn: '秋',
      winter: '冬'
    };
    
    const announcement = `${seasonNames[season]}の楽曲に切り替わりました`;
    
    // Create or update live region for screen readers
    let liveRegion = document.getElementById('season-announcer');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'season-announcer';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'visually-hidden';
      document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = announcement;
  }
  
  handleAudioPlay(e) {
    // Pause other audio elements when one starts playing
    if (e.target.tagName === 'AUDIO') {
      this.audioElements.forEach(audio => {
        if (audio !== e.target && !audio.paused) {
          audio.pause();
        }
      });
      
      // Add playing state class
      e.target.closest('.track')?.classList.add('playing');
    }
  }
  
  handleAudioPause(e) {
    if (e.target.tagName === 'AUDIO') {
      // Remove playing state class
      e.target.closest('.track')?.classList.remove('playing');
    }
  }
  
  stopAllAudio() {
    this.audioElements.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
      }
    });
  }
  
  // Public methods for external access
  getCurrentSeason() {
    return this.currentSeason;
  }
  
  getAvailableSeasons() {
    return ['spring', 'summer', 'autumn', 'winter'];
  }
}

// Global function for external use (e.g., footer links)
window.switchSeason = function(season) {
  if (window.seasonsGallery && typeof window.seasonsGallery.switchToSeason === 'function') {
    window.seasonsGallery.switchToSeason(season);
    
    



    }
  }
;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.seasonsGallery = new SeasonsGallery();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SeasonsGallery;
}/**
 * Theme Module
 * Handles dark/light theme switching with system preference detection
 */

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
    this.prefersDarkScheme.addEventListener('change', (e) => this.handleSystemThemeChange(e));
    
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
  
  handleSystemThemeChange(e) {
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
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

// Global functions for external use
window.setTheme = function(theme) {
  if (window.themeManager && typeof window.themeManager.setTheme === 'function') {
    window.themeManager.setTheme(theme);
  }
};

window.toggleTheme = function() {
  if (window.themeManager && typeof window.themeManager.toggleTheme === 'function') {
    window.themeManager.toggleTheme();
  }
};

window.getCurrentTheme = function() {
  if (window.themeManager && typeof window.themeManager.getCurrentTheme === 'function') {
    return window.themeManager.getCurrentTheme();
  }
  return 'auto';
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}/**
 * Main JavaScript Module
 * Coordinates all site functionality and provides utility functions
 */

class ShukaApp {
  constructor() {
    this.isLoaded = false;
    this.observers = new Map();
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }
  
  onDOMReady() {
    this.setupIntersectionObserver();
    this.setupFormHandling();
    this.setupPerformanceOptimizations();
    this.setupAccessibilityEnhancements();
    this.setupErrorHandling();
    this.isLoaded = true;
    
    // Dispatch custom event for other modules
    document.dispatchEvent(new CustomEvent('shukaAppReady'));
  }
  
  setupIntersectionObserver() {
    // Create intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.feature, .track, .about-visual, .contact-form');
    animatedElements.forEach(el => {
      animationObserver.observe(el);
    });
    
    this.observers.set('animation', animationObserver);
  }
  
  animateElement(element) {
    // Check if animations are preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }
    
    // Add animation classes based on element type
    if (element.classList.contains('feature')) {
      element.classList.add('animate-slide-in-left');
    } else if (element.classList.contains('about-visual')) {
      element.classList.add('animate-slide-in-right');
    } else {
      element.classList.add('animate-fade-in');
    }
    
    // Remove animation class after completion to allow re-animation
    setTimeout(() => {
      element.classList.remove('animate-slide-in-left', 'animate-slide-in-right', 'animate-fade-in');
    }, 600);
  }
  
  setupFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
      
      // Add real-time validation
      const inputs = contactForm.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
    }
  }
  
  handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!this.validateForm(form)) {
      return;
    }
    
    // Show loading state
    this.setFormLoadingState(form, true);
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
      this.showFormSuccess(form);
      this.setFormLoadingState(form, false);
      form.reset();
    }, 2000);
  }
  
  validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'この項目は必須です';
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'メールアドレスの形式が正しくありません';
      }
    }
    
    this.showFieldError(field, isValid ? '' : errorMessage);
    return isValid;
  }
  
  showFieldError(field, message) {
    // Remove existing error
    this.clearFieldError(field);
    
    if (message) {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
      
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      errorElement.id = `${field.id}-error`;
      field.setAttribute('aria-describedby', errorElement.id);
      
      field.parentNode.appendChild(errorElement);
    }
  }
  
  clearFieldError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }
  
  setFormLoadingState(form, isLoading) {
    const submitButton = form.querySelector('.form-submit');
    const inputs = form.querySelectorAll('input, textarea, button');
    
    if (isLoading) {
      submitButton.textContent = '送信中...';
      submitButton.disabled = true;
      inputs.forEach(input => input.disabled = true);
    } else {
      submitButton.textContent = '送信する';
      submitButton.disabled = false;
      inputs.forEach(input => input.disabled = false);
    }
  }
  
  showFormSuccess(form) {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
      <div class="success-content">
        <span class="success-icon">✓</span>
        <p>お問い合わせありがとうございます。<br>お返事まで今しばらくお待ちください。</p>
      </div>
    `;
    
    form.style.display = 'none';
    form.parentNode.appendChild(successMessage);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
      successMessage.remove();
      form.style.display = 'block';
    }, 5000);
  }
  
  setupPerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
      
      this.observers.set('images', imageObserver);
    }
    
    // Preload critical resources on interaction
    document.addEventListener('mouseover', this.preloadOnHover, { once: true });
    document.addEventListener('touchstart', this.preloadOnTouch, { once: true });
  }
  
  preloadOnHover() {
    // Preload seasonal images
    const seasonImages = [
      './img/秀歌-春.png',
      './img/秀歌-夏.png',
      './img/秀歌-秋.png',
      './img/秀歌-冬.png'
    ];
    
    seasonImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = src;
      document.head.appendChild(link);
    });
  }
  
  preloadOnTouch() {
    // Similar to hover but for touch devices
    this.preloadOnHover();
  }
  
  setupAccessibilityEnhancements() {
    // Skip links
    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView();
        }
      });
    });
    
    // Focus management for modals and overlays
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.handleTabKey(e);
      }
    });
    
    // Announce page changes for screen readers
    this.setupRouteAnnouncements();
  }
  
  handleTabKey(e) {
    // Handle focus trapping in modals if needed
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
      this.trapFocus(e, activeModal);
    }
  }
  
  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }
  
  setupRouteAnnouncements() {
    // Announce section changes when navigating
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const section = document.getElementById(hash);
        if (section) {
          const heading = section.querySelector('h1, h2, h3');
          if (heading) {
            this.announceToScreenReader(`${heading.textContent}セクションに移動しました`);
          }
        }
      }
    });
  }
  
  announceToScreenReader(message) {
    let announcer = document.getElementById('screen-reader-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'screen-reader-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'visually-hidden';
      document.body.appendChild(announcer);
    }
    
    announcer.textContent = message;
  }
  
  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
      // Could send to error tracking service
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      // Could send to error tracking service
    });
  }
  
  // Public utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // Cleanup method
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Initialize the main app
window.shukaApp = new ShukaApp();

// Add some CSS for form states and animations
const additionalCSS = `
  .field-error {
    color: var(--accent);
    font-size: var(--text-sm);
    margin-top: var(--space-1);
  }
  
  .form-input.error,
  .form-textarea.error {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }
  
  .form-success {
    background: var(--spring);
    color: white;
    padding: var(--space-8);
    border-radius: var(--radius-xl);
    text-align: center;
    animation: fadeIn 0.5s ease-out;
  }
  
  .success-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
  }
  
  .success-icon {
    font-size: var(--text-4xl);
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .track.playing {
    background: var(--primary);
    color: white;
  }
  
  [data-theme="dark"] .track.playing {
    background: var(--primary-light);
  }
`;

// Inject additional CSS
const additionalStyle = document.createElement('style');
additionalStyle.textContent = additionalCSS;
document.head.appendChild(additionalStyle);/**
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
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
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
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domNodes = document.querySelectorAll('*').length;
        const images = document.querySelectorAll('img').length;
        
        document.getElementById('load-time').textContent = loadTime;
        document.getElementById('dom-count').textContent = domNodes;
        document.getElementById('image-count').textContent = images;
        
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
    const lowContrastElements = [];
    
    elements.forEach(el => {
      const style = getComputedStyle(el);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      // This is a simplified check - real implementation would calculate actual contrast ratios
      if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        // Placeholder for contrast calculation
        // In reality, you'd need to parse RGB values and calculate luminance
      }
    });
    
    console.log('Contrast check completed');
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
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    devTools = new DevelopmentTools();
    window.devTools = devTools; // Make available globally for console use
  });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  // WINDSURF_START SeasonColor
(function setSeason(){
  const month = new Date().getMonth()+1;
  let season = "spring";
  if([6,7,8].includes(month)) season = "summer";
  else if([9,10,11].includes(month)) season = "autumn";
  else if([12,1,2].includes(month)) season = "winter";
  document.body.dataset.season = season;
})();
// WINDSURF_END SeasonColor

module.exports = DevelopmentTools;
}