// ===== Chart Instances =====
let mainChart = null;
let drawdownChart = null;
let rollingChart = null;
let currentResults = null;
let currentMode = "basic";

// ===== Tooltip definitions for technical terms =====
const TERM_TIPS = {
  "CAGR": "年平均成長率。毎年平均何%ずつ増えたかを示す指標",
  "MDD": "最大下落率。最高値から最も大きく下がった時の下落幅",
  "ボラティリティ": "価格変動の大きさ。数値が大きいほど値動きが激しくリスクが高い",
  "シャープレシオ": "リスクに対するリターンの効率性。数値が高いほどリスクの割にリターンが良い",
};
function tip(term) {
  const t = TERM_TIPS[term];
  return t ? ` <span class="tip" data-tip="${t}">&#9432;</span>` : "";
}

// ===== Tooltip click/tap support for mobile =====
document.addEventListener("click", (e) => {
  const tip = e.target.closest(".tip");
  if (tip) {
    e.stopPropagation();
    document.querySelectorAll(".tip.active").forEach(el => { if (el !== tip) el.classList.remove("active"); });
    tip.classList.toggle("active");
  } else {
    document.querySelectorAll(".tip.active").forEach(el => el.classList.remove("active"));
  }
});

// ===== DOM Ready =====
document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  setDateRange();
  updateLeverageOptions();
});

// ===== Set initial date range from data =====
function setDateRange() {
  updateDateConstraints();
  const data = INDEX_DATA_MAP[document.getElementById("indexSelect").value]();
  const dataStart = data[0][0];
  const defaultStart = "2000-01-03";
  // Use data start if default is before available data
  document.getElementById("startDate").value = defaultStart < dataStart ? dataStart : defaultStart;
  document.getElementById("endDate").value = data[data.length - 1][0];
}

// ===== Update date input min/max based on selected index data =====
function updateDateConstraints() {
  const indexKey = document.getElementById("indexSelect").value;
  const data = INDEX_DATA_MAP[indexKey]();
  const minDate = data[0][0];
  const maxDate = data[data.length - 1][0];

  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");

  startInput.min = minDate;
  startInput.max = maxDate;
  endInput.min = minDate;
  endInput.max = maxDate;

  // Clamp current values if out of range
  if (startInput.value < minDate) startInput.value = minDate;
  if (startInput.value > maxDate) startInput.value = maxDate;
  if (endInput.value < minDate) endInput.value = minDate;
  if (endInput.value > maxDate) endInput.value = maxDate;
}

// ===== Event Bindings =====
function bindEvents() {
  // Run backtest
  document.getElementById("runBacktest").addEventListener("click", executeBacktest);

  // Mode toggle
  document.getElementById("modeBeginner").addEventListener("click", () => setMode("beginner"));
  document.getElementById("modeBasic").addEventListener("click", () => setMode("basic"));
  document.getElementById("modeExpert").addEventListener("click", () => setMode("expert"));

  // Investment type toggle
  document.querySelectorAll('input[name="investType"]').forEach((r) => {
    r.addEventListener("change", () => {
      document.getElementById("dcaSettings").classList.toggle("hidden", r.value !== "dca" || !r.checked);
    });
  });

  // Index change — update date constraints and available leverages
  document.getElementById("indexSelect").addEventListener("change", () => {
    updateDateConstraints();
    updateLeverageOptions();
  });

  // Currency change — update labels and defaults
  document.querySelectorAll('input[name="currency"]').forEach((r) => {
    r.addEventListener("change", () => {
      updateCurrency(r.value);
    });
  });

  // Crisis presets
  document.getElementById("crisisPreset").addEventListener("change", (e) => {
    const preset = CRISIS_PRESETS[e.target.value];
    if (preset) {
      const data = INDEX_DATA_MAP[document.getElementById("indexSelect").value]();
      const firstDate = data[0][0];
      const lastDate = data[data.length - 1][0];
      // Clamp preset start to data range
      document.getElementById("startDate").value = preset.start < firstDate ? firstDate : preset.start;
      document.getElementById("endDate").value = preset.end > lastDate ? lastDate : preset.end;
    } else if (e.target.value === "recent10" || e.target.value === "recent5") {
      const data = INDEX_DATA_MAP[document.getElementById("indexSelect").value]();
      const lastDate = data[data.length - 1][0];
      const years = e.target.value === "recent10" ? 10 : 5;
      const startYear = parseInt(lastDate.substring(0, 4)) - years;
      document.getElementById("startDate").value = `${startYear}${lastDate.substring(4)}`;
      document.getElementById("endDate").value = lastDate;
    }
  });

  // Expert test type
  document.getElementById("expertTestType").addEventListener("change", (e) => {
    document.getElementById("rollingSettings").classList.toggle("hidden", e.target.value !== "rolling");
  });

  // Chart scale
  document.getElementById("scaleLinear").addEventListener("click", () => setChartScale("linear"));
  document.getElementById("scaleLog").addEventListener("click", () => setChartScale("logarithmic"));
}

