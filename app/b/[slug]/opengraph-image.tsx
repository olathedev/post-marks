import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const alt = "PostMarks Board";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const themeBackgrounds: Record<string, { bg: string; accent: string }> = {
  solid: { bg: "#18181b", accent: "#ffffff" },
  midnight: { bg: "#0f172a", accent: "#fde68a" },
  aurora: { bg: "#0c0a20", accent: "#4ade80" },
  noir: { bg: "#09090b", accent: "#ffffff" },
  deepsea: { bg: "#042f2e", accent: "#5eead4" },
  ember: { bg: "#1c1007", accent: "#fbbf24" },
  autumn: { bg: "#fef9ee", accent: "#92400e" },
  spring: { bg: "#f0fdf4", accent: "#166534" },
  summer: { bg: "#fef3c7", accent: "#0c4a6e" },
  winter: { bg: "#eff6ff", accent: "#1e3a5f" },
  lavender: { bg: "#faf5ff", accent: "#7c3aed" },
};

const noteColors = [
  "#a5f3fc", "#ffffff", "#fbcfe8", "#fed7aa",
  "#d9f99d", "#ddd6fe", "#bfdbfe", "#fef3c7",
];

function isDark(bg: string): boolean {
  const hex = bg.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: board } = await supabase
    .from("boards")
    .select("title, description, theme_id, color")
    .eq("slug", slug)
    .single();

  if (!board) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#18181b",
            color: "white",
            fontSize: 48,
          }}
        >
          Board not found
        </div>
      ),
      { ...size }
    );
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("content, author_name, color")
    .eq("board_id", (await supabase.from("boards").select("id").eq("slug", slug).single()).data?.id ?? "")
    .limit(6);

  const theme = themeBackgrounds[board.theme_id] || themeBackgrounds.solid;
  const bg = board.theme_id === "solid" ? board.color : theme.bg;
  const accent = theme.accent;
  const dark = isDark(bg);
  const subtitleColor = dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";

  const scatteredNotes = (messages ?? []).map((msg, i) => {
    const positions = [
      { x: 60, y: 320, rot: -5 },
      { x: 220, y: 340, rot: 3 },
      { x: 400, y: 310, rot: -2 },
      { x: 600, y: 330, rot: 4 },
      { x: 800, y: 315, rot: -4 },
      { x: 980, y: 340, rot: 2 },
    ];
    const pos = positions[i] || positions[0];
    return { ...msg, ...pos };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: bg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient orbs for depth */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"} 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "15%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"} 0%, transparent 70%)`,
          }}
        />

        {/* Top — branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "40px 50px 0",
            color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
            fontSize: 16,
          }}
        >
          PostMarks
        </div>

        {/* Center — title + description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "30px 60px",
            textAlign: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: accent,
              lineHeight: 1.1,
              display: "flex",
              maxWidth: 900,
            }}
          >
            {board.title}
          </div>
          {board.description && (
            <div
              style={{
                fontSize: 22,
                color: subtitleColor,
                marginTop: 16,
                display: "flex",
                maxWidth: 700,
                lineHeight: 1.4,
              }}
            >
              {board.description}
            </div>
          )}
        </div>

        {/* Bottom — scattered note previews */}
        {scatteredNotes.length > 0 && (
          <div style={{ position: "relative", height: 200, display: "flex" }}>
            {scatteredNotes.map((note, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: note.x,
                  top: note.y - 300,
                  width: 155,
                  minHeight: 100,
                  backgroundColor: note.color || noteColors[i % noteColors.length],
                  transform: `rotate(${note.rot}deg)`,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#374151",
                    lineHeight: 1.4,
                    display: "flex",
                    overflow: "hidden",
                    maxHeight: 56,
                  }}
                >
                  {note.content || "✏️"}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#9ca3af",
                    marginTop: 8,
                    display: "flex",
                  }}
                >
                  {note.author_name}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom right — message count */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            right: 50,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)",
          }}
        >
          Leave a message →
        </div>
      </div>
    ),
    { ...size }
  );
}
