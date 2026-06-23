import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useId, useMemo, useRef } from "react";
import { getReactionCounts, addReaction, removeReaction } from "@/services/reactions";
import { createClient } from "@/lib/supabase/client";
import type { ReactionCount } from "@/lib/types";

// Track reaction IDs we just inserted/deleted so realtime doesn't double-count
const pendingIds = new Set<string>();

export function useReactions(messageIds: string[]) {
  const queryClient = useQueryClient();
  const instanceId = useId();
  const stableKey = useMemo(() => [...messageIds].sort().join(","), [messageIds]);
  const queryKey = ["reactions", stableKey];

  const query = useQuery({
    queryKey,
    queryFn: () => getReactionCounts(messageIds),
    enabled: messageIds.length > 0,
  });

  const messageIdsRef = useRef(messageIds);
  messageIdsRef.current = messageIds;
  const queryKeyRef = useRef(queryKey);
  queryKeyRef.current = queryKey;

  useEffect(() => {
    if (!stableKey) return;

    const supabase = createClient();
    const channelName = `reactions-${instanceId}-${Date.now()}`;

    const channel = supabase.channel(channelName);

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reactions" },
        (payload) => {
          const row = payload.new as { id: string; message_id: string; emoji: string };
          if (!messageIdsRef.current.includes(row.message_id)) return;
          if (pendingIds.delete(row.id)) return;

          queryClient.setQueryData<Record<string, ReactionCount[]>>(queryKeyRef.current, (old) => {
            if (!old) return old;
            const updated = { ...old };
            const msgReactions = [...(updated[row.message_id] || [])];
            const idx = msgReactions.findIndex((r) => r.emoji === row.emoji);
            if (idx >= 0) {
              msgReactions[idx] = { ...msgReactions[idx], count: msgReactions[idx].count + 1 };
            } else {
              msgReactions.push({ emoji: row.emoji, count: 1 });
            }
            updated[row.message_id] = msgReactions;
            return updated;
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "reactions" },
        (payload) => {
          const row = payload.old as { id: string; message_id: string; emoji: string };
          if (!row.message_id || !messageIdsRef.current.includes(row.message_id)) return;
          if (pendingIds.delete(row.id)) return;

          queryClient.setQueryData<Record<string, ReactionCount[]>>(queryKeyRef.current, (old) => {
            if (!old) return old;
            const updated = { ...old };
            const msgReactions = [...(updated[row.message_id] || [])];
            const idx = msgReactions.findIndex((r) => r.emoji === row.emoji);
            if (idx >= 0) {
              const newCount = msgReactions[idx].count - 1;
              if (newCount <= 0) {
                msgReactions.splice(idx, 1);
              } else {
                msgReactions[idx] = { ...msgReactions[idx], count: newCount };
              }
            }
            updated[row.message_id] = msgReactions.length > 0 ? msgReactions : [];
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [stableKey, queryClient, instanceId]);

  return query;
}

export function useAddReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      const id = await addReaction(messageId, emoji);
      pendingIds.add(id);
      setTimeout(() => pendingIds.delete(id), 5000);
      return { id, messageId, emoji };
    },
    onSuccess: ({ messageId, emoji }) => {
      queryClient.setQueriesData<Record<string, ReactionCount[]>>(
        { queryKey: ["reactions"] },
        (old) => {
          if (!old) return old;
          const updated = { ...old };
          const msgReactions = [...(updated[messageId] || [])];
          const idx = msgReactions.findIndex((r) => r.emoji === emoji);
          if (idx >= 0) {
            msgReactions[idx] = { ...msgReactions[idx], count: msgReactions[idx].count + 1 };
          } else {
            msgReactions.push({ emoji, count: 1 });
          }
          updated[messageId] = msgReactions;
          return updated;
        }
      );
    },
  });
}

export function useRemoveReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reactionId, messageId, emoji }: { reactionId: string; messageId: string; emoji: string }) => {
      pendingIds.add(reactionId);
      setTimeout(() => pendingIds.delete(reactionId), 5000);
      await removeReaction(reactionId);
      return { messageId, emoji };
    },
    onSuccess: ({ messageId, emoji }) => {
      queryClient.setQueriesData<Record<string, ReactionCount[]>>(
        { queryKey: ["reactions"] },
        (old) => {
          if (!old) return old;
          const updated = { ...old };
          const msgReactions = [...(updated[messageId] || [])];
          const idx = msgReactions.findIndex((r) => r.emoji === emoji);
          if (idx >= 0) {
            const newCount = msgReactions[idx].count - 1;
            if (newCount <= 0) {
              msgReactions.splice(idx, 1);
            } else {
              msgReactions[idx] = { ...msgReactions[idx], count: newCount };
            }
          }
          updated[messageId] = msgReactions;
          return updated;
        }
      );
    },
  });
}
