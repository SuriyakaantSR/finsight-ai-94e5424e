import { useState } from "react";
import {
  Plus, MessageSquare, Trash2, X, Clock, BarChart3, Activity, LineChart,
  Brain, FlaskConical, Target, Star, StarOff, Bell, BellPlus, Zap, ChevronDown, ChevronRight,
  Briefcase, PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Conversation } from "@/types/chat";
import { cn } from "@/lib/utils";
import { WatchlistItem } from "@/hooks/useWatchlist";
import { IndicatorAlert } from "@/hooks/useAlerts";
import { PortfolioHolding } from "@/hooks/usePortfolio";
import SectorHeatmap from "@/components/charts/SectorHeatmap";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onClearConversation: () => void;
  watchlistItems?: WatchlistItem[];
  onAnalyzeStock?: (symbol: string) => void;
  onRemoveFromWatchlist?: (id: string) => void;
  alerts?: IndicatorAlert[];
  onDeleteAlert?: (id: string) => void;
  onToggleAlert?: (id: string, isActive: boolean) => void;
  portfolioHoldings?: PortfolioHolding[];
  totalInvested?: number;
  onOpenPortfolioDialog?: () => void;
}

const NAV_SECTIONS = [
  { icon: BarChart3, label: "Dashboard", description: "Start new analysis" },
  { icon: Activity, label: "Indicators", description: "RSI, MACD, BB, ADX" },
  { icon: LineChart, label: "Charts", description: "Candlestick & overlays" },
  { icon: Target, label: "Risk/Reward", description: "Risk analysis tools" },
  { icon: Brain, label: "AI Insights", description: "ML-powered signals" },
  { icon: FlaskConical, label: "Backtesting", description: "Strategy testing" },
];

const signalColor = (signal: string | null) => {
  if (signal === "bullish") return "text-[hsl(var(--chart-up))]";
  if (signal === "bearish") return "text-[hsl(var(--chart-down))]";
  return "text-muted-foreground";
};

