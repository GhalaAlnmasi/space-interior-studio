import { useId } from "react";
import type { PlateVariant } from "@/lib/projects";

type StudyPlateProps = {
  variant: PlateVariant;
  label?: string;
  decorative?: boolean;
};

export function StudyPlate({ variant, label, decorative = false }: StudyPlateProps) {
  const grainId = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 900 1100"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id={grainId} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.22" />
          </feComponentTransfer>
        </filter>
      </defs>
      {variant === "hero" ? <HeroDrawing /> : null}
      {variant === "courtyard" ? <CourtyardDrawing /> : null}
      {variant === "atelier" ? <AtelierDrawing /> : null}
      {variant === "sable" ? <SableDrawing /> : null}
      <rect width="900" height="1100" filter={`url(#${grainId})`} opacity="0.45" style={{ mixBlendMode: "multiply" }} />
      <rect x="28" y="28" width="844" height="1044" fill="none" stroke="#242820" strokeOpacity="0.18" />
    </svg>
  );
}

function HeroDrawing() {
  return (
    <g>
      <rect width="900" height="1100" fill="#E4D9C6" />
      <polygon points="40,180 300,250 300,760 40,900" fill="#F4EFE4" />
      <polygon points="300,250 820,150 820,860 300,760" fill="#E7DCCB" />
      <polygon points="40,900 300,760 820,860 760,1060 70,1080" fill="#C4B093" />
      <polygon points="110,310 110,620 250,575 250,300" fill="#F7F3EA" />
      <polygon points="128,330 128,590 214,562 214,322" fill="#E2C49A" />
      <polygon points="128,590 214,562 560,860 390,930" fill="#A77C55" opacity="0.38" />
      <polygon points="250,860 620,790 690,940 300,1020" fill="#B7A48A" />
      <polygon points="300,760 590,710 610,790 320,845" fill="#5C6450" />
      <polygon points="300,690 590,645 590,710 300,760" fill="#777F67" />
      <polygon points="390,880 530,850 548,888 408,920" fill="#F6F1E8" />
      <g fill="none" stroke="#242820" strokeOpacity="0.28" strokeWidth="1.4">
        <polyline points="40,180 300,250 820,150" />
        <polyline points="300,250 300,760" />
        <polyline points="40,900 300,760 820,860" />
        <polyline points="110,310 250,300 250,575 110,620 110,310" />
      </g>
    </g>
  );
}

function CourtyardDrawing() {
  return (
    <g>
      <rect width="900" height="1100" fill="#E9E1D2" />
      <rect x="120" y="160" width="660" height="760" fill="#F5F1E9" />
      <rect x="250" y="300" width="400" height="400" fill="#777F67" />
      <rect x="310" y="360" width="280" height="280" fill="#C9B89A" />
      <circle cx="450" cy="500" r="46" fill="none" stroke="#A77C55" strokeWidth="3" />
      <g stroke="#242820" strokeOpacity="0.35" strokeWidth="2">
        <path d="M160 200 H250 V290" fill="none" />
        <path d="M740 200 H650 V290" fill="none" />
        <path d="M160 880 H250 V790" fill="none" />
        <path d="M740 880 H650 V790" fill="none" />
      </g>
      <text x="150" y="140" fill="#4A5140" fontFamily="var(--font-manrope), sans-serif" fontSize="18" letterSpacing="4">
        COURT
      </text>
    </g>
  );
}

function AtelierDrawing() {
  return (
    <g>
      <rect width="900" height="1100" fill="#F3EFE6" />
      <rect x="70" y="80" width="230" height="820" fill="#D7D9D0" />
      <rect x="168" y="80" width="8" height="820" fill="#F5F1E9" />
      <rect x="70" y="470" width="230" height="8" fill="#F5F1E9" />
      <rect x="70" y="900" width="760" height="140" fill="#C6A57C" />
      <rect x="360" y="760" width="420" height="18" fill="#EFE8DC" />
      <rect x="390" y="620" width="70" height="150" fill="#777F67" />
      <rect x="700" y="560" width="90" height="210" fill="#4A5140" />
      <text x="360" y="160" fill="#4A5140" fontFamily="var(--font-manrope), sans-serif" fontSize="18" letterSpacing="4">
        NORTH LIGHT
      </text>
    </g>
  );
}

function SableDrawing() {
  return (
    <g>
      <rect width="900" height="1100" fill="#E7D3BA" />
      <path d="M150 980 V470 A300 300 0 0 1 750 470 V980 Z" fill="#F3E6D4" />
      <path d="M150 980 V470 A300 300 0 0 1 750 470 V980" fill="none" stroke="#242820" strokeOpacity="0.28" strokeWidth="2" />
      <circle cx="450" cy="760" r="54" fill="none" stroke="#A77C55" strokeWidth="4" />
      <g stroke="#242820" strokeOpacity="0.18" strokeWidth="2">
        <line x1="220" y1="560" x2="680" y2="560" />
        <line x1="250" y1="610" x2="650" y2="610" />
        <line x1="290" y1="660" x2="610" y2="660" />
      </g>
      <text x="150" y="180" fill="#4A5140" fontFamily="var(--font-manrope), sans-serif" fontSize="18" letterSpacing="4">
        SHADE
      </text>
    </g>
  );
}
