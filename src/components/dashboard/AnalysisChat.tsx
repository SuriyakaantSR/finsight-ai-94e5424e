import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const FINANCE_KEYWORDS = [
  "stock", "share", "nse", "bse", "invest", "trading", "portfolio",
  "dividend", "profit", "loss", "rsi", "macd", "ema", "sma", "analyze",
  "analysis", "market", "equity", "bond", "mutual fund", "ipo", "pe ratio",
  "eps", "revenue", "earnings", "balance sheet", "income statement",
  "fundamentals", "technical", "chart", "trend", "support", "resistance",
  "reliance", "tcs", "infosys", "infy", "hdfc", "icici", "sbi", "wipro",
  "hcl", "bharti", "airtel", "tatasteel", "tata", "bajaj", "maruti", "hero"
];

const isFinanceRelated = (query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  return FINANCE_KEYWORDS.some(keyword => lowerQuery.includes(keyword));
};

const AnalysisChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to FinSight AI. I'm your financial analysis assistant, specialized in Indian stock market (NSE/BSE) analysis.\n\n**I can help you with:**\n• Technical analysis (RSI, MACD, Moving Averages)\n• Fundamental metrics (P/E, EPS, Revenue Growth)\n• Historical performance analysis\n• Stock comparisons\n\n**Example queries:**\n• \"Analyze TCS using last 5 years data\"\n• \"Compare RELIANCE vs INFY fundamentals\"\n• \"What are the technical indicators for HDFCBANK?\"\n\n*Note: I provide educational insights only, not investment advice.*",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Check if query is finance-related
    if (!isFinanceRelated(input)) {
      setTimeout(() => {
        const redirectMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I apologize, but I'm specifically designed to assist with **Indian stock market analysis** only.\n\nI can help you with:\n• Stock analysis (TCS, RELIANCE, INFY, etc.)\n• Technical indicators\n• Fundamental metrics\n• Market trends\n\nPlease ask a question related to NSE/BSE stocks, and I'll provide you with detailed educational insights.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, redirectMessage]);
        setIsLoading(false);
      }, 800);
      return;
    }

    // Simulate AI response for demo
    setTimeout(() => {
      const analysisResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateDemoResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, analysisResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateDemoResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("tcs")) {
      return `## TCS (Tata Consultancy Services) Analysis

### Technical Indicators (Last 5 Years)
| Indicator | Value | Signal |
|-----------|-------|--------|
| RSI (14) | 58.3 | Neutral |
| MACD | +12.5 | Bullish |
| 50-Day SMA | ₹3,842 | Above |
| 200-Day SMA | ₹3,654 | Above |

### Fundamental Metrics
- **P/E Ratio:** 28.4x (Industry avg: 26.2x)
- **EPS (TTM):** ₹132.5
- **Revenue Growth (YoY):** 8.2%
- **ROE:** 47.8%

### Historical Analysis
TCS has shown consistent growth over the past 5 years with a CAGR of approximately 12.3%. The stock has maintained strong support levels around ₹3,200-3,400 range.

**Confidence Score:** 72% (based on indicator agreement)

*Disclaimer: This is educational analysis only, not investment advice.*`;
    }

    if (lowerQuery.includes("reliance")) {
      return `## RELIANCE Industries Analysis

### Technical Indicators
| Indicator | Value | Signal |
|-----------|-------|--------|
| RSI (14) | 62.1 | Slightly Overbought |
| MACD | +8.7 | Bullish |
| 50-Day SMA | ₹2,856 | Above |
| 200-Day SMA | ₹2,645 | Above |

### Fundamental Metrics
- **P/E Ratio:** 24.8x
- **Revenue Growth (YoY):** 23.5%
- **Debt/Equity:** 0.42
- **ROE:** 8.9%

### Key Observations
Reliance has diversified into telecom (Jio) and retail, reducing oil & gas dependency. The stock shows strong momentum with institutional buying.

**Confidence Score:** 68%

*Disclaimer: Educational analysis only.*`;
    }

    return `## Stock Analysis Request Received

I've noted your query: "${query}"

### What I Can Analyze:
1. **Technical Indicators** - RSI, MACD, Moving Averages, Support/Resistance
2. **Fundamental Metrics** - P/E, EPS, Revenue, ROE/ROCE
3. **Historical Performance** - 5-10 year trends, CAGR
4. **Comparative Analysis** - Multi-stock comparison

### To get detailed analysis:
Please specify the stock symbol (e.g., TCS, RELIANCE, INFY) and the type of analysis you need.

**Example:** "Analyze TCS technical indicators for last 3 years"

*All insights are educational and based on historical data only.*`;
  };

  return (
    <div className="flex flex-col h-[600px] glass-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-card/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">FinSight AI Analyst</h3>
            <p className="text-xs text-muted-foreground">NSE/BSE Stock Analysis Only</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
          >
            {message.role === "assistant" && (
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-4 rounded-xl ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/50"
              }`}
            >
              <div className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                {message.content.split('\n').map((line, i) => {
                  // Handle headers
                  if (line.startsWith('## ')) {
                    return <h3 key={i} className="text-base font-semibold mt-2 mb-1">{line.replace('## ', '')}</h3>;
                  }
                  if (line.startsWith('### ')) {
                    return <h4 key={i} className="text-sm font-semibold mt-2 mb-1 text-primary">{line.replace('### ', '')}</h4>;
                  }
                  // Handle bold text
                  if (line.includes('**')) {
                    const parts = line.split(/\*\*(.*?)\*\*/g);
                    return (
                      <p key={i} className="mb-1">
                        {parts.map((part, j) => 
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                        )}
                      </p>
                    );
                  }
                  // Handle list items
                  if (line.startsWith('• ') || line.startsWith('- ')) {
                    return <li key={i} className="ml-4 text-sm">{line.replace(/^[•-] /, '')}</li>;
                  }
                  // Handle tables (simplified)
                  if (line.startsWith('|')) {
                    return null; // Skip table rendering for simplicity
                  }
                  return line ? <p key={i} className="mb-1">{line}</p> : <br key={i} />;
                })}
              </div>
              <span className="text-xs opacity-50 mt-2 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {message.role === "user" && (
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-card border border-border/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing stock data...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-2 border-t border-border/30 bg-warning/5">
        <div className="flex items-center gap-2 text-xs text-warning">
          <AlertCircle className="h-3 w-3" />
          <span>Educational analysis only. Not investment advice.</span>
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/50 bg-card/30">
        <div className="flex gap-2">
          <Input
            variant="chat"
            placeholder="Ask about any NSE/BSE stock..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="h-11"
          />
          <Button type="submit" variant="hero" disabled={isLoading || !input.trim()} className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AnalysisChat;
