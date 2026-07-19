// Cold-start boot (R1). GSAP timeline prints the log and fills the weights bar,
// then calls onDone. Reduced-motion (R7) jumps straight to the end. Killable.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BOOT_LOG } from "../../agent/script";

interface Props {
  onDone: () => void;
  reduced: boolean;
}

export default function BootSequence({ onDone, reduced }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const root = rootRef.current;
    const bar = barRef.current;
    if (!root || !bar) return;
    const lines = Array.from(root.querySelectorAll<HTMLElement>("[data-line]"));

    if (reduced) {
      gsap.set(lines, { opacity: 1 });
      gsap.set(bar, { width: "100%" });
      const id = window.setTimeout(() => onDoneRef.current(), 200);
      return () => window.clearTimeout(id);
    }

    gsap.set(lines, { opacity: 0, y: 4 });
    gsap.set(bar, { width: "0%" });
    const tl = gsap.timeline({ onComplete: () => onDoneRef.current() });
    // Bar fills across the full log stagger so it lands with "awake.".
    tl.to(bar, { width: "100%", duration: 2.3, ease: "power1.inOut" }, 0);
    lines.forEach((line, i) => {
      tl.to(line, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.12 + i * 0.32);
    });
    tl.to({}, { duration: 0.4 }); // brief hold on "awake."
    return () => {
      tl.kill();
    };
  }, [reduced]);

  return (
    <div ref={rootRef} data-testid="boot" className="axon-boot" role="status" aria-label="Booting AXON">
      <div className="axon-boot__weights" aria-hidden="true">
        <div ref={barRef} className="axon-boot__bar" />
      </div>
      <pre className="axon-boot__log">
        {BOOT_LOG.map((l, i) => (
          <span data-line key={i} className="axon-boot__line">
            <span className="axon-boot__mark">{i === BOOT_LOG.length - 1 ? "✔" : "▸"}</span>
            {l}
          </span>
        ))}
      </pre>
    </div>
  );
}
