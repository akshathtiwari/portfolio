// Stage 1: About re-skinned as a HuggingFace-style model card (R10).
import { useInView } from "./useInView";

interface Row {
  k: string;
  v: string;
}

const ROWS: Row[] = [
  { k: "architecture", v: "1 human, ML engineer" },
  { k: "base org", v: "Phenom, Hyderabad" },
  { k: "training data", v: "BTech (Manipal) + Deloitte AU + a lot of fine-tuning runs" },
  { k: "capabilities", v: "LLM fine-tuning (SFT & RL), agents, evaluation, serving" },
  { k: "intended use", v: "take ambiguous problems to production-grade AI systems" },
  { k: "out of scope", v: "pretending web design is his day job (that part is me)" },
];

export default function ModelCard({ onEnter }: { onEnter: () => void }) {
  const { ref, inView } = useInView<HTMLDivElement>(onEnter);
  return (
    <section
      ref={ref}
      id="stage-modelcard"
      data-testid="stage-modelcard"
      className={`walk-stage walk-card${inView ? " in-view" : ""}`}
      aria-label="Model card"
    >
      <p className="walk-eyebrow">stage 01 · model card</p>
      <h2 className="walk-h2">tiwari-axon-v1</h2>
      <p className="walk-sub">
        The card AXON loaded to represent Akshath. Architecture, training data,
        and intended use, the way a model gets documented.
      </p>

      <dl className="walk-card__grid">
        {ROWS.map((r, i) => (
          <div
            className="walk-card__row"
            key={r.k}
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <dt className="walk-card__k">{r.k}</dt>
            <dd className="walk-card__v">{r.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
