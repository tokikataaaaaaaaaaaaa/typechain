// ===== State =====
let currentSort = { key: "symbol", dir: "asc" };
let currentView = "table";

// ===== DOM Elements =====
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const indexFilter = document.getElementById("indexFilter");
const leverageFilter = document.getElementById("leverageFilter");
const resetBtn = document.getElementById("resetFilters");
const resultCount = document.getElementById("resultCount");
const tableBody = document.getElementById("etfTableBody");
const summaryCards = document.getElementById("summaryCards");
const groupContainer = document.getElementById("groupContainer");
const compareContainer = document.getElementById("compareContainer");
const viewBtns = document.querySelectorAll(".btn-view");

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  populateFilters();
  renderSummaryCards();
  renderTable();
  bindEvents();
});

// ===== Populate Filter Dropdowns =====
function populateFilters() {
  const categories = [...new Set(ETF_TICKERS.map((t) => t.category))];
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = CATEGORY_LABELS[cat] || cat;
    categoryFilter.appendChild(opt);
  });

  const indices = [...new Set(ETF_TICKERS.map((t) => t.index))];
  indices.sort();
  indices.forEach((idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = idx;
    indexFilter.appendChild(opt);
  });
}

// ===== Summary Cards =====
function renderSummaryCards() {
  const total = ETF_TICKERS.length;
  const categories = new Set(ETF_TICKERS.map((t) => t.category)).size;
  const indices = new Set(ETF_TICKERS.map((t) => t.index)).size;
  const leveraged = ETF_TICKERS.filter((t) => Math.abs(t.leverage) > 1).length;
  const issuers = new Set(ETF_TICKERS.map((t) => t.issuer)).size;

  const cards = [
    { value: total, label: "ETF銘柄数" },
    { value: categories, label: "カテゴリ" },
    { value: indices, label: "指数/ベンチマーク" },
    { value: leveraged, label: "レバレッジETF" },
    { value: issuers, label: "発行者" },
  ];

  summaryCards.innerHTML = cards
    .map(
      (c) => `
    <div class="summary-card">
      <div class="card-value">${c.value}</div>
      <div class="card-label">${c.label}</div>
    </div>
  `
    )
    .join("");
}

// ===== Filtering =====
function getFilteredTickers() {
  const search = searchInput.value.toLowerCase().trim();
  const cat = categoryFilter.value;
  const idx = indexFilter.value;
  const lev = leverageFilter.value;

  return ETF_TICKERS.filter((t) => {
    if (search && !t.symbol.toLowerCase().includes(search) && !t.name.toLowerCase().includes(search)) return false;
    if (cat !== "all" && t.category !== cat) return false;
    if (idx !== "all" && t.index !== idx) return false;
    if (lev !== "all" && t.leverage !== Number(lev)) return false;
    return true;
  });
}

