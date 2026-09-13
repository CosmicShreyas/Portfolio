import type { AboutContent } from "@/lib/markdown-content";

export const profile = {
  name: "Shreyas",
  alias: "CosmicShreyas",
  githubUsername: "CosmicShreyas",
  githubUrl: "https://github.com/CosmicShreyas",
  linkedinUrl: "https://linkedin.com/in/shreyasbrilliant",
  role: "FULL-STACK SOFTWARE ENGINEER",
  tagline:
    "Full-stack engineer focused on AI and machine learning, Node.js backend systems, and React and Angular front ends. Nine years of owning features end to end, from database schema to polished UI.",
  location: "BENGALURU, KARNATAKA - OPEN TO REMOTE",
  email: "brilliantshreyas@gmail.com",
};

/**
 * Bundled copy of about.md, used until the markdown fetch resolves and as the
 * fallback when it fails. Keep in sync with public/data/about.md.
 */
export const ABOUT_FALLBACK: AboutContent = {
  birthDate: "2006-05-02T00:00:00",
  shippingStartDate: "2017-01-01",
  githubProfile: "https://github.com/CosmicShreyas",
  linkedinProfile: "https://linkedin.com/in/shreyasbrilliant",
  email: "brilliantshreyas@gmail.com",
  phone: "+91 89715 24798",
  formEndpoint: "",
  location: "Bengaluru, Karnataka",
  showEmail: true,
  resumeLink: "/resume/resume.pdf",
  ageLabel: "YEARS YOUNG",
  shippingLabelMonths: "MONTHS SHIPPING",
  shippingLabelYears: "YEARS SHIPPING",
  repoLabel: "PROJECTS LIVE",
  paragraphs: [
    "Full-stack software engineer with 9+ years of hands-on experience, including independent and personal-project work before moving into formal engineering roles, and 5+ years of that spent on AI and machine learning architectures, including agentic development with Claude Code and Codex.",
    "I like owning a feature end to end, from the database schema all the way to a polished UI, and I'm just as comfortable leading a small team, mentoring other engineers, or wiring up a third-party API or payment system. Right now I'm building GlideProject, a B2B partner-management platform, at Vibgyor Interiors. My background also touches blockchain, DevOps, and cybersecurity.",
  ],
};
