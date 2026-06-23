"use client";

import { useState, useRef, useEffect } from "react";
import {
  DotsThreeVertical,
  PencilSimple,
  Trash,
  Globe,
  Lock,
} from "@phosphor-icons/react";
import { useUpdateBoard, useDeleteBoard } from "@/hooks/use-boards";
import { toast } from "sonner";
import type { Board } from "@/lib/types";

export function BoardMenu({ board }: { board: Board }) {
  const [open, setOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <DotsThreeVertical size={18} weight="bold" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              setShowEdit(true);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <PencilSimple size={16} />
            Edit Board
          </button>
          <button
            onClick={() => {
              setOpen(false);
              setShowDelete(true);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash size={16} />
            Delete Board
          </button>
        </div>
      )}

      {showEdit && (
        <EditBoardModal board={board} onClose={() => setShowEdit(false)} />
      )}
      {showDelete && (
        <DeleteBoardModal board={board} onClose={() => setShowDelete(false)} />
      )}
    </div>
  );
}

function EditBoardModal({
  board,
  onClose,
}: {
  board: Board;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(board.title);
  const [description, setDescription] = useState(board.description || "");
  const [visibility, setVisibility] = useState(board.visibility);
  const updateBoard = useUpdateBoard();

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    updateBoard.mutate(
      {
        id: board.id,
        title: title.trim(),
        description: description.trim() || null,
        visibility,
      },
      {
        onSuccess: () => {
          toast.success("Board updated");
          onClose();
        },
        onError: () => toast.error("Failed to update board"),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Edit Board</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Visibility
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  visibility === "public"
                    ? "border-pink-400 bg-pink-50 text-pink-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Globe size={16} />
                Public
              </button>
              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  visibility === "private"
                    ? "border-pink-400 bg-pink-50 text-pink-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Lock size={16} />
                Private
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateBoard.isPending}
            className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900 disabled:opacity-50"
          >
            {updateBoard.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteBoardModal({
  board,
  onClose,
}: {
  board: Board;
  onClose: () => void;
}) {
  const deleteBoard = useDeleteBoard();

  const handleDelete = () => {
    deleteBoard.mutate(board.id, {
      onSuccess: () => {
        toast.success("Board deleted");
        onClose();
      },
      onError: () => toast.error("Failed to delete board"),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-red-100">
          <Trash size={20} className="text-red-600" />
        </div>
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Delete Board</h2>
        <p className="mb-6 text-sm text-gray-500">
          Are you sure you want to delete <span className="font-medium text-gray-700">{board.title}</span>? This will also delete all messages on the board. This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteBoard.isPending}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {deleteBoard.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
