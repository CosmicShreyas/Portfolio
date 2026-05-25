import { motion } from "framer-motion";
import { profile } from "@/lib/portfolio-data";
import { AmbientBackground } from "./AmbientBackground";
import { GrainOverlay } from "./GrainOverlay";
import { NewspaperTexture } from "./NewspaperTexture";
import { CustomCursor } from "./CustomCursor";

type NotFoundPageProps = {
  homeHref: string;
};

const cloudTransition = {
  duration: 28,
  repeat: Infinity,
  ease: "linear" as const,
};

export function NotFoundPage({ homeHref }: NotFoundPageProps) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-parchment text-ink">
      <NewspaperTexture />
      <AmbientBackground />
      <GrainOverlay />
      <CustomCursor />

      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[14%] top-[20%] h-56 w-56 rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute bottom-[10%] right-[10%] h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-12 md:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)] md:px-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-muted-warm"
          >
            <span className="h-px w-12 bg-gradient-to-r from-coral to-transparent" />
            404
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-[12ch] font-serif text-5xl leading-[0.9] md:text-7xl"
          >
            A quiet <span className="editorial-italic text-coral">bird</span> stayed on
            watch, but the page never appeared<span className="text-coral">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-charcoal md:text-xl"
          >
            This route drifted away somewhere between the address bar and the build.
            Let&apos;s head back to familiar ground.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href={homeHref}
              className="inline-flex items-center justify-center rounded-full bg-coral px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--primary-foreground)] glow-coral"
            >
              Back home -&gt;
            </a>
            <a
              href={profile.githubUrl}
              className="inline-flex items-center justify-center rounded-full border border-warm px-8 py-4 font-mono text-xs uppercase tracking-[0.28em] text-ink transition-colors hover:border-coral hover:text-coral"
            >
              Visit GitHub -&gt;
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-coral/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.008)),rgba(23,21,16,0.38)]"
        >
          <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />

          <motion.div
            animate={{ x: ["-30%", "130%"] }}
            transition={cloudTransition}
            className="absolute left-0 top-14 h-24 w-52"
          >
            <div className="absolute left-10 top-4 h-12 w-20 rounded-full bg-white/55 blur-[1px]" />
            <div className="absolute left-0 top-9 h-14 w-28 rounded-full bg-white/48" />
            <div className="absolute left-16 top-0 h-16 w-28 rounded-full bg-white/60" />
            <div className="absolute left-28 top-8 h-12 w-24 rounded-full bg-white/48" />
          </motion.div>

          <motion.div
            animate={{ x: ["-35%", "135%"] }}
            transition={{ ...cloudTransition, duration: 34, delay: 1.2 }}
            className="absolute left-0 top-44 h-20 w-40 opacity-90"
          >
            <div className="absolute left-6 top-3 h-9 w-16 rounded-full bg-white/42" />
            <div className="absolute left-0 top-7 h-11 w-24 rounded-full bg-white/35" />
            <div className="absolute left-14 top-0 h-11 w-18 rounded-full bg-white/46" />
            <div className="absolute left-24 top-6 h-10 w-16 rounded-full bg-white/35" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <svg
              width="170"
              height="120"
              viewBox="0 0 170 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
            >
              <path
                d="M36 67C48 44 68 32 94 31C82 42 74 53 70 67C58 66 48 66 36 67Z"
                fill="#171310"
              />
              <path
                d="M95 31C120 32 139 45 154 68C139 66 126 66 114 67C110 54 104 42 95 31Z"
                fill="#1D1815"
              />
              <ellipse cx="88" cy="71" rx="23" ry="13" fill="#14110E" />
              <circle cx="109" cy="67" r="8.5" fill="#14110E" />
              <path d="M116 67L131 62L118 71L116 67Z" fill="#E4C67A" />
              <circle cx="111.5" cy="65.5" r="1.8" fill="#F6ECDD" />
              <path d="M82 82L73 97" stroke="#14110E" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M95 82L104 98" stroke="#14110E" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(circle_at_50%_100%,rgba(226,109,90,0.12),transparent_42%)]" />
        </motion.div>
      </div>
    </div>
  );
}
