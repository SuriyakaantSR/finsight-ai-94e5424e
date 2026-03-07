import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface FundamentalMetrics {
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

interface FundamentalsCardProps {
  metrics: FundamentalMetrics;
  stockSymbol?: string;
}

const MetricRow = ({ label, value, suffix = "", isPositiveGood = true }: {
  label: string;
  value: number | string | undefined;
  suffix?: string;
  isPositiveGood?: boolean;
}) => {
  if (value === undefined || value === null) return null;

  const numVal = typeof value === "number" ? value : parseFloat(value);
  const isPositive = !isNaN(numVal) && numVal > 0;

  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-mono font-medium">
          {typeof value === "string" ? value : numVal.toFixed(2)}{suffix}
        </span>
        {typeof value === "number" && (
          <span className={`${isPositive === isPositiveGood ? "text-[hsl(var(--chart-up))]" : "text-[hsl(var(--chart-down))]"}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : numVal < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3 text-muted-foreground" />}
          </span>
        )}
      </div>
    </div>
  );
};

const FundamentalsCard = ({ metrics, stockSymbol }: FundamentalsCardProps) => {
  if (!metrics) return null;

  const hasData = Object.values(metrics).some(v => v !== undefined && v !== null);
  if (!hasData) return null;

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
      <h4 className="text-sm font-semibold mb-3">
        {stockSymbol || "Stock"} Fundamentals
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <div>
          <MetricRow label="P/E Ratio" value={metrics.pe_ratio} suffix="x" isPositiveGood={false} />
          <MetricRow label="EPS" value={metrics.eps} suffix="" />
          <MetricRow label="ROE" value={metrics.roe} suffix="%" />
          <MetricRow label="ROCE" value={metrics.roce} suffix="%" />
          <MetricRow label="Dividend Yield" value={metrics.dividend_yield} suffix="%" />
        </div>
        <div>
          <MetricRow label="D/E Ratio" value={metrics.debt_to_equity} suffix="" isPositiveGood={false} />
          <MetricRow label="Revenue Growth" value={metrics.revenue_growth} suffix="%" />
          <MetricRow label="Profit Margin" value={metrics.profit_margin} suffix="%" />
          <MetricRow label="Book Value" value={metrics.book_value} suffix="" />
          {metrics.market_cap && (
            <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <span className="text-xs text-muted-foreground">Market Cap</span>
              <span className="text-sm font-mono font-medium">{metrics.market_cap}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundamentalsCard;
