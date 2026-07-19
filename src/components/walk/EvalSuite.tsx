// Stage 3: Projects as an eval board (R13). Each project is a tool with an eval
// bar. Bars carry their real width inline (so no-JS shows them full); with JS
// they animate from scaleX(0) when the board scrolls in. "Run all" replays.
import { useEffect, useRef, useState } from "react";
import { useInView } from "./useInView";
import { EVALS, DEFAULT_EVAL } from "../../data/evals";

export interface ProjectLite {
  id: string;
  title: string;
  theme: string;
}

export default function EvalSuite({
  projects,
  onEnter,
}: {
  projects: ProjectLite[];
  onEnter: () => void;
}) {
  const [barsOn, setBarsOn] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>(onEnter);
  const runTimer = useRef<number | null>(null);

  useEffect(() => {
    if (inView) setBarsOn(true);
  }, [inView]);

  useEffect(() => {
    return () => {
      if (runTimer.current) window.clearTimeout(runTimer.current);
    };
  }, []);

  const runAll = () => {
    setBarsOn(false);
    runTimer.current = window.setTimeout(() => setBarsOn(true), 40);
  };

  return (
    <section
      ref={ref}
      id="stage-projects"
      data-testid="stage-projects"
      className={`walk-stage walk-evals${inView ? " in-view" : ""}`}
      aria-label="Eval suite"
    >
      <p className="walk-eyebrow">stage 03 · eval suite</p>
      <h2 className="walk-h2">his tools, benchmarked</h2>
      <p className="walk-sub">
        Each project is a tool AXON can call. Bars are AXON's confidence read,
        not hard benchmarks. Open any tool for the full writeup.
      </p>

      <div className="walk-evals__actions">
        <button type="button" className="walk-btn" data-testid="run-all" onClick={runAll}>
          run all evals
        </button>
      </div>

      <ul className="walk-evals__grid">
        {projects.map((p, i) => {
          const e = EVALS[p.id] ?? DEFAULT_EVAL;
          return (
            <li className="walk-eval" key={p.id} style={{ transitionDelay: `${i * 60}ms` }}>
              <a href={`/projects/${p.id}`} className="walk-eval__link">
                <p className="walk-eval__theme">{p.theme}</p>
                <h3 className="walk-eval__title">{p.title}</h3>
                <div className="walk-eval__metricrow">
                  <span className="walk-eval__metric">{e.metric}</span>
                  <span className="walk-eval__value">{e.value}</span>
                </div>
                <div className="walk-eval__track">
                  <div
                    className={`walk-eval__fill${barsOn ? " on" : ""}`}
                    style={{ width: `${e.bar}%`, transitionDelay: `${i * 55}ms` }}
                    aria-hidden="true"
                  />
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
