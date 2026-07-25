// Stage 4: Blog/papers as a retrieval corpus (R10). Documents AXON can pull.
import { useInView } from "./useInView";

export interface DocLite {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export default function Knowledge({
  docs,
  onEnter,
}: {
  docs: DocLite[];
  onEnter: () => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(onEnter);
  return (
    <section
      ref={ref}
      id="stage-knowledge"
      data-testid="stage-knowledge"
      className={`walk-stage walk-know${inView ? " in-view" : ""}`}
      aria-label="Knowledge base"
    >
      <p className="walk-eyebrow">stage 04 · retrieval</p>
      <h2 className="walk-h2">his writing is the corpus</h2>
      <p className="walk-sub">
        When a question lands near something he has written, I retrieve it. These are
        the documents in the index right now.
      </p>

      <ul className="walk-docs">
        {docs.length === 0 && <li className="walk-sub">index is warming up.</li>}
        {docs.map((d, i) => (
          <li className="walk-doc" key={d.id} style={{ transitionDelay: `${i * 70}ms` }}>
            <a href={`/blog/${d.id}`} className="walk-doc__link">
              <span className="walk-doc__badge">retrieved</span>
              <h3 className="walk-doc__title">{d.title}</h3>
              <p className="walk-doc__desc">{d.description}</p>
              <ul className="walk-chips">
                {d.tags.slice(0, 4).map((t) => (
                  <li className="walk-chip" key={t}>
                    {t}
                  </li>
                ))}
              </ul>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
