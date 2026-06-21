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
  { id: 1, text: "Congratulations! So proud of everything you've achieved.", author: "Sarah", color: cardColors[0], x: 5, y: 8, rotation: -4, width: 180 },
  { id: 2, text: "", author: "Anonymous", color: cardColors[1], x: 30, y: 5, rotation: 2, width: 140, drawing: "M20,40 C25,10 45,10 50,40 C55,10 75,10 80,40 L50,70 Z" },
  { id: 3, text: "Wishing you all the best on this new chapter of your life!", author: "James", color: cardColors[2], x: 55, y: 12, rotation: -2, width: 190 },
  { id: 4, text: "how did you get this good bruv..this is excellence", author: "Anonymous", color: cardColors[0], x: 15, y: 35, rotation: 3, width: 170 },
  { id: 5, text: "Super cool idea!", author: "Anonymous", color: cardColors[3], x: 60, y: 30, rotation: -5, width: 150 },
  { id: 6, text: "", author: "Ola", color: cardColors[1], x: 35, y: 50, rotation: 1, width: 180, drawing: "M15,50 Q30,20 50,50 Q70,80 85,50 M25,35 C30,25 40,25 45,35 M55,35 C60,25 70,25 75,35" },
  { id: 7, text: "Cut Soap for me", author: "Anonymous", color: cardColors[3], x: 8, y: 58, rotation: -3, width: 160 },
  { id: 8, text: "", author: "frank", color: cardColors[4], x: 50, y: 55, rotation: 4, width: 155, drawing: "M30,70 L50,20 L70,70 M38,50 L62,50 M50,70 L50,85" },
  { id: 9, text: "heyy", author: "Anonymous", color: cardColors[5], x: 72, y: 48, rotation: -1, width: 120 },
  { id: 10, text: "Y'all cooked. This is amazing!", author: "Anonymous", color: cardColors[1], x: 25, y: 72, rotation: 2, width: 185 },
  { id: 11, text: "", author: "Anonymous", color: cardColors[6], x: 58, y: 75, rotation: -4, width: 150, drawing: "M25,60 Q50,15 75,60 M35,55 Q50,30 65,55 M45,50 Q50,40 55,50" },
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
          className="absolute flex cursor-grab select-none flex-col justify-between p-4 shadow-md transition-shadow active:cursor-grabbing active:shadow-xl"
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
            width: card.width,
            minHeight: 140,
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
              <p className="text-sm leading-snug text-gray-800">{card.text}</p>
            )}
          </div>
          <p className="mt-3 text-xs text-gray-500">{card.author}</p>
        </div>
      ))}
    </div>
  );
}
