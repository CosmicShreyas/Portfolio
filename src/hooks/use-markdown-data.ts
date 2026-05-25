import { useEffect, useState } from "react";
import { getMarkdownPath } from "@/lib/markdown-content";

type State<T> = {
  data: T;
  loading: boolean;
  error: string | null;
};

export function useMarkdownData<T>(filename: string, parser: (markdown: string) => T, fallback: T) {
  const [state, setState] = useState<State<T>>({
    data: fallback,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      if (typeof window !== "undefined" && window.location.protocol === "file:") {
        setState({
          data: fallback,
          loading: false,
          error: "Markdown fetch is unavailable over file://; using bundled fallback data.",
        });
        return;
      }

      try {
        const response = await fetch(getMarkdownPath(filename), {
          signal: controller.signal,
          cache: "no-cache",
        });

        if (!response.ok) {
          throw new Error(`Failed to load ${filename}: ${response.status}`);
        }

        const markdown = await response.text();
        const parsed = parser(markdown);
        setState({
          data: parsed,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({
          data: fallback,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    load();

    return () => controller.abort();
  }, [filename, parser]);

  return state;
}
