// Persistent minimized presence after the fork (R8/R9). Shows the entity, the
// mode line, the context meter, and a control to replay the intro.
import AgentEntity from "./AgentEntity";
import ContextMeter from "./ContextMeter";
import { DOCK_LINE, type ForkOption } from "../../agent/script";
import type { AgentVisualState } from "../../agent/machine";
import type { Mode } from "../../agent/store";

interface Props {
  mode: Mode;
  visual: AgentVisualState;
  reduced: boolean;
  onReplay: () => void;
}

export default function AgentDock({ mode, visual, reduced, onReplay }: Props) {
  const line = DOCK_LINE[mode] ?? "online.";
  return (
    <aside className="axon-dock" data-testid="dock" aria-label="AXON">
      <div className="axon-dock__entity">
        <AgentEntity state={visual} size={56} reduced={reduced} />
      </div>
      <div className="axon-dock__body">
        <p className="axon-dock__line">{line}</p>
        <ContextMeter />
      </div>
      <button type="button" className="axon-dock__replay" data-testid="replay" onClick={onReplay} aria-label="Replay AXON intro">
        replay
      </button>
    </aside>
  );
}

export type { ForkOption };
