import { ChartData } from "@/types/chat";

function toCsvString(headers: string[], rows: string[][]): string {
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function exportChartDataCsv(
  chartData: ChartData,
  stockSymbol?: string
) {
  const sections: string[] = [];

  if (chartData.ohlcv?.length) {
    const headers = ["Date", "Open", "High", "Low", "Close", "Volume"];
    const rows = chartData.ohlcv.map((d) => [
      d.date, String(d.open), String(d.high), String(d.low), String(d.close), String(d.volume),
    ]);
    sections.push(`OHLCV Data\n${toCsvString(headers, rows)}`);
  }

  if (chartData.rsi?.length) {
    const headers = ["Date", "RSI"];
    const rows = chartData.rsi.map((d) => [d.date, String(d.value)]);
    sections.push(`RSI Data\n${toCsvString(headers, rows)}`);
  }

  if (chartData.macd?.length) {
    const headers = ["Date", "MACD", "Signal", "Histogram"];
    const rows = chartData.macd.map((d) => [
      d.date, String(d.macd), String(d.signal), String(d.histogram),
    ]);
    sections.push(`MACD Data\n${toCsvString(headers, rows)}`);
  }

  if (chartData.sma20?.length) {
    const headers = ["Date", "SMA20"];
    const rows = chartData.sma20.map((d) => [d.date, String(d.value)]);
    sections.push(`SMA20 Data\n${toCsvString(headers, rows)}`);
  }

  if (chartData.sma50?.length) {
    const headers = ["Date", "SMA50"];
    const rows = chartData.sma50.map((d) => [d.date, String(d.value)]);
    sections.push(`SMA50 Data\n${toCsvString(headers, rows)}`);
  }

  const csv = sections.join("\n\n");
  downloadCsv(csv, `${stockSymbol || "chart"}-data.csv`);
}

export function exportBacktestCsv(
  result: {
    totalReturn: number;
    winRate: number;
    maxDrawdown: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    trades: Array<{ type: string; date: string; price: number; pnl?: number }>;
    equityCurve: Array<{ date: string; value: number }>;
  },
  stockSymbol?: string
) {
  const sections: string[] = [];

  sections.push(
    `Backtest Summary\nMetric,Value\nTotal Return,${result.totalReturn}%\nWin Rate,${result.winRate}%\nMax Drawdown,-${result.maxDrawdown}%\nTotal Trades,${result.totalTrades}\nWinning Trades,${result.winningTrades}\nLosing Trades,${result.losingTrades}`
  );

  if (result.trades.length) {
    const headers = ["Action", "Date", "Price", "P&L"];
    const rows = result.trades.map((t) => [
      t.type.toUpperCase(), t.date, String(t.price), t.pnl !== undefined ? String(Math.round(t.pnl)) : "",
    ]);
    sections.push(`Trade Log\n${toCsvString(headers, rows)}`);
  }

  if (result.equityCurve.length) {
    const headers = ["Date", "Portfolio Value"];
    const rows = result.equityCurve.map((e) => [e.date, String(e.value)]);
    sections.push(`Equity Curve\n${toCsvString(headers, rows)}`);
  }

  const csv = sections.join("\n\n");
  downloadCsv(csv, `${stockSymbol || "backtest"}-results.csv`);
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
