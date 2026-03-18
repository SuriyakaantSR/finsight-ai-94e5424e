import { Target, ShieldAlert, TrendingUp } from "lucide-react";
import { RiskRewardData } from "@/types/chat";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";

interface RiskRewardCardProps {
  data: RiskRewardData;
  stockSymbol?: string;
}

const chartTooltipStyle = {
  backgroundColor: "hsl(222, 47%, 10%)",
  border: "1px solid hsl(217, 33%, 20%)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "#e2e8f0",
};

const RiskRewardCard = ({ data, stockSymbol }: RiskRewardCardProps) => {
  const {
    riskRewardRatio = 0,
    stopLoss = 0,
    targetPrice = 0,
    currentPrice = 0,
    riskPercent = 0,
    rewardPercent = 0,
  } = data;

  const barData = [
    { name: "Risk", value: Math.abs(riskPercent), fill: "risk" },
    { name: "Reward", value: Math.abs(rewardPercent), fill: "reward" },
  ];

  const getRatioColor = (ratio: number) => {
    if (ratio >= 2) return "text-[hsl(var(--chart-up))]";
    if (ratio >= 1) return "text-warning";
    return "text-[hsl(var(--chart-down))]";
  };

  const getRatioLabel = (ratio: number) => {
    if (ratio >= 3) return "Excellent";
    if (ratio >= 2) return "Good";
    if (ratio >= 1) return "Fair";
    return "Poor";
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold">
            Risk vs Reward Analysis
          </h4>
          {stockSymbol && (
            <span className="text-xs text-muted-foreground">{stockSymbol}</span>
          )}
        </div>
        <div className={`flex items-center gap-1.5 font-mono text-sm font-bold ${getRatioColor(riskRewardRatio)}`}>
          1:{riskRewardRatio.toFixed(1)}
          <span className="text-[10px] font-normal text-muted-foreground">
            ({getRatioLabel(riskRewardRatio)})
          </span>
        </div>
      </div>

      {/* Price Levels */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ShieldAlert className="h-3 w-3 text-[hsl(var(--chart-down))]" />
            <p className="text-[10px] text-muted-foreground">Stop Loss</p>
          </div>
          <p className="text-sm font-bold font-mono text-[hsl(var(--chart-down))]">
            ₹{stopLoss.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-[hsl(var(--chart-down))]">-{riskPercent.toFixed(1)}%</p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-center">
          <p className="text-[10px] text-muted-foreground mb-1">Current</p>
          <p className="text-sm font-bold font-mono text-primary">
            ₹{currentPrice.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-muted-foreground">Entry</p>
        </div>
        <div className="rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="h-3 w-3 text-[hsl(var(--chart-up))]" />
            <p className="text-[10px] text-muted-foreground">Target</p>
          </div>
          <p className="text-sm font-bold font-mono text-[hsl(var(--chart-up))]">
            ₹{targetPrice.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-[hsl(var(--chart-up))]">+{rewardPercent.toFixed(1)}%</p>
        </div>
      </div>

      {/* Risk/Reward Bar Chart */}
      <div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart
            data={barData}
            layout="vertical"
            margin={{ top: 5, right: 10, bottom: 5, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 56, 78, 0.3)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 9, fill: "#6b7280" }} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} width={50} />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value: number) => [`${value.toFixed(1)}%`, ""]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {barData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.fill === "risk" ? "#ef4444" : "#10b981"}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Visual Price Range */}
      <div className="relative h-3 rounded-full bg-muted/30 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-l-full bg-[hsl(var(--chart-down))]/30"
          style={{ width: `${(riskPercent / (riskPercent + rewardPercent)) * 100}%` }}
        />
        <div
          className="absolute right-0 top-0 h-full rounded-r-full bg-[hsl(var(--chart-up))]/30"
          style={{ width: `${(rewardPercent / (riskPercent + rewardPercent)) * 100}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-1 rounded-full bg-primary shadow-md shadow-primary/50"
          style={{ left: `${(riskPercent / (riskPercent + rewardPercent)) * 100}%` }}
        />
      </div>

      <p className="text-[10px] text-muted-foreground/60 italic">
        *Risk/Reward analysis is for educational purposes only. Actual results may vary.
      </p>
    </div>
  );
};

export default RiskRewardCard;
