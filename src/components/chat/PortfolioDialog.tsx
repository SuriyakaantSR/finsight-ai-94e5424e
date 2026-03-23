import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTrade: (trade: {
    symbol: string;
    trade_type: "buy" | "sell";
    quantity: number;
    price: number;
    trade_date: string;
    notes?: string;
  }) => void;
}

const PortfolioDialog = ({ open, onOpenChange, onAddTrade }: PortfolioDialogProps) => {
  const [symbol, setSymbol] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [tradeDate, setTradeDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !quantity || !price) return;
    onAddTrade({
      symbol,
      trade_type: tradeType,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      trade_date: tradeDate,
      notes: notes || undefined,
    });
    setSymbol("");
    setQuantity("");
    setPrice("");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>Log Trade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Symbol</Label>
              <Input placeholder="TCS" value={symbol} onChange={(e) => setSymbol(e.target.value)} required className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <Select value={tradeType} onValueChange={(v) => setTradeType(v as "buy" | "sell")}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Quantity</Label>
              <Input type="number" min="0.01" step="0.01" placeholder="10" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Price (₹)</Label>
              <Input type="number" min="0.01" step="0.01" placeholder="3500" value={price} onChange={(e) => setPrice(e.target.value)} required className="h-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Date</Label>
            <Input type="date" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)} className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Notes (optional)</Label>
            <Input placeholder="Swing trade entry" value={notes} onChange={(e) => setNotes(e.target.value)} className="h-9" />
          </div>
          <Button type="submit" className="w-full">
            Log {tradeType === "buy" ? "Buy" : "Sell"} Trade
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioDialog;
