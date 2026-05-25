import { motion } from "framer-motion";
import { usePortfolioScroll } from "./SmoothScroll";
import { useMarkdownData } from "@/hooks/use-markdown-data";
import { type AboutContent, parseAboutMarkdown } from "@/lib/markdown-content";
import { profile } from "@/lib/portfolio-data";

const ABOUT_FALLBACK: AboutContent = {
  birthDate: "2000-04-02T00:00:00",
  shippingStartDate: "2026-01-01",
  githubProfile: "https://github.com/CosmicShreyas",
  email: "shreyaa@cosmicshreyas.dev",
  showEmail: true,
  resumeLink: "#",
  ageLabel: "YEARS YOUNG",
  shippingLabelMonths: "MONTHS SHIPPING",
  shippingLabelYears: "YEARS SHIPPING",
  repoLabel: "PROJECTS LIVE",
  paragraphs: [],
};

export function Footer() {
  const { scrollToSection } = usePortfolioScroll();
  const { data: aboutData } = useMarkdownData("about.md", parseAboutMarkdown, ABOUT_FALLBACK);
  const socials = [
    { label: "GitHub", href: aboutData.githubProfile },
    { label: "Resume", href: aboutData.resumeLink },
  ].filter((social) => social.href.trim() && social.href.trim() !== "#");

  return (
    <footer className="relative px-6 pb-12 pt-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left", backgroundColor: "var(--muted-warm)" }}
          className="mb-10 h-px opacity-50"
        />

        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="font-serif text-2xl">
              {profile.name}
              <span className="text-coral">.</span>
            </div>
            <p className="mt-2 max-w-xs font-mono text-[11px] uppercase tracking-widest text-muted-warm">
              FULL-STACK ENGINEER - BASED IN BENGALURU - SHIPPED TO THE WEB
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            {["about", "skills", "work", "experience", "contact"].map((l) => (
              <a
                key={l}
                href={`#${l === "work" ? "projects" : l}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(l === "work" ? "projects" : l);
                }}
                className="font-mono text-[11px] uppercase tracking-widest text-charcoal transition-colors hover:text-coral"
              >
                /{l}
              </a>
            ))}
          </div>

          <div className="flex gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="font-mono text-[11px] uppercase tracking-widest text-charcoal transition-colors hover:text-coral"
              >
                {s.label === "Resume" ? "RESUME ->" : s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-warm">
          <span>(C) {new Date().getFullYear()} SHREYAS - ALL RIGHTS RESERVED.</span>
          <span>Edition 01 / Hand-set in Bengaluru</span>
        </div>
      </div>
    </footer>
  );
}
