import { createClient } from "@/lib/supabase/client";
import type { Board, CreateBoardInput } from "@/lib/types";

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 8)
  );
}

export async function createBoard(input: CreateBoardInput): Promise<Board> {
  const supabase = createClient();

  console.log("[createBoard] input:", input);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log("[createBoard] user:", user?.id ?? "null", "authError:", authError?.message ?? "none");

  if (!user) throw new Error("Not authenticated");

  const payload = {
    user_id: user.id,
    title: input.title,
    description: input.description || null,
    theme_id: input.theme_id,
    font: input.font,
    color: input.color,
    visibility: input.visibility,
    slug: generateSlug(input.title),
  };

  console.log("[createBoard] inserting:", payload);

  const { data, error } = await supabase
    .from("boards")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("[createBoard] error:", error.message, error.details, error.hint);
    throw error;
  }

  console.log("[createBoard] success:", data);
  return data;
}

export async function getBoards(): Promise<Board[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBoard(id: string): Promise<Board> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateBoard(
  id: string,
  input: { title?: string; description?: string | null; visibility?: string }
): Promise<Board> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("boards")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBoard(id: string): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("boards")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}
