import Link from "next/link";
import {
  PlusCircle,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";

const tabs = ["All", "Active", "Shared", "Archived"];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col px-10 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Boards</h1>
        <div className="flex w-96 items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-400">
          <MagnifyingGlass size={16} weight="bold" />
          <input
            type="text"
            placeholder="Search boards..."
            className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      <div className="mb-8 flex items-center gap-2">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              i === 0
                ? "bg-pink-600 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative mb-4">
          <svg width="96" height="80" viewBox="0 0 96 80" fill="none">
            <rect x="12" y="4" width="64" height="52" rx="6" fill="#e5e7eb" />
            <rect x="4" y="12" width="64" height="52" rx="6" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1" />
            <rect x="14" y="26" width="36" height="4" rx="2" fill="#d1d5db" />
            <rect x="14" y="34" width="28" height="4" rx="2" fill="#d1d5db" />
            <rect x="14" y="42" width="20" height="4" rx="2" fill="#d1d5db" />
            <circle cx="56" cy="20" r="5" fill="#c084fc" />
            <rect x="55" y="25" width="2" height="8" rx="1" fill="#9ca3af" />
          </svg>
        </div>
        <h2 className="mb-1 text-lg font-semibold text-gray-800">
          No boards yet
        </h2>
        <p className="mb-6 max-w-xs text-center text-sm text-gray-400">
          Create your first board and share it with your community to start
          collecting messages.
        </p>
        <Link
          href="/boards/new"
          className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900"
        >
          <PlusCircle size={18} weight="bold" />
          Create Board
        </Link>
      </div>
    </div>
  );
}
