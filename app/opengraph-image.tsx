import { ImageResponse } from "next/og";

export const alt = "PostMarks — Words as Memories";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)",
          position: "relative",
        }}
      >
        {/* Shader-like gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,146,60,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            right: "15%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "30%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(219,39,119,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Scattered sticky notes */}
        {[
          { x: 80, y: 60, rot: -6, color: "#a5f3fc", w: 120, h: 100 },
          { x: 950, y: 80, rot: 4, color: "#fbcfe8", w: 130, h: 110 },
          { x: 150, y: 420, rot: 3, color: "#fed7aa", w: 110, h: 95 },
          { x: 900, y: 400, rot: -5, color: "#ddd6fe", w: 125, h: 105 },
          { x: 60, y: 250, rot: 5, color: "#d9f99d", w: 100, h: 85 },
          { x: 1020, y: 250, rot: -3, color: "#bfdbfe", w: 115, h: 95 },
        ].map((note, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: note.x,
              top: note.y,
              width: note.w,
              height: note.h,
              backgroundColor: note.color,
              transform: `rotate(${note.rot}deg)`,
              opacity: 0.6,
              display: "flex",
              padding: 12,
            }}
          >
            <div
              style={{
                width: "70%",
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(0,0,0,0.1)",
              }}
            />
          </div>
        ))}

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            PostMarks
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.5)",
              display: "flex",
            }}
          >
            Words as Memories
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "rgba(255,255,255,0.3)",
            fontSize: 16,
          }}
        >
          postmarks.app
        </div>
      </div>
    ),
    { ...size }
  );
}
