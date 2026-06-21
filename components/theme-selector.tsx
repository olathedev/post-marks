import { ThemeThumbnail } from "./theme-thumbnails";

export type Theme = {
  id: string;
  name: string;
  font: string;
  textColor: string;
  cardBg: string;
  cardBorder: string;
  titleFont: string;
  titleColor: string;
  titleWeight: string;
  titleSize: string;
  titleTracking: string;
  titleTransform: string;
  subtitleColor: string;
};

export const themes: Theme[] = [
  { id: "solid", name: "Solid", font: "var(--font-dm-sans)", textColor: "#e4e4e7", cardBg: "rgba(39,39,42,0.9)", cardBorder: "rgba(63,63,70,0.5)",
    titleFont: "var(--font-dm-sans)", titleColor: "#ffffff", titleWeight: "700", titleSize: "1.5rem", titleTracking: "0", titleTransform: "none", subtitleColor: "rgba(255,255,255,0.5)" },
  { id: "midnight", name: "Midnight", font: "var(--font-playfair)", textColor: "#e2e8f0", cardBg: "rgba(30,41,59,0.7)", cardBorder: "rgba(100,116,139,0.3)",
    titleFont: "var(--font-playfair)", titleColor: "#fde68a", titleWeight: "600", titleSize: "1.75rem", titleTracking: "0.02em", titleTransform: "none", subtitleColor: "rgba(226,232,240,0.5)" },
  { id: "aurora", name: "Aurora", font: "var(--font-quicksand)", textColor: "#d1fae5", cardBg: "rgba(26,22,64,0.6)", cardBorder: "rgba(74,222,128,0.2)",
    titleFont: "var(--font-quicksand)", titleColor: "#4ade80", titleWeight: "700", titleSize: "1.5rem", titleTracking: "0.05em", titleTransform: "none", subtitleColor: "rgba(209,250,229,0.4)" },
  { id: "noir", name: "Noir", font: "var(--font-space-mono)", textColor: "#a1a1aa", cardBg: "rgba(24,24,27,0.8)", cardBorder: "rgba(63,63,70,0.5)",
    titleFont: "var(--font-space-mono)", titleColor: "#ffffff", titleWeight: "700", titleSize: "1.25rem", titleTracking: "0.15em", titleTransform: "uppercase", subtitleColor: "rgba(161,161,170,0.5)" },
  { id: "deepsea", name: "Deep Sea", font: "var(--font-quicksand)", textColor: "#99f6e4", cardBg: "rgba(6,78,59,0.5)", cardBorder: "rgba(45,212,191,0.2)",
    titleFont: "var(--font-quicksand)", titleColor: "#5eead4", titleWeight: "700", titleSize: "1.5rem", titleTracking: "0.03em", titleTransform: "none", subtitleColor: "rgba(153,246,228,0.4)" },
  { id: "ember", name: "Ember", font: "var(--font-playfair)", textColor: "#fef3c7", cardBg: "rgba(28,16,7,0.7)", cardBorder: "rgba(249,115,22,0.25)",
    titleFont: "var(--font-playfair)", titleColor: "#fbbf24", titleWeight: "600", titleSize: "1.75rem", titleTracking: "0.02em", titleTransform: "none", subtitleColor: "rgba(254,243,199,0.4)" },
  { id: "autumn", name: "Autumn", font: "var(--font-caveat)", textColor: "#451a03", cardBg: "rgba(254,243,199,0.8)", cardBorder: "rgba(249,115,22,0.3)",
    titleFont: "var(--font-caveat)", titleColor: "#92400e", titleWeight: "700", titleSize: "2rem", titleTracking: "0", titleTransform: "none", subtitleColor: "rgba(120,53,15,0.5)" },
  { id: "spring", name: "Spring", font: "var(--font-caveat)", textColor: "#166534", cardBg: "rgba(255,255,255,0.8)", cardBorder: "rgba(249,168,212,0.4)",
    titleFont: "var(--font-caveat)", titleColor: "#166534", titleWeight: "700", titleSize: "2rem", titleTracking: "0", titleTransform: "none", subtitleColor: "rgba(22,101,52,0.45)" },
  { id: "summer", name: "Summer", font: "var(--font-quicksand)", textColor: "#1e3a5f", cardBg: "rgba(255,255,255,0.75)", cardBorder: "rgba(56,189,248,0.3)",
    titleFont: "var(--font-quicksand)", titleColor: "#0c4a6e", titleWeight: "700", titleSize: "1.5rem", titleTracking: "0.03em", titleTransform: "none", subtitleColor: "rgba(12,74,110,0.45)" },
  { id: "winter", name: "Winter", font: "var(--font-playfair)", textColor: "#1e3a5f", cardBg: "rgba(255,255,255,0.85)", cardBorder: "rgba(147,197,253,0.4)",
    titleFont: "var(--font-playfair)", titleColor: "#1e3a5f", titleWeight: "600", titleSize: "1.75rem", titleTracking: "0.02em", titleTransform: "none", subtitleColor: "rgba(30,58,95,0.4)" },
  { id: "lavender", name: "Lavender", font: "var(--font-caveat)", textColor: "#581c87", cardBg: "rgba(255,255,255,0.8)", cardBorder: "rgba(192,132,252,0.3)",
    titleFont: "var(--font-caveat)", titleColor: "#7c3aed", titleWeight: "700", titleSize: "2rem", titleTracking: "0", titleTransform: "none", subtitleColor: "rgba(124,58,237,0.4)" },
];

export function ThemeSelector({
  selected,
  onSelect,
}: {
  selected: Theme;
  onSelect: (theme: Theme) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelect(theme)}
          className={`group flex flex-col items-center gap-2 transition-opacity ${
            selected.id === theme.id ? "opacity-100" : "opacity-50 hover:opacity-75"
          }`}
        >
          <div
            className={`size-16 rounded-2xl border-2 overflow-hidden transition-colors ${
              selected.id === theme.id
                ? "border-pink-500 shadow-md"
                : "border-transparent"
            }`}
          >
            <ThemeThumbnail id={theme.id} />
          </div>
          <span
            className={`text-xs ${
              selected.id === theme.id
                ? "text-gray-800 font-medium"
                : "text-gray-400"
            }`}
          >
            {theme.name}
          </span>
        </button>
      ))}
    </div>
  );
}