// ===== Currency Toggle =====
const CURRENCY_DEFAULTS = {
  USD: { initial: 10000, dca: 500, step: 100, dcaStep: 50, symbol: "$" },
  JPY: { initial: 1500000, dca: 50000, step: 10000, dcaStep: 5000, symbol: "¥" },
};

function updateCurrency(currency) {
  currentCurrency = currency;
  const cfg = CURRENCY_DEFAULTS[currency];
  const sym = cfg.symbol;

  document.getElementById("initialAmountLabel").textContent = `初期投資額 (${sym})`;
  document.getElementById("dcaAmountLabel").textContent = `定期積立額 (${sym})`;

  const initialInput = document.getElementById("initialAmount");
  const dcaInput = document.getElementById("dcaAmount");

  initialInput.value = cfg.initial;
  initialInput.step = cfg.step;
  initialInput.min = cfg.step;
  dcaInput.value = cfg.dca;
  dcaInput.step = cfg.dcaStep;
}

// ===== Update Leverage Options Based on Selected Index =====
function updateLeverageOptions() {
  const indexKey = document.getElementById("indexSelect").value;
  const available = getAvailableLeverages(indexKey);

  document.querySelectorAll('input[name="leverage"]').forEach((radio) => {
    const val = radio.value;
    if (val === "all") {
      // "all" shows only available leverages
      radio.closest(".radio-label").style.display = "";
      return;
    }
    const lev = parseInt(val);
    const etf = getETFInfo(indexKey, lev);
    const label = radio.closest(".radio-label");
    if (etf) {
      label.style.display = "";
      label.querySelector(".etf-badge")?.remove();
      const badge = document.createElement("span");
      badge.className = "etf-badge";
      badge.textContent = etf.ticker;
      label.appendChild(badge);
    } else {
      label.style.display = "none";
      if (radio.checked) {
        // Fall back to 1x
        document.querySelector('input[name="leverage"][value="1"]').checked = true;
      }
    }
  });

  // Update expense ratio display
  const expenseEl = document.getElementById("expenseInfo");
  if (expenseEl) {
    const parts = available.map((lev) => {
      const etf = getETFInfo(indexKey, lev);
      return etf ? `${etf.ticker}(${lev}x): ${(etf.expense * 100).toFixed(2)}%` : null;
    }).filter(Boolean);
    expenseEl.textContent = parts.join(", ");
  }
}

// ===== Mode Toggle =====
function setMode(mode) {
  currentMode = mode;
  document.getElementById("modeBeginner").classList.toggle("active", mode === "beginner");
  document.getElementById("modeBasic").classList.toggle("active", mode === "basic");
  document.getElementById("modeExpert").classList.toggle("active", mode === "expert");
  document.getElementById("beginnerSettings").classList.toggle("hidden", mode !== "beginner");
  document.getElementById("periodSection").classList.toggle("hidden", mode === "beginner");
  document.getElementById("crisisSection").classList.toggle("hidden", mode === "beginner");
  document.getElementById("expertSettings").classList.toggle("hidden", mode !== "expert");
}

