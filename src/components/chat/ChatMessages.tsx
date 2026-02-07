import { useRef, useEffect } from "react";
import { Bot, User, Loader2, Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "./ChatLayout";
import { useState } from "react";
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
    
    // Add header
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("FinSight AI - Stock Analysis", margin, 20);
    
    // Add timestamp
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, 28);
    
    // Add disclaimer
    pdf.setFontSize(8);
    pdf.text("Educational analysis only. Not investment advice.", margin, 34);
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);
    
    // Process content
    let yPosition = 45;
    const lineHeight = 6;
    
    const lines = content.split("\n");
    
    lines.forEach((line) => {
      // Check if we need a new page
      if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Headers
      if (line.startsWith("### ")) {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        const text = line.replace("### ", "");
        pdf.text(text, margin, yPosition);
        yPosition += lineHeight + 2;
      } else if (line.startsWith("## ")) {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        const text = line.replace("## ", "");
        pdf.text(text, margin, yPosition);
        yPosition += lineHeight + 3;
      } else if (line.startsWith("- ") || line.startsWith("• ")) {
        // List items
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
        // Regular text - handle bold markers
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
    
    // Add footer
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

  const renderMarkdown = (content: string) => {
    return content.split("\n").map((line, i) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h4 key={i} className="mt-4 mb-2 text-sm font-semibold text-primary">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={i} className="mt-4 mb-2 text-base font-semibold">
            {line.replace("## ", "")}
          </h3>
        );
      }

      // Bold text
      if (line.includes("**")) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="mb-1.5 leading-relaxed">
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-semibold">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      // Italic text
      if (line.includes("*") && !line.includes("**")) {
        const parts = line.split(/\*(.*?)\*/g);
        return (
          <p key={i} className="mb-1.5 text-muted-foreground text-sm italic leading-relaxed">
            {parts.map((part, j) => (j % 2 === 1 ? <em key={j}>{part}</em> : part))}
          </p>
        );
      }

      // List items
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return (
          <li key={i} className="ml-4 mb-1 text-sm leading-relaxed list-disc">
            {line.replace(/^[-•] /, "")}
          </li>
        );
      }

      // Empty lines
      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }

      // Regular paragraphs
      return (
        <p key={i} className="mb-1.5 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  message.role === "assistant"
                    ? "bg-primary/10"
                    : "bg-secondary"
                }`}
              >
                {message.role === "assistant" ? (
                  <Bot className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex flex-col max-w-[85%] ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border/50"
                  }`}
                >
                  <div className="text-sm">{renderMarkdown(message.content)}</div>
                </div>

                {/* Message Controls (Assistant only) */}
                {message.role === "assistant" && message.id !== "welcome" && (
                  <div className="mt-1 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => handleCopy(message.content, message.id)}
                    >
                      {copiedId === message.id ? (
                        <Check className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => handleDownloadPDF(message.content, message.id)}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <span className="ml-2 text-xs text-muted-foreground">
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
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="rounded-2xl bg-card border border-border/50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing stock data...</span>
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
