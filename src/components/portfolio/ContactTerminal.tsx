/**
 * The contact form as a terminal session.
 *
 * Instead of a wall of inputs, the visitor answers one prompt at a time and the
 * answers scroll up as transcript. There is exactly one `<input>` on screen at
 * any moment, which is what keeps this from having the caret problems a
 * re-rendered document has: the value being typed is plain local state, and
 * nothing rewrites it underneath the cursor.
 *
 * It stays a real form — the same five values, the same submit — so it degrades
 * to something sensible and remains keyboard-only navigable.
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Fields = {
  name: string;
  email: string;
  subject: string;
  projectType: string;
  message: string;
};

export const PROJECT_TYPES = [
  "New Project",
  "Freelance Contract",
  "Full-Time Role",
  "Just saying hi",
] as const;

const DRAFT_KEY = "portfolio.contact-draft";

type StepId = keyof Fields;

type Step = {
  id: StepId;
  /** The prompt shown before the caret, e.g. `who's this?`. */
  prompt: string;
  hint: string;
  placeholder: string;
  /** Choice steps render buttons instead of a free-text input. */
  choices?: readonly string[];
  multiline?: boolean;
  validate?: (value: string) => string | null;
};

const STEPS: Step[] = [
  {
    id: "name",
    prompt: "whoami",
    hint: "Your name",
    placeholder: "Ada Lovelace",
    validate: (value) => (value.trim().length < 2 ? "A name, even a short one." : null),
  },
  {
    id: "email",
    prompt: "reply-to",
    hint: "Where I write back",
    placeholder: "you@studio.com",
    validate: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? null : "That doesn't look like an email.",
  },
  {
    id: "projectType",
    prompt: "context",
    hint: "What kind of thing is this",
    placeholder: "",
    choices: PROJECT_TYPES,
  },
  {
    id: "subject",
    prompt: "subject",
    hint: "One line",
    placeholder: "A scheduling tool that doesn't fight back",
    validate: (value) => (value.trim().length < 3 ? "Give me a few more words." : null),
  },
  {
    id: "message",
    prompt: "message",
    hint: "The detail — shift+enter for a new line",
    placeholder: "What you're building, where I'd come in, rough timeline...",
    multiline: true,
    validate: (value) => (value.trim().length < 10 ? "A sentence or two at least." : null),
  },
];

const EMPTY: Fields = {
  name: "",
  email: "",
  subject: "",
  projectType: "New Project",
  message: "",
};

/** A plain-text transcript of the session, which is what actually gets sent. */
export function fieldsToTranscript(fields: Fields) {
  return [
    `From:    ${fields.name} <${fields.email}>`,
    `Context: ${fields.projectType}`,
    `Subject: ${fields.subject}`,
    "",
    fields.message.trim(),
    "",
  ].join("\n");
}

