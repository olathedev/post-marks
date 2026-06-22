"use client";

import { useState } from "react";
import { List, X } from "@phosphor-icons/react";

export function MobileSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg p-1 text-gray-600 transition-colors hover:bg-gray-100"
      >
        <List size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 flex w-64 flex-col bg-white px-3 py-4 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="mb-2 self-end rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
            <div
              className="flex flex-1 flex-col"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("form")) return;
                if (target.closest("a")) setOpen(false);
              }}
            >
              {children}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
