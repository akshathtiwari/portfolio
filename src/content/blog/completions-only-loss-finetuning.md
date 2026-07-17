---
title: "Why Completions-Only Loss Matters When Fine-Tuning Small LLMs"
description: "A practical look at masking the prompt out of the loss when fine-tuning small models for structured tasks like scoring or extraction."
date: 2026-07-10
tags: ["fine-tuning", "llm", "unsloth", "qlora"]
draft: false
---

When you fine-tune a small model (say, a Qwen3-4B) on a structured task — scoring, extraction, classification — the training example usually looks like: a long instruction/context prompt, followed by a short structured output.

If you compute loss over the *entire* sequence, the model spends most of its gradient budget learning to predict tokens it will never need to generate at inference time — your own prompt template. Completions-only loss (`train_on_responses_only` in TRL/Unsloth) masks the prompt tokens out of the loss and trains only on the response, so every gradient step is spent on the part of the sequence that actually varies at inference time.

In practice this matters most when:

- The prompt is long relative to the completion (common in scoring/extraction tasks with lots of context)
- You're training on a small number of epochs and can't afford to waste capacity
- You care about the model's calibration on the *output distribution* specifically, not the input distribution

Combined with NEFTune noise on the embeddings and a reasonably aggressive LoRA rank (r=16 is a good default starting point), this is one of the highest-leverage, lowest-effort changes you can make to a small-model fine-tuning run before reaching for anything more exotic.

*This post is a placeholder — replace with your own write-up, benchmarks, or a link to a fuller technical breakdown.*
