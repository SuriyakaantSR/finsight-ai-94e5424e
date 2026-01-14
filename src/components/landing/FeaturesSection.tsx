import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Shield, 
  LineChart,
  FileText,
  Zap,
  Lock
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced LLM technology provides clear, human-readable explanations of complex market data.",
  },
  {
    icon: BarChart3,
    title: "Technical Indicators",
    description: "RSI, MACD, Moving Averages, Support/Resistance levels computed in real-time.",
  },
  {
    icon: TrendingUp,
    title: "Fundamental Analysis",
    description: "Revenue growth, profit margins, debt ratios, ROE/ROCE and more financial metrics.",
  },
  {
    icon: LineChart,
    title: "Historical Backtesting",
    description: "Validate analysis logic against past market behavior for educational insights.",
  },
  {
    icon: Shield,
    title: "NSE/BSE Focus",
    description: "Specialized for Indian stock market with data from trusted sources.",
  },
  {
    icon: FileText,
    title: "Export Reports",
    description: "Generate comprehensive PDF reports of your stock analysis.",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Fast, responsive analysis with cached historical data for optimal performance.",
  },
  {
    icon: Lock,
    title: "Domain Restricted",
    description: "Strictly financial queries only—no general chatbot behavior.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05),transparent_70%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional-Grade <span className="text-gradient">Analysis Tools</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need for comprehensive stock market research, powered by AI and grounded in historical data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
