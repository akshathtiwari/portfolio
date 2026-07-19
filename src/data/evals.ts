// Projects re-skinned as an eval board (R13). Each project is a "tool" AXON can
// call, with an eval line. Values are qualitative and illustrative (AXON's read
// of the work), not precise published benchmarks, except where the writeups
// state a real figure (e.g. the 4B student landing within ~2 points of GPT-4.1).
// Keyed by the project collection id.

export interface EvalMeta {
  metric: string;
  value: string;
  bar: number; // 0..100, AXON's confidence in the result
}

export const EVALS: Record<string, EvalMeta> = {
  "01-fitscore-finetuning": {
    metric: "student vs teacher",
    value: "within ~2 pts of GPT-4.1",
    bar: 96,
  },
  "02-fitscore-production-service": {
    metric: "serving",
    value: "in production, low latency",
    bar: 90,
  },
  "03-gepa-prompt-optimization": {
    metric: "prompt score",
    value: "up vs hand-written baseline",
    bar: 85,
  },
  "04-argilla-golden-data": {
    metric: "judge vs human",
    value: "high agreement",
    bar: 91,
  },
  "05-deep-research-agent": {
    metric: "task success",
    value: "runs end to end",
    bar: 83,
  },
  "06-open-deep-research": {
    metric: "upstream",
    value: "merged into LangChain",
    bar: 100,
  },
  "07-vllm-benchmarking": {
    metric: "throughput under load",
    value: "sustained, profiled",
    bar: 89,
  },
  "08-gpt-from-scratch": {
    metric: "training loss",
    value: "descends, it trains",
    bar: 100,
  },
  "09-positional-embeddings": {
    metric: "long-context",
    value: "sinusoidal to RoPE",
    bar: 87,
  },
};

export const DEFAULT_EVAL: EvalMeta = {
  metric: "eval",
  value: "passes",
  bar: 80,
};
