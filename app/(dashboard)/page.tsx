"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  MagnifyingGlass,
  Copy,
  ShareNetwork,
  Globe,
  Lock,
} from "@phosphor-icons/react";
import { useBoards } from "@/hooks/use-boards";
import { ShareModal } from "@/components/share-modal";
import { BoardMenu } from "@/components/board-menu";
import { toast } from "sonner";

const tabs = ["All", "Active", "Shared", "Archived"];

const visibilityIcon: Record<string, typeof Globe> = {
  public: Globe,
  private: Lock,
};

export default function Home() {
  const { data: boards, isLoading } = useBoards();
  const [shareModal, setShareModal] = useState<{
    title: string;
    url: string;
  } | null>(null);

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/b/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const openShare = (board: { title: string; slug: string }) => {
    setShareModal({
      title: board.title,
      url: `${window.location.origin}/b/${board.slug}`,
    });
  };

  return (
    <div className="flex flex-1 flex-col px-4 py-6 sm:px-10 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">My Boards</h1>
        <div className="flex w-full items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-400 sm:w-96">
          <MagnifyingGlass size={16} weight="bold" />
          <input
            type="text"
            placeholder="Search boards..."
            className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto sm:mb-8">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              i === 0
                ? "bg-pink-600 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      ) : boards && boards.length > 0 ? (
        <>
          {/* Desktop table */}
          <div className="hidden sm:flex sm:flex-col">
            <div className="grid grid-cols-[1fr_120px_100px_140px] gap-4 px-4 pb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              <span>Board</span>
              <span>Visibility</span>
              <span>Created</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="flex flex-col">
              {boards.map((board) => {
                const VisIcon = visibilityIcon[board.visibility] || Globe;
                return (
                  <div
                    key={board.id}
                    className="group grid grid-cols-[1fr_120px_100px_140px] items-center gap-4 border-t border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50/60"
                  >
                    <Link href={`/boards/${board.id}`} className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 group-hover:text-pink-600 transition-colors">
                        {board.title}
                      </p>
                      {board.description && (
                        <p className="mt-0.5 truncate text-xs text-gray-400">
                          {board.description}
                        </p>
                      )}
                    </Link>

                    <div className="flex items-center gap-1.5 text-gray-500">
                      <VisIcon size={14} />
                      <span className="text-sm capitalize">{board.visibility}</span>
                    </div>

                    <span className="text-sm text-gray-400">
                      {new Date(board.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>

                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => copyLink(board.slug)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                      <button
                        onClick={() => openShare(board)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      >
                        <ShareNetwork size={14} />
                        Share
                      </button>
                      <BoardMenu board={board} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {boards.map((board) => {
              const VisIcon = visibilityIcon[board.visibility] || Globe;
              return (
                <div
                  key={board.id}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <Link href={`/boards/${board.id}`}>
                    <p className="text-sm font-semibold text-gray-900">
                      {board.title}
                    </p>
                    {board.description && (
                      <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">
                        {board.description}
                      </p>
                    )}
                  </Link>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <VisIcon size={12} />
                        <span className="capitalize">{board.visibility}</span>
                      </div>
                      <span>
                        {new Date(board.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyLink(board.slug)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => openShare(board)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <ShareNetwork size={16} />
                      </button>
                      <BoardMenu board={board} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative mb-4">
            <svg width="96" height="80" viewBox="0 0 96 80" fill="none">
              <rect x="12" y="4" width="64" height="52" rx="6" fill="#e5e7eb" />
              <rect x="4" y="12" width="64" height="52" rx="6" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1" />
              <rect x="14" y="26" width="36" height="4" rx="2" fill="#d1d5db" />
              <rect x="14" y="34" width="28" height="4" rx="2" fill="#d1d5db" />
              <rect x="14" y="42" width="20" height="4" rx="2" fill="#d1d5db" />
              <circle cx="56" cy="20" r="5" fill="#c084fc" />
              <rect x="55" y="25" width="2" height="8" rx="1" fill="#9ca3af" />
            </svg>
          </div>
          <h2 className="mb-1 text-lg font-semibold text-gray-800">
            No boards yet
          </h2>
          <p className="mb-6 max-w-xs text-center text-sm text-gray-400">
            Create your first board and share it with your community to start
            collecting messages.
          </p>
          <Link
            href="/boards/new"
            className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900"
          >
            <PlusCircle size={18} weight="bold" />
            Create Board
          </Link>
        </div>
      )}
      <ShareModal
        open={!!shareModal}
        onClose={() => setShareModal(null)}
        title={shareModal?.title ?? ""}
        url={shareModal?.url ?? ""}
      />
    </div>
  );
}
