import { motion } from "framer-motion";
import { GlowBlobs } from "./GlowBlobs";
import { SectionLabel } from "./SectionLabel";
import { useMarkdownData } from "@/hooks/use-markdown-data";
import { type FiverrContent, type FiverrGig, parseFiverrMarkdown } from "@/lib/markdown-content";

const FIVERR_FALLBACK: FiverrContent = {
  profileUrl: "https://www.fiverr.com/s/8xzK6XE",
  sellerLabel: "Fiverr Seller",
  headline: "Available for freelance work",
  blurb:
    "I take on a small number of freelance projects alongside my full-time work - mostly AI integrations, full-stack builds, and automation. Each gig below runs through Fiverr.",
  gigs: [],
};

const TONES: Record<FiverrGig["tone"], { from: string; to: string; ink: string }> = {
  coral: {
    from: "color-mix(in oklab, var(--coral) 42%, transparent)",
    to: "color-mix(in oklab, var(--terracotta-2) 24%, transparent)",
    ink: "var(--coral)",
  },
  gold: {
    from: "color-mix(in oklab, var(--gold) 40%, transparent)",
    to: "color-mix(in oklab, var(--terracotta) 20%, transparent)",
    ink: "var(--gold)",
  },
  ink: {
    from: "color-mix(in oklab, var(--charcoal) 34%, transparent)",
    to: "color-mix(in oklab, var(--gold) 18%, transparent)",
    ink: "var(--charcoal)",
  },
};

/**
 * Generated cover art. Fiverr blocks hotlinking and scraping, so each gig gets
 * a deterministic editorial tile derived from its title instead of a remote image.
 */
function GigCover({ gig, index }: { gig: FiverrGig; index: number }) {
  const tone = TONES[gig.tone];
  // The numeral keeps covers distinct even before real titles are filled in;
  // the tag names what the gig actually is.
  const numeral = String(index + 1).padStart(2, "0");
  const caption = gig.tags[0] ?? "Freelance";

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-warm"
      style={{ background: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }}
      aria-hidden
    >
      {/* Editorial rule grid, echoing the newspaper texture used site-wide. */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.18]" viewBox="0 0 320 200">
        <defs>
          <pattern id={`gig-grid-${index}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M16 0H0v16" fill="none" stroke="var(--ink)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="320" height="200" fill={`url(#gig-grid-${index})`} />
      </svg>

      <div
        className="absolute -right-6 -top-10 h-36 w-36 rounded-full blur-2xl"
        style={{ background: tone.ink, opacity: 0.25 }}
      />

      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/70">Fiverr</span>
        <div className="flex items-end justify-between gap-3">
          <span className="font-serif text-6xl leading-none text-ink/85">
            {numeral}
            <span style={{ color: tone.ink }}>.</span>
          </span>
          <span className="pb-1 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60">
            {caption}
          </span>
        </div>
      </div>
    </div>
  );
}

function GigCard({ gig, index }: { gig: FiverrGig; index: number }) {
  return (
    <motion.a
      href={gig.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      data-cursor="hover"
      className="group flex flex-col rounded-2xl border border-warm bg-[color:var(--card)] p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-coral hover:shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--coral)_45%,transparent)]"
    >
      <GigCover gig={gig} index={index} />

      {/* Titles are truncated to two lines so a long gig name can't break the grid. */}
      <h3 className="mt-5 line-clamp-2 font-serif text-xl leading-snug text-ink">{gig.title}</h3>

      {gig.tags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {gig.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-warm px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-charcoal"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-coral">
        View on Fiverr
        <span className="transition-transform group-hover:translate-x-1">{"->"}</span>
      </span>
    </motion.a>
  );
}

export function Freelancing() {
  const { data } = useMarkdownData("fiverr.md", parseFiverrMarkdown, FIVERR_FALLBACK);

  if (!data.gigs.length) return null;

  return (
    <section id="freelancing" className="relative py-32 md:py-44">
      <GlowBlobs
        blobs={[
          { color: "coral", size: 500, top: "10%", left: "68%", opacity: 0.07 },
          { color: "gold", size: 380, top: "65%", left: "-8%", opacity: 0.05, delay: 1 },
        ]}
      />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel number="06" label="Freelancing" />

        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif text-4xl leading-tight md:col-span-7 md:text-5xl"
          >
            {data.headline.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="editorial-italic text-coral">
              {data.headline.split(" ").slice(-2).join(" ")}
            </span>
            <span className="text-coral">.</span>
          </motion.h2>

          {data.blurb ? (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-lg leading-relaxed text-charcoal md:col-span-5"
            >
              {data.blurb}
            </motion.p>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {data.gigs.map((gig, index) => (
            <GigCard key={gig.link} gig={gig} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
