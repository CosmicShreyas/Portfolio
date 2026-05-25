import { motion } from "framer-motion";
import { useState } from "react";
import { GlowBlobs } from "./GlowBlobs";
import { SectionLabel } from "./SectionLabel";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMarkdownData } from "@/hooks/use-markdown-data";
import { type AboutContent, parseAboutMarkdown } from "@/lib/markdown-content";

const ABOUT_FALLBACK: AboutContent = {
  birthDate: "2000-04-02T00:00:00",
  shippingStartDate: "2026-01-01",
  githubProfile: "https://github.com/CosmicShreyas",
  email: "shreyaa@cosmicshreyaa.dev",
  showEmail: true,
  resumeLink: "#",
  ageLabel: "YEARS YOUNG",
  shippingLabelMonths: "MONTHS SHIPPING",
  shippingLabelYears: "YEARS SHIPPING",
  repoLabel: "PROJECTS LIVE",
  paragraphs: [],
};

function getGithubUsername(profileUrl: string) {
  const trimmed = profileUrl.trim().replace(/\/+$/, "");
  const parts = trimmed.split("/");
  return parts[parts.length - 1] || "";
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const { data: aboutData } = useMarkdownData("about.md", parseAboutMarkdown, ABOUT_FALLBACK);
  const githubUsername = getGithubUsername(aboutData.githubProfile);
  const socials = [
    { label: "GitHub", href: aboutData.githubProfile },
    { label: "Resume", href: aboutData.resumeLink },
  ].filter((social) => social.href.trim() && social.href.trim() !== "#");

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    projectType: "New Project",
    message: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({
        name: "",
        email: "",
        subject: "",
        projectType: "New Project",
        message: "",
      });
    }, 2800);
  };

  const fieldShellClass =
    "group relative rounded-[1.35rem] border border-transparent bg-[linear-gradient(180deg,color-mix(in_oklab,var(--background)_88%,transparent),color-mix(in_oklab,var(--background)_94%,transparent))] px-5 pt-3 pb-4 transition-all duration-300 hover:border-[color:color-mix(in_oklab,var(--coral)_18%,var(--muted-warm))] focus-within:border-[color:color-mix(in_oklab,var(--coral)_55%,var(--muted-warm))] focus-within:bg-[linear-gradient(180deg,color-mix(in_oklab,var(--background)_80%,transparent),color-mix(in_oklab,var(--background)_92%,transparent))] focus-within:shadow-[0_18px_44px_-28px_color-mix(in_oklab,var(--coral)_55%,transparent)]";
  const fieldClass =
    "h-auto border-0 border-b border-warm/80 rounded-none bg-transparent px-0 pb-0 pt-3 font-serif text-[1.05rem] text-ink shadow-none transition-all duration-300 placeholder:text-muted-warm/70 placeholder:transition-colors focus-visible:border-coral focus-visible:ring-0 focus-visible:placeholder:text-muted-warm/45 md:text-[1.15rem]";
  const selectTriggerClass =
    "h-auto border-0 border-b border-warm/80 rounded-none bg-transparent px-0 pb-0 pt-3 font-serif text-[1.05rem] text-ink shadow-none ring-0 transition-all duration-300 data-[placeholder]:text-muted-warm/70 focus:ring-0 focus:border-coral md:text-[1.15rem] [&>span]:w-full [&>span]:text-left";
  const selectContentClass =
    "border-[color:color-mix(in_oklab,var(--coral)_28%,var(--muted-warm))] bg-[color:var(--card)] text-ink shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] backdrop-blur-xl";
  const selectItemClass =
    "rounded-xl px-4 py-3 font-serif text-base text-charcoal transition-colors focus:bg-[color:color-mix(in_oklab,var(--coral)_14%,var(--background))] focus:text-ink data-[state=checked]:text-coral";

  return (
    <section id="contact" className="relative overflow-hidden py-32 md:py-44">
      <GlowBlobs
        blobs={[
          { color: "coral", size: 720, top: "10%", left: "30%", opacity: 0.09 },
          { color: "gold", size: 460, top: "60%", left: "5%", opacity: 0.06, delay: 1.2 },
        ]}
      />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel number="05" label="Contact" />

        <div className="grid gap-16 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5"
          >
            <h2 className="font-serif text-5xl leading-[0.95] md:text-6xl">
              Let's <span className="editorial-italic text-coral">make</span> something
              <br />
              worth keeping<span className="text-coral">.</span>
            </h2>
            <p className="mt-6 max-w-md font-serif text-lg leading-relaxed text-charcoal">
              I'm early in my journey and deeply focused on building things that matter. If
              you're working on something interesting - a product, a tool, an experiment - I'd
              love to hear about it.
            </p>

            {aboutData.showEmail ? (
              <div className="mt-10 space-y-2">
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-warm">
                  direct
                </div>
                <a
                  href={`mailto:${aboutData.email}`}
                  className="block font-serif text-2xl text-ink transition-colors hover:text-coral"
                >
                  {aboutData.email}
                </a>
              </div>
            ) : null}

            <div className={`${aboutData.showEmail ? "mt-10" : "mt-12"} flex flex-wrap gap-3`}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="rounded-full border border-warm px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-charcoal transition-colors hover:border-coral hover:text-coral"
                >
                  {s.label === "GitHub" && githubUsername ? githubUsername : s.label} {"->"}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-8 rounded-2xl border border-warm bg-[color:var(--card)] p-8 backdrop-blur md:col-span-7 md:p-10"
          >
            <div className={fieldShellClass}>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-warm">
                01 - Name
              </label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className={fieldClass}
              />
            </div>

            <div className={fieldShellClass}>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-warm">
                02 - Email
              </label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@studio.com"
                className={fieldClass}
              />
            </div>

            <div className={fieldShellClass}>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-warm">
                03 - Subject
              </label>
              <Input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="What are we building?"
                className={fieldClass}
              />
            </div>

            <div className={fieldShellClass}>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-warm">
                04 - Project Type
              </label>
              <Select
                value={form.projectType}
                onValueChange={(projectType) => setForm({ ...form, projectType })}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Select a project type" />
                </SelectTrigger>
                <SelectContent className={selectContentClass} position="popper">
                  <SelectItem className={selectItemClass} value="New Project">
                    New Project
                  </SelectItem>
                  <SelectItem className={selectItemClass} value="Freelance Contract">
                    Freelance Contract
                  </SelectItem>
                  <SelectItem className={selectItemClass} value="Full-Time Role">
                    Full-Time Role
                  </SelectItem>
                  <SelectItem className={selectItemClass} value="Just saying hi">
                    Just saying hi
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={fieldShellClass}>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-warm">
                05 - Message
              </label>
              <Textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                placeholder="Tell me about the project, timeline, and what good looks like..."
                className={fieldClass + " min-h-[10rem] resize-none leading-relaxed"}
              />
            </div>

            <button
              type="submit"
              className="group inline-flex items-center gap-3 rounded-full bg-coral px-8 py-4 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--primary-foreground)] glow-coral"
            >
              {sent ? "Message sent OK" : "Send message"}
              <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
