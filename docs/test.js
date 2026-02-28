/**
 * Test suite for ETF Backtest Engine
 * Run: node docs/test.js
 */

// Load all data files and engine
const fs = require("fs");
const vm = require("vm");

const ctx = {};
const files = [
  "docs/data/sp500.js",
  "docs/data/nasdaq100.js",
  "docs/data/dowjones.js",
  "docs/data/vti.js",
  "docs/data/nikkei225.js",
  "docs/data/gold.js",
  "docs/engine.js",
];

for (const file of files) {
  const code = fs.readFileSync(file, "utf8").replace(/\bconst\b/g, "var");
  vm.runInContext(code, vm.createContext(ctx));
}

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    console.log(`  PASS: ${msg}`);
    passed++;
  } else {
    console.log(`  FAIL: ${msg}`);
    failed++;
  }
}

// ===== Test 1: All data files load and have correct format =====
console.log("\n=== Test 1: Data file integrity ===");
const expectedIndices = {
  sp500: { var: "SP500_DATA", minRows: 5000 },
  nasdaq100: { var: "NASDAQ100_DATA", minRows: 5000 },
  dowjones: { var: "DOWJONES_DATA", minRows: 5000 },
  vti: { var: "VTI_DATA", minRows: 3000 },
  nikkei225: { var: "NIKKEI225_DATA", minRows: 10000 },
  gold: { var: "GOLD_DATA", minRows: 10000 },
};

for (const [key, info] of Object.entries(expectedIndices)) {
  const data = ctx[info.var];
  assert(Array.isArray(data), `${info.var} is an array`);
  assert(data.length >= info.minRows, `${info.var} has >= ${info.minRows} rows (actual: ${data ? data.length : 0})`);
  if (data && data.length > 0) {
    assert(typeof data[0][0] === "string", `${info.var} dates are strings`);
    assert(typeof data[0][1] === "number", `${info.var} prices are numbers`);
    assert(data[0][0] < data[data.length - 1][0], `${info.var} is sorted ascending`);
  }
}

// ===== Test 2: INDEX_DATA_MAP has all keys and they return functions =====
console.log("\n=== Test 2: INDEX_DATA_MAP completeness ===");
for (const key of Object.keys(expectedIndices)) {
  assert(typeof ctx.INDEX_DATA_MAP[key] === "function", `INDEX_DATA_MAP["${key}"] is a function`);
  const data = ctx.INDEX_DATA_MAP[key]();
  assert(Array.isArray(data) && data.length > 0, `INDEX_DATA_MAP["${key}"]() returns non-empty array`);
}

// ===== Test 3: INDEX_LABELS has all keys =====
console.log("\n=== Test 3: INDEX_LABELS completeness ===");
for (const key of Object.keys(expectedIndices)) {
  assert(typeof ctx.INDEX_LABELS[key] === "string", `INDEX_LABELS["${key}"] exists`);
}

// ===== Test 4: getIndexData works for all indices =====
console.log("\n=== Test 4: getIndexData per index ===");
for (const key of Object.keys(expectedIndices)) {
  const allData = ctx.INDEX_DATA_MAP[key]();
  const startDate = allData[0][0];
  const endDate = allData[allData.length - 1][0];
  const filtered = ctx.getIndexData(key, startDate, endDate);
  assert(filtered.length === allData.length, `getIndexData("${key}", "${startDate}", "${endDate}") returns all ${allData.length} rows`);
}

// ===== Test 5: runBacktest works for all indices =====
console.log("\n=== Test 5: runBacktest per index ===");
for (const key of Object.keys(expectedIndices)) {
  const allData = ctx.INDEX_DATA_MAP[key]();
  // Use last 252 trading days (1 year)
  const data = allData.slice(allData.length - 252);
  for (const leverage of [1, 2, 3]) {
    const result = ctx.runBacktest(data, leverage, {
      initialAmount: 10000,
      investType: "lump",
      includeExpense: true,
    });
    assert(result !== null, `runBacktest("${key}", ${leverage}x) returns result`);
    assert(typeof result.cagr === "number" && !isNaN(result.cagr), `runBacktest("${key}", ${leverage}x) CAGR is valid number`);
    assert(typeof result.maxDrawdown === "number", `runBacktest("${key}", ${leverage}x) MDD is valid`);
    assert(result.dates.length === data.length, `runBacktest("${key}", ${leverage}x) dates count matches`);
  }
}

// ===== Test 6: Date ranges don't overlap incorrectly =====
console.log("\n=== Test 6: Date ranges per index ===");
const dateRanges = {};
for (const key of Object.keys(expectedIndices)) {
  const data = ctx.INDEX_DATA_MAP[key]();
  dateRanges[key] = { start: data[0][0], end: data[data.length - 1][0] };
  console.log(`  ${key}: ${dateRanges[key].start} ~ ${dateRanges[key].end} (${data.length} days)`);
}
// VTI should start later than SP500
assert(dateRanges.vti.start > dateRanges.sp500.start, "VTI starts later than SP500");
// Nikkei and Gold should start earlier than SP500
assert(dateRanges.nikkei225.start < dateRanges.sp500.start, "Nikkei starts earlier than SP500");
assert(dateRanges.gold.start < dateRanges.sp500.start, "Gold starts earlier than SP500");

// ===== Test 7: Crisis preset 'full' start date compatibility =====
console.log("\n=== Test 7: Crisis presets compatibility ===");
const fullPreset = ctx.CRISIS_PRESETS.full;
assert(fullPreset !== undefined, "CRISIS_PRESETS.full exists");
for (const key of Object.keys(expectedIndices)) {
  const data = ctx.INDEX_DATA_MAP[key]();
  const dataStart = data[0][0];
  const filtered = ctx.getIndexData(key, fullPreset.start, fullPreset.end);
  if (dataStart > fullPreset.start) {
    console.log(`  WARNING: "${key}" starts at ${dataStart}, but full preset starts at ${fullPreset.start} — data will be truncated`);
  }
  assert(filtered.length > 0, `"${key}" has data within full preset range`);
}

// ===== Test 8: Default start date clamping =====
console.log("\n=== Test 8: Default start date clamping ===");
const defaultStart = "2000-01-03";
for (const key of Object.keys(expectedIndices)) {
  const data = ctx.INDEX_DATA_MAP[key]();
  const dataStart = data[0][0];
  const effectiveStart = defaultStart < dataStart ? dataStart : defaultStart;
  const filtered = ctx.getIndexData(key, effectiveStart, data[data.length - 1][0]);
  assert(filtered.length > 0, `"${key}" has data with clamped start ${effectiveStart} (data starts ${dataStart})`);
}

// ===== Summary =====
console.log(`\n===== RESULTS: ${passed} passed, ${failed} failed =====`);
process.exit(failed > 0 ? 1 : 0);
