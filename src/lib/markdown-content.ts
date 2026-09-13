export type AboutContent = {
  birthDate: string;
  shippingStartDate: string;
  githubProfile: string;
  linkedinProfile: string;
  email: string;
  phone: string;
  location: string;
  formEndpoint: string;
  showEmail: boolean;
  resumeLink: string;
  ageLabel: string;
  shippingLabelMonths: string;
  shippingLabelYears: string;
  repoLabel: string;
  paragraphs: string[];
};

export type SkillsGroup = {
  category: string;
  subtitle: string;
  items: string[];
};

export type ProjectContent = {
  label: string;
  title: string;
  description: string;
  status: string;
  repo: string;
  live: string;
  stack: string[];
};

export type ExperienceEntry = {
  kind: "experience" | "education";
  role: string;
  company: string;
  dates: string;
  location: string;
  bullets: string[];
};

type FrontmatterResult = {
  attributes: Record<string, string>;
  body: string;
};

function parseFrontmatter(markdown: string): FrontmatterResult {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { attributes: {}, body: markdown.trim() };
  }

  const [, rawAttributes, rawBody] = match;
  const attributes: Record<string, string> = {};

  for (const line of rawAttributes.split(/\r?\n/)) {
    const trimmed = line.trim();
    // Blank lines and "#" comments are editor notes, not attributes.
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    attributes[key] = value;
  }

  return { attributes, body: rawBody.trim() };
}

function splitMarkdownSections(markdown: string) {
  return markdown
    .split(/^##\s+/m)
    .map((section) => section.trim())
    .filter(Boolean)
    .map((section) => {
      const [headingLine = "", ...rest] = section.split(/\r?\n/);
      return {
        heading: headingLine.trim(),
        content: rest.join("\n").trim(),
      };
    });
}

function parseField(lines: string[], fieldName: string) {
  const prefix = `${fieldName}:`;
  const line = lines.find((entry) => entry.startsWith(prefix));
  return line ? line.slice(prefix.length).trim() : "";
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return fallback;
}

function publicPath(filename: string) {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}data/${filename}`;
}

export function getMarkdownPath(filename: string) {
  return publicPath(filename);
}

export function parseAboutMarkdown(markdown: string): AboutContent {
  const { attributes, body } = parseFrontmatter(markdown);
  const paragraphs = body
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.replace(/\r?\n/g, " ").trim())
    .filter(Boolean);

  return {
    birthDate: attributes.birthDate ?? "2006-05-02T00:00:00",
    shippingStartDate: attributes.shippingStartDate ?? "2017-01-01",
    githubProfile: attributes.githubProfile ?? "https://github.com/CosmicShreyas",
    linkedinProfile: attributes.linkedinProfile ?? "https://linkedin.com/in/shreyasbrilliant",
    email: attributes.email ?? "brilliantshreyas@gmail.com",
    phone: attributes.phone ?? "",
    formEndpoint: attributes.formEndpoint ?? "",
    location: attributes.location ?? "Bengaluru, Karnataka",
    showEmail: parseBoolean(attributes.showEmail, true),
    resumeLink: attributes.resumeLink ?? "/resume/resume.pdf",
    ageLabel: attributes.ageLabel ?? "YEARS YOUNG",
    shippingLabelMonths: attributes.shippingLabelMonths ?? "MONTHS SHIPPING",
    shippingLabelYears: attributes.shippingLabelYears ?? "YEARS SHIPPING",
    repoLabel: attributes.repoLabel ?? "PROJECTS LIVE",
    paragraphs,
  };
}

export function parseSkillsMarkdown(markdown: string): SkillsGroup[] {
  return splitMarkdownSections(markdown).map(({ heading, content }) => {
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const [subtitle = ""] = lines;
    const items = lines.filter((line) => line.startsWith("- ")).map((line) => line.slice(2).trim());

    return {
      category: heading,
      subtitle,
      items,
    };
  });
}

export function parseProjectsMarkdown(markdown: string): ProjectContent[] {
  return splitMarkdownSections(markdown).map(({ heading, content }) => {
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const stackIndex = lines.findIndex((line) => line === "Stack:");
    const stack =
      stackIndex === -1
        ? []
        : lines
            .slice(stackIndex + 1)
            .filter((line) => line.startsWith("- "))
            .map((line) => line.slice(2).trim());

    return {
      label: heading,
      title: parseField(lines, "Title"),
      description: parseField(lines, "Description"),
      status: parseField(lines, "Status"),
      repo: parseField(lines, "Repo"),
      live: parseField(lines, "Live"),
      stack,
    };
  });
}

export function parseExperienceMarkdown(markdown: string): ExperienceEntry[] {
  return splitMarkdownSections(markdown).map(({ heading, content }) => {
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const kind = heading.toLowerCase().includes("education") ? "education" : "experience";
    const bullets = lines
      .filter((line) => line.startsWith("- "))
      .map((line) => line.slice(2).trim());

    return {
      kind,
      role: parseField(lines, "Role"),
      company: parseField(lines, "Company"),
      dates: parseField(lines, "Dates"),
      location: parseField(lines, "Location"),
      bullets,
    };
  });
}

/**
 * Resolves an asset path from the data files against Vite's base URL.
 * Absolute URLs (http/mailto) and empty values are returned untouched, so a
 * resumeLink can point either at a bundled file or an external host.
 */
export function resolveAssetPath(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "#") return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) || trimmed.startsWith("//")) return trimmed;

  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}${trimmed.replace(/^\/+/, "")}`;
}

