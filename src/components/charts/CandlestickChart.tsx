import { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";
import { useTheme } from "@/hooks/useTheme";

interface OHLCVData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface SMAData {
  date: string;
  value: number;
}

interface BollingerData {
  date: string;
  upper: number;
  middle: number;
  lower: number;
}

interface CandlestickChartProps {
  data: OHLCVData[];
  sma20?: SMAData[];
  sma50?: SMAData[];
  ema20?: SMAData[];
  ema50?: SMAData[];
  vwap?: SMAData[];
  bollingerBands?: BollingerData[];
  stockSymbol?: string;
}

const CandlestickChart = ({ data, sma20, sma50, ema20, ema50, vwap, bollingerBands, stockSymbol }: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!chartContainerRef.current || !data?.length) return;

    const isDark = resolvedTheme === "dark";

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: isDark ? "#8b95a5" : "#6b7280",
        fontSize: 11,
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: isDark ? "rgba(42, 56, 78, 0.4)" : "rgba(0,0,0,0.06)" },
        horzLines: { color: isDark ? "rgba(42, 56, 78, 0.4)" : "rgba(0,0,0,0.06)" },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: isDark ? "#4b5563" : "#9ca3af", width: 1, style: 2, labelBackgroundColor: isDark ? "#1f2937" : "#f3f4f6" },
        horzLine: { color: isDark ? "#4b5563" : "#9ca3af", width: 1, style: 2, labelBackgroundColor: isDark ? "#1f2937" : "#f3f4f6" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 320,
      timeScale: {
        borderColor: isDark ? "rgba(42, 56, 78, 0.6)" : "rgba(0,0,0,0.1)",
        timeVisible: false,
      },
      rightPriceScale: {
        borderColor: isDark ? "rgba(42, 56, 78, 0.6)" : "rgba(0,0,0,0.1)",
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#10b981",
      wickDownColor: "#ef4444",
      wickUpColor: "#10b981",
    });

    candlestickSeries.setData(data.map(d => ({
      time: d.date as any,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    })));

    // Volume
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" as any },
      priceScaleId: "volume",
    });
    chart.priceScale("volume").applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
    volumeSeries.setData(data.map(d => ({
      time: d.date as any,
      value: d.volume,
      color: d.close >= d.open ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)",
    })));

    // Overlay helpers
    const addOverlay = (overlayData: SMAData[] | undefined, color: string) => {
      if (!overlayData?.length) return;
      const series = chart.addLineSeries({
        color,
        lineWidth: 1,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      series.setData(overlayData.map(d => ({ time: d.date as any, value: d.value })));
    };

    addOverlay(sma20, "#f59e0b");
    addOverlay(sma50, "#8b5cf6");
    addOverlay(ema20, "#06b6d4");
    addOverlay(ema50, "#ec4899");
    addOverlay(vwap, "#6366f1");

    // Bollinger Bands overlay
    if (bollingerBands?.length) {
      const upperSeries = chart.addLineSeries({
        color: "rgba(139, 92, 246, 0.5)",
        lineWidth: 1,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
        lineStyle: 2,
      });
      upperSeries.setData(bollingerBands.map(d => ({ time: d.date as any, value: d.upper })));

      const lowerSeries = chart.addLineSeries({
        color: "rgba(139, 92, 246, 0.5)",
        lineWidth: 1,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
        lineStyle: 2,
      });
      lowerSeries.setData(bollingerBands.map(d => ({ time: d.date as any, value: d.lower })));
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, sma20, sma50, ema20, ema50, vwap, bollingerBands, resolvedTheme]);

  if (!data?.length) return null;

  const legends = [
    { data: sma20, color: "#f59e0b", label: "SMA 20" },
    { data: sma50, color: "#8b5cf6", label: "SMA 50" },
    { data: ema20, color: "#06b6d4", label: "EMA 20" },
    { data: ema50, color: "#ec4899", label: "EMA 50" },
    { data: vwap, color: "#6366f1", label: "VWAP" },
    { data: bollingerBands, color: "#8b5cf6", label: "BB" },
  ].filter(l => l.data?.length);

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">{stockSymbol || "Stock"} Price Chart</h4>
          <span className="text-xs text-muted-foreground">OHLCV</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] flex-wrap justify-end">
          {legends.map(l => (
            <span key={l.label} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default CandlestickChart;
