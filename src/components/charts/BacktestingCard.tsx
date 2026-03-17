import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, BarChart3, Play, Settings2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportBacktestCsv } from "@/lib/csv-export";
import { Slider } from "@/components/ui/slider";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface BacktestingCardProps {
  ohlcvData: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  rsiData?: Array<{ date: string; value: number }>;
  stockSymbol?: string;
}

interface BacktestResult {
  totalReturn: number;
  winRate: number;
  maxDrawdown: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  equityCurve: Array<{ date: string; value: number }>;
  trades: Array<{
    type: "buy" | "sell";
    date: string;
    price: number;
    pnl?: number;
  }>;
}

function runRSIBacktest(
  ohlcv: BacktestingCardProps["ohlcvData"],
  rsi: BacktestingCardProps["rsiData"],
  buyThreshold: number,
  sellThreshold: number
): BacktestResult {
  if (!rsi?.length || !ohlcv?.length) {
    return { totalReturn: 0, winRate: 0, maxDrawdown: 0, totalTrades: 0, winningTrades: 0, losingTrades: 0, equityCurve: [], trades: [] };
  }

  const rsiMap = new Map(rsi.map((r) => [r.date, r.value]));
  let capital = 100000;
  const initialCapital = capital;
  let position: { price: number; date: string } | null = null;
  let peak = capital;
  let maxDrawdown = 0;
  const trades: BacktestResult["trades"] = [];
  const equityCurve: BacktestResult["equityCurve"] = [];
  let wins = 0;
  let losses = 0;

  for (const candle of ohlcv) {
    const rsiVal = rsiMap.get(candle.date);
    if (rsiVal === undefined) {
      equityCurve.push({ date: candle.date, value: position ? capital + (candle.close - position.price) * (capital / position.price) : capital });
      continue;
    }

    if (!position && rsiVal < buyThreshold) {
      position = { price: candle.close, date: candle.date };
      trades.push({ type: "buy", date: candle.date, price: candle.close });
    } else if (position && rsiVal > sellThreshold) {
      const pnl = ((candle.close - position.price) / position.price) * capital;
      capital += pnl;
      trades.push({ type: "sell", date: candle.date, price: candle.close, pnl });
      if (pnl > 0) wins++;
      else losses++;
      position = null;
    }

    const currentValue = position
      ? capital + ((candle.close - position.price) / position.price) * capital
      : capital;

    if (currentValue > peak) peak = currentValue;
    const dd = ((peak - currentValue) / peak) * 100;
    if (dd > maxDrawdown) maxDrawdown = dd;

    equityCurve.push({ date: candle.date, value: Math.round(currentValue) });
  }

  // Close open position at last price
  if (position && ohlcv.length) {
    const lastPrice = ohlcv[ohlcv.length - 1].close;
    const pnl = ((lastPrice - position.price) / position.price) * capital;
    capital += pnl;
    trades.push({ type: "sell", date: ohlcv[ohlcv.length - 1].date, price: lastPrice, pnl });
    if (pnl > 0) wins++;
    else losses++;
  }

  const totalReturn = ((capital - initialCapital) / initialCapital) * 100;
  const totalTrades = wins + losses;

  return {
    totalReturn: Math.round(totalReturn * 100) / 100,
    winRate: totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    totalTrades,
    winningTrades: wins,
    losingTrades: losses,
    equityCurve,
    trades,
  };
}

const chartTooltipStyle = {
  backgroundColor: "hsl(222, 47%, 10%)",
  border: "1px solid hsl(217, 33%, 20%)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "#e2e8f0",
};

