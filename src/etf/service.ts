import { ETFTicker, ETFGroup, LeverageRatio, AssetCategory, IndexName } from "./types";
import { ETF_TICKERS } from "./tickers";

/**
 * ETF Ticker Service
 * Provides filtering, searching, and grouping utilities for the ETF ticker database.
 */
export class ETFService {
  private tickers: ETFTicker[];

  constructor(tickers: ETFTicker[] = ETF_TICKERS) {
    this.tickers = tickers;
  }

  /** Get all tickers */
  getAll(): ETFTicker[] {
    return [...this.tickers];
  }

  /** Get all ticker symbols */
  getAllSymbols(): string[] {
    return this.tickers.map((t) => t.symbol);
  }

  /** Find a ticker by symbol */
  findBySymbol(symbol: string): ETFTicker | undefined {
    return this.tickers.find(
      (t) => t.symbol.toUpperCase() === symbol.toUpperCase()
    );
  }

  /** Filter tickers by leverage ratio */
  filterByLeverage(leverage: LeverageRatio): ETFTicker[] {
    return this.tickers.filter((t) => t.leverage === leverage);
  }

  /** Filter tickers by category */
  filterByCategory(category: AssetCategory): ETFTicker[] {
    return this.tickers.filter((t) => t.category === category);
  }

  /** Filter tickers by underlying index */
  filterByIndex(index: IndexName): ETFTicker[] {
    return this.tickers.filter((t) => t.index === index);
  }

  /** Filter tickers by issuer */
  filterByIssuer(issuer: string): ETFTicker[] {
    return this.tickers.filter(
      (t) => t.issuer.toLowerCase() === issuer.toLowerCase()
    );
  }

  /** Get only leveraged ETFs (2x or 3x, bull or bear) */
  getLeveraged(): ETFTicker[] {
    return this.tickers.filter((t) => Math.abs(t.leverage) > 1);
  }

  /** Get only inverse ETFs (negative leverage) */
  getInverse(): ETFTicker[] {
    return this.tickers.filter((t) => t.leverage < 0);
  }

  /** Get only non-leveraged (1x) ETFs */
  getNonLeveraged(): ETFTicker[] {
    return this.tickers.filter((t) => t.leverage === 1);
  }

  /** Group tickers by their underlying index */
  groupByIndex(): ETFGroup[] {
    const groups = new Map<IndexName, ETFTicker[]>();
    for (const ticker of this.tickers) {
      const existing = groups.get(ticker.index) || [];
      existing.push(ticker);
      groups.set(ticker.index, existing);
    }
    return Array.from(groups.entries()).map(([index, tickers]) => ({
      index,
      category: tickers[0].category,
      tickers,
    }));
  }

  /** Get all unique categories */
  getCategories(): AssetCategory[] {
    return [...new Set(this.tickers.map((t) => t.category))];
  }

  /** Get all unique index names */
  getIndexNames(): IndexName[] {
    return [...new Set(this.tickers.map((t) => t.index))];
  }

  /** Get all unique issuers */
  getIssuers(): string[] {
    return [...new Set(this.tickers.map((t) => t.issuer))];
  }

  /** Get the total number of tickers */
  get count(): number {
    return this.tickers.length;
  }

  /** Get a leverage comparison group (1x, 2x, 3x for same index) */
  getLeverageComparison(index: IndexName): ETFTicker[] {
    return this.tickers
      .filter((t) => t.index === index && t.leverage > 0)
      .sort((a, b) => a.leverage - b.leverage);
  }

  /** Add a new ticker to the database (runtime only) */
  addTicker(ticker: ETFTicker): void {
    if (this.findBySymbol(ticker.symbol)) {
      throw new Error(`Ticker ${ticker.symbol} already exists`);
    }
    this.tickers.push(ticker);
  }

  /** Print a summary of the ticker database */
  printSummary(): void {
    console.log(`\n=== ETF Ticker Database Summary ===`);
    console.log(`Total tickers: ${this.count}`);
    console.log(`\nBy Category:`);
    for (const category of this.getCategories()) {
      const count = this.filterByCategory(category).length;
      console.log(`  ${category}: ${count}`);
    }
    console.log(`\nBy Index:`);
    for (const group of this.groupByIndex()) {
      const leverages = group.tickers.map((t) => `${t.leverage > 0 ? "+" : ""}${t.leverage}x`).join(", ");
      console.log(`  ${group.index}: ${group.tickers.map((t) => t.symbol).join(", ")} [${leverages}]`);
    }
  }
}
