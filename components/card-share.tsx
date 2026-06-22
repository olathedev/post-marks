"use client";

import { useState, useRef, useCallback } from "react";
import { X, DownloadSimple, ShareNetwork } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { StrokeRenderer } from "./drawing-canvas";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import type { Message } from "@/lib/types";

type CardShareProps = {
  message: Message;
  font: string;
  siteUrl: string;
  onClose: () => void;
};

export function CardShare({ message, font, siteUrl, onClose }: CardShareProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const hasDrawing = (message as Record<string, unknown>).drawing;

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
      const res = await fetch(dataUrl);
      return await res.blob();
    } catch {
      return null;
    }
  }, []);

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
            {/* Capturable card */}
            <div ref={cardRef} className="mx-auto mb-4 rounded-sm bg-white">
              <div
                className="flex flex-col p-5"
                style={{
                  backgroundColor: message.color || "#ffffff",
                  fontFamily: font,
                  minHeight: 140,
                }}
              >
                {hasDrawing ? (
                  <StrokeRenderer
                    strokes={JSON.parse(hasDrawing as string)}
                    className="w-full"
                  />
                ) : (
                  <p className="break-words text-sm leading-relaxed text-gray-800">
                    {message.content}
                  </p>
                )}
                <p className="mt-auto pt-3 text-[11px] text-gray-400">
                  {message.author_name}
                </p>
              </div>
              <div className="flex items-center justify-center gap-1.5 bg-zinc-900 px-4 py-2">
                <span className="text-[10px] font-medium text-white/50">PostMarks</span>
                <span className="text-[10px] text-white/30">·</span>
                <span className="text-[10px] text-white/30">
                  {siteUrl.replace(/^https?:\/\//, "")}
                </span>
              </div>
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
