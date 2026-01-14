import Navbar from "@/components/layout/Navbar";
import AnalysisChat from "@/components/dashboard/AnalysisChat";
import { BarChart3, LineChart, TrendingUp, FileText, Zap, Shield } from "lucide-react";

const analysisTypes = [
  {
    icon: TrendingUp,
    title: "Technical Analysis",
    description: "RSI, MACD, Moving Averages, Bollinger Bands, Support & Resistance levels",
    example: "\"What are the technical indicators for TCS?\"",
  },
  {
    icon: BarChart3,
    title: "Fundamental Analysis",
    description: "P/E Ratio, EPS, Revenue Growth, ROE/ROCE, Debt Ratios",
    example: "\"Analyze RELIANCE fundamentals\"",
  },
  {
    icon: LineChart,
    title: "Historical Trends",
    description: "5-10 year performance, CAGR calculations, price patterns",
    example: "\"Show INFY performance over last 5 years\"",
  },
  {
    icon: FileText,
    title: "Comparative Analysis",
    description: "Multi-stock comparison, sector analysis, peer benchmarking",
    example: "\"Compare TCS vs INFY vs WIPRO\"",
  },
];

const Analysis = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              AI-Powered <span className="text-gradient">Stock Analysis</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ask questions about any NSE/BSE stock and get detailed, educational insights powered by AI
            </p>
          </div>

          {/* Analysis Types */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {analysisTypes.map((type) => (
              <div
                key={type.title}
                className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <type.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{type.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{type.description}</p>
                <code className="text-xs text-primary/80 bg-primary/5 px-2 py-1 rounded">
                  {type.example}
                </code>
              </div>
            ))}
          </div>

          {/* Main Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <AnalysisChat />
          </div>

          {/* Features Footer */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/30">
              <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Real-time Processing</h4>
                <p className="text-xs text-muted-foreground">
                  Instant analysis with cached historical data
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/30">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Domain Restricted</h4>
                <p className="text-xs text-muted-foreground">
                  Only finance-related queries accepted
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card/30">
              <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Educational Only</h4>
                <p className="text-xs text-muted-foreground">
                  Insights based on historical data, not predictions
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analysis;
