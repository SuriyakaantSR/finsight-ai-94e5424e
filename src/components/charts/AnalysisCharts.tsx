import { useState } from "react";
import { BarChart3, CandlestickChart as CandlestickIcon, Activity, LineChart, FlaskConical, FileDown } from "lucide-react";
import CandlestickChart from "./CandlestickChart";
import { RSIChart, MACDChart } from "./IndicatorCharts";
import FundamentalsCard from "./FundamentalsCard";
import ConfidenceBadge from "./ConfidenceBadge";
import BacktestingCard from "./BacktestingCard";
import { Button } from "@/components/ui/button";
import { ChartData } from "@/types/chat";
import { exportChartDataCsv } from "@/lib/csv-export";

interface AnalysisChartsProps {
  chartData?: ChartData | null;
  fundamentalMetrics?: any;
  stockSymbol?: string | null;
  confidenceScore?: number | null;
  signal?: "bullish" | "bearish" | "neutral" | null;
}

type ChartTab = "price" | "rsi" | "macd" | "fundamentals" | "backtest";

const AnalysisCharts = ({
  chartData,
  fundamentalMetrics,
  stockSymbol,
  confidenceScore,
  signal,
}: AnalysisChartsProps) => {
  const [activeTab, setActiveTab] = useState<ChartTab>("price");

  const hasCharts = chartData?.ohlcv?.length;
  const hasRSI = chartData?.rsi?.length;
  const hasMACD = chartData?.macd?.length;
  const hasFundamentals = fundamentalMetrics && Object.values(fundamentalMetrics).some(v => v !== undefined && v !== null);

  if (!hasCharts && !hasFundamentals && confidenceScore === null && confidenceScore === undefined) {
    return null;
  }

  const tabs = ([
    { id: "price" as ChartTab, label: "Price", icon: CandlestickIcon, available: !!hasCharts },
    { id: "rsi" as ChartTab, label: "RSI", icon: Activity, available: !!hasRSI },
    { id: "macd" as ChartTab, label: "MACD", icon: LineChart, available: !!hasMACD },
    { id: "fundamentals" as ChartTab, label: "Fundamentals", icon: BarChart3, available: !!hasFundamentals },
    { id: "backtest" as ChartTab, label: "Backtest", icon: FlaskConical, available: !!hasCharts && !!hasRSI },
  ]).filter(t => t.available);

  return (
    <div className="mt-3 space-y-3 animate-fade-in">
      {/* Confidence Badge */}
      <ConfidenceBadge score={confidenceScore} signal={signal} />

      {/* Chart Tabs */}
      {tabs.length > 1 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border/30 bg-muted/30 p-1 w-fit">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs gap-1.5"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-3 w-3" />
                {tab.label}
              </Button>
            ))}
          </div>
          {chartData && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2.5 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => exportChartDataCsv(chartData, stockSymbol || undefined)}
              title="Export chart data as CSV"
            >
              <FileDown className="h-3.5 w-3.5" />
              CSV
            </Button>
          )}
        </div>
      )}

      {/* Chart Content */}
      {activeTab === "price" && hasCharts && (
        <CandlestickChart
          data={chartData!.ohlcv!}
          sma20={chartData?.sma20}
          sma50={chartData?.sma50}
          stockSymbol={stockSymbol || undefined}
        />
      )}

      {activeTab === "rsi" && hasRSI && (
        <RSIChart data={chartData!.rsi!} />
      )}

      {activeTab === "macd" && hasMACD && (
        <MACDChart data={chartData!.macd!} />
      )}

      {activeTab === "fundamentals" && hasFundamentals && (
        <FundamentalsCard
          metrics={fundamentalMetrics}
          stockSymbol={stockSymbol || undefined}
        />
      )}

      {activeTab === "backtest" && hasCharts && hasRSI && (
        <BacktestingCard
          ohlcvData={chartData!.ohlcv!}
          rsiData={chartData!.rsi!}
          stockSymbol={stockSymbol || undefined}
        />
      )}
    </div>
  );
};

export default AnalysisCharts;
