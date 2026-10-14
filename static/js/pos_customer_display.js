(function (window) {
  var CHANNEL = 'tb-pos-cfd';
  var STORE = 'tb-pos-cfd-last';
  var thankTimer = null;

  function shopMeta() {
    return {
      shop: window.POS_SHOP_NAME || '',
      currency: window.POS_CURRENCY || '',
      logo: window.POS_SHOP_LOGO || ''
    };
  }

  function writeStore(payload) {
    try {
      localStorage.setItem(STORE, JSON.stringify(payload));
    } catch (e) {}
  }

  function readStore() {
    try {
      var raw = localStorage.getItem(STORE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function send(payload) {
    payload.ts = Date.now();
    writeStore(payload);
    try {
      if (!window.__posCfdChannel) {
        window.__posCfdChannel = new BroadcastChannel(CHANNEL);
      }
      window.__posCfdChannel.postMessage(payload);
    } catch (e) {}
  }

  function cartLines() {
    var cart = (typeof POSCART !== 'undefined' && Array.isArray(POSCART)) ? POSCART : [];
    var srcs = (typeof cartItms !== 'undefined' && Array.isArray(cartItms)) ? cartItms : [];
    return cart.map(function (pi) {
      var src = srcs.find(function (o) {
        return o.id === pi.id && o.color_id === pi.color && o.size_id === pi.size;
      }) || {};
      var servTm = pi.timely ? (Number(pi.servT) || 1) : 1;
      var qty = Number(pi.qty) || 0;
      var bei = Number(pi.bei) || 0;
      var variant = '';
      if (typeof posVariantDisplay === 'function') {
        variant = posVariantDisplay(src);
      } else if (src.color_name) {
        variant = src.color_name;
      }
      return {
        name: src.name || '',
        variant: variant,
        size: src.size_name || '',
        qty: qty,
        line: bei * qty * servTm
      };
    });
  }

  window.publishPosCustomerDisplay = function (mode) {
    var tot = (typeof TOT_SUM === 'object' && TOT_SUM) ? TOT_SUM : { Tot: 0, VAT_: 0, subTot: 0 };
    var items = cartLines();
    var useMode = mode || (items.length ? 'cart' : 'idle');
    send(Object.assign(shopMeta(), {
      mode: useMode,
      items: items,
      total: Number(tot.Tot) || 0,
      vat: Number(tot.VAT_) || 0,
      subtotal: Number(tot.subTot) || 0
    }));
  };

  window.openPosCustomerDisplay = function () {
    window.publishPosCustomerDisplay();
    var w = window.open('/mauzo/pos_customer_display', 'posCustomerDisplay');
    if (w) {
      try { w.focus(); } catch (e) {}
    } else {
      alert((typeof lang === 'function')
        ? lang('Ruhusu popup ili skrini ya mteja ifunguke.', 'Allow popups so the customer screen can open.')
        : 'Allow popups so the customer screen can open.');
    }
  };

  function money(n, cur) {
    var v = Number(n) || 0;
    try {
      return (cur ? cur + ' ' : '') + v.toLocaleString(undefined, { maximumFractionDigits: 2 });
    } catch (e) {
      return (cur ? cur + ' ' : '') + String(v);
    }
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderIdle(root, data) {
    var logo = data.logo
      ? '<img class="cfd-logo" src="' + esc(data.logo) + '" alt="">'
      : '';
    root.innerHTML =
      '<div class="cfd-idle">' +
        logo +
        '<h1 class="cfd-shop">' + esc(data.shop) + '</h1>' +
        '<p class="cfd-welcome">' + esc(data.welcome || '') + '</p>' +
      '</div>';
  }

  function renderThankYou(root, data) {
    root.innerHTML =
      '<div class="cfd-idle">' +
        '<h1 class="cfd-shop">' + esc(data.thanksTitle || 'Asante') + '</h1>' +
        '<p class="cfd-welcome">' + esc(data.thanksSub || '') + '</p>' +
        '<p class="cfd-paid">' + money(data.total, data.currency) + '</p>' +
      '</div>';
  }

  function renderCart(root, data) {
    var rows = (data.items || []).map(function (it) {
      var extra = [it.variant, it.size].filter(Boolean).join(' · ');
      return '<li class="cfd-row">' +
        '<div class="cfd-name">' +
          '<strong>' + esc(it.name) + '</strong>' +
          (extra ? '<small>' + esc(extra) + '</small>' : '') +
        '</div>' +
        '<div class="cfd-qty">× ' + esc(it.qty) + '</div>' +
        '<div class="cfd-line">' + money(it.line, '') + '</div>' +
      '</li>';
    }).join('');
    root.innerHTML =
      '<div class="cfd-cart">' +
        '<header class="cfd-head"><span>' + esc(data.shop) + '</span></header>' +
        '<ul class="cfd-list">' + (rows || '<li class="cfd-empty"></li>') + '</ul>' +
        '<footer class="cfd-foot">' +
          '<span>' + esc(data.totalLabel || 'Total') + '</span>' +
          '<strong>' + money(data.total, data.currency) + '</strong>' +
        '</footer>' +
      '</div>';
  }

  window.initPosCustomerDisplay = function (opts) {
    opts = opts || {};
    var root = document.getElementById('cfdRoot');
    if (!root) return;

    function paint(data) {
      if (!data) data = Object.assign(shopMeta(), { mode: 'idle', items: [], total: 0 });
      data.welcome = opts.welcome;
      data.thanksTitle = opts.thanksTitle;
      data.thanksSub = opts.thanksSub;
      data.totalLabel = opts.totalLabel;
      if (thankTimer) {
        clearTimeout(thankTimer);
        thankTimer = null;
      }
      if (data.mode === 'thankyou') {
        renderThankYou(root, data);
        thankTimer = setTimeout(function () {
          renderIdle(root, Object.assign({}, data, { mode: 'idle' }));
        }, 5000);
        return;
      }
      if (data.mode === 'cart' && data.items && data.items.length) {
        renderCart(root, data);
        return;
      }
      renderIdle(root, data);
    }

    paint(readStore() || Object.assign(shopMeta(), { mode: 'idle' }));

    try {
      var ch = new BroadcastChannel(CHANNEL);
      ch.onmessage = function (ev) { paint(ev.data || {}); };
    } catch (e) {}

    window.addEventListener('storage', function (ev) {
      if (ev.key !== STORE || !ev.newValue) return;
      try { paint(JSON.parse(ev.newValue)); } catch (err) {}
    });
  };
})(window);
