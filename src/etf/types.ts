export type LeverageRatio = 1 | 2 | 3 | -1 | -2 | -3;

export type AssetCategory =
  | "index"
  | "sector"
  | "bond"
  | "commodity"
  | "international"
  | "crypto"
  | "thematic";

export type IndexName =
  | "S&P 500"
  | "Nasdaq 100"
  | "Dow Jones"
  | "Russell 2000"
  | "Semiconductor"
  | "Technology"
  | "Financial"
  | "Energy"
  | "Healthcare"
  | "Biotech"
  | "Real Estate"
  | "Consumer Discretionary"
  | "Consumer Staples"
  | "Utilities"
  | "Materials"
  | "Industrials"
  | "Communication Services"
  | "20+ Year Treasury"
  | "7-10 Year Treasury"
  | "1-3 Year Treasury"
  | "Gold"
  | "Silver"
  | "Oil"
  | "Natural Gas"
  | "Emerging Markets"
  | "EAFE Developed"
  | "China"
  | "Japan"
  | "Bitcoin"
  | "Ethereum"
  | "Clean Energy"
  | "Cybersecurity"
  | "AI & Robotics"
  | "Cloud Computing"
  | "Genomics";

export interface ETFTicker {
  /** Ticker symbol (e.g., "VOO", "QQQ") */
  symbol: string;
  /** Full ETF name */
  name: string;
  /** Leverage ratio: 1=1x, 2=2x, 3=3x, -1=inverse 1x, -2=inverse 2x, -3=inverse 3x */
  leverage: LeverageRatio;
  /** The underlying index or benchmark */
  index: IndexName;
  /** Asset category */
  category: AssetCategory;
  /** ETF issuer/provider */
  issuer: string;
  /** Expense ratio (as decimal, e.g., 0.0003 for 0.03%) */
  expenseRatio: number;
}

export interface ETFGroup {
  index: IndexName;
  category: AssetCategory;
  tickers: ETFTicker[];
}