export type CertificationGroup = {
  issuer: string;
  count: number;
  items: { name: string; issued: string }[];
};

export type CertificationsContent = {
  heading: string;
  blurb: string;
  groups: CertificationGroup[];
};

export type FiverrGig = {
  title: string;
  link: string;
  tone: "coral" | "gold" | "ink";
  tags: string[];
};

export type FiverrContent = {
  profileUrl: string;
  sellerLabel: string;
  headline: string;
  blurb: string;
  gigs: FiverrGig[];
};

/** Strips HTML comments so editor notes in the data files never render. */
function stripComments(markdown: string) {
  return markdown.replace(/<!--[\s\S]*?-->/g, "");
}

export function parseCertificationsMarkdown(markdown: string): CertificationsContent {
  const { attributes, body } = parseFrontmatter(markdown);

  const groups = splitMarkdownSections(stripComments(body))
    .map(({ heading, content }) => {
      const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      const items = lines
        .filter((line) => line.startsWith("- "))
        .map((line) => {
          const [name = "", issued = ""] = line.slice(2).split("|");
          return { name: name.trim(), issued: issued.trim() };
        })
        .filter((item) => item.name);

      const declaredCount = Number.parseInt(parseField(lines, "Count"), 10);

      return {
        issuer: heading,
        count: Number.isFinite(declaredCount) ? declaredCount : items.length,
        items,
      };
    })
    .filter((group) => group.items.length > 0);

  return {
    heading: attributes.heading ?? "Certifications",
    blurb: attributes.blurb ?? "",
    groups,
  };
}

export function parseFiverrMarkdown(markdown: string): FiverrContent {
  const { attributes, body } = parseFrontmatter(markdown);

  const gigs = splitMarkdownSections(stripComments(body))
    .map(({ content }) => {
      const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      const tone = parseField(lines, "Tone").toLowerCase();

      return {
        title: parseField(lines, "Title"),
        link: parseField(lines, "Link"),
        tone: (tone === "gold" || tone === "ink" ? tone : "coral") as FiverrGig["tone"],
        tags: lines
          .filter((line) => line.startsWith("- "))
          .map((line) => line.slice(2).trim())
          .filter(Boolean),
      };
    })
    .filter((gig) => gig.title && gig.link);

  return {
    profileUrl: attributes.profileUrl ?? "",
    sellerLabel: attributes.sellerLabel ?? "Fiverr Seller",
    headline: attributes.headline ?? "Available for freelance work",
    blurb: attributes.blurb ?? "",
    gigs,
  };
}
