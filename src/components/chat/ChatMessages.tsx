import { useRef, useEffect, useState } from "react";
import { Bot, User, Copy, Download, Check, Star, StarOff, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import AnalysisCharts from "@/components/charts/AnalysisCharts";
import StockComparisonCard from "@/components/charts/StockComparisonCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";
import AlertDialog from "@/components/chat/AlertDialog";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onAddToWatchlist?: (symbol: string, signal?: string | null, confidence?: number | null) => void;
  isInWatchlist?: (symbol: string) => boolean;
  onCreateAlert?: (symbol: string, indicator: string, condition: string, threshold: number) => void;
}

const ChatMessages = ({ messages, isLoading, onAddToWatchlist, isInWatchlist, onCreateAlert }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertSymbol, setAlertSymbol] = useState("");
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
      toast({ title: "Copy Failed", description: "Could not copy to clipboard", variant: "destructive" });
    }
  };

  const handleDownloadPDF = (message: Message) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(16, 185, 129);
    pdf.text("FinSight AI", margin, 20);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(128, 128, 128);
    pdf.text("AI-Powered Stock Market Analysis Report", margin, 27);

    pdf.setDrawColor(16, 185, 129);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 30, pageWidth - margin, 30);

    pdf.setFontSize(9);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, 36);
    if (message.stockSymbol) pdf.text(`Stock: ${message.stockSymbol}`, margin + 80, 36);
    pdf.setFontSize(8);
    pdf.setTextColor(200, 100, 100);
    pdf.text("DISCLAIMER: Educational analysis only. Not investment advice.", margin, 42);
    pdf.setTextColor(0, 0, 0);

    let yPosition = 52;
    const lineHeight = 6;

    if (message.confidenceScore || message.signal) {
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Analysis Summary", margin, yPosition);
      yPosition += 8;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      if (message.confidenceScore) { pdf.text(`Confidence Score: ${message.confidenceScore}%`, margin, yPosition); yPosition += lineHeight; }
      if (message.signal) { pdf.text(`Signal: ${message.signal.toUpperCase()}`, margin, yPosition); yPosition += lineHeight; }
      yPosition += 4;
    }

    if (message.riskRewardData) {
      const rr = message.riskRewardData;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Risk/Reward Analysis", margin, yPosition);
      yPosition += 8;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      if (rr.riskRewardRatio) { pdf.text(`Risk:Reward Ratio = 1:${rr.riskRewardRatio.toFixed(1)}`, margin, yPosition); yPosition += lineHeight; }
      if (rr.currentPrice) { pdf.text(`Entry Price: ₹${rr.currentPrice.toLocaleString("en-IN")}`, margin, yPosition); yPosition += lineHeight; }
      if (rr.stopLoss) { pdf.text(`Stop Loss: ₹${rr.stopLoss.toLocaleString("en-IN")} (-${rr.riskPercent?.toFixed(1)}%)`, margin, yPosition); yPosition += lineHeight; }
      if (rr.targetPrice) { pdf.text(`Target: ₹${rr.targetPrice.toLocaleString("en-IN")} (+${rr.rewardPercent?.toFixed(1)}%)`, margin, yPosition); yPosition += lineHeight; }
      yPosition += 4;
    }

    if (message.fundamentalMetrics) {
      const fm = message.fundamentalMetrics;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Fundamental Metrics", margin, yPosition);
      yPosition += 8;
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      const metrics: Array<[string, any, string?]> = [
        ["P/E Ratio", fm.pe_ratio], ["EPS", fm.eps], ["ROE", fm.roe, "%"], ["ROCE", fm.roce, "%"],
        ["D/E Ratio", fm.debt_to_equity], ["Revenue Growth", fm.revenue_growth, "%"],
        ["Profit Margin", fm.profit_margin, "%"], ["Dividend Yield", fm.dividend_yield, "%"],
        ["Market Cap", fm.market_cap], ["Book Value", fm.book_value],
      ];
      metrics.forEach(([label, val, suffix]) => {
        if (val !== undefined && val !== null) {
          if (yPosition > pdf.internal.pageSize.getHeight() - 20) { pdf.addPage(); yPosition = 20; }
          const displayVal = typeof val === "number" ? val.toFixed(2) : val;
          pdf.text(`${label}: ${displayVal}${suffix || ""}`, margin, yPosition);
          yPosition += lineHeight;
        }
      });
      yPosition += 4;
    }

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Detailed Analysis", margin, yPosition);
    yPosition += 8;

    message.content.split("\n").forEach((line) => {
      if (yPosition > pdf.internal.pageSize.getHeight() - 20) { pdf.addPage(); yPosition = 20; }
      if (line.startsWith("### ")) {
        pdf.setFontSize(11); pdf.setFont("helvetica", "bold");
        pdf.text(line.replace("### ", ""), margin, yPosition); yPosition += lineHeight + 2;
      } else if (line.startsWith("## ")) {
        pdf.setFontSize(13); pdf.setFont("helvetica", "bold");
        pdf.text(line.replace("## ", ""), margin, yPosition); yPosition += lineHeight + 3;
      } else if (line.startsWith("- ") || line.startsWith("• ")) {
        pdf.setFontSize(9); pdf.setFont("helvetica", "normal");
        const text = "• " + line.replace(/^[-•] /, "");
        pdf.splitTextToSize(text, maxWidth - 10).forEach((tl: string) => {
          if (yPosition > pdf.internal.pageSize.getHeight() - 20) { pdf.addPage(); yPosition = 20; }
          pdf.text(tl, margin + 5, yPosition); yPosition += lineHeight;
        });
      } else if (line.trim() === "") {
        yPosition += lineHeight / 2;
      } else {
        pdf.setFontSize(9); pdf.setFont("helvetica", "normal");
        const cleaned = line.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
        pdf.splitTextToSize(cleaned, maxWidth).forEach((tl: string) => {
          if (yPosition > pdf.internal.pageSize.getHeight() - 20) { pdf.addPage(); yPosition = 20; }
          pdf.text(tl, margin, yPosition); yPosition += lineHeight;
        });
      }
    });

    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(7); pdf.setTextColor(128, 128, 128);
      pdf.text(`Page ${i} of ${pageCount} | FinSight AI - Educational Analysis Only | ${new Date().toLocaleDateString()}`, pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: "center" });
    }

    const filename = message.stockSymbol ? `FinSight-${message.stockSymbol}-Analysis.pdf` : `FinSight-Analysis-${message.id}.pdf`;
    pdf.save(filename);
    toast({ title: "PDF Report Downloaded", description: "Full analysis report exported successfully" });
  };

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-8">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 sm:gap-4 animate-fade-in ${message.role === "user" ? "flex-row-reverse" : ""}`}
              style={{ animationDelay: index === messages.length - 1 ? "0.05s" : "0s" }}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${
                message.role === "assistant" ? "bg-primary/10 ring-1 ring-primary/20" : "bg-secondary ring-1 ring-border/50"
              }`}>
                {message.role === "assistant" ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-muted-foreground" />}
              </div>

              <div className={`flex flex-col min-w-0 max-w-[92%] sm:max-w-[88%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`rounded-2xl px-4 py-3 shadow-sm transition-colors ${
                  message.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border/50 rounded-bl-md"
                }`}>
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-em:text-muted-foreground prose-li:text-foreground/90 prose-table:text-foreground/90 prose-th:text-foreground prose-td:text-foreground/80 prose-th:border-border prose-td:border-border/50 prose-hr:border-border/30">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                </div>

                {/* Charts Panel */}
                {message.role === "assistant" && message.chartData && (
                  <div className="w-full mt-3">
                    <AnalysisCharts
                      chartData={message.chartData}
                      fundamentalMetrics={message.fundamentalMetrics}
                      stockSymbol={message.stockSymbol}
                      confidenceScore={message.confidenceScore}
                      signal={message.signal}
                      riskRewardData={message.riskRewardData}
                    />
                  </div>
                )}

                {/* Comparison Panel */}
                {message.role === "assistant" && message.comparisonData && (
                  <div className="w-full mt-3">
                    <StockComparisonCard comparisonData={message.comparisonData} />
                  </div>
                )}

                {/* Message Controls */}
                {message.role === "assistant" && message.id !== "welcome" && (
                  <div
                    className="mt-1.5 flex items-center gap-0.5 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200"
                    style={{ opacity: copiedId === message.id ? 1 : undefined }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => { if (copiedId !== message.id) e.currentTarget.style.opacity = "0"; }}
                  >
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg" onClick={() => handleCopy(message.content, message.id)} title="Copy text">
                      {copiedId === message.id ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg" onClick={() => handleDownloadPDF(message)} title="Export full analysis as PDF">
                      <Download className="h-3.5 w-3.5" />
                    </Button>

                    {/* Watchlist button */}
                    {message.stockSymbol && onAddToWatchlist && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-yellow-500 rounded-lg"
                        onClick={() => onAddToWatchlist(message.stockSymbol!, message.signal, message.confidenceScore)}
                        title={isInWatchlist?.(message.stockSymbol) ? "Update in watchlist" : "Add to watchlist"}
                      >
                        {isInWatchlist?.(message.stockSymbol) ? (
                          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}

                    {/* Alert button */}
                    {message.stockSymbol && onCreateAlert && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary rounded-lg"
                        onClick={() => { setAlertSymbol(message.stockSymbol!); setAlertDialogOpen(true); }}
                        title="Set indicator alert"
                      >
                        <Bell className="h-3.5 w-3.5" />
                      </Button>
                    )}

                    <span className="ml-2 text-[11px] text-muted-foreground/70 tabular-nums">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

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

      {/* Alert Dialog */}
      {onCreateAlert && (
        <AlertDialog
          open={alertDialogOpen}
          onOpenChange={setAlertDialogOpen}
          symbol={alertSymbol}
          onCreateAlert={onCreateAlert}
        />
      )}
    </div>
  );
};

export default ChatMessages;
