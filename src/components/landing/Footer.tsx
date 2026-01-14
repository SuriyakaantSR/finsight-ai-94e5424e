import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-semibold">
              Fin<span className="text-primary">Sight</span> AI
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/analysis" className="hover:text-foreground transition-colors">
              Analysis
            </Link>
            <span>© 2024 FinSight AI. Educational Use Only.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
