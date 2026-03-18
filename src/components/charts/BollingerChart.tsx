import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface BollingerChartProps {
  data: Array<{
    date: string;
    upper: number;
    middle: number;
    lower: number;
  }>;
  ohlcv?: Array<{
    date: string;
    close: number;
  }>;
}

const chartTooltipStyle = {
  backgroundColor: "hsl(222, 47%, 10%)",
  border: "1px solid hsl(217, 33%, 20%)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "#e2e8f0",
};

const BollingerChart = ({ data, ohlcv }: BollingerChartProps) => {
  // Merge close prices with bollinger data
  const closeMap = new Map(ohlcv?.map((d) => [d.date, d.close]) || []);

  const chartData = data.map((d) => ({
    ...d,
    close: closeMap.get(d.date) ?? d.middle,
  }));

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">Bollinger Bands</h4>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
            Upper/Lower
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
            Middle
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Close
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 56, 78, 0.3)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: "#6b7280" }}
            tickFormatter={(v) => v?.slice(5) || ""}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} width={55} domain={["auto", "auto"]} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Area
            type="monotone"
            dataKey="upper"
            stroke="#8b5cf6"
            strokeWidth={1}
            fill="rgba(139, 92, 246, 0.05)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="#8b5cf6"
            strokeWidth={1}
            fill="rgba(139, 92, 246, 0.05)"
            dot={false}
          />
          <Line type="monotone" dataKey="middle" stroke="#f59e0b" strokeWidth={1} dot={false} />
          <Line type="monotone" dataKey="close" stroke="#10b981" strokeWidth={1.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BollingerChart;
