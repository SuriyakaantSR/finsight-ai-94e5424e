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
    <div className="border-t border-border/30 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80">
      {/* Suggested Queries */}
      {!input && (
        <div className="mx-auto max-w-3xl px-4 pt-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((query) => (
              <button
                key={query}
                onClick={() => handleSuggestionClick(query)}
                disabled={isLoading}
                className="rounded-full border border-border/40 bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-all duration-150 hover:bg-card hover:text-foreground hover:border-primary/30 hover:shadow-sm disabled:opacity-50 active:scale-95"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4 py-3">
        <div className="relative flex items-end gap-2 rounded-2xl border border-border/40 bg-card/80 p-2 shadow-md transition-all duration-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 focus-within:shadow-lg">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Indian stocks or investment concepts..."
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
            style={{ minHeight: "28px", maxHeight: "150px" }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-9 w-9 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 transition-all duration-150 active:scale-95"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Disclaimer */}
      <div className="mx-auto max-w-3xl px-4 pb-3">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/50">
          <AlertCircle className="h-3 w-3" />
          <span>Educational analysis only · Based on historical data · Not investment advice</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
