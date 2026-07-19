// Composes the walkthrough stages (R10, R12, R13). Each stage, on first enter,
// reports itself to the shared agent store (setStage drives the dock narration
// and the "attending" entity; addTokens fills the context meter).
import { useEffect } from "react";
import ModelCard from "./ModelCard";
import TrainingRun from "./TrainingRun";
import EvalSuite, { type ProjectLite } from "./EvalSuite";
import { setStage, addTokens } from "../../agent/store";
import "./walk.css";

export default function Walkthrough({ projects }: { projects: ProjectLite[] }) {
  // Signal hydration so the inline gate's fail-open timer stands down. If this
  // never runs (hydration failed), the gate drops after its timeout and the
  // stages become visible with no animation.
  useEffect(() => {
    document.documentElement.classList.add("walk-hydrated");
  }, []);

  const enter = (stage: string, tokens: number) => () => {
    setStage(stage);
    addTokens(tokens);
  };

  return (
    <div className="walk" data-testid="walkthrough">
      <ModelCard onEnter={enter("modelcard", 24000)} />
      <TrainingRun onEnter={enter("experience", 30000)} />
      <EvalSuite projects={projects} onEnter={enter("projects", 36000)} />
    </div>
  );
}
