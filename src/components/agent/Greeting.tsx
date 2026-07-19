// AXON's greeting (R2) and the three-way fork (R3). The full greeting text is
// always present in the DOM inside an aria-live region (N1/N2); the decoder only
// gates per-token opacity, so screen readers and crawlers get the whole message.
import { useDecoder } from "../../agent/useDecoder";
import { GREETING, FORK } from "../../agent/script";
import type { Mode } from "../../agent/store";

interface Props {
  onChoose: (mode: Mode) => void;
  reduced: boolean;
}

export default function Greeting({ onChoose, reduced }: Props) {
  const { tokens, visible, done } = useDecoder(GREETING, { start: true });

  return (
    <div className="axon-greeting" data-testid="greeting">
      <p className="axon-greeting__text" aria-live="polite">
        {tokens.map((tok, i) => (
          <span
            key={i}
            className="axon-greeting__tok"
            style={{ opacity: reduced || i < visible ? 1 : 0.06 }}
          >
            {tok}
          </span>
        ))}
      </p>

      <div
        className="axon-fork"
        role="group"
        aria-label="Choose how to explore"
        style={{ opacity: done ? 1 : 0.4 }}
      >
        {FORK.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`axon-fork__btn axon-fork__btn--${opt.id}`}
            data-testid={`fork-${opt.id}`}
            disabled={!done}
            onClick={() => onChoose(opt.id)}
          >
            <span className="axon-fork__label">{opt.label}</span>
            <span className="axon-fork__hint">{opt.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
