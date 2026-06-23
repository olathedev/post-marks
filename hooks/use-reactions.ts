import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useId, useMemo, useRef } from "react";
import { getReactionCounts, addReaction, removeReaction } from "@/services/reactions";
import { createClient } from "@/lib/supabase/client";
import type { ReactionCount } from "@/lib/types";

export function useReactions(messageIds: string[]) {
  const queryClient = useQueryClient();
  const instanceId = useId();
  const stableKey = useMemo(() => [...messageIds].sort().join(","), [messageIds]);
  const queryKey = useMemo(() => ["reactions", stableKey], [stableKey]);

  const query = useQuery({
    queryKey,
    queryFn: () => getReactionCounts(messageIds),
    enabled: messageIds.length > 0,
    refetchOnWindowFocus: false,
  });

  const queryKeyRef = useRef(queryKey);
  queryKeyRef.current = queryKey;

  // Realtime: just refetch the true counts — no manual deltas
  useEffect(() => {
    if (!stableKey) return;

    const supabase = createClient();
    const channel = supabase.channel(`reactions-${instanceId}-${Date.now()}`);

    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reactions" },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeyRef.current });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [stableKey, instanceId, queryClient]);

  return query;
}

function applyOptimistic(
  old: Record<string, ReactionCount[]> | undefined,
  messageId: string,
  emoji: string,
  delta: 1 | -1
): Record<string, ReactionCount[]> | undefined {
  if (!old) return old;
  const updated = { ...old };
  const msgReactions = [...(updated[messageId] || [])];
  const idx = msgReactions.findIndex((r) => r.emoji === emoji);

  if (delta === 1) {
    if (idx >= 0) {
      msgReactions[idx] = { ...msgReactions[idx], count: msgReactions[idx].count + 1 };
    } else {
      msgReactions.push({ emoji, count: 1 });
    }
  } else if (idx >= 0) {
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

export function useAddReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      const id = await addReaction(messageId, emoji);
      return { id, messageId, emoji };
    },
    onMutate: async ({ messageId, emoji }) => {
      await queryClient.cancelQueries({ queryKey: ["reactions"] });

      const queries = queryClient.getQueriesData<Record<string, ReactionCount[]>>({ queryKey: ["reactions"] });
      const snapshots = queries.map(([key, data]) => ({ key, data }));

      queryClient.setQueriesData<Record<string, ReactionCount[]>>(
        { queryKey: ["reactions"] },
        (old) => applyOptimistic(old, messageId, emoji, 1)
      );

      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      context?.snapshots.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reactions"] });
    },
  });
}

export function useRemoveReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reactionId }: { reactionId: string; messageId: string; emoji: string }) => {
      await removeReaction(reactionId);
    },
    onMutate: async ({ messageId, emoji }) => {
      await queryClient.cancelQueries({ queryKey: ["reactions"] });

      const queries = queryClient.getQueriesData<Record<string, ReactionCount[]>>({ queryKey: ["reactions"] });
      const snapshots = queries.map(([key, data]) => ({ key, data }));

      queryClient.setQueriesData<Record<string, ReactionCount[]>>(
        { queryKey: ["reactions"] },
        (old) => applyOptimistic(old, messageId, emoji, -1)
      );

      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      context?.snapshots.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reactions"] });
    },
  });
}
