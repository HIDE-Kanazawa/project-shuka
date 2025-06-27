/**
 * Season Data Configuration
 */
const SEASON_DATA = {
  spring: {
    icon: '🌸',
    name: '春',
    title: '春の調べ',
    description: '桜咲く季節の温かな希望と新しい始まりを表現した楽曲集',
    poster: './img/秀歌-春.webp',
    video: {
      webm: './video/夏庭園の歌.webm',
      mp4: './video/夏庭園の歌.mp4'
    },
    tracks: [
      {
        title: 'ひかりのあと',
        description: '春の陽だまりで感じる穏やかな時間',
        src: './audio/ひかりのあと.mp3'
      },
      {
        title: '光のほうへ',
        description: '新緑の季節に響く希望のメロディー',
        src: './audio/光のほうへ.mp3'
      }
    ]
  },
  summer: {
    icon: '🌻',
    name: '夏',
    title: '夏の響き',
    description: '緑豊かな季節の生命力と情熱を込めた楽曲集',
    poster: './img/秀歌-夏.webp',
    video: {
      webm: './video/夏庭園の歌.webm',
      mp4: './video/夏庭園の歌.mp4'
    },
    tracks: [
      {
        title: '夏庭園の詩',
        description: '緑陰の中で感じる夏の情景',
        src: './audio/夏庭園の詩.mp3'
      },
      {
        title: '緑の中のひととき',
        description: '木陰で過ごす静寂な時間',
        src: './audio/緑の中のひととき.mp3'
      }
    ]
  },
  autumn: {
    icon: '🍁',
    name: '秋',
    title: '秋の詩',
    description: '色づく季節の深い情感と静寂を表現した楽曲集',
    poster: './img/秀歌-秋.webp',
    video: {
      webm: './video/夏庭園の歌.webm',
      mp4: './video/夏庭園の歌.mp4'
    },
    tracks: [
      {
        title: '風の庭にて',
        description: '秋風に舞う葉音のハーモニー',
        src: './audio/風の庭にて.mp3'
      },
      {
        title: '洛陽の宵（よい）',
        description: '秋の夜に響く古都の響き',
        src: './audio/落葉の宵(よい).mp3'
      }
    ]
  },
  winter: {
    icon: '❄️',
    name: '冬',
    title: '冬の静寂',
    description: '雪景色の中の静けさと内省を込めた楽曲集',
    poster: './img/秀歌-冬.webp',
    video: {
      webm: './video/白のなかで.webm',
      mp4: './video/白のなかで.mp4'
    },
    tracks: [
      {
        title: '白のなかで',
        description: '雪に包まれた世界の静寂',
        src: './audio/白のなかで.mp3'
      },
      {
        title: 'しろのことば',
        description: '雪降る夜の静寂な語らい',
        src: './audio/しろのことば.mp3'
      }
    ]
  }
};

/**
 * Accessibility enhancement functions
 */
function initAccessibilityFeatures() {
  // Track mouse usage for focus management
  document.addEventListener('mousedown', () => document.body.classList.add('using-mouse'));
  document.addEventListener('keydown', () => document.body.classList.remove('using-mouse'));
  
  // Enhanced keyboard navigation
  document.addEventListener('keydown', handleGlobalKeyboard);
  
  // ARIA live region setup
  if (!document.getElementById('aria-live-region')) {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }
}

// Global keyboard event handler
function handleGlobalKeyboard(e) {
  // Add keyboard shortcuts
  if (e.altKey) {
    switch(e.key) {
      case '1':
        e.preventDefault();
        document.getElementById('home')?.focus();
        break;
      case '2':
        e.preventDefault();
        document.getElementById('about')?.focus();
        break;
      case '3':
        e.preventDefault();
        document.getElementById('gallery')?.focus();
        break;
      case '4':
        e.preventDefault();
        document.getElementById('contact')?.focus();
        break;
    }
  }
  
  // ESC key to close any open overlays
  if (e.key === 'Escape') {
    // Close mobile menu if open
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    if (navMenu?.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle?.classList.remove('active');
      navToggle?.focus();
    }
  }
}

// Optimize loading with requestIdleCallback
function initResourcePrefetching() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Prefetch lightweight image assets during idle time
      const images = [
        './img/秀歌-春.webp',
        './img/秀歌-夏.webp',
        './img/秀歌-秋.webp',
        './img/秀歌-冬.webp'
      ];

      images.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        document.head.appendChild(link);
      });
    });
  }
}

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


// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}/**
 * Seasons Module
 * Handles seasonal gallery switching with animations and accessibility
 */

// Set winter season gallery video to "白のなかで"
SEASON_DATA.winter.video.mp4 = './video/白のなかで.mp4';

