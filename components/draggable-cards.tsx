"use client";

import { useState, useRef, useCallback } from "react";

type Card = {
  id: number;
  text: string;
  author: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  drawing?: string;
};

const cardColors = [
  "#a5f3fc", "#ffffff", "#fbcfe8", "#fed7aa",
  "#d9f99d", "#ddd6fe", "#bfdbfe", "#fef3c7",
];

const initialCards: Card[] = [
  { id: 1, text: "Congratulations! So proud of everything you've achieved.", author: "Sarah", color: cardColors[0], x: 3, y: 2, rotation: -3, width: 160 },
  { id: 2, text: "", author: "Anonymous", color: cardColors[1], x: 35, y: 0, rotation: 2, width: 120, drawing: "M20,40 C25,10 45,10 50,40 C55,10 75,10 80,40 L50,70 Z" },
  { id: 3, text: "Wishing you all the best on this new chapter of your life!", author: "James", color: cardColors[2], x: 60, y: 3, rotation: -2, width: 160 },
  { id: 4, text: "how did you get this good bruv..this is excellence", author: "Anonymous", color: cardColors[0], x: 8, y: 28, rotation: 3, width: 155 },
  { id: 5, text: "Super cool idea!", author: "Anonymous", color: cardColors[3], x: 55, y: 26, rotation: -4, width: 135 },
  { id: 6, text: "Cut Soap for me", author: "Anonymous", color: cardColors[3], x: 3, y: 52, rotation: -2, width: 145 },
  { id: 7, text: "", author: "Ola", color: cardColors[1], x: 33, y: 50, rotation: 1, width: 120, drawing: "M15,50 Q30,20 50,50 Q70,80 85,50 M25,35 C30,25 40,25 45,35 M55,35 C60,25 70,25 75,35" },
  { id: 8, text: "Y'all cooked. This is amazing!", author: "Anonymous", color: cardColors[1], x: 58, y: 53, rotation: 2, width: 155 },
  { id: 9, text: "heyy", author: "Anonymous", color: cardColors[5], x: 30, y: 76, rotation: -1, width: 110 },
  { id: 10, text: "", author: "Anonymous", color: cardColors[6], x: 55, y: 75, rotation: -3, width: 120, drawing: "M25,60 Q50,15 75,60 M35,55 Q50,30 65,55 M45,50 Q50,40 55,50" },
];

export function DraggableCards({ font, topOffset = 100 }: { font: string; topOffset?: number }) {
  const [cards, setCards] = useState(initialCards);
  const [topZ, setTopZ] = useState(initialCards.length + 1);
  const [zMap, setZMap] = useState<Record<number, number>>(() => {
    const m: Record<number, number> = {};
    initialCards.forEach((c, i) => { m[c.id] = i + 1; });
    return m;
  });

  const dragging = useRef<{ id: number; startX: number; startY: number; cardX: number; cardY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const bringToFront = useCallback((id: number) => {
    setTopZ((prev) => {
      const next = prev + 1;
      setZMap((m) => ({ ...m, [id]: next }));
      return next;
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, card: Card) => {
    e.preventDefault();
    bringToFront(card.id);
    dragging.current = {
      id: card.id,
      startX: e.clientX,
      startY: e.clientY,
      cardX: card.x,
      cardY: card.y,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      const d = dragging.current;
      if (!d || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx = ((ev.clientX - d.startX) / rect.width) * 100;
      const dy = ((ev.clientY - d.startY) / rect.height) * 100;
      const newX = d.cardX + dx;
      const newY = d.cardY + dy;
      const targetId = d.id;
      setCards((prev) =>
        prev.map((c) =>
          c.id === targetId ? { ...c, x: newX, y: newY } : c
        )
      );
    };

    const handleMouseUp = () => {
      dragging.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [bringToFront]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" style={{ top: topOffset }}>
      {cards.map((card) => (
        <div
          key={card.id}
          onMouseDown={(e) => handleMouseDown(e, card)}
          className="absolute flex cursor-grab select-none flex-col justify-between rounded-sm p-3.5 shadow-sm transition-shadow active:cursor-grabbing active:shadow-lg"
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
            width: card.width,
            minHeight: 115,
            backgroundColor: card.color,
            transform: `rotate(${card.rotation}deg)`,
            zIndex: zMap[card.id] ?? 1,
            fontFamily: font,
          }}
        >
          <div className="flex-1">
            {card.drawing ? (
              <svg viewBox="0 0 100 90" className="h-full w-full" fill="none">
                <path d={card.drawing} stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <p className="text-[13px] leading-snug text-gray-800">{card.text}</p>
            )}
          </div>
          <p className="mt-2 text-[11px] text-gray-400">{card.author}</p>
        </div>
      ))}
    </div>
  );
}
