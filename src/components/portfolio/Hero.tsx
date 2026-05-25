import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { GlowBlobs } from "./GlowBlobs";
import { usePortfolioScroll } from "./SmoothScroll";
import { profile } from "@/lib/portfolio-data";

const headingWords: { text: string; italic?: boolean }[] = [
  { text: "I" },
  { text: "design" },
  { text: "&" },
  { text: "engineer", italic: true },
  { text: "resilient" },
  { text: "software", italic: true },
  { text: "with" },
  { text: "warmth", italic: true },
  { text: "and" },
  { text: "weight" },
];

function Typewriter({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [text]);

  return (
    <span className="font-mono text-xs uppercase tracking-[0.3em] text-charcoal">
      {shown}
      <span className="ml-0.5 inline-block h-3 w-1.5 -translate-y-0.5 bg-coral align-middle animate-pulse-soft" />
    </span>
  );
}

function DesktopComputerIllustration() {
  return (
    <svg viewBox="0 0 760 620" className="h-full w-full" aria-hidden>
      <g fill="none" fillRule="evenodd">
        <path
          d="M182 122h286c22 0 40 18 40 40v194c0 22-18 40-40 40H182c-22 0-40-18-40-40V162c0-22 18-40 40-40Z"
          fill="currentColor"
          opacity="0.34"
        />
        <path
          d="M214 154h222c17 0 30 13 30 30v124c0 17-13 30-30 30H214c-17 0-30-13-30-30V184c0-17 13-30 30-30Z"
          fill="var(--gold)"
          opacity="0.32"
        />
        <path
          d="M230 172h190c12 0 22 10 22 22v92c0 12-10 22-22 22H230c-12 0-22-10-22-22v-92c0-12 10-22 22-22Z"
          fill="var(--coral)"
          opacity="0.42"
        />
        <path
          d="M252 196h145c8 0 15 7 15 15v53c0 8-7 15-15 15H252c-8 0-15-7-15-15v-53c0-8 7-15 15-15Z"
          fill="currentColor"
          opacity="0.18"
        />
        <path d="M188 395h275l35 96H154l34-96Z" fill="currentColor" opacity="0.28" />
        <path
          d="M164 433h323c20 0 36 16 36 36v23H128v-23c0-20 16-36 36-36Z"
          fill="var(--gold)"
          opacity="0.26"
        />
        <path
          d="M170 453h310c8 0 14 6 14 14v12H156v-12c0-8 6-14 14-14Z"
          fill="currentColor"
          opacity="0.18"
        />
        <path
          d="M222 505h255c18 0 32 14 32 32v15H190v-15c0-18 14-32 32-32Z"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M200 526h302c10 0 18 8 18 18v5H182v-5c0-10 8-18 18-18Z"
          fill="var(--gold)"
          opacity="0.24"
        />
        <path
          d="M244 468h162c6 0 11 5 11 11v8H233v-8c0-6 5-11 11-11Z"
          fill="var(--coral)"
          opacity="0.35"
        />
        <path
          d="M536 462h120c22 0 40 18 40 40v26H496v-26c0-22 18-40 40-40Z"
          fill="currentColor"
          opacity="0.18"
        />
        <path
          d="M513 486h168c14 0 26 12 26 26v17H487v-17c0-14 12-26 26-26Z"
          fill="var(--gold)"
          opacity="0.22"
        />
        <path d="M514 512h164l-15 44H529l-15-44Z" fill="currentColor" opacity="0.14" />
        <path
          d="M530 495h15v12h-15zM558 495h15v12h-15zM586 495h15v12h-15zM614 495h15v12h-15zM642 495h15v12h-15z"
          fill="var(--coral)"
          opacity="0.3"
        />
        <path
          d="M311 109c12 0 22 10 22 22v12h-44v-12c0-12 10-22 22-22Z"
          fill="var(--gold)"
          opacity="0.18"
        />
        <path d="M463 219h30v17h-30zM463 248h30v17h-30zM463 277h30v17h-30z" fill="var(--coral)" opacity="0.22" />
        <path
          d="M214 154h222c17 0 30 13 30 30v16H184v-16c0-17 13-30 30-30Z"
          fill="currentColor"
          opacity="0.1"
        />
      </g>
    </svg>
  );
}

export function Hero() {
  const { scrollToSection } = usePortfolioScroll();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const baseComputerOpacity = 0.12;
  const computerY = useTransform(scrollYProgress, [0, 0.25], [0, -40]);
  const computerOpacity = useTransform(
    scrollYProgress,
    (progress) => baseComputerOpacity * (1 - Math.min(progress / 0.25, 1)),
  );

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20"
    >
      <GlowBlobs
        blobs={[
          { color: "coral", size: 520, top: "-10%", left: "-8%", opacity: 0.09 },
          { color: "gold", size: 460, top: "30%", left: "70%", opacity: 0.07, delay: 1 },
          { color: "coral", size: 340, top: "70%", left: "15%", opacity: 0.06, delay: 2 },
        ]}
      />

      <motion.div
        style={
          prefersReducedMotion
            ? { opacity: baseComputerOpacity }
            : {
                y: computerY,
                opacity: computerOpacity,
              }
        }
        className="pointer-events-none absolute right-[2%] top-1/2 hidden h-[72vh] max-h-[620px] w-[46vw] max-w-[720px] -translate-y-1/2 md:block"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full text-ink"
        >
          <DesktopComputerIllustration />
        </motion.div>
      </motion.div>

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-10 bg-coral" />
          <Typewriter text={`${profile.role} · ${profile.location}`} />
        </div>

        <h1 className="font-serif text-[clamp(2.6rem,8vw,7.5rem)] leading-[0.95] tracking-tight text-ink">
          {headingWords.map((w, i) => (
            <motion.span
              key={i}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.2 + i * 0.08,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mr-3 inline-block px-[0.01em] pb-[0.08em] align-bottom"
            >
              <span className={w.italic ? "editorial-italic text-coral" : "font-semibold"}>
                {w.text}
              </span>
            </motion.span>
          ))}
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 300 }}
            className="inline-block text-coral"
          >
            .
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-charcoal md:text-xl"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.85, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#projects"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("projects");
            }}
            className="group inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--primary-foreground)] glow-coral"
          >
            See selected work
            <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
          </a>
          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("contact");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-warm px-7 py-3.5 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:border-coral hover:text-coral"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-warm"
      >
        <span>scroll</span>
        <div className="relative flex h-14 w-6 items-start justify-center rounded-full border border-warm/70 bg-[color:color-mix(in_oklab,var(--background)_80%,transparent)] p-1">
          <span className="absolute inset-x-1 top-1 h-5 rounded-full bg-[linear-gradient(180deg,color-mix(in_oklab,var(--coral)_18%,transparent),transparent)] opacity-80" />
          <motion.span
            animate={{ y: [0, 22, 0], opacity: [0.95, 0.45, 0.95] }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: [0.22, 1, 0.36, 1] }}
            className="relative block h-2.5 w-2.5 rounded-full bg-coral shadow-[0_0_16px_color-mix(in_oklab,var(--coral)_60%,transparent)]"
          />
        </div>
      </motion.div>
    </section>
  );
}