class SeasonsGallery {
  constructor() {
    this.seasonButtons = document.querySelectorAll('.season-btn');
    this.seasonPanels = document.querySelectorAll('.season-panel');
    this.currentSeason = 'tsuyu';
    this.audioElements = [];
    
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
      // Set default volume to 50%
      audio.volume = 0.5;
      // Set preload to none for performance
      audio.preload = 'none';
      
      // Add accessibility attributes
      const trackTitle = audio.parentElement.querySelector('.track-title')?.textContent || 'Track';
      audio.setAttribute('aria-label', `${trackTitle}の音楽プレーヤー`);
    });

    // Setup video elements
    this.videoElements.forEach(video => {
      // Set default volume to 50%
      video.volume = 0.5;
      // Avoid loading video data until play
      video.preload = 'none';
      // Ensure videos don't autoplay with sound
      video.muted = false;

      // Add click to play functionality
      video.addEventListener('click', (e) => this.handleVideoClick(e));

      // Add keyboard support for video
      video.addEventListener('keydown', (e) => this.handleVideoKeydown(e));

      // Allow clicking the surrounding visual container to start playback
      const container = video.closest('.season-visual');
      if (container && !container.dataset.playHandlerAdded) {
        container.addEventListener('click', (evt) => {
          if (evt.target !== video && video.paused) {
            video.play().catch(err => {
              console.log('Video play failed:', err);
            });
          }
        });
        container.dataset.playHandlerAdded = 'true';
      }

      // Add accessibility attributes
      const seasonTitle = video.closest('.season-panel')?.querySelector('.season-title')?.textContent || 'Video';
      video.setAttribute('aria-label', `${seasonTitle}のデモ動画`);
    });
  }
  
  refresh() {
    // Re-query DOM elements after dynamic generation
    this.seasonButtons = document.querySelectorAll('.season-btn');
    this.seasonPanels = document.querySelectorAll('.season-panel');
    
    // Re-bind events
    this.bindEvents();
    this.setupAudioElements();
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
    // Always set initial season to tsuyu (rainy season) on site reload
    this.currentSeason = 'tsuyu';

    // Update URL to reflect tsuyu season
    this.updateURL('tsuyu');

    // Update styling / background
    this.updateSeasonBackground('tsuyu');

    // Enable rain effect for tsuyu season
    if (typeof window.enableRain === 'function') {
      window.enableRain();
    }
    // Ensure sakura effect is disabled
    window.disableSakura?.();

    // Enable sakura effect only for spring (no burst on initial load)
    if (typeof window.enableSakura === 'function' && this.currentSeason === 'spring') {
      window.enableSakura(false);
    }

    // Show tsuyu gallery panel by default
    this.updateSeasonButtons('tsuyu');
    this.updateSeasonPanels('tsuyu', false);
  }
  
  getSeasonFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const season = urlParams.get('season');
    
    if (['spring', 'summer', 'autumn', 'winter', 'tsuyu'].includes(season)) {
      return season;
    }
    
    return null;
  }

  getSeasonFromStorage() {
    try {
      const s = localStorage.getItem('lastSeason');
      if (['spring','summer','autumn','winter','tsuyu'].includes(s)) {
        return s;
      }
    } catch (e) {
      console.warn('Could not access storage:', e);
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

    // Persist selection
    try {
      localStorage.setItem('lastSeason', season);
    } catch (e) {
      console.warn('Could not save season:', e);
    }
    
    // Update URL without page reload
    this.updateURL(season);
    
    // Update about image when user interacts with season buttons
    if (animate) {
      this.updateAboutImage(season);
    }

    // Update body season for styling (includes washi background)
    this.updateSeasonBackground(season);

    // Toggle visual effects depending on season
    console.log('[SeasonsGallery] switchToSeason', season);
    if (season === 'spring') {
      // Check if this is a fresh switch to spring (not initial page load)
      const isSeasonChange = this.currentSeason !== season && this.currentSeason !== null;
      window.enableSakura?.(isSeasonChange); // Pass true for burst if switching to spring
      window.disableRain?.();
      window.disableSnow?.();
    } else if (season === 'tsuyu') {
      window.enableRain?.();
      window.disableSakura?.();
      window.disableSnow?.();
    } else if (season === 'winter') {
      window.enableSnow?.();
      window.disableRain?.();
      window.disableSakura?.();
      window.disableAutumnLeaves?.();
    } else if (season === 'autumn') {
      window.enableAutumnLeaves?.();
      window.disableRain?.();
      window.disableSakura?.();
      window.disableSnow?.();
      window.disableSummerWillow?.();
    } else if (season === 'summer') {
      window.enableSummerWillow?.();
      window.disableRain?.();
      window.disableSakura?.();
      window.disableSnow?.();
      window.disableAutumnLeaves?.();
    } else {
      window.disableRain?.();
      window.disableSakura?.();
      window.disableSnow?.();
      window.disableAutumnLeaves?.();
      window.disableSummerWillow?.();
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

  updateSeasonBackground(season) {
    // Preload washi background for smooth transition
    const washiImages = {
      spring: './img/和紙-春.webp',
      summer: './img/和紙-夏.webp', 
      autumn: './img/和紙-秋.webp',
      winter: './img/和紙-冬.webp',
      tsuyu: './img/和紙-梅雨.webp'
    };

    const imageUrl = washiImages[season];
    if (imageUrl) {
      // Preload the washi image
      const img = new Image();
      img.onload = () => {
        // Update body season attribute for CSS styling
        document.body.setAttribute('data-season', season);
      };
      img.src = imageUrl;
    } else {
      // Fallback to direct update
      document.body.setAttribute('data-season', season);
    }
  }
  
  updateAboutImage(season) {
    const aboutImage = document.querySelector('.about-image');
    if (!aboutImage) return;
    
    const seasonImages = {
      spring: './img/秀歌-春-btn.webp',
      summer: './img/秀歌-夏-btn.webp',
      autumn: './img/秀歌-秋-btn.webp',
      winter: './img/秀歌-冬-btn.webp',
      tsuyu: './img/秀歌-梅雨.webp'
    };
    
    const imageUrl = seasonImages[season];
    if (imageUrl) {
      // Preload image before changing
      const img = new Image();
      img.onload = () => {
        aboutImage.src = imageUrl;
        aboutImage.srcset = imageUrl;
        
        // Update picture source as well
        const pictureSource = aboutImage.parentElement.querySelector('source');
        if (pictureSource) {
          pictureSource.srcset = imageUrl;
        }
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
    // Pause other audio and video elements when one starts playing
    if (e.target.tagName === 'AUDIO') {
      this.audioElements.forEach(audio => {
        if (audio !== e.target && !audio.paused) {
          audio.pause();
        }
      });
      
      // Pause all videos when audio starts
      this.videoElements.forEach(video => {
        if (!video.paused) {
          video.pause();
        }
      });
      
      // Add playing state class
      e.target.closest('.track')?.classList.add('playing');
    }
    
    // Handle video play events
    if (e.target.tagName === 'VIDEO') {
      // Pause all audio when video starts
      this.audioElements.forEach(audio => {
        if (!audio.paused) {
          audio.pause();
        }
      });
      
      // Pause other videos
      this.videoElements.forEach(video => {
        if (video !== e.target && !video.paused) {
          video.pause();
        }
      });
      
      // Add playing state class
      e.target.closest('.season-panel')?.classList.add('video-playing');
    }
  }
  
  handleAudioPause(e) {
    if (e.target.tagName === 'AUDIO') {
      // Remove playing state class
      e.target.closest('.track')?.classList.remove('playing');
    }
    
    if (e.target.tagName === 'VIDEO') {
      // Remove playing state class
      e.target.closest('.season-panel')?.classList.remove('video-playing');
    }
  }
  
  handleVideoClick(e) {
    const video = e.target;
    
    // Toggle play/pause
    if (video.paused) {
      video.play().catch(error => {
        console.log('Video play failed:', error);
      });
    } else {
      video.pause();
    }
    
    // Prevent default to avoid any browser default behavior
    e.preventDefault();
  }
  
  handleVideoKeydown(e) {
    const video = e.target;
    
    // Space bar or Enter to toggle play/pause
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      this.handleVideoClick(e);
    }
    
    // Arrow keys for seeking (5 seconds)
    if (e.code === 'ArrowLeft') {
      e.preventDefault();
      video.currentTime = Math.max(0, video.currentTime - 5);
    }
    
    if (e.code === 'ArrowRight') {
      e.preventDefault();
      video.currentTime = Math.min(video.duration, video.currentTime + 5);
    }
  }
  
  stopAllAudio() {
    this.audioElements.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
      }
    });
    
    // Also stop all videos
    this.videoElements.forEach(video => {
      if (!video.paused) {
        video.pause();
      }
    });
  }
  
  // Public methods for external access
  getCurrentSeason() {
    return this.currentSeason;
  }
  
  getAvailableSeasons() {
    return ['spring', 'summer', 'autumn', 'winter', 'tsuyu'];
  }
}

