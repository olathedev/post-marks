"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, X } from "@phosphor-icons/react";
import { ThemeSelector, themes } from "@/components/theme-selector";
import { VisibilitySelector } from "@/components/visibility-selector";
import { AudioSelector } from "@/components/audio-selector";
import { BoardPreview } from "@/components/board-preview";
import { ThemePreview } from "@/components/theme-previews";
import { useCreateBoard } from "@/hooks/use-boards";
import { toast } from "sonner";

export default function NewBoard() {
  const router = useRouter();
  const createBoard = useCreateBoard();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [font, setFont] = useState(themes[0].font);
  const [color, setColor] = useState("#18181b");
  const [visibility, setVisibility] = useState("public");
  const [showPreview, setShowPreview] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedTheme(themes[0]);
    setFont(themes[0].font);
    setColor("#18181b");
    setVisibility("public");
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    createBoard.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        theme_id: selectedTheme.id,
        font,
        color,
        visibility,
      },
      {
        onSuccess: (board) => {
          toast.success("Board created!");
          resetForm();
          router.push(`/boards/${board.id}`);
        },
        onError: () => {
          toast.error("Failed to create board. Please try again.");
        },
      }
    );
  };

  return (
    <div className="flex h-full bg-white">
      {/* Form */}
      <div className="w-full overflow-y-auto px-5 py-6 sm:px-12 sm:py-8 lg:w-[45%] lg:shrink-0">
        <h1 className="mb-1 text-xl font-semibold text-gray-900 sm:text-2xl">
          New board
        </h1>
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <p className="text-sm text-gray-400">
            Set up a space for your community to leave messages.
          </p>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-pink-600 lg:hidden"
          >
            <Eye size={16} />
            Preview
          </button>
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Board title
          </label>
          <div className="line-input-wrapper border-b border-gray-200">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Graduation Wishes 2025"
              className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-300"
            />
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Description
            <span className="ml-1 font-normal text-gray-300">optional</span>
          </label>
          <div className="line-input-wrapper border-b border-gray-200">
            <textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 300) setDescription(e.target.value);
              }}
              placeholder="What's this board for?"
              rows={3}
              className="w-full resize-none bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-300"
              maxLength={300}
            />
            <span className="block text-right text-xs text-gray-300">{description.length}/300</span>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Theme
          </label>
          <ThemeSelector selected={selectedTheme} onSelect={(t) => {
            setSelectedTheme(t);
            setFont(t.font);
          }} />
        </div>

        <div className="mb-6 sm:mb-8">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Visibility
          </label>
          <VisibilitySelector selected={visibility} onSelect={setVisibility} />
        </div>

        <div className="mb-8 sm:mb-10">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Audio
            <span className="ml-1 font-normal text-gray-300">optional</span>
          </label>
          <AudioSelector />
        </div>

        <button
          onClick={handleCreate}
          disabled={!title.trim() || createBoard.isPending}
          className="w-full rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-gray-900 active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createBoard.isPending ? "Creating..." : "Create Board"}
        </button>

        {/* Bottom spacing on mobile */}
        <div className="h-6 lg:hidden" />
      </div>

      {/* Preview — desktop only */}
      <BoardPreview
        theme={selectedTheme}
        font={font}
        color={color}
        title={title}
        description={description}
        onFontChange={setFont}
        onColorChange={setColor}
      />

      {/* Mobile preview overlay */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-medium text-white/60">Preview</span>
            <button
              onClick={() => setShowPreview(false)}
              className="rounded-full bg-white/10 p-1.5 text-white/70 hover:bg-white/20"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-t-2xl">
            {selectedTheme.id === "solid" ? (
              <div className="size-full" style={{ backgroundColor: color }} />
            ) : (
              <ThemePreview id={selectedTheme.id} />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <h2
                style={{
                  fontFamily: selectedTheme.titleFont,
                  color: selectedTheme.titleColor,
                  fontWeight: selectedTheme.titleWeight,
                  fontSize: selectedTheme.titleSize,
                  letterSpacing: selectedTheme.titleTracking,
                  textTransform: selectedTheme.titleTransform as "none" | "uppercase",
                }}
              >
                {title || "Your board title"}
              </h2>
              {(description || !title) && (
                <p
                  className="mt-2 text-sm"
                  style={{
                    fontFamily: selectedTheme.titleFont,
                    color: selectedTheme.subtitleColor,
                  }}
                >
                  {description || "A space for your community to leave messages"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
