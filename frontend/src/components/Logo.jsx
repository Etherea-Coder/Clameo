import React from "react";

/**
 * Clameo Logo
 * Concept: a small 2-paper-tabs side outweighing a single bigger block on the other,
 * representing "small letter restoring balance against bigger power".
 * Navy line-art with one small coral detail (the dot after the "o" and the fulcrum dot).
 */
export const ClameoMark = ({ size = 28, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Vertical pole */}
      <line x1="24" y1="10" x2="24" y2="40" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* Base */}
      <line x1="16" y1="40" x2="32" y2="40" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* Beam (slightly tilted to suggest the small side outweighs the big side) */}
      <line x1="6" y1="14" x2="42" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* Beam connections */}
      <line x1="9" y1="14.5" x2="9" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="39" y1="17.5" x2="39" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

      {/* Left side: TWO small papers (stacked) — the "letters" */}
      <rect x="4.5" y="20" width="9" height="6" rx="0.6" stroke="currentColor" strokeWidth="1.4" fill="hsl(var(--background))" />
      <rect x="6" y="22.5" width="9" height="6" rx="0.6" stroke="currentColor" strokeWidth="1.4" fill="hsl(var(--background))" />

      {/* Right side: ONE bigger block — the "power/institution" */}
      <rect x="33" y="22" width="12" height="9" rx="0.6" stroke="currentColor" strokeWidth="1.4" fill="none" />

      {/* Fulcrum coral dot */}
      <circle cx="24" cy="16" r="1.7" fill="hsl(var(--coral))" />
    </svg>
  );
};

export const ClameoLogo = ({ size = 28, className = "", textClass = "text-2xl", light = false }) => {
  return (
    <div className={`flex items-center gap-2 ${light ? "text-white" : "text-foreground"} ${className}`}>
      <ClameoMark size={size} />
      <span className={`font-semibold ${textClass} leading-none`}>
        Clameo<span className="text-coral">•</span>
      </span>
    </div>
  );
};

export default ClameoLogo;
