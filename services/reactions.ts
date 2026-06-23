import { createClient } from "@/lib/supabase/client";
import type { ReactionCount } from "@/lib/types";

export async function getReactionCounts(messageIds: string[]): Promise<Record<string, ReactionCount[]>> {
  if (messageIds.length === 0) return {};

  const supabase = createClient();

  const { data, error } = await supabase
    .from("reactions")
    .select("message_id, emoji")
    .in("message_id", messageIds);

  if (error) throw error;

  const counts: Record<string, Record<string, number>> = {};
  for (const row of data) {
    if (!counts[row.message_id]) counts[row.message_id] = {};
    counts[row.message_id][row.emoji] = (counts[row.message_id][row.emoji] || 0) + 1;
  }

  const result: Record<string, ReactionCount[]> = {};
  for (const [msgId, emojis] of Object.entries(counts)) {
    result[msgId] = Object.entries(emojis).map(([emoji, count]) => ({ emoji, count }));
  }

  return result;
}

export async function addReaction(messageId: string, emoji: string): Promise<string> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reactions")
    .insert({ message_id: messageId, emoji })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function removeReaction(reactionId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("reactions")
    .delete()
    .eq("id", reactionId);

  if (error) throw error;
}
