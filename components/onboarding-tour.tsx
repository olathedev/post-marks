"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { completeOnboarding } from "@/app/(dashboard)/actions";
import Image from "next/image";

const slides = [
  {
    title: "Welcome to PostMarks",
    description:
      "Create beautiful boards where your community can leave messages, doodles, and memories.",
  },
  {
    title: "Create a Board",
    description:
      "Pick a theme, set a title, choose visibility — public, private, or link-only. Each board gets a unique shareable link.",
  },
  {
    title: "Share with Everyone",
    description:
      "Copy your board link and share it anywhere — WhatsApp, X, email. Anyone with the link can leave a sticky note or doodle.",
  },
  {
    title: "Collect Memories",
    description:
      "Watch messages and doodles fill your board. Pan around the canvas, zoom in, and hover to focus on individual notes.",
  },
];

export function OnboardingTour() {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const dismiss = () => {
    setOpen(false);
    completeOnboarding();
  };

  const next = () => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent(current + 1);
    } else {
      dismiss();
    }
  };

  const prev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(current - 1);
    }
  };

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  if (!open) return null;

  const slide = slides[current];
  const isLast = current === slides.length - 1;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />

          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
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

              {/* Logo centered on shader */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <motion.div
                  key={current}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
                >
                  <Image src="/logo.svg" alt="PostMarks" width={40} height={40} />
                </motion.div>
              </div>

              {/* Skip button */}
              <button
                onClick={dismiss}
                className="absolute right-3 top-3 z-10 rounded-full bg-white/50 px-3 py-1 text-[11px] font-medium text-gray-500 backdrop-blur-sm transition-colors hover:bg-white/70"
              >
                Skip
              </button>
            </div>

            {/* Content — animated slides */}
            <div className="relative overflow-hidden px-6 pb-6" style={{ minHeight: 180 }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                >
                  <h2 className="mb-2 text-center text-lg font-semibold text-gray-900">
                    {slide.title}
                  </h2>
                  <p className="mb-6 text-center text-sm leading-relaxed text-gray-400">
                    {slide.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="mb-5 flex items-center justify-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="relative h-1.5 rounded-full transition-all"
                    style={{ width: i === current ? 24 : 6 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gray-200" />
                    {i === current && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-pink-500"
                        layoutId="onboarding-dot"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {current > 0 && (
                    <motion.button
                      onClick={prev}
                      className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 40, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <ArrowLeft size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>
                <motion.button
                  onClick={next}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-900"
                  whileTap={{ scale: 0.97 }}
                >
                  {isLast ? "Get Started" : "Next"}
                  {!isLast && (
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <ArrowRight size={14} />
                    </motion.span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
