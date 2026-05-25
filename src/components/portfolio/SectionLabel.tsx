import { motion } from "framer-motion";

export function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mb-10 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-muted-warm"
    >
      <span className="text-coral">{number}</span>
      <span className="h-px w-12 bg-[color:var(--muted-warm)] opacity-40" />
      <span>{label}</span>
    </motion.div>
  );
}
