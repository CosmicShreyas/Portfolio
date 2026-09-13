import { motion } from "framer-motion";
import { useState } from "react";
import { GlowBlobs } from "./GlowBlobs";
import { SectionLabel } from "./SectionLabel";
import { useMarkdownData } from "@/hooks/use-markdown-data";
import { type CertificationsContent, parseCertificationsMarkdown } from "@/lib/markdown-content";

const CERTIFICATIONS_FALLBACK: CertificationsContent = {
  heading: "Certifications",
  blurb:
    "Ongoing study across AI, engineering practice, and delivery - issued by IBM, HP LIFE, Infosys, Atlassian, Kaggle, and others.",
  groups: [
    {
      issuer: "IBM",
      count: 5,
      items: [
        { name: "AI Fundamentals: Foundations for Understanding AI", issued: "Jul 2026" },
        { name: "Getting Started with Generative AI", issued: "Jul 2026" },
        { name: "Project Management Fundamentals", issued: "Jul 2026" },
        { name: "Agile Expert Certificate of Proficiency", issued: "Jul 2026" },
      ],
    },
    {
      issuer: "HP LIFE",
      count: 7,
      items: [
        { name: "AI for Business Professionals", issued: "Aug 2026" },
        { name: "Strategic Planning in the AI Age", issued: "Aug 2026" },
        { name: "Data Science and Analytics", issued: "Jul 2026" },
      ],
    },
  ],
};

/** Total across every issuer, used for the headline stat. */
function totalCount(content: CertificationsContent) {
  return content.groups.reduce((sum, group) => sum + Math.max(group.count, group.items.length), 0);
}

function IssuerCard({
  group,
  index,
}: {
  group: CertificationsContent["groups"][number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  // Long lists collapse so the section stays scannable.
  const collapsedLimit = 3;
  const isTruncated = group.items.length > collapsedLimit;
  const visible = expanded ? group.items : group.items.slice(0, collapsedLimit);
  const hiddenCount = group.items.length - collapsedLimit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col rounded-2xl border border-warm bg-[color:var(--card)] p-6 transition-colors duration-300 hover:border-coral"
    >
      <div className="flex items-baseline justify-between gap-3 border-b border-warm pb-4">
        <h3 className="font-serif text-2xl text-ink">{group.issuer}</h3>
        <span className="flex-none font-mono text-[10px] uppercase tracking-widest text-coral">
          {String(group.count).padStart(2, "0")}
        </span>
      </div>

      <ul className="mt-4 flex-1 space-y-3">
        {visible.map((item) => (
          <li key={item.name} className="flex gap-3">
            <span className="mt-2 h-1 w-2.5 flex-none bg-coral/70" />
            <div className="min-w-0">
              <div className="font-serif text-[0.95rem] leading-snug text-charcoal">
                {item.name}
              </div>
              {item.issued ? (
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-warm">
                  {item.issued}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {isTruncated ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          data-cursor="hover"
          className="mt-5 self-start font-mono text-[10px] uppercase tracking-widest text-muted-warm transition-colors hover:text-coral"
        >
          {expanded ? "Show less" : `+ ${hiddenCount} more`}
        </button>
      ) : null}
    </motion.div>
  );
}

export function Certifications() {
  const { data } = useMarkdownData(
    "certifications.md",
    parseCertificationsMarkdown,
    CERTIFICATIONS_FALLBACK,
  );

  if (!data.groups.length) return null;

  return (
    <section id="certifications" className="relative py-32 md:py-44">
      <GlowBlobs blobs={[{ color: "gold", size: 460, top: "15%", left: "-12%", opacity: 0.06 }]} />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel number="05" label={data.heading} />

        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl font-serif text-4xl leading-tight md:text-5xl"
          >
            Always <span className="editorial-italic text-coral">learning</span>, and keeping the
            receipts<span className="text-coral">.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-baseline gap-3"
          >
            <span className="font-serif text-5xl text-ink">{totalCount(data)}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-warm">
              Certifications
              <br />
              Earned
            </span>
          </motion.div>
        </div>

        {data.blurb ? (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="-mt-8 mb-14 max-w-2xl font-serif text-lg leading-relaxed text-charcoal"
          >
            {data.blurb}
          </motion.p>
        ) : null}

        <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.groups.map((group, index) => (
            <IssuerCard key={group.issuer} group={group} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
