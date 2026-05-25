import type { CSSProperties } from "react";

const dotPatternSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='rgba(60,40,20,0.07)'/%3E%3C/svg%3E";

const darkDotPatternSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='rgba(220,200,170,0.04)'/%3E%3C/svg%3E";

export function NewspaperTexture() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 newspaper-dot-layer"
        style={
          {
            "--paper-dot-light": `url("${dotPatternSvg}")`,
            "--paper-dot-dark": `url("${darkDotPatternSvg}")`,
          } as CSSProperties
        }
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 newspaper-line-layer" />
    </>
  );
}
