"use client";

import { useState, useRef, useEffect } from "react";
import { Palette, TextAa, CaretDown } from "@phosphor-icons/react";

const fontOptions = [
  { label: "DM Sans", value: "var(--font-dm-sans)" },
  { label: "Playfair Display", value: "var(--font-playfair)" },
  { label: "Caveat", value: "var(--font-caveat)" },
  { label: "Space Mono", value: "var(--font-space-mono)" },
  { label: "Quicksand", value: "var(--font-quicksand)" },
];

const colorPresets = [
  "#18181b", "#ffffff", "#0f172a", "#1e1b4b",
  "#042f2e", "#1c1007", "#fef9ee", "#f0fdf4",
  "#fef3c7", "#eff6ff", "#faf5ff", "#fff1f2",
  "#db2777", "#7c3aed", "#0ea5e9", "#10b981",
];

function getFontLabel(fontVar: string) {
  return fontOptions.find((f) => f.value === fontVar)?.label ?? "DM Sans";
}

export function PreviewToolbar({
  color,
  onColorChange,
  font,
  onFontChange,
}: {
  color: string;
  onColorChange: (color: string) => void;
  font: string;
  onFontChange: (font: string) => void;
}) {
  const [showFonts, setShowFonts] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const fontRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (fontRef.current && !fontRef.current.contains(e.target as Node)) {
        setShowFonts(false);
      }
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setShowColors(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="absolute left-1/2 top-5 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md">
      {/* Color picker */}
      <div ref={colorRef} className="relative">
        <button
          onClick={() => { setShowColors(!showColors); setShowFonts(false); }}
          className="flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:bg-gray-100"
        >
          <div
            className="size-5 rounded-full border border-gray-200"
            style={{ backgroundColor: color }}
          />
          <Palette size={14} className="text-gray-400" />
        </button>

        {showColors && (
          <div className="absolute left-0 top-full mt-2 w-44 rounded-xl bg-white p-3 shadow-xl border border-gray-100">
            <div className="grid grid-cols-4 gap-2">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  onClick={() => { onColorChange(c); setShowColors(false); }}
                  className={`size-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c ? "border-pink-500" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
              <label className="text-xs text-gray-400">Custom</label>
              <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="h-6 w-full cursor-pointer rounded border-0 bg-transparent"
              />
            </div>
          </div>
        )}
      </div>

      <div className="h-5 w-px bg-gray-200" />

      {/* Font selector */}
      <div ref={fontRef} className="relative">
        <button
          onClick={() => { setShowFonts(!showFonts); setShowColors(false); }}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          <TextAa size={14} className="text-gray-400" />
          <span className="max-w-20 truncate">{getFontLabel(font)}</span>
          <CaretDown size={10} className="text-gray-400" />
        </button>

        {showFonts && (
          <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white py-1 shadow-xl border border-gray-100">
            {fontOptions.map((f) => (
              <button
                key={f.value}
                onClick={() => { onFontChange(f.value); setShowFonts(false); }}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
                  font === f.value ? "text-gray-900" : "text-gray-500"
                }`}
                style={{ fontFamily: f.value }}
              >
                {font === f.value && <span className="text-pink-500">✓</span>}
                <span className={font !== f.value ? "ml-5" : ""}>{f.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
