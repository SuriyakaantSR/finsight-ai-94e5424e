import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface WatchlistItem {
  id: string;
  symbol: string;
  added_at: string;
  last_signal: string | null;
  last_confidence: number | null;
  notes: string | null;
}

export const useWatchlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });

    if (!error && data) {
      setItems(data as WatchlistItem[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const addToWatchlist = async (symbol: string, signal?: string | null, confidence?: number | null) => {
    if (!user) return;
    const normalized = symbol.toUpperCase().trim();
    
    const existing = items.find(i => i.symbol === normalized);
    if (existing) {
      // Update signal/confidence
      await supabase
        .from("watchlist")
        .update({ last_signal: signal || null, last_confidence: confidence || null })
        .eq("id", existing.id);
      toast({ title: "Watchlist Updated", description: `${normalized} signal updated` });
    } else {
      const { error } = await supabase
        .from("watchlist")
        .insert({ user_id: user.id, symbol: normalized, last_signal: signal || null, last_confidence: confidence || null });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already in Watchlist", description: `${normalized} is already saved` });
        } else {
          toast({ title: "Error", description: "Failed to add to watchlist", variant: "destructive" });
        }
        return;
      }
      toast({ title: "Added to Watchlist", description: `${normalized} saved to your watchlist` });
    }
    fetchWatchlist();
  };

  const removeFromWatchlist = async (id: string) => {
    if (!user) return;
    await supabase.from("watchlist").delete().eq("id", id);
    toast({ title: "Removed", description: "Stock removed from watchlist" });
    fetchWatchlist();
  };

  const isInWatchlist = (symbol: string) => {
    return items.some(i => i.symbol === symbol.toUpperCase().trim());
  };

  return { items, loading, addToWatchlist, removeFromWatchlist, isInWatchlist, fetchWatchlist };
};
