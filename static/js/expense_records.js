/* Expense recording – /purchase/expenseRecords (chaguoil-style, no fuel/pump) */

(function () {
  const URLS = window.EXP_RECORD_URLS || {};
  const itemsByCat = { supplies: [], product: [], allowance: [], bills: [], customer_discounts: [] };
  let paymentAccounts = [];
  let staffMembers = [];
  let taxGroups = [];
  let stockItems = [];
  const expenses = [];

  const $type = $('#expenseType');
  const $item = $('#expenseItem');
  const $itemVal = $('#expenseItemValue');
  const $itemList = $('#expenseItemList');
  const $acct = $('#paymentAccount');
  const $amount = $('#generalAmount');
  const $desc = $('#description');
  const $dt = $('#expenseDateTime');
  const $prodItem = $('#productStockItem');
  const $prodVal = $('#productStockValue');
  const $prodList = $('#productStockList');
  const $prodQty = $('#productQty');

  function productLineCost(stockId, qty) {
    const it = stockItems.find((x) => String(x.id) === String(stockId));
    if (!it) return 0;
    const uw = Number(it.uwiano) || 1;
    const unit = Number(it.Bei_kununua || 0) / uw;
    return unit * Number(qty || 0);
  }

  function updateProductStockHint() {
    const id = $prodVal.val();
    const it = stockItems.find((x) => String(x.id) === String(id));
    const $hint = $('#productStockHint');
    if (!it) {
      $hint.text('');
      return;
    }
    const st = lang('Stoku', 'Stock');
    $hint.text(`${st}: ${fmt(it.idadi)}`);
  }

  function fmt(n) {
    return Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function parseAmountInput(val) {
    const s = String(val || '').replace(/,/g, '').trim();
    if (!s) return NaN;
    return Number(s);
  }

  function formatAmountInput(val) {
    let s = String(val || '').replace(/,/g, '').replace(/[^\d.]/g, '');
    if (!s) return '';
    const dot = s.indexOf('.');
    if (dot !== -1) {
      s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, '');
    }
    const parts = s.split('.');
    let intPart = parts[0] || '';
    const decPart = parts.length > 1 ? parts[1].slice(0, 2) : null;
    if (intPart.length > 1) {
      intPart = intPart.replace(/^0+(?=\d)/, '');
    }
    if (intPart === '') intPart = '0';
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (decPart !== null) return `${formattedInt}.${decPart}`;
    return formattedInt;
  }

  function setAmountFieldValue(raw) {
    if (raw === '' || raw == null) {
      $amount.val('');
      return;
    }
    const n = typeof raw === 'number' ? raw : parseAmountInput(raw);
    if (!Number.isFinite(n)) {
      $amount.val(formatAmountInput(String(raw)));
      return;
    }
    $amount.val(formatAmountInput(String(n)));
  }

  function setDefaultDateTime() {
    if (!$dt.length) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    $dt.val(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`);
  }

  function asBool(v) {
    return v === true || v === 1 || v === '1' || v === 'true';
  }

  function bucketExpenses(list) {
    Object.keys(itemsByCat).forEach((k) => { itemsByCat[k] = []; });
    (list || []).forEach((row) => {
      const item = {
        id: String(row.id),
        name: row.name,
        bill_amount: row.bill_amount,
        bill_fixed: row.bill_fixed,
      };
      const isDiscount = asBool(row.discount);
      const isBill = asBool(row.bili);
      const isAllowance = asBool(row.posho);
      const isProduct = asBool(row.bidhaa_matumizi);
      const isSupplies = asBool(row.for_supplies);

      if (isDiscount) {
        itemsByCat.customer_discounts.push(item);
      } else if (isBill) {
        itemsByCat.bills.push(item);
      } else if (isAllowance) {
        itemsByCat.allowance.push(item);
      } else if (isProduct) {
        itemsByCat.product.push(item);
      } else if (isSupplies) {
        itemsByCat.supplies.push(item);
      }
    });
  }

  function fillAccounts() {
    $acct.html(`<option value="">-- ${lang('Chagua Akaunti', 'Select account')} --</option>`);
    paymentAccounts.forEach((acc) => {
      $acct.append(`<option value="${acc.id}">${acc.name} (${acc.aina || ''}) - ${fmt(acc.Amount)}</option>`);
    });
  }

  function refreshTaxGroupSelect(groups) {
    taxGroups = groups || taxGroups;
    const $sel = $('#expTaxGroupSelect');
    const cur = $sel.val();
    $sel.html(`<option value="">-----</option>`);
    taxGroups.forEach((t) => {
      $sel.append(`<option value="${t.id}">${t.name} (${Number(t.rate || 0)}%)</option>`);
    });
    if (cur) $sel.val(cur);
  }

  function setBillsPanelVisible(show) {
    const $panel = $('#expDefineBillsPanel');
    if (show) {
      $panel.removeClass('d-none').removeAttr('hidden').attr('aria-hidden', 'false');
    } else {
      $panel.addClass('d-none').attr('hidden', 'hidden').attr('aria-hidden', 'true');
    }
  }

  function setNewTaxPanelVisible(show) {
    const $panel = $('#expNewTaxPanel');
    if (show) {
      $panel.removeClass('d-none').removeAttr('hidden').attr('aria-hidden', 'false');
      $('#expTaxGroupSelect').hide();
    } else {
      $panel.addClass('d-none').attr('hidden', 'hidden').attr('aria-hidden', 'true');
      $('#expTaxGroupSelect').show();
    }
  }

  function resetExpenseDefineForm() {
    $('#expDefineEdit').val('0');
    $('#expDefineName').val('');
    $('#expDefineType').val('');
    setBillsPanelVisible(false);
    $('#expBillPeriodType').val('daily');
    $('#expPeriodLabel').text(lang('(Siku)', '(Days)'));
    $('#expBillPeriodCount').val('');
    $('#expDefineBillAmount').val('');
    $('#expBillDepends').prop('checked', false);
    $('#expLastPaymentDate').val('');
    $('#expTaxGroupSelect').val('');
    $('#expNewTaxGroup').prop('checked', false);
    setNewTaxPanelVisible(false);
    $('#expTaxName').val('');
    $('#expTaxRate').val('');
    $('#expDefineReceipt').prop('checked', false);
  }

  function setupAutocomplete($input, $list, $hidden, items, onPick) {
    $input.off('input.exp').on('input.exp', function () {
      const q = $(this).val().toLowerCase();
      $list.empty();
      if (!q) {
        $list.addClass('hidden');
        $hidden.val('');
        return;
      }
      const matches = items.filter((it) => String(it.name || '').toLowerCase().includes(q)).slice(0, 12);
      if (!matches.length) {
        $list.addClass('hidden');
        return;
      }
      matches.forEach((it) => {
        $list.append(`<div data-id="${it.id}">${it.name}</div>`);
      });
      $list.removeClass('hidden');
    });

    $list.off('click.exp').on('click.exp', 'div', function () {
      const id = $(this).data('id');
      const name = $(this).text();
      $input.val(name);
      $hidden.val(id);
      $list.addClass('hidden');
      if (typeof onPick === 'function') onPick(id);
    });
  }

  function applyBillFixed(itemId) {
    const cat = $type.val();
    const items = itemsByCat[cat] || [];
    const it = items.find((x) => String(x.id) === String(itemId));
    if (it && it.bill_fixed && Number(it.bill_amount) > 0) {
      setAmountFieldValue(it.bill_amount);
    }
  }

  function toggleFields() {
    const val = $type.val();
    const isDiscount = val === 'customer_discounts';
    const isProduct = val === 'product';
    const isEmpty = !val;

    $('#expenseItemWrapper').toggleClass('hidden', isDiscount || isEmpty);
    $('#productStockWrapper, #productQtyWrapper').toggleClass('hidden', !isProduct);
    $('#paymentAccountWrapper').toggleClass('hidden', isEmpty || isProduct);
    $('#recipientTypeWrapper, #amountWrapper').toggleClass('hidden', isEmpty || isProduct);
    $('#descWrapper').toggleClass('hidden', isEmpty);
    $('#customerNameWrapper').toggleClass('hidden', !isDiscount);
    $('#staffWrapper, #externalWrapper, #externalTinWrapper').toggleClass(
      'hidden',
      isDiscount || isEmpty || isProduct,
    );

    if (!isDiscount && !isEmpty && !isProduct) updateRecipient();
    else if (isDiscount) {
      $('#staffWrapper, #externalWrapper, #externalTinWrapper').addClass('hidden');
    }

    const items = itemsByCat[val] || [];
    setupAutocomplete($item, $itemList, $itemVal, items, applyBillFixed);
    if (isProduct) {
      setupAutocomplete($prodItem, $prodList, $prodVal, stockItems, () => updateProductStockHint());
    }
  }

  function updateRecipient() {
    const rt = $('#recipientType').val();
    const isStaff = rt === 'staff';
    $('#staffWrapper').toggleClass('hidden', !isStaff);
    $('#externalWrapper, #externalTinWrapper').toggleClass('hidden', isStaff);
  }

  function getRecycleState() {
    const state = {};
    document.querySelectorAll('.exp-records-page .recylebtn.activeRecyle').forEach((btn) => {
      (btn.dataset.targets || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .forEach((id) => {
          const el = document.getElementById(id);
          if (el) state[id] = el.value;
        });
    });
    return state;
  }

  function clearLineFormAfterAdd() {
    const state = getRecycleState();
    const lineFieldIds = [
      'expenseDateTime', 'expenseType', 'expenseItem', 'expenseItemValue',
      'productStockItem', 'productStockValue', 'productQty',
      'paymentAccount', 'recipientType', 'staffMember', 'staffMemberValue',
      'extName', 'extTin', 'customerName', 'generalAmount', 'description',
    ];
    lineFieldIds.forEach((id) => {
      const $el = $(`#${id}`);
      if ($el.length) $el.val('');
    });
    $('#productStockHint').text('');
    Object.entries(state).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.value = value;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    toggleFields();
    updateRecipient();
    updateProductStockHint();
  }

  function validateRow() {
    const cat = $type.val();
    if (!cat) {
      toastr.warning(lang('Chagua aina ya matumizi', 'Select expense type'));
      return null;
    }

    if (cat === 'product') {
      if (!$itemVal.val()) {
        toastr.warning(lang('Chagua jina la matumizi', 'Select expense name'));
        return null;
      }
      if (!$prodVal.val()) {
        toastr.warning(lang('Chagua bidhaa iliyotumika', 'Select item used'));
        return null;
      }
      const quantity = Number($prodQty.val());
      if (!(quantity > 0)) {
        toastr.warning(lang('Andika idadi zilizotumika', 'Enter quantity used'));
        return null;
      }
      const stockId = $prodVal.val();
      const stockRow = stockItems.find((x) => String(x.id) === String(stockId));
      const amount = productLineCost(stockId, quantity);
      const payload = {
        category: 'product',
        expense_group_id: $itemVal.val(),
        stock_item_id: stockId,
        quantity,
        remarks: ($desc.val() || '').trim(),
      };
      const prodLabel = $prodItem.val().trim();
      const itemLabel = `${$item.val()} — ${prodLabel} (${quantity})`;
      return {
        payload,
        display: {
          item: itemLabel,
          recipient: '—',
          desc: payload.remarks || '—',
          amount,
        },
      };
    }

    if (!$acct.val()) {
      toastr.warning(lang('Chagua akaunti', 'Select payment account'));
      return null;
    }
    const amount = parseAmountInput($amount.val());
    if (!(amount > 0)) {
      toastr.warning(lang('Andika kiasi', 'Enter amount'));
      return null;
    }

    let payload = {
      category: cat,
      expense_group_id: $itemVal.val(),
      amount,
      remarks: ($desc.val() || '').trim(),
      recipient_type: $('#recipientType').val(),
      source_details: { account_id: $acct.val() },
    };

    if (cat === 'customer_discounts') {
      const cn = ($('#customerName').val() || '').trim();
      if (!cn) {
        toastr.warning(lang('Andika jina la mteja', 'Enter customer name'));
        return null;
      }
      payload.customer_name = cn;
      payload.receiver_name = cn;
      payload.expense_group_id = null;
    } else {
      if (!$itemVal.val()) {
        toastr.warning(lang('Chagua jina la matumizi', 'Select expense name'));
        return null;
      }
      if ($('#recipientType').val() === 'staff') {
        if (!$('#staffMemberValue').val()) {
          toastr.warning(lang('Chagua mfanyakazi', 'Select staff'));
          return null;
        }
        payload.staff_id = $('#staffMemberValue').val();
        payload.worker_id = payload.staff_id;
        payload.receiver_name = $('#staffMember').val().trim();
      } else {
        const nm = ($('#extName').val() || '').trim();
        const tin = ($('#extTin').val() || '').trim();
        if (!nm || !tin) {
          toastr.warning(lang('Jina na TIN vinahitajika', 'Name and TIN required'));
          return null;
        }
        payload.receiver_name = nm;
        payload.tin_number = tin;
      }
    }

    const itemLabel = cat === 'customer_discounts' ? lang('Punguzo', 'Discount') : $item.val();
    return {
      payload,
      display: {
        item: itemLabel,
        recipient: payload.receiver_name || '—',
        desc: payload.remarks || '—',
        amount,
      },
    };
  }

  function renderQueue() {
    const $body = $('#tableBody');
    $body.empty();
    let total = 0;
    expenses.forEach((row, idx) => {
      total += Number(row.display.amount) || 0;
      $body.append(`<tr>
        <td>${row.display.item}</td>
        <td>${row.display.recipient}</td>
        <td>${row.display.desc}</td>
        <td class="text-right">${fmt(row.display.amount)}</td>
        <td><button type="button" class="btn btn-link btn-sm text-danger p-0 exp-rm" data-i="${idx}">${lang('Futa', 'Remove')}</button></td>
      </tr>`);
    });
    $('#allExpensesTotalAmount').text(fmt(total));
    $('#allExpensesCount').text(expenses.length);
    $('#saveAll').prop('disabled', expenses.length === 0);
  }

  function loadExpData() {
    $('#loadMe').modal('show');
    POSTREQUEST({ url: URLS.getData, data: {} })
      .then((resp) => {
        $('#loadMe').modal('hide');
        hideLoading();
        if (!resp.success) {
          toastr.error(lang(resp.message_swa, resp.message_eng));
          return;
        }
        bucketExpenses(resp.expenses);
        paymentAccounts = resp.payment_accounts || [];
        stockItems = (resp.stock_items || []).map((s) => ({
          id: String(s.id),
          name: s.name,
          idadi: s.idadi,
          Bei_kununua: s.Bei_kununua,
          uwiano: s.uwiano,
        }));
        staffMembers = (resp.staff || []).map((s) => ({ id: String(s.id), name: s.name, tin: s.tin }));
        refreshTaxGroupSelect(resp.tax_groups || []);
        fillAccounts();
        setupAutocomplete($('#staffMember'), $('#staffMemberList'), $('#staffMemberValue'), staffMembers);
        toggleFields();
      })
      .catch(() => {
        $('#loadMe').modal('hide');
        hideLoading();
      });
  }

  $(document).ready(() => {
    setDefaultDateTime();
    setBillsPanelVisible(false);
    setNewTaxPanelVisible(false);
    loadExpData();

    $amount.on('input', function () {
      const el = this;
      const pos = el.selectionStart;
      const before = el.value.length;
      el.value = formatAmountInput(el.value);
      const after = el.value.length;
      const next = Math.max(0, (pos || 0) + (after - before));
      try {
        el.setSelectionRange(next, next);
      } catch (e) { /* ignore */ }
    });

    $type.on('change', () => {
      $item.val('');
      $itemVal.val('');
      $prodItem.val('');
      $prodVal.val('');
      $prodQty.val('');
      $('#productStockHint').text('');
      toggleFields();
    });
    $('#recipientType').on('change', updateRecipient);

    $('#addBtn').on('click', () => {
      const row = validateRow();
      if (!row) return;
      expenses.push(row);
      renderQueue();
      clearLineFormAfterAdd();
    });

    $('.exp-records-page').on('click', '.recylebtn[data-targets]', function (e) {
      e.preventDefault();
      $(this).toggleClass('activeRecyle');
    });

    $('#tableBody').on('click', '.exp-rm', function () {
      const i = Number($(this).data('i'));
      expenses.splice(i, 1);
      renderQueue();
    });

    $('#expenseForm').on('submit', (e) => {
      e.preventDefault();
      if (!expenses.length) return;
      const csrf = $('input[name=csrfmiddlewaretoken]').val();
      const payload = expenses.map((r) => r.payload);
      $('#loadMe').modal('show');
      $.ajax({
        type: 'POST',
        url: URLS.saveBatch,
        data: {
          csrfmiddlewaretoken: csrf,
          expenses_json: JSON.stringify(payload),
          expDate: $dt.val() || '',
        },
      }).done((res) => {
        $('#loadMe').modal('hide');
        hideLoading();
        if (res.success) {
          toastr.success(lang(res.message_swa, res.message_eng));
          expenses.length = 0;
          renderQueue();
          loadExpData();
        } else {
          toastr.error(lang(res.message_swa, res.message_eng));
        }
      }).fail(() => {
        $('#loadMe').modal('hide');
        hideLoading();
      });
    });

    $('#expNewTaxGroup').on('change', function () {
      setNewTaxPanelVisible($(this).is(':checked'));
    });

    $('#expDefineType').on('change', function () {
      setBillsPanelVisible($(this).val() === 'bills');
    });

    $('#expenseDefineModal').on('show.bs.modal', () => {
      setBillsPanelVisible($('#expDefineType').val() === 'bills');
    });

    $('#expBillPeriodType').on('change', function () {
      const labels = {
        daily: lang('(Siku)', '(Days)'),
        weekly: lang('(Wiki)', '(Weeks)'),
        monthly: lang('(Miezi)', '(Months)'),
        yearly: lang('(Miaka)', '(Years)'),
      };
      $('#expPeriodLabel').text(labels[$(this).val()] || labels.daily);
    });

    $('#expenseDefineModal').on('hidden.bs.modal', resetExpenseDefineForm);

    $('#expenseDefineForm').on('submit', function (e) {
      e.preventDefault();
      const name = ($('#expDefineName').val() || '').trim();
      const expType = $('#expDefineType').val();
      if (!name) {
        toastr.warning(lang('Andika jina la matumizi', 'Enter expense name'));
        return;
      }
      if (!expType) {
        toastr.warning(lang('Chagua aina ya matumizi', 'Select expense type'));
        return;
      }
      if ($('#expNewTaxGroup').is(':checked') && !($('#expTaxName').val() || '').trim()) {
        toastr.warning(lang('Andika jina la kundi la kodi', 'Enter tax group name'));
        return;
      }
      if (expType === 'bills') {
        if (!(Number($('#expBillPeriodCount').val()) > 0)) {
          toastr.warning(lang('Weka idadi ya vipindi', 'Enter period count'));
          return;
        }
        if (!$('#expLastPaymentDate').val()) {
          toastr.warning(lang('Chagua tarehe ya mwisho kulipa', 'Select last payment date'));
          return;
        }
      }
      const csrf = $('input[name=csrfmiddlewaretoken]').val();
      const data = {
        csrfmiddlewaretoken: csrf,
        edit: $('#expDefineEdit').val() || 0,
        groupName: name,
        expType,
        attachReceipt: $('#expDefineReceipt').is(':checked') ? 1 : 0,
        taxGroup: $('#expTaxGroupSelect').val() || 0,
        newTaxGroup: $('#expNewTaxGroup').is(':checked') ? 1 : 0,
        TaxGroupName: $('#expTaxName').val(),
        TaxGroupRate: $('#expTaxRate').val() || 0,
        billPeriodType: $('#expBillPeriodType').val(),
        billPeriodCount: $('#expBillPeriodCount').val() || 0,
        billAmount: $('#expDefineBillAmount').val() || 0,
        isRecurringAmount: $('#expBillDepends').is(':checked') ? 1 : 0,
        lastPaymentDate: $('#expLastPaymentDate').val() || '',
      };
      $('#loadMe').modal('show');
      $.post(URLS.saveGroup, data).done((res) => {
        $('#loadMe').modal('hide');
        hideLoading();
        if (res.success) {
          toastr.success(lang(res.message_swa, res.message_eng));
          $('#expenseDefineModal').modal('hide');
          loadExpData();
        } else {
          toastr.error(lang(res.message_swa, res.message_eng));
        }
      }).fail(() => {
        $('#loadMe').modal('hide');
        hideLoading();
      });
    });

    $(document).on('click', (ev) => {
      if (!$(ev.target).closest('#expenseItemWrapper, #staffWrapper, #productStockWrapper').length) {
        $('.exp-ac-list').addClass('hidden');
      }
    });
  });
})();
