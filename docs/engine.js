/**
 * Backtest Engine
 * Simulates leveraged ETF returns using daily index data.
 *
 * Leveraged ETFs aim to deliver N× the DAILY return of the underlying index.
 * This engine replicates that daily rebalancing behavior.
 */

const INDEX_DATA_MAP = {
  sp500: () => SP500_DATA,
  nasdaq100: () => NASDAQ100_DATA,
  dowjones: () => DOWJONES_DATA,
  vti: () => VTI_DATA,
  nikkei225: () => NIKKEI225_DATA,
  gold: () => GOLD_DATA,
};

const INDEX_LABELS = {
  sp500: "S&P 500",
  nasdaq100: "Nasdaq 100",
  dowjones: "Dow Jones",
  vti: "VTI (米国株式市場全体)",
  nikkei225: "日経225",
  gold: "Gold (XAU/USD)",
};

// Typical annual expense ratios
const EXPENSE_RATIOS = { 1: 0.0003, 2: 0.0090, 3: 0.0095 };

const LEVERAGE_COLORS = {
  1: { line: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  2: { line: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  3: { line: "#a855f7", bg: "rgba(168,85,247,0.1)" },
};

const CRISIS_PRESETS = {
  dotcom:   { start: "2000-03-01", end: "2002-10-31", label: "ドットコム・バブル" },
  gfc:      { start: "2007-10-01", end: "2009-03-31", label: "リーマンショック" },
  covid:    { start: "2020-01-01", end: "2020-12-31", label: "コロナショック" },
  "2022bear": { start: "2022-01-01", end: "2022-12-31", label: "2022年ベア相場" },
  full:     { start: "1990-01-02", end: "2026-12-31", label: "全期間" },
  bull2010: { start: "2010-01-01", end: "2020-01-01", label: "ブル相場 2010-2020" },
};

/**
 * Get data array for an index, filtered by date range
 */
function getIndexData(indexKey, startDate, endDate) {
  const raw = INDEX_DATA_MAP[indexKey]();
  return raw.filter(([d]) => d >= startDate && d <= endDate);
}

/**
 * Core backtest: simulate leveraged daily returns
 *
 * @param {Array} data - [[date, close], ...]
 * @param {number} leverage - 1, 2, or 3
 * @param {object} opts - { initialAmount, investType, dcaAmount, dcaFrequency, dcaIncrease, includeExpense }
 * @returns {object} { dates[], values[], totalInvested, stats }
 */
function runBacktest(data, leverage, opts) {
  const {
    initialAmount = 10000,
    investType = "lump",
    dcaAmount = 500,
    dcaFrequency = "monthly",
    dcaIncrease = 0,
    includeExpense = true,
  } = opts;

  if (data.length < 2) return null;

  const dailyExpense = includeExpense
    ? EXPENSE_RATIOS[leverage] / 252
    : 0;

  const dates = [];
  const values = [];
  let shares = 0;
  let totalInvested = 0;
  let peak = 0;
  const drawdowns = [];
  let maxDrawdown = 0;
  const dailyReturns = [];

  // Initialize with first day
  const firstPrice = data[0][1];
  let simPrice = 1.0; // Normalized sim price

  // Buy initial shares
  shares = initialAmount / simPrice;
  totalInvested = initialAmount;

  let lastDcaMonth = -1;
  let lastDcaWeek = -1;
  let lastDcaYear = -1;
  let currentDcaAmount = dcaAmount;
  let currentYear = new Date(data[0][0]).getFullYear();

  for (let i = 0; i < data.length; i++) {
    const [date, close] = data[i];
    const dt = new Date(date);

    if (i > 0) {
      const prevClose = data[i - 1][1];
      const dailyReturn = (close - prevClose) / prevClose;
      const leveragedReturn = dailyReturn * leverage - dailyExpense;
      simPrice *= (1 + leveragedReturn);
      dailyReturns.push(leveragedReturn);
    }

    // DCA contributions
    if (investType === "dca" && i > 0 && dcaAmount > 0) {
      const year = dt.getFullYear();
      // Increase DCA amount yearly
      if (year > currentYear && dcaIncrease > 0) {
        const yearsElapsed = year - currentYear;
        currentDcaAmount = dcaAmount * Math.pow(1 + dcaIncrease / 100, yearsElapsed);
      }

      let shouldInvest = false;
      if (dcaFrequency === "monthly") {
        const month = dt.getMonth();
        if (month !== lastDcaMonth) {
          shouldInvest = true;
          lastDcaMonth = month;
        }
      } else if (dcaFrequency === "weekly") {
        const week = getWeekNumber(dt);
        if (week !== lastDcaWeek) {
          shouldInvest = true;
          lastDcaWeek = week;
        }
      } else if (dcaFrequency === "yearly") {
        const year2 = dt.getFullYear();
        if (year2 !== lastDcaYear) {
          shouldInvest = true;
          lastDcaYear = year2;
        }
      }

      if (shouldInvest) {
        shares += currentDcaAmount / simPrice;
        totalInvested += currentDcaAmount;
      }
    }

    const portfolioValue = shares * simPrice;
    dates.push(date);
    values.push(portfolioValue);

    // Track peak and drawdown
    if (portfolioValue > peak) peak = portfolioValue;
    const dd = peak > 0 ? (portfolioValue - peak) / peak : 0;
    drawdowns.push(dd);
    if (dd < maxDrawdown) maxDrawdown = dd;
  }

  const finalValue = values[values.length - 1];
  const totalReturn = (finalValue - totalInvested) / totalInvested;
  const years = data.length / 252;
  const cagr = Math.pow(finalValue / initialAmount, 1 / years) - 1;

  // Volatility (annualized)
  const avgReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((a, r) => a + Math.pow(r - avgReturn, 2), 0) / dailyReturns.length;
  const volatility = Math.sqrt(variance) * Math.sqrt(252);

  // Sharpe Ratio (assuming 4% risk-free rate)
  const riskFreeRate = 0.04;
  const sharpe = volatility > 0 ? (cagr - riskFreeRate) / volatility : 0;

  // Yearly returns
  const yearlyReturns = computeYearlyReturns(dates, values);

  return {
    dates,
    values,
    drawdowns,
    totalInvested,
    finalValue,
    totalReturn,
    cagr,
    maxDrawdown,
    volatility,
    sharpe,
    yearlyReturns,
    leverage,
    dailyReturns,
  };
}

/**
 * Compute yearly returns from dates and portfolio values
 */
function computeYearlyReturns(dates, values) {
  const yearly = {};
  let prevYearEnd = values[0];
  let currentYear = dates[0].substring(0, 4);

  for (let i = 0; i < dates.length; i++) {
    const year = dates[i].substring(0, 4);
    if (year !== currentYear) {
      yearly[currentYear] = (values[i - 1] - prevYearEnd) / prevYearEnd;
      prevYearEnd = values[i - 1];
      currentYear = year;
    }
  }
  // Last year
  yearly[currentYear] = (values[values.length - 1] - prevYearEnd) / prevYearEnd;
  return yearly;
}

/**
 * Rolling backtest: compute returns for every N-year window
 */
function runRollingBacktest(data, leverage, rollingYears, opts) {
  const windowSize = rollingYears * 252;
  const results = [];

  for (let start = 0; start + windowSize < data.length; start += 21) {
    const windowData = data.slice(start, start + windowSize);
    const result = runBacktest(windowData, leverage, { ...opts, investType: "lump" });
    if (result) {
      results.push({
        startDate: windowData[0][0],
        endDate: windowData[windowData.length - 1][0],
        cagr: result.cagr,
        totalReturn: result.totalReturn,
        maxDrawdown: result.maxDrawdown,
        sharpe: result.sharpe,
      });
    }
  }

  // Statistics
  const cagrs = results.map((r) => r.cagr);
  const mdds = results.map((r) => r.maxDrawdown);
  const stats = {
    count: results.length,
    avgCAGR: avg(cagrs),
    medianCAGR: median(cagrs),
    minCAGR: Math.min(...cagrs),
    maxCAGR: Math.max(...cagrs),
    positiveRate: cagrs.filter((c) => c > 0).length / cagrs.length,
    avgMDD: avg(mdds),
    worstMDD: Math.min(...mdds),
  };

  return { results, stats, leverage };
}

// ===== Helpers =====

function getWeekNumber(d) {
  const oneJan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
}

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function formatPct(v) {
  return (v * 100).toFixed(2) + "%";
}

let currentCurrency = "USD";

function formatMoney(v) {
  if (currentCurrency === "JPY") {
    if (v >= 1e8) return "¥" + (v / 1e8).toFixed(2) + "億";
    if (v >= 1e4) return "¥" + (v / 1e4).toFixed(1) + "万";
    return "¥" + Math.round(v).toLocaleString();
  }
  if (v >= 1e6) return "$" + (v / 1e6).toFixed(2) + "M";
  if (v >= 1e3) return "$" + (v / 1e3).toFixed(1) + "K";
  return "$" + v.toFixed(0);
}
