"use client";

import { useState } from "react";
import { ThemeSelector, themes } from "@/components/theme-selector";
import { VisibilitySelector } from "@/components/visibility-selector";
import { AudioSelector } from "@/components/audio-selector";
import { BoardPreview } from "@/components/board-preview";

export default function NewBoard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [font, setFont] = useState(themes[0].font);
  const [color, setColor] = useState("#18181b");
  const [visibility, setVisibility] = useState("public");

  return (
    <div className="flex h-screen bg-white">
      <div className="w-[45%] shrink-0 overflow-y-auto px-12 py-8">
        <h1 className="mb-1 text-2xl font-semibold text-gray-900">
          Create a new board
        </h1>
        <p className="mb-8 text-sm text-gray-400">
          Set up a space for your community to leave messages.
        </p>

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

        <div className="mb-8">
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

        <div className="mb-8">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Theme
          </label>
          <ThemeSelector selected={selectedTheme} onSelect={(t) => {
            setSelectedTheme(t);
            setFont(t.font);
          }} />
        </div>

        <div className="mb-8">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Visibility
          </label>
          <VisibilitySelector selected={visibility} onSelect={setVisibility} />
        </div>

        <div className="mb-10">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Audio
            <span className="ml-1 font-normal text-gray-300">optional</span>
          </label>
          <AudioSelector />
        </div>

        <button className="w-full rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-gray-900 active:bg-gray-800">
          Create Board
        </button>
      </div>

      <BoardPreview
        theme={selectedTheme}
        font={font}
        color={color}
        title={title}
        description={description}
        onFontChange={setFont}
        onColorChange={setColor}
      />
    </div>
  );
}
