import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface ADXChartProps {
  data: Array<{
    date: string;
    value: number;
    plusDI: number;
    minusDI: number;
  }>;
}

const chartTooltipStyle = {
  backgroundColor: "hsl(222, 47%, 10%)",
  border: "1px solid hsl(217, 33%, 20%)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "#e2e8f0",
};

const ADXChart = ({ data }: ADXChartProps) => {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">ADX / DI</h4>
          <span className="text-[10px] text-muted-foreground">Average Directional Index</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
            ADX
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            +DI
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
            -DI
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 56, 78, 0.3)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: "#6b7280" }}
            tickFormatter={(v) => v?.slice(5) || ""}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} width={30} domain={[0, 100]} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <ReferenceLine y={25} stroke="rgba(107, 114, 128, 0.4)" strokeDasharray="4 4" label={{ value: "25", position: "right", fontSize: 9, fill: "#6b7280" }} />
          <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} name="ADX" />
          <Line type="monotone" dataKey="plusDI" stroke="#10b981" strokeWidth={1} dot={false} name="+DI" />
          <Line type="monotone" dataKey="minusDI" stroke="#ef4444" strokeWidth={1} dot={false} name="-DI" />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center gap-4 text-[10px] text-muted-foreground">
        <span>ADX {">"} 25 = Strong trend</span>
        <span>+DI {">"} -DI = Bullish</span>
        <span>-DI {">"} +DI = Bearish</span>
      </div>
    </div>
  );
};

export default ADXChart;