// ===== Chart Scale =====
function setChartScale(scale) {
  document.getElementById("scaleLinear").classList.toggle("active", scale === "linear");
  document.getElementById("scaleLog").classList.toggle("active", scale === "logarithmic");
  if (mainChart) {
    mainChart.options.scales.y.type = scale;
    mainChart.update();
  }
}

// ===== Execute Backtest =====
function executeBacktest() {
  const indexKey = document.getElementById("indexSelect").value;
  const leverageVal = document.querySelector('input[name="leverage"]:checked').value;

  const opts = {
    initialAmount: parseFloat(document.getElementById("initialAmount").value) || 0,
    investType: document.querySelector('input[name="investType"]:checked').value,
    dcaAmount: parseFloat(document.getElementById("dcaAmount").value) || 0,
    dcaFrequency: document.getElementById("dcaFrequency").value,
    dcaIncrease: parseFloat(document.getElementById("dcaIncrease").value) || 0,
    includeExpense: document.getElementById("includeExpense").checked,
  };

  if (opts.initialAmount <= 0) {
    alert("初期投資額を入力してください。");
    return;
  }

  const available = getAvailableLeverages(indexKey);
  const leverages = leverageVal === "all" ? available : [parseInt(leverageVal)];
  opts.indexKey = indexKey;

  // Beginner mode: use most recent N years of full data
  if (currentMode === "beginner") {
    const fullData = INDEX_DATA_MAP[indexKey]();
    const years = parseInt(document.getElementById("beginnerYears").value) || 10;
    const days = years * 252;
    const data = fullData.length > days ? fullData.slice(fullData.length - days) : fullData;
    if (data.length < 10) {
      alert("データが不足しています。");
      return;
    }
    executeStandardBacktest(data, leverages, opts, indexKey);
    return;
  }

  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const data = getIndexData(indexKey, startDate, endDate);
  if (data.length < 10) {
    alert("選択した期間のデータが不足しています。期間を調整してください。");
    return;
  }

  // Expert mode
  if (currentMode === "expert") {
    const testType = document.getElementById("expertTestType").value;
    if (testType === "rolling") {
      executeRollingBacktest(data, leverages, opts);
      return;
    }
  }

  executeStandardBacktest(data, leverages, opts, indexKey);
}

// ===== Standard Backtest =====
function executeStandardBacktest(data, leverages, opts, indexKey) {
  const results = leverages.map((lev) => runBacktest(data, lev, opts));
  currentResults = results;

  // Show results
  document.getElementById("resultsPlaceholder").classList.add("hidden");
  document.getElementById("resultsContent").classList.remove("hidden");
  document.getElementById("rollingSection").classList.add("hidden");
  document.getElementById("drawdownSection").classList.remove("hidden");
  document.getElementById("yearlySection").classList.remove("hidden");

  renderStatsCards(results);
  renderMainChart(results, INDEX_LABELS[indexKey] || indexKey);
  renderDrawdownChart(results);
  renderStatsTable(results);
  renderYearlyTable(results);
}

// ===== Rolling Backtest =====
function executeRollingBacktest(data, leverages, opts) {
  const rollingYears = parseInt(document.getElementById("rollingYears").value) || 5;
  const rollingResults = leverages.map((lev) => runRollingBacktest(data, lev, rollingYears, opts));

  document.getElementById("resultsPlaceholder").classList.add("hidden");
  document.getElementById("resultsContent").classList.remove("hidden");
  document.getElementById("drawdownSection").classList.add("hidden");
  document.getElementById("yearlySection").classList.add("hidden");
  document.getElementById("rollingSection").classList.remove("hidden");

  renderRollingStatsCards(rollingResults);
  renderRollingChart(rollingResults, rollingYears);
  renderRollingStatsTable(rollingResults);

  // Also run a full period backtest for the main chart
  const fullResults = leverages.map((lev) => runBacktest(data, lev, opts));
  renderMainChart(fullResults, `全期間 (ローリング${rollingYears}年参考)`);
}

