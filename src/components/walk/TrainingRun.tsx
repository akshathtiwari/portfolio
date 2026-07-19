// Stage 2: Experience as a training run (R12). A loss curve that draws itself
// when scrolled into view, with each role as a checkpoint and its capabilities
// unlocking. IntersectionObserver + CSS transitions (no rAF scrubbing).
import { useInView } from "./useInView";
import { JOURNEY } from "../../data/journey";

const PAD_X = 8;
const SPAN_X = 84;
const TOP = 6;
const USABLE_Y = 48;

function point(i: number, loss: number) {
  const x = PAD_X + (i / (JOURNEY.length - 1)) * SPAN_X;
  const y = TOP + (1 - loss) * USABLE_Y;
  return { x, y };
}

export default function TrainingRun({ onEnter }: { onEnter: () => void }) {
  const { ref, inView } = useInView<HTMLDivElement>(onEnter);
  const pts = JOURNEY.map((c, i) => point(i, c.loss));
  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <section
      ref={ref}
      id="stage-experience"
      data-testid="stage-experience"
      className={`walk-stage walk-run${inView ? " in-view" : ""}`}
      aria-label="Training run"
    >
      <p className="walk-eyebrow">stage 02 · training run</p>
      <h2 className="walk-h2">the loss went down</h2>
      <p className="walk-sub">
        Every role is a checkpoint. Watch the loss fall from a broad, noisy start
        to a shipping model. Each marker unlocked a capability.
      </p>

      <div className="walk-run__chart">
        <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="walk-run__svg" aria-hidden="true">
          {/* baseline grid */}
          <line x1="8" y1="54" x2="92" y2="54" className="walk-run__axis" />
          <polyline points={polyline} className="walk-run__line" />
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="1.4"
              className="walk-run__dot"
              style={{ transitionDelay: `${600 + i * 160}ms` }}
            />
          ))}
        </svg>
        <div className="walk-run__axislabels" aria-hidden="true">
          <span>loss</span>
          <span>time</span>
        </div>
      </div>

      <ol className="walk-run__list">
        {JOURNEY.map((c, i) => (
          <li
            key={c.id}
            className="walk-run__cp"
            style={{ transitionDelay: `${300 + i * 130}ms` }}
          >
            <div className="walk-run__cphead">
              <span className="walk-run__phase">{c.phaseLabel}</span>
              <span className="walk-run__period">{c.period}</span>
            </div>
            <p className="walk-run__role">
              {c.role} <span className="walk-run__org">· {c.org}</span>
            </p>
            <p className="walk-run__note">{c.note}</p>
            <ul className="walk-chips">
              {c.caps.map((cap) => (
                <li className="walk-chip" key={cap}>
                  {cap}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
