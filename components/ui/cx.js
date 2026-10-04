/** Tiny className joiner: cx("a", cond && "b", ["c"]) */
export const cx = (...a) => a.flat(Infinity).filter(Boolean).join(" ");