// ===== Render Stats Cards =====
function renderStatsCards(results) {
  const container = document.getElementById("statsCards");
  const primary = results[results.length - 1]; // highest leverage

  const cards = [];
  const etfTag = (r) => r.etfInfo ? r.etfInfo.ticker : `${r.leverage}x`;
  results.forEach((r) => {
    cards.push(
      { label: `最終資産 (${etfTag(r)})`, value: formatMoney(r.finalValue), cls: r.totalReturn >= 0 ? "positive" : "negative" },
    );
  });
  cards.push(
    { label: "総投資額", value: formatMoney(primary.totalInvested), cls: "" },
  );
  results.forEach((r) => {
    cards.push(
      { label: `CAGR${tip("CAGR")} (${etfTag(r)})`, value: formatPct(r.cagr), cls: r.cagr >= 0 ? "positive" : "negative" },
    );
  });
  results.forEach((r) => {
    cards.push(
      { label: `MDD${tip("MDD")} (${etfTag(r)})`, value: formatPct(r.maxDrawdown), cls: "negative" },
    );
  });

  container.innerHTML = cards
    .map((c) => `
      <div class="stat-card">
        <div class="stat-value ${c.cls}">${c.value}</div>
        <div class="stat-label">${c.label}</div>
      </div>
    `).join("");
}

// ===== Render Main Chart =====
function renderMainChart(results, title) {
  const ctx = document.getElementById("mainChart").getContext("2d");
  if (mainChart) mainChart.destroy();

  document.getElementById("chartTitle").textContent = `資産推移 - ${title}`;

  // Downsample for performance (max ~1000 points per series)
  const maxPoints = 1000;

  const datasets = results.map((r) => {
    const step = Math.max(1, Math.floor(r.dates.length / maxPoints));
    const sampledDates = [];
    const sampledValues = [];
    for (let i = 0; i < r.dates.length; i += step) {
      sampledDates.push(r.dates[i]);
      sampledValues.push(r.values[i]);
    }
    // Always include last point
    if (sampledDates[sampledDates.length - 1] !== r.dates[r.dates.length - 1]) {
      sampledDates.push(r.dates[r.dates.length - 1]);
      sampledValues.push(r.values[r.values.length - 1]);
    }

    const color = LEVERAGE_COLORS[r.leverage];
    const etfLabel = r.etfInfo ? `${r.etfInfo.ticker} (${r.leverage}x)` : `${r.leverage}x`;
    return {
      label: etfLabel,
      data: sampledDates.map((d, i) => ({ x: d, y: sampledValues[i] })),
      borderColor: color.line,
      backgroundColor: color.bg,
      borderWidth: 2,
      pointRadius: 0,
      fill: results.length === 1,
      tension: 0.1,
    };
  });

  mainChart = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${formatMoney(ctx.parsed.y)}`,
          },
        },
        legend: { labels: { color: "#e4e6eb" } },
      },
      scales: {
        x: {
          type: "time",
          time: { unit: "year" },
          ticks: { color: "#8b8fa3" },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
        y: {
          type: "linear",
          ticks: {
            color: "#8b8fa3",
            callback: (v) => formatMoney(v),
          },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
      },
    },
  });
}

// ===== Render Drawdown Chart =====
function renderDrawdownChart(results) {
  const ctx = document.getElementById("drawdownChart").getContext("2d");
  if (drawdownChart) drawdownChart.destroy();

  const maxPoints = 1000;

  const datasets = results.map((r) => {
    const step = Math.max(1, Math.floor(r.dates.length / maxPoints));
    const sampled = [];
    for (let i = 0; i < r.dates.length; i += step) {
      sampled.push({ x: r.dates[i], y: r.drawdowns[i] * 100 });
    }

    const color = LEVERAGE_COLORS[r.leverage];
    const etfLabel = r.etfInfo ? `${r.etfInfo.ticker} (${r.leverage}x)` : `${r.leverage}x`;
    return {
      label: `${etfLabel} ドローダウン`,
      data: sampled,
      borderColor: color.line,
      backgroundColor: color.bg,
      borderWidth: 1.5,
      pointRadius: 0,
      fill: true,
      tension: 0.1,
    };
  });

  drawdownChart = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}%`,
          },
        },
        legend: { labels: { color: "#e4e6eb" } },
      },
      scales: {
        x: {
          type: "time",
          time: { unit: "year" },
          ticks: { color: "#8b8fa3" },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
        y: {
          ticks: {
            color: "#8b8fa3",
            callback: (v) => v.toFixed(0) + "%",
          },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
      },
    },
  });
}

