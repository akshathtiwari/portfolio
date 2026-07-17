---
title: "Building a GPT-Style LLM From Scratch"
summary: "Implemented a GPT-style language model end-to-end from first principles — tokenization, BPE, embeddings, attention — following Sebastian Raschka's methodology, to build real intuition beneath the frameworks."
theme: "Foundational / Educational"
techStack: ["PyTorch", "tiktoken"]
featured: false
order: 8
---

Regex tokenizer → custom vocabulary with special tokens → byte-pair encoding via `tiktoken` (GPT-2 vocab) → sliding-window input/target pairs → a PyTorch `Dataset`/`DataLoader` → token and positional embeddings (vocab 50,257 × dim 256). Built as a deliberate foundations exercise: the same primitives underpin every fine-tuning and inference project in this portfolio.
