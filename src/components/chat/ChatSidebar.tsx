import { Plus, MessageSquare, Trash2, X, Clock, BarChart3, Activity, LineChart, Brain, FlaskConical, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Conversation } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onClearConversation: () => void;
}

const NAV_SECTIONS = [
  { icon: BarChart3, label: "Dashboard", description: "Start new analysis" },
  { icon: Activity, label: "Indicators", description: "RSI, MACD, BB, ADX" },
  { icon: LineChart, label: "Charts", description: "Candlestick & overlays" },
  { icon: Target, label: "Risk/Reward", description: "Risk analysis tools" },
  { icon: Brain, label: "AI Insights", description: "ML-powered signals" },
  { icon: FlaskConical, label: "Backtesting", description: "Strategy testing" },
];

const ChatSidebar = ({
  isOpen,
  onClose,
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onClearConversation,
}: ChatSidebarProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold text-sidebar-foreground tracking-wide">FinSight AI</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* New Analysis */}
        <div className="p-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-sidebar-border bg-primary/10 text-sidebar-foreground hover:bg-primary/20 transition-colors h-10 rounded-xl border-primary/20"
            onClick={onNewConversation}
          >
            <Plus className="h-4 w-4 text-primary" />
            New Analysis
          </Button>
        </div>

        {/* Navigation */}
        <div className="px-3 pb-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-2 mb-2 font-medium">Tools</p>
          <div className="space-y-0.5">
            {NAV_SECTIONS.map((item) => (
              <button
                key={item.label}
                onClick={onNewConversation}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground group"
              >
                <item.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="min-w-0">
                  <p className="text-[12px] font-medium leading-none">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-none">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-3 py-1 border-t border-sidebar-border/50">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-2 mb-2 mt-2 font-medium">Recent</p>
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="h-6 w-6 text-muted-foreground/20 mb-2" />
              <p className="text-[11px] text-muted-foreground/40">No recent analyses</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {conversations.slice(0, 8).map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-all duration-150",
                    currentConversationId === conv.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <MessageSquare className="h-3 w-3 shrink-0 opacity-40" />
                  <span className="truncate text-[12px]">{conv.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive rounded-xl h-9 text-xs"
            onClick={onClearConversation}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Conversation
          </Button>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
