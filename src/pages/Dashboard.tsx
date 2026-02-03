import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import StockSearchInput from "@/components/dashboard/StockSearchInput";
import StockCard from "@/components/dashboard/StockCard";
import AnalysisChat from "@/components/dashboard/AnalysisChat";
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";

// Demo data for market overview
const marketIndices = [
  { name: "NIFTY 50", value: 22456.80, change: 145.20, changePercent: 0.65 },
  { name: "SENSEX", value: 73876.50, change: 486.35, changePercent: 0.66 },
  { name: "NIFTY BANK", value: 48125.40, change: -87.65, changePercent: -0.18 },
];

const topGainers = [
  { symbol: "ADANIPORTS", name: "Adani Ports", price: 1245.50, change: 48.20, changePercent: 4.02 },
  { symbol: "TATAMOTORS", name: "Tata Motors", price: 987.30, change: 32.15, changePercent: 3.36 },
  { symbol: "HINDALCO", name: "Hindalco Industries", price: 623.80, change: 18.45, changePercent: 3.05 },
];

const topLosers = [
  { symbol: "CIPLA", name: "Cipla Ltd", price: 1456.20, change: -28.40, changePercent: -1.91 },
  { symbol: "SUNPHARMA", name: "Sun Pharma", price: 1632.50, change: -24.80, changePercent: -1.50 },
  { symbol: "DRREDDY", name: "Dr Reddy's Labs", price: 5847.00, change: -78.20, changePercent: -1.32 },
];

const Dashboard = () => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setIsSearching(true);
    // The chat component handles the actual search/analysis
    setTimeout(() => setIsSearching(false), 100);
    console.log("Search query:", query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Stock Market <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Analyze NSE/BSE stocks with AI-powered insights based on historical data
            </p>
          </div>

          {/* Search */}
          <div className="mb-12">
            <StockSearchInput onSearch={handleSearch} isLoading={isSearching} />
          </div>

          {/* Market Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {marketIndices.map((index) => (
              <div key={index.name} className="p-5 rounded-xl bg-card border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{index.name}</span>
                  <div className={`flex items-center gap-1 text-sm ${
                    index.change >= 0 ? "text-success" : "text-destructive"
                  }`}>
                    {index.change >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {index.changePercent >= 0 ? "+" : ""}{index.changePercent.toFixed(2)}%
                  </div>
                </div>
                <div className="text-2xl font-mono font-bold">
                  {index.value.toLocaleString()}
                </div>
                <div className={`text-sm ${index.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {index.change >= 0 ? "+" : ""}{index.change.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Analysis Chat - Takes 2 columns */}
            <div className="lg:col-span-2">
              <AnalysisChat />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Top Gainers */}
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <h3 className="font-semibold">Top Gainers</h3>
                </div>
                <div className="space-y-3">
                  {topGainers.map((stock) => (
                    <StockCard key={stock.symbol} {...stock} />
                  ))}
                </div>
              </div>

              {/* Top Losers */}
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  <h3 className="font-semibold">Top Losers</h3>
                </div>
                <div className="space-y-3">
                  {topLosers.map((stock) => (
                    <StockCard key={stock.symbol} {...stock} />
                  ))}
                </div>
              </div>

              {/* Market Status */}
              <div className="p-4 rounded-xl bg-card border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Market Status This Section is Edited By VN-78 </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>NSE/BSE: 9:15 AM - 3:30 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
