import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const SUGGESTED_QUERIES = [
  "Analyze TCS fundamentals",
  "Technical analysis for RELIANCE",
  "Compare INFY vs WIPRO",
  "HDFC Bank 5-year trend",
];

const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (query: string) => {
    if (!isLoading) {
      onSend(query);
    }
  };

  return (
    <div className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Suggested Queries (shown only when input is empty) */}
      {!input && (
        <div className="mx-auto max-w-3xl px-4 pt-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((query) => (
              <button
                key={query}
                onClick={() => handleSuggestionClick(query)}
                disabled={isLoading}
                className="rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-card hover:text-foreground disabled:opacity-50"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4 py-3">
        <div className="relative flex items-end gap-2 rounded-2xl border border-border/50 bg-card p-2 shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Indian stocks or investment concepts..."
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            style={{ minHeight: "24px", maxHeight: "150px" }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-8 w-8 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Disclaimer */}
      <div className="mx-auto max-w-3xl px-4 pb-3">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <AlertCircle className="h-3 w-3" />
          <span>Educational analysis only. Based on historical data. Not investment advice.</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
