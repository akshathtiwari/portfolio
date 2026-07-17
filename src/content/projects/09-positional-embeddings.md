---
title: "Positional Embeddings Deep-Dive: From Sinusoidal PE to RoPE"
summary: "A numerical and visual investigation of why self-attention needs positional information at all, and why absolute positional encodings eventually break down — motivating RoPE."
theme: "Foundational / Educational"
techStack: ["NumPy", "PyTorch", "Matplotlib"]
featured: false
order: 9
---

Numerically proves self-attention's permutation invariance, then implements sinusoidal positional encoding (NumPy and a full PyTorch `TransformerEncoder`) and visualizes it as heatmaps, frequency waves, and cosine-decay curves. Demonstrates two concrete failure modes of absolute PE — information pollution at long range and extrapolation failure when sequence length grows (512 → 1024) — as the motivation for relative schemes like RoPE.
