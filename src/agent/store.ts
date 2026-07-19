// Global agent state, shared across islands and persisted to localStorage.
// Satisfies R6 (persisted fork choice) and R9 (context-window meter).
import { map } from "nanostores";

export type Mode = "unset" | "walkthrough" | "manual" | "skip";

export interface AgentState {
  booted: boolean; // has the boot sequence completed for this visitor
  mode: Mode; // fork choice, persisted
  tokens: number; // context-window meter, 0..MAX_TOKENS
  unlocks: string[]; // capability chips
  stage: string; // active section for the 'attending' state
}

export const MAX_TOKENS = 128000;
const KEY = "axon.v1";
const DEFAULTS: AgentState = {
  booted: false,
  mode: "unset",
  tokens: 0,
  unlocks: [],
  stage: "",
};

function load(): AgentState {
  if (typeof localStorage === "undefined") return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* corrupt storage: fall back to defaults */
  }
  return { ...DEFAULTS };
}

export const agent = map<AgentState>(load());

if (typeof window !== "undefined") {
  agent.subscribe((v) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(v));
    } catch {
      /* private mode / quota: ignore */
    }
  });

  // Keep tabs in sync. The `storage` event only fires on real value changes in
  // other tabs, so writing an equal value back does not loop.
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY || !e.newValue) return;
    try {
      agent.set({ ...DEFAULTS, ...JSON.parse(e.newValue) });
    } catch {
      /* ignore malformed cross-tab payloads */
    }
  });
}

export function chooseMode(mode: Mode) {
  agent.setKey("mode", mode);
  agent.setKey("booted", true);
}

export function addTokens(n: number) {
  agent.setKey("tokens", Math.min(MAX_TOKENS, agent.get().tokens + n));
}

export function unlock(cap: string) {
  const u = agent.get().unlocks;
  if (!u.includes(cap)) agent.setKey("unlocks", [...u, cap]);
}

export function setStage(s: string) {
  agent.setKey("stage", s);
}

// A returning visitor is anyone who already made a fork choice.
export function isReturning(): boolean {
  return agent.get().mode !== "unset";
}

export function resetAgent() {
  agent.set({ ...DEFAULTS });
}
