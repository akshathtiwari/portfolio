// Reveal-on-scroll via IntersectionObserver. One-shot: fires once, then stops.
// Robust (no rAF), so CSS transitions do the animation and state is verifiable.
import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(
  onEnter?: () => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const enteredRef = useRef(false);
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      if (!enteredRef.current) {
        enteredRef.current = true;
        onEnterRef.current?.();
      }
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            if (!enteredRef.current) {
              enteredRef.current = true;
              onEnterRef.current?.();
            }
            io.unobserve(e.target);
          }
        }
      },
      // threshold 0 fires on any intersection, so stages taller than the
      // viewport still trigger; rootMargin controls the timing.
      options ?? { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, inView };
}
