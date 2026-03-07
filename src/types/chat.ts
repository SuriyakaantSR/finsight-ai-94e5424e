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
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}
