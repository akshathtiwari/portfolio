// Experience re-skinned as a training run (R12). Real career, framed as
// checkpoints with a descending loss and capabilities unlocked at each stage.
// `loss` is a 0..1 value used only to plot the curve (high = early/noisy).

export type TrainingPhase = "pretraining" | "data" | "sft" | "rlhf";

export interface Checkpoint {
  id: string;
  phase: TrainingPhase;
  phaseLabel: string;
  org: string;
  role: string;
  period: string;
  loss: number;
  note: string;
  caps: string[];
}

export const JOURNEY: Checkpoint[] = [
  {
    id: "manipal",
    phase: "pretraining",
    phaseLabel: "pretraining",
    org: "Manipal University Jaipur",
    role: "B.Tech",
    period: "2019 - 2023",
    loss: 0.92,
    note: "Broad, noisy corpus. Base representations for everything that came after.",
    caps: ["Python", "ML fundamentals", "DSA"],
  },
  {
    id: "internships",
    phase: "data",
    phaseLabel: "data collection",
    org: "Tata Advanced Systems / Boeing / Sikorsky",
    role: "Intern",
    period: "2021 - 2022",
    loss: 0.72,
    note: "Small exploratory runs. Real engineering data, first contact with production constraints.",
    caps: ["Data pipelines", "Applied experimentation"],
  },
  {
    id: "deloitte",
    phase: "sft",
    phaseLabel: "supervised fine-tuning",
    org: "Deloitte Australia",
    role: "Software Developer",
    period: "2023 - 2024",
    loss: 0.44,
    note: "Structured product work. Sharper, task-specific, shipping to a real team.",
    caps: ["Golang", "Backend / APIs", "AI product work"],
  },
  {
    id: "phenom",
    phase: "rlhf",
    phaseLabel: "RLHF + serving",
    org: "Phenom",
    role: "Product Development Engineer II - ML",
    period: "2024 - present",
    loss: 0.17,
    note: "Where the RL happened, and where the checkpoint started shipping. FitScore lives here.",
    caps: [
      "LLM fine-tuning (SFT & RL)",
      "QLoRA / Unsloth / GRPO",
      "vLLM serving & quantization",
      "LangGraph agents",
      "LLM-as-judge eval",
    ],
  },
];
