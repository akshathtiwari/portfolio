---
title: "vLLM Inference Benchmarking & Load Testing"
summary: "Capacity-planning framework benchmarking vLLM serving performance directly at the engine level, plus a Locust-based load tester that measures accuracy and throughput simultaneously."
theme: "Load Testing, Benchmarking & Infra"
techStack: ["vLLM", "AWS SageMaker", "Locust", "gevent", "Prometheus", "Helm/KEDA/Istio"]
achievements:
  - "~2–3k tokens/sec aggregate throughput on a single A10 GPU (Qwen3-4B AWQ)"
  - "Concurrency sweeps from 1 to 1,000 with P50/P95/P99 latency and saturation-knee analysis"
  - "Adaptive load test that ramps +2 users/iteration and stops automatically at 5% failure rate"
  - "Simultaneously validates prediction accuracy (parsed fitscore vs. human ground truth) under load"
featured: false
order: 7
---

Two complementary benchmarking tools: an embedded vLLM engine benchmark (no HTTP layer) for raw GPU capacity planning — continuous batching, KV-cache sizing, prefix caching on/off — and a Locust-based load framework that hits the live `/v1/chat/completions` endpoint to confirm the model stays both fast *and* accurate under concurrent load.
