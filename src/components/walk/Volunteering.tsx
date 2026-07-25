// Stage 5: Volunteering re-skinned as "open weights" (R10).
import { useInView } from "./useInView";

export default function Volunteering({ onEnter }: { onEnter: () => void }) {
  const { ref, inView } = useInView<HTMLDivElement>(onEnter);
  return (
    <section
      ref={ref}
      id="stage-volunteer"
      data-testid="stage-volunteer"
      className={`walk-stage walk-open${inView ? " in-view" : ""}`}
      aria-label="Open weights"
    >
      <p className="walk-eyebrow">stage 05 · open weights</p>
      <h2 className="walk-h2">some compute is open-sourced</h2>
      <p className="walk-sub">
        He gives a slice of his time away: pro-bono machine learning and data science
        for nonprofits and mission-driven teams, no invoice attached.
      </p>
      <a href="/volunteer" className="walk-btn walk-btn--solid">
        see the offer
      </a>
    </section>
  );
}
