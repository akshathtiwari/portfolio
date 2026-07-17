---
title: "Contributing to LangChain's open_deep_research"
summary: "Ran and contributed to LangChain's flagship open-source deep research agent — a supervisor + sub-researcher multi-agent system that placed #6 on Deep Research Bench."
theme: "AI Agents"
techStack: ["LangGraph", "LangChain", "Tavily", "MCP", "LangGraph Platform"]
achievements:
  - "#6 on Deep Research Bench with a score of 0.4344 (0.4943 on the GPT-5 configuration)"
  - "Supervisor + sub-researcher multi-agent architecture: clarify → research brief → parallel ConductResearch → compression → report"
  - "Evaluated with an LLM-as-judge (RACE score, Gemini judge) against benchmark tasks"
featured: false
order: 6
---

Worked with LangChain's `open_deep_research` architecture: a supervisor agent decomposes a research request into a brief, dispatches parallel sub-researchers using a `think_tool` for intermediate reasoning and a `ResearchComplete` signal, then compresses and merges findings into a final report — all under explicit token-budget management.
