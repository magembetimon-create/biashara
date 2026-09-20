(function (w) {
  var KEY = 'waiter_pos_device_id';

  function genId() {
    var rand = '';
    try {
      if (w.crypto && typeof w.crypto.randomUUID === 'function') {
        return ('dev_' + w.crypto.randomUUID().replace(/-/g, '')).slice(0, 120);
      }
      var buf = new Uint8Array(16);
      w.crypto.getRandomValues(buf);
      rand = Array.from(buf).map(function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    } catch (e) {
      rand = Date.now().toString(36) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    }
    return ('dev_' + rand).slice(0, 120);
  }

  function getWaiterPosDeviceId() {
    var localId = '';
    try {
      localId = String(w.localStorage.getItem(KEY) || '').trim();
    } catch (e) {
      localId = '';
    }
    if (localId.length < 8) {
      localId = genId();
      try {
        w.localStorage.setItem(KEY, localId);
      } catch (e) {}
    }
    return localId;
  }

  function syncWaiterPosDeviceIdInUrl() {
    var params = new URLSearchParams(w.location.search);
    if (!params.get('biz')) return false;
    var localId = getWaiterPosDeviceId();
    if (params.get('device_id') !== localId) {
      params.set('device_id', localId);
      w.location.replace(w.location.pathname + '?' + params.toString());
      return true;
    }
    return false;
  }

  w.getWaiterPosDeviceId = getWaiterPosDeviceId;
  w.syncWaiterPosDeviceIdInUrl = syncWaiterPosDeviceIdInUrl;
})(window);
