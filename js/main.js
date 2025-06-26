import { Navigation, scrollToSection } from './navigation.js';
import { SeasonsGallery, switchSeason } from './seasons.js';
import { ThemeManager, setTheme, toggleTheme, getCurrentTheme } from './theme.js';
import { ShukaApp } from './app.js';
import { DevelopmentTools } from './dev-tools.js';
import { WaterRippleEffect, toggleRipples, createCustomRipple } from './water-ripple.js';
import { enableRain, disableRain, handleLogoClick } from './rain-effect.js';

// Instantiate core modules on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.navigation = new Navigation();
  window.seasonsGallery = new SeasonsGallery();
  window.themeManager = new ThemeManager();
  window.shukaApp = new ShukaApp();
  window.waterRipples = new WaterRippleEffect();
  window.devTools = new DevelopmentTools();
});

// Re-export utilities to global scope for inline scripts
window.scrollToSection = scrollToSection;
window.switchSeason = switchSeason;
window.setTheme = setTheme;
window.toggleTheme = toggleTheme;
window.getCurrentTheme = getCurrentTheme;
window.toggleRipples = toggleRipples;
window.createCustomRipple = createCustomRipple;
window.enableRain = enableRain;
window.disableRain = disableRain;
window.handleLogoClick = handleLogoClick;
