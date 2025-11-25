export default function Skeleton({ height = 120 }) {
  return (
    <div
      style={{
        height,
        borderRadius: "12px",
        background: "linear-gradient(90deg, #242b35, #2f3440, #242b35)",
        backgroundSize: "200% 100%",
        animation: "skeleton 1.5s infinite",
      }}
    />
  );
}
