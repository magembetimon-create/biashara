(function () {
  var installBtn = document.getElementById('pwaInstallBtn');
  var deferredPrompt = null;
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent || '');
  var isStandalone =
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
    });
  }

  function showIosHint() {
    if (document.getElementById('fbPwaIosHint')) return;
    var box = document.createElement('div');
    box.id = 'fbPwaIosHint';
    box.setAttribute('role', 'dialog');
    box.style.cssText =
      'position:fixed;left:12px;right:12px;bottom:16px;z-index:2147483646;background:#fff;color:#222;border-radius:12px;padding:14px 16px;box-shadow:0 8px 28px rgba(0,0,0,.2);font-size:14px;line-height:1.45;';
    box.innerHTML =
      '<strong>Sakinisha app</strong><p style="margin:8px 0 12px">Kwenye iPhone/iPad tumia <b>Safari</b>, bonyeza kitufe cha Share, kisha <b>Add to Home Screen</b>.</p><button type="button" id="fbPwaIosHintClose" style="border:0;background:#007BFF;color:#fff;border-radius:8px;padding:8px 12px">Sawa</button>';
    document.body.appendChild(box);
    document.getElementById('fbPwaIosHintClose').addEventListener('click', function () {
      box.remove();
    });
  }

  if (installBtn && !isStandalone) {
    if (isIOS) {
      installBtn.hidden = false;
      installBtn.addEventListener('click', showIosHint);
    } else {
      window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.hidden = false;
      });
      installBtn.addEventListener('click', function () {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(function () {
          deferredPrompt = null;
          installBtn.hidden = true;
        });
      });
    }
  }

  window.addEventListener('appinstalled', function () {
    if (installBtn) installBtn.hidden = true;
    deferredPrompt = null;
  });
})();
