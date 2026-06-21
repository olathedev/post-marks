"use client";

import { ThemePreview } from "./theme-previews";
import { PreviewToolbar } from "./preview-toolbar";
import { DraggableCards } from "./draggable-cards";
import type { Theme } from "./theme-selector";

export function BoardPreview({
  theme,
  font,
  color,
  title,
  description,
  onFontChange,
  onColorChange,
}: {
  theme: Theme;
  font: string;
  color: string;
  title: string;
  description: string;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
}) {
  const isSolid = theme.id === "solid";

  return (
    <div className="hidden w-[55%] shrink-0 p-4 lg:flex">
      <div className="relative flex-1 overflow-hidden rounded-3xl">
        {isSolid ? (
          <div className="size-full" style={{ backgroundColor: color }} />
        ) : (
          <ThemePreview id={theme.id} />
        )}

        <PreviewToolbar
          color={color}
          onColorChange={onColorChange}
          font={font}
          onFontChange={onFontChange}
        />

        {/* Board title header */}
        <div className="absolute left-0 right-0 top-16 z-20 px-8 py-4 text-center">
          <h2
            style={{
              fontFamily: theme.titleFont,
              color: theme.titleColor,
              fontWeight: theme.titleWeight,
              fontSize: theme.titleSize,
              letterSpacing: theme.titleTracking,
              textTransform: theme.titleTransform as "none" | "uppercase",
            }}
          >
            {title || "Your board title"}
          </h2>
          {(description || !title) && (
            <p
              className="mt-1.5 text-sm"
              style={{
                fontFamily: theme.titleFont,
                color: theme.subtitleColor,
              }}
            >
              {description || "A space for your community to leave messages"}
            </p>
          )}
        </div>

        <DraggableCards font={font} topOffset={130} />
      </div>
    </div>
  );
}
