"use client";

import { useParams } from "next/navigation";
import { useBoard } from "@/hooks/use-boards";
import { useMessages } from "@/hooks/use-messages";
import { StrokeRenderer } from "@/components/drawing-canvas";
import Link from "next/link";
import {
  Copy,
  ShareNetwork,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { toast } from "sonner";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { data: board, isLoading: boardLoading } = useBoard(id);
  const { data: messages, isLoading: messagesLoading } = useMessages(id);

  if (boardLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-gray-400">Board not found</p>
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/b/${board.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success("Link copied!");
  };

  return (
    <div className="flex flex-1 flex-col px-4 py-6 sm:px-10 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="mb-3 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              {board.title}
            </h1>
            {board.description && (
              <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                {board.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <span className="capitalize">{board.visibility}</span>
              <span>·</span>
              <span>{messages?.length ?? 0} messages</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyLink}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 sm:flex-none"
          >
            <Copy size={14} />
            Copy Link
          </button>
          <Link
            href={`/b/${board.slug}`}
            target="_blank"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-black px-3 py-2.5 text-xs font-medium text-white transition-colors hover:bg-gray-900 sm:flex-none"
          >
            <ArrowSquareOut size={14} />
            View Board
          </Link>
        </div>
      </div>

      {/* Messages */}
      {messagesLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      ) : messages && messages.length > 0 ? (
        <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
          {messages.map((msg) => {
            const hasDrawing = (msg as Record<string, unknown>).drawing;
            return (
              <div
                key={msg.id}
                className="mb-3 break-inside-avoid p-4 shadow-sm"
                style={{
                  backgroundColor: msg.color || "#ffffff",
                  transform: `rotate(${(msg.rotation || 0) * 0.5}deg)`,
                  fontFamily: board.font,
                }}
              >
                {hasDrawing ? (
                  <StrokeRenderer
                    strokes={JSON.parse(hasDrawing as string)}
                    className="w-full"
                  />
                ) : (
                  <p className="text-[13px] leading-relaxed text-gray-800">
                    {msg.content}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">{msg.author_name}</p>
                  <p className="text-[10px] text-gray-300">
                    {new Date(msg.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <ShareNetwork size={40} className="mb-3 text-gray-200" />
          <h2 className="mb-1 text-lg font-semibold text-gray-800">
            No messages yet
          </h2>
          <p className="mb-5 max-w-xs text-center text-sm text-gray-400">
            Share your board link and start collecting messages from your community.
          </p>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900"
          >
            <Copy size={16} />
            Copy Board Link
          </button>
        </div>
      )}
    </div>
  );
}
