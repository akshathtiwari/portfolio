---
title: "GEPA-DSPy Prompt Optimization for Profile Matching"
summary: "Applied reflective/evolutionary prompt optimization (GEPA via DSPy) to a candidate profile dedup and merge-decision system, cutting prompt development time from weeks to hours."
theme: "Prompt Engineering & Optimization"
techStack: ["DSPy", "GEPA", "Optuna", "OpenRouter", "Unsloth", "Argilla"]
achievements:
  - "10–15% accuracy lift over the legacy hand-written prompt baseline"
  - "Cut prompt development cycle from days/weeks down to hours"
  - "Per-field + combined DSPy signatures with custom score/feedback metrics"
  - "Merge-decision F1 of 0.943 on the resulting fine-tuned model"
featured: true
order: 3
---

Given two candidate profiles, decide field-by-field whether they refer to the same person and whether they should be merged. Instead of hand-tuning prompts, used `dspy.GEPA` to reflectively evolve per-field and combined-signature prompts against a custom weighted metric, then distilled the optimized prompt's behavior into a fine-tuned Qwen3 model via Unsloth for cheap production inference.
