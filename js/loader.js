// Loader logic: remove after window load or timeout
(function () {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Safety timeout: max 10s
  const safety = setTimeout(finishLoading, 10000);

  window.addEventListener('load', finishLoading);

  function finishLoading() {
    clearTimeout(safety);
    loader.classList.add('fade-out');
    loader.addEventListener('transitionend', () => {
      loader.parentNode && loader.parentNode.removeChild(loader);
    });
  }
})();
