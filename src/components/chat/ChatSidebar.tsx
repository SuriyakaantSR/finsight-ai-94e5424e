import { Plus, MessageSquare, Trash2, X } from "lucide-react";
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
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <span className="text-sm font-medium text-sidebar-foreground">History</span>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-sidebar-foreground"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* New Analysis Button */}
        <div className="p-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onNewConversation}
          >
            <Plus className="h-4 w-4" />
            New Analysis
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="space-y-1">
            {conversations.length === 0 ? (
              <p className="px-3 py-4 text-xs text-muted-foreground text-center">
                No recent analyses
              </p>
            ) : (
              conversations.slice(0, 5).map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    currentConversationId === conv.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 opacity-60" />
                  <span className="truncate">{conv.title}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={onClearConversation}
          >
            <Trash2 className="h-4 w-4" />
            Clear Conversation
          </Button>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
