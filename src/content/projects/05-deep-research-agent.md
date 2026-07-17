---
title: "LangGraph Deep-Research & Hiring Intelligence Agent"
summary: "A LangGraph state-machine agent that plans, searches, writes, and grades its own research — applied to automated hiring-intelligence reports for enterprise clients."
theme: "AI Agents"
techStack: ["LangGraph", "LangChain", "Tavily", "EXA", "LangSmith", "FastAPI"]
achievements:
  - "Multi-pass research pipeline: Role DNA → Competitive Intel → Interview Intel → merged report"
  - "Reflection/grading loop with structured Pydantic outputs at each stage"
  - "Human-in-the-loop checkpoints via interrupt/Command with MemorySaver persistence"
  - "Generated client-facing research reports (e.g. Baylor Scott & White, Thermo Fisher)"
featured: true
order: 5
---

A plan → query-write → search → section-write → grade state machine built on LangGraph, extended into a hiring-intelligence product: given a company and role, the agent researches organizational structure, competitive hiring signals, and likely interview process, then merges the findings into a structured client report — with a human able to intervene mid-run.
