import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbol: string;
  onCreateAlert: (symbol: string, indicator: string, condition: string, threshold: number) => void;
}

const INDICATORS = [
  { value: "RSI", label: "RSI", defaultThreshold: 70 },
  { value: "MACD", label: "MACD", defaultThreshold: 0 },
  { value: "ADX", label: "ADX", defaultThreshold: 25 },
  { value: "ATR", label: "ATR", defaultThreshold: 50 },
];

const CONDITIONS = [
  { value: "above", label: "Goes Above" },
  { value: "below", label: "Goes Below" },
];

const AlertDialog = ({ open, onOpenChange, symbol, onCreateAlert }: AlertDialogProps) => {
  const [indicator, setIndicator] = useState("RSI");
  const [condition, setCondition] = useState("above");
  const [threshold, setThreshold] = useState("70");

  const handleIndicatorChange = (val: string) => {
    setIndicator(val);
    const ind = INDICATORS.find(i => i.value === val);
    if (ind) setThreshold(String(ind.defaultThreshold));
  };

  const handleSubmit = () => {
    const num = parseFloat(threshold);
    if (isNaN(num)) return;
    onCreateAlert(symbol, indicator, condition, num);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Set Alert for {symbol}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Indicator</Label>
            <Select value={indicator} onValueChange={handleIndicatorChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDICATORS.map(ind => (
                  <SelectItem key={ind.value} value={ind.value}>{ind.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Condition</Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Threshold</Label>
            <Input
              type="number"
              value={threshold}
              onChange={e => setThreshold(e.target.value)}
              placeholder="Enter value..."
            />
            {indicator === "RSI" && (
              <p className="text-[10px] text-muted-foreground">
                Common: 70 (overbought), 30 (oversold)
              </p>
            )}
            {indicator === "ADX" && (
              <p className="text-[10px] text-muted-foreground">
                Common: 25 (strong trend), 20 (weak trend)
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Alert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
