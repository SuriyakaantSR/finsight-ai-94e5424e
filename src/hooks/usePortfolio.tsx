import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface PortfolioTrade {
  id: string;
  symbol: string;
  trade_type: "buy" | "sell";
  quantity: number;
  price: number;
  trade_date: string;
  notes: string | null;
  created_at: string;
}

export interface PortfolioHolding {
  symbol: string;
  quantity: number;
  avgBuyPrice: number;
  totalInvested: number;
  trades: PortfolioTrade[];
}

export const usePortfolio = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trades, setTrades] = useState<PortfolioTrade[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrades = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio_trades")
      .select("*")
      .eq("user_id", user.id)
      .order("trade_date", { ascending: false });

    if (!error && data) {
      setTrades(data as PortfolioTrade[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const addTrade = async (trade: {
    symbol: string;
    trade_type: "buy" | "sell";
    quantity: number;
    price: number;
    trade_date: string;
    notes?: string;
  }) => {
    if (!user) return;
    const { error } = await supabase.from("portfolio_trades").insert({
      user_id: user.id,
      symbol: trade.symbol.toUpperCase().trim(),
      trade_type: trade.trade_type,
      quantity: trade.quantity,
      price: trade.price,
      trade_date: trade.trade_date,
      notes: trade.notes || null,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to add trade", variant: "destructive" });
      return;
    }
    toast({ title: "Trade Logged", description: `${trade.trade_type.toUpperCase()} ${trade.quantity} ${trade.symbol}` });
    fetchTrades();
  };

  const deleteTrade = async (id: string) => {
    if (!user) return;
    await supabase.from("portfolio_trades").delete().eq("id", id);
    toast({ title: "Trade Deleted" });
    fetchTrades();
  };

  const holdings: PortfolioHolding[] = (() => {
    const map = new Map<string, { buys: PortfolioTrade[]; sells: PortfolioTrade[] }>();
    trades.forEach((t) => {
      if (!map.has(t.symbol)) map.set(t.symbol, { buys: [], sells: [] });
      const entry = map.get(t.symbol)!;
      if (t.trade_type === "buy") entry.buys.push(t);
      else entry.sells.push(t);
    });

    return Array.from(map.entries()).map(([symbol, { buys, sells }]) => {
      const totalBuyQty = buys.reduce((s, t) => s + t.quantity, 0);
      const totalSellQty = sells.reduce((s, t) => s + t.quantity, 0);
      const totalInvested = buys.reduce((s, t) => s + t.quantity * t.price, 0);
      const avgBuyPrice = totalBuyQty > 0 ? totalInvested / totalBuyQty : 0;
      return {
        symbol,
        quantity: totalBuyQty - totalSellQty,
        avgBuyPrice,
        totalInvested,
        trades: [...buys, ...sells].sort((a, b) => new Date(b.trade_date).getTime() - new Date(a.trade_date).getTime()),
      };
    }).filter((h) => h.quantity > 0);
  })();

  const totalInvested = holdings.reduce((s, h) => s + h.avgBuyPrice * h.quantity, 0);

  return { trades, holdings, totalInvested, loading, addTrade, deleteTrade, fetchTrades };
};
