import { motion } from "framer-motion";
import { usePortfolioScroll } from "./SmoothScroll";
import { useMarkdownData } from "@/hooks/use-markdown-data";
import { parseAboutMarkdown } from "@/lib/markdown-content";
import { ABOUT_FALLBACK, profile } from "@/lib/portfolio-data";
import { ResumeLink } from "./ResumeViewer";

const footerLinks = [
  { label: "about", section: "about" },
  { label: "skills", section: "skills" },
  { label: "work", section: "projects" },
  { label: "experience", section: "experience" },
  { label: "certs", section: "certifications" },
  { label: "freelance", section: "freelancing" },
  { label: "contact", section: "contact" },
] as const;

export function Footer() {
  const { scrollToSection } = usePortfolioScroll();
  const { data: aboutData } = useMarkdownData("about.md", parseAboutMarkdown, ABOUT_FALLBACK);
  const socials = [
    { label: "GitHub", href: aboutData.githubProfile },
    { label: "LinkedIn", href: aboutData.linkedinProfile },
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
              FULL-STACK SOFTWARE ENGINEER - BASED IN BENGALURU - SHIPPED TO THE WEB
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            {footerLinks.map(({ label, section }) => (
              <a
                key={label}
                href={`#${section}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(section);
                }}
                className="font-mono text-[11px] uppercase tracking-widest text-charcoal transition-colors hover:text-coral"
              >
                /{label}
              </a>
            ))}
          </div>

          <div className="flex gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-widest text-charcoal transition-colors hover:text-coral"
              >
                {s.label}
              </a>
            ))}
            <ResumeLink className="font-mono text-[11px] uppercase tracking-widest text-charcoal transition-colors hover:text-coral">
              RESUME {"->"}
            </ResumeLink>
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