// ===== Sorting =====
function sortTickers(tickers) {
  const { key, dir } = currentSort;
  return [...tickers].sort((a, b) => {
    let va = a[key];
    let vb = b[key];
    if (typeof va === "string") {
      va = va.toLowerCase();
      vb = vb.toLowerCase();
    }
    if (va < vb) return dir === "asc" ? -1 : 1;
    if (va > vb) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

// ===== Leverage Badge =====
function leverageBadge(lev) {
  const abs = Math.abs(lev);
  let cls = "leverage-1x";
  if (lev < 0) cls = "leverage-inverse";
  else if (abs === 2) cls = "leverage-2x";
  else if (abs === 3) cls = "leverage-3x";

  const label = lev > 0 ? `${lev}x` : `${lev}x`;
  return `<span class="leverage-badge ${cls}">${label}</span>`;
}

// ===== Category Badge =====
function categoryBadge(cat) {
  const label = CATEGORY_LABELS[cat] || cat;
  return `<span class="category-badge cat-${cat}">${label}</span>`;
}

// ===== Expense Ratio Display =====
function formatExpenseRatio(ratio) {
  return (ratio * 100).toFixed(2) + "%";
}

// ===== Render Table =====
function renderTable() {
  const filtered = getFilteredTickers();
  const sorted = sortTickers(filtered);

  resultCount.textContent = `${sorted.length} / ${ETF_TICKERS.length} 件表示`;

  tableBody.innerHTML = sorted
    .map(
      (t) => `
    <tr>
      <td><span class="ticker-badge">${t.symbol}</span></td>
      <td>${t.name}</td>
      <td>${leverageBadge(t.leverage)}</td>
      <td>${t.index}</td>
      <td>${categoryBadge(t.category)}</td>
      <td>${t.issuer}</td>
      <td>${formatExpenseRatio(t.expenseRatio)}</td>
    </tr>
  `
    )
    .join("");

  // Update sort indicators
  document.querySelectorAll("#etfTable th").forEach((th) => {
    th.classList.remove("sort-asc", "sort-desc");
    if (th.dataset.sort === currentSort.key) {
      th.classList.add(currentSort.dir === "asc" ? "sort-asc" : "sort-desc");
    }
  });
}

// ===== Render Group View =====
function renderGroupView() {
  const filtered = getFilteredTickers();
  const groups = new Map();

  filtered.forEach((t) => {
    const key = t.index;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  });

  resultCount.textContent = `${filtered.length} / ${ETF_TICKERS.length} 件表示`;

  groupContainer.innerHTML = Array.from(groups.entries())
    .map(
      ([indexName, tickers]) => `
    <div class="group-section">
      <div class="group-header">
        <h3>${indexName}</h3>
        ${categoryBadge(tickers[0].category)}
        <span class="group-count">${tickers.length}銘柄</span>
      </div>
      <div class="group-tickers">
        ${tickers
          .sort((a, b) => a.leverage - b.leverage)
          .map(
            (t) => `
          <div class="group-ticker-card">
            <span class="ticker-symbol">${t.symbol}</span>
            ${leverageBadge(t.leverage)}
            <span class="ticker-name">${t.name}</span>
            <div class="ticker-meta">
              <span style="font-size:0.75rem;color:var(--text-muted)">${t.issuer}</span>
              <span style="font-size:0.75rem;color:var(--text-muted)">経費率: ${formatExpenseRatio(t.expenseRatio)}</span>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `
    )
    .join("");
}

// ===== Render Compare View =====
function renderCompareView() {
  const filtered = getFilteredTickers();
  // Group by index, only show indices with multiple leverage levels
  const groups = new Map();
  filtered.forEach((t) => {
    if (!groups.has(t.index)) groups.set(t.index, []);
    groups.get(t.index).push(t);
  });

  const maxExpense = Math.max(...filtered.map((t) => t.expenseRatio));

  resultCount.textContent = `${filtered.length} / ${ETF_TICKERS.length} 件表示`;

  const comparableGroups = Array.from(groups.entries()).filter(
    ([, tickers]) => {
      const leverages = new Set(tickers.map((t) => Math.abs(t.leverage)));
      return leverages.size > 1;
    }
  );

  compareContainer.innerHTML = comparableGroups
    .map(
      ([indexName, tickers]) => `
    <div class="compare-section">
      <h3 class="compare-title">${indexName} ${categoryBadge(tickers[0].category)}</h3>
      <div class="compare-grid">
        ${tickers
          .sort((a, b) => a.leverage - b.leverage)
          .map(
            (t) => `
          <div class="compare-card">
            <div class="card-symbol">${t.symbol}</div>
            <div class="card-leverage">${leverageBadge(t.leverage)}</div>
            <div class="card-name">${t.name}</div>
            <div class="card-issuer">${t.issuer}</div>
            <div class="card-expense">経費率: ${formatExpenseRatio(t.expenseRatio)}</div>
            <div class="compare-bar-container">
              <div class="compare-bar">
                <div class="compare-bar-fill" style="width: ${(t.expenseRatio / maxExpense) * 100}%; background: ${t.leverage < 0 ? "var(--red)" : t.leverage === 1 ? "var(--green)" : t.leverage === 2 ? "var(--orange)" : "var(--purple)"}"></div>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `
    )
    .join("");

  if (comparableGroups.length === 0) {
    compareContainer.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:2rem;">フィルタ条件に一致するレバレッジ比較グループがありません。</p>`;
  }
}

// ===== View Switching =====
function switchView(view) {
  currentView = view;
  viewBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });

  document.getElementById("tableView").classList.toggle("hidden", view !== "table");
  document.getElementById("groupView").classList.toggle("hidden", view !== "group");
  document.getElementById("compareView").classList.toggle("hidden", view !== "compare");

  renderCurrentView();
}

function renderCurrentView() {
  if (currentView === "table") renderTable();
  else if (currentView === "group") renderGroupView();
  else if (currentView === "compare") renderCompareView();
}

// ===== Event Bindings =====
function bindEvents() {
  searchInput.addEventListener("input", renderCurrentView);
  categoryFilter.addEventListener("change", renderCurrentView);
  indexFilter.addEventListener("change", renderCurrentView);
  leverageFilter.addEventListener("change", renderCurrentView);

  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    indexFilter.value = "all";
    leverageFilter.value = "all";
    renderCurrentView();
  });

  // Sort headers
  document.querySelectorAll("#etfTable th.sortable").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (currentSort.key === key) {
        currentSort.dir = currentSort.dir === "asc" ? "desc" : "asc";
      } else {
        currentSort.key = key;
        currentSort.dir = "asc";
      }
      renderTable();
    });
  });

  // View toggle
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });
}
