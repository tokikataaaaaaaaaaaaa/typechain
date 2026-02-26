import { ETFTicker } from "./types";

/**
 * US ETF Tickers Database
 *
 * To add a new ticker, simply add an entry to the appropriate section below.
 * Each ticker requires: symbol, name, leverage, index, category, issuer, expenseRatio.
 */
export const ETF_TICKERS: ETFTicker[] = [
  // ============================================================
  // S&P 500
  // ============================================================
  { symbol: "SPY",  name: "SPDR S&P 500 ETF Trust",                    leverage: 1,  index: "S&P 500", category: "index", issuer: "State Street", expenseRatio: 0.0945 },
  { symbol: "VOO",  name: "Vanguard S&P 500 ETF",                      leverage: 1,  index: "S&P 500", category: "index", issuer: "Vanguard",     expenseRatio: 0.0003 },
  { symbol: "IVV",  name: "iShares Core S&P 500 ETF",                  leverage: 1,  index: "S&P 500", category: "index", issuer: "iShares",      expenseRatio: 0.0003 },
  { symbol: "SSO",  name: "ProShares Ultra S&P 500",                   leverage: 2,  index: "S&P 500", category: "index", issuer: "ProShares",    expenseRatio: 0.0089 },
  { symbol: "UPRO", name: "ProShares UltraPro S&P 500",                leverage: 3,  index: "S&P 500", category: "index", issuer: "ProShares",    expenseRatio: 0.0091 },
  { symbol: "SPXL", name: "Direxion Daily S&P 500 Bull 3X",            leverage: 3,  index: "S&P 500", category: "index", issuer: "Direxion",     expenseRatio: 0.0097 },
  { symbol: "SH",   name: "ProShares Short S&P 500",                   leverage: -1, index: "S&P 500", category: "index", issuer: "ProShares",    expenseRatio: 0.0088 },
  { symbol: "SDS",  name: "ProShares UltraShort S&P 500",              leverage: -2, index: "S&P 500", category: "index", issuer: "ProShares",    expenseRatio: 0.0089 },
  { symbol: "SPXS", name: "Direxion Daily S&P 500 Bear 3X",            leverage: -3, index: "S&P 500", category: "index", issuer: "Direxion",     expenseRatio: 0.0100 },

  // ============================================================
  // Nasdaq 100
  // ============================================================
  { symbol: "QQQ",  name: "Invesco QQQ Trust",                         leverage: 1,  index: "Nasdaq 100", category: "index", issuer: "Invesco",    expenseRatio: 0.0020 },
  { symbol: "QQQM", name: "Invesco Nasdaq 100 ETF",                    leverage: 1,  index: "Nasdaq 100", category: "index", issuer: "Invesco",    expenseRatio: 0.0015 },
  { symbol: "QLD",  name: "ProShares Ultra QQQ",                       leverage: 2,  index: "Nasdaq 100", category: "index", issuer: "ProShares",  expenseRatio: 0.0095 },
  { symbol: "TQQQ", name: "ProShares UltraPro QQQ",                    leverage: 3,  index: "Nasdaq 100", category: "index", issuer: "ProShares",  expenseRatio: 0.0086 },
  { symbol: "PSQ",  name: "ProShares Short QQQ",                       leverage: -1, index: "Nasdaq 100", category: "index", issuer: "ProShares",  expenseRatio: 0.0095 },
  { symbol: "QID",  name: "ProShares UltraShort QQQ",                  leverage: -2, index: "Nasdaq 100", category: "index", issuer: "ProShares",  expenseRatio: 0.0095 },
  { symbol: "SQQQ", name: "ProShares UltraPro Short QQQ",              leverage: -3, index: "Nasdaq 100", category: "index", issuer: "ProShares",  expenseRatio: 0.0095 },

  // ============================================================
  // Dow Jones Industrial Average
  // ============================================================
  { symbol: "DIA",  name: "SPDR Dow Jones Industrial Average ETF",     leverage: 1,  index: "Dow Jones", category: "index", issuer: "State Street", expenseRatio: 0.0016 },
  { symbol: "DDM",  name: "ProShares Ultra Dow30",                     leverage: 2,  index: "Dow Jones", category: "index", issuer: "ProShares",    expenseRatio: 0.0095 },
  { symbol: "UDOW", name: "ProShares UltraPro Dow30",                  leverage: 3,  index: "Dow Jones", category: "index", issuer: "ProShares",    expenseRatio: 0.0095 },
  { symbol: "DOG",  name: "ProShares Short Dow30",                     leverage: -1, index: "Dow Jones", category: "index", issuer: "ProShares",    expenseRatio: 0.0095 },
  { symbol: "DXD",  name: "ProShares UltraShort Dow30",                leverage: -2, index: "Dow Jones", category: "index", issuer: "ProShares",    expenseRatio: 0.0095 },
  { symbol: "SDOW", name: "ProShares UltraPro Short Dow30",            leverage: -3, index: "Dow Jones", category: "index", issuer: "ProShares",    expenseRatio: 0.0095 },

  // ============================================================
  // Russell 2000 (Small Cap)
  // ============================================================
  { symbol: "IWM",  name: "iShares Russell 2000 ETF",                  leverage: 1,  index: "Russell 2000", category: "index", issuer: "iShares",    expenseRatio: 0.0019 },
  { symbol: "UWM",  name: "ProShares Ultra Russell2000",               leverage: 2,  index: "Russell 2000", category: "index", issuer: "ProShares",  expenseRatio: 0.0095 },
  { symbol: "TNA",  name: "Direxion Daily Small Cap Bull 3X",          leverage: 3,  index: "Russell 2000", category: "index", issuer: "Direxion",   expenseRatio: 0.0108 },
  { symbol: "RWM",  name: "ProShares Short Russell2000",               leverage: -1, index: "Russell 2000", category: "index", issuer: "ProShares",  expenseRatio: 0.0095 },
  { symbol: "TWM",  name: "ProShares UltraShort Russell2000",          leverage: -2, index: "Russell 2000", category: "index", issuer: "ProShares",  expenseRatio: 0.0095 },
  { symbol: "TZA",  name: "Direxion Daily Small Cap Bear 3X",          leverage: -3, index: "Russell 2000", category: "index", issuer: "Direxion",   expenseRatio: 0.0108 },

  // ============================================================
  // Sector: Semiconductor
  // ============================================================
  { symbol: "SOXX", name: "iShares Semiconductor ETF",                 leverage: 1,  index: "Semiconductor", category: "sector", issuer: "iShares",   expenseRatio: 0.0035 },
  { symbol: "SMH",  name: "VanEck Semiconductor ETF",                  leverage: 1,  index: "Semiconductor", category: "sector", issuer: "VanEck",    expenseRatio: 0.0035 },
  { symbol: "USD",  name: "ProShares Ultra Semiconductors",            leverage: 2,  index: "Semiconductor", category: "sector", issuer: "ProShares", expenseRatio: 0.0095 },
  { symbol: "SOXL", name: "Direxion Daily Semiconductor Bull 3X",      leverage: 3,  index: "Semiconductor", category: "sector", issuer: "Direxion",  expenseRatio: 0.0076 },
  { symbol: "SOXS", name: "Direxion Daily Semiconductor Bear 3X",      leverage: -3, index: "Semiconductor", category: "sector", issuer: "Direxion",  expenseRatio: 0.0076 },

  // ============================================================
  // Sector: Technology
  // ============================================================
  { symbol: "XLK",  name: "Technology Select Sector SPDR Fund",        leverage: 1,  index: "Technology", category: "sector", issuer: "State Street", expenseRatio: 0.0009 },
  { symbol: "VGT",  name: "Vanguard Information Technology ETF",       leverage: 1,  index: "Technology", category: "sector", issuer: "Vanguard",     expenseRatio: 0.0010 },
  { symbol: "TECL", name: "Direxion Daily Technology Bull 3X",         leverage: 3,  index: "Technology", category: "sector", issuer: "Direxion",     expenseRatio: 0.0094 },
  { symbol: "TECS", name: "Direxion Daily Technology Bear 3X",         leverage: -3, index: "Technology", category: "sector", issuer: "Direxion",     expenseRatio: 0.0100 },

  // ============================================================
  // Sector: Financial
  // ============================================================
  { symbol: "XLF",  name: "Financial Select Sector SPDR Fund",         leverage: 1,  index: "Financial", category: "sector", issuer: "State Street", expenseRatio: 0.0009 },
  { symbol: "VFH",  name: "Vanguard Financials ETF",                   leverage: 1,  index: "Financial", category: "sector", issuer: "Vanguard",     expenseRatio: 0.0010 },
  { symbol: "FAS",  name: "Direxion Daily Financial Bull 3X",          leverage: 3,  index: "Financial", category: "sector", issuer: "Direxion",     expenseRatio: 0.0089 },
  { symbol: "FAZ",  name: "Direxion Daily Financial Bear 3X",          leverage: -3, index: "Financial", category: "sector", issuer: "Direxion",     expenseRatio: 0.0096 },

  // ============================================================
  // Sector: Energy
  // ============================================================
  { symbol: "XLE",  name: "Energy Select Sector SPDR Fund",            leverage: 1,  index: "Energy", category: "sector", issuer: "State Street", expenseRatio: 0.0009 },
  { symbol: "VDE",  name: "Vanguard Energy ETF",                       leverage: 1,  index: "Energy", category: "sector", issuer: "Vanguard",     expenseRatio: 0.0010 },
  { symbol: "ERX",  name: "Direxion Daily Energy Bull 2X",             leverage: 2,  index: "Energy", category: "sector", issuer: "Direxion",     expenseRatio: 0.0095 },
  { symbol: "ERY",  name: "Direxion Daily Energy Bear 2X",             leverage: -2, index: "Energy", category: "sector", issuer: "Direxion",     expenseRatio: 0.0095 },

  // ============================================================
  // Sector: Healthcare
  // ============================================================
  { symbol: "XLV",  name: "Health Care Select Sector SPDR Fund",       leverage: 1,  index: "Healthcare", category: "sector", issuer: "State Street", expenseRatio: 0.0009 },
  { symbol: "VHT",  name: "Vanguard Health Care ETF",                  leverage: 1,  index: "Healthcare", category: "sector", issuer: "Vanguard",     expenseRatio: 0.0010 },
  { symbol: "CURE", name: "Direxion Daily Healthcare Bull 3X",         leverage: 3,  index: "Healthcare", category: "sector", issuer: "Direxion",     expenseRatio: 0.0097 },

  // ============================================================
  // Sector: Biotech
  // ============================================================
  { symbol: "IBB",  name: "iShares Biotechnology ETF",                 leverage: 1,  index: "Biotech", category: "sector", issuer: "iShares",    expenseRatio: 0.0044 },
  { symbol: "XBI",  name: "SPDR S&P Biotech ETF",                     leverage: 1,  index: "Biotech", category: "sector", issuer: "State Street", expenseRatio: 0.0035 },
  { symbol: "LABU", name: "Direxion Daily S&P Biotech Bull 3X",       leverage: 3,  index: "Biotech", category: "sector", issuer: "Direxion",    expenseRatio: 0.0097 },
  { symbol: "LABD", name: "Direxion Daily S&P Biotech Bear 3X",       leverage: -3, index: "Biotech", category: "sector", issuer: "Direxion",    expenseRatio: 0.0097 },

  // ============================================================
  // Sector: Real Estate
  // ============================================================
  { symbol: "XLRE", name: "Real Estate Select Sector SPDR Fund",      leverage: 1,  index: "Real Estate", category: "sector", issuer: "State Street", expenseRatio: 0.0009 },
  { symbol: "VNQ",  name: "Vanguard Real Estate ETF",                  leverage: 1,  index: "Real Estate", category: "sector", issuer: "Vanguard",     expenseRatio: 0.0012 },
  { symbol: "DRN",  name: "Direxion Daily Real Estate Bull 3X",       leverage: 3,  index: "Real Estate", category: "sector", issuer: "Direxion",     expenseRatio: 0.0095 },
  { symbol: "DRV",  name: "Direxion Daily Real Estate Bear 3X",       leverage: -3, index: "Real Estate", category: "sector", issuer: "Direxion",     expenseRatio: 0.0095 },

  // ============================================================
  // Sector: Consumer Discretionary
  // ============================================================
  { symbol: "XLY",  name: "Consumer Discretionary Select Sector SPDR", leverage: 1,  index: "Consumer Discretionary", category: "sector", issuer: "State Street", expenseRatio: 0.0009 },

  // ============================================================
  // Sector: Consumer Staples
  // ============================================================
  { symbol: "XLP",  name: "Consumer Staples Select Sector SPDR",       leverage: 1,  index: "Consumer Staples", category: "sector", issuer: "State Street", expenseRatio: 0.0009 },

  // ============================================================
  // Sector: Utilities
  // ============================================================
  { symbol: "XLU",  name: "Utilities Select Sector SPDR Fund",         leverage: 1,  index: "Utilities", category: "sector", issuer: "State Street", expenseRatio: 0.0009 },

  // ============================================================
  // Sector: Materials
  // ============================================================
  { symbol: "XLB",  name: "Materials Select Sector SPDR Fund",         leverage: 1,  index: "Materials", category: "sector", issuer: "State Street", expenseRatio: 0.0009 },

  // ============================================================
  // Sector: Industrials
  // ============================================================
  { symbol: "XLI",  name: "Industrial Select Sector SPDR Fund",        leverage: 1,  index: "Industrials", category: "sector", issuer: "State Street", expenseRatio: 0.0009 },

  // ============================================================
  // Sector: Communication Services
  // ============================================================
  { symbol: "XLC",  name: "Communication Services Select Sector SPDR", leverage: 1,  index: "Communication Services", category: "sector", issuer: "State Street", expenseRatio: 0.0009 },

  // ============================================================
  // Bond: 20+ Year Treasury
  // ============================================================
  { symbol: "TLT",  name: "iShares 20+ Year Treasury Bond ETF",       leverage: 1,  index: "20+ Year Treasury", category: "bond", issuer: "iShares",   expenseRatio: 0.0015 },
  { symbol: "UBT",  name: "ProShares Ultra 20+ Year Treasury",        leverage: 2,  index: "20+ Year Treasury", category: "bond", issuer: "ProShares", expenseRatio: 0.0095 },
  { symbol: "TMF",  name: "Direxion Daily 20+ Year Treasury Bull 3X", leverage: 3,  index: "20+ Year Treasury", category: "bond", issuer: "Direxion",  expenseRatio: 0.0101 },
  { symbol: "TBF",  name: "ProShares Short 20+ Year Treasury",        leverage: -1, index: "20+ Year Treasury", category: "bond", issuer: "ProShares", expenseRatio: 0.0095 },
  { symbol: "TBT",  name: "ProShares UltraShort 20+ Year Treasury",   leverage: -2, index: "20+ Year Treasury", category: "bond", issuer: "ProShares", expenseRatio: 0.0095 },
  { symbol: "TMV",  name: "Direxion Daily 20+ Yr Treasury Bear 3X",   leverage: -3, index: "20+ Year Treasury", category: "bond", issuer: "Direxion",  expenseRatio: 0.0101 },

  // ============================================================
  // Bond: 7-10 Year Treasury
  // ============================================================
  { symbol: "IEF",  name: "iShares 7-10 Year Treasury Bond ETF",      leverage: 1,  index: "7-10 Year Treasury", category: "bond", issuer: "iShares", expenseRatio: 0.0015 },

  // ============================================================
  // Bond: 1-3 Year Treasury
  // ============================================================
  { symbol: "SHY",  name: "iShares 1-3 Year Treasury Bond ETF",       leverage: 1,  index: "1-3 Year Treasury", category: "bond", issuer: "iShares", expenseRatio: 0.0015 },

  // ============================================================
  // Commodity: Gold
  // ============================================================
  { symbol: "GLD",  name: "SPDR Gold Shares",                          leverage: 1,  index: "Gold", category: "commodity", issuer: "State Street", expenseRatio: 0.0040 },
  { symbol: "IAU",  name: "iShares Gold Trust",                        leverage: 1,  index: "Gold", category: "commodity", issuer: "iShares",      expenseRatio: 0.0025 },
  { symbol: "UGL",  name: "ProShares Ultra Gold",                      leverage: 2,  index: "Gold", category: "commodity", issuer: "ProShares",    expenseRatio: 0.0095 },
  { symbol: "NUGT", name: "Direxion Daily Gold Miners Bull 2X",       leverage: 2,  index: "Gold", category: "commodity", issuer: "Direxion",     expenseRatio: 0.0113 },
  { symbol: "GLL",  name: "ProShares UltraShort Gold",                 leverage: -2, index: "Gold", category: "commodity", issuer: "ProShares",    expenseRatio: 0.0095 },
  { symbol: "DUST", name: "Direxion Daily Gold Miners Bear 2X",       leverage: -2, index: "Gold", category: "commodity", issuer: "Direxion",     expenseRatio: 0.0113 },

  // ============================================================
  // Commodity: Silver
  // ============================================================
  { symbol: "SLV",  name: "iShares Silver Trust",                      leverage: 1,  index: "Silver", category: "commodity", issuer: "iShares",   expenseRatio: 0.0050 },
  { symbol: "AGQ",  name: "ProShares Ultra Silver",                    leverage: 2,  index: "Silver", category: "commodity", issuer: "ProShares",  expenseRatio: 0.0095 },
  { symbol: "ZSL",  name: "ProShares UltraShort Silver",               leverage: -2, index: "Silver", category: "commodity", issuer: "ProShares",  expenseRatio: 0.0095 },

  // ============================================================
  // Commodity: Oil
  // ============================================================
  { symbol: "USO",  name: "United States Oil Fund",                    leverage: 1,  index: "Oil", category: "commodity", issuer: "USCF",       expenseRatio: 0.0079 },
  { symbol: "UCO",  name: "ProShares Ultra Bloomberg Crude Oil",       leverage: 2,  index: "Oil", category: "commodity", issuer: "ProShares",  expenseRatio: 0.0095 },
  { symbol: "SCO",  name: "ProShares UltraShort Bloomberg Crude Oil",  leverage: -2, index: "Oil", category: "commodity", issuer: "ProShares",  expenseRatio: 0.0095 },

  // ============================================================
  // Commodity: Natural Gas
  // ============================================================
  { symbol: "UNG",  name: "United States Natural Gas Fund",            leverage: 1,  index: "Natural Gas", category: "commodity", issuer: "USCF",      expenseRatio: 0.0110 },
  { symbol: "BOIL", name: "ProShares Ultra Bloomberg Natural Gas",     leverage: 2,  index: "Natural Gas", category: "commodity", issuer: "ProShares", expenseRatio: 0.0095 },
  { symbol: "KOLD", name: "ProShares UltraShort Bloomberg Nat Gas",    leverage: -2, index: "Natural Gas", category: "commodity", issuer: "ProShares", expenseRatio: 0.0095 },

  // ============================================================
  // International: Emerging Markets
  // ============================================================
  { symbol: "EEM",  name: "iShares MSCI Emerging Markets ETF",        leverage: 1,  index: "Emerging Markets", category: "international", issuer: "iShares",  expenseRatio: 0.0068 },
  { symbol: "VWO",  name: "Vanguard FTSE Emerging Markets ETF",       leverage: 1,  index: "Emerging Markets", category: "international", issuer: "Vanguard",  expenseRatio: 0.0008 },
  { symbol: "EDC",  name: "Direxion Daily Emerging Markets Bull 3X",   leverage: 3,  index: "Emerging Markets", category: "international", issuer: "Direxion",  expenseRatio: 0.0113 },
  { symbol: "EDZ",  name: "Direxion Daily Emerging Markets Bear 3X",   leverage: -3, index: "Emerging Markets", category: "international", issuer: "Direxion",  expenseRatio: 0.0113 },

  // ============================================================
  // International: EAFE Developed Markets
  // ============================================================
  { symbol: "EFA",  name: "iShares MSCI EAFE ETF",                    leverage: 1,  index: "EAFE Developed", category: "international", issuer: "iShares", expenseRatio: 0.0032 },
  { symbol: "VEA",  name: "Vanguard FTSE Developed Markets ETF",      leverage: 1,  index: "EAFE Developed", category: "international", issuer: "Vanguard", expenseRatio: 0.0005 },

  // ============================================================
  // International: China
  // ============================================================
  { symbol: "FXI",  name: "iShares China Large-Cap ETF",              leverage: 1,  index: "China", category: "international", issuer: "iShares",  expenseRatio: 0.0074 },
  { symbol: "KWEB", name: "KraneShares CSI China Internet ETF",       leverage: 1,  index: "China", category: "international", issuer: "KraneShares", expenseRatio: 0.0069 },
  { symbol: "YINN", name: "Direxion Daily FTSE China Bull 3X",        leverage: 3,  index: "China", category: "international", issuer: "Direxion",  expenseRatio: 0.0107 },
  { symbol: "YANG", name: "Direxion Daily FTSE China Bear 3X",        leverage: -3, index: "China", category: "international", issuer: "Direxion",  expenseRatio: 0.0107 },

  // ============================================================
  // International: Japan
  // ============================================================
  { symbol: "EWJ",  name: "iShares MSCI Japan ETF",                   leverage: 1,  index: "Japan", category: "international", issuer: "iShares", expenseRatio: 0.0050 },

  // ============================================================
  // Thematic: Clean Energy
  // ============================================================
  { symbol: "ICLN", name: "iShares Global Clean Energy ETF",          leverage: 1,  index: "Clean Energy", category: "thematic", issuer: "iShares", expenseRatio: 0.0040 },
  { symbol: "QCLN", name: "First Trust NASDAQ Clean Edge Green Energy", leverage: 1, index: "Clean Energy", category: "thematic", issuer: "First Trust", expenseRatio: 0.0058 },

  // ============================================================
  // Thematic: Cybersecurity
  // ============================================================
  { symbol: "CIBR", name: "First Trust NASDAQ Cybersecurity ETF",     leverage: 1,  index: "Cybersecurity", category: "thematic", issuer: "First Trust", expenseRatio: 0.0060 },
  { symbol: "HACK", name: "ETFMG Prime Cyber Security ETF",           leverage: 1,  index: "Cybersecurity", category: "thematic", issuer: "ETFMG",      expenseRatio: 0.0060 },

  // ============================================================
  // Thematic: AI & Robotics
  // ============================================================
  { symbol: "BOTZ", name: "Global X Robotics & AI ETF",               leverage: 1,  index: "AI & Robotics", category: "thematic", issuer: "Global X",  expenseRatio: 0.0068 },
  { symbol: "ROBT", name: "First Trust Nasdaq AI and Robotics ETF",   leverage: 1,  index: "AI & Robotics", category: "thematic", issuer: "First Trust", expenseRatio: 0.0065 },

  // ============================================================
  // Thematic: Cloud Computing
  // ============================================================
  { symbol: "SKYY", name: "First Trust Cloud Computing ETF",          leverage: 1,  index: "Cloud Computing", category: "thematic", issuer: "First Trust", expenseRatio: 0.0060 },
  { symbol: "WCLD", name: "WisdomTree Cloud Computing Fund",          leverage: 1,  index: "Cloud Computing", category: "thematic", issuer: "WisdomTree", expenseRatio: 0.0045 },

  // ============================================================
  // Thematic: Genomics
  // ============================================================
  { symbol: "ARKG", name: "ARK Genomic Revolution ETF",               leverage: 1,  index: "Genomics", category: "thematic", issuer: "ARK Invest", expenseRatio: 0.0075 },
];
