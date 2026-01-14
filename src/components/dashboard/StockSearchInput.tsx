import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StockSearchInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const popularStocks = ["TCS", "RELIANCE", "INFY", "HDFCBANK", "ICICIBANK"];

const StockSearchInput = ({ onSearch, isLoading }: StockSearchInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            variant="search"
            placeholder="Analyze TCS using last 5 years data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 text-base pl-12 pr-32 rounded-xl"
          />
          <Button
            type="submit"
            variant="hero"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </form>

      {/* Quick Stock Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <span className="text-xs text-muted-foreground">Popular:</span>
        {popularStocks.map((stock) => (
          <button
            key={stock}
            onClick={() => {
              setQuery(`Analyze ${stock} stock`);
              onSearch(`Analyze ${stock} stock`);
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-accent transition-colors"
          >
            <TrendingUp className="h-3 w-3 text-primary" />
            {stock}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockSearchInput;
