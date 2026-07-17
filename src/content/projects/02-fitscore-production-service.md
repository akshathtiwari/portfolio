---
title: "Production LLM FitScore Microservice"
summary: "FastAPI service serving a fine-tuned LLM on vLLM for real-time job–candidate scoring, with structured output, skill-gap analysis, and automatic OpenAI fallback."
theme: "Production LLM Services"
techStack: ["FastAPI", "Pydantic v2", "vLLM (xgrammar)", "MongoDB", "Redis", "Langfuse", "OpenTelemetry"]
achievements:
  - "Skill-index token-efficiency encoding: model returns integer IDs instead of names, cutting output tokens substantially"
  - "Structured JSON output via vLLM + xgrammar constrained decoding (Pydantic schema, strict mode)"
  - "Automatic OpenAI fallback on token/context errors with a daily rate limit for safety"
  - "Per-client configurable weighted scoring pulled live from MongoDB"
  - "Parallelized entity/skill extraction via ThreadPoolExecutor for lower p95 latency"
featured: true
order: 2
---

The production entry point for the FitScore system: a FastAPI microservice that extracts skills and entities from a job description and resume pair, performs multi-axis skill-gap analysis (exact / semantic / no-match), and produces a weighted, explainable fitscore with per-axis reasoning — all served by a fine-tuned model running on vLLM.

Includes a healthcare-specific scoring path and live prompt management via Langfuse's prompt registry, so prompts can be iterated without a redeploy.
