import { useRef, useEffect, useState } from "react";
import { Bot, User, Loader2, Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "./ChatLayout";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = (content: string, messageId: string) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("FinSight AI - Stock Analysis", margin, 20);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, 28);

    pdf.setFontSize(8);
    pdf.text("Educational analysis only. Not investment advice.", margin, 34);

    pdf.setTextColor(0, 0, 0);

    let yPosition = 45;
    const lineHeight = 6;
    const lines = content.split("\n");

    lines.forEach((line) => {
      if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      if (line.startsWith("### ")) {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(line.replace("### ", ""), margin, yPosition);
        yPosition += lineHeight + 2;
      } else if (line.startsWith("## ")) {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(line.replace("## ", ""), margin, yPosition);
        yPosition += lineHeight + 3;
      } else if (line.startsWith("- ") || line.startsWith("• ")) {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const text = "• " + line.replace(/^[-•] /, "");
        const splitText = pdf.splitTextToSize(text, maxWidth - 10);
        splitText.forEach((textLine: string) => {
          if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(textLine, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      } else if (line.trim() === "") {
        yPosition += lineHeight / 2;
      } else {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const cleanedLine = line.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
        const splitText = pdf.splitTextToSize(cleanedLine, maxWidth);
        splitText.forEach((textLine: string) => {
          if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(textLine, margin, yPosition);
          yPosition += lineHeight;
        });
      }
    });

    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Page ${i} of ${pageCount} | FinSight AI`,
        pageWidth / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    pdf.save(`finsight-analysis-${messageId}.pdf`);
    toast({
      title: "PDF Downloaded",
      description: "Analysis exported as PDF successfully",
    });
  };

  const renderInlineMarkdown = (text: string) => {
    // Handle bold + italic inline
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={j} className="italic text-muted-foreground">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const renderMarkdown = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={i} className="mt-5 mb-2 text-sm font-semibold text-primary tracking-wide uppercase">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={i} className="mt-5 mb-2 text-base font-bold">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return (
          <li key={i} className="ml-4 mb-1.5 text-sm leading-relaxed list-disc marker:text-primary/60">
            {renderInlineMarkdown(line.replace(/^[-•] /, ""))}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={i} className="h-3" />;
      }
      return (
        <p key={i} className="mb-2 text-sm leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-8">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 sm:gap-4 animate-fade-in ${message.role === "user" ? "flex-row-reverse" : ""}`}
              style={{ animationDelay: index === messages.length - 1 ? "0.05s" : "0s" }}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${
                  message.role === "assistant"
                    ? "bg-primary/10 ring-1 ring-primary/20"
                    : "bg-secondary ring-1 ring-border/50"
                }`}
              >
                {message.role === "assistant" ? (
                  <Bot className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex flex-col min-w-0 max-w-[88%] sm:max-w-[85%] ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm transition-colors ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border/50 rounded-bl-md"
                  }`}
                >
                  <div className="text-sm">{renderMarkdown(message.content)}</div>
                </div>

                {/* Message Controls (Assistant only) */}
                {message.role === "assistant" && message.id !== "welcome" && (
                  <div className="mt-1.5 flex items-center gap-0.5 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ opacity: copiedId === message.id ? 1 : undefined }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                    onMouseLeave={(e) => { if (copiedId !== message.id) e.currentTarget.style.opacity = "0"; }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg"
                      onClick={() => handleCopy(message.content, message.id)}
                      title="Copy text"
                    >
                      {copiedId === message.id ? (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg"
                      onClick={() => handleDownloadPDF(message.content, message.id)}
                      title="Export as PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <span className="ml-2 text-[11px] text-muted-foreground/70 tabular-nums">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 sm:gap-4 animate-fade-in">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <Bot className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="rounded-2xl rounded-bl-md bg-card border border-border/50 px-5 py-3.5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5 items-center">
                    <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.8s" }} />
                    <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "150ms", animationDuration: "0.8s" }} />
                    <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "300ms", animationDuration: "0.8s" }} />
                  </div>
                  <span className="text-sm text-muted-foreground animate-pulse">Analyzing market data...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