export function ContactTerminal({
  fields,
  onChange,
  status,
  onSubmit,
  email,
}: {
  fields: Fields;
  onChange: (next: Fields) => void;
  status: "idle" | "sending" | "sent" | "error";
  onSubmit: (event: React.FormEvent) => void;
  email: string;
}) {
  const reduceMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const step = STEPS[stepIndex];
  const done = stepIndex >= STEPS.length;

  // ---- Draft restore, once on mount --------------------------------------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<Fields>;
      if (!saved) return;
      const merged = { ...EMPTY, ...saved };
      const answered = STEPS.filter((entry) => String(merged[entry.id] || "").trim()).length;
      if (answered === 0) return;
      onChange(merged);
      setStepIndex(Math.min(answered, STEPS.length));
      setRestored(true);
    } catch {
      // No usable draft.
    }
    // Mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Draft autosave ----------------------------------------------------
  useEffect(() => {
    const hasContent = Object.values(fields).some(
      (value) => typeof value === "string" && value.trim() && value !== "New Project",
    );
    const timer = setTimeout(() => {
      try {
        if (hasContent) localStorage.setItem(DRAFT_KEY, JSON.stringify(fields));
        else localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Storage unavailable; the form still works.
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [fields]);

  useEffect(() => {
    if (status !== "sent") return;
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Nothing to clear.
    }
  }, [status]);

  // Keep the newest line in view, and the caret in the live input.
  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [stepIndex, done]);

  // The textarea grows with its content rather than scrolling internally.
  useEffect(() => {
    const element = inputRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  }, [draft]);

  const commit = useCallback(() => {
    if (!step) return;
    const value = draft.trim();
    const problem = step.validate?.(value) ?? null;
    if (problem) {
      setError(problem);
      return;
    }
    onChange({ ...fields, [step.id]: value });
    setDraft("");
    setError(null);
    setStepIndex((index) => index + 1);
  }, [draft, fields, onChange, step]);

  const choose = useCallback(
    (choice: string) => {
      onChange({ ...fields, projectType: choice });
      setError(null);
      setStepIndex((index) => index + 1);
    },
    [fields, onChange],
  );

  const goBack = useCallback(() => {
    setStepIndex((index) => {
      const target = Math.max(0, index - 1);
      // Put the previous answer back in the input so it can be corrected.
      const previous = STEPS[target];
      if (previous && !previous.choices) setDraft(String(fields[previous.id] || ""));
      return target;
    });
    setError(null);
  }, [fields]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        commit();
        return;
      }
      // Backspace on an empty line steps back, the way a wizard should.
      if (event.key === "Backspace" && draft === "" && stepIndex > 0) {
        event.preventDefault();
        goBack();
      }
    },
    [commit, draft, goBack, stepIndex],
  );

  const restart = useCallback(() => {
    onChange(EMPTY);
    setStepIndex(0);
    setDraft("");
    setError(null);
    setRestored(false);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Nothing to clear.
    }
  }, [onChange]);

  const answered = useMemo(
    () => STEPS.slice(0, stepIndex).map((entry) => ({ step: entry, value: fields[entry.id] })),
    [fields, stepIndex],
  );

  const progress = Math.round((Math.min(stepIndex, STEPS.length) / STEPS.length) * 100);

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.1 }}
      onClick={() => inputRef.current?.focus()}
      className="flex flex-col overflow-hidden rounded-2xl border border-warm bg-[color:var(--card)] shadow-[0_40px_120px_-48px_rgba(0,0,0,0.55)] backdrop-blur md:col-span-7"
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-warm px-4 py-3 md:px-5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-coral/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--gold)] opacity-60" />
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--muted-warm)] opacity-40" />
        </div>
        <span className="font-mono text-[11px] text-charcoal">shreyas@portfolio — new message</span>

        <div className="ml-auto flex items-center gap-2.5">
          {/* Progress as a row of blocks, not a bar. */}
          <div className="hidden items-center gap-1 sm:flex">
            {STEPS.map((entry, index) => (
              <span
                key={entry.id}
                className={`h-1 w-4 rounded-full transition-colors duration-500 ${
                  index < stepIndex ? "bg-coral" : "bg-[color:var(--muted-warm)] opacity-25"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] tabular-nums text-muted-warm">{progress}%</span>
        </div>
      </div>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="h-[24rem] overflow-y-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed md:px-5 md:text-[13px]"
      >
        {/* Banner */}
        <p className="text-muted-warm">
          <span className="text-coral">◆</span> Say hello. Five questions, then it sends.
        </p>
        {restored ? (
          <p className="mt-1 text-muted-warm/80">
            <span className="text-coral">◆</span> Picked up where you left off.{" "}
            <button
              type="button"
              onClick={restart}
              className="underline decoration-muted-warm/40 underline-offset-2 hover:text-coral"
            >
              start over
            </button>
          </p>
        ) : null}

        {/* Answered steps */}
        <div className="mt-4 space-y-3">
          {answered.map(({ step: entry, value }) => (
            <motion.div
              key={entry.id}
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-coral">{">"}</span>
                <span className="text-muted-warm">{entry.prompt}</span>
                <span className="text-muted-warm/50">·</span>
                <span className="whitespace-pre-wrap break-words text-ink">{value}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live prompt */}
        {!done ? (
          <div className="mt-4">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-coral">{">"}</span>
              <span className="text-muted-warm">{step.prompt}</span>
              <span className="text-[11px] text-muted-warm/60">— {step.hint}</span>
            </div>

            {step.choices ? (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {step.choices.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => choose(choice)}
                    className="rounded-full border border-warm px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-charcoal transition-colors hover:border-coral hover:bg-[color:color-mix(in_oklab,var(--coral)_10%,transparent)] hover:text-coral"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-1.5 flex items-start gap-2">
                <span className="mt-[2px] flex-none text-coral">$</span>
                <div className="relative min-w-0 flex-1">
                  <textarea
                    ref={inputRef}
                    value={draft}
                    rows={1}
                    autoComplete="off"
                    spellCheck={step.multiline}
                    onChange={(event) => {
                      setDraft(event.target.value);
                      if (error) setError(null);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder={step.placeholder}
                    aria-label={step.hint}
                    className="w-full resize-none overflow-hidden border-0 bg-transparent p-0 font-mono text-[12.5px] leading-relaxed text-ink caret-coral outline-none placeholder:text-muted-warm/40 md:text-[13px]"
                  />
                </div>
              </div>
            )}

            <AnimatePresence>
              {error ? (
                <motion.p
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 pl-4 text-[11px] text-coral"
                >
                  ! {error}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        ) : (
          /* Everything answered — show the summary and the send button. */
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-xl border border-warm bg-[color:color-mix(in_oklab,var(--ink)_4%,transparent)] p-4"
          >
            <p className="text-[11px] uppercase tracking-widest text-muted-warm">Ready to send</p>
            <pre className="mt-2.5 whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-charcoal">
              {fieldsToTranscript(fields)}
            </pre>
            <button
              type="button"
              onClick={restart}
              className="mt-2 text-[11px] text-muted-warm underline decoration-muted-warm/40 underline-offset-2 transition-colors hover:text-coral"
            >
              start over
            </button>
          </motion.div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-warm px-4 py-3 md:px-5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-warm">
          {done ? "all set" : `step ${stepIndex + 1} of ${STEPS.length}`}
        </span>

        {!done && !step.choices ? (
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-warm/70 sm:block">
            enter to continue
            {stepIndex > 0 ? " · backspace to go back" : ""}
          </span>
        ) : null}

        <div className="ml-auto flex flex-wrap items-center gap-3">
          {status === "sent" ? (
            <span className="font-mono text-[10px] uppercase tracking-widest text-coral">
              Sent — I'll get back to you
            </span>
          ) : null}
          {status === "error" ? (
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-warm">
              Didn't send —{" "}
              <a href={`mailto:${email}`} className="text-coral underline">
                email me
              </a>
            </span>
          ) : null}

          <button
            type="submit"
            disabled={!done || status === "sending"}
            className="group inline-flex items-center gap-2.5 rounded-full bg-coral px-6 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--primary-foreground)] transition-all glow-coral disabled:pointer-events-none disabled:opacity-35"
          >
            {status === "sending" ? "Sending" : status === "sent" ? "Sent" : "Send it"}
            <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
          </button>
        </div>
      </div>
    </motion.form>
  );
}
