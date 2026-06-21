import Image from "next/image";
import Link from "next/link";
import {
  PlusCircle,
  Kanban,
  ChatCircleDots,
} from "@phosphor-icons/react/dist/ssr";

const boards = [
  { id: 1, title: "Graduation Wishes 2025" },
  { id: 2, title: "Happy Birthday Ola!" },
  { id: 3, title: "Team Farewell — Sarah" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white">
      <aside className="flex w-56 flex-col border-r border-gray-100 bg-gray-50/60 px-3 py-4">
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
          <p className="mb-2 text-xs uppercase tracking-wider font- text-gray-700">
            Recent
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
          {boards.map((board) => (
            <a
              key={board.id}
              href="#"
              className="truncate rounded-lg px-3 py-2 text-sm text-gray-700 font-medium transition-colors hover:bg-gray-100"
            >
              {board.title}
            </a>
          ))}
        </div>

        <div className="mt-auto border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2 rounded-lg px-2 py-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-pink-100 text-xs font-semibold text-pink-600">
              O
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800">Ola</p>
              <p className="truncate text-xs text-gray-400">Free plan</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
