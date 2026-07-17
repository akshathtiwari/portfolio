---
title: "Golden Dataset Pipeline: LLM-as-Judge + Argilla Annotation"
summary: "6-stage pipeline turning raw scoring outputs into a validated golden dataset, combining LLM-as-judge pre-labeling with human review in Argilla."
theme: "Data Labeling & Evaluation"
techStack: ["Argilla", "FastAPI", "React/Vite/TS", "Kafka", "MongoDB", "Snowflake", "Langfuse", "OpenAI Batch API"]
achievements:
  - "50+ evaluation dimensions annotated across the pipeline"
  - "40% cycle-time reduction per record (60 min → 25 min) via LLM-as-judge pre-labeling"
  - "Parallelized 4 concurrent judge calls, cutting eval time from 4–6 min to 1–2 min per case"
  - "12 automated validation checks before data is promoted to golden"
featured: false
order: 4
---

Silver production data flows through an LLM judge, then into Argilla for structured human annotation, then through export/validate/merge steps to produce a trusted "golden" ground-truth dataset. A dual judge setup compares the legacy scoring system against real hiring outcomes on Snowflake, while a newer meta-judge scores extraction, skill-gap, and matching quality in parallel calls.
