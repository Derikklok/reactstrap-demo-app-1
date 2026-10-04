import { cx } from "./cx";

const TONES = ["#1d5bd8", "#0f2f78", "#d6203a", "#138a5a", "#6d3fd6", "#b7791f"];
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

/** size: xs | sm | md | lg. Color derives from the name unless `tone` is given. */
export default function Avatar({ name = "", src, size = "md", tone, className }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";
  return (
    <span className={cx("ui-avatar", size, className)} style={{ background: src ? "transparent" : tone || TONES[hash(name) % TONES.length] }} title={name}>
      {src ? <img src={src} alt={name} /> : initials}
    </span>
  );
}