// Global function for external use (e.g., footer links)
window.switchSeason = function(season) {
  if (window.seasonsGallery && typeof window.seasonsGallery.switchToSeason === 'function') {
    window.seasonsGallery.switchToSeason(season);
  }
};

// Setup footer season buttons helper function
function setupFooterSeasonButtons() {
  const footerSeasonButtons = document.querySelectorAll('.footer-season-btn');
  footerSeasonButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const season = button.getAttribute('data-season');
      if (season && window.switchSeason) {
        window.switchSeason(season);
      }
    });
  });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SeasonsGallery;
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
      colorScheme: "dark",
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

/**
 * Water Ripple Effect Module
 * Creates beautiful water-like ripples on mouse movement and clicks
 */
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
      console.warn('Ripple container not found');
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
    // Create gold foil sparkle effect instead of ripples
    this.createGoldFoilEffect(x, y);
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
   * Create intense gold foil sparkle effect - キラン！金箔の煌めき演出
   */
  createGoldFoilEffect(x, y) {
    // メイン中央スパークル - より大きく強烈に
    this.createGoldSparkle(x, y, 60);
    
    // 瞬間爆発エフェクト
    this.createGoldBurst(x, y, 20);
    
    // 金箔粒子の舞い散り - より多く
    this.createGoldParticles(x, y, 18);
    
    // 金箔のかけら
    setTimeout(() => {
      this.createGoldFlakes(x, y, 15);
    }, 50);
    
    // 背景シマー - より強烈に
    setTimeout(() => {
      this.createGoldShimmer(x, y, 120);
    }, 80);
    
    // セカンドウェーブ
    setTimeout(() => {
      this.createGoldSparkle(x, y, 35);
      this.createGoldParticles(x, y, 10);
    }, 150);
    
    // サードウェーブ - 余韻
    setTimeout(() => {
      this.createGoldFlakes(x, y, 8);
    }, 300);
  }

  /**
   * Create central gold sparkle - メイン金箔煌めき
   */
  createGoldSparkle(x, y, size) {
    if (!this.container) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'gold-sparkle';
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${x - size / 2}px`;
    sparkle.style.top = `${y - size / 2}px`;
    
    this.container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
  }

  /**
   * Create floating gold particles - 金箔粒子 - 強化版
   */
  createGoldParticles(x, y, count) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'gold-particle';
      
      // より大きな粒子でキラキラ感アップ
      const size = Math.random() * 6 + 4; // 4-10px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x - size / 2}px`;
      particle.style.top = `${y - size / 2}px`;
      
      // より広範囲に散る
      const angle = (360 / count) * i + (Math.random() * 90 - 45);
      const distance = 80 + Math.random() * 120; // より遠くまで飛ぶ
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 0.6 + 1.2).toFixed(2); // 1.2-1.8秒
      
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);
      particle.style.animationDuration = `${duration}s`;
      
      // ランダムなグラデーション角度
      const gradientAngle = Math.random() * 360;
      particle.style.setProperty('--particle-angle', `${gradientAngle}deg`);
      
      this.container.appendChild(particle);
      setTimeout(() => particle.remove(), duration * 1000);
    }
  }

  /**
   * Create gold shimmer background - 金箔シマー背景 - 強化版
   */
  createGoldShimmer(x, y, size) {
    if (!this.container) return;
    
    const shimmer = document.createElement('div');
    shimmer.className = 'gold-shimmer';
    shimmer.style.width = `${size}px`;
    shimmer.style.height = `${size}px`;
    shimmer.style.left = `${x - size / 2}px`;
    shimmer.style.top = `${y - size / 2}px`;
    
    this.container.appendChild(shimmer);
    setTimeout(() => shimmer.remove(), 1000);
  }

  /**
   * Create gold flakes - 金箔のかけら
   */
  createGoldFlakes(x, y, count) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const flake = document.createElement('div');
      flake.className = 'gold-flake';
      
      // 不規則なサイズの金箔
      const width = Math.random() * 8 + 3; // 3-11px
      const height = Math.random() * 6 + 2; // 2-8px
      flake.style.width = `${width}px`;
      flake.style.height = `${height}px`;
      flake.style.left = `${x - width / 2}px`;
      flake.style.top = `${y - height / 2}px`;
      
      // ゆっくりと舞い散る
      const angle = Math.random() * 360;
      const distance = 60 + Math.random() * 100;
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 1 + 1.5).toFixed(2); // 1.5-2.5秒
      
      flake.style.setProperty('--dx', `${dx}px`);
      flake.style.setProperty('--dy', `${dy}px`);
      flake.style.animationDuration = `${duration}s`;
      
      // ランダムなグラデーション角度
      const flakeAngle = Math.random() * 360;
      flake.style.setProperty('--flake-angle', `${flakeAngle}deg`);
      
      this.container.appendChild(flake);
      setTimeout(() => flake.remove(), duration * 1000);
    }
  }

  /**
   * Create gold burst explosion - 金箔爆発エフェクト
   */
  createGoldBurst(x, y, count) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const burst = document.createElement('div');
      burst.className = 'gold-burst';
      burst.style.left = `${x - 2}px`;
      burst.style.top = `${y - 2}px`;
      
      // 放射状に爆発
      const angle = (360 / count) * i;
      const distance = 40 + Math.random() * 60;
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const duration = (Math.random() * 0.3 + 0.4).toFixed(2); // 0.4-0.7秒
      
      burst.style.setProperty('--dx', `${dx}px`);
      burst.style.setProperty('--dy', `${dy}px`);
      burst.style.animationDuration = `${duration}s`;
      
      this.container.appendChild(burst);
      setTimeout(() => burst.remove(), duration * 1000);
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
          console.log('Ripple effect optimized for performance');
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
let waterRipples;
document.addEventListener('DOMContentLoaded', () => {
  waterRipples = new WaterRippleEffect();
  window.waterRipples = waterRipples; // Make globally accessible
});

