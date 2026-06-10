type AmbientGlowProps = {
  className?: string;
  variant?: "gold" | "forest" | "clay" | "warm";
  size?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
  animationDelay?: string;
};

const variantMap: Record<string, string> = {
  gold: "rgba(210, 166, 109, 0.3)",
  forest: "rgba(109, 139, 125, 0.22)",
  clay: "rgba(193, 123, 88, 0.22)",
  warm: "rgba(227, 176, 122, 0.20)",
};

const sizeMap: Record<string, string> = {
  sm: "280px",
  md: "480px",
  lg: "680px",
  xl: "900px",
};

export function AmbientGlow({
  className = "",
  variant = "gold",
  size = "lg",
  opacity = 1,
  animationDelay = "0s",
}: AmbientGlowProps) {
  const color = variantMap[variant];
  const dim = sizeMap[size];

  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: dim,
        height: dim,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(60px)",
        opacity,
        animation: "float 9s ease-in-out infinite",
        animationDelay,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden
    />
  );
}
