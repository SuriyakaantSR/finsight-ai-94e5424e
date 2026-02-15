import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const DisclaimerSection = () => {
  return (
    <section className="py-16 border-t border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="p-6 rounded-xl bg-warning/5 border border-warning/20">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-warning mb-2">Important Disclaimer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  FinSight AI provides <strong>educational analysis only</strong>. All insights are based on historical data and should not be considered as investment advice. Past performance does not guarantee future results. Always consult with a qualified financial advisor before making investment decisions. We do not predict future stock prices or guarantee returns.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DisclaimerSection;