// ===== Render Rolling Chart =====
function renderRollingChart(rollingResults, rollingYears) {
  const ctx = document.getElementById("rollingChart").getContext("2d");
  if (rollingChart) rollingChart.destroy();

  document.getElementById("rollingTitle").textContent = `ローリング ${rollingYears}年 CAGR`;

  const datasets = rollingResults.map((rr) => {
    const color = LEVERAGE_COLORS[rr.leverage];
    // Downsample
    const step = Math.max(1, Math.floor(rr.results.length / 500));
    const sampled = [];
    for (let i = 0; i < rr.results.length; i += step) {
      sampled.push({ x: rr.results[i].startDate, y: rr.results[i].cagr * 100 });
    }
    const indexKey = document.getElementById("indexSelect").value;
    const etf = getETFInfo(indexKey, rr.leverage);
    const etfLabel = etf ? `${etf.ticker} (${rr.leverage}x)` : `${rr.leverage}x`;
    return {
      label: `${etfLabel} CAGR`,
      data: sampled,
      borderColor: color.line,
      backgroundColor: color.bg,
      borderWidth: 1.5,
      pointRadius: 0,
      fill: false,
      tension: 0.2,
    };
  });

  // Add zero line
  rollingChart = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}%`,
          },
        },
        legend: { labels: { color: "#e4e6eb" } },
        annotation: {
          annotations: {
            zeroLine: { type: "line", yMin: 0, yMax: 0, borderColor: "rgba(255,255,255,0.3)", borderWidth: 1 },
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: { unit: "year" },
          ticks: { color: "#8b8fa3" },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
        y: {
          ticks: {
            color: "#8b8fa3",
            callback: (v) => v.toFixed(0) + "%",
          },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
      },
    },
  });
}

// ===== Render Stats Table =====
function renderStatsTable(results) {
  const head = document.getElementById("statsTableHead");
  const body = document.getElementById("statsTableBody");

  const etfTag = (r) => r.etfInfo ? `${r.etfInfo.ticker} (${r.leverage}x)` : `${r.leverage}x`;
  head.innerHTML = `<th>指標</th>` + results.map((r) => `<th>${etfTag(r)}</th>`).join("");

  const rows = [
    { label: "ETF", fn: (r) => r.etfInfo ? r.etfInfo.name : "-" },
    { label: "経費率", fn: (r) => r.etfInfo ? (r.etfInfo.expense * 100).toFixed(2) + "%" : "-" },
    { label: "最終資産", fn: (r) => formatMoney(r.finalValue) },
    { label: "総投資額", fn: (r) => formatMoney(r.totalInvested) },
    { label: "総リターン", fn: (r) => formatPct(r.totalReturn) },
    { label: `CAGR${tip("CAGR")}`, fn: (r) => formatPct(r.cagr) },
    { label: `MDD${tip("MDD")}`, fn: (r) => formatPct(r.maxDrawdown) },
    { label: `ボラティリティ${tip("ボラティリティ")}`, fn: (r) => formatPct(r.volatility) },
    { label: `シャープレシオ${tip("シャープレシオ")}`, fn: (r) => r.sharpe.toFixed(3) },
  ];

  body.innerHTML = rows
    .map((row) => `
      <tr>
        <td class="row-label">${row.label}</td>
        ${results.map((r) => `<td>${row.fn(r)}</td>`).join("")}
      </tr>
    `).join("");
}

// ===== Render Yearly Returns Table =====
function renderYearlyTable(results) {
  const head = document.getElementById("yearlyTableHead");
  const body = document.getElementById("yearlyTableBody");

  const etfTag = (r) => r.etfInfo ? `${r.etfInfo.ticker} (${r.leverage}x)` : `${r.leverage}x`;
  head.innerHTML = `<th>年</th>` + results.map((r) => `<th>${etfTag(r)}</th>`).join("");

  // Collect all years
  const allYears = new Set();
  results.forEach((r) => Object.keys(r.yearlyReturns).forEach((y) => allYears.add(y)));
  const years = [...allYears].sort();

  body.innerHTML = years
    .map((year) => `
      <tr>
        <td class="row-label">${year}</td>
        ${results.map((r) => {
          const val = r.yearlyReturns[year];
          if (val === undefined) return `<td>-</td>`;
          const cls = val >= 0 ? "positive" : "negative";
          return `<td class="${cls}">${formatPct(val)}</td>`;
        }).join("")}
      </tr>
    `).join("");
}

// ===== Rolling Stats Cards =====
function renderRollingStatsCards(rollingResults) {
  const container = document.getElementById("statsCards");
  const cards = [];

  const indexKey = document.getElementById("indexSelect").value;
  rollingResults.forEach((rr) => {
    const etf = getETFInfo(indexKey, rr.leverage);
    const tag = etf ? etf.ticker : `${rr.leverage}x`;
    cards.push(
      { label: `平均CAGR${tip("CAGR")} (${tag})`, value: formatPct(rr.stats.avgCAGR), cls: rr.stats.avgCAGR >= 0 ? "positive" : "negative" },
      { label: `最良CAGR${tip("CAGR")} (${tag})`, value: formatPct(rr.stats.maxCAGR), cls: "positive" },
      { label: `最悪CAGR${tip("CAGR")} (${tag})`, value: formatPct(rr.stats.minCAGR), cls: rr.stats.minCAGR >= 0 ? "positive" : "negative" },
      { label: `プラス確率 (${tag})`, value: formatPct(rr.stats.positiveRate), cls: rr.stats.positiveRate >= 0.5 ? "positive" : "negative" },
    );
  });

  container.innerHTML = cards
    .map((c) => `
      <div class="stat-card">
        <div class="stat-value ${c.cls}">${c.value}</div>
        <div class="stat-label">${c.label}</div>
      </div>
    `).join("");
}

// ===== Rolling Stats Table =====
function renderRollingStatsTable(rollingResults) {
  const head = document.getElementById("statsTableHead");
  const body = document.getElementById("statsTableBody");

  const indexKey2 = document.getElementById("indexSelect").value;
  head.innerHTML = `<th>指標</th>` + rollingResults.map((r) => {
    const etf = getETFInfo(indexKey2, r.leverage);
    return `<th>${etf ? etf.ticker + " (" + r.leverage + "x)" : r.leverage + "x"}</th>`;
  }).join("");

  const rows = [
    { label: "テスト回数", fn: (r) => r.stats.count },
    { label: `平均CAGR${tip("CAGR")}`, fn: (r) => formatPct(r.stats.avgCAGR) },
    { label: `中央値CAGR${tip("CAGR")}`, fn: (r) => formatPct(r.stats.medianCAGR) },
    { label: `最良CAGR${tip("CAGR")}`, fn: (r) => formatPct(r.stats.maxCAGR) },
    { label: `最悪CAGR${tip("CAGR")}`, fn: (r) => formatPct(r.stats.minCAGR) },
    { label: "プラス確率", fn: (r) => formatPct(r.stats.positiveRate) },
    { label: `平均MDD${tip("MDD")}`, fn: (r) => formatPct(r.stats.avgMDD) },
    { label: `最悪MDD${tip("MDD")}`, fn: (r) => formatPct(r.stats.worstMDD) },
  ];

  body.innerHTML = rows
    .map((row) => `
      <tr>
        <td class="row-label">${row.label}</td>
        ${rollingResults.map((r) => `<td>${row.fn(r)}</td>`).join("")}
      </tr>
    `).join("");
}
