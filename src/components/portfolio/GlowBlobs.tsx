import { motion } from "framer-motion";

type Blob = {
  color: "coral" | "gold";
  size: number;
  top: string;
  left: string;
  opacity?: number;
  delay?: number;
};

const palette = {
  coral: "#e26d5a",
  gold: "#a37153",
};

export function GlowBlobs({ blobs }: { blobs: Blob[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: b.opacity ?? 0.07 }}
          transition={{ duration: 1.6, delay: b.delay ?? 0 }}
          className="absolute rounded-full blur-3xl animate-float-slow"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: `radial-gradient(circle, ${palette[b.color]} 0%, transparent 70%)`,
            animationDelay: `${(b.delay ?? 0) * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
