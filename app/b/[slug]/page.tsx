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

  const title = board?.title ?? "Board";
  const description = board?.description ?? "Leave a message on this board";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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

  let isOwner = false;
  if (board.visibility === "private") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isOwner = !!user && user.id === board.user_id;
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
      canViewMessages={board.visibility === "public" || isOwner}
    />
  );
}