const BacktestingCard = ({ ohlcvData, rsiData, stockSymbol }: BacktestingCardProps) => {
  const [buyThreshold, setBuyThreshold] = useState(30);
  const [sellThreshold, setSellThreshold] = useState(70);
  const [hasRun, setHasRun] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  const result = useMemo(() => {
    if (!hasRun) return null;
    return runRSIBacktest(ohlcvData, rsiData, buyThreshold, sellThreshold);
  }, [hasRun, ohlcvData, rsiData, buyThreshold, sellThreshold]);

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">RSI Strategy Backtest</h4>
          {stockSymbol && (
            <span className="text-xs text-muted-foreground">{stockSymbol}</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setShowSettings((s) => !s)}
        >
          <Settings2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Strategy Settings */}
      {showSettings && (
        <div className="space-y-3 rounded-lg border border-border/30 bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">
            Buy when RSI {"<"} {buyThreshold} · Sell when RSI {">"} {sellThreshold}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">
                Buy Threshold (RSI {"<"} {buyThreshold})
              </label>
              <Slider
                value={[buyThreshold]}
                onValueChange={([v]) => { setBuyThreshold(v); setHasRun(false); }}
                min={10}
                max={50}
                step={5}
                className="w-full"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">
                Sell Threshold (RSI {">"} {sellThreshold})
              </label>
              <Slider
                value={[sellThreshold]}
                onValueChange={([v]) => { setSellThreshold(v); setHasRun(false); }}
                min={50}
                max={90}
                step={5}
                className="w-full"
              />
            </div>
          </div>
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setHasRun(true)}
          >
            <Play className="h-3 w-3" />
            Run Backtest
          </Button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-3 animate-fade-in">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <MetricCard
              label="Total Return"
              value={`${result.totalReturn > 0 ? "+" : ""}${result.totalReturn}%`}
              positive={result.totalReturn >= 0}
            />
            <MetricCard
              label="Win Rate"
              value={`${result.winRate}%`}
              positive={result.winRate >= 50}
            />
            <MetricCard
              label="Max Drawdown"
              value={`-${result.maxDrawdown}%`}
              positive={result.maxDrawdown < 10}
            />
            <MetricCard
              label="Total Trades"
              value={`${result.totalTrades}`}
              subtitle={`${result.winningTrades}W / ${result.losingTrades}L`}
            />
          </div>

          {/* Equity Curve */}
          {result.equityCurve.length > 0 && (
            <div>
              <p className="text-[11px] font-medium text-muted-foreground mb-2">Equity Curve (₹1,00,000 initial)</p>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={result.equityCurve} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 56, 78, 0.3)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: "#6b7280" }}
                    tickFormatter={(val) => val?.slice(5) || ""}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "#6b7280" }}
                    width={50}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Portfolio"]}
                  />
                  <ReferenceLine y={100000} stroke="rgba(107, 114, 128, 0.4)" strokeDasharray="4 4" />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={result.totalReturn >= 0 ? "#10b981" : "#ef4444"}
                    strokeWidth={1.5}
                    fill={result.totalReturn >= 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Trade Log */}
          {result.trades.length > 0 && (
            <div>
              <p className="text-[11px] font-medium text-muted-foreground mb-1.5">Trade Log</p>
              <div className="max-h-32 overflow-y-auto rounded-lg border border-border/30 bg-muted/10">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Action</th>
                      <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Date</th>
                      <th className="px-2 py-1.5 text-right font-medium text-muted-foreground">Price</th>
                      <th className="px-2 py-1.5 text-right font-medium text-muted-foreground">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.trades.map((trade, i) => (
                      <tr key={i} className="border-b border-border/10 last:border-0">
                        <td className="px-2 py-1">
                          <span className={`inline-flex items-center gap-1 ${trade.type === "buy" ? "text-emerald-400" : "text-red-400"}`}>
                            {trade.type === "buy" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {trade.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-2 py-1 text-muted-foreground">{trade.date}</td>
                        <td className="px-2 py-1 text-right tabular-nums">₹{trade.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                        <td className={`px-2 py-1 text-right tabular-nums ${trade.pnl !== undefined ? (trade.pnl >= 0 ? "text-emerald-400" : "text-red-400") : "text-muted-foreground"}`}>
                          {trade.pnl !== undefined ? `${trade.pnl >= 0 ? "+" : ""}₹${Math.round(trade.pnl).toLocaleString("en-IN")}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground/60 italic">
            *Backtesting uses AI-generated historical data for educational purposes only. Past performance does not indicate future results.
          </p>
        </div>
      )}
    </div>
  );
};

function MetricCard({ label, value, positive, subtitle }: { label: string; value: string; positive?: boolean; subtitle?: string }) {
  return (
    <div className="rounded-lg border border-border/30 bg-muted/20 px-3 py-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`text-sm font-bold tabular-nums ${positive === true ? "text-emerald-400" : positive === false ? "text-red-400" : "text-foreground"}`}>
        {value}
      </p>
      {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export default BacktestingCard;
