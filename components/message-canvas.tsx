"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Minus, Plus, ArrowBendLeftDown, X } from "@phosphor-icons/react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  AnimatePresence,
} from "motion/react";
import { StrokeRenderer } from "./drawing-canvas";
import { EmojiReactions, EmojiPickerProvider } from "./emoji-reactions";
import { useReactions } from "@/hooks/use-reactions";
import type { Message } from "@/lib/types";

type CardPos = { x: number; y: number; rot: number; w: number; h: number };

const CANVAS_W = 4000;
const CANVAS_H = 3000;
const CARD_H = 180;

function layoutCards(
  roots: Message[]
): { positions: CardPos[]; width: number; height: number } {
  if (roots.length === 0) return { positions: [], width: CANVAS_W, height: CANVAS_H };

  const cardW = 280;
  const cardH = CARD_H;
  const overlapX = 80;
  const overlapY = 50;

  const cols = Math.max(1, Math.ceil(Math.sqrt(roots.length * 1.4)));
  const stepX = cardW - overlapX;
  const stepY = cardH - overlapY;

  const gridW = cols * stepX + cardW;
  const gridH = Math.ceil(roots.length / cols) * stepY + cardH;

  const offsetX = (CANVAS_W - gridW) / 2;
  const offsetY = (CANVAS_H - gridH) / 2;

  const positions: CardPos[] = [];

  for (let i = 0; i < roots.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const baseX = offsetX + col * stepX;
    const baseY = offsetY + row * stepY;
    const jX = (Math.random() - 0.5) * 40;
    const jY = (Math.random() - 0.5) * 30;

    positions.push({
      x: baseX + jX,
      y: baseY + jY,
      rot: Math.round((Math.random() - 0.5) * 10),
      w: 250 + Math.floor(Math.random() * 60),
      h: cardH,
    });
  }

  return { positions, width: CANVAS_W, height: CANVAS_H };
}

