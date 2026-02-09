import { Plus, MessageSquare, Trash2, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Conversation } from "./ChatLayout";
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
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <span className="text-sm font-semibold text-sidebar-foreground tracking-wide">History</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* New Analysis Button */}
        <div className="p-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-sidebar-border bg-sidebar-accent/30 text-sidebar-foreground hover:bg-sidebar-accent transition-colors h-10 rounded-xl"
            onClick={onNewConversation}
          >
            <Plus className="h-4 w-4" />
            New Analysis
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3 py-1">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-xs text-muted-foreground/60">
                No recent analyses yet
              </p>
              <p className="text-[11px] text-muted-foreground/40 mt-1">
                Start a new analysis to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {conversations.slice(0, 5).map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-150",
                    currentConversationId === conv.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-50" />
                  <span className="truncate text-[13px]">{conv.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive rounded-xl h-9"
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
