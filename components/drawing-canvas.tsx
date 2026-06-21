"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Eraser, ArrowCounterClockwise } from "@phosphor-icons/react";

type Stroke = {
  points: [number, number][];
  color: string;
  width: number;
};

type DrawingCanvasProps = {
  width?: number;
  height?: number;
  strokeColor?: string;
  onDrawingChange: (strokes: Stroke[]) => void;
  strokes: Stroke[];
};

export type { Stroke };

const inkColors = [
  "#1e293b", "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899",
];

export function DrawingCanvas({
  width = 400,
  height = 260,
  strokeColor: initialColor = "#1e293b",
  onDrawingChange,
  strokes,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<[number, number][]>([]);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState(initialColor);

  const widths = [2, 3, 5, 8];

  const getPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent): [number, number] => {
      const canvas = canvasRef.current;
      if (!canvas) return [0, 0];
      const rect = canvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      if ("touches" in e) {
        const touch = e.touches[0];
        return [
          (touch.clientX - rect.left) * scaleX,
          (touch.clientY - rect.top) * scaleY,
        ];
      }
      return [
        (e.clientX - rect.left) * scaleX,
        (e.clientY - rect.top) * scaleY,
      ];
    },
    [width, height]
  );

  const redraw = useCallback(
    (ctx: CanvasRenderingContext2D, allStrokes: Stroke[], active?: [number, number][]) => {
      ctx.clearRect(0, 0, width, height);

      const drawStroke = (points: [number, number][], color: string, w: number) => {
        if (points.length < 2) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const mid: [number, number] = [
            (prev[0] + curr[0]) / 2,
            (prev[1] + curr[1]) / 2,
          ];
          ctx.quadraticCurveTo(prev[0], prev[1], mid[0], mid[1]);
        }
        ctx.stroke();
      };

      for (const s of allStrokes) {
        drawStroke(s.points, s.color, s.width);
      }
      if (active && active.length > 1) {
        drawStroke(active, strokeColor, strokeWidth);
      }
    },
    [width, height, strokeColor, strokeWidth]
  );

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) redraw(ctx, strokes);
  }, [strokes, redraw]);

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);
      const pos = getPos(e);
      setCurrentStroke([pos]);
    },
    [getPos]
  );

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      setCurrentStroke((prev) => {
        const next = [...prev, pos];
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) redraw(ctx, strokes, next);
        return next;
      });
    },
    [isDrawing, getPos, strokes, redraw]
  );

  const handleEnd = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length > 1) {
      const newStroke: Stroke = {
        points: currentStroke,
        color: strokeColor,
        width: strokeWidth,
      };
      onDrawingChange([...strokes, newStroke]);
    }
    setCurrentStroke([]);
  }, [isDrawing, currentStroke, strokeColor, strokeWidth, strokes, onDrawingChange]);

  const undo = () => {
    if (strokes.length === 0) return;
    onDrawingChange(strokes.slice(0, -1));
  };

  const clear = () => {
    onDrawingChange([]);
  };

  return (
    <div className="flex flex-col">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full cursor-crosshair touch-none"
        style={{ aspectRatio: `${width}/${height}` }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />

      {/* Drawing tools */}
      <div className="mt-3 flex items-center justify-between px-4">
        {/* Ink colors */}
        <div className="flex items-center gap-1.5">
          {inkColors.map((c) => (
            <button
              key={c}
              onClick={() => setStrokeColor(c)}
              className={`size-5 rounded-full border-2 transition-transform hover:scale-110 ${
                strokeColor === c ? "border-gray-800 scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Brush weight + actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="size-3 rounded-full"
              style={{
                backgroundColor: strokeColor,
                transform: `scale(${0.5 + (strokeWidth / 12)})`,
              }}
            />
            <input
              type="range"
              min={1}
              max={12}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-gray-300 accent-gray-800"
            />
          </div>

          <div className="h-4 w-px bg-gray-300" />

          <div className="flex items-center gap-0.5">
            <button
              onClick={undo}
              disabled={strokes.length === 0}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-800/10 hover:text-gray-700 disabled:opacity-30"
            >
              <ArrowCounterClockwise size={16} />
            </button>
            <button
              onClick={clear}
              disabled={strokes.length === 0}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-800/10 hover:text-gray-700 disabled:opacity-30"
            >
              <Eraser size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StrokeRenderer({
  strokes,
  width = 400,
  height = 260,
  className,
}: {
  strokes: Stroke[];
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
    >
      {strokes.map((stroke, i) => {
        if (stroke.points.length < 2) return null;
        let d = `M${stroke.points[0][0]},${stroke.points[0][1]}`;
        for (let j = 1; j < stroke.points.length; j++) {
          const prev = stroke.points[j - 1];
          const curr = stroke.points[j];
          const mid = [
            (prev[0] + curr[0]) / 2,
            (prev[1] + curr[1]) / 2,
          ];
          d += ` Q${prev[0]},${prev[1]} ${mid[0]},${mid[1]}`;
        }
        return (
          <path
            key={i}
            d={d}
            stroke={stroke.color}
            strokeWidth={stroke.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
}
