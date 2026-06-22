"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import { completeOnboarding } from "@/app/(dashboard)/actions";

const slides = [
  {
    title: "Welcome to PostMarks",
    description:
      "Create beautiful boards where your community can leave messages, doodles, and memories.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="size-10">
        <path
          clipRule="evenodd"
          d="m16.1746 28.4936 4.5688 4.5688c2.7804 2.7803 7.2882 2.7803 10.0686 0 .9169-.917 1.5315-2.0218 1.8436-3.1906l3.1906 3.1906c2.7804 2.7803 7.2882 2.7803 10.0685 0 2.7804-2.7804 2.7804-7.2882 0-10.0685l-10.0685-10.0686c-2.7803-2.7803-7.2882-2.7803-10.0685 0-.917.917-1.5315 2.0219-1.8436 3.1907l-3.1907-3.1907c-2.7803-2.7803-7.2881-2.7803-10.0685.0001l-8.28554 8.2855c-3.185813 3.1858-3.185813 8.351 0 11.5369 3.18581 3.1858 8.35104 3.1858 11.53684 0 1.206-1.206 1.9555-2.6957 2.2484-4.2542zm2.0517-13.0511c-1.3902-1.3902-3.6441-1.3902-5.0343 0-1.3895 1.3896-1.3901 3.6421-.0017 5.0325l10.0703 10.0703c1.3901 1.3901 3.6441 1.3901 5.0342 0 1.3895-1.3895 1.3902-3.6417.0022-5.0321zm-6.8172 8.2855-3.25132-3.2513-3.25129 3.2513c-1.79564 1.7957-1.79564 4.707 0 6.5026 1.79564 1.7957 4.70695 1.7957 6.50261 0 1.7956-1.7956 1.7956-4.7069 0-6.5026zm16.8828-3.2542c-1.3872-1.3904-1.3863-3.6421.0029-5.0313 1.3902-1.3902 3.6441-1.3902 5.0343 0l10.0685 10.0685c1.3902 1.3902 1.3902 3.6441 0 5.0343-1.3902 1.3901-3.6441 1.3901-5.0342 0z"
          fill="#db2777"
          fillRule="evenodd"
        />
      </svg>
    ),
  },
  {
    title: "Create a Board",
    description:
      "Pick a theme, set a title, choose visibility — public, private, or link-only. Each board gets a unique shareable link.",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-xl bg-pink-100">
        <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="#db2777" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </div>
    ),
  },
  {
    title: "Share with Everyone",
    description:
      "Copy your board link and share it anywhere — WhatsApp, X, email. Anyone with the link can leave a sticky note or doodle.",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100">
        <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </div>
    ),
  },
  {
    title: "Collect Memories",
    description:
      "Watch messages and doodles fill your board. Pan around the canvas, zoom in, and hover to focus on individual notes.",
    icon: (
      <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100">
        <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </div>
    ),
  },
];

export function OnboardingTour() {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0);

  const dismiss = () => {
    setOpen(false);
    completeOnboarding();
  };

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      dismiss();
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  if (!open) return null;

  const slide = slides[current];
  const isLast = current === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />

      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Shader header */}
        <div className="relative h-28 overflow-hidden bg-white">
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background: `
                radial-gradient(circle at 15% 5%, rgba(251, 146, 60, 0.35) 0%, transparent 45%),
                radial-gradient(circle at 85% 25%, rgba(219, 39, 119, 0.3) 0%, transparent 45%),
                radial-gradient(circle at 40% 95%, rgba(168, 85, 247, 0.25) 0%, transparent 45%)
              `,
            }}
          />
          <div
            className="absolute inset-[-20px] animate-[shader-breathe_4s_ease-in-out_infinite]"
            style={{
              background: `
                radial-gradient(circle at 60% 40%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)
              `,
              filter: "blur(25px)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-white to-transparent" />

          {/* Icon centered on shader */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {slide.icon}
          </div>

          {/* Skip button */}
          <button
            onClick={dismiss}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/50 px-3 py-1 text-[11px] font-medium text-gray-500 backdrop-blur-sm transition-colors hover:bg-white/70"
          >
            Skip
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <h2 className="mb-2 text-center text-lg font-semibold text-gray-900">
            {slide.title}
          </h2>
          <p className="mb-6 text-center text-sm leading-relaxed text-gray-400">
            {slide.description}
          </p>

          {/* Dots */}
          <div className="mb-5 flex items-center justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current
                    ? "w-6 bg-pink-500"
                    : "w-1.5 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {current > 0 && (
              <button
                onClick={prev}
                className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <button
              onClick={next}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-900"
            >
              {isLast ? "Get Started" : "Next"}
              {!isLast && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
