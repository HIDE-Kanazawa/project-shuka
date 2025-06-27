// Main application initialization
window.addEventListener('DOMContentLoaded', () => {
  // Initialize core modules (classes should be available from other script files)
  if (typeof Navigation !== 'undefined') {
    window.navigation = new Navigation();
  }
  
  if (typeof SeasonsGallery !== 'undefined') {
    window.seasonsGallery = new SeasonsGallery();
  }
  
  
  if (typeof WaterRippleEffect !== 'undefined') {
    window.waterRipples = new WaterRippleEffect();
  }
  
  // Initialize other modules if they exist
  if (typeof ShukaApp !== 'undefined') {
    window.shukaApp = new ShukaApp();
  }
  
  if (typeof DevelopmentTools !== 'undefined') {
    window.devTools = new DevelopmentTools();
  }

  // Logo click handler
  const logoLink = document.getElementById('logo-link');
  if (logoLink && typeof handleLogoClick === 'function') {
    logoLink.addEventListener('click', handleLogoClick);
  }
});
