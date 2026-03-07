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

interface CandlestickChartProps {
  data: OHLCVData[];
  sma20?: SMAData[];
  sma50?: SMAData[];
  stockSymbol?: string;
}

const CandlestickChart = ({ data, sma20, sma50, stockSymbol }: CandlestickChartProps) => {
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

    // Candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#10b981",
      wickDownColor: "#ef4444",
      wickUpColor: "#10b981",
    });

    const candleData = data.map(d => ({
      time: d.date as any,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));
    candlestickSeries.setData(candleData);

    // Volume series
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" as any },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    const volumeData = data.map(d => ({
      time: d.date as any,
      value: d.volume,
      color: d.close >= d.open
        ? "rgba(16, 185, 129, 0.3)"
        : "rgba(239, 68, 68, 0.3)",
    }));
    volumeSeries.setData(volumeData);

    // SMA 20
    if (sma20?.length) {
      const sma20Series = chart.addLineSeries({
        color: "#f59e0b",
        lineWidth: 1,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      sma20Series.setData(sma20.map(d => ({ time: d.date as any, value: d.value })));
    }

    // SMA 50
    if (sma50?.length) {
      const sma50Series = chart.addLineSeries({
        color: "#8b5cf6",
        lineWidth: 1,
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      sma50Series.setData(sma50.map(d => ({ time: d.date as any, value: d.value })));
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
  }, [data, sma20, sma50, resolvedTheme]);

  if (!data?.length) return null;

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">{stockSymbol || "Stock"} Price Chart</h4>
          <span className="text-xs text-muted-foreground">OHLCV</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          {sma20?.length ? (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
              SMA 20
            </span>
          ) : null}
          {sma50?.length ? (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
              SMA 50
            </span>
          ) : null}
        </div>
      </div>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default CandlestickChart;
