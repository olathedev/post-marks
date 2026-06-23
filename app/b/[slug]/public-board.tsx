"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, TextAa, Scribble, X, Lock, Sparkle, ArrowBendLeftDown } from "@phosphor-icons/react";
import Link from "next/link";
import { ThemePreview } from "@/components/theme-previews";
import { themes, type Theme } from "@/components/theme-selector";
import { DrawingCanvas, StrokeRenderer, type Stroke } from "@/components/drawing-canvas";
import { MessageCanvas } from "@/components/message-canvas";
import { useMessages, useCreateMessage } from "@/hooks/use-messages";
import { toast } from "sonner";
import { VisitorTour } from "@/components/visitor-tour";
import { CardShare } from "@/components/card-share";
import type { Board, Message } from "@/lib/types";
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

export function PublicBoard({
  board,
  creator,
  canViewMessages,
}: {
  board: Board;
  creator: Creator;
  canViewMessages: boolean;
}) {
  const theme = getTheme(board.theme_id);
  const { data: messages, isLoading } = useMessages(board.id, canViewMessages);
  const createMessage = useCreateMessage(board.id);

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"text" | "draw">("text");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [drawingStrokes, setDrawingStrokes] = useState<Stroke[]>([]);
  const [selectedColor, setSelectedColor] = useState(noteColors[0]);
  const [shareCard, setShareCard] = useState<Message | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);

  const isSolid = board.theme_id === "solid";
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleClose = useCallback(() => {
    setShowForm(false);
    setMode("text");
    setDrawingStrokes([]);
    setReplyTo(null);
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
        parent_id: replyTo?.id,
      },
      {
        onSuccess: () => {
          toast.success(replyTo ? "Reply posted!" : "Message posted!");
          setContent("");
          setName("");
          setDrawingStrokes([]);
          setMode("text");
          setShowForm(false);
          setReplyTo(null);
        },
        onError: () => {
          toast.error("Failed to post message");
        },
      }
    );
  }, [content, name, selectedColor, board.id, createMessage, mode, drawingStrokes, replyTo]);

  useEffect(() => {
    if (!showForm) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showForm, handleClose, handleSubmit]);

  const handleReplyTo = useCallback((msg: Message) => {
    setReplyTo(msg);
    setShowForm(true);
  }, []);

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

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="flex flex-1 flex-col md:hidden">
        {/* Mobile header — floating overlay */}
        <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex justify-center px-5 pt-5">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur-md">
            {creator.avatar_url ? (
              <Image src={creator.avatar_url} alt={creator.name} width={18} height={18} className="shrink-0 rounded-full" />
            ) : (
              <div className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-white/20 text-[8px] font-semibold" style={{ color: theme.titleColor }}>
                {creator.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1
              className="truncate text-sm"
              style={{
                fontFamily: theme.titleFont,
                color: theme.titleColor,
                fontWeight: theme.titleWeight,
                letterSpacing: theme.titleTracking,
                textTransform: theme.titleTransform as "none" | "uppercase",
              }}
            >
              {board.title}
            </h1>
          </div>
        </header>

        {/* Mobile CTA */}
        <div className="pointer-events-none fixed inset-x-0 top-14 z-20 flex justify-center">
          <Link
            href="/boards/new"
            className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-medium text-gray-700 shadow-sm backdrop-blur-md transition-colors active:bg-white"
          >
            <Sparkle size={12} weight="fill" className="text-pink-500" />
            Create your own board
          </Link>
        </div>

        {/* Mobile messages — canvas */}
        {!canViewMessages ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <Lock size={28} style={{ color: theme.subtitleColor }} className="mb-2 opacity-60" />
            <p className="text-sm font-medium" style={{ color: theme.subtitleColor }}>
              Messages are private
            </p>
            <p className="mt-1 text-xs opacity-60" style={{ color: theme.subtitleColor }}>
              Only the board creator can view messages
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          </div>
        ) : messages && messages.length > 0 ? (
          <MessageCanvas messages={messages} font={board.font} onCardClick={setShareCard} onReplyTo={handleReplyTo} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="text-sm" style={{ color: theme.subtitleColor }}>
              No messages yet — be the first!
            </p>
          </div>
        )}

        {/* Mobile FAB */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="fixed bottom-5 right-5 z-30 flex size-12 items-center justify-center rounded-full bg-black text-white shadow-lg active:scale-95"
          >
            <Plus size={22} weight="bold" />
          </button>
        )}

        {/* Mobile compose — bottom sheet */}
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-300 ${
            showForm ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
          <div
            className={`absolute bottom-0 left-0 right-0 flex max-h-[92vh] flex-col rounded-t-3xl bg-white transition-transform duration-500 ease-out ${
              showForm ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {/* Handle */}
            <div className="flex flex-col items-center px-5 pt-3 pb-1">
              <div className="mb-2 h-1 w-10 rounded-full bg-gray-200" />
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  {replyTo ? "Stick to card" : "Leave a message"}
                </span>
                <button onClick={handleClose} className="rounded-full cursor-pointer bg-gray-100 p-1.5 text-gray-500">
                  <X size={14} weight="bold" />
                </button>
              </div>
              {replyTo && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                  <ArrowBendLeftDown size={14} className="shrink-0 text-gray-400" />
                  <p className="truncate text-xs text-gray-500">
                    Replying to <span className="font-medium text-gray-700">{replyTo.author_name}</span>: {replyTo.content}
                  </p>
                  <button onClick={() => setReplyTo(null)} className="shrink-0 text-gray-400 hover:text-gray-600">
                    <X size={12} weight="bold" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-5 pt-3">
              {/* Mode toggle */}
              <div className="mb-4 flex items-center justify-center">
                <div className="flex items-center gap-0.5 rounded-full bg-gray-100 p-1">
                  <button
                    onClick={() => setMode("text")}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      mode === "text" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400"
                    }`}
                  >
                    <TextAa size={13} weight="bold" />
                    Text
                  </button>
                  <button
                    onClick={() => setMode("draw")}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      mode === "draw" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400"
                    }`}
                  >
                    <Scribble size={13} weight="bold" />
                    Doodle
                  </button>
                </div>
              </div>

              {/* Note preview card */}
              <div
                className="mb-4 flex flex-col p-4"
                style={{
                  backgroundColor: selectedColor,
                  fontFamily: board.font,
                  minHeight: mode === "draw" ? 220 : 140,
                }}
              >
                {mode === "text" ? (
                  <textarea
                    value={content}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) setContent(e.target.value);
                    }}
                    placeholder="Type your message..."
                    rows={4}
                    autoFocus
                    className="flex-1 resize-none bg-transparent text-base leading-relaxed text-gray-800 outline-none placeholder:text-gray-400"
                    style={{ fontFamily: board.font }}
                    maxLength={500}
                  />
                ) : (
                  <div className="-mx-4 flex-1">
                    <DrawingCanvas
                      strokes={drawingStrokes}
                      onDrawingChange={setDrawingStrokes}
                      strokeColor="#1e293b"
                      height={200}
                    />
                  </div>
                )}
                <p className="mt-auto pt-2 text-[10px] text-gray-400">
                  {name || "Anonymous"}
                </p>
              </div>

              {/* Color picker */}
              <div className="mb-4 flex items-center gap-2">
                {noteColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`size-6 rounded-full border-2 transition-transform ${
                      selectedColor === c ? "border-gray-800 scale-110" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Name */}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="mb-4 w-full border-b border-gray-200 bg-transparent py-2.5 text-base text-gray-900 outline-none placeholder:text-gray-300"
              />

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={
                  (mode === "text" ? !content.trim() : drawingStrokes.length === 0) ||
                  createMessage.isPending
                }
                className="w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {createMessage.isPending ? "Posting..." : "Post Message"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden md:flex md:flex-1 md:flex-col">
        {/* Description bar */}
        {board.description && (
          <div className="fixed left-6 top-6 z-30 max-w-sm">
            <p className="text-sm leading-relaxed text-white/60">
              &gt; {board.description}
            </p>
          </div>
        )}

        {/* Canvas messages */}
        {!canViewMessages ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <Lock size={36} style={{ color: theme.subtitleColor }} className="mb-3 opacity-60" />
            <p className="text-base font-medium" style={{ color: theme.subtitleColor }}>
              Messages are private
            </p>
            <p className="mt-1 text-sm opacity-60" style={{ color: theme.subtitleColor }}>
              Only the board creator can view messages
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          </div>
        ) : messages && messages.length > 0 ? (
          <MessageCanvas messages={messages} font={board.font} onCardClick={setShareCard} onReplyTo={handleReplyTo} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="text-sm" style={{ color: theme.subtitleColor }}>
              No messages yet — be the first to leave one!
            </p>
          </div>
        )}

        {/* Creator pill + CTA */}
        <div className="fixed bottom-6 left-6 z-30 flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-md backdrop-blur-md">
            {creator.avatar_url ? (
              <Image src={creator.avatar_url} alt={creator.name} width={22} height={22} className="rounded-full" />
            ) : (
              <div className="flex size-[22px] items-center justify-center rounded-full bg-pink-100 text-[10px] font-semibold text-pink-600">
                {creator.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-medium text-gray-700">by {creator.name}</span>
          </div>
          <Link
            href="/boards/new"
            className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 shadow-md backdrop-blur-md text-xs font-medium text-gray-700 transition-colors hover:bg-white"
          >
            <Sparkle size={13} weight="fill" className="text-pink-500" />
            Create yours
          </Link>
        </div>

        {/* Desktop FAB */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 z-30 flex size-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Plus size={24} weight="bold" />
          </button>
        )}

        {/* Desktop full-screen compose */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex flex-col">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />

            {/* Top bar */}
            <div className="relative z-10 flex items-start justify-between px-8 pt-8">
              <div className="max-w-sm">
                {board.description && (
                  <p className="text-sm leading-relaxed text-white/60">
                    &gt; {board.description}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 backdrop-blur-md">
                  {noteColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`size-6 rounded-full border-2 transition-all hover:scale-110 ${
                        selectedColor === c ? "border-white scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="pr-1 text-xs text-white/40">Sticky Note</span>
              </div>
            </div>

            {/* Centered card */}
            <div className="relative z-10 flex flex-1 items-center justify-center px-8">
              <div className="flex w-full max-w-md flex-col items-center">
                <div className="mb-3 flex items-center gap-0.5 rounded-full bg-white/10 p-1 backdrop-blur-md">
                  <button
                    onClick={() => setMode("text")}
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      mode === "text" ? "bg-white/90 text-gray-800" : "text-white/50 hover:text-white/70"
                    }`}
                  >
                    <TextAa size={13} weight="bold" />
                    Text
                  </button>
                  <button
                    onClick={() => setMode("draw")}
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      mode === "draw" ? "bg-white/90 text-gray-800" : "text-white/50 hover:text-white/70"
                    }`}
                  >
                    <Scribble size={13} weight="bold" />
                    Doodle
                  </button>
                </div>

                <div
                  className="flex w-full flex-col p-8 shadow-2xl"
                  style={{
                    backgroundColor: selectedColor,
                    fontFamily: board.font,
                    minHeight: 320,
                  }}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-medium text-gray-800">{board.title}</h3>
                    {replyTo && (
                      <div className="mt-2 flex items-center gap-2">
                        <ArrowBendLeftDown size={14} className="shrink-0 text-gray-400" />
                        <p className="truncate text-sm text-gray-500">
                          Sticking to <span className="font-medium text-gray-700">{replyTo.author_name}</span>&apos;s card
                        </p>
                        <button onClick={() => setReplyTo(null)} className="shrink-0 text-gray-400 hover:text-gray-600">
                          <X size={12} weight="bold" />
                        </button>
                      </div>
                    )}
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
                      className="flex-1 resize-none bg-transparent text-lg leading-relaxed text-gray-800 outline-none placeholder:text-gray-400"
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
              <button onClick={handleClose} className="text-lg font-medium text-white/70 hover:text-white">
                Close <span className="text-white/40">[esc]</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  (mode === "text" ? !content.trim() : drawingStrokes.length === 0) ||
                  createMessage.isPending
                }
                className="text-lg font-medium text-white/70 hover:text-white disabled:text-white/30"
              >
                {createMessage.isPending ? "Posting..." : "Submit"}{" "}
                <span className="text-white/40">↵</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <VisitorTour boardSlug={board.slug} />

      {shareCard && (
        <CardShare
          message={shareCard}
          font={board.font}
          siteUrl={siteUrl}
          onClose={() => setShareCard(null)}
        />
      )}
    </div>
  );
}
