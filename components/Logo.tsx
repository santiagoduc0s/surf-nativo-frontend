import Image from "next/image";

export function Logo({ size = 60, shadow = false }: { size?: number; shadow?: boolean }) {
  return (
    <Image
      src="/assets/logo.jpg"
      alt="Surf Nativo"
      width={size * 3}
      height={size}
      priority
      style={{
        height: size,
        width: "auto",
        display: "block",
        borderRadius: 14,
        boxShadow: shadow
          ? "0 8px 24px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.18)"
          : "none",
      }}
    />
  );
}
