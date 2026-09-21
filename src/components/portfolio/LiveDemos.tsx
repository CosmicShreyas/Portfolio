import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import {
  Boxes,
  Database,
  ListChecks,
  MessagesSquare,
  Mic,
  MousePointerClick,
  Play,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { DemoModal, type DemoModalTarget } from "./DemoModal";
import { GlowBlobs } from "./GlowBlobs";
import { SectionLabel } from "./SectionLabel";

/**
 * Live, hands-on demos of four production platforms.
 *
 * Each link opens the real application against a sandboxed copy of its data:
 * visitors sign in automatically, can change anything, and touch nothing real.
 * The sandbox is a plugin inside each product, not a mock — so what is on screen
 * is the actual software.
 */

type Demo = {
  id: string;
  name: string;
  /** Matches the "01 / PROFESSIONAL" labelling used in Selected Work. */
  category: string;
  tagline: string;
  description: string;
  href: string;
  siteLabel: string;
  siteHref: string;
  /** Empty when the source is not public. */
  repo: string;
  accent: "coral" | "gold" | "sage" | "indigo";
  stack: string[];
  highlights: { icon: typeof Boxes; label: string }[];
  seeded: string;
};

const ACCENT_VARS: Record<Demo["accent"], string> = {
  coral: "var(--coral)",
  gold: "var(--gold)",
  // Third and fourth hues, so the cards stay distinguishable at a glance.
  sage: "#6f8f6a",
  indigo: "#6b6ba8",
};

const DEMOS: Demo[] = [
  {
    id: "glide",
    name: "Glide",
    category: "Professional",
    tagline: "Furniture manufacturing network",
    description:
      "One platform connecting interior design studios to a network of trusted furniture factories. An admin console and partner portal cover the whole commercial pipeline: pre-sales intake and CSV import, lead acquisition with stage sign-offs, enquiries, a drag-and-drop quotation builder that renders priced PDFs, quote approvals, order tracking and payment milestones.",
    href: "https://glideconnect.io/admin?demo=1",
    siteLabel: "glideconnect.io",
    siteHref: "https://glideconnect.io",
    repo: "",
    accent: "coral",
    stack: ["React 19", "TanStack Start", "Node.js", "Express", "MongoDB", "pdf-lib"],
    highlights: [
      { icon: Boxes, label: "Leads → quotes → orders" },
      { icon: Database, label: "Quotation builder + PDF export" },
      { icon: ShieldCheck, label: "Approval workflows" },
    ],
    seeded: "3 leads · 2 enquiries · 1 order",
  },
  {
    id: "screentime",
    name: "Vibgyor ScreenTime",
    category: "Professional",
    tagline: "Employee monitoring platform",
    description:
      "An employee monitoring platform with a broad full-stack footprint across desktop tooling, backend services and analytics. A native Rust agent feeds a dashboard of activity timelines, application and browser breakdowns, idle analysis, anti-cheat genuineness scoring, screenshots and scheduled end-of-day reports.",
    href: "https://screentime.vibgyor.co.in/?demo=1",
    siteLabel: "screentime.vibgyor.co.in",
    siteHref: "https://screentime.vibgyor.co.in",
    repo: "https://github.com/CosmicShreyas/Vibgyor-ScreenTime",
    accent: "gold",
    stack: ["React", "TypeScript", "Rust", "Node.js", "MongoDB", "WebSocket"],
    highlights: [
      { icon: Timer, label: "14 days of activity history" },
      { icon: Boxes, label: "App + browser breakdowns" },
      { icon: ShieldCheck, label: "Genuineness scoring" },
    ],
    seeded: "5 employees · 720 activity intervals",
  },
  {
    id: "converse",
    name: "Converse",
    category: "Professional",
    tagline: "Team chat platform",
    description:
      "A real-time team chat application for internal communication: direct messages and group channels over WebSockets, with roles, replies, pinned messages, media sharing, presence and typing indicators. Multi-tenant, so each company gets its own isolated workspace.",
    href: "https://chat.vibgyor.co.in/?demo=1",
    siteLabel: "chat.vibgyor.co.in",
    siteHref: "https://chat.vibgyor.co.in",
    repo: "https://github.com/CosmicShreyas/VibgyorChat",
    accent: "sage",
    stack: ["AngularJS", "FastAPI", "Python", "MongoDB", "Socket.IO"],
    highlights: [
      { icon: MessagesSquare, label: "DMs and group channels" },
      { icon: Boxes, label: "Live typing and presence" },
      { icon: ShieldCheck, label: "Seeded contacts reply to you" },
    ],
    seeded: "5 direct messages · 2 groups · 34 messages",
  },
  {
    id: "notable",
    name: "Notable",
    category: "Personal",
    tagline: "AI meeting notes and memory",
    description:
      "Meeting intelligence built around the transcript: record or join a call, get a live transcript with speaker labels, then an AI summary, chapters and pulled-out action items. Those action items become a task board, the whole workspace is searchable through an assistant that answers from your own meetings, and analytics track where the time actually goes.",
    href: "https://notable.vibgyor.co.in/?demo=1",
    siteLabel: "notable.vibgyor.co.in",
    siteHref: "https://notable.vibgyor.co.in",
    repo: "https://github.com/CosmicShreyas/Notable",
    accent: "indigo",
    stack: ["React", "TanStack Start", "FastAPI", "Python", "MongoDB", "Whisper"],
    highlights: [
      { icon: Mic, label: "Live transcripts with speakers" },
      { icon: Sparkles, label: "AI summaries and chapters" },
      { icon: ListChecks, label: "Action items become tasks" },
    ],
    seeded: "11 meetings · 30 tasks · 96 transcript lines",
  },
];

function DemoCard({ demo, index, onLaunch }: { demo: Demo; index: number; onLaunch: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const accentVar = ACCENT_VARS[demo.accent];

  // Subtle pointer-tracked tilt, matching the project cards elsewhere on the page.
  const onMove = (event: React.MouseEvent) => {
    if (reduceMotion) return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.transform = `perspective(1000px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-warm bg-[color:var(--card)] transition-[transform,border-color,box-shadow] duration-200 will-change-transform"
      style={
        {
          "--demo-accent": accentVar,
        } as React.CSSProperties
      }
    >
      {/* Accent wash that lifts on hover. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, ${accentVar} 14%, transparent), transparent 70%)`,
        }}
      />
      {/* Hairline that sweeps across the top edge on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
        style={{ background: `linear-gradient(90deg, transparent, ${accentVar}, transparent)` }}
      />

      <div className="relative flex flex-1 flex-col p-8 md:p-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              {/* Breathing dot: the demo really is live. */}
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ background: accentVar }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: accentVar }}
                />
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: accentVar }}
              >
                Live demo
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-warm">
                / {demo.category}
              </span>
            </div>
            <h3 className="mt-4 font-serif text-4xl leading-none text-ink md:text-5xl">
              {demo.name}
              <span style={{ color: accentVar }}>.</span>
            </h3>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-warm">
              {demo.tagline}
            </p>
          </div>
          <a
            href={demo.siteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-warm transition-colors hover:text-ink"
          >
            {demo.siteLabel}
          </a>
        </div>

        <p className="mt-6 max-w-prose font-serif text-base leading-relaxed text-charcoal">
          {demo.description}
        </p>

        <ul className="mt-7 grid gap-2.5">
          {demo.highlights.map((highlight, highlightIndex) => {
            const Icon = highlight.icon;
            return (
              <motion.li
                key={highlight.label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + highlightIndex * 0.08 }}
                className="flex items-center gap-2.5 text-sm text-charcoal"
              >
                <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: accentVar }} />
                {highlight.label}
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-7 flex flex-wrap gap-2">
          {demo.stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-warm px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-charcoal"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Sign-in note: there is nothing to type, which is worth saying plainly. */}
        <div className="mt-8 rounded-2xl border border-dashed border-warm bg-[color:color-mix(in_oklab,var(--parchment)_60%,transparent)] p-4">
          <div className="flex items-center gap-2">
            <MousePointerClick className="h-3.5 w-3.5" style={{ color: accentVar }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
              No login needed
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-charcoal">
            The demo signs you in automatically as an administrator — no username or password to
            type. It opens right here on this page, starting with{" "}
            <span className="font-medium text-ink">{demo.seeded}</span> of sample data.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onLaunch}
            data-cursor="hover"
            className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-parchment transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: accentVar }}
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-[color:var(--ink)] opacity-20 transition-transform duration-500 group-hover/btn:translate-x-0"
            />
            <span className="relative">Launch the demo</span>
            <Play className="relative h-3 w-3 fill-current transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </button>
          {demo.repo ? (
            <a
              href={demo.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-warm transition-colors hover:text-coral"
            >
              GitHub {"->"}
            </a>
          ) : null}
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-warm">
            Opens right here
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function LiveDemos() {
  const [openDemo, setOpenDemo] = useState<DemoModalTarget | null>(null);

  return (
    <section id="live-demos" className="relative py-32 md:py-44">
      <GlowBlobs
        blobs={[
          { color: "coral", size: 520, top: "0%", left: "-12%", opacity: 0.07 },
          { color: "gold", size: 420, top: "55%", left: "78%", opacity: 0.06, delay: 1 },
        ]}
      />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel number="04" label="Try It Live" />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl font-serif text-4xl leading-tight md:text-5xl"
        >
          Four platforms you can <span className="editorial-italic text-coral">actually use</span>,
          right now<span className="text-coral">.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 max-w-2xl font-serif text-base leading-relaxed text-charcoal"
        >
          These are the real applications, not screenshots or a click-through prototype. Each demo
          hands you a private, pre-populated copy of the database — click around, edit things, break
          things. Nothing you do touches production data, and everything resets when you leave.
        </motion.p>

        {/* Two per row — a clean 2×2 for four cards. Three across clipped the
            domain labels and forced the headings to wrap. */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {DEMOS.map((demo, index) => (
            <DemoCard
              key={demo.id}
              demo={demo}
              index={index}
              onLaunch={() =>
                setOpenDemo({
                  name: demo.name,
                  tagline: demo.tagline,
                  href: demo.href,
                  siteLabel: demo.siteLabel,
                  accentVar: ACCENT_VARS[demo.accent],
                })
              }
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-warm"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-coral" />
            Sandboxed per visitor
          </span>
          <span className="flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-coral" />
            Sample data only
          </span>
          <span className="flex items-center gap-2">
            <Timer className="h-3.5 w-3.5 text-coral" />
            Resets automatically
          </span>
        </motion.div>
      </div>

      <DemoModal target={openDemo} onClose={() => setOpenDemo(null)} />
    </section>
  );
}