export function MessageCanvas({
  messages,
  font,
  onCardClick,
  onReplyTo,
}: {
  messages: Message[];
  font: string;
  onCardClick?: (msg: Message) => void;
  onReplyTo?: (msg: Message) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [zoom, setZoom] = useState(1.4);
  const [dragId, setDragId] = useState<string | null>(null);
  const isTouchDevice = useRef(false);

  // Split messages into roots and replies
  const roots = useMemo(() => messages.filter((m) => !m.parent_id), [messages]);
  const repliesByParent = useMemo(() => {
    const map = new Map<string, Message[]>();
    for (const msg of messages) {
      if (!msg.parent_id) continue;
      const list = map.get(msg.parent_id) || [];
      list.push(msg);
      map.set(msg.parent_id, list);
    }
    return map;
  }, [messages]);

  const messageIds = messages.map((m) => m.id);
  const { data: reactionCounts } = useReactions(messageIds);

  // Layout only root cards
  const rootIds = roots.map((m) => m.id).join(",");
  const layoutRef = useRef<{ ids: string; data: ReturnType<typeof layoutCards> } | null>(null);

  if (!layoutRef.current || layoutRef.current.ids !== rootIds) {
    const prev = layoutRef.current?.data.positions ?? [];
    const prevIds = layoutRef.current?.ids.split(",") ?? [];
    const next = layoutCards(roots);
    for (let i = 0; i < roots.length; i++) {
      const oldIdx = prevIds.indexOf(roots[i].id);
      if (oldIdx >= 0 && prev[oldIdx]) {
        next.positions[i] = prev[oldIdx];
      }
    }
    layoutRef.current = { ids: rootIds, data: next };
  }

  const [cardPositions, setCardPositions] = useState<CardPos[]>(layoutRef.current.data.positions);

  useEffect(() => {
    if (layoutRef.current) {
      setCardPositions(layoutRef.current.data.positions);
    }
  }, [rootIds]);

  const { width: canvasW, height: canvasH } = layoutRef.current.data;

  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const smoothX = useSpring(panX, { stiffness: 300, damping: 40 });
  const smoothY = useSpring(panY, { stiffness: 300, damping: 40 });

  const scaleVal = useMotionValue(1.4);
  const smoothScale = useSpring(scaleVal, { stiffness: 300, damping: 30 });
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = -(canvasW / 2 - rect.width / 2);
    const cy = -(canvasH / 2 - rect.height / 2);
    panX.set(cx);
    panY.set(cy);
  }, [canvasW, canvasH, panX, panY]);

  useEffect(() => {
    const onTouch = () => { isTouchDevice.current = true; };
    window.addEventListener("touchstart", onTouch, { once: true });
    return () => window.removeEventListener("touchstart", onTouch);
  }, []);

  useEffect(() => {
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overscrollBehavior = "";
      document.documentElement.style.overscrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && !(e.target as HTMLElement).closest("input,textarea")) {
        e.preventDefault();
        setSpaceHeld(true);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") setSpaceHeld(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Card dragging
  const cardDragStart = useRef<{ x: number; y: number; posX: number; posY: number; idx: number } | null>(null);
  const didDrag = useRef(false);
  const DRAG_THRESHOLD = 5;

  const handleCardDragStart = useCallback(
    (e: React.MouseEvent | React.PointerEvent, idx: number) => {
      e.stopPropagation();
      e.preventDefault();
      const pos = cardPositions[idx];
      if (!pos) return;
      cardDragStart.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y, idx };
      didDrag.current = false;
    },
    [cardPositions]
  );

  const handleCardDragMove = useCallback(
    (e: MouseEvent) => {
      if (!cardDragStart.current) return;
      const { x, y, posX, posY, idx } = cardDragStart.current;
      const z = zoomRef.current;
      const dx = (e.clientX - x) / z;
      const dy = (e.clientY - y) / z;

      if (!didDrag.current && Math.abs(e.clientX - x) + Math.abs(e.clientY - y) > DRAG_THRESHOLD) {
        didDrag.current = true;
        setDragId(roots[idx]?.id ?? null);
      }

      if (didDrag.current) {
        setCardPositions((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], x: posX + dx, y: posY + dy };
          return next;
        });
      }
    },
    [roots]
  );

  const handleCardDragEnd = useCallback(() => {
    if (cardDragStart.current && didDrag.current) {
      const idx = cardDragStart.current.idx;
      setCardPositions((prev) => {
        if (layoutRef.current) {
          layoutRef.current.data.positions[idx] = prev[idx];
        }
        return prev;
      });
    }
    cardDragStart.current = null;
    setDragId(null);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleCardDragMove);
    window.addEventListener("mouseup", handleCardDragEnd);
    return () => {
      window.removeEventListener("mousemove", handleCardDragMove);
      window.removeEventListener("mouseup", handleCardDragEnd);
    };
  }, [handleCardDragMove, handleCardDragEnd]);

  // Canvas panning
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const isPanning = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest("[data-card]")) return;
      e.preventDefault();
      isPanning.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY, px: panX.get(), py: panY.get() };
    },
    [panX, panY]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning.current || !dragStart.current) return;
      const dx = (e.clientX - dragStart.current.x) / zoom;
      const dy = (e.clientY - dragStart.current.y) / zoom;
      panX.set(dragStart.current.px + dx);
      panY.set(dragStart.current.py + dy);
    },
    [zoom, panX, panY]
  );

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
    dragStart.current = null;
  }, []);

  // Touch panning + pinch-to-zoom
  const touchStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pinchStart = useRef<{ dist: number; zoom: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStart.current = { dist: Math.hypot(dx, dy), zoom: zoomRef.current };
        touchStart.current = null;
      } else if (e.touches.length === 1) {
        touchStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          px: panX.get(),
          py: panY.get(),
        };
        pinchStart.current = null;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2 && pinchStart.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const ratio = dist / pinchStart.current.dist;
        const next = Math.min(2, Math.max(0.3, pinchStart.current.zoom * ratio));
        setZoom(next);
        scaleVal.set(next);
      } else if (e.touches.length === 1 && touchStart.current) {
        const z = zoomRef.current;
        const dx = (e.touches[0].clientX - touchStart.current.x) / z;
        const dy = (e.touches[0].clientY - touchStart.current.y) / z;
        panX.set(touchStart.current.px + dx);
        panY.set(touchStart.current.py + dy);
      }
    };

    const onTouchEnd = () => {
      touchStart.current = null;
      pinchStart.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [panX, panY, scaleVal]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) {
        const delta = e.deltaY > 0 ? -0.08 : 0.08;
        const next = Math.min(2, Math.max(0.3, zoom + delta));
        setZoom(next);
        scaleVal.set(next);
        return;
      }
      panX.set(panX.get() - e.deltaX / zoom);
      panY.set(panY.get() - e.deltaY / zoom);
    },
    [zoom, scaleVal, panX, panY]
  );

  const doZoom = (dir: number) => {
    const next = Math.min(2, Math.max(0.3, zoom + dir * 0.15));
    setZoom(next);
    animate(scaleVal, next, { duration: 0.2 });
  };

  const transformStr = useTransform(
    [smoothScale, smoothX, smoothY],
    ([s, x, y]) => `scale(${s}) translate(${x}px, ${y}px)`
  );

  return (
    <EmojiPickerProvider>
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{ cursor: dragId ? "grabbing" : isPanning.current ? "grabbing" : "grab", overscrollBehavior: "none", userSelect: "none" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("[data-card]")) {
          setFocusedId(null);
          setExpandedId(null);
        }
      }}
    >
      <motion.div
        className="absolute origin-top-left will-change-transform"
        style={{
          width: canvasW,
          height: canvasH,
          transform: transformStr,
        }}
      >
        {roots.map((msg, i) => {
          const pos = cardPositions[i];
          if (!pos) return null;
          const isHovered = hoveredId === msg.id;
          const isFocused = focusedId === msg.id;
          const isDragging = dragId === msg.id;
          const isLifted = isHovered || isFocused || isDragging;
          const hasDrawing = (msg as Record<string, unknown>).drawing;
          const sticks = repliesByParent.get(msg.id) || [];
          const sticksCount = sticks.length;
          const isExpanded = expandedId === msg.id;

          const handleCardClick = () => {
            if (didDrag.current) return;
            if (!isTouchDevice.current) {
              onCardClick?.(msg);
              return;
            }
            if (isFocused) {
              onCardClick?.(msg);
              return;
            }
            setFocusedId(msg.id);
          };

          return (
            <div key={msg.id}>
              <motion.div
                data-card
                onMouseEnter={() => setHoveredId(msg.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={handleCardClick}
                onMouseDown={(e) => handleCardDragStart(e, i)}
                className="absolute flex flex-col justify-between p-5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: isLifted ? 1.06 : 1,
                  rotate: isLifted ? 0 : pos.rot,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: pos.w,
                  minHeight: 140,
                  backgroundColor: msg.color || "#ffffff",
                  fontFamily: font,
                  cursor: isDragging ? "grabbing" : "grab",
                  zIndex: isDragging ? 200 : isExpanded ? 150 : isLifted ? 100 : i,
                  boxShadow: isDragging
                    ? "0 30px 60px rgba(0,0,0,0.25)"
                    : isLifted
                      ? "0 20px 40px rgba(0,0,0,0.18)"
                      : "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {hasDrawing ? (
                  <StrokeRenderer
                    strokes={JSON.parse(hasDrawing as string)}
                    className="w-full"
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-gray-800">
                    {msg.content}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between pt-3">
                  <p className="text-[11px] text-gray-700/60">{msg.author_name}</p>
                  <div className="flex items-center gap-1.5">
                    {sticksCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(isExpanded ? null : msg.id);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                          isExpanded
                            ? "bg-black text-white"
                            : "bg-black/5 text-gray-500 hover:bg-black/10"
                        }`}
                      >
                        <ArrowBendLeftDown size={10} weight="bold" />
                        {sticksCount} {sticksCount === 1 ? "stick" : "sticks"}
                      </button>
                    )}
                    {onReplyTo && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReplyTo(msg);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-gray-500 transition-colors hover:bg-black/10 hover:text-gray-700"
                      >
                        <ArrowBendLeftDown size={11} weight="bold" />
                        Stick
                      </button>
                    )}
                  </div>
                </div>
                <div className="pt-1.5">
                  <EmojiReactions
                    messageId={msg.id}
                    reactions={reactionCounts?.[msg.id] || []}
                  />
                </div>
              </motion.div>

              {/* Expanded sticks */}
              <AnimatePresence>
                {isExpanded && sticks.map((reply, ri) => {
                  const replyDrawing = (reply as Record<string, unknown>).drawing;
                  const offsetX = pos.w + 16;
                  const offsetY = ri * 160;

                  return (
                    <motion.div
                      key={reply.id}
                      data-card
                      initial={{ opacity: 0, x: pos.x + offsetX - 30, y: pos.y + offsetY, scale: 0.85 }}
                      animate={{ opacity: 1, x: pos.x + offsetX, y: pos.y + offsetY, scale: 1 }}
                      exit={{ opacity: 0, x: pos.x + offsetX - 30, scale: 0.85 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30, delay: ri * 0.05 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCardClick?.(reply);
                      }}
                      className="absolute flex flex-col justify-between p-4"
                      style={{
                        width: pos.w - 20,
                        minHeight: 120,
                        backgroundColor: reply.color || "#ffffff",
                        fontFamily: font,
                        zIndex: 151 + ri,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                        cursor: "pointer",
                      }}
                    >
                      <div className="mb-1.5 flex items-center gap-1 text-[10px] text-gray-400">
                        <ArrowBendLeftDown size={10} weight="bold" />
                        <span>
                          sticking to{" "}
                          <span className="font-medium text-gray-500">{msg.author_name}</span>
                        </span>
                      </div>
                      {replyDrawing ? (
                        <StrokeRenderer
                          strokes={JSON.parse(replyDrawing as string)}
                          className="w-full"
                        />
                      ) : (
                        <p className="text-sm leading-relaxed text-gray-800">
                          {reply.content}
                        </p>
                      )}
                      <p className="mt-auto pt-2 text-[11px] text-gray-700/60">{reply.author_name}</p>
                      <div className="pt-1.5">
                        <EmojiReactions
                          messageId={reply.id}
                          reactions={reactionCounts?.[reply.id] || []}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      {/* Zoom controls — desktop only */}
      <div className="fixed bottom-6 right-24 z-30 hidden items-center gap-1 rounded-full bg-white/80 px-1 py-1 shadow-md backdrop-blur-md md:flex">
        <button
          onClick={() => doZoom(-1)}
          className="flex size-7 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
        >
          <Minus size={14} weight="bold" />
        </button>
        <span className="min-w-[3rem] text-center text-xs font-medium text-gray-600">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => doZoom(1)}
          className="flex size-7 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
        >
          <Plus size={14} weight="bold" />
        </button>
      </div>

      {/* Message count — desktop only */}
      <div className="fixed right-6 top-6 z-30 hidden rounded-full bg-white/80 px-4 py-2 shadow-md backdrop-blur-md md:block">
        <span className="text-xs font-semibold text-gray-700">
          {messages.length} {messages.length === 1 ? "message" : "good vibes shared"}
        </span>
      </div>

      {/* Pan hint — responsive */}
      <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-black/60 px-4 py-2 text-xs text-white/60 backdrop-blur-md">
        <span className="hidden md:inline">To Navigate Canvas</span>
        <span className="hidden rounded-md bg-white/10 px-2 py-0.5 font-medium text-white/80 md:inline">
          Scroll
        </span>
        <span className="hidden md:inline">or</span>
        <span className="hidden rounded-md bg-white/10 px-2 py-0.5 font-medium text-white/80 md:inline">
          Click + Drag
        </span>
        <span className="md:hidden">Drag to pan · Pinch to zoom</span>
      </div>
    </div>
    </EmojiPickerProvider>
  );
}
