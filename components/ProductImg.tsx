type Props = {
  src?: string | null;
  alt?: string;
  ratio?: string;
  style?: React.CSSProperties;
};

export function ProductImg({ src, alt = "", ratio = "1/1", style = {} }: Props) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        backgroundColor: "var(--sn-bone)",
        backgroundImage: src ? `url(${src})` : undefined,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        overflow: "hidden",
        ...style,
      }}
      role="img"
      aria-label={alt}
    />
  );
}
