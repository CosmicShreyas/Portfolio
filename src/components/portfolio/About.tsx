import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { GlowBlobs } from "./GlowBlobs";
import { SectionLabel } from "./SectionLabel";
import { useMarkdownData } from "@/hooks/use-markdown-data";
import { type AboutContent, parseAboutMarkdown } from "@/lib/markdown-content";

const ABOUT_FALLBACK: AboutContent = {
  birthDate: "2000-04-02T00:00:00",
  shippingStartDate: "2026-01-01",
  githubProfile: "https://github.com/CosmicShreyas",
  email: "shreyaa@cosmicshreyaa.dev",
  resumeLink: "#",
  ageLabel: "YEARS YOUNG",
  shippingLabelMonths: "MONTHS SHIPPING",
  shippingLabelYears: "YEARS SHIPPING",
  repoLabel: "PROJECTS LIVE",
  paragraphs: [
    "I build software with a systems mindset and a strong bias toward useful, durable products. I care about how things work beneath the surface, and that shows up in the way I approach architecture, product decisions, and the details that make an experience feel solid.",
    "I work at Vibgyor, where I develop internal tools and client-facing software for the interior design industry. Outside of work, you'll usually find me deep in a Sherlock Holmes novel, sketching ideas in a notebook, or shipping a new experiment to GitHub.",
  ],
};

function getShippingMetric(startDateString: string, monthsLabel: string, yearsLabel: string) {
  const startDate = new Date(startDateString);
  if (Number.isNaN(startDate.getTime())) {
    return { value: 0, label: monthsLabel };
  }

  const now = new Date();
  const months =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth()) +
    1;

  if (months < 12) {
    return {
      value: Math.max(months, 0),
      label: monthsLabel,
    };
  }

  return {
    value: Math.max(Math.floor(months / 12), 1),
    label: yearsLabel,
  };
}

function getGithubUsername(profileUrl: string) {
  const trimmed = profileUrl.trim().replace(/\/+$/, "");
  const parts = trimmed.split("/");
  return parts[parts.length - 1] || "";
}

function LiveAgeCounter({ birthDate }: { birthDate: string }) {
  const [age, setAge] = useState("0.00");

  useEffect(() => {
    const birthdate = new Date(birthDate).getTime();
    const yearMs = 365.25 * 24 * 60 * 60 * 1000;

    const updateAge = () => {
      const value = (Date.now() - birthdate) / yearMs;
      setAge(value.toFixed(2));
    };

    updateAge();
    const id = window.setInterval(updateAge, 100);
    return () => window.clearInterval(id);
  }, [birthDate]);

  return <span className="font-serif text-5xl text-ink">{age}</span>;
}

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-serif text-5xl text-ink">
      {n.toLocaleString()}
    </span>
  );
}

function Avatar() {
  return (
    <svg viewBox="0 0 400 480" className="h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id="a-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#db815e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a37153" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="360" height="440" rx="8" fill="url(#a-bg)" />
      <rect
        x="20"
        y="20"
        width="360"
        height="440"
        rx="8"
        fill="none"
        stroke="#1a1714"
        strokeOpacity="0.15"
      />
      <circle cx="200" cy="180" r="78" fill="#e8dfca" stroke="#1a1714" strokeWidth="1.5" />
      <circle cx="200" cy="180" r="58" fill="#e26d5a" opacity="0.85" />
      <path d="M80 420 C 120 320, 280 320, 320 420 Z" fill="#1a1714" opacity="0.85" />
      <circle cx="320" cy="80" r="22" fill="#e26d5a" opacity="0.9" />
      <line x1="40" y1="380" x2="120" y2="380" stroke="#1a1714" strokeWidth="1" />
      <text x="40" y="450" fill="#1a1714" fontFamily="monospace" fontSize="10" opacity="0.7">
        PORTRAIT / 2025
      </text>
    </svg>
  );
}

export function About() {
  const { data } = useMarkdownData("about.md", parseAboutMarkdown, ABOUT_FALLBACK);
  const [repoCount, setRepoCount] = useState(0);
  const [shippingMetric, setShippingMetric] = useState(() =>
    getShippingMetric(
      ABOUT_FALLBACK.shippingStartDate,
      ABOUT_FALLBACK.shippingLabelMonths,
      ABOUT_FALLBACK.shippingLabelYears,
    ),
  );

  useEffect(() => {
    setShippingMetric(
      getShippingMetric(data.shippingStartDate, data.shippingLabelMonths, data.shippingLabelYears),
    );

    const id = window.setInterval(() => {
      setShippingMetric(
        getShippingMetric(data.shippingStartDate, data.shippingLabelMonths, data.shippingLabelYears),
      );
    }, 60_000);

    return () => window.clearInterval(id);
  }, [data.shippingLabelMonths, data.shippingLabelYears, data.shippingStartDate]);

  useEffect(() => {
    const username = getGithubUsername(data.githubProfile);
    if (!username) return;

    const controller = new AbortController();

    async function loadRepoCount() {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`, {
          signal: controller.signal,
          headers: {
            Accept: "application/vnd.github+json",
          },
        });

        if (!response.ok) {
          throw new Error(`GitHub profile request failed: ${response.status}`);
        }

        const payload = (await response.json()) as { public_repos?: number };
        setRepoCount(payload.public_repos ?? 0);
      } catch {
        if (!controller.signal.aborted) {
          setRepoCount(0);
        }
      }
    }

    loadRepoCount();
    return () => controller.abort();
  }, [data.githubProfile]);

  const stats = useMemo(
    () => [
      { kind: "live-age" as const, label: data.ageLabel },
      { kind: "count" as const, label: shippingMetric.label, value: shippingMetric.value },
      { kind: "count" as const, label: data.repoLabel, value: repoCount },
    ],
    [data.ageLabel, data.repoLabel, repoCount, shippingMetric.label, shippingMetric.value],
  );

  return (
    <section id="about" className="relative py-32 md:py-44">
      <GlowBlobs blobs={[{ color: "gold", size: 500, top: "20%", left: "-15%", opacity: 0.06 }]} />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel number="01" label="About" />

        <div className="grid items-center gap-16 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5"
          >
            <Avatar />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-7"
          >
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              A <span className="editorial-italic text-coral">considered</span> approach to
              building software that lasts<span className="text-coral">.</span>
            </h2>
            <p className="mt-6 font-serif text-lg leading-relaxed text-charcoal">
              {data.paragraphs[0] ?? ABOUT_FALLBACK.paragraphs[0]}
            </p>
            <p className="mt-4 font-serif text-lg leading-relaxed text-charcoal">
              {data.paragraphs[1] ?? ABOUT_FALLBACK.paragraphs[1]}
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-warm pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  {stat.kind === "live-age" ? (
                    <LiveAgeCounter birthDate={data.birthDate} />
                  ) : (
                    <Counter value={stat.value} />
                  )}
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-warm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
