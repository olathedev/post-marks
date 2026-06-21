import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PublicBoard } from "./public-board";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: board } = await supabase
    .from("boards")
    .select("title, description")
    .eq("slug", slug)
    .single();

  return {
    title: board?.title ?? "Board",
    description: board?.description ?? "Leave a message",
  };
}

export default async function BoardPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: board } = await supabase
    .from("boards")
    .select("*, profiles(full_name, avatar_url)")
    .eq("slug", slug)
    .single();

  if (!board) notFound();

  if (board.visibility === "private") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.id !== board.user_id) notFound();
  }

  const creator = (board as Record<string, unknown>).profiles as {
    full_name: string | null;
    avatar_url: string | null;
  } | null;

  return (
    <PublicBoard
      board={board}
      creator={{
        name: creator?.full_name || "Someone",
        avatar_url: creator?.avatar_url || null,
      }}
    />
  );
}
