/** A flat studio scene (softbox, camera on a tripod, clapperboard) drawn with theme colors. */
export function StudioIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 320" role="img" aria-label="A film studio with a softbox light, a camera on a tripod and a clapperboard" className={className}>
      <defs>
        <radialGradient id="beam" cx="50%" cy="0%" r="90%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="240" cy="292" rx="210" ry="16" fill="var(--muted)" />

      <path d="M92 70 L40 292 L190 292 Z" fill="url(#beam)" />

      <g>
        <rect x="70" y="40" width="64" height="48" rx="6" fill="var(--foreground)" />
        <rect x="78" y="48" width="48" height="32" rx="3" fill="var(--primary)" />
        <rect x="98" y="88" width="8" height="150" fill="var(--foreground)" />
        <path d="M102 238 L72 292 M102 238 L132 292" stroke="var(--foreground)" strokeWidth="6" strokeLinecap="round" />
      </g>

      <g transform="translate(300 118)">
        <path d="M50 120 L50 174 M50 120 L18 174 M50 120 L82 174" stroke="var(--foreground)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <rect x="14" y="42" width="72" height="50" rx="8" fill="var(--foreground)" />
        <rect x="86" y="54" width="22" height="26" rx="4" fill="var(--foreground)" opacity="0.85" />
        <circle cx="50" cy="67" r="15" fill="var(--background)" />
        <circle cx="50" cy="67" r="9" fill="var(--primary)" />
        <rect x="22" y="30" width="22" height="12" rx="3" fill="var(--foreground)" />
        <rect x="46" y="88" width="8" height="34" fill="var(--foreground)" />
      </g>

      <g transform="rotate(-8 215 210)">
        <rect x="150" y="196" width="130" height="78" rx="6" fill="var(--card)" stroke="var(--foreground)" strokeWidth="4" />
        <rect x="150" y="168" width="130" height="26" rx="4" fill="var(--foreground)" />
        <path d="M168 168 l16 26 M198 168 l16 26 M228 168 l16 26 M258 168 l16 26" stroke="var(--primary)" strokeWidth="8" />
        <text x="215" y="248" textAnchor="middle" fontSize="44" fontWeight="700" fill="var(--foreground)" fontFamily="var(--font-fraunces), serif">
          404
        </text>
      </g>

      <circle cx="420" cy="52" r="3" fill="var(--primary)" />
      <circle cx="446" cy="86" r="2" fill="var(--primary)" opacity="0.7" />
      <circle cx="396" cy="92" r="2" fill="var(--primary)" opacity="0.5" />
    </svg>
  );
}
