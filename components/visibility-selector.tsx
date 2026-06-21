"use client";

import { Globe, Lock, LinkSimple } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

type VisibilityOption = {
  id: string;
  label: string;
  desc: string;
  icon: Icon;
};

const options: VisibilityOption[] = [
  { id: "public", label: "Public", desc: "Anyone can view and post", icon: Globe },
  { id: "private", label: "Private", desc: "Only invited people", icon: Lock },
  { id: "link", label: "Link only", desc: "Anyone with the link", icon: LinkSimple },
];

export function VisibilitySelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {options.map((opt) => {
        const IconComp = opt.icon;
        const isActive = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`shader-card flex flex-1 flex-col items-center gap-3 px-4 py-5 text-center ${
              isActive ? "active" : ""
            }`}
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 transition-colors">
              <IconComp
                size={20}
                weight={isActive ? "fill" : "regular"}
                className="text-gray-600"
              />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  isActive ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {opt.label}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">{opt.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
