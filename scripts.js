/**
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
    // Ensure correct `this` context on touch devices
    document.addEventListener('touchstart', () => this.preloadOnTouch(), { once: true });
  }
  
  preloadOnHover() {
    // Preload seasonal images
    const seasonImages = [
      './img/秀歌-春.webp',
      './img/秀歌-夏.webp',
      './img/秀歌-秋.webp',
      './img/秀歌-冬.webp'
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
    background: var(--primary-light);
    color: white;
  }
`;

// Inject additional CSS
const additionalStyle = document.createElement('style');
additionalStyle.textContent = additionalCSS;
document.head.appendChild(additionalStyle);

export { ShukaApp };


/**
 * Navigation Module
 * Handles mobile menu toggle and smooth scrolling
 */

class Navigation {
  constructor() {
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navOverlay = document.getElementById('nav-overlay');
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

    if (this.navOverlay) {
      this.navOverlay.addEventListener('click', () => this.closeMobileMenu());
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
    if (this.navOverlay) {
      this.navOverlay.classList.add('active');
      this.navOverlay.setAttribute('aria-hidden', 'false');
    }
    if (this.navToggle) {
      this.navToggle.classList.add('active');
      this.navToggle.setAttribute('aria-expanded', 'true');
      this.navToggle.setAttribute('aria-label', 'メニューを閉じる');
    }
    
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
    if (this.navOverlay) {
      this.navOverlay.classList.remove('active');
      this.navOverlay.setAttribute('aria-hidden', 'true');
    }
    if (this.navToggle) {
      this.navToggle.classList.remove('active');
      this.navToggle.setAttribute('aria-expanded', 'false');
      this.navToggle.setAttribute('aria-label', 'メニューを開く');
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to toggle button
    if (this.navToggle) {
      this.navToggle.focus();
    }
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
      
      // Smooth scroll to target (native for minimal delay)
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      
      // Update URL without triggering scroll
      history.pushState(null, null, `#${targetId}`);
      
      // Update active nav link
      this.updateActiveNavLink(targetId);
    }
  }
  
  smoothScrollTo(targetPosition) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 400;
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
    const isClickInsideNav = this.navMenu.contains(e.target) || (this.navToggle && this.navToggle.contains(e.target));
    const clickedOverlay = this.navOverlay && this.navOverlay.contains(e.target);

    if (!isClickInsideNav && !clickedOverlay && this.navMenu.classList.contains('active')) {
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
window.scrollToSection = function(sectionId) {
  const targetElement = document.getElementById(sectionId);
  const header = document.getElementById('header');
  
  if (targetElement && header) {
    const headerHeight = header.offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

// Make functions globally available
window.Navigation = Navigation;
window.scrollToSection = scrollToSection;


/**
 * Seasons Module
 * Handles seasonal gallery switching with animations and accessibility
 */

class SeasonsGallery {
  constructor() {
    this.seasonButtons = document.querySelectorAll('.season-btn');
    this.seasonPanels = document.querySelectorAll('.season-panel');
    this.currentSeason = 'tsuyu';
    this.audioElements = [];
    this.videoElements = [];
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.setupAudioElements();
    this.preloadWashiBackgrounds(); // 和紙背景をプリロード
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

    this.videoElements = Array.from(document.querySelectorAll('video'));


    this.audioElements.forEach(audio => {
      // Set default volume to 50%\n      audio.volume = 0.5;\n      // Set preload to none for performance
      audio.preload = 'none';

      // Add accessibility attributes
      const trackTitleEl = audio.parentElement.querySelector('.track-title');
      const trackTitle = trackTitleEl ? trackTitleEl.textContent : 'Track';
      audio.setAttribute('aria-label', `${trackTitle}の音楽プレーヤー`);
    });


  // Setup video elements
    this.videoElements.forEach(video => {
      video.volume = 0.5;
      video.preload = 'none';
      video.muted = false;
      video.addEventListener('click', (e) => this.handleVideoClick(e));
      video.addEventListener('keydown', (e) => this.handleVideoKeydown(e));

      const container = video.closest('.season-visual');
      if (container && !container.dataset.playHandlerAdded) {
        container.addEventListener('click', (ev) => {
          // Avoid interfering with the video's own click handler
          if (ev.target === video) return;

          if (video.paused) {
            video.play().catch(err => {
              console.error('Video play failed:', err);
            });
          }
        });
        container.dataset.playHandlerAdded = 'true';
      }

      const seasonPanel = video.closest('.season-panel');
      const seasonTitleEl = seasonPanel ? seasonPanel.querySelector('.season-title') : null;
      const seasonTitle = seasonTitleEl ? seasonTitleEl.textContent : 'Video';
      video.setAttribute('aria-label', `${seasonTitle}のデモ動画`);

    });
  }

  preloadWashiBackgrounds() {
    // Preload all washi background images for smooth transitions
    const washiImages = [
      './img/和紙-春.webp',
      './img/和紙-夏.webp',
      './img/和紙-秋.webp',
      './img/和紙-冬.webp',
      './img/和紙-梅雨.webp'
    ];

    washiImages.forEach(src => {
      const img = new Image();
      img.src = src;
      // Images will be cached by browser
    });
  }
  
  loadInitialSeason() {
    // Always set initial season to winter
    this.currentSeason = 'winter';
    
    // Update body season for styling and washi background
    this.updateSeasonBackground('winter');
    
    // Enable snow effect for winter
    if (typeof window.enableSnow === 'function') {
      window.enableSnow();
    }
    
    // Update URL to reflect winter season
    this.updateURL('winter');

    // Show winter gallery panel by default
    this.updateSeasonButtons('winter');
    this.updateSeasonPanels('winter', false);
  }
  
  getSeasonFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const season = urlParams.get('season');
    
    if (['spring', 'summer', 'autumn', 'winter', 'tsuyu'].includes(season)) {
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
    if (!['spring', 'summer', 'autumn', 'winter', 'tsuyu'].includes(season)) {
        console.error(`Invalid season: ${season}`);
      return;
    }
    
    // Stop all currently playing audio
    this.stopAllAudio();
    
    // Update button states
    this.updateSeasonButtons(season);
    
    // Update panel states with animation
    this.updateSeasonPanels(season, animate);

    // Preserve previous season before update
    const previousSeason = this.currentSeason;
    // Update current season
    this.currentSeason = season;
    
    // Update URL without page reload
    this.updateURL(season);
    
    // Update hero background if needed
    // Update hero background only when animate flag is true (i.e., user interaction)
    if (animate) {
      this.updateHeroBackground(season);
    }

    // Update body season for styling (includes washi background)
    this.updateSeasonBackground(season);

    // Toggle weather effects depending on season
    if (season === 'spring') {
      // Disable all other seasonal effects
      if (typeof window.disableRain === 'function') {
        window.disableRain();
      }
      if (typeof window.disableSnow === 'function') {
        window.disableSnow();
      }
      if (typeof window.disableAutumnLeaves === 'function') {
        window.disableAutumnLeaves();
      }
      if (typeof window.disableSummerWillow === 'function') {
        window.disableSummerWillow();
      }
    } else if (season === 'tsuyu') {
      if (typeof window.enableRain === 'function') {
        window.enableRain();
      }
      if (typeof window.disableSnow === 'function') {
        window.disableSnow();
      }
    } else if (season === 'winter') {
      if (typeof window.enableSnow === 'function') {
        window.enableSnow();
      }
      if (typeof window.disableRain === 'function') {
        window.disableRain();
      }
      if (typeof window.disableAutumnLeaves === 'function') {
        window.disableAutumnLeaves();
      }
      if (typeof window.disableSummerWillow === 'function') {
        window.disableSummerWillow();
      }
    } else if (season === 'autumn') {
      if (typeof window.enableAutumnLeaves === 'function') {
        window.enableAutumnLeaves();
      }
      if (typeof window.disableRain === 'function') {
        window.disableRain();
      }
      if (typeof window.disableSnow === 'function') {
        window.disableSnow();
      }
      if (typeof window.disableSummerWillow === 'function') {
        window.disableSummerWillow();
      }
    } else if (season === 'summer') {
      if (typeof window.enableSummerWillow === 'function') {
        window.enableSummerWillow();
      }
      if (typeof window.disableRain === 'function') {
        window.disableRain();
      }
      if (typeof window.disableSnow === 'function') {
        window.disableSnow();
      }
      if (typeof window.disableAutumnLeaves === 'function') {
        window.disableAutumnLeaves();
      }
    } else {
      // Disable all weather effects for other seasons
      if (typeof window.disableRain === 'function') {
        window.disableRain();
      }
      if (typeof window.disableSnow === 'function') {
        window.disableSnow();
      }
      if (typeof window.disableAutumnLeaves === 'function') {
        window.disableAutumnLeaves();
      }
      if (typeof window.disableSummerWillow === 'function') {
        window.disableSummerWillow();
      }
    }
    
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
    panel.style.display = 'grid';
    panel.classList.add('active');

    if (animate) {
      panel.style.opacity = '0';
      panel.style.transform = 'scale(0.97)';
      panel.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      requestAnimationFrame(() => {
        panel.style.opacity = '1';
        panel.style.transform = 'scale(1)';
      });
      setTimeout(() => {
        panel.style.transition = '';
        panel.style.opacity = '';
        panel.style.transform = '';
      }, 400);
      // Animate children elements with staggered delays
      this.animatePanelChildren(panel, true);
    }
    
    // Update ARIA attributes
    panel.setAttribute('aria-hidden', 'false');
  }
  
  hidePanel(panel, animate) {
    if (animate) {
      this.animatePanelChildren(panel, false);
      panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      panel.style.opacity = '0';
      panel.style.transform = 'scale(0.97)';

      setTimeout(() => {
        panel.style.transition = '';
        panel.style.display = 'none';
        panel.classList.remove('active');
        panel.style.opacity = '';
        panel.style.transform = '';
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

  updateSeasonBackground(season) {
    // Preload washi background for smooth transition
    const washiImages = {
      spring: './img/和紙-春.webp',
      summer: './img/和紙-夏.webp',
      autumn: './img/和紙-秋.webp',
      winter: './img/和紙-冬.webp',
      tsuyu: './img/和紙-梅雨.webp'
    };

    // Update primary/accent colors with fade
    const colorVars = {
      spring: ['--primary-spring', '--accent-spring'],
      summer: ['--primary-summer', '--accent-summer'],
      autumn: ['--primary-autumn', '--accent-autumn'],
      winter: ['--primary-winter', '--accent-winter'],
      tsuyu: ['--primary-tsuyu', '--accent-tsuyu']
    };

    const root = document.documentElement;
    const computed = getComputedStyle(root);
    const vars = colorVars[season];
    if (vars) {
      const primaryColor = computed.getPropertyValue(vars[0]).trim();
      const accentColor = computed.getPropertyValue(vars[1]).trim();
      root.style.setProperty('--primary', primaryColor);
      root.style.setProperty('--accent', accentColor);
    }

    const imageUrl = washiImages[season];
    if (imageUrl) {
      // Preload the washi image
      const img = new Image();
      img.onload = () => {
        document.body.setAttribute('data-season', season);
        const header = document.getElementById('header');
        if (header) header.setAttribute('data-season', season);
        const selector = document.getElementById('season-selector');
        if (selector && typeof selector.updateActive === 'function') selector.updateActive(season);
      };
      img.src = imageUrl;
    } else {
      document.body.setAttribute('data-season', season);
      const header = document.getElementById('header');
      if (header) header.setAttribute('data-season', season);
      const selector = document.getElementById('season-selector');
      if (selector && typeof selector.updateActive === 'function') selector.updateActive(season);
    }

    this.updateFavicon(season);
  }

  updateFavicon(season) {
    const icons = {
      spring: '🌸',
      tsuyu: '☔️',
      summer: '🌻',
      autumn: '🍁',
      winter: '❄️'
    };
    const emoji = icons[season] || '🌸';
    const svg = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text y="14" font-size="16">${emoji}</text></svg>`
    );
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.setAttribute('href', `data:image/svg+xml,${svg}`);
  }
  
  updateHeroBackground(season) {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const seasonImages = {
      spring: './img/秀歌-春.webp',
      summer: './img/秀歌-夏.webp',
      autumn: './img/秀歌-秋.webp',
      winter: './img/秀歌-冬.webp',
      tsuyu: './img/秀歌-梅雨.webp'
    };
    
    const imageUrl = seasonImages[season];
    if (imageUrl) {
      // Preload image before changing
      const img = new Image();
      img.onload = () => {
        hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${imageUrl}')`;
        // Align background to top when a seasonal image is applied
        hero.style.backgroundPosition = 'top center';
      };
      img.src = imageUrl;
    }
  }
  
  announceSeasonChange(season) {
    const seasonNames = {
      spring: '春',
      summer: '夏',
      autumn: '秋',
      winter: '冬',
      tsuyu: '梅雨'
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
          this.fadeOutAndPause(audio);
        }
      });

      this.fadeInAudio(e.target);

      // Add playing state class
      const trackEl = e.target.closest('.track');
      if (trackEl) trackEl.classList.add('playing');
    }
  }
  
  handleAudioPause(e) {
    if (e.target.tagName === 'AUDIO') {
      // Remove playing state class
      const trackEl = e.target.closest('.track');
      if (trackEl) trackEl.classList.remove('playing');
    }
  }

  handleVideoClick(e) {
    const video = e.target;

    if (video.paused) {
      video.play().catch(error => {
        console.error('Video play failed:', error);
      });
    } else {
      video.pause();
    }

    e.preventDefault();
  }

  handleVideoKeydown(e) {
    const video = e.target;

    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      this.handleVideoClick(e);
    }

    if (e.code === 'ArrowLeft') {
      e.preventDefault();
      video.currentTime = Math.max(0, video.currentTime - 5);
    }

    if (e.code === 'ArrowRight') {
      e.preventDefault();
      video.currentTime = Math.min(video.duration, video.currentTime + 5);
    }
  }
  
  animatePanelChildren(panel, isEntering) {
    const videoElement = panel.querySelector('.season-visual');
    const trackList = panel.querySelector('.season-tracks');
    const seasonTitle = panel.querySelector('.season-title');
    const seasonDesc = panel.querySelector('.season-description');
    
    if (isEntering) {
      // Left side elements (video/visual) - enter from left
      if (videoElement) {
        videoElement.style.opacity = '0';
        videoElement.style.transform = 'translateX(-80px)';
        videoElement.style.transition = 'opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s, transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s';
        
        requestAnimationFrame(() => {
          videoElement.style.opacity = '1';
          videoElement.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
          videoElement.style.transition = '';
          videoElement.style.opacity = '';
          videoElement.style.transform = '';
        }, 800);
      }
      
      // Right side elements (tracks) - enter from right
      if (trackList) {
        // Title and description slide in from right
        [seasonTitle, seasonDesc].forEach((element, index) => {
          if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateX(60px)';
            element.style.transition = `opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.2 + (index * 0.1)}s, transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.2 + (index * 0.1)}s`;
            
            requestAnimationFrame(() => {
              element.style.opacity = '1';
              element.style.transform = 'translateX(0)';
            });
            
            setTimeout(() => {
              element.style.transition = '';
              element.style.opacity = '';
              element.style.transform = '';
            }, 700 + (index * 100));
          }
        });
        
        // Track list container slides in from right
        trackList.style.opacity = '0';
        trackList.style.transform = 'translateX(100px)';
        trackList.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.3s, transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.3s';
        
        requestAnimationFrame(() => {
          trackList.style.opacity = '1';
          trackList.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
          trackList.style.transition = '';
          trackList.style.opacity = '';
          trackList.style.transform = '';
        }, 1100);
        
        // Individual tracks cascade from right with stagger
        const tracks = trackList.querySelectorAll('.track');
        tracks.forEach((track, trackIndex) => {
          track.style.opacity = '0';
          track.style.transform = 'translateX(40px)';
          track.style.transition = `opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.5 + (trackIndex * 0.08)}s, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.5 + (trackIndex * 0.08)}s`;
          
          requestAnimationFrame(() => {
            track.style.opacity = '1';
            track.style.transform = 'translateX(0)';
          });
          
          setTimeout(() => {
            track.style.transition = '';
            track.style.opacity = '';
            track.style.transform = '';
          }, 1000 + (trackIndex * 80));
        });
      }
    } else {
      // Exit animations - opposite directions
      if (videoElement) {
        videoElement.style.transition = 'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        videoElement.style.opacity = '0';
        videoElement.style.transform = 'translateX(-60px)';
      }
      
      if (trackList) {
        const tracks = trackList.querySelectorAll('.track');
        tracks.forEach((track, trackIndex) => {
          track.style.transition = `opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) ${trackIndex * 0.03}s, transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) ${trackIndex * 0.03}s`;
          track.style.opacity = '0';
          track.style.transform = 'translateX(30px)';
        });
        
        [seasonTitle, seasonDesc, trackList].forEach((element, index) => {
          if (element) {
            element.style.transition = `opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.1 + (index * 0.05)}s, transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.1 + (index * 0.05)}s`;
            element.style.opacity = '0';
            element.style.transform = 'translateX(50px)';
          }
        });
      }
    }
  }


  fadeOutAndPause(audio, duration = 500) {
    const start = audio.volume;
    const step = start / (duration / 50);
    const fade = setInterval(() => {
      if (audio.volume > step) {
        audio.volume = Math.max(0, audio.volume - step);
      } else {
        clearInterval(fade);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = start;
      }
    }, 50);
  }

  fadeInAudio(audio, target = 0.5, duration = 500) {
    audio.volume = 0;
    const step = target / (duration / 50);
    const fade = setInterval(() => {
      if (audio.volume < target - step) {
        audio.volume = Math.min(target, audio.volume + step);
      } else {
        audio.volume = target;
        clearInterval(fade);
      }
    }, 50);

  }

  stopAllAudio() {
    this.audioElements.forEach(audio => {
      if (!audio.paused) {
        this.fadeOutAndPause(audio);
      }
    });
  }
  
  // Public methods for external access
  getCurrentSeason() {
    return this.currentSeason;
  }
  
  getAvailableSeasons() {
    // 梅雨シーズンはギャラリーのナビゲーションには表示しない
    return ['spring', 'summer', 'autumn', 'winter'];
  }
}

// Global function for external use (e.g., footer links)
function switchSeason(season) {
  if (window.seasonsGallery && typeof window.seasonsGallery.switchToSeason === 'function') {
    window.seasonsGallery.switchToSeason(season);
  }
}

// Make functions globally available
window.SeasonsGallery = SeasonsGallery;
window.switchSeason = switchSeason;

function initSeasonSelector() {
  const selector = document.getElementById('season-selector');
  if (!selector) return;

  const buttons = selector.querySelectorAll('button[data-season]');

  selector.updateActive = (season) => {
    buttons.forEach(btn => {
      const isActive = btn.getAttribute('data-season') === season;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive);
    });
  };

  if (window.seasonsGallery && typeof window.seasonsGallery.getCurrentSeason === 'function') {
    selector.updateActive(window.seasonsGallery.getCurrentSeason());
  }

  selector.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-season]');
    if (!button) return;
    const season = button.getAttribute('data-season');
    if (typeof window.switchSeason === 'function') {
      window.switchSeason(season);
    }
  });
}

