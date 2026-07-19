// Persistent minimized presence after the fork (R8/R9/R10). Shows the entity,
// the context meter, and either the mode line or, when a walkthrough stage is
// active, the decoded narration for that stage (with the entity "attending").
import { useStore } from "@nanostores/react";
import AgentEntity from "./AgentEntity";
import ContextMeter from "./ContextMeter";
import { agent } from "../../agent/store";
import { DOCK_LINE, STAGE_NARRATION } from "../../agent/script";
import { useDecoder } from "../../agent/useDecoder";
import type { AgentVisualState } from "../../agent/machine";
import type { Mode } from "../../agent/store";

interface Props {
  mode: Mode;
  visual: AgentVisualState;
  reduced: boolean;
  onReplay: () => void;
}

export default function AgentDock({ mode, visual, reduced, onReplay }: Props) {
  const st = useStore(agent);
  const stageText = STAGE_NARRATION[st.stage];
  const narrating = Boolean(stageText);
  const activeVisual: AgentVisualState = narrating ? "attending" : visual;

  const { tokens, visible } = useDecoder(stageText ?? "", {
    start: narrating,
    tokensPerSecond: 32,
  });

  return (
    <aside className="axon-dock" data-testid="dock" aria-label="AXON">
      <div className="axon-dock__entity">
        <AgentEntity state={activeVisual} size={56} reduced={reduced} />
      </div>
      <div className="axon-dock__body">
        {narrating ? (
          <p className="axon-dock__line" data-testid="dock-narration" aria-live="polite">
            {tokens.map((t, i) => (
              <span key={i} style={{ opacity: reduced || i < visible ? 1 : 0.15 }}>
                {t}
              </span>
            ))}
          </p>
        ) : (
          <p className="axon-dock__line">{DOCK_LINE[mode] ?? "online."}</p>
        )}
        <ContextMeter />
      </div>
      <button
        type="button"
        className="axon-dock__replay"
        data-testid="replay"
        onClick={onReplay}
        aria-label="Replay AXON intro"
      >
        replay
      </button>
    </aside>
  );
}
