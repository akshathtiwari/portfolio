// AXON's finite state machine (R8). Drives the entity's visual state.
// cold_start -> idle -> {decoding, forward_pass, attending} -> idle
import { createMachine } from "xstate";

export const agentMachine = createMachine({
  id: "axon",
  initial: "cold_start",
  types: {} as {
    events:
      | { type: "BOOT_DONE" }
      | { type: "SPEAK" }
      | { type: "DECODE_DONE" }
      | { type: "THINK" }
      | { type: "READY" }
      | { type: "FOCUS" }
      | { type: "BLUR" };
  },
  states: {
    cold_start: { on: { BOOT_DONE: "idle" } },
    idle: {
      on: { SPEAK: "decoding", THINK: "forward_pass", FOCUS: "attending" },
    },
    decoding: { on: { DECODE_DONE: "idle" } },
    forward_pass: { on: { READY: "idle" } },
    attending: { on: { BLUR: "idle", FOCUS: "attending" } },
  },
});

export type AgentVisualState =
  | "cold_start"
  | "idle"
  | "decoding"
  | "forward_pass"
  | "attending";
