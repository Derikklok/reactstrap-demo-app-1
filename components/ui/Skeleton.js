export default function Skeleton({ w = "100%", h = 12, radius = 6, className = "", style }) {
  return <span className={`ui-skel ${className}`} style={{ width: w, height: h, borderRadius: radius, ...style }} aria-hidden="true" />;
}
