import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-semibold">
              Fin<span className="text-primary">Sight</span> AI
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/chat" className="hover:text-foreground transition-colors">
              Analysis
            </Link>
            <Link to="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <span>© {new Date().getFullYear()} FinSight AI. Educational Use Only.</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
