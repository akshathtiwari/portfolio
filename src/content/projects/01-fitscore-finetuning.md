---
title: "Fine-Tuning Small LLMs to Match GPT-4.1 on Candidate–Job Matching"
summary: "Fine-tuned Qwen3 (0.6B/4B, quantized) to reproduce a GPT-4.1-quality FitScore engine, closing a blinded A/B win-rate gap to within 1.9 points of the teacher model while running far cheaper."
theme: "LLM Fine-Tuning & Model Optimization"
techStack: ["Unsloth", "HuggingFace TRL", "PEFT (QLoRA/LoRA)", "GRPO", "vLLM", "llmcompressor", "AWS SageMaker", "Qwen3"]
achievements:
  - "Blinded expert A/B test (76 evals × 9 attributes): fine-tuned model scored 76.0% win rate vs GPT-4.1's 77.9% — only 1.9 pts behind the teacher"
  - "Beat GPT-4.1 outright on 5 of 9 scoring attributes (Experience, Domain, Education, Visa, Title)"
  - "37 numbered fine-tune experiments; best run: 23h on 1×A10G, 4,653 samples, train loss 1.279 → 0.273"
  - "~14% inference token budget cut via prompt/reasoning compression"
  - "Quantized to GPTQ W8A8/W4A16 and AWQ for cheap production serving on vLLM"
featured: true
order: 1
---

Built the end-to-end pipeline to distill a GPT-4.1 "FitScore" job-candidate matching system into a small, cheap-to-serve open model. This covered dataset construction (parquet → ChatML with versioned prompting strategies), QLoRA fine-tuning with completions-only loss and NEFTune noise, GRPO reinforcement learning with custom reward functions, and post-training quantization for production inference on vLLM.

The result replaced a legacy embeddings/rules engine (44% win rate) and delivered a ~10–15% F1 improvement in production, resolving 80–90% of legacy support tickets.
