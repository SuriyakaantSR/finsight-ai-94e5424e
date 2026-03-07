import { Shield, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ConfidenceBadgeProps {
  score?: number | null;
  signal?: "bullish" | "bearish" | "neutral" | null;
}

const ConfidenceBadge = ({ score, signal }: ConfidenceBadgeProps) => {
  if (score === null && signal === null) return null;
  if (score === undefined && signal === undefined) return null;

  const getScoreColor = (s: number) => {
    if (s >= 70) return "text-[hsl(var(--chart-up))] bg-[hsl(var(--chart-up))]/10 border-[hsl(var(--chart-up))]/20";
    if (s >= 40) return "text-warning bg-warning/10 border-warning/20";
    return "text-[hsl(var(--chart-down))] bg-[hsl(var(--chart-down))]/10 border-[hsl(var(--chart-down))]/20";
  };

  const getSignalIcon = () => {
    if (signal === "bullish") return <TrendingUp className="h-3.5 w-3.5" />;
    if (signal === "bearish") return <TrendingDown className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  const getSignalColor = () => {
    if (signal === "bullish") return "text-[hsl(var(--chart-up))]";
    if (signal === "bearish") return "text-[hsl(var(--chart-down))]";
    return "text-muted-foreground";
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 px-4 py-3">
      {score !== null && score !== undefined && (
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${getScoreColor(score)}`}>
          <Shield className="h-3.5 w-3.5" />
          <span className="text-sm font-semibold font-mono">{score}%</span>
          <span className="text-[10px] opacity-70">confidence</span>
        </div>
      )}
      {signal && (
        <div className={`flex items-center gap-1.5 ${getSignalColor()}`}>
          {getSignalIcon()}
          <span className="text-sm font-medium capitalize">{signal}</span>
        </div>
      )}
    </div>
  );
};

export default ConfidenceBadge;
