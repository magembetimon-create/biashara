/* Back control for installed PWA on large screens (no browser chrome). */
(function () {
  function isStandalone() {
    try {
      if (window.navigator && window.navigator.standalone) return true;
      if (!window.matchMedia) return false;
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.matchMedia('(display-mode: window-controls-overlay)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches
      );
    } catch (e) {
      return false;
    }
  }

  function markStandalone() {
    if (isStandalone()) {
      document.documentElement.classList.add('fb-pwa-standalone');
    } else {
      document.documentElement.classList.remove('fb-pwa-standalone');
    }
  }

  function homeUrl() {
    var meta = document.querySelector('meta[name="fb-pwa-home"]');
    return (meta && meta.getAttribute('content')) || '/userdash';
  }

  function labelText() {
    try {
      return localStorage.getItem('fb_lang') === '0' ? 'Rudi' : 'Back';
    } catch (e) {
      return 'Back';
    }
  }

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    var home = homeUrl();
    try {
      var dest = new URL(home, window.location.origin);
      if (dest.pathname !== window.location.pathname) {
        window.location.href = dest.href;
      }
    } catch (e) {
      window.location.href = home;
    }
  }

  function mount() {
    if (document.getElementById('fb-pwa-back')) return;
    var label = labelText();
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'fb-pwa-back';
    btn.className = 'fb-pwa-back';
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
      '<path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>' +
      '</svg>';
    btn.addEventListener('click', goBack);

    var header = document.querySelector('.l-header__inner');
    var logo = header && header.querySelector('.logo');
    if (logo) {
      btn.classList.add('fb-pwa-back--header');
      header.insertBefore(btn, logo.nextSibling);
    } else {
      btn.classList.add('fb-pwa-back--float');
      document.body.appendChild(btn);
    }
  }

  markStandalone();
  if (window.matchMedia) {
    ['standalone', 'fullscreen', 'minimal-ui', 'window-controls-overlay'].forEach(function (mode) {
      try {
        var mq = window.matchMedia('(display-mode: ' + mode + ')');
        var onChange = markStandalone;
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
      } catch (e) {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
