import { motion } from "framer-motion";
import { useState } from "react";
import { GlowBlobs } from "./GlowBlobs";
import { SectionLabel } from "./SectionLabel";
import { ContactTerminal, fieldsToTranscript } from "./ContactTerminal";
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
    // The transcript the visitor actually saw, sent verbatim.
    const body = fieldsToTranscript(form);

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
          // The session transcript, for endpoints that can show it as-is.
          transcript: body,
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

  return (
    <section id="contact" className="relative overflow-hidden py-32 md:py-44">
      <GlowBlobs
        blobs={[
          { color: "coral", size: 720, top: "10%", left: "30%", opacity: 0.09 },
          { color: "gold", size: 460, top: "60%", left: "5%", opacity: 0.06, delay: 1.2 },
        ]}
      />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel number="08" label="Contact" />

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

          <ContactTerminal
            fields={form}
            onChange={setForm}
            status={status}
            onSubmit={submit}
            email={aboutData.email}
          />
        </div>
      </div>
    </section>
  );
}
