import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface ATRChartProps {
  data: Array<{ date: string; value: number }>;
}

const chartTooltipStyle = {
  backgroundColor: "hsl(222, 47%, 10%)",
  border: "1px solid hsl(217, 33%, 20%)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "#e2e8f0",
};

const ATRChart = ({ data }: ATRChartProps) => {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <h4 className="text-sm font-semibold">ATR</h4>
        <span className="text-[10px] text-muted-foreground">Average True Range (14)</span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 56, 78, 0.3)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: "#6b7280" }}
            tickFormatter={(v) => v?.slice(5) || ""}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} width={45} />
          <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`₹${v.toFixed(2)}`, "ATR"]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={1.5}
            fill="rgba(139, 92, 246, 0.1)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="mt-1 text-[10px] text-muted-foreground">Higher ATR = Higher volatility</p>
    </div>
  );
};

export default ATRChart;
