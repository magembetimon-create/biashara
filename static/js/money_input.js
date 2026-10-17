/* Format amount fields as 1,000 while typing. */
(function (w) {
  const parseMoneyInput = (raw) => {
    if (raw == null) return 0;
    const s = String(raw).replace(/,/g, '').replace(/[^\d.-]/g, '');
    if (!s || s === '-' || s === '.') return 0;
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  const formatMoneyInput = (n) => {
    if (n === '' || n == null || Number.isNaN(Number(n))) return '';
    const num = Number(n);
    if (!Number.isFinite(num)) return '';
    const hasDec = Math.abs(num % 1) > 1e-9;
    return num.toLocaleString('en-US', {
      maximumFractionDigits: hasDec ? 2 : 0,
      minimumFractionDigits: 0,
    });
  };

  const bindMoneyInputs = (root) => {
    const $root = root ? $(root) : $(document);
    $root.on('input', '.js-money-input', function () {
      const el = this;
      const orig = String(el.value || '');
      const caretFromEnd = orig.length - (el.selectionStart || orig.length);
      let digits = orig.replace(/[^\d.]/g, '');
      const firstDot = digits.indexOf('.');
      if (firstDot >= 0) {
        digits = digits.slice(0, firstDot + 1) + digits.slice(firstDot + 1).replace(/\./g, '').slice(0, 2);
      }
      const parts = digits.split('.');
      let intPart = parts[0] || '';
      intPart = intPart.replace(/^0+(?=\d)/, '');
      const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      let shown = formattedInt;
      if (firstDot >= 0) shown += '.' + (parts[1] || '');
      if (el.value !== shown) {
        el.value = shown;
        const pos = Math.max(0, shown.length - caretFromEnd);
        try { el.setSelectionRange(pos, pos); } catch (e) { /* ignore */ }
      }
    });
    $root.on('blur', '.js-money-input', function () {
      const n = parseMoneyInput(this.value);
      this.value = n ? formatMoneyInput(n) : '';
    });
  };

  const moneyValue = (el) => parseMoneyInput($(el).val());

  w.parseMoneyInput = parseMoneyInput;
  w.formatMoneyInput = formatMoneyInput;
  w.bindMoneyInputs = bindMoneyInputs;
  w.moneyValue = moneyValue;
  $(() => bindMoneyInputs(document));
})(window);
