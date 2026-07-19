// All agent narration copy lives here (real DOM text, no em-dashes, correct ML).
// Boot log and greeting are Phase 1; stage narration is used from Phase 2 on.

export const BOOT_LOG: string[] = [
  "cold start: mounting checkpoint tiwari-axon-v1",
  "loading weights            4.2B params",
  "allocating KV cache        128k context",
  "compiling CUDA graphs      ok",
  "warmup forward pass        187 tok/s",
  "attention heads online     32 / 32",
  "awake.",
];

// The greeting AXON decodes token by token after boot (R2).
export const GREETING: string =
  "Hi. I am AXON, an agent fine-tuned on Akshath Tiwari's work. " +
  "My context window is his career, and I have just finished loading it. " +
  "I can run the walkthrough myself, or you can drive. Your call.";

export interface ForkOption {
  id: "walkthrough" | "manual" | "skip";
  label: string;
  hint: string;
}

export const FORK: ForkOption[] = [
  { id: "walkthrough", label: "Run walkthrough", hint: "AXON drives and narrates" },
  { id: "manual", label: "I'll drive", hint: "free scroll, narration on demand" },
  { id: "skip", label: "Skip to content", hint: "the plain portfolio, now" },
];

// Short line shown in the dock once the visitor is in the site.
export const DOCK_LINE: Record<string, string> = {
  walkthrough: "walkthrough armed. scroll to begin.",
  manual: "manual mode. I am here if you need me.",
  skip: "minimized. call me with the dock.",
};

// Stage narration for later phases (kept here so all copy is in one place).
export const STAGE_NARRATION: Record<string, string> = {
  modelcard:
    "First, the model card. Architecture: one human, ML engineer at Phenom. Training data: a BTech from Manipal, product work at Deloitte Australia, and a lot of fine-tuning runs since.",
  experience:
    "Watch the loss. Manipal was pretraining. Deloitte was supervised fine-tuning. Phenom is where the RL happened, and where the checkpoint started shipping.",
  projects:
    "These are his tools. I can call any one, or run the whole suite. Headline eval: a 4B student fine-tuned to land within two points of GPT-4.1, then quantized and served on vLLM.",
  knowledge:
    "His writing is my retrieval corpus. Ask about attention scaling and I will pull the post he wrote on it.",
  finale:
    "I have enough context now. Running the eval I was built for. Computing FitScore for you against this candidate.",
};
