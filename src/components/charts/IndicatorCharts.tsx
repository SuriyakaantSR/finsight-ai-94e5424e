import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ComposedChart,
  Area,
} from "recharts";

interface RSIData {
  date: string;
  value: number;
}

interface MACDData {
  date: string;
  macd: number;
  signal: number;
  histogram: number;
}

interface RSIChartProps {
  data: RSIData[];
}

interface MACDChartProps {
  data: MACDData[];
}

const chartTooltipStyle = {
  backgroundColor: "hsl(222, 47%, 10%)",
  border: "1px solid hsl(217, 33%, 20%)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "#e2e8f0",
};

export const RSIChart = ({ data }: RSIChartProps) => {
  if (!data?.length) return null;

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <h4 className="text-sm font-semibold">RSI (14)</h4>
        <span className="text-xs text-muted-foreground">Relative Strength Index</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 56, 78, 0.3)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            tickFormatter={(val) => val?.slice(5) || ""}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            width={30}
          />
          <Tooltip contentStyle={chartTooltipStyle} />
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1} label={{ value: "70", position: "right", fontSize: 9, fill: "#ef4444" }} />
          <ReferenceLine y={30} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1} label={{ value: "30", position: "right", fontSize: 9, fill: "#10b981" }} />
          <Area type="monotone" dataKey="value" fill="rgba(16, 185, 129, 0.08)" stroke="none" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: "#10b981" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MACDChart = ({ data }: MACDChartProps) => {
  if (!data?.length) return null;

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">MACD</h4>
          <span className="text-xs text-muted-foreground">12, 26, 9</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
            MACD
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
            Signal
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <ComposedChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 56, 78, 0.3)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            tickFormatter={(val) => val?.slice(5) || ""}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} width={40} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <ReferenceLine y={0} stroke="rgba(107, 114, 128, 0.5)" strokeWidth={1} />
          <Bar
            dataKey="histogram"
            fill="#10b981"
            name="Histogram"
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <rect
                key={index}
                fill={entry.histogram >= 0 ? "rgba(16, 185, 129, 0.6)" : "rgba(239, 68, 68, 0.6)"}
              />
            ))}
          </Bar>
          <Line type="monotone" dataKey="macd" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="signal" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
