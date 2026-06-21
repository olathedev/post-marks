import { createClient } from "@/lib/supabase/client";
import type { Message, CreateMessageInput } from "@/lib/types";

const noteColors = [
  "#a5f3fc", "#ffffff", "#fbcfe8", "#fed7aa",
  "#d9f99d", "#ddd6fe", "#bfdbfe", "#fef3c7",
];

export async function getMessages(boardId: string): Promise<Message[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("board_id", boardId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createMessage(input: CreateMessageInput): Promise<Message> {
  const supabase = createClient();

  const color = input.color || noteColors[Math.floor(Math.random() * noteColors.length)];
  const rotation = Math.floor(Math.random() * 7) - 3;

  const row: Record<string, unknown> = {
    board_id: input.board_id,
    author_name: input.author_name || "Anonymous",
    content: input.content,
    color,
    rotation,
  };
  if (input.drawing) row.drawing = input.drawing;

  console.log("[createMessage] inserting:", { ...row, drawing: row.drawing ? "(drawing data)" : undefined });

  const { data, error } = await supabase
    .from("messages")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("[createMessage] error:", error.message, error.details, error.hint);
    throw error;
  }

  console.log("[createMessage] success:", data.id);
  return data;
}
