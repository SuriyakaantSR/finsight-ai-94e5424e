export interface ChartData {
  ohlcv?: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  rsi?: Array<{
    date: string;
    value: number;
  }>;
  macd?: Array<{
    date: string;
    macd: number;
    signal: number;
    histogram: number;
  }>;
  sma20?: Array<{
    date: string;
    value: number;
  }>;
  sma50?: Array<{
    date: string;
    value: number;
  }>;
  ema20?: Array<{
    date: string;
    value: number;
  }>;
  ema50?: Array<{
    date: string;
    value: number;
  }>;
  bollingerBands?: Array<{
    date: string;
    upper: number;
    middle: number;
    lower: number;
  }>;
  atr?: Array<{
    date: string;
    value: number;
  }>;
  adx?: Array<{
    date: string;
    value: number;
    plusDI: number;
    minusDI: number;
  }>;
  vwap?: Array<{
    date: string;
    value: number;
  }>;
}

export interface FundamentalMetrics {
  pe_ratio?: number;
  eps?: number;
  roe?: number;
  roce?: number;
  debt_to_equity?: number;
  market_cap?: string;
  revenue_growth?: number;
  profit_margin?: number;
  dividend_yield?: number;
  book_value?: number;
}

export interface RiskRewardData {
  riskRewardRatio?: number;
  stopLoss?: number;
  targetPrice?: number;
  currentPrice?: number;
  riskPercent?: number;
  rewardPercent?: number;
}

export interface ComparisonStock {
  symbol: string;
  chartData?: ChartData | null;
  fundamentalMetrics?: FundamentalMetrics | null;
  confidenceScore?: number | null;
  signal?: "bullish" | "bearish" | "neutral" | null;
}

export interface ComparisonData {
  stocks: [ComparisonStock, ComparisonStock];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  chartData?: ChartData | null;
  fundamentalMetrics?: FundamentalMetrics | null;
  stockSymbol?: string | null;
  confidenceScore?: number | null;
  signal?: "bullish" | "bearish" | "neutral" | null;
  comparisonData?: ComparisonData | null;
  riskRewardData?: RiskRewardData | null;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}
