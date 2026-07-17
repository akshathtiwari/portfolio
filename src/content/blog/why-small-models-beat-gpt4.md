---
title: "Getting a Fine-Tuned 4B Model Within 2 Points of GPT-4.1"
description: "Notes on what actually moved the needle when distilling a GPT-4.1 scoring pipeline into a fine-tuned Qwen3 model — and where the small model still falls short."
date: 2026-07-15
tags: ["llm", "distillation", "evaluation", "vllm"]
draft: false
---

Distilling a large proprietary model into a small open one sounds simple in theory — generate training data from the teacher, fine-tune the student, done. In practice, the gap between "works in a demo" and "wins a blinded expert A/B test" comes down to a handful of unglamorous decisions:

**1. The dataset strategy matters more than the training run.** Multiple versioned prompting/formatting strategies were tried before landing on one that captured the teacher's reasoning structure without letting the student overfit to surface patterns in a single prompt template.

**2. LLM-as-judge needs its own evaluation.** Before trusting a judge to score training data or run the A/B, we had to verify the judge itself agreed with human-expert labels — otherwise you're optimizing against a broken proxy.

**3. Where the small model wins is informative.** In our case, the fine-tuned model actually beat the teacher on several structured, rule-heavy axes (education, visa status, title matching) while giving up ground on more open-ended judgment calls. That asymmetry tells you exactly where a bigger model's advantage is real vs. where it's just noise.

**4. Quantization is not free, but it's close.** Post-training quantization (W8A8, AWQ) cost a small, measurable amount of accuracy in exchange for a large serving cost reduction — worth benchmarking explicitly rather than assuming.

*This post is a placeholder — swap in your own analysis, charts, or a deeper technical breakdown of the eval methodology.*
