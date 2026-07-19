// Context-window meter (R9): visitor progress as tokens ingested, 0..128k.
import { useStore } from "@nanostores/react";
import { agent, MAX_TOKENS } from "../../agent/store";

export default function ContextMeter() {
  const state = useStore(agent);
  const pct = Math.round((state.tokens / MAX_TOKENS) * 100);
  const k = Math.round(state.tokens / 1000);
  return (
    <div className="axon-meter" data-testid="context-meter" title="context window filled">
      <div className="axon-meter__label">
        context <span className="axon-meter__num">{k}k / 128k</span>
      </div>
      <div className="axon-meter__track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="context window">
        <div className="axon-meter__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
