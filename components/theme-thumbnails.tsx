export function ThemeThumbnail({ id }: { id: string }) {
  switch (id) {
    case "solid":
      return (
        <svg viewBox="0 0 80 80" className="size-full">
          <rect width="80" height="80" rx="16" fill="#18181b" />
          <rect x="15" y="25" width="50" height="10" rx="3" fill="#3f3f46" />
          <rect x="15" y="40" width="35" height="10" rx="3" fill="#3f3f46" />
          <rect x="15" y="55" width="42" height="10" rx="3" fill="#3f3f46" />
        </svg>
      );
    case "spring":
      return (
        <svg viewBox="0 0 80 80" className="size-full">
          <rect width="80" height="80" rx="16" fill="#f0fdf4" />
          <rect x="0" y="55" width="80" height="25" rx="0" fill="#bbf7d0" />
          <circle cx="18" cy="52" r="5" fill="#f9a8d4" />
          <circle cx="18" cy="52" r="2" fill="#fbbf24" />
          <line x1="18" y1="57" x2="18" y2="70" stroke="#4ade80" strokeWidth="2" />
          <circle cx="40" cy="48" r="6" fill="#f472b6" />
          <circle cx="40" cy="48" r="2.5" fill="#fbbf24" />
          <line x1="40" y1="54" x2="40" y2="72" stroke="#4ade80" strokeWidth="2" />
          <circle cx="62" cy="50" r="5" fill="#c084fc" />
          <circle cx="62" cy="50" r="2" fill="#fbbf24" />
          <line x1="62" y1="55" x2="62" y2="68" stroke="#4ade80" strokeWidth="2" />
          <ellipse cx="28" cy="28" rx="5" ry="3.5" fill="#f9a8d4" opacity="0.8" transform="rotate(-20 28 28)">
            <animateTransform attributeName="transform" type="translate" values="0,0;3,-2;0,0" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="34" cy="28" rx="5" ry="3.5" fill="#c084fc" opacity="0.8" transform="rotate(20 34 28)">
            <animateTransform attributeName="transform" type="translate" values="0,0;3,-2;0,0" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="64" cy="14" r="8" fill="#fde68a" opacity="0.7" />
        </svg>
      );
    case "summer":
      return (
        <svg viewBox="0 0 80 80" className="size-full">
          <rect width="80" height="80" rx="16" fill="#fef3c7" />
          <circle cx="60" cy="18" r="12" fill="#fb923c" opacity="0.9" />
          <circle cx="60" cy="18" r="8" fill="#fbbf24" />
          <path d="M0 55 Q10 50 20 55 Q30 60 40 55 Q50 50 60 55 Q70 60 80 55 V80 H0Z" fill="#38bdf8" opacity="0.5">
            <animate attributeName="d" values="M0 55 Q10 50 20 55 Q30 60 40 55 Q50 50 60 55 Q70 60 80 55 V80 H0Z;M0 57 Q10 62 20 57 Q30 52 40 57 Q50 62 60 57 Q70 52 80 57 V80 H0Z;M0 55 Q10 50 20 55 Q30 60 40 55 Q50 50 60 55 Q70 60 80 55 V80 H0Z" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M0 60 Q10 55 20 60 Q30 65 40 60 Q50 55 60 60 Q70 65 80 60 V80 H0Z" fill="#0ea5e9" opacity="0.6">
            <animate attributeName="d" values="M0 60 Q10 55 20 60 Q30 65 40 60 Q50 55 60 60 Q70 65 80 60 V80 H0Z;M0 62 Q10 67 20 62 Q30 57 40 62 Q50 67 60 62 Q70 57 80 62 V80 H0Z;M0 60 Q10 55 20 60 Q30 65 40 60 Q50 55 60 60 Q70 65 80 60 V80 H0Z" dur="2.5s" repeatCount="indefinite" />
          </path>
          <line x1="15" y1="70" x2="15" y2="38" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
          <path d="M15 38 Q5 30 2 35" stroke="#4ade80" strokeWidth="2" fill="none" />
          <path d="M15 38 Q25 28 30 33" stroke="#4ade80" strokeWidth="2" fill="none" />
          <path d="M15 38 Q10 26 5 28" stroke="#22c55e" strokeWidth="2" fill="none" />
          <path d="M15 38 Q22 26 28 26" stroke="#22c55e" strokeWidth="2" fill="none" />
        </svg>
      );
    case "autumn":
      return (
        <svg viewBox="0 0 80 80" className="size-full">
          <rect width="80" height="80" rx="16" fill="#fef9ee" />
          <line x1="40" y1="75" x2="40" y2="35" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
          <line x1="40" y1="45" x2="30" y2="35" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="42" x2="52" y2="32" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="40" cy="28" r="14" fill="#f97316" opacity="0.6" />
          <circle cx="33" cy="32" r="10" fill="#ea580c" opacity="0.5" />
          <circle cx="48" cy="30" r="11" fill="#dc2626" opacity="0.4" />
          <ellipse cx="20" cy="20" rx="3" ry="2" fill="#f97316">
            <animateTransform attributeName="transform" type="translate" values="0,0;5,20;10,45" dur="3s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" values="0;180;360" dur="3s" repeatCount="indefinite" additive="sum" />
          </ellipse>
          <ellipse cx="60" cy="15" rx="2.5" ry="1.5" fill="#dc2626">
            <animateTransform attributeName="transform" type="translate" values="0,0;-4,25;-8,50" dur="4s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" values="0;-180;-360" dur="4s" repeatCount="indefinite" additive="sum" />
          </ellipse>
          <ellipse cx="50" cy="10" rx="2" ry="1.5" fill="#fbbf24">
            <animateTransform attributeName="transform" type="translate" values="0,0;-3,30;-6,55" dur="3.5s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" values="0;200;400" dur="3.5s" repeatCount="indefinite" additive="sum" />
          </ellipse>
          <ellipse cx="40" cy="75" rx="30" ry="5" fill="#fed7aa" opacity="0.5" />
        </svg>
      );
    case "winter":
      return (
        <svg viewBox="0 0 80 80" className="size-full">
          <rect width="80" height="80" rx="16" fill="#eff6ff" />
          <ellipse cx="40" cy="72" rx="40" ry="12" fill="white" />
          <polygon points="22,62 16,50 28,50" fill="#6ee7b7" opacity="0.5" />
          <polygon points="22,55 14,42 30,42" fill="#6ee7b7" opacity="0.6" />
          <polygon points="22,47 17,36 27,36" fill="#34d399" opacity="0.5" />
          <polygon points="58,64 52,52 64,52" fill="#6ee7b7" opacity="0.5" />
          <polygon points="58,56 51,44 65,44" fill="#34d399" opacity="0.5" />
          <circle cx="12" cy="10" r="2" fill="#bfdbfe">
            <animate attributeName="cy" values="10;70" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="35" cy="5" r="1.5" fill="#93c5fd">
            <animate attributeName="cy" values="5;65" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="15" r="2.5" fill="#bfdbfe">
            <animate attributeName="cy" values="15;75" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.2" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="70" cy="8" r="1.5" fill="#dbeafe">
            <animate attributeName="cy" values="8;68" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="64" r="6" fill="white" stroke="#e2e8f0" strokeWidth="0.5" />
          <circle cx="40" cy="54" r="4.5" fill="white" stroke="#e2e8f0" strokeWidth="0.5" />
          <circle cx="38.5" cy="53" r="0.8" fill="#1e293b" />
          <circle cx="41.5" cy="53" r="0.8" fill="#1e293b" />
          <circle cx="40" cy="55.5" r="0.5" fill="#f97316" />
        </svg>
      );
    case "midnight":
      return (
        <svg viewBox="0 0 80 80" className="size-full">
          <rect width="80" height="80" rx="16" fill="#0f172a" />
          <circle cx="60" cy="20" r="10" fill="#fde68a" opacity="0.9" />
          <circle cx="64" cy="17" r="8" fill="#0f172a" />
          <circle cx="15" cy="12" r="1" fill="white">
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="8" r="1.2" fill="white">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="10" cy="30" r="0.8" fill="white">
            <animate attributeName="opacity" values="1;0.4;1" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="45" cy="15" r="1" fill="white">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="25" cy="25" r="0.6" fill="#c4b5fd">
            <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="70" cy="40" r="0.8" fill="white">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="20" cy="50" r="1" fill="#c4b5fd">
            <animate attributeName="opacity" values="1;0.5;1" dur="1.7s" repeatCount="indefinite" />
          </circle>
          <line x1="10" y1="40" x2="25" y2="35" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0">
            <animate attributeName="opacity" values="0;0;1;0" dur="4s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0;20,5" dur="4s" repeatCount="indefinite" />
          </line>
          <path d="M0 65 Q20 50 40 60 Q60 70 80 58 V80 H0Z" fill="#1e293b" />
          <circle cx="30" cy="58" r="1.5" fill="#fde68a" opacity="0.8">
            <animate attributeName="cy" values="58;54;58" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="55" r="1" fill="#fde68a" opacity="0.6">
            <animate attributeName="cy" values="55;52;55" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      );
    case "aurora":
      return (
        <svg viewBox="0 0 80 80" className="size-full">
          <rect width="80" height="80" rx="16" fill="#0c0a20" />
          <circle cx="10" cy="10" r="0.8" fill="white" opacity="0.6" />
          <circle cx="30" cy="6" r="0.6" fill="white" opacity="0.5" />
          <circle cx="70" cy="12" r="0.7" fill="white" opacity="0.7" />
          <circle cx="55" cy="8" r="0.5" fill="white" opacity="0.4" />
          <path d="M0 25 Q20 15 40 25 Q60 35 80 20" stroke="#4ade80" strokeWidth="6" fill="none" opacity="0.4">
            <animate attributeName="d" values="M0 25 Q20 15 40 25 Q60 35 80 20;M0 22 Q20 32 40 20 Q60 10 80 25;M0 25 Q20 15 40 25 Q60 35 80 20" dur="4s" repeatCount="indefinite" />
          </path>
          <path d="M0 30 Q20 20 40 30 Q60 40 80 28" stroke="#a78bfa" strokeWidth="5" fill="none" opacity="0.35">
            <animate attributeName="d" values="M0 30 Q20 20 40 30 Q60 40 80 28;M0 28 Q20 38 40 26 Q60 16 80 32;M0 30 Q20 20 40 30 Q60 40 80 28" dur="3.5s" repeatCount="indefinite" />
          </path>
          <path d="M0 35 Q20 28 40 35 Q60 42 80 32" stroke="#22d3ee" strokeWidth="4" fill="none" opacity="0.3">
            <animate attributeName="d" values="M0 35 Q20 28 40 35 Q60 42 80 32;M0 33 Q20 42 40 32 Q60 24 80 38;M0 35 Q20 28 40 35 Q60 42 80 32" dur="5s" repeatCount="indefinite" />
          </path>
          <polygon points="0,80 0,55 20,45 35,58 50,42 65,55 80,48 80,80" fill="#1a1640" />
          <rect x="5" y="68" width="70" height="8" rx="4" fill="#4ade80" opacity="0.1">
            <animate attributeName="opacity" values="0.1;0.15;0.1" dur="3s" repeatCount="indefinite" />
          </rect>
        </svg>
      );
    case "noir":
      return (
        <svg viewBox="0 0 80 80" className="size-full">
          <rect width="80" height="80" rx="16" fill="#09090b" />
          {/* Grid lines */}
          <line x1="0" y1="20" x2="80" y2="20" stroke="#27272a" strokeWidth="0.5" />
          <line x1="0" y1="40" x2="80" y2="40" stroke="#27272a" strokeWidth="0.5" />
          <line x1="0" y1="60" x2="80" y2="60" stroke="#27272a" strokeWidth="0.5" />
          <line x1="20" y1="0" x2="20" y2="80" stroke="#27272a" strokeWidth="0.5" />
          <line x1="40" y1="0" x2="40" y2="80" stroke="#27272a" strokeWidth="0.5" />
          <line x1="60" y1="0" x2="60" y2="80" stroke="#27272a" strokeWidth="0.5" />
          {/* Glow accent */}
          <circle cx="40" cy="40" r="18" fill="#ffffff" opacity="0.03" />
          <circle cx="40" cy="40" r="10" fill="#ffffff" opacity="0.04">
            <animate attributeName="r" values="10;14;10" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.04;0.07;0.04" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* White dot accents */}
          <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.2" />
          <circle cx="60" cy="40" r="1.5" fill="white" opacity="0.15" />
          <circle cx="40" cy="60" r="1.5" fill="white" opacity="0.2" />
        </svg>
      );
    case "deepsea":
      return (
        <svg viewBox="0 0 80 80" className="size-full">
          <rect width="80" height="80" rx="16" fill="#042f2e" />
          {/* Water caustics */}
          <ellipse cx="25" cy="20" rx="20" ry="10" fill="#0d9488" opacity="0.15">
            <animate attributeName="rx" values="20;25;20" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.15;0.25;0.15" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="55" cy="45" rx="18" ry="8" fill="#06b6d4" opacity="0.12">
            <animate attributeName="rx" values="18;22;18" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.12;0.2;0.12" dur="3.5s" repeatCount="indefinite" />
          </ellipse>
          {/* Bubbles */}
          <circle cx="20" cy="65" r="2" fill="#5eead4" opacity="0.3">
            <animate attributeName="cy" values="65;15" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="70" r="1.5" fill="#5eead4" opacity="0.25">
            <animate attributeName="cy" values="70;20" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="35" cy="75" r="1" fill="#99f6e4" opacity="0.2">
            <animate attributeName="cy" values="75;25" dur="6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0" dur="6s" repeatCount="indefinite" />
          </circle>
          {/* Jellyfish */}
          <ellipse cx="60" cy="55" rx="6" ry="4" fill="#2dd4bf" opacity="0.3">
            <animate attributeName="cy" values="55;50;55" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <line x1="56" y1="59" x2="55" y2="68" stroke="#2dd4bf" strokeWidth="0.5" opacity="0.2">
            <animate attributeName="y1" values="59;54;59" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="60" y1="59" x2="60" y2="70" stroke="#2dd4bf" strokeWidth="0.5" opacity="0.2">
            <animate attributeName="y1" values="59;54;59" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="64" y1="59" x2="65" y2="67" stroke="#2dd4bf" strokeWidth="0.5" opacity="0.2">
            <animate attributeName="y1" values="59;54;59" dur="3s" repeatCount="indefinite" />
          </line>
          {/* Seaweed */}
          <path d="M15 80 Q12 65 18 55 Q14 45 18 38" stroke="#0f766e" strokeWidth="2" fill="none" opacity="0.4">
            <animate attributeName="d" values="M15 80 Q12 65 18 55 Q14 45 18 38;M15 80 Q18 65 14 55 Q18 45 14 38;M15 80 Q12 65 18 55 Q14 45 18 38" dur="4s" repeatCount="indefinite" />
          </path>
        </svg>
      );
    case "ember":
      return (
        <svg viewBox="0 0 80 80" className="size-full">
          <rect width="80" height="80" rx="16" fill="#1c1007" />
          {/* Ember glow */}
          <circle cx="40" cy="65" r="20" fill="#f97316" opacity="0.08" />
          <circle cx="40" cy="65" r="12" fill="#ef4444" opacity="0.1">
            <animate attributeName="opacity" values="0.1;0.18;0.1" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Flames */}
          <path d="M35 70 Q33 55 38 45 Q35 35 40 25 Q45 35 42 45 Q47 55 45 70Z" fill="#f97316" opacity="0.5">
            <animate attributeName="d" values="M35 70 Q33 55 38 45 Q35 35 40 25 Q45 35 42 45 Q47 55 45 70Z;M36 70 Q32 55 39 43 Q34 33 40 22 Q46 33 41 43 Q48 55 44 70Z;M35 70 Q33 55 38 45 Q35 35 40 25 Q45 35 42 45 Q47 55 45 70Z" dur="1.5s" repeatCount="indefinite" />
          </path>
          <path d="M37 70 Q36 58 39 50 Q37 42 40 33 Q43 42 41 50 Q44 58 43 70Z" fill="#fbbf24" opacity="0.6">
            <animate attributeName="d" values="M37 70 Q36 58 39 50 Q37 42 40 33 Q43 42 41 50 Q44 58 43 70Z;M38 70 Q35 58 40 48 Q36 40 40 30 Q44 40 40 48 Q45 58 42 70Z;M37 70 Q36 58 39 50 Q37 42 40 33 Q43 42 41 50 Q44 58 43 70Z" dur="1.2s" repeatCount="indefinite" />
          </path>
          {/* Sparks */}
          <circle cx="30" cy="40" r="1" fill="#fbbf24" opacity="0.6">
            <animate attributeName="cy" values="40;15" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="52" cy="35" r="0.8" fill="#f97316" opacity="0.5">
            <animate attributeName="cy" values="35;10" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="45" cy="30" r="0.6" fill="#fde68a" opacity="0.7">
            <animate attributeName="cy" values="30;8" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0" dur="1.8s" repeatCount="indefinite" />
          </circle>
          {/* Logs */}
          <line x1="28" y1="72" x2="52" y2="68" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          <line x1="26" y1="68" x2="54" y2="72" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "lavender":
      return (
        <svg viewBox="0 0 80 80" className="size-full">
          <rect width="80" height="80" rx="16" fill="#faf5ff" />
          {/* Soft clouds */}
          <ellipse cx="20" cy="25" rx="14" ry="8" fill="#e9d5ff" opacity="0.5" />
          <ellipse cx="55" cy="20" rx="16" ry="9" fill="#ddd6fe" opacity="0.4" />
          <ellipse cx="40" cy="30" rx="12" ry="6" fill="#ede9fe" opacity="0.5" />
          {/* Lavender stems */}
          <line x1="18" y1="75" x2="20" y2="45" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="32" y1="75" x2="33" y2="42" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="46" y1="75" x2="47" y2="48" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="60" y1="75" x2="61" y2="44" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          {/* Lavender blooms */}
          <circle cx="20" cy="44" r="2" fill="#c084fc" opacity="0.8" />
          <circle cx="20" cy="48" r="2.2" fill="#a855f7" opacity="0.7" />
          <circle cx="20" cy="52" r="2" fill="#c084fc" opacity="0.6" />
          <circle cx="33" cy="41" r="2.2" fill="#a855f7" opacity="0.8" />
          <circle cx="33" cy="45" r="2.4" fill="#c084fc" opacity="0.7" />
          <circle cx="33" cy="49" r="2" fill="#a855f7" opacity="0.6" />
          <circle cx="47" cy="47" r="2" fill="#c084fc" opacity="0.8" />
          <circle cx="47" cy="51" r="2.2" fill="#a855f7" opacity="0.7" />
          <circle cx="47" cy="55" r="2" fill="#c084fc" opacity="0.6" />
          <circle cx="61" cy="43" r="2.2" fill="#a855f7" opacity="0.8" />
          <circle cx="61" cy="47" r="2.4" fill="#c084fc" opacity="0.7" />
          <circle cx="61" cy="51" r="2" fill="#a855f7" opacity="0.6" />
          {/* Butterfly */}
          <ellipse cx="42" cy="15" rx="4" ry="2.5" fill="#d8b4fe" opacity="0.7" transform="rotate(-15 42 15)">
            <animateTransform attributeName="transform" type="translate" values="0,0;4,-3;0,0" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="47" cy="15" rx="4" ry="2.5" fill="#c084fc" opacity="0.7" transform="rotate(15 47 15)">
            <animateTransform attributeName="transform" type="translate" values="0,0;4,-3;0,0" dur="3s" repeatCount="indefinite" />
          </ellipse>
          {/* Ground */}
          <rect x="0" y="70" width="80" height="10" fill="#ede9fe" opacity="0.4" />
        </svg>
      );
    default:
      return null;
  }
}
