import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface IndicatorAlert {
  id: string;
  symbol: string;
  indicator: string;
  condition: string;
  threshold: number;
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
}

export const INDICATORS = [
  { value: "RSI", label: "RSI" },
  { value: "MACD", label: "MACD" },
  { value: "ADX", label: "ADX" },
  { value: "ATR", label: "ATR" },
];

export const CONDITIONS = [
  { value: "above", label: "Above" },
  { value: "below", label: "Below" },
];

export const useAlerts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<IndicatorAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("indicator_alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAlerts(data as IndicatorAlert[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const createAlert = async (symbol: string, indicator: string, condition: string, threshold: number) => {
    if (!user) return;
    const { error } = await supabase
      .from("indicator_alerts")
      .insert({ user_id: user.id, symbol: symbol.toUpperCase(), indicator, condition, threshold });

    if (error) {
      toast({ title: "Error", description: "Failed to create alert", variant: "destructive" });
      return;
    }
    toast({ title: "Alert Created", description: `${indicator} ${condition} ${threshold} for ${symbol.toUpperCase()}` });
    fetchAlerts();
  };

  const deleteAlert = async (id: string) => {
    if (!user) return;
    await supabase.from("indicator_alerts").delete().eq("id", id);
    toast({ title: "Alert Deleted" });
    fetchAlerts();
  };

  const toggleAlert = async (id: string, isActive: boolean) => {
    if (!user) return;
    await supabase.from("indicator_alerts").update({ is_active: !isActive }).eq("id", id);
    fetchAlerts();
  };

  // Check alerts against latest analysis data
  const checkAlerts = (symbol: string, indicators: { rsi?: number; macd?: number; adx?: number; atr?: number }) => {
    const triggered: IndicatorAlert[] = [];
    const symbolAlerts = alerts.filter(a => a.symbol === symbol.toUpperCase() && a.is_active);
    
    for (const alert of symbolAlerts) {
      const val = indicators[alert.indicator.toLowerCase() as keyof typeof indicators];
      if (val === undefined) continue;
      
      if (alert.condition === "above" && val > alert.threshold) {
        triggered.push(alert);
      } else if (alert.condition === "below" && val < alert.threshold) {
        triggered.push(alert);
      }
    }
    return triggered;
  };

  return { alerts, loading, createAlert, deleteAlert, toggleAlert, checkAlerts, fetchAlerts };
};