const ChatSidebar = ({
  isOpen, onClose, conversations, currentConversationId,
  onNewConversation, onSelectConversation, onClearConversation,
  watchlistItems = [], onAnalyzeStock, onRemoveFromWatchlist,
  alerts = [], onDeleteAlert, onToggleAlert,
  portfolioHoldings = [], totalInvested = 0, onOpenPortfolioDialog,
}: ChatSidebarProps) => {
  const [watchlistOpen, setWatchlistOpen] = useState(true);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [heatmapOpen, setHeatmapOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden transition-opacity duration-300" onClick={onClose} />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card border-r border-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold tracking-wide">FinSight AI</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* New Analysis */}
        <div className="p-3">
          <Button variant="outline" className="w-full justify-start gap-2 bg-primary/5 hover:bg-primary/10 transition-colors h-10 rounded-xl border-primary/20" onClick={onNewConversation}>
            <Plus className="h-4 w-4 text-primary" />
            New Analysis
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Navigation */}
          <div className="px-3 pb-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-2 mb-2 font-medium">Tools</p>
            <div className="space-y-0.5">
              {NAV_SECTIONS.map((item) => (
                <button key={item.label} onClick={onNewConversation} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150 text-muted-foreground hover:bg-accent hover:text-foreground group">
                  <item.icon className="h-3.5 w-3.5 shrink-0 group-hover:text-primary transition-colors" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium leading-none">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-none">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Watchlist */}
          <div className="px-3 py-2 border-t border-border/50">
            <button onClick={() => setWatchlistOpen(!watchlistOpen)} className="flex items-center justify-between w-full px-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Star className="h-3 w-3 text-amber-500" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">Watchlist ({watchlistItems.length})</p>
              </div>
              {watchlistOpen ? <ChevronDown className="h-3 w-3 text-muted-foreground/40" /> : <ChevronRight className="h-3 w-3 text-muted-foreground/40" />}
            </button>
            {watchlistOpen && (
              <>
                {watchlistItems.length === 0 ? (
                  <div className="flex flex-col items-center py-4 text-center">
                    <StarOff className="h-5 w-5 text-muted-foreground/20 mb-1" />
                    <p className="text-[10px] text-muted-foreground/40">No stocks saved yet</p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {watchlistItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg px-2.5 py-1.5 hover:bg-accent group">
                        <button onClick={() => onAnalyzeStock?.(item.symbol)} className="flex items-center gap-2 min-w-0 flex-1 text-left">
                          <Zap className={cn("h-3 w-3 shrink-0", signalColor(item.last_signal))} />
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold leading-none">{item.symbol}</p>
                            {item.last_signal && (
                              <p className={cn("text-[9px] mt-0.5 capitalize leading-none", signalColor(item.last_signal))}>
                                {item.last_signal} {item.last_confidence ? `· ${item.last_confidence}%` : ""}
                              </p>
                            )}
                          </div>
                        </button>
                        <button onClick={() => onRemoveFromWatchlist?.(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Portfolio */}
          <div className="px-3 py-2 border-t border-border/50">
            <button onClick={() => setPortfolioOpen(!portfolioOpen)} className="flex items-center justify-between w-full px-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-3 w-3 text-primary" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">Portfolio ({portfolioHoldings.length})</p>
              </div>
              {portfolioOpen ? <ChevronDown className="h-3 w-3 text-muted-foreground/40" /> : <ChevronRight className="h-3 w-3 text-muted-foreground/40" />}
            </button>
            {portfolioOpen && (
              <>
                {onOpenPortfolioDialog && (
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-1.5 h-7 text-xs mb-1 text-primary" onClick={onOpenPortfolioDialog}>
                    <PlusCircle className="h-3 w-3" /> Log Trade
                  </Button>
                )}
                {portfolioHoldings.length === 0 ? (
                  <div className="flex flex-col items-center py-4 text-center">
                    <Briefcase className="h-5 w-5 text-muted-foreground/20 mb-1" />
                    <p className="text-[10px] text-muted-foreground/40">No holdings yet</p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {portfolioHoldings.map((h) => (
                      <button key={h.symbol} onClick={() => onAnalyzeStock?.(h.symbol)} className="flex items-center justify-between w-full rounded-lg px-2.5 py-1.5 hover:bg-accent text-left">
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold leading-none">{h.symbol}</p>
                          <p className="text-[9px] text-muted-foreground/60 mt-0.5">{h.quantity} shares · Avg ₹{h.avgBuyPrice.toFixed(0)}</p>
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground">₹{(h.avgBuyPrice * h.quantity).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                      </button>
                    ))}
                    {totalInvested > 0 && (
                      <div className="px-2.5 pt-1 border-t border-border/30 mt-1">
                        <p className="text-[10px] text-muted-foreground">Total: <span className="font-semibold text-foreground">₹{totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span></p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Alerts */}
          <div className="px-3 py-2 border-t border-border/50">
            <button onClick={() => setAlertsOpen(!alertsOpen)} className="flex items-center justify-between w-full px-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Bell className="h-3 w-3 text-primary" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">Alerts ({alerts.filter(a => a.is_active).length})</p>
              </div>
              {alertsOpen ? <ChevronDown className="h-3 w-3 text-muted-foreground/40" /> : <ChevronRight className="h-3 w-3 text-muted-foreground/40" />}
            </button>
            {alertsOpen && (
              <>
                {alerts.length === 0 ? (
                  <div className="flex flex-col items-center py-4 text-center">
                    <BellPlus className="h-5 w-5 text-muted-foreground/20 mb-1" />
                    <p className="text-[10px] text-muted-foreground/40">No alerts set</p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={cn("flex items-center justify-between rounded-lg px-2.5 py-1.5 group", alert.is_active ? "hover:bg-accent" : "opacity-40")}>
                        <button onClick={() => onToggleAlert?.(alert.id, alert.is_active)} className="flex items-center gap-2 min-w-0 flex-1 text-left">
                          <Bell className={cn("h-3 w-3 shrink-0", alert.is_active ? "text-primary" : "text-muted-foreground")} />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium leading-none">{alert.symbol} · {alert.indicator}</p>
                            <p className="text-[9px] text-muted-foreground/60 mt-0.5 leading-none">{alert.condition} {alert.threshold}</p>
                          </div>
                        </button>
                        <button onClick={() => onDeleteAlert?.(alert.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sector Heatmap */}
          <div className="px-3 py-2 border-t border-border/50">
            <button onClick={() => setHeatmapOpen(!heatmapOpen)} className="flex items-center justify-between w-full px-2 mb-2">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="h-3 w-3 text-primary" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">Sectors</p>
              </div>
              {heatmapOpen ? <ChevronDown className="h-3 w-3 text-muted-foreground/40" /> : <ChevronRight className="h-3 w-3 text-muted-foreground/40" />}
            </button>
            {heatmapOpen && <SectorHeatmap />}
          </div>

          {/* Conversations */}
          <div className="px-3 py-1 border-t border-border/50">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-2 mb-2 mt-2 font-medium">Recent</p>
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-6 w-6 text-muted-foreground/20 mb-2" />
                <p className="text-[11px] text-muted-foreground/40">No recent analyses</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {conversations.slice(0, 8).map((conv) => (
                  <button key={conv.id} onClick={() => onSelectConversation(conv.id)} className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-all duration-150",
                    currentConversationId === conv.id ? "bg-accent font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}>
                    <MessageSquare className="h-3 w-3 shrink-0 opacity-40" />
                    <span className="truncate text-[12px]">{conv.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive rounded-xl h-9 text-xs" onClick={onClearConversation}>
            <Trash2 className="h-3.5 w-3.5" />
            Clear Conversation
          </Button>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
