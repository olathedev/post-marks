import Image from "next/image";
import Link from "next/link";
import {
  PlusCircle,
  Kanban,
  ChatCircleDots,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { OnboardingTour } from "@/components/onboarding-tour";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: recentBoards } = await supabase
    .from("boards")
    .select("id, title")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: profile } = await supabase
    .from("profiles")
    .select("has_seen_onboarding")
    .eq("id", user?.id ?? "")
    .single();

  const showOnboarding = !profile?.has_seen_onboarding;

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const initials = displayName.charAt(0).toUpperCase();

  const sidebarContent = (
    <>
      <div className="mb-6 px-2">
        <Image src="/logo.svg" alt="PostMarks" height={32} width={32} />
      </div>

      <Link
        href="/boards/new"
        className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
      >
        <PlusCircle size={20} weight="bold" />
        New Board
      </Link>

      <nav className="flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900"
        >
          <Kanban size={20} />
          My Boards
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <ChatCircleDots size={20} />
          Shared with me
        </Link>
      </nav>

      <div className="mt-6 px-2">
        <p className="mb-2 text-xs uppercase tracking-wider text-gray-700">
          Recent
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {recentBoards?.map((board) => (
          <Link
            key={board.id}
            href={`/boards/${board.id}`}
            className="truncate rounded-lg px-3 py-2 text-sm text-gray-700 font-medium transition-colors hover:bg-gray-100"
          >
            {board.title}
          </Link>
        ))}
      </div>

      <div className="mt-auto border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 rounded-lg px-2 py-2">
          {user?.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt={displayName}
              width={32}
              height={32}
              className="size-8 rounded-full"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-pink-100 text-xs font-semibold text-pink-600">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-800">
              {displayName}
            </p>
            <p className="truncate text-xs text-gray-400">Free plan</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <SignOut size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-gray-100 bg-gray-50/60 px-3 py-4">
        {sidebarContent}
      </aside>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <MobileSidebar>{sidebarContent}</MobileSidebar>
          <Image src="/logo.svg" alt="PostMarks" height={24} width={24} />
        </div>
        <Link
          href="/boards/new"
          className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-medium text-white"
        >
          <PlusCircle size={14} weight="bold" />
          New Board
        </Link>
      </div>

      <main className="flex flex-1 flex-col overflow-y-auto pt-14 md:pt-0">
        {children}
      </main>

      {showOnboarding && <OnboardingTour />}
    </div>
  );
}
