// Reduced-motion view (R7): the same narration as static, non-covering text,
// with the fork still available. The portfolio stays visible below it.
import { BOOT_LOG } from "../../agent/script";
import Greeting from "./Greeting";
import type { Mode } from "../../agent/store";

interface Props {
  onChoose: (mode: Mode) => void;
}

export default function Transcript({ onChoose }: Props) {
  return (
    <section className="axon-transcript" data-testid="transcript" aria-label="AXON, reduced motion">
      <pre className="axon-boot__log axon-boot__log--static">
        {BOOT_LOG.map((l, i) => (
          <span key={i} className="axon-boot__line" style={{ opacity: 1 }}>
            <span className="axon-boot__mark">{i === BOOT_LOG.length - 1 ? "✔" : "▸"}</span>
            {l}
          </span>
        ))}
      </pre>
      {/* Greeting self-reduces to instant text when reduced motion is set.
          Its token spans already carry the full greeting for screen readers,
          so no duplicate sr-only copy is needed. */}
      <Greeting onChoose={onChoose} reduced />
    </section>
  );
}
