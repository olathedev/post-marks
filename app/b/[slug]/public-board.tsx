"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, TextAa, Scribble } from "@phosphor-icons/react";
import { ThemePreview } from "@/components/theme-previews";
import { themes, type Theme } from "@/components/theme-selector";
import { DrawingCanvas, type Stroke } from "@/components/drawing-canvas";
import { MessageCanvas } from "@/components/message-canvas";
import { useMessages, useCreateMessage } from "@/hooks/use-messages";
import { toast } from "sonner";
import type { Board } from "@/lib/types";
import Image from "next/image";

const noteColors = [
  "#ddd6fe", "#e5e7eb", "#fbcfe8", "#a5f3fc",
  "#d9f99d", "#bfdbfe", "#c084fc", "#fda4af",
];

function getTheme(id: string): Theme {
  return themes.find((t) => t.id === id) || themes[0];
}

type Creator = {
  name: string;
  avatar_url: string | null;
};

export function PublicBoard({ board, creator }: { board: Board; creator: Creator }) {
  const theme = getTheme(board.theme_id);
  const { data: messages, isLoading } = useMessages(board.id);
  const createMessage = useCreateMessage(board.id);

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"text" | "draw">("text");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [drawingStrokes, setDrawingStrokes] = useState<Stroke[]>([]);
  const [selectedColor, setSelectedColor] = useState(noteColors[0]);

  const isSolid = board.theme_id === "solid";

  const handleClose = useCallback(() => {
    setShowForm(false);
    setMode("text");
    setDrawingStrokes([]);
  }, []);

  const handleSubmit = useCallback(() => {
    const hasContent = mode === "text" ? content.trim() : drawingStrokes.length > 0;
    if (!hasContent) return;
    createMessage.mutate(
      {
        board_id: board.id,
        author_name: name.trim() || "Anonymous",
        content: mode === "text" ? content.trim() : null,
        color: selectedColor,
        drawing: mode === "draw" ? JSON.stringify(drawingStrokes) : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Message posted!");
          setContent("");
          setName("");
          setDrawingStrokes([]);
          setMode("text");
          setShowForm(false);
        },
        onError: () => {
          toast.error("Failed to post message");
        },
      }
    );
  }, [content, name, selectedColor, board.id, createMessage, mode, drawingStrokes]);

  useEffect(() => {
    if (!showForm) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showForm, handleClose, handleSubmit]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Theme background */}
      <div className="fixed inset-0 -z-10">
        {isSolid ? (
          <div className="size-full" style={{ backgroundColor: board.color }} />
        ) : (
          <ThemePreview id={board.theme_id} />
        )}
      </div>

      {/* Description bar */}
      {board.description && (
        <div className="fixed left-6 top-6 z-30 max-w-sm">
          <p className="text-sm leading-relaxed text-white/60">
            &gt; {board.description}
          </p>
        </div>
      )}

      {/* Canvas messages */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
        </div>
      ) : messages && messages.length > 0 ? (
        <MessageCanvas messages={messages} font={board.font} />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center">
          <p className="text-sm" style={{ color: theme.subtitleColor }}>
            No messages yet — be the first to leave one!
          </p>
        </div>
      )}

      {/* Creator pill */}
      <div className="fixed bottom-6 left-6 z-30 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-md backdrop-blur-md">
        {creator.avatar_url ? (
          <Image
            src={creator.avatar_url}
            alt={creator.name}
            width={22}
            height={22}
            className="rounded-full"
          />
        ) : (
          <div className="flex size-[22px] items-center justify-center rounded-full bg-pink-100 text-[10px] font-semibold text-pink-600">
            {creator.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-xs font-medium text-gray-700">
          by {creator.name}
        </span>
      </div>

      {/* Floating action button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 z-30 flex size-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Plus size={24} weight="bold" />
        </button>
      )}

      {/* Full-screen compose */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Blurred background */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />

          {/* Top bar */}
          <div className="relative z-10 flex items-start justify-between px-8 pt-8">
            {/* Prompt / description */}
            <div className="max-w-sm">
              {board.description && (
                <p className="text-sm leading-relaxed text-white/60">
                  &gt; {board.description}
                </p>
              )}
            </div>

            {/* Color picker + mode toggle */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 backdrop-blur-md">
                {noteColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`size-6 rounded-full border-2 transition-all hover:scale-110 ${
                      selectedColor === c
                        ? "border-white scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <span className="pr-1 text-xs text-white/40">Sticky Note</span>
            </div>
          </div>

          {/* Centered note card — the input IS the note */}
          <div className="relative z-10 flex flex-1 items-center justify-center px-8">
            <div className="flex w-full max-w-md flex-col items-center">
              {/* Text / Doodle toggle */}
              <div className="mb-3 flex items-center gap-0.5 rounded-full bg-white/10 p-1 backdrop-blur-md">
                <button
                  onClick={() => setMode("text")}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    mode === "text"
                      ? "bg-white/90 text-gray-800"
                      : "text-white/50 hover:text-white/70"
                  }`}
                >
                  <TextAa size={13} weight="bold" />
                  Text
                </button>
                <button
                  onClick={() => setMode("draw")}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    mode === "draw"
                      ? "bg-white/90 text-gray-800"
                      : "text-white/50 hover:text-white/70"
                  }`}
                >
                  <Scribble size={13} weight="bold" />
                  Doodle
                </button>
              </div>

              {/* The card */}
              <div
                className="flex w-full flex-col p-8 shadow-2xl"
              style={{
                backgroundColor: selectedColor,
                fontFamily: board.font,
                minHeight: 320,
              }}
            >
              <div className="mb-4">
                <h3 className="text-xl font-medium text-gray-800">
                  {board.title}
                </h3>
              </div>

              {mode === "text" ? (
                <textarea
                  value={content}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) setContent(e.target.value);
                  }}
                  placeholder="Type your message here"
                  rows={6}
                  autoFocus
                  className="flex-1 resize-none bg-transparent leading-relaxed text-gray-800 outline-none text-lg placeholder:text-gray-400"
                  style={{ fontFamily: board.font }}
                  maxLength={500}
                />
              ) : (
                <div className="-mx-8 flex-1">
                  <DrawingCanvas
                    strokes={drawingStrokes}
                    onDrawingChange={setDrawingStrokes}
                    strokeColor="#1e293b"
                  />
                </div>
              )}

              <div className="mt-auto border-gray-800/10 pt-4">
                <p className="mb-1 text-xl font-medium text-gray-800">
                  What&apos;s your name? (Optional)
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name here"
                  className="w-full bg-transparent text-lg text-gray-800 outline-none placeholder:text-gray-400"
                  style={{ fontFamily: board.font }}
                />
              </div>
            </div>
          </div>
          </div>

          {/* Bottom bar */}
          <div className="relative z-10 flex items-center justify-between px-8 pb-8">
            <button
              onClick={handleClose}
              className="text-lg font-medium text-white/70 transition-colors hover:text-white"
            >
              Close{" "}
              <span className="text-white/40">[esc]</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={
                (mode === "text" ? !content.trim() : drawingStrokes.length === 0) ||
                createMessage.isPending
              }
              className="text-lg font-medium text-white/70 transition-colors hover:text-white disabled:text-white/30"
            >
              {createMessage.isPending ? "Posting..." : "Submit"}{" "}
              <span className="text-white/40">↵</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
