import { useMemo } from "react";
import { AmbientBackground } from "@/components/portfolio/AmbientBackground";
import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { GrainOverlay } from "@/components/portfolio/GrainOverlay";
import { IntroLoader } from "@/components/portfolio/IntroLoader";
import { NewspaperTexture } from "@/components/portfolio/NewspaperTexture";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";
import { SmoothScroll } from "@/components/portfolio/SmoothScroll";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Experience } from "@/components/portfolio/Experience";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { NotFoundPage } from "@/components/portfolio/NotFoundPage";

function getHomeHref() {
  if (typeof window === "undefined") return "/";

  const { hostname, pathname } = window.location;
  const isGithubPages = /\.github\.io$/i.test(hostname);
  if (!isGithubPages) {
    return "/";
  }

  const parts = pathname.split("/").filter(Boolean);
  return parts.length ? `/${parts[0]}/` : "/";
}

function resolveMissingPath() {
  if (typeof window === "undefined") return null;

  const { hostname, pathname, search, hash } = window.location;
  const params = new URLSearchParams(search);
  const redirectedPath = params.get("notfound") || sessionStorage.getItem("portfolio:not-found-path");
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

  if (redirectedPath) {
    sessionStorage.removeItem("portfolio:not-found-path");
    if (params.has("notfound")) {
      params.delete("notfound");
      const nextSearch = params.toString();
      window.history.replaceState({}, "", `${pathname}${nextSearch ? `?${nextSearch}` : ""}${hash}`);
    }
    return redirectedPath;
  }

  if (isLocalhost && pathname !== "/" && pathname !== "/index.html") {
    return pathname;
  }

  return null;
}

export default function App() {
  const missingPath = useMemo(() => resolveMissingPath(), []);
  const homeHref = useMemo(() => getHomeHref(), []);

  if (missingPath) {
    return <NotFoundPage homeHref={homeHref} />;
  }

  return (
    <SmoothScroll>
      <div className="relative isolate bg-parchment text-ink">
        <IntroLoader />
        <ScrollProgress />
        <NewspaperTexture />
        <AmbientBackground />
        <GrainOverlay />
        <CustomCursor />
        <Navbar />
        <div className="relative z-10">
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
          </main>
          <Footer />
        </div>
        <BackToTopButton />
      </div>
    </SmoothScroll>
  );
}
