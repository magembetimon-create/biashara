(function () {
  if (window.__fbPwaProgress) return;
  window.__fbPwaProgress = true;

  var bar = null;
  var trickleTimer = null;
  var hideTimer = null;
  var value = 0;
  var active = false;

  function ensureBar() {
    if (bar) return bar;
    bar = document.getElementById('fb-pwa-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'fb-pwa-progress';
      bar.setAttribute('aria-hidden', 'true');
      (document.body || document.documentElement).appendChild(bar);
    }
    return bar;
  }

  function setWidth(pct) {
    ensureBar();
    bar.style.width = pct + '%';
  }

  function start() {
    if (active) return;
    active = true;
    value = 0.08;
    clearTimeout(hideTimer);
    ensureBar();
    bar.classList.add('is-on');
    bar.classList.remove('is-done');
    setWidth(value * 100);
    trickle();
  }

  function trickle() {
    clearTimeout(trickleTimer);
    if (!active) return;
    trickleTimer = setTimeout(function () {
      var remain = 1 - value;
      value += remain * (value < 0.3 ? 0.12 : value < 0.7 ? 0.04 : 0.012);
      if (value > 0.92) value = 0.92;
      setWidth(value * 100);
      trickle();
    }, 280);
  }

  function done() {
    if (!bar) ensureBar();
    clearTimeout(trickleTimer);
    active = false;
    value = 1;
    bar.classList.add('is-on', 'is-done');
    setWidth(100);
    hideTimer = setTimeout(function () {
      bar.classList.remove('is-on', 'is-done');
      setWidth(0);
    }, 280);
  }

  function isInternalNav(anchor) {
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return false;
    var href = anchor.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('javascript:') === 0) return false;
    if (/^(mailto:|tel:|sms:)/i.test(href)) return false;
    try {
      var url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  document.addEventListener(
    'click',
    function (e) {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (isInternalNav(a)) start();
    },
    true
  );

  document.addEventListener(
    'submit',
    function () {
      start();
    },
    true
  );

  window.addEventListener('beforeunload', function () {
    start();
  });

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) done();
  });

  if (document.readyState === 'complete') {
    done();
  } else {
    start();
    window.addEventListener('load', done);
  }
})();
