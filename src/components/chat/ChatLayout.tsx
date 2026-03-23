import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import PortfolioDialog from "./PortfolioDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message, Conversation } from "@/types/chat";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAlerts } from "@/hooks/useAlerts";
import { usePortfolio } from "@/hooks/usePortfolio";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `Welcome to **FinSight AI** — your intelligent stock market analysis assistant.

I specialize exclusively in **Indian Stock Market (NSE/BSE)** analysis, providing educational insights based on historical data.

### What I Can Analyze

- **Technical Analysis**: RSI, MACD, SMA, EMA, Bollinger Bands, ATR, ADX, VWAP — with interactive charts
- **Fundamental Analysis**: P/E Ratio, EPS, Revenue Growth, ROE/ROCE, Debt Ratios
- **Risk/Reward Analysis**: Stop loss, target price, risk-reward ratios with visual graphs
- **Comparative Studies**: Side-by-side peer comparison with normalized price charts
- **Backtesting**: RSI-based strategy testing with equity curves
- **PDF Reports**: Export full analysis reports with one click
- **CSV Export**: Download raw chart data for your own analysis

### Try These Now 👇

Click any suggestion below to see FinSight AI in action — charts, signals, and insights will appear instantly.

*All insights are educational and based on historical data. Not investment advice.*`,
  timestamp: new Date(),
};

const ChatLayout = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);

  const { items: watchlistItems, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { alerts, createAlert, deleteAlert, toggleAlert, checkAlerts } = useAlerts();
  const { holdings: portfolioHoldings, totalInvested, addTrade } = usePortfolio();

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) loadConversations();
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setConversations(data.map((c) => ({ id: c.id, title: c.title, updatedAt: new Date(c.updated_at) })));
    }
  };

  const loadConversation = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      const loadedMessages: Message[] = data.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        timestamp: new Date(m.created_at),
      }));
      setMessages([WELCOME_MESSAGE, ...loadedMessages]);
      setCurrentConversationId(conversationId);
    }
    setIsSidebarOpen(false);
  };

  const startNewConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setCurrentConversationId(null);
    setIsSidebarOpen(false);
  };

  const clearConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setCurrentConversationId(null);
  };

  const handleAnalyzeFromWatchlist = (symbol: string) => {
    handleSendMessage(`Analyze ${symbol} with all technical indicators and risk/reward`);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let conversationId = currentConversationId;
      if (!conversationId) {
        const { data: newConv, error: convError } = await supabase
          .from("chat_conversations")
          .insert({ user_id: user.id, title: content.trim().substring(0, 50) + (content.length > 50 ? "..." : "") })
          .select()
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;
        setCurrentConversationId(conversationId);
      }

      await supabase.from("chat_messages").insert({ conversation_id: conversationId, role: "user", content: content.trim() });

      const conversationHistory = messages.filter((m) => m.id !== "welcome").map((m) => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke("financial-analysis", {
        body: { messages: [...conversationHistory, { role: "user", content: content.trim() }], conversationHistory },
      });

      if (error) throw new Error(error.message);

      const assistantContent = data.content || "I couldn't process your request. Please try again.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
        chartData: data.chartData || null,
        fundamentalMetrics: data.fundamentalMetrics || null,
        stockSymbol: data.stockSymbol || null,
        confidenceScore: data.confidenceScore || null,
        signal: data.signal || null,
        comparisonData: data.comparisonData || null,
        riskRewardData: data.riskRewardData || null,
      };

      if (data.stockSymbol && data.chartData) {
        const latestRsi = data.chartData.rsi?.slice(-1)[0]?.value;
        const latestMacd = data.chartData.macd?.slice(-1)[0]?.macd;
        const latestAdx = data.chartData.adx?.slice(-1)[0]?.value;
        const latestAtr = data.chartData.atr?.slice(-1)[0]?.value;

        const triggered = checkAlerts(data.stockSymbol, { rsi: latestRsi, macd: latestMacd, adx: latestAdx, atr: latestAtr });

        if (triggered.length > 0) {
          const alertText = triggered.map(a => `⚠️ **Alert**: ${a.symbol} ${a.indicator} is ${a.condition} ${a.threshold}`).join("\n");
          assistantMessage.content = `${alertText}\n\n---\n\n${assistantMessage.content}`;
        }
      }

      await supabase.from("chat_messages").insert({ conversation_id: conversationId, role: "assistant", content: assistantContent });
      await supabase.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);

      setMessages((prev) => [...prev, assistantMessage]);
      loadConversations();
    } catch (error) {
      console.error("Analysis error:", error);
      toast({ title: "Analysis Error", description: "Failed to get analysis. Please try again.", variant: "destructive" });
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm experiencing technical difficulties. Please try again in a moment.\n\n*Ensure your question relates to Indian stock market analysis.*",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={startNewConversation}
        onSelectConversation={loadConversation}
        onClearConversation={clearConversation}
        watchlistItems={watchlistItems}
        onAnalyzeStock={handleAnalyzeFromWatchlist}
        onRemoveFromWatchlist={removeFromWatchlist}
        alerts={alerts}
        onDeleteAlert={deleteAlert}
        onToggleAlert={toggleAlert}
        portfolioHoldings={portfolioHoldings}
        totalInvested={totalInvested}
        onOpenPortfolioDialog={() => setPortfolioDialogOpen(true)}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <ChatHeader onMenuClick={() => setIsSidebarOpen(true)} userName={user?.user_metadata?.full_name || user?.email?.split("@")[0]} />
        <ChatMessages messages={messages} isLoading={isLoading} onAddToWatchlist={addToWatchlist} isInWatchlist={isInWatchlist} onCreateAlert={createAlert} />
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>

      <PortfolioDialog open={portfolioDialogOpen} onOpenChange={setPortfolioDialogOpen} onAddTrade={addTrade} />
    </div>
  );
};

export default ChatLayout;
