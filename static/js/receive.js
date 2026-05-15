(function () {
  if (!window.jQuery || !window.moment) {
    return;
  }

  const state = {
    rows: [],
    periods: [],
    activeId: 1,
    viewMode: 0,
    chart: null,
  };

  function n(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function text(sw, en) {
    if (typeof window.lang === "function") {
      return window.lang(sw, en);
    }

    return en;
  }

  function getCsrfToken() {
    return $("input[name='csrfmiddlewaretoken']").first().val() || "";
  }

  function formatNumber(value) {
    return n(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  function toDateText(value) {
    return value ? moment(value).format("ddd, DD/MM/YYYY HH:mm") : "-";
  }

  function setLoading(show) {
    const modal = $("#loadMe");
    if (!modal.length || typeof modal.modal !== "function") {
      return;
    }

    modal.modal(show ? "show" : "hide");
  }

  function getFetchRange() {
    const start = $("#TransferReportStart").val();
    return {
      tf: start ? moment(start).startOf("day").format() : moment().startOf("month").format(),
      tt: moment().endOf("day").format(),
    };
  }

  function groupRows(rows) {
    const grouped = {};

    rows.forEach((row) => {
      const receiveId = n(row.receive_id);
      const key = [
        receiveId,
        row.transfer_code || "",
        row.from_branch_id || 0,
        row.to_branch_id || 0,
        row.tarehe || "",
      ].join("|");

      if (!grouped[key]) {
        grouped[key] = {
          receive_id: receiveId,
          transfer_code: row.transfer_code || "-",
          from_branch_name: row.from_branch_name || "-",
          to_branch_name: row.to_branch_name || "-",
          tarehe: row.tarehe || null,
          item_map: {},
          item_names: {},
          unit_names: {},
          item_qty_map: {},
          qty: 0,
          value: 0,
          worth: 0,
        };
      }

      const qty = n(row.qty);
      const uwiano = n(row.uwiano) || 1;
      const baseQty = qty / uwiano;

      grouped[key].qty += baseQty;
      grouped[key].value += n(row.buy_price) * baseQty;
      grouped[key].worth += n(row.sale_price) * baseQty;

      if (n(row.item_id) > 0) {
        const itemId = n(row.item_id);
        grouped[key].item_map[itemId] = true;
        grouped[key].item_names[itemId] = row.item_name || "-";
        const uwianoVal = n(row.uwiano) || 1;
        const unitName = uwianoVal > 1 ? (row.item_pack_unit || row.item_unit || "-") : (row.item_unit || row.item_pack_unit || "-");
        grouped[key].unit_names[itemId] = unitName;
        grouped[key].item_qty_map[itemId] = (grouped[key].item_qty_map[itemId] || 0) + baseQty;
      }
    });

    return Object.values(grouped)
      .map(function (row) {
        row.items_count = Object.keys(row.item_map).length;
        row.item_details_html = Object.keys(row.item_map).map(function (itemId) {
          const name = row.item_names[itemId] || "-";
          const qty = formatNumber(row.item_qty_map[itemId] || 0);
          const unit = row.unit_names[itemId] || "-";
          return `${name} (${qty} ${unit})`;
        }).join("<br>") || "-";
        delete row.item_map;
        delete row.item_names;
        delete row.unit_names;
        delete row.item_qty_map;
        return row;
      })
      .sort(function (a, b) {
        return moment(b.tarehe).valueOf() - moment(a.tarehe).valueOf();
      });
  }

  function buildPeriods() {
    const now = moment();
    state.periods = [
      {
        id: 1,
        name: text("Leo", "Today"),
        from: moment().startOf("day"),
        to: now,
      },
      {
        id: 2,
        name: text("Wiki hii", "This Week"),
        from: moment().startOf("isoWeek"),
        to: now,
      },
      {
        id: 3,
        name: text("Mwezi huu", "This Month"),
        from: moment().startOf("month"),
        to: now,
      },
    ];
  }

  function addPeriod(name, from, to) {
    const existing = state.periods.filter(function (period) {
      return period.name === name && period.from.format() === from.format() && period.to.format() === to.format();
    })[0];

    if (existing) {
      state.activeId = existing.id;
      return;
    }

    state.periods.push({
      id: state.periods.length ? state.periods[state.periods.length - 1].id + 1 : 1,
      name: name,
      from: from,
      to: to,
    });
    state.activeId = state.periods[state.periods.length - 1].id;
  }

  function resolveRange(code, edge) {
    switch (code) {
      case "yesterday":
        return edge === "from" ? moment().subtract(1, "day").startOf("day") : moment().subtract(1, "day").endOf("day");
      case "lastWeek":
        return edge === "from"
          ? moment().startOf("isoWeek").subtract(1, "week").startOf("isoWeek")
          : moment().startOf("isoWeek").subtract(1, "week").endOf("isoWeek");
      case "lastMonth":
        return edge === "from"
          ? moment().startOf("month").subtract(1, "month").startOf("month")
          : moment().startOf("month").subtract(1, "month").endOf("month");
      case "thisYear":
        return edge === "from" ? moment().startOf("year") : moment().endOf("day");
      case "lastYear":
        return edge === "from"
          ? moment().subtract(1, "year").startOf("year")
          : moment().subtract(1, "year").endOf("year");
      case "today":
      default:
        return edge === "from" ? moment().startOf("day") : moment().endOf("day");
    }
  }

  function periodRows(period) {
    return state.rows.filter(function (row) {
      const date = moment(row.tarehe);
      return date.isSameOrAfter(period.from) && date.isSameOrBefore(period.to);
    });
  }

  function summarizePeriod(period) {
    const rows = periodRows(period);
    const grouped = groupRows(rows);
    const uniqueItems = {};

    rows.forEach(function (row) {
      if (n(row.item_id) > 0) {
        uniqueItems[n(row.item_id)] = true;
      }
    });

    return {
      grouped: grouped,
      transfers: grouped.length,
      items: Object.keys(uniqueItems).length,
      qty: grouped.reduce(function (sum, row) { return sum + row.qty; }, 0),
      value: grouped.reduce(function (sum, row) { return sum + row.value; }, 0),
      worth: grouped.reduce(function (sum, row) { return sum + row.worth; }, 0),
    };
  }

  function renderSummary() {
    const body = $("#TransferSummaryBody");
    if (!body.length) {
      return;
    }

    let html = "";
    state.periods.forEach(function (period) {
      const summary = summarizePeriod(period);
      const activeClass = state.activeId === period.id ? "table-info" : "";
      html += `<tr class="${activeClass}" id="TransferPeriodRow${period.id}">`;
      html += `<td>${period.name}</td>`;
      html += `<td class="text-right weight600">${formatNumber(summary.transfers)}</td>`;
      html += `<td class="text-right">${formatNumber(summary.items)}</td>`;
      html += `<td class="text-right">${formatNumber(summary.qty)}</td>`;
      html += `<td class="text-right">${formatNumber(summary.value)}</td>`;
      html += `<td class="text-right">${formatNumber(summary.worth)}</td>`;
      html += `<td class="text-right"><button type="button" class="btn btn-sm btn-light border transfer-period-btn" data-period="${period.id}">${text("Onesha zaidi", "More Info")}</button>`;
      if (period.id > 3) {
        html += ` <button type="button" class="btn btn-sm btn-light border text-danger remove-transfer-period-btn" data-period="${period.id}">&times;</button>`;
      }
      html += `</td>`;
      html += "</tr>";
    });

    body.html(html);
  }

  function renderDetails() {
    const body = $("#TransferedItemsTableBody");
    const title = $("#TransferDetailTitle");
    const period = state.periods.filter(function (item) {
      return item.id === state.activeId;
    })[0];

    if (!body.length || !period) {
      return;
    }

    const grouped = summarizePeriod(period).grouped;
    let html = "";
    let qtyTotal = 0;
    let valueTotal = 0;
    let worthTotal = 0;

    grouped.forEach(function (row) {
      qtyTotal += row.qty;
      valueTotal += row.value;
      worthTotal += row.worth;

      html += "<tr>";
      html += `<td>${toDateText(row.tarehe)}</td>`;
      html += `<td>${row.transfer_code}</td>`;
      html += `<td>${row.to_branch_name}</td>`;
      html += `<td>${row.item_details_html}</td>`;
      html += `<td class="text-right">${formatNumber(row.qty)}</td>`;
      html += `<td class="text-right">${formatNumber(row.value)}</td>`;
      html += `<td class="text-right">${formatNumber(row.worth)}</td>`;
      html += "</tr>";
    });

    if (!grouped.length) {
      html = `<tr><td colspan="7" class="text-center text-muted py-3">${text("Hakuna taarifa kwenye muda huu", "No data in this period")}</td></tr>`;
    }

    title.text(`${text("Maelezo ya", "Details for")} ${period.name}`);
    body.html(html);
    $("#TransferQtyTotal").text(formatNumber(qtyTotal));
    $("#TransferValueTotal").text(formatNumber(valueTotal));
    $("#TransferWorthTotal").text(formatNumber(worthTotal));
  }

  function destroyChart() {
    if (state.chart && typeof state.chart.destroy === "function") {
      state.chart.destroy();
    }
    state.chart = null;
  }

  function renderChart() {
    const panel = $("#TransferChartPanel");
    const canvas = document.getElementById("TransferPeriodChart");
    const period = state.periods.filter(function (item) {
      return item.id === state.activeId;
    })[0];

    if (!panel.length || !canvas || !period || typeof window.Chart === "undefined") {
      return;
    }

    const grouped = summarizePeriod(period).grouped;
    const byDay = {};

    grouped.forEach(function (row) {
      const day = moment(row.tarehe).format("YYYY-MM-DD");
      if (!byDay[day]) {
        byDay[day] = { qty: 0, value: 0, worth: 0, transfers: 0 };
      }
      byDay[day].qty += row.qty;
      byDay[day].value += row.value;
      byDay[day].worth += row.worth;
      byDay[day].transfers += 1;
    });

    const labels = Object.keys(byDay).sort();
    destroyChart();

    state.chart = new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: labels.map(function (label) {
          return moment(label).format("ddd, DD/MM");
        }),
        datasets: [
          {
            label: text("Transfers", "Transfers"),
            backgroundColor: "#1a8cff55",
            borderColor: "#1a8cff",
            borderWidth: 1,
            data: labels.map(function (label) { return byDay[label].transfers; }),
          },
          {
            label: text("Qty", "Qty"),
            backgroundColor: "#20a15b55",
            borderColor: "#20a15b",
            borderWidth: 1,
            data: labels.map(function (label) { return Number(byDay[label].qty.toFixed(2)); }),
          },
          {
            label: text("Value", "Value"),
            backgroundColor: "#c57b1555",
            borderColor: "#c57b15",
            borderWidth: 1,
            data: labels.map(function (label) { return Number(byDay[label].value.toFixed(2)); }),
          },
          {
            label: text("Worth", "Worth"),
            backgroundColor: "#6b4fc955",
            borderColor: "#6b4fc9",
            borderWidth: 1,
            data: labels.map(function (label) { return Number(byDay[label].worth.toFixed(2)); }),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
    });
  }

  function applyViewMode() {
    const listPanel = $("#TransferListPanel");
    const chartPanel = $("#TransferChartPanel");

    $(".transfer-view-btn").addClass("btn-light").removeClass("btn-secondary");
    $(`.transfer-view-btn[data-r='${state.viewMode}']`).removeClass("btn-light").addClass("btn-secondary");

    if (state.viewMode === 1) {
      listPanel.hide();
      chartPanel.show();
      renderChart();
    } else {
      chartPanel.hide();
      listPanel.show();
      destroyChart();
    }
  }

  function renderAll() {
    renderSummary();
    renderDetails();
    applyViewMode();
  }

  function fetchTransferedItems() {
    const range = getFetchRange();
    const payload = {
      csrfmiddlewaretoken: getCsrfToken(),
      tf: range.tf,
      tt: range.tt,
      branch: $("#BranchFilter").val() || 0,
      transfer_to: $("#TransferToFilter").val() || 0,
    };

    setLoading(true);
    $.ajax({
      type: "POST",
      url: "/riport/TransferedItemsData",
      data: payload,
      success: function (res) {
        state.rows = res && res.success ? res.rows || [] : [];
        buildPeriods();
        state.activeId = 1;
        renderAll();
      },
      error: function () {
        state.rows = [];
        buildPeriods();
        state.activeId = 1;
        renderAll();
      },
      complete: function () {
        setLoading(false);
      },
    });
  }

  function init() {
    if (!$("#TransferSummaryBody").length) {
      return;
    }

    $("#RunTransferReport").on("click", fetchTransferedItems);
    $("#BranchFilter, #TransferToFilter").on("change", fetchTransferedItems);
    $("body").on("click", ".transfer-period-btn", function () {
      state.activeId = n($(this).data("period")) || 1;
      renderAll();
    });
    $("body").on("click", ".remove-transfer-period-btn", function () {
      const periodId = n($(this).data("period"));
      state.periods = state.periods.filter(function (period) {
        return period.id !== periodId;
      });
      state.activeId = state.periods.length ? state.periods[0].id : 1;
      renderAll();
    });
    $("body").on("click", ".transfer-view-btn", function () {
      state.viewMode = n($(this).data("r"));
      applyViewMode();
    });
    $("body").on("click", ".add-transfer-period", function (event) {
      event.preventDefault();
      const name = text($(this).data("name-swa"), $(this).data("name-eng"));
      const from = resolveRange($(this).data("from"), "from");
      const to = resolveRange($(this).data("to"), "to");
      addPeriod(name, from, to);
      renderAll();
    });

    fetchTransferedItems();

    $("#PrintTransferReport").on("click", printTransferReport);
  }

  function printTransferReport() {
    const table = document.getElementById("tranferedItemsDetailTable");
    if (!table) { return; }

    const shopName = $("#currencii").closest("[data-shop-name]").data("shop-name") ||
      document.title.replace(/[-|].*$/, "").trim() ||
      "";

    const dukaName = (function () {
      const el = document.querySelector("[data-duka-name]");
      return el ? el.getAttribute("data-duka-name") : (shopName || "");
    })();

    const dukaId = (function () {
      const sel = document.getElementById("BranchFilter");
      if (!sel) { return ""; }
      const opt = sel.options[0];
      return sel.value + (opt ? " — " + opt.text : "");
    })();

    const printedBy = (function () {
      const el = document.querySelector("[data-username]") || document.querySelector(".user-name");
      return el ? (el.getAttribute("data-username") || el.textContent.trim()) : "";
    })();

    const period = (function () {
      const title = $("#TransferDetailTitle").text().trim();
      return title || text("Ripoti ya Kuhamisha Bidhaa", "Transferred Items Report");
    })();

    const printDate = moment().format("ddd, DD MMM YYYY HH:mm");

    const tableHtml = table.outerHTML;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${text("Ripoti ya Kuhamisha Bidhaa", "Transferred Items Report")}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #222; margin: 0; padding: 16px; }
    .print-header { text-align: center; margin-bottom: 12px; }
    .print-header h2 { margin: 0 0 2px; font-size: 1.2rem; }
    .print-header h4 { margin: 0 0 4px; font-size: 1rem; color: #444; }
    .print-meta { font-size: .85rem; color: #555; margin-bottom: 16px; text-align: center; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #ccc; padding: 5px 8px; }
    thead th { background: #f0f0f0; font-weight: bold; }
    .text-right { text-align: right; }
    tfoot tr { background: #f8f8f8; font-weight: bold; }
    @media print { body { margin: 0; padding: 8px; } }
  </style>
</head>
<body>
  <div class="print-header">
    <h2>${dukaName || text("Biashara", "Business")}</h2>
    <h4>${text("Ripoti ya Kuhamisha Bidhaa", "Transferred Items Report")}</h4>
    ${dukaId ? "<div class='print-meta'><strong>" + text("Tawi", "Branch") + ":</strong> " + dukaId + "</div>" : ""}
  </div>
  <div class="print-meta">
    <strong>${text("Kipindi", "Period")}:</strong> ${period} &nbsp;&nbsp;
    <strong>${text("Tarehe ya Kuchapisha", "Printed")}:</strong> ${printDate}
    ${printedBy ? " &nbsp;&nbsp;<strong>" + text("Na", "By") + ":</strong> " + printedBy : ""}
  </div>
  ${tableHtml}
  <script>window.onload=function(){window.print();};<\/script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  $(document).ready(init);
})();