// Global functions for external use
window.toggleRipples = function() {
  if (window.waterRipples) {
    window.waterRipples.toggle();
  }
};

window.createCustomRipple = function(x, y, color, size) {
  if (window.waterRipples) {
    window.waterRipples.createCustomRipple(x, y, color, size);
  }
};

// Rain Effect Module
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

// Sakura Effect Module with Initial Burst Feature
class SakuraEffect {
  constructor(withBurst = false) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'sakura-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.petals = [];
    // Sakura petal density for elegant spring effect
    this.petalCount = Math.floor(window.innerWidth / 15);
    this.isInBurstPhase = withBurst;
    
    // Wind variables for spring breeze
    this.wind = 0;
    this.windTarget = 0;
    this.lastWindChange = performance.now();
    
    this.initializePetals(withBurst);
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initializePetals(withBurst) {
    const count = withBurst ? this.petalCount * 2 : this.petalCount;
    for (let i = 0; i < count; i++) {
      this.petals.push(this.createPetal(true, withBurst));
    }
  }

  createPetal(randomY = false, isBurst = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -20,
      size: 5 + Math.random() * 10, // Larger, more visible sakura petals
      speed: 0.3 + Math.random() * 0.7, // Gentle falling speed
      opacity: 0.7 + Math.random() * 0.3, // Higher opacity for better visibility
      drift: Math.random() * 1.5 - 0.75, // Side-to-side motion
      rotationSpeed: (Math.random() - 0.5) * 2, // Gentle rotation
      rotation: Math.random() * Math.PI * 2,
      swayAmplitude: 40 + Math.random() * 50, // Graceful sway for sakura
      swaySpeed: 0.01 + Math.random() * 0.02, // Slow, elegant sway
      swayOffset: Math.random() * Math.PI * 2,
      windResistance: 0.4 + Math.random() * 0.6, // Spring breeze responsiveness
      turbulence: Math.random() * 0.4, // Gentle turbulence
      petalType: Math.floor(Math.random() * 3), // Different petal shapes
      color: this.getSakuraColor(),
      isBurst: isBurst
    };
  }

  getSakuraColor() {
    // Traditional sakura colors - soft pinks and whites
    const colors = [
      { r: 255, g: 182, b: 193 }, // Light pink
      { r: 255, g: 192, b: 203 }, // Pink
      { r: 255, g: 240, b: 245 }, // Lavender blush
      { r: 255, g: 228, b: 225 }, // Misty rose
      { r: 255, g: 255, b: 255 }, // Pure white
      { r: 250, g: 218, b: 221 }, // Very light pink
      { r: 255, g: 235, b: 238 }  // Soft pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update wind every few seconds - gentle spring breeze
    const now = performance.now();
    if (now - this.lastWindChange > 4000) {
      this.windTarget = (Math.random() * 2 - 1) * 2.5; // Moderate spring wind
      this.lastWindChange = now;
    }
    // Ease current wind toward target
    this.wind += (this.windTarget - this.wind) * 0.015;

    for (const petal of this.petals) {
      ctx.globalAlpha = petal.opacity;
      
      const time = now * 0.001; // Convert to seconds
      const swayX = Math.sin(time * petal.swaySpeed + petal.swayOffset) * petal.swayAmplitude;
      
      ctx.save();
      ctx.translate(petal.x + swayX, petal.y);
      
      // Add wind-influenced rotation - petals tilt in wind direction
      const windTilt = this.wind * 0.08;
      ctx.rotate(petal.rotation + windTilt);
      
      // Set petal color
      const { r, g, b } = petal.color;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${petal.opacity})`;
      
      // Draw sakura petal
      this.drawSakuraPetal(ctx, 0, 0, petal.size, petal.petalType);
      
      ctx.restore();

      // Update petal position - wind-blown movement
      const windForce = this.wind * petal.windResistance;
      const turbulenceX = Math.sin(now * 0.0008 * petal.turbulence) * 0.3;
      const turbulenceY = Math.cos(now * 0.001 * petal.turbulence) * 0.2;
      
      petal.x += windForce + petal.drift + turbulenceX;
      petal.y += petal.speed + Math.abs(windForce) * 0.05 + turbulenceY;
      petal.rotation += petal.rotationSpeed * 0.015 + Math.abs(windForce) * 0.008;

      // Wrap around horizontally
      if (petal.x < -30) petal.x = this.canvas.width + 30;
      if (petal.x > this.canvas.width + 30) petal.x = -30;

      // Reset petal when it falls below viewport
      if (petal.y > this.canvas.height + 30) {
        Object.assign(petal, this.createPetal());
      }
    }

    requestAnimationFrame(this.animate);
  }

  // Draw a realistic sakura petal shape
  drawSakuraPetal(ctx, cx, cy, size, type) {
    const scale = size / 10;
    
    ctx.beginPath();
    
    if (type === 0) {
      // Type A: Classic heart-shaped sakura petal (ソメイヨシノ風)
      const width = 4 * scale;
      const height = 6 * scale;
      
      // Start from bottom tip
      ctx.moveTo(cx, cy + height * 0.4);
      
      // Left side curve - realistic sakura petal curve
      ctx.bezierCurveTo(
        cx - width * 0.3, cy + height * 0.1,
        cx - width * 0.7, cy - height * 0.2,
        cx - width * 0.4, cy - height * 0.4
      );
      
      // Top left notch (characteristic sakura indent)
      ctx.quadraticCurveTo(cx - width * 0.1, cy - height * 0.5, cx, cy - height * 0.3);
      
      // Top right notch
      ctx.quadraticCurveTo(cx + width * 0.1, cy - height * 0.5, cx + width * 0.4, cy - height * 0.4);
      
      // Right side curve
      ctx.bezierCurveTo(
        cx + width * 0.7, cy - height * 0.2,
        cx + width * 0.3, cy + height * 0.1,
        cx, cy + height * 0.4
      );
      
    } else if (type === 1) {
      // Type B: Double-notched sakura petal (ヤマザクラ風)
      const width = 3.5 * scale;
      const height = 5.5 * scale;
      
      // Start from bottom
      ctx.moveTo(cx, cy + height * 0.5);
      
      // Left side with double curve
      ctx.bezierCurveTo(
        cx - width * 0.4, cy + height * 0.1,
        cx - width * 0.8, cy - height * 0.1,
        cx - width * 0.5, cy - height * 0.3
      );
      
      // Deep notch characteristic of some sakura varieties
      ctx.quadraticCurveTo(cx - width * 0.2, cy - height * 0.4, cx - width * 0.1, cy - height * 0.2);
      ctx.quadraticCurveTo(cx, cy - height * 0.5, cx + width * 0.1, cy - height * 0.2);
      ctx.quadraticCurveTo(cx + width * 0.2, cy - height * 0.4, cx + width * 0.5, cy - height * 0.3);
      
      // Right side
      ctx.bezierCurveTo(
        cx + width * 0.8, cy - height * 0.1,
        cx + width * 0.4, cy + height * 0.1,
        cx, cy + height * 0.5
      );
      
    } else {
      // Type C: Simple rounded sakura petal (シダレザクラ風)
      const width = 3 * scale;
      const height = 5 * scale;
      
      // Start from bottom
      ctx.moveTo(cx, cy + height * 0.5);
      
      // Gentle curved sides
      ctx.bezierCurveTo(
        cx - width * 0.5, cy + height * 0.2,
        cx - width * 0.6, cy - height * 0.1,
        cx - width * 0.3, cy - height * 0.4
      );
      
      // Gentle top curve with slight notch
      ctx.quadraticCurveTo(cx, cy - height * 0.45, cx + width * 0.3, cy - height * 0.4);
      
      // Right side
      ctx.bezierCurveTo(
        cx + width * 0.6, cy - height * 0.1,
        cx + width * 0.5, cy + height * 0.2,
        cx, cy + height * 0.5
      );
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Add subtle petal veins for realism
    if (size > 6) { // Only add veins to larger petals
      const width = type === 0 ? 4 * scale : type === 1 ? 3.5 * scale : 3 * scale;
      const height = type === 0 ? 6 * scale : type === 1 ? 5.5 * scale : 5 * scale;
      
      ctx.strokeStyle = `rgba(255, 182, 193, 0.3)`;
      ctx.lineWidth = 0.5 * scale;
      
      ctx.beginPath();
      // Center vein
      ctx.moveTo(cx, cy + height * 0.3);
      ctx.lineTo(cx, cy - height * 0.2);
      
      // Side veins
      ctx.moveTo(cx - width * 0.2, cy + height * 0.1);
      ctx.quadraticCurveTo(cx - width * 0.1, cy, cx - width * 0.15, cy - height * 0.2);
      
      ctx.moveTo(cx + width * 0.2, cy + height * 0.1);
      ctx.quadraticCurveTo(cx + width * 0.1, cy, cx + width * 0.15, cy - height * 0.2);
      
      ctx.stroke();
    }
  }

  startBurstPhase() {
    console.log('[SakuraEffect] Starting dramatic spring burst phase');
    this.isInBurstPhase = true;
    
    // Add more petals for burst effect
    const burstCount = Math.floor(window.innerWidth / 8);
    for (let i = 0; i < burstCount; i++) {
      this.petals.push(this.createPetal(false, true));
    }
    
    // Transition to normal phase after burst
    setTimeout(() => {
      this.isInBurstPhase = false;
      console.log('[SakuraEffect] Transitioning to normal phase');
    }, 2500);
  }
  
  destroy() {
    console.log('[SakuraEffect] Destroying sakura effect');
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Sakura effect will be toggled based on the active season
let sakuraEffect;
window.enableSakura = function(withBurst = false) {
  console.log('[SakuraEffect] enableSakura called', withBurst ? 'with burst' : 'gentle');
  if (!sakuraEffect) {
    console.log('[SakuraEffect] Creating new SakuraEffect instance');
    sakuraEffect = new SakuraEffect(withBurst);
    window.sakuraEffect = sakuraEffect;
    console.log('[SakuraEffect] Created with', sakuraEffect.petalCount, 'petals');
  } else {
    console.log('[SakuraEffect] Showing existing sakura effect');
    sakuraEffect.canvas.style.display = '';
    
    // If requesting burst on existing effect, trigger burst
    if (withBurst && !sakuraEffect.isInBurstPhase) {
      sakuraEffect.startBurstPhase();
    }
  }
};
window.disableSakura = function() {
  console.log('[SakuraEffect] disableSakura called');
  if (sakuraEffect) {
    sakuraEffect.canvas.style.display = 'none';
  }
};

// Add CSS for sakura canvas
const sakuraCSS = `
.sakura-canvas {
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
const sakuraStyle = document.createElement('style');
sakuraStyle.textContent = sakuraCSS;
document.head.appendChild(sakuraStyle);

// Rain effect will be toggled based on the active season
let rainEffect;
window.enableRain = function() {
  console.log('[RainEffect] enableRain called');
  if (!rainEffect) {
    rainEffect = new RainEffect();
    window.rainEffect = rainEffect;
  } else {
    rainEffect.canvas.style.display = '';
  }
};
window.disableRain = function() {
  console.log('[RainEffect] disableRain called');
  if (rainEffect) {
    rainEffect.canvas.style.display = 'none';
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DevelopmentTools, RainEffect, SakuraEffect };
}

/**
 * Handle logo click - scroll to home and set season to tsuyu
 */
window.handleLogoClick = function(event) {
  event.preventDefault();
  
  // Set season to tsuyu but keep summer gallery visible (no scrolling)
  if (window.seasonsGallery && typeof window.seasonsGallery.switchToSeason === 'function') {
    // Set the current season to tsuyu for rain effects and body attributes
    window.seasonsGallery.currentSeason = 'tsuyu';
    
    // Update body season for styling
    document.body.setAttribute('data-season', 'tsuyu');
    
    // Reset about image to main image
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
      aboutImage.src = './img/秀歌.webp';
      aboutImage.srcset = './img/秀歌.webp';
      
      // Update picture source as well
      const pictureSource = aboutImage.parentElement.querySelector('source');
      if (pictureSource) {
        pictureSource.srcset = './img/秀歌.webp';
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

/**
 * Initialize application on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Mark page as loaded to enable transitions
  document.body.classList.add('loaded');
  
  // Initialize accessibility features
  initAccessibilityFeatures();
  
  // Initialize resource prefetching
  initResourcePrefetching();
  
  // Initialize scroll button handlers
  initScrollButtons();
  
  // Generate dynamic content first
  generateSocialLinks();
  generateSeasonGallery();
  
  // Initialize SeasonsGallery class after DOM elements are generated
  window.seasonsGallery = new SeasonsGallery();
  
  // Re-bind events after dynamic generation
  if (window.seasonsGallery && typeof window.seasonsGallery.refresh === 'function') {
    window.seasonsGallery.refresh();
  }
  
  // Setup footer season buttons
  setupFooterSeasonButtons();
});

/**
 * Initialize scroll button handlers
 */
function initScrollButtons() {
  document.querySelectorAll('[data-scroll-target]').forEach(button => {
    button.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-scroll-target');
      scrollToSection(target);
    });
  });
}

/**
 * Generate Season Gallery Navigation and Content
 */
function generateSeasonGallery() {
  const seasonNav = document.getElementById('season-nav');
  const seasonContent = document.getElementById('season-content');
  
  if (!seasonNav || !seasonContent) return;
  
  // Generate navigation buttons
  let navHTML = '';
  let contentHTML = '';
  let isFirst = true;
  
  for (const [key, season] of Object.entries(SEASON_DATA)) {
    // Generate navigation button
    navHTML += `
      <button class="season-btn ${isFirst ? 'active' : ''}" 
              data-season="${key}" 
              role="tab" 
              aria-controls="${key}-content" 
              aria-selected="${isFirst ? 'true' : 'false'}" 
              aria-label="${season.name}の楽曲を再生">
        <span class="season-icon" aria-hidden="true">${season.icon}</span>
        <span class="season-name">${season.name}</span>
      </button>
    `;
    
    // Generate content panel
    contentHTML += `
      <div class="season-panel ${isFirst ? 'active' : ''}" 
           id="${key}-content" 
           role="tabpanel" 
           aria-labelledby="${key}-tab" 
           data-season="${key}">
        <div class="season-visual">
          <video class="season-video"
                 controls
                 preload="none"
                 loading="lazy"
                 tabindex="0"
                 
                 aria-label="${season.name}をテーマにしたデモ動画 - クリックまたはEnterキーで再生">
            <source src="${season.video.webm}" type="video/webm">
            <source src="${season.video.mp4}" type="video/mp4">
            お使いのブラウザは動画再生に対応していません。
          </video>
        </div>
        <div class="season-tracks">
          <h3 class="season-title">${season.title}</h3>
          <p class="season-description">${season.description}</p>
          <div class="track-list">
            ${season.tracks.map(track => `
              <div class="track">
                <audio controls preload="none" aria-label="${track.title} - ${season.name}の楽曲">
                  <source src="${track.src}" type="audio/mpeg">
                  お使いのブラウザは音声再生に対応していません。
                </audio>
                <div class="track-info">
                  <h4 class="track-title">${track.title}</h4>
                  <p class="track-description">${track.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    isFirst = false;
  }
  
  seasonNav.innerHTML = navHTML;
  seasonContent.innerHTML = contentHTML;
}

/**
 * Generate Social Links
 */
function generateSocialLinks() {
  const socialContainer = document.getElementById('social-links');
  if (!socialContainer) return;
  
  const socialLinks = [
    {
      url: 'https://x.com/shuka_artist',
      label: 'X (Twitter) アカウント',
      name: 'X (Twitter)',
      icon: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>'
    },
    {
      url: 'https://instagram.com/shuka_artist',
      label: 'Instagram アカウント',
      name: 'Instagram',
      icon: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>'
    },
    {
      url: 'https://youtube.com/@shuka_artist',
      label: 'YouTube チャンネル',
      name: 'YouTube',
      icon: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>'
    },
    {
      url: 'https://tiktok.com/@shuka_artist',
      label: 'TikTok アカウント',
      name: 'TikTok',
      icon: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>'
    }
  ];
  
  const socialHTML = socialLinks.map(link => `
    <a href="${link.url}" class="social-link" aria-label="${link.label}" rel="noopener noreferrer" target="_blank">
      <svg class="social-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        ${link.icon}
      </svg>
      <span class="sr-only">${link.name}</span>
    </a>
  `).join('');
  
  socialContainer.innerHTML = socialHTML;
}

/**
 * Snow Effect Module
 */
class SnowEffect {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'snow-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.flakes = [];
    // Snow density based on screen width
    this.flakeCount = Math.floor(window.innerWidth / 8); // Less dense than rain
    for (let i = 0; i < this.flakeCount; i++) {
      this.flakes.push(this.createFlake(true));
    }

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
  }

  createFlake(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -20,
      size: 2 + Math.random() * 6, // Varied snowflake sizes
      speed: 0.5 + Math.random() * 1.5, // Slower than rain
      opacity: 0.4 + Math.random() * 0.6, // More visible than rain
      drift: Math.random() * 0.5 - 0.25, // Side-to-side motion
      rotationSpeed: (Math.random() - 0.5) * 2, // Rotation for realism
      rotation: 0
    };
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
window.enableSnow = function() {
  console.log('[SnowEffect] enableSnow called');
  if (!snowEffect) {
    snowEffect = new SnowEffect();
    window.snowEffect = snowEffect;
  } else {
    snowEffect.canvas.style.display = '';
  }
};

window.disableSnow = function() {
  console.log('[SnowEffect] disableSnow called');
  if (snowEffect) {
    snowEffect.canvas.style.display = 'none';
  }
};

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

/**
 * Autumn Leaves Effect Module
 */
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
    
    // Main body of maple leaf
    ctx.moveTo(cx, cy - 10 * scale);
    
    // Top point
    ctx.lineTo(cx - 3 * scale, cy - 6 * scale);
    ctx.lineTo(cx - 8 * scale, cy - 4 * scale);
    ctx.lineTo(cx - 6 * scale, cy - 1 * scale);
    
    // Left side
    ctx.lineTo(cx - 10 * scale, cy + 2 * scale);
    ctx.lineTo(cx - 6 * scale, cy + 3 * scale);
    ctx.lineTo(cx - 4 * scale, cy + 6 * scale);
    
    // Bottom left
    ctx.lineTo(cx - 2 * scale, cy + 4 * scale);
    ctx.lineTo(cx, cy + 8 * scale);
    
    // Bottom right
    ctx.lineTo(cx + 2 * scale, cy + 4 * scale);
    ctx.lineTo(cx + 4 * scale, cy + 6 * scale);
    
    // Right side
    ctx.lineTo(cx + 6 * scale, cy + 3 * scale);
    ctx.lineTo(cx + 10 * scale, cy + 2 * scale);
    ctx.lineTo(cx + 6 * scale, cy - 1 * scale);
    
    // Top right
    ctx.lineTo(cx + 8 * scale, cy - 4 * scale);
    ctx.lineTo(cx + 3 * scale, cy - 6 * scale);
    
    ctx.closePath();
    ctx.fill();
  }

  // Draw a ginkgo leaf shape (イチョウ)
  drawGinkgoLeaf(ctx, cx, cy, size) {
    const scale = size / 20;
    
    ctx.beginPath();
    
    // Fan-shaped ginkgo leaf
    const startAngle = -Math.PI * 0.7;
    const endAngle = Math.PI * 0.7;
    const radius = 8 * scale;
    
    // Draw fan shape
    ctx.arc(cx, cy + 2 * scale, radius, startAngle, endAngle);
    
    // Add stem
    ctx.lineTo(cx, cy + 8 * scale);
    ctx.lineTo(cx, cy + 2 * scale + radius * Math.cos(Math.PI * 0.7));
    
    ctx.closePath();
    ctx.fill();
    
    // Add characteristic notch in the middle
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.moveTo(cx, cy + 2 * scale);
    ctx.lineTo(cx - 2 * scale, cy - 3 * scale);
    ctx.lineTo(cx + 2 * scale, cy - 3 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
}

// Autumn leaves effect functions
let autumnLeavesEffect;
window.enableAutumnLeaves = function() {
  console.log('[AutumnLeavesEffect] enableAutumnLeaves called');
  if (!autumnLeavesEffect) {
    autumnLeavesEffect = new AutumnLeavesEffect();
    window.autumnLeavesEffect = autumnLeavesEffect;
  } else {
    autumnLeavesEffect.canvas.style.display = '';
  }
};

window.disableAutumnLeaves = function() {
  console.log('[AutumnLeavesEffect] disableAutumnLeaves called');
  if (autumnLeavesEffect) {
    autumnLeavesEffect.canvas.style.display = 'none';
  }
};

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

/**
 * Summer Willow Effect Module (青柳エフェクト)
 */
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
window.enableSummerWillow = function() {
  console.log('[SummerWillowEffect] enableSummerWillow called');
  if (!summerWillowEffect) {
    summerWillowEffect = new SummerWillowEffect();
    window.summerWillowEffect = summerWillowEffect;
  } else {
    summerWillowEffect.canvas.style.display = '';
  }
};

window.disableSummerWillow = function() {
  console.log('[SummerWillowEffect] disableSummerWillow called');
  if (summerWillowEffect) {
    summerWillowEffect.canvas.style.display = 'none';
  }
};

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