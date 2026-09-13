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
import { parseAboutMarkdown } from "@/lib/markdown-content";
import { ABOUT_FALLBACK } from "@/lib/portfolio-data";
import { ResumeLink } from "./ResumeViewer";

function getGithubUsername(profileUrl: string) {
  const trimmed = profileUrl.trim().replace(/\/+$/, "");
  const parts = trimmed.split("/");
  return parts[parts.length - 1] || "";
}

type SubmitStatus = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const { data: aboutData } = useMarkdownData("about.md", parseAboutMarkdown, ABOUT_FALLBACK);
  const githubUsername = getGithubUsername(aboutData.githubProfile);
  const socials = [
    { label: "GitHub", href: aboutData.githubProfile },
    { label: "LinkedIn", href: aboutData.linkedinProfile },
  ].filter((social) => social.href.trim() && social.href.trim() !== "#");

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    projectType: "New Project",
    message: "",
  });

  const resetForm = () =>
    setForm({
      name: "",
      email: "",
      subject: "",
      projectType: "New Project",
      message: "",
    });

  /**
   * Posts to the endpoint configured in about.md. With no endpoint set, the
   * message is handed to the visitor's mail client instead - so the form always
   * does something real, even on a static host with nothing wired up.
   */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    const endpoint = aboutData.formEndpoint.trim();
    const body = `${form.message}\n\n---\nProject type: ${form.projectType}\nFrom: ${form.name} <${form.email}>`;

    if (!endpoint) {
      const href = `mailto:${aboutData.email}?subject=${encodeURIComponent(
        form.subject,
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 4000);
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          projectType: form.projectType,
          message: form.message,
        }),
      });

      if (!response.ok) throw new Error(`Form endpoint responded ${response.status}`);

      setStatus("sent");
      resetForm();
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
    }
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
        <SectionLabel number="07" label="Contact" />

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
              I build products end to end and care about the details that make them last. If you're
              working on something interesting - a product, a platform, a team that needs a hand -
              I'd love to hear about it.
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-warm px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-charcoal transition-colors hover:border-coral hover:text-coral"
                >
                  {s.label === "GitHub" && githubUsername ? githubUsername : s.label} {"->"}
                </a>
              ))}
              <ResumeLink className="rounded-full border border-warm px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-charcoal transition-colors hover:border-coral hover:text-coral">
                Resume {"->"}
              </ResumeLink>
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

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex items-center gap-3 rounded-full bg-coral px-8 py-4 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--primary-foreground)] transition-opacity glow-coral disabled:opacity-70"
              >
                {status === "sending"
                  ? "Sending"
                  : status === "sent"
                    ? "Message sent"
                    : "Send message"}
                <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
              </button>

              {/* One line of feedback, in the interface's own voice. */}
              {status === "sent" ? (
                <span className="font-mono text-[11px] uppercase tracking-widest text-coral">
                  Thanks - I'll get back to you.
                </span>
              ) : null}
              {status === "error" ? (
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-warm">
                  That didn't send. Email{" "}
                  <a href={`mailto:${aboutData.email}`} className="text-coral underline">
                    {aboutData.email}
                  </a>{" "}
                  instead.
                </span>
              ) : null}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
