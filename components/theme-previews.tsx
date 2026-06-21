export function ThemePreview({ id }: { id: string }) {
  switch (id) {
    case "solid":
      return (
        <svg viewBox="0 0 500 700" className="size-full" preserveAspectRatio="xMidYMid slice">
          <rect width="500" height="700" fill="#18181b" />
        </svg>
      );
    case "midnight":
      return (
        <svg viewBox="0 0 500 700" className="size-full" preserveAspectRatio="xMidYMid slice">
          <rect width="500" height="700" fill="#0f172a" />
          {/* Moon with soft glow */}
          <circle cx="380" cy="110" r="70" fill="#fde68a" opacity="0.04" />
          <circle cx="380" cy="110" r="50" fill="#fde68a" opacity="0.9" />
          <circle cx="400" cy="95" r="42" fill="#0f172a" />
          {/* Stars — just twinkling, no movement */}
          {[
            { cx: 45, cy: 55, r: 1.5 }, { cx: 120, cy: 28, r: 2 },
            { cx: 200, cy: 75, r: 1.2 }, { cx: 280, cy: 40, r: 1.8 },
            { cx: 450, cy: 65, r: 1.5 }, { cx: 75, cy: 140, r: 1 },
            { cx: 230, cy: 115, r: 1.5 }, { cx: 420, cy: 170, r: 1.2 },
            { cx: 155, cy: 195, r: 1.8 }, { cx: 340, cy: 220, r: 1 },
            { cx: 55, cy: 280, r: 1.5 }, { cx: 460, cy: 260, r: 1.2 },
            { cx: 190, cy: 160, r: 2 }, { cx: 95, cy: 240, r: 1 },
            { cx: 310, cy: 130, r: 1.3 }, { cx: 480, cy: 140, r: 0.8 },
            { cx: 30, cy: 180, r: 1 }, { cx: 370, cy: 300, r: 1.2 },
            { cx: 250, cy: 280, r: 0.8 }, { cx: 140, cy: 320, r: 1 },
          ].map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={i % 5 === 0 ? "#c4b5fd" : "white"}
              opacity={0.4 + (i % 4) * 0.15}>
              <animate attributeName="opacity" values={`${0.4 + (i % 4) * 0.15};${0.15};${0.4 + (i % 4) * 0.15}`} dur={`${3 + (i % 5) * 1.5}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {/* Layered hills — static */}
          <path d="M0 480 Q60 420 140 460 Q240 510 340 440 Q420 390 500 430 V700 H0Z" fill="#162033" />
          <path d="M0 530 Q100 490 200 520 Q300 550 400 500 Q460 480 500 500 V700 H0Z" fill="#1a2740" />
          <path d="M0 580 Q120 550 250 570 Q380 590 500 560 V700 H0Z" fill="#1e2d4a" />
          {/* A few soft fireflies — gentle pulse only */}
          {[
            { cx: 150, cy: 500 },
            { cx: 320, cy: 480 },
            { cx: 420, cy: 520 },
          ].map((f, i) => (
            <circle key={i} cx={f.cx} cy={f.cy} r={2.5} fill="#fde68a">
              <animate attributeName="opacity" values="0.6;0.1;0.6" dur={`${3 + i}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      );
    case "aurora":
      return (
        <svg viewBox="0 0 500 700" className="size-full" preserveAspectRatio="xMidYMid slice">
          <rect width="500" height="700" fill="#0c0a20" />
          {/* Stars */}
          {[40, 100, 180, 260, 340, 420, 70, 150, 300, 450].map((cx, i) => (
            <circle key={i} cx={cx} cy={20 + i * 12} r={1 + (i % 3) * 0.5} fill="white" opacity={0.3 + (i % 4) * 0.15} />
          ))}
          {/* Aurora ribbons */}
          <path d="M0 150 Q125 100 250 150 Q375 200 500 120" stroke="#4ade80" strokeWidth="30" fill="none" opacity="0.2">
            <animate attributeName="d" values="M0 150 Q125 100 250 150 Q375 200 500 120;M0 130 Q125 200 250 120 Q375 60 500 160;M0 150 Q125 100 250 150 Q375 200 500 120" dur="6s" repeatCount="indefinite" />
          </path>
          <path d="M0 180 Q125 130 250 180 Q375 230 500 160" stroke="#a78bfa" strokeWidth="24" fill="none" opacity="0.18">
            <animate attributeName="d" values="M0 180 Q125 130 250 180 Q375 230 500 160;M0 160 Q125 230 250 150 Q375 80 500 190;M0 180 Q125 130 250 180 Q375 230 500 160" dur="5s" repeatCount="indefinite" />
          </path>
          <path d="M0 210 Q125 170 250 210 Q375 250 500 190" stroke="#22d3ee" strokeWidth="18" fill="none" opacity="0.15">
            <animate attributeName="d" values="M0 210 Q125 170 250 210 Q375 250 500 190;M0 195 Q125 250 250 190 Q375 140 500 220;M0 210 Q125 170 250 210 Q375 250 500 190" dur="7s" repeatCount="indefinite" />
          </path>
          <path d="M0 240 Q125 210 250 240 Q375 270 500 220" stroke="#4ade80" strokeWidth="12" fill="none" opacity="0.1">
            <animate attributeName="d" values="M0 240 Q125 210 250 240 Q375 270 500 220;M0 230 Q125 270 250 225 Q375 180 500 250;M0 240 Q125 210 250 240 Q375 270 500 220" dur="8s" repeatCount="indefinite" />
          </path>
          {/* Mountains */}
          <polygon points="0,700 0,420 80,350 150,400 220,320 300,380 370,300 430,370 500,340 500,700" fill="#1a1640" />
          {/* Lake */}
          <rect x="0" y="580" width="500" height="120" fill="#0c0a20" opacity="0.5" />
          <rect x="30" y="600" width="440" height="60" rx="20" fill="#4ade80" opacity="0.04">
            <animate attributeName="opacity" values="0.04;0.08;0.04" dur="4s" repeatCount="indefinite" />
          </rect>
          <rect x="80" y="620" width="340" height="30" rx="15" fill="#a78bfa" opacity="0.03">
            <animate attributeName="opacity" values="0.03;0.06;0.03" dur="5s" repeatCount="indefinite" />
          </rect>
        </svg>
      );
    case "noir":
      return (
        <svg viewBox="0 0 500 700" className="size-full" preserveAspectRatio="xMidYMid slice">
          <rect width="500" height="700" fill="#09090b" />
          {/* Grid */}
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 50} x2="500" y2={i * 50} stroke="#27272a" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="700" stroke="#27272a" strokeWidth="0.5" />
          ))}
          {/* Central glow */}
          <circle cx="250" cy="350" r="120" fill="white" opacity="0.02" />
          <circle cx="250" cy="350" r="70" fill="white" opacity="0.03">
            <animate attributeName="r" values="70;90;70" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.03;0.06;0.03" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="250" cy="350" r="30" fill="white" opacity="0.04">
            <animate attributeName="r" values="30;45;30" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.04;0.08;0.04" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* Dot accents at grid intersections */}
          {[
            { cx: 100, cy: 150 }, { cx: 300, cy: 200 }, { cx: 200, cy: 350 },
            { cx: 400, cy: 300 }, { cx: 150, cy: 500 }, { cx: 350, cy: 450 },
            { cx: 250, cy: 550 }, { cx: 100, cy: 400 }, { cx: 400, cy: 550 },
          ].map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={2} fill="white" opacity={0.1 + (i % 3) * 0.05}>
              <animate attributeName="opacity" values={`${0.1 + (i % 3) * 0.05};${0.2 + (i % 3) * 0.05};${0.1 + (i % 3) * 0.05}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      );
    case "deepsea":
      return (
        <svg viewBox="0 0 500 700" className="size-full" preserveAspectRatio="xMidYMid slice">
          <rect width="500" height="700" fill="#042f2e" />
          {/* Caustics */}
          <ellipse cx="150" cy="120" rx="120" ry="50" fill="#0d9488" opacity="0.1">
            <animate attributeName="rx" values="120;150;120" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.1;0.2;0.1" dur="5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="350" cy="250" rx="100" ry="40" fill="#06b6d4" opacity="0.08">
            <animate attributeName="rx" values="100;130;100" dur="4.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.08;0.15;0.08" dur="4.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="200" cy="400" rx="90" ry="35" fill="#0d9488" opacity="0.06">
            <animate attributeName="rx" values="90;120;90" dur="6s" repeatCount="indefinite" />
          </ellipse>
          {/* Bubbles */}
          {[
            { cx: 80, start: 650, r: 5, dur: "7s" },
            { cx: 200, start: 680, r: 3.5, dur: "6s" },
            { cx: 320, start: 660, r: 4, dur: "8s" },
            { cx: 420, start: 670, r: 3, dur: "5.5s" },
            { cx: 150, start: 690, r: 2.5, dur: "9s" },
            { cx: 380, start: 640, r: 4.5, dur: "7.5s" },
          ].map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.start} r={b.r} fill="#5eead4" opacity="0.2">
              <animate attributeName="cy" values={`${b.start};50`} dur={b.dur} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0" dur={b.dur} repeatCount="indefinite" />
            </circle>
          ))}
          {/* Jellyfish */}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-20;0,0" dur="4s" repeatCount="indefinite" />
            <ellipse cx="350" cy="380" rx="30" ry="18" fill="#2dd4bf" opacity="0.2" />
            <ellipse cx="350" cy="380" rx="20" ry="12" fill="#5eead4" opacity="0.15" />
            {[335, 342, 350, 358, 365].map((x, i) => (
              <line key={i} x1={x} y1="398" x2={x + (i % 2 ? 3 : -3)} y2="440" stroke="#2dd4bf" strokeWidth="1" opacity="0.15">
                <animate attributeName="x2" values={`${x + (i % 2 ? 3 : -3)};${x + (i % 2 ? -3 : 3)};${x + (i % 2 ? 3 : -3)}`} dur="3s" repeatCount="indefinite" />
              </line>
            ))}
          </g>
          {/* Small jellyfish */}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-15;0,0" dur="5s" repeatCount="indefinite" />
            <ellipse cx="130" cy="500" rx="18" ry="10" fill="#2dd4bf" opacity="0.15" />
            {[120, 127, 134, 141].map((x, i) => (
              <line key={i} x1={x} y1="510" x2={x + (i % 2 ? 2 : -2)} y2="540" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.1" />
            ))}
          </g>
          {/* Seaweed */}
          {[60, 440, 250].map((x, i) => (
            <path key={i} d={`M${x} 700 Q${x - 15} 620 ${x + 10} 570 Q${x - 10} 520 ${x + 5} 480`} stroke="#0f766e" strokeWidth="3" fill="none" opacity="0.3">
              <animate attributeName="d" values={`M${x} 700 Q${x - 15} 620 ${x + 10} 570 Q${x - 10} 520 ${x + 5} 480;M${x} 700 Q${x + 15} 620 ${x - 10} 570 Q${x + 10} 520 ${x - 5} 480;M${x} 700 Q${x - 15} 620 ${x + 10} 570 Q${x - 10} 520 ${x + 5} 480`} dur={`${4 + i}s`} repeatCount="indefinite" />
            </path>
          ))}
        </svg>
      );
    case "ember":
      return (
        <svg viewBox="0 0 500 700" className="size-full" preserveAspectRatio="xMidYMid slice">
          <rect width="500" height="700" fill="#1c1007" />
          {/* Background glow */}
          <circle cx="250" cy="550" r="200" fill="#f97316" opacity="0.05" />
          <circle cx="250" cy="550" r="120" fill="#ef4444" opacity="0.06">
            <animate attributeName="opacity" values="0.06;0.12;0.06" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Large flames */}
          <path d="M200 620 Q180 500 220 420 Q190 320 250 220 Q310 320 280 420 Q320 500 300 620Z" fill="#f97316" opacity="0.4">
            <animate attributeName="d" values="M200 620 Q180 500 220 420 Q190 320 250 220 Q310 320 280 420 Q320 500 300 620Z;M205 620 Q175 500 225 410 Q185 310 250 200 Q315 310 275 410 Q325 500 295 620Z;M200 620 Q180 500 220 420 Q190 320 250 220 Q310 320 280 420 Q320 500 300 620Z" dur="1.8s" repeatCount="indefinite" />
          </path>
          <path d="M220 620 Q210 520 235 450 Q215 370 250 280 Q285 370 265 450 Q290 520 280 620Z" fill="#fbbf24" opacity="0.5">
            <animate attributeName="d" values="M220 620 Q210 520 235 450 Q215 370 250 280 Q285 370 265 450 Q290 520 280 620Z;M225 620 Q205 520 240 440 Q210 360 250 260 Q290 360 260 440 Q295 520 275 620Z;M220 620 Q210 520 235 450 Q215 370 250 280 Q285 370 265 450 Q290 520 280 620Z" dur="1.4s" repeatCount="indefinite" />
          </path>
          <path d="M235 620 Q230 540 242 480 Q232 420 250 350 Q268 420 258 480 Q270 540 265 620Z" fill="#fef3c7" opacity="0.4">
            <animate attributeName="d" values="M235 620 Q230 540 242 480 Q232 420 250 350 Q268 420 258 480 Q270 540 265 620Z;M238 620 Q228 540 245 470 Q228 410 250 330 Q272 410 255 470 Q272 540 262 620Z;M235 620 Q230 540 242 480 Q232 420 250 350 Q268 420 258 480 Q270 540 265 620Z" dur="1.1s" repeatCount="indefinite" />
          </path>
          {/* Sparks */}
          {[
            { cx: 180, cy: 350, dur: "2.5s", endY: 100 },
            { cx: 320, cy: 300, dur: "3s", endY: 60 },
            { cx: 220, cy: 280, dur: "2s", endY: 50 },
            { cx: 300, cy: 330, dur: "2.8s", endY: 80 },
            { cx: 150, cy: 400, dur: "3.5s", endY: 120 },
            { cx: 350, cy: 380, dur: "2.2s", endY: 90 },
            { cx: 260, cy: 250, dur: "2.6s", endY: 40 },
            { cx: 190, cy: 420, dur: "3.2s", endY: 150 },
          ].map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={i % 3 === 0 ? 2.5 : 1.5} fill={i % 2 === 0 ? "#fbbf24" : "#fde68a"} opacity="0.7">
              <animate attributeName="cy" values={`${s.cy};${s.endY}`} dur={s.dur} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0" dur={s.dur} repeatCount="indefinite" />
            </circle>
          ))}
          {/* Logs */}
          <line x1="140" y1="640" x2="360" y2="620" stroke="#78350f" strokeWidth="12" strokeLinecap="round" />
          <line x1="130" y1="620" x2="370" y2="640" stroke="#92400e" strokeWidth="12" strokeLinecap="round" />
          <line x1="170" y1="650" x2="330" y2="645" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    case "autumn":
      return (
        <svg viewBox="0 0 500 700" className="size-full" preserveAspectRatio="xMidYMid slice">
          <rect width="500" height="700" fill="#fef9ee" />
          {/* Sky gradient */}
          <rect width="500" height="400" fill="#fef3c7" opacity="0.3" />
          {/* Tree */}
          <line x1="250" y1="650" x2="250" y2="280" stroke="#92400e" strokeWidth="16" strokeLinecap="round" />
          <line x1="250" y1="350" x2="180" y2="270" stroke="#92400e" strokeWidth="8" strokeLinecap="round" />
          <line x1="250" y1="320" x2="330" y2="240" stroke="#92400e" strokeWidth="8" strokeLinecap="round" />
          <line x1="250" y1="400" x2="170" y2="350" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
          <line x1="250" y1="380" x2="340" y2="320" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
          {/* Canopy */}
          <circle cx="250" cy="220" r="80" fill="#f97316" opacity="0.5" />
          <circle cx="200" cy="260" r="60" fill="#ea580c" opacity="0.4" />
          <circle cx="310" cy="240" r="65" fill="#dc2626" opacity="0.35" />
          <circle cx="170" cy="230" r="45" fill="#fbbf24" opacity="0.3" />
          <circle cx="330" cy="210" r="50" fill="#f97316" opacity="0.3" />
          {/* Falling leaves */}
          {[
            { cx: 100, cy: 100, fill: "#f97316", dur: "4s", dx: 40 },
            { cx: 400, cy: 60, fill: "#dc2626", dur: "5s", dx: -30 },
            { cx: 300, cy: 80, fill: "#fbbf24", dur: "4.5s", dx: -20 },
            { cx: 150, cy: 140, fill: "#ea580c", dur: "5.5s", dx: 35 },
            { cx: 350, cy: 120, fill: "#f97316", dur: "3.8s", dx: -25 },
            { cx: 200, cy: 50, fill: "#fbbf24", dur: "6s", dx: 30 },
            { cx: 450, cy: 150, fill: "#dc2626", dur: "4.2s", dx: -40 },
            { cx: 60, cy: 180, fill: "#ea580c", dur: "5.2s", dx: 25 },
          ].map((l, i) => (
            <ellipse key={i} cx={l.cx} cy={l.cy} rx={6} ry={4} fill={l.fill} opacity="0.7">
              <animateTransform attributeName="transform" type="translate" values={`0,0;${l.dx},300;${l.dx * 2},550`} dur={l.dur} repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" values="0;180;360" dur={l.dur} repeatCount="indefinite" additive="sum" />
            </ellipse>
          ))}
          {/* Ground */}
          <ellipse cx="250" cy="660" rx="220" ry="30" fill="#fed7aa" opacity="0.5" />
        </svg>
      );
    case "spring":
      return (
        <svg viewBox="0 0 500 700" className="size-full" preserveAspectRatio="xMidYMid slice">
          <rect width="500" height="700" fill="#f0fdf4" />
          {/* Sun */}
          <circle cx="400" cy="80" r="50" fill="#fde68a" opacity="0.6" />
          {/* Clouds */}
          <g opacity="0.3">
            <ellipse cx="120" cy="100" rx="50" ry="20" fill="#bbf7d0" />
            <ellipse cx="350" cy="150" rx="60" ry="22" fill="#bbf7d0" />
          </g>
          {/* Grass */}
          <rect x="0" y="480" width="500" height="220" fill="#bbf7d0" />
          <path d="M0 480 Q50 460 100 480 Q150 500 200 480 Q250 460 300 480 Q350 500 400 480 Q450 460 500 480 V480 H0Z" fill="#86efac" opacity="0.5" />
          {/* Flowers */}
          {[
            { x: 60, y: 460, r: 14, color: "#f9a8d4", stemH: 80 },
            { x: 150, y: 440, r: 18, color: "#f472b6", stemH: 100 },
            { x: 250, y: 450, r: 15, color: "#c084fc", stemH: 90 },
            { x: 340, y: 435, r: 16, color: "#f9a8d4", stemH: 105 },
            { x: 430, y: 455, r: 13, color: "#a78bfa", stemH: 75 },
            { x: 100, y: 520, r: 10, color: "#f472b6", stemH: 60 },
            { x: 300, y: 510, r: 12, color: "#c084fc", stemH: 70 },
            { x: 400, y: 530, r: 11, color: "#f9a8d4", stemH: 50 },
          ].map((f, i) => (
            <g key={i}>
              <line x1={f.x} y1={f.y + f.r} x2={f.x} y2={f.y + f.r + f.stemH} stroke="#4ade80" strokeWidth="3" />
              <circle cx={f.x} cy={f.y} r={f.r} fill={f.color} opacity="0.7" />
              <circle cx={f.x} cy={f.y} r={f.r * 0.4} fill="#fbbf24" />
            </g>
          ))}
          {/* Butterflies */}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;30,-20;60,0;30,20;0,0" dur="6s" repeatCount="indefinite" />
            <ellipse cx="180" cy="300" rx="12" ry="8" fill="#f9a8d4" opacity="0.7" transform="rotate(-20 180 300)" />
            <ellipse cx="195" cy="300" rx="12" ry="8" fill="#c084fc" opacity="0.7" transform="rotate(20 195 300)" />
          </g>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;-20,15;-40,0;-20,-15;0,0" dur="5s" repeatCount="indefinite" />
            <ellipse cx="350" cy="250" rx="10" ry="6" fill="#a78bfa" opacity="0.6" transform="rotate(-15 350 250)" />
            <ellipse cx="363" cy="250" rx="10" ry="6" fill="#f9a8d4" opacity="0.6" transform="rotate(15 363 250)" />
          </g>
        </svg>
      );
    case "summer":
      return (
        <svg viewBox="0 0 500 700" className="size-full" preserveAspectRatio="xMidYMid slice">
          <rect width="500" height="700" fill="#fef3c7" />
          {/* Sunset sky */}
          <rect width="500" height="400" fill="#fed7aa" opacity="0.4" />
          {/* Sun */}
          <circle cx="380" cy="120" r="70" fill="#fb923c" opacity="0.7" />
          <circle cx="380" cy="120" r="50" fill="#fbbf24" opacity="0.9" />
          {/* Clouds */}
          <ellipse cx="100" cy="100" rx="45" ry="15" fill="white" opacity="0.3" />
          <ellipse cx="250" cy="70" rx="55" ry="18" fill="white" opacity="0.25" />
          {/* Ocean waves */}
          <path d="M0 420 Q50 400 100 420 Q150 440 200 420 Q250 400 300 420 Q350 440 400 420 Q450 400 500 420 V700 H0Z" fill="#38bdf8" opacity="0.4">
            <animate attributeName="d" values="M0 420 Q50 400 100 420 Q150 440 200 420 Q250 400 300 420 Q350 440 400 420 Q450 400 500 420 V700 H0Z;M0 430 Q50 450 100 430 Q150 410 200 430 Q250 450 300 430 Q350 410 400 430 Q450 450 500 430 V700 H0Z;M0 420 Q50 400 100 420 Q150 440 200 420 Q250 400 300 420 Q350 440 400 420 Q450 400 500 420 V700 H0Z" dur="4s" repeatCount="indefinite" />
          </path>
          <path d="M0 460 Q50 440 100 460 Q150 480 200 460 Q250 440 300 460 Q350 480 400 460 Q450 440 500 460 V700 H0Z" fill="#0ea5e9" opacity="0.5">
            <animate attributeName="d" values="M0 460 Q50 440 100 460 Q150 480 200 460 Q250 440 300 460 Q350 480 400 460 Q450 440 500 460 V700 H0Z;M0 470 Q50 490 100 470 Q150 450 200 470 Q250 490 300 470 Q350 450 400 470 Q450 490 500 470 V700 H0Z;M0 460 Q50 440 100 460 Q150 480 200 460 Q250 440 300 460 Q350 480 400 460 Q450 440 500 460 V700 H0Z" dur="3.5s" repeatCount="indefinite" />
          </path>
          <path d="M0 500 Q50 485 100 500 Q150 515 200 500 Q250 485 300 500 Q350 515 400 500 Q450 485 500 500 V700 H0Z" fill="#0284c7" opacity="0.4">
            <animate attributeName="d" values="M0 500 Q50 485 100 500 Q150 515 200 500 Q250 485 300 500 Q350 515 400 500 Q450 485 500 500 V700 H0Z;M0 508 Q50 520 100 508 Q150 495 200 508 Q250 520 300 508 Q350 495 400 508 Q450 520 500 508 V700 H0Z;M0 500 Q50 485 100 500 Q150 515 200 500 Q250 485 300 500 Q350 515 400 500 Q450 485 500 500 V700 H0Z" dur="3s" repeatCount="indefinite" />
          </path>
          {/* Palm trees */}
          <line x1="80" y1="600" x2="80" y2="300" stroke="#92400e" strokeWidth="8" strokeLinecap="round" />
          <path d="M80 300 Q40 260 20 280" stroke="#4ade80" strokeWidth="4" fill="none" />
          <path d="M80 300 Q120 250 150 270" stroke="#4ade80" strokeWidth="4" fill="none" />
          <path d="M80 300 Q50 240 25 255" stroke="#22c55e" strokeWidth="4" fill="none" />
          <path d="M80 300 Q115 240 145 250" stroke="#22c55e" strokeWidth="4" fill="none" />
          <path d="M80 300 Q80 240 75 245" stroke="#16a34a" strokeWidth="3" fill="none" />
        </svg>
      );
    case "winter":
      return (
        <svg viewBox="0 0 500 700" className="size-full" preserveAspectRatio="xMidYMid slice">
          <rect width="500" height="700" fill="#eff6ff" />
          {/* Snow ground */}
          <ellipse cx="250" cy="620" rx="280" ry="100" fill="white" />
          {/* Pine trees */}
          {[
            { x: 80, base: 560, scale: 1 },
            { x: 180, base: 540, scale: 1.2 },
            { x: 350, base: 550, scale: 1.1 },
            { x: 430, base: 560, scale: 0.9 },
          ].map((t, i) => (
            <g key={i}>
              <polygon points={`${t.x},${t.base} ${t.x - 25 * t.scale},${t.base - 40 * t.scale} ${t.x + 25 * t.scale},${t.base - 40 * t.scale}`} fill="#6ee7b7" opacity="0.5" />
              <polygon points={`${t.x},${t.base - 30 * t.scale} ${t.x - 30 * t.scale},${t.base - 80 * t.scale} ${t.x + 30 * t.scale},${t.base - 80 * t.scale}`} fill="#6ee7b7" opacity="0.6" />
              <polygon points={`${t.x},${t.base - 65 * t.scale} ${t.x - 22 * t.scale},${t.base - 110 * t.scale} ${t.x + 22 * t.scale},${t.base - 110 * t.scale}`} fill="#34d399" opacity="0.5" />
            </g>
          ))}
          {/* Snowflakes */}
          {[
            { cx: 50, start: 30, r: 4, dur: "6s" },
            { cx: 130, start: 10, r: 3, dur: "5s" },
            { cx: 220, start: 50, r: 5, dur: "7s" },
            { cx: 300, start: 20, r: 3.5, dur: "5.5s" },
            { cx: 380, start: 60, r: 4.5, dur: "8s" },
            { cx: 460, start: 40, r: 3, dur: "6.5s" },
            { cx: 80, start: 100, r: 2.5, dur: "5.5s" },
            { cx: 180, start: 120, r: 4, dur: "7.5s" },
            { cx: 350, start: 90, r: 3, dur: "6s" },
            { cx: 430, start: 130, r: 3.5, dur: "5s" },
            { cx: 250, start: 160, r: 5, dur: "8.5s" },
            { cx: 40, start: 200, r: 2, dur: "4.5s" },
          ].map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.start} r={s.r} fill={i % 2 === 0 ? "#bfdbfe" : "#dbeafe"}>
              <animate attributeName="cy" values={`${s.start};600` } dur={s.dur} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.2" dur={s.dur} repeatCount="indefinite" />
            </circle>
          ))}
          {/* Snowman */}
          <circle cx="250" cy="560" r="35" fill="white" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="250" cy="510" r="25" fill="white" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="250" cy="475" r="18" fill="white" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="243" cy="472" r="2.5" fill="#1e293b" />
          <circle cx="257" cy="472" r="2.5" fill="#1e293b" />
          <polygon points="250,477 250,482 258,480" fill="#f97316" />
          {/* Hat */}
          <rect x="238" y="454" width="24" height="3" fill="#1e293b" rx="1" />
          <rect x="242" y="440" width="16" height="14" fill="#1e293b" rx="2" />
        </svg>
      );
    case "lavender":
      return (
        <svg viewBox="0 0 500 700" className="size-full" preserveAspectRatio="xMidYMid slice">
          <rect width="500" height="700" fill="#faf5ff" />
          {/* Clouds */}
          <ellipse cx="100" cy="120" rx="70" ry="30" fill="#e9d5ff" opacity="0.4" />
          <ellipse cx="300" cy="80" rx="90" ry="35" fill="#ddd6fe" opacity="0.35" />
          <ellipse cx="420" cy="140" rx="60" ry="25" fill="#ede9fe" opacity="0.4" />
          {/* Ground */}
          <rect x="0" y="550" width="500" height="150" fill="#ede9fe" opacity="0.3" />
          {/* Lavender field */}
          {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="680" x2={x + 2} y2={480 - (i % 3) * 20} stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
              {[0, 8, 16, 24].map((dy, j) => (
                <circle key={j} cx={x + 2} cy={480 - (i % 3) * 20 + dy} r={3 + (j === 1 ? 1 : 0)} fill={j % 2 === 0 ? "#c084fc" : "#a855f7"} opacity={0.7 - j * 0.05} />
              ))}
            </g>
          ))}
          {/* Butterflies */}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;40,-30;80,0;40,30;0,0" dur="7s" repeatCount="indefinite" />
            <ellipse cx="180" cy="300" rx="14" ry="9" fill="#d8b4fe" opacity="0.6" transform="rotate(-15 180 300)" />
            <ellipse cx="198" cy="300" rx="14" ry="9" fill="#c084fc" opacity="0.6" transform="rotate(15 198 300)" />
          </g>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;-30,20;-60,0;-30,-20;0,0" dur="6s" repeatCount="indefinite" />
            <ellipse cx="350" cy="250" rx="10" ry="6" fill="#e9d5ff" opacity="0.5" transform="rotate(-20 350 250)" />
            <ellipse cx="363" cy="250" rx="10" ry="6" fill="#d8b4fe" opacity="0.5" transform="rotate(20 363 250)" />
          </g>
        </svg>
      );
    default:
      return null;
  }
}
