import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const StockCard = ({ symbol, name, price, change, changePercent }: StockCardProps) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-sm">{symbol}</h3>
          <p className="text-xs text-muted-foreground truncate max-w-[120px]">{name}</p>
        </div>
        <div className={`p-1.5 rounded-lg ${
          isPositive ? "bg-success/10" : isNeutral ? "bg-muted" : "bg-destructive/10"
        }`}>
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-success" />
          ) : isNeutral ? (
            <Minus className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-lg font-mono font-semibold">₹{price.toLocaleString()}</span>
        <div className={`text-sm font-medium ${
          isPositive ? "text-success" : isNeutral ? "text-muted-foreground" : "text-destructive"
        }`}>
          {isPositive ? "+" : ""}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
        </div>
      </div>
    </div>
  );
};

export default StockCard;
