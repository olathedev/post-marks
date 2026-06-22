"use client";

import { useState, useRef, useCallback } from "react";
import { X, DownloadSimple, ShareNetwork } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { StrokeRenderer } from "./drawing-canvas";
import { toast } from "sonner";
import type { Message } from "@/lib/types";

type CardShareProps = {
  message: Message;
  font: string;
  siteUrl: string;
  onClose: () => void;
};

export function CardShare({ message, font, siteUrl, onClose }: CardShareProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);
  const hasDrawing = (message as Record<string, unknown>).drawing;

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const scale = 2;
    const pad = 32 * scale;
    const cardPad = 16 * scale;
    const cardW = 280 * scale;
    const fontSize = 13 * scale;
    const authorSize = 10 * scale;
    const lineHeight = Math.round(fontSize * 1.6);
    const brandingHeight = 48 * scale;

    // Measure text height to fit the card to content
    let contentHeight = 0;
    const textMaxW = cardW - cardPad * 2;

    if (hasDrawing) {
      contentHeight = 140 * scale;
    } else {
      ctx.font = `${fontSize}px ${font}, system-ui, sans-serif`;
      const text = message.content || "";
      const words = text.split(" ");
      let line = "";
      let lines = 0;
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > textMaxW && line) {
          lines++;
          line = word + " ";
        } else {
          line = test;
        }
      }
      if (line.trim()) lines++;
      contentHeight = Math.max(lines * lineHeight, lineHeight);
    }

    const authorGap = 16 * scale;
    const cardH = cardPad + contentHeight + authorGap + authorSize + cardPad;
    const w = cardW + pad * 2;
    const h = pad + cardH + brandingHeight + pad;
    canvas.width = w;
    canvas.height = h;

    // Dark background
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, w, h);

    // Subtle gradient orbs — scaled to fit
    const drawOrb = (x: number, y: number, r: number, color: string) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, color);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };
    drawOrb(w * 0.15, h * 0.1, w * 0.4, "rgba(251,146,60,0.15)");
    drawOrb(w * 0.85, h * 0.35, w * 0.35, "rgba(168,85,247,0.12)");
    drawOrb(w * 0.5, h * 0.85, w * 0.4, "rgba(219,39,119,0.1)");

    // Sticky note card
    const cardX = pad;
    const cardY = pad;

    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = message.color || "#ffffff";
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Message content
    if (hasDrawing) {
      const strokes = JSON.parse(hasDrawing as string);
      let svgPaths = "";
      for (const stroke of strokes) {
        if (stroke.points.length < 2) continue;
        let d = `M${stroke.points[0][0]},${stroke.points[0][1]}`;
        for (let j = 1; j < stroke.points.length; j++) {
          const prev = stroke.points[j - 1];
          const curr = stroke.points[j];
          const mid = [(prev[0] + curr[0]) / 2, (prev[1] + curr[1]) / 2];
          d += ` Q${prev[0]},${prev[1]} ${mid[0]},${mid[1]}`;
        }
        svgPaths += `<path d="${d}" stroke="${stroke.color}" stroke-width="${stroke.width}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      const drawW = textMaxW;
      const drawH = contentHeight;
      const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="${drawW}" height="${drawH}">${svgPaths}</svg>`;
      const img = new window.Image();
      const blob = new Blob([svgStr], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      await new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, cardX + cardPad, cardY + cardPad, drawW, drawH);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        img.src = url;
      });
    } else {
      ctx.fillStyle = "#1f2937";
      ctx.font = `${fontSize}px ${font}, system-ui, sans-serif`;
      ctx.textBaseline = "top";

      const text = message.content || "";
      const words = text.split(" ");
      let line = "";
      let y = cardY + cardPad;

      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > textMaxW && line) {
          ctx.fillText(line.trim(), cardX + cardPad, y);
          line = word + " ";
          y += lineHeight;
        } else {
          line = test;
        }
      }
      if (line.trim()) {
        ctx.fillText(line.trim(), cardX + cardPad, y);
      }
    }

    // Author name at bottom of card
    ctx.fillStyle = "#9ca3af";
    ctx.font = `${authorSize}px system-ui, sans-serif`;
    ctx.textBaseline = "bottom";
    ctx.fillText(message.author_name, cardX + cardPad, cardY + cardH - cardPad);

    // PostMarks branding
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = `bold ${11 * scale}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("PostMarks", w / 2, h - pad - 8 * scale);

    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = `${9 * scale}px system-ui, sans-serif`;
    ctx.fillText(siteUrl.replace(/^https?:\/\//, ""), w / 2, h - pad);

    return new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/png", 1);
    });
  }, [message, font, hasDrawing, siteUrl]);

  const handleDownload = async () => {
    setGenerating(true);
    const blob = await generateImage();
    setGenerating(false);
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `postmarks-${message.author_name.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Image downloaded!");
  };

  const handleShare = async () => {
    setGenerating(true);
    const blob = await generateImage();
    setGenerating(false);
    if (!blob) return;

    const file = new File([blob], "postmarks.png", { type: "image/png" });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "PostMarks",
        text: `A message from ${message.author_name}`,
        files: [file],
      });
    } else {
      handleDownload();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
          initial={{ y: 60, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {/* Shader top */}
          <div className="relative h-16 overflow-hidden bg-white">
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background: `
                  radial-gradient(circle at 15% 5%, rgba(251, 146, 60, 0.35) 0%, transparent 45%),
                  radial-gradient(circle at 85% 25%, rgba(219, 39, 119, 0.3) 0%, transparent 45%),
                  radial-gradient(circle at 40% 95%, rgba(168, 85, 247, 0.25) 0%, transparent 45%)
                `,
              }}
            />
            <div
              className="absolute inset-[-20px] animate-[shader-breathe_4s_ease-in-out_infinite]"
              style={{
                background: `
                  radial-gradient(circle at 60% 40%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
                  radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)
                `,
                filter: "blur(25px)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white to-transparent" />
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/50 p-1.5 text-gray-500 backdrop-blur-sm hover:bg-white/70"
            >
              <X size={14} weight="bold" />
            </button>
          </div>

          <div className="px-5 pb-5">
            {/* Preview card */}
            <div
              className="mx-auto mb-4 flex max-w-[240px] flex-col p-4 shadow-sm"
              style={{
                backgroundColor: message.color || "#ffffff",
                fontFamily: font,
                minHeight: 120,
              }}
            >
              {hasDrawing ? (
                <StrokeRenderer
                  strokes={JSON.parse(hasDrawing as string)}
                  className="w-full"
                />
              ) : (
                <p className="text-[13px] leading-relaxed text-gray-800 line-clamp-5">
                  {message.content}
                </p>
              )}
              <p className="mt-auto pt-2 text-[10px] text-gray-400">
                {message.author_name}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={generating}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                <DownloadSimple size={16} />
                Download
              </button>
              <button
                onClick={handleShare}
                disabled={generating}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900 disabled:opacity-50"
              >
                <ShareNetwork size={16} />
                Share
              </button>
            </div>
          </div>

          {/* Hidden canvas for image generation */}
          <canvas ref={canvasRef} className="hidden" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
