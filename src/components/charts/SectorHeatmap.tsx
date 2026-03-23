import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectorData {
  name: string;
  change: number;
  marketCap: string;
}

const SECTORS: SectorData[] = [
  { name: "IT", change: 2.3, marketCap: "₹38.2L Cr" },
  { name: "Banking", change: 1.1, marketCap: "₹52.1L Cr" },
  { name: "Pharma", change: -0.8, marketCap: "₹12.4L Cr" },
  { name: "Auto", change: 1.7, marketCap: "₹18.6L Cr" },
  { name: "FMCG", change: -0.3, marketCap: "₹15.8L Cr" },
  { name: "Energy", change: 0.9, marketCap: "₹28.3L Cr" },
  { name: "Metal", change: -1.5, marketCap: "₹8.2L Cr" },
  { name: "Realty", change: 3.1, marketCap: "₹4.7L Cr" },
  { name: "Infra", change: 0.4, marketCap: "₹6.1L Cr" },
  { name: "PSU Bank", change: -0.6, marketCap: "₹9.3L Cr" },
  { name: "Media", change: -2.1, marketCap: "₹1.8L Cr" },
  { name: "Fin Service", change: 1.4, marketCap: "₹22.5L Cr" },
];

const getHeatColor = (change: number): string => {
  if (change >= 2) return "bg-emerald-500/90 text-white";
  if (change >= 1) return "bg-emerald-400/70 text-white";
  if (change >= 0) return "bg-emerald-300/40 text-foreground";
  if (change >= -1) return "bg-red-300/40 text-foreground";
  if (change >= -2) return "bg-red-400/70 text-white";
  return "bg-red-500/90 text-white";
};

const SectorHeatmap = () => {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Sector Performance</h3>
        <span className="text-[10px] text-muted-foreground">NSE Sectoral Indices</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
        {SECTORS.map((sector, i) => (
          <motion.div
            key={sector.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            className={cn(
              "rounded-lg p-2.5 text-center cursor-default transition-transform hover:scale-105",
              getHeatColor(sector.change)
            )}
          >
            <p className="text-[11px] font-semibold leading-none">{sector.name}</p>
            <p className="text-[13px] font-bold mt-1">
              {sector.change > 0 ? "+" : ""}{sector.change.toFixed(1)}%
            </p>
            <p className="text-[9px] opacity-70 mt-0.5">{sector.marketCap}</p>
          </motion.div>
        ))}
      </div>
      <p className="text-[9px] text-muted-foreground/50 text-center mt-2">
        Simulated data for educational purposes
      </p>
    </div>
  );
};

export default SectorHeatmap;
