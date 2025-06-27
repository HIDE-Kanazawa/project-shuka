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
      const trackTitle = audio.parentElement.querySelector('.track-title')?.textContent || 'Track';
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
        container.addEventListener('click', evt => {
          if (evt.target !== video && video.paused) {
            video.play().catch(err => {
              console.log('Video play failed:', err);
            });
          }
        });
        container.dataset.playHandlerAdded = 'true';
      }

      const seasonTitle = video.closest('.season-panel')?.querySelector('.season-title')?.textContent || 'Video';
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
      console.warn(`Invalid season: ${season}`);
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
      };
      img.src = imageUrl;
    } else {
      document.body.setAttribute('data-season', season);
    }
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
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
          heroContent.style.paddingTop = '35vh';
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
    // Pause other audio elements when one starts playing
    if (e.target.tagName === 'AUDIO') {
      this.audioElements.forEach(audio => {
        if (audio !== e.target && !audio.paused) {
          this.fadeOutAndPause(audio);
        }
      });

      this.fadeInAudio(e.target);

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

  handleVideoClick(e) {
    const video = e.target;

    if (video.paused) {
      video.play().catch(error => {
        console.log('Video play failed:', error);
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
    return ['spring', 'summer', 'autumn', 'winter', 'tsuyu'];
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
