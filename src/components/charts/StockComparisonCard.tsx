import { useState } from "react";
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComparisonData } from "@/types/chat";
import ConfidenceBadge from "./ConfidenceBadge";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface StockComparisonCardProps {
  comparisonData: ComparisonData;
}

const chartTooltipStyle = {
  backgroundColor: "hsl(222, 47%, 10%)",
  border: "1px solid hsl(217, 33%, 20%)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "#e2e8f0",
};

type CompareView = "fundamentals" | "price";

const StockComparisonCard = ({ comparisonData }: StockComparisonCardProps) => {
  const [view, setView] = useState<CompareView>("fundamentals");
  const [stockA, stockB] = comparisonData.stocks;

  const metricsA = stockA.fundamentalMetrics;
  const metricsB = stockB.fundamentalMetrics;

  const metricRows: Array<{ label: string; key: string; suffix?: string; lowerBetter?: boolean }> = [
    { label: "P/E Ratio", key: "pe_ratio", suffix: "x", lowerBetter: true },
    { label: "EPS", key: "eps", suffix: "₹" },
    { label: "ROE", key: "roe", suffix: "%" },
    { label: "ROCE", key: "roce", suffix: "%" },
    { label: "Debt/Equity", key: "debt_to_equity", suffix: "x", lowerBetter: true },
    { label: "Revenue Growth", key: "revenue_growth", suffix: "%" },
    { label: "Profit Margin", key: "profit_margin", suffix: "%" },
    { label: "Dividend Yield", key: "dividend_yield", suffix: "%" },
    { label: "Book Value", key: "book_value", suffix: "₹" },
    { label: "Market Cap", key: "market_cap" },
  ];

  function getVal(metrics: any, key: string): string {
    if (!metrics || metrics[key] === undefined || metrics[key] === null) return "—";
    return String(metrics[key]);
  }

  function getBetter(a: any, b: any, key: string, lowerBetter?: boolean): "a" | "b" | "tie" {
    const valA = a?.[key];
    const valB = b?.[key];
    if (valA == null || valB == null) return "tie";
    if (typeof valA === "string" || typeof valB === "string") return "tie";
    if (valA === valB) return "tie";
    if (lowerBetter) return valA < valB ? "a" : "b";
    return valA > valB ? "a" : "b";
  }

  const signalIcon = (signal?: string | null) => {
    if (signal === "bullish") return <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />;
    if (signal === "bearish") return <TrendingDown className="h-3.5 w-3.5 text-red-400" />;
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  // Normalize price data for overlay chart
  const normalizedData = () => {
    const ohlcvA = stockA.chartData?.ohlcv;
    const ohlcvB = stockB.chartData?.ohlcv;
    if (!ohlcvA?.length || !ohlcvB?.length) return [];

    const baseA = ohlcvA[0].close;
    const baseB = ohlcvB[0].close;
    const mapB = new Map(ohlcvB.map((d) => [d.date, d.close]));

    return ohlcvA.map((d) => {
      const bClose = mapB.get(d.date);
      return {
        date: d.date,
        [stockA.symbol]: Math.round(((d.close / baseA) * 100 - 100) * 100) / 100,
        [stockB.symbol]: bClose != null ? Math.round(((bClose / baseB) * 100 - 100) * 100) / 100 : null,
      };
    });
  };

  return (
    <div className="w-full rounded-xl border border-border/50 bg-card/50 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <ArrowUpDown className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">
            {stockA.symbol} vs {stockB.symbol}
          </h3>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border/30 bg-muted/30 p-0.5">
          <Button
            variant={view === "fundamentals" ? "secondary" : "ghost"}
            size="sm"
            className="h-6 px-2.5 text-[11px]"
            onClick={() => setView("fundamentals")}
          >
            Fundamentals
          </Button>
          <Button
            variant={view === "price" ? "secondary" : "ghost"}
            size="sm"
            className="h-6 px-2.5 text-[11px]"
            onClick={() => setView("price")}
          >
            Price
          </Button>
        </div>
      </div>

      {/* Signal Summary */}
      <div className="grid grid-cols-2 gap-px bg-border/20">
        {[stockA, stockB].map((stock) => (
          <div key={stock.symbol} className="bg-card/80 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {signalIcon(stock.signal)}
              <span className="text-xs font-semibold">{stock.symbol}</span>
            </div>
            {stock.confidenceScore != null && (
              <span className="text-[10px] text-muted-foreground">
                Confidence: <span className="font-medium text-foreground">{stock.confidenceScore}%</span>
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Fundamentals Table */}
      {view === "fundamentals" && (metricsA || metricsB) && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/30 bg-muted/20">
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Metric</th>
                <th className="px-4 py-2 text-right font-medium text-primary">{stockA.symbol}</th>
                <th className="px-4 py-2 text-right font-medium text-primary">{stockB.symbol}</th>
              </tr>
            </thead>
            <tbody>
              {metricRows.map((row) => {
                const better = getBetter(metricsA, metricsB, row.key, row.lowerBetter);
                const valA = getVal(metricsA, row.key);
                const valB = getVal(metricsB, row.key);
                if (valA === "—" && valB === "—") return null;
                return (
                  <tr key={row.key} className="border-b border-border/10 last:border-0">
                    <td className="px-4 py-2 text-muted-foreground">{row.label}</td>
                    <td className={`px-4 py-2 text-right tabular-nums font-medium ${better === "a" ? "text-emerald-400" : better === "b" ? "text-red-400" : "text-foreground"}`}>
                      {row.key === "market_cap" ? valA : valA !== "—" ? `${valA}${row.suffix || ""}` : "—"}
                    </td>
                    <td className={`px-4 py-2 text-right tabular-nums font-medium ${better === "b" ? "text-emerald-400" : better === "a" ? "text-red-400" : "text-foreground"}`}>
                      {row.key === "market_cap" ? valB : valB !== "—" ? `${valB}${row.suffix || ""}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Price Comparison Chart */}
      {view === "price" && (
        <div className="p-4">
          <p className="text-[11px] font-medium text-muted-foreground mb-2">
            Relative Price Performance (% change)
          </p>
          {normalizedData().length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={normalizedData()} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 56, 78, 0.3)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: "#6b7280" }}
                  tickFormatter={(val) => val?.slice(5) || ""}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "#6b7280" }}
                  width={40}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                />
                <Area
                  type="monotone"
                  dataKey={stockA.symbol}
                  stroke="#10b981"
                  strokeWidth={1.5}
                  fill="rgba(16, 185, 129, 0.08)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey={stockB.symbol}
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  fill="rgba(99, 102, 241, 0.08)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground py-8 text-center">
              Price data not available for comparison
            </p>
          )}
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-4 rounded-sm bg-emerald-500" />
              <span className="text-[10px] text-muted-foreground">{stockA.symbol}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-4 rounded-sm bg-indigo-500" />
              <span className="text-[10px] text-muted-foreground">{stockB.symbol}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockComparisonCard;