window.initSeasonSelector = initSeasonSelector;


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
    snowEffect.canvas.remove();
    snowEffect = null;
    window.snowEffect = null;
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

// Autumn Leaves Effect Module
'use strict';
class AutumnLeavesEffect {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'autumn-leaves-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.resize();
    this.sizeMultiplier = this.getSizeMultiplier();
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
    this.sizeMultiplier = this.getSizeMultiplier();
  }

  getSizeMultiplier() {
    const ratio = window.innerWidth / 768;
    return Math.min(Math.max(ratio, 0.6), 1.2);
  }

  createLeaf(randomY = false) {
    const leafTypes = ['maple', 'ginkgo']; // もみじとイチョウ
    const type = leafTypes[Math.floor(Math.random() * leafTypes.length)];
    
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -50,
      type: type,
      size: (8 + Math.random() * 16) * this.sizeMultiplier, // Responsive leaf size
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
      // もみじの色 - 赤や深いオレンジを中心に
      const colors = [
        { r: 200, g: 30, b: 30 },   // 深い赤
        { r: 220, g: 20, b: 60 },   // クリムゾン
        { r: 255, g: 69, b: 0 },    // オレンジ赤
        { r: 255, g: 120, b: 0 },   // 鮮やかなオレンジ
        { r: 255, g: 160, b: 0 }    // オレンジ
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
    const s = size / 15;

    ctx.beginPath();
    ctx.moveTo(cx, cy - 9 * s);
    ctx.lineTo(cx - 2 * s, cy - 6 * s);
    ctx.lineTo(cx - 7 * s, cy - 8 * s);
    ctx.lineTo(cx - 4 * s, cy - 3 * s);
    ctx.lineTo(cx - 9 * s, cy - 2 * s);
    ctx.lineTo(cx - 5 * s, cy + 1 * s);
    ctx.lineTo(cx - 7 * s, cy + 6 * s);
    ctx.lineTo(cx, cy + 3 * s);
    ctx.lineTo(cx + 7 * s, cy + 6 * s);
    ctx.lineTo(cx + 5 * s, cy + 1 * s);
    ctx.lineTo(cx + 9 * s, cy - 2 * s);
    ctx.lineTo(cx + 4 * s, cy - 3 * s);
    ctx.lineTo(cx + 7 * s, cy - 8 * s);
    ctx.lineTo(cx + 2 * s, cy - 6 * s);
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
  if (!autumnLeavesEffect) {
    autumnLeavesEffect = new AutumnLeavesEffect();
    window.autumnLeavesEffect = autumnLeavesEffect;
  } else {
    autumnLeavesEffect.canvas.style.display = '';
  }
}

function disableAutumnLeaves() {
  if (autumnLeavesEffect) {
    autumnLeavesEffect.canvas.remove();
    autumnLeavesEffect = null;
    window.autumnLeavesEffect = null;
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

    this.handleMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.handleMouseMove(e.touches[0]);
      }
    }, { passive: true });

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
      speed: 0.4 + Math.random() * 0.8, // Slower falling to emphasize horizontal movement
      opacity: 0.5 + Math.random() * 0.4, // Subtle visibility
      drift: Math.random() * 2 - 1, // Increased side-to-side motion
      rotationSpeed: (Math.random() - 0.5) * 2.5, // More dynamic rotation
      rotation: Math.random() * Math.PI * 2,
      swayAmplitude: 50 + Math.random() * 60, // Much more pronounced sway
      swaySpeed: 0.02 + Math.random() * 0.025, // Slightly faster sway
      swayOffset: Math.random() * Math.PI * 2,
      curvature: 0.1 + Math.random() * 0.3, // Natural curve of willow leaves
      windResistance: 0.3 + Math.random() * 0.7, // How much the leaf responds to wind
      turbulence: Math.random() * 0.5, // Random turbulence factor
      color: this.getWillowColor()
    };
  }

  handleMouseMove(e) {
    const centerX = window.innerWidth / 2;
    const normalized = (e.clientX - centerX) / centerX;
    this.windTarget = normalized * 3.5;
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

    // Update wind every few seconds - stronger summer wind
    const now = performance.now();
    if (now - this.lastWindChange > 3000) {
      this.windTarget = (Math.random() * 2 - 1) * 3.5; // Stronger wind for flowing effect
      this.lastWindChange = now;
    }
    // Ease current wind toward target
    this.wind += (this.windTarget - this.wind) * 0.02;

    for (const leaf of this.willowLeaves) {
      ctx.globalAlpha = leaf.opacity;
      
      const time = now * 0.001; // Convert to seconds
      const swayX = Math.sin(time * leaf.swaySpeed + leaf.swayOffset) * leaf.swayAmplitude;
      
      ctx.save();
      ctx.translate(leaf.x + swayX, leaf.y);
      
      // Add wind-influenced rotation - leaves tilt in wind direction
      const windTilt = this.wind * 0.1;
      ctx.rotate(leaf.rotation + windTilt);
      
      // Set leaf color
      const { r, g, b } = leaf.color;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${leaf.opacity})`;
      ctx.strokeStyle = `rgba(${r - 20}, ${g - 20}, ${b - 10}, ${leaf.opacity * 0.8})`;
      ctx.lineWidth = 0.5;
      
      // Draw willow leaf - long, narrow, and slightly curved
      this.drawWillowLeaf(ctx, 0, 0, leaf.length, leaf.width, leaf.curvature);
      
      ctx.restore();

      // Update leaf position - wind-blown movement
      const windForce = this.wind * leaf.windResistance;
      const turbulenceX = Math.sin(now * 0.001 * leaf.turbulence) * 0.5;
      const turbulenceY = Math.cos(now * 0.0015 * leaf.turbulence) * 0.3;
      
      leaf.x += windForce + leaf.drift + turbulenceX;
      leaf.y += leaf.speed + Math.abs(windForce) * 0.1 + turbulenceY; // Wind affects vertical movement too
      leaf.rotation += leaf.rotationSpeed * 0.02 + Math.abs(windForce) * 0.01; // Wind affects rotation

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
  if (!summerWillowEffect) {
    summerWillowEffect = new SummerWillowEffect();
    window.summerWillowEffect = summerWillowEffect;
  } else {
    summerWillowEffect.canvas.style.display = '';
  }
}

function disableSummerWillow() {
  if (summerWillowEffect) {
    summerWillowEffect.canvas.remove();
    summerWillowEffect = null;
    window.summerWillowEffect = null;
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


// Main application initialization
window.addEventListener('DOMContentLoaded', () => {
  // Initialize core modules (classes should be available from other script files)
  if (typeof Navigation !== 'undefined') {
    window.navigation = new Navigation();
  }
  
  if (typeof SeasonsGallery !== 'undefined') {
    window.seasonsGallery = new SeasonsGallery();
  }

  if (typeof initSeasonSelector === 'function') {
    initSeasonSelector();
  }
  
  
  if (typeof WaterRippleEffect !== 'undefined') {
    window.waterRipples = new WaterRippleEffect();
  }
  
  // Initialize other modules if they exist
  if (typeof ShukaApp !== 'undefined') {
    window.shukaApp = new ShukaApp();
  }
  

  // Logo click handler
  const logoLink = document.getElementById('logo-link');
  if (logoLink && typeof handleLogoClick === 'function') {
    logoLink.addEventListener('click', handleLogoClick);
  }
});
