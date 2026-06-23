"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smiley } from "@phosphor-icons/react";
import { useAddReaction, useRemoveReaction } from "@/hooks/use-reactions";
import type { ReactionCount } from "@/lib/types";

const EMOJI_OPTIONS = ["❤️", "🔥", "😂", "👏", "😍", "🎉", "😢", "🤗", "💯"];

export function EmojiReactions({
  messageId,
  reactions,
}: {
  messageId: string;
  reactions: ReactionCount[];
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [myReaction, setMyReaction] = useState<{ emoji: string; reactionId: string } | null>(null);
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();

  const handleReact = (emoji: string) => {
    if (addReaction.isPending || removeReaction.isPending) return;

    if (myReaction?.emoji === emoji) {
      removeReaction.mutate(
        { reactionId: myReaction.reactionId, messageId, emoji },
        { onSuccess: () => setMyReaction(null) }
      );
      setShowPicker(false);
      return;
    }

    if (myReaction) {
      removeReaction.mutate(
        { reactionId: myReaction.reactionId, messageId, emoji: myReaction.emoji },
        {
          onSuccess: () => {
            addReaction.mutate(
              { messageId, emoji },
              { onSuccess: (data) => setMyReaction({ emoji, reactionId: data.id }) }
            );
          },
        }
      );
    } else {
      addReaction.mutate(
        { messageId, emoji },
        { onSuccess: (data) => setMyReaction({ emoji, reactionId: data.id }) }
      );
    }
    setShowPicker(false);
  };

  return (
    <div
      className="flex flex-wrap items-center gap-1"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {reactions.map((r) => (
        <motion.button
          key={r.emoji}
          onClick={() => handleReact(r.emoji)}
          className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] backdrop-blur-sm transition-colors ${
            myReaction?.emoji === r.emoji
              ? "bg-white/90 ring-1 ring-gray-300"
              : "bg-white/60 hover:bg-white/80"
          }`}
          whileTap={{ scale: 0.9 }}
        >
          <span>{r.emoji}</span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={r.count}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="font-medium text-gray-600"
            >
              {r.count}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      ))}

      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex size-6 items-center justify-center rounded-full bg-white/40 text-gray-400 backdrop-blur-sm transition-colors hover:bg-white/70 hover:text-gray-600"
        >
          <Smiley size={14} />
        </button>

        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 4 }}
              transition={{ duration: 0.12 }}
              className="absolute bottom-full left-0 z-50 mb-1.5 flex items-center gap-0.5 rounded-full bg-white px-2 py-1.5 shadow-lg"
            >
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className="rounded-full p-1 text-base transition-transform hover:scale-125 active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
