# Portfolio Narrative & Experience Design

**Working title:** *The Agent Portfolio*
**Status:** DRAFT for review. Nothing is built yet. This document is the plan.
**Author of record:** Akshath Tiwari. Drafted by Claude for review.

---

## 0. How to read this doc

Sections 1 to 9 are the creative and product design (the "what" and "why").
Section 10 is the tech stack. Sections 11 to 14 are engineering, accessibility, and rollout.
Section 15 is the list of decisions I need from you before I build anything.

If you only read one thing, read **Section 1** (the concept) and **Section 15** (the decisions).

---

## 1. The concept in one line

> Your portfolio is not a website. It is an ML agent that boots up, loads a checkpoint trained on your career, and runs an inference pass that walks the visitor through everything you have built.

The visitor does not "browse pages." They watch (and optionally drive) an agent that reasons about you, retrieves your work, runs evals on your projects, and at the end computes a **FitScore** for the visitor themselves. The whole site is a playable trace of an agent doing its job, and the job is presenting Akshath Tiwari.

This is the most honest possible portfolio for you specifically: you fine-tune LLMs, build agents, and ship a candidate-job matching product called FitScore. The site *is* that work, turned inward on you.

---

## 2. Why this works (and where it could backfire)

**Why it fits you:**
- It demonstrates the skill instead of listing it. A recruiter does not read "built LLM agents." They watch one run.
- The ML-pipeline framing gives a rigid, meaningful skeleton to hang animation on. Every animation means something (a forward pass, a retrieval, an eval), so it never feels like decoration.
- It ties directly to FitScore, your actual product. The finale computes the visitor's fit. That is a memorable, on-brand payoff.

**Where it could backfire, and the guardrails:**
- **Recruiters are time-poor.** A forced cinematic intro is a liability. Guardrail: a permanent **"manual override / skip to content"** path from the first second, plus a **fast, static, real portfolio underneath** that works with zero animation. The agent is a layer on top of a solid site, never a gate in front of it.
- **Gimmick fatigue.** If the ML jokes are constant, it reads as a toy. Guardrail: the agent is *competent and dry*, not zany. ML terms are used correctly and sparingly. The tone is "senior engineer who is quietly having fun," not "quirky mascot."
- **Accessibility and SEO.** Everything the agent "says" is real DOM text, indexable and screen-reader friendly. `prefers-reduced-motion` collapses the whole thing into a clean scrollable transcript. Details in Section 12.

---

## 3. The Agent

### 3.1 Persona

The agent is a model of you. It speaks in first person as an inference run of a checkpoint fine-tuned on your career. It is aware that it is a language model built by a language-model engineer, and it uses that lightly (one or two meta beats, not a running gag).

- **Codename (proposed):** `AXON`. Short, neural, reads as a name.
  Alternates on the table: `ATLAS`, `LATENT`, `GRADIENT`, `ORACLE`, `KV` (kv-cache pun), or name it after the checkpoint directly: `tiwari-1`.
- **Checkpoint id shown in UI:** `tiwari-axon-v1` (a self-model).
- **One-line self-description:** "An agent fine-tuned on Akshath Tiwari's work. My context window is his career."

### 3.2 Visual form

Not a cartoon robot. An **abstract attention-graph entity**: a small constellation of nodes and edges that reconfigures based on state (edges light up like attention weights, nodes pulse on decode). This is on-brand with the existing neural-net hero canvas and stays elegant and senior.

- **Phase 1 (de-risked):** 2D, drawn with SVG or Canvas. Fully controllable, cheap, fast.
- **Phase 2 (optional upgrade):** 3D with react-three-fiber. The entity becomes a volumetric node cloud floating in a shallow "latent space." Same behavior, more depth.

The agent has a persistent presence (docked in a corner once you scroll past the boot, or center-stage during the boot and finale) and a text channel (a terminal/chat surface) where it decodes its narration.

### 3.3 State machine

The agent is literally a finite state machine. This is thematically perfect (an agent) and technically clean (see XState in Section 10).

| State | ML framing | Visual | When |
|---|---|---|---|
| `cold_start` | loading weights, allocating KV cache | boot log, progress, dim graph | first paint |
| `idle` | KV cache warm | slow breathing pulse | between beats |
| `forward_pass` | running inference | edges sweep, spinner "187 tok/s" | section transitions, loading |
| `decoding` | token-by-token generation | typewriter text + node flicker per token | when it speaks |
| `attending` | attention focused on section X | edges reach toward the active section | scroll-driven narration |
| `high_temperature` | playful/uncertain | jitter, glitch | easter eggs, errors |

---

## 4. Site map mapped onto an ML pipeline

The existing content stays. It gets re-skinned as stages of a model lifecycle and an agent execution trace. Nothing is thrown away; the projects, experience, blog, papers, and contact all remain and keep their real content and SEO.

| Current section | ML re-skin | What the agent does here |
|---|---|---|
| Home / About | **System Prompt + Model Card** | Loads its own model card: architecture (human), training data (education + roles), intended use, limitations (as a joke: "does not do frontend on weekends"). |
| Experience | **Training Run / Checkpoints** | Career as a training curve. Each role is a checkpoint; loss trends down, capabilities unlock over time. |
| Projects | **Tool Registry + Eval Suite** | Each project is a tool the agent can call and a benchmark it scores on. It "runs" evals live. |
| Blog | **Knowledge Base (RAG)** | Retrieves and cites your writing when relevant to what the visitor is looking at. |
| Papers & Talks | **Retrieval corpus / references** | Same retrieval surface; paper notes and talks are documents in the index. |
| Volunteering | **Open weights / community compute** | Pro-bono work framed as "open-sourced compute for nonprofits." |
| Contact | **Inference endpoint** | Reaching out is sending a request to the agent's API. |

### 4.1 Experience as a training run (detail)

Real timeline, re-skinned. Loss goes down, capabilities come online:

- **Manipal University Jaipur, BTech (2019 to 2023)** = **pretraining**. Broad corpus, base representations. Loss high but dropping fast.
- **Internships (Tata Advanced Systems, Boeing, Sikorsky)** = **data collection and early experiments**. Small runs, exploratory.
- **Deloitte Australia, Software Developer** = **supervised fine-tuning**. Structured product work, Python and Golang, AI and backend. Sharper, task-specific.
- **Phenom, PDE II - ML (current)** = **RLHF + production serving**. LLM fine-tuning (SFT and RL), agents, SLM harness engineering, FitScore. The checkpoint that ships.

Visual: a single scrubbable loss curve along the scroll. As you scroll, the playhead moves down the curve, each checkpoint pops with the role, and "capabilities unlocked" chips appear (e.g. `unlocked: QLoRA`, `unlocked: vLLM serving`, `unlocked: LangGraph agents`).

### 4.2 Projects as an eval suite (detail)

Your nine projects become a benchmark board. Each project card is a "tool" with a live "eval run":

- Fine-Tuning Small LLMs to Match GPT-4.1 (FitScore fine-tuning) -> eval: `student vs teacher`, score bar animates to "within 2 pts of GPT-4.1."
- Production LLM FitScore Microservice -> eval: `p99 latency`, `throughput`.
- GEPA-DSPy Prompt Optimization -> eval: `prompt score before/after`.
- Golden Dataset Pipeline (LLM-as-Judge + Argilla) -> eval: `judge vs human agreement`.
- LangGraph Deep-Research Agent -> eval: `task success rate`.
- Contributing to LangChain open_deep_research -> eval: `merged upstream` (a green check).
- vLLM Inference Benchmarking -> eval: `tokens/s under load`.
- GPT-From-Scratch -> eval: `it trains` (loss curve descends).
- Positional Embeddings Deep-Dive (Sinusoidal to RoPE) -> eval: `long-context extrapolation`.

The visitor can let the agent auto-run all evals (a cascading benchmark animation) or click a single tool to have the agent "call" it and narrate the result.

---

## 5. The user journey (flow)

```
  COLD START (boot)                    <- full screen, ~3s, skippable
      |
      v
  GREETING + FORK                      <- agent introduces itself, offers 3 paths
      |
      +--> [Run walkthrough]  guided autopilot: agent scroll-drives, narrates each stage
      +--> [I'll drive]       manual: free scroll, agent narrates on demand from the dock
      +--> [Skip to content]  instant plain portfolio, agent minimized (recruiter fast-path)
      |
      v
  STAGE 1  System Prompt / Model Card
  STAGE 2  Training Run / Experience
  STAGE 3  Tool Registry / Projects (eval suite)
  STAGE 4  Knowledge Base / Blog + Papers (retrieval)
  STAGE 5  Open Weights / Volunteering
      |
      v
  FINALE  FitScore(visitor)            <- agent has "enough context", computes the payoff
      |
      v
  CONTACT / Inference endpoint         <- send a request (email, links)
```

The three-way fork at the greeting is the single most important UX decision in the whole design. It respects the visitor's time and intent from second one.

---

## 6. Sample script (the agent's voice)

This is a first draft of tone and copy. Real copy gets refined, but this sets the register: competent, dry, precise, lightly self-aware. No em-dashes, mechanism-first, correct ML.

### 6.1 Cold start (boot log, printed line by line)

```
▸ cold start: mounting checkpoint tiwari-axon-v1
▸ loading weights            ██████████  4.2B params
▸ allocating KV cache        128k context
▸ compiling CUDA graphs      ok
▸ warmup forward pass        187 tok/s
▸ attention heads online     32 / 32
✔ awake.
```

### 6.2 Greeting (decoded token by token, real text)

> Hi. I am AXON, an agent fine-tuned on Akshath Tiwari's work.
> My context window is his career, and I have just finished loading it.
> I can run the walkthrough myself, or you can drive. Your call.
>
> `[ Run walkthrough ]`   `[ I'll drive ]`   `[ Skip to content ]`

### 6.3 Stage 1, Model Card

> First, the model card. Architecture: one human, Hyderabad-resident, ML engineer at Phenom.
> Training data: a BTech from Manipal, a stint building product at Deloitte Australia, and a lot of fine-tuning runs since.
> Intended use: fine-tuning LLMs, building agents, and shipping them. Out of scope: pretending web design is his day job. That part is me.

### 6.4 Stage 2, Training Run

> Watch the loss. Manipal was pretraining, broad and noisy. Deloitte was supervised fine-tuning, structured and task-specific. Phenom is where the RL happened, and where the checkpoint started shipping. Every marker on this curve unlocked a capability. Scroll and I will call them out.

### 6.5 Stage 3, Eval Suite

> These are his tools. I can call any one of them, or run the whole suite. The headline eval: a 4B student fine-tuned to land within two points of GPT-4.1 on candidate-job matching, then quantized and served on vLLM. Want the full board, or pick one?

### 6.6 Finale, FitScore

> I have enough context now. Running the eval I was built for.
> Computing FitScore(you) against this candidate...
> Based on how you moved through this, your fit reads high. If you are hiring or want to build something, that score is easy to act on.
>
> `[ sudo hire ]`  `[ send inference request ]`

---

## 7. ML terminology glossary (kept correct and consistent)

A shared vocabulary so animations and copy stay accurate and do not drift into nonsense. Used across the whole site.

- **cold start / warmup**: the boot.
- **checkpoint**: a career stage or a saved state.
- **forward pass**: any loading or transition.
- **decoding / tokens/s**: the agent typing.
- **KV cache**: session memory, "context stays warm."
- **attention heads**: what the agent focuses on (the active section).
- **context window**: the visitor's progress meter (0 to 128k tokens "ingested").
- **eval / benchmark**: a project result.
- **RAG / retrieval**: pulling in blog and paper content.
- **temperature**: playfulness or uncertainty (easter eggs run "hot").
- **FitScore**: the finale, and a real nod to the product.
- **open weights**: volunteering.

Rule: never use a term as pure flavor if it contradicts its real meaning. The whole point is that you would notice, and so would the ML people you want to impress.

---

## 8. Gamification mechanics

Layered so that none of it blocks content. All of it is skippable and degrades gracefully.

1. **Context window meter (progress).** A bar that fills as the visitor explores: "context: 34k / 128k tokens." Reaching 128k unlocks the finale FitScore. Persisted in localStorage.
2. **Capabilities unlocked (achievements).** Visiting a stage or triggering an action lights a capability chip: `Retrieval`, `Tool Use`, `Long Context`, `RLHF`. A quiet HUD, not confetti.
3. **The terminal (skill-based easter egg).** A command surface (open with `/` or a key). Real commands:
   - `help`, `whoami`, `ls projects`, `cat experience`, `open blog`
   - `run eval fitscore` (triggers the headline eval animation)
   - `deploy` (a joke: "already deployed, that is what you are looking at")
   - `sudo hire` (jumps to contact)
   - `clear`, and a hidden `jailbreak` that runs the agent "hot" for a few seconds (harmless glitch mode).
4. **Autopilot vs manual.** The walkthrough can drive the scroll itself (a cinematic autopilot) or hand control back. A visible toggle.
5. **The FitScore finale.** The payoff. A playful, clearly-labeled-as-fun score computed from the visitor's path (sections seen, tools run, terminal used). Never fake-serious, always a smile plus a real call to action.

Optional, only if you want it: subtle sound design (boot blips, decode ticks), muted by default with a toggle.

---

## 9. Signature animations per stage (and which tool does it)

| Stage | Signature moment | Primary tool |
|---|---|---|
| Boot | Log prints, weights bar fills, graph ignites, agent "wakes" | GSAP timeline + custom canvas |
| Greeting | Token-by-token decode, node flicker per token | Framer Motion + custom hook |
| Model Card | Card assembles from scattered tokens into a HuggingFace-style card | Framer Motion layout |
| Training Run | Scroll-scrubbed loss curve, checkpoints pop, capability chips fly in | GSAP ScrollTrigger + SVG path draw |
| Eval Suite | Cascading benchmark bars, live "tool call" on click | Framer Motion staggers |
| Retrieval | Documents fly from a corpus into a citation, text highlights | Framer Motion + Lenis |
| Finale | Attention graph converges, FitScore counts up, entity "exhales" | GSAP + R3F (optional) |
| Global | Smooth inertial scroll tying it all together | Lenis |

---

## 10. Tech stack

### 10.1 Recommendation: keep Astro, add React islands

**Astro 5 (current) + `@astrojs/react`**, with the animated experience built as React islands. Rationale:

- You keep everything that already works: content collections (projects, blog, papers), SEO (canonical, OG, sitemap, JSON-LD), the immersive KaTeX blog post we just shipped, and the push-to-main Vercel deploy.
- Astro islands let you run real React plus the full animation ecosystem exactly where you need it, while the rest of the site stays static and fast.
- The persistent agent across route changes is solvable in Astro with **View Transitions** and `transition:persist` (the agent island survives navigation).

**Libraries:**
- **Framer Motion (`motion`)**: declarative UI animation, orchestration, layout animations, scroll-linked values.
- **GSAP + ScrollTrigger**: cinematic, scroll-scrubbed timelines (boot, loss curve, finale). GSAP is the right tool for frame-accurate sequenced storytelling.
- **Lenis**: smooth inertial scroll, pairs with ScrollTrigger.
- **XState**: the agent's finite state machine (`cold_start -> idle -> forward_pass -> decoding -> attending`). Thematically apt and keeps agent logic clean and testable.
- **nanostores** (or Zustand): global progress, unlocks, terminal state, shared across islands, persisted to localStorage. Nanostores is the Astro-native choice.
- **react-three-fiber + @react-three/drei** (Phase 2, optional): the 3D agent entity and latent-space field. We start 2D and upgrade only if worth it.

### 10.2 Alternative: full Next.js 15 rewrite

If you want the entire site to be one continuous React SPA with app-like route transitions everywhere and no island boundaries, the alternative is a **Next.js App Router** rewrite (same animation libs). Cost: re-migrate content to MDX in Next, rebuild the SEO layer, re-port the immersive blog post, redo the Vercel wiring. More freedom, meaningfully more work and risk, and you lose nothing you actually need by staying on Astro.

**My call:** start on Astro + React islands. Only move to Next.js if we hit a real wall, which I do not expect. This is decision D1 in Section 15.

---

## 11. Architecture notes

- **Data stays in content collections.** The React components read projects/experience/blog/papers from the same collections. No content duplication. Experience data may need a small structured file (dates, role, "capabilities unlocked" per checkpoint) since it is currently prose on a page.
- **The agent is one island** mounted globally (via the layout), driven by an XState machine, subscribed to a nanostore for progress. It persists across View Transitions.
- **Scroll orchestration** lives in a per-page GSAP timeline that reports the active stage into the store, which sets the agent's `attending` target.
- **Everything the agent says is real text** in the DOM (aria-live region for narration), so it is indexable and accessible. Canvas/3D is decorative and `aria-hidden`.
- **Progressive enhancement:** the site renders and reads as a complete static portfolio with JS disabled or animations off. The agent is additive.

---

## 12. Accessibility, performance, SEO

- **`prefers-reduced-motion`:** collapses the experience into a static "transcript" mode. The agent's narration becomes plain inline text next to each section, no autopilot, no scrubbing. This doubles as the recruiter fast-path.
- **Keyboard and screen reader:** all controls focusable, narration in an `aria-live="polite"` region, the decorative graph `aria-hidden`. The three-way fork is real buttons.
- **Performance budget:** code-split by island; only the boot experience loads eagerly. Heavy libs (R3F) lazy-load behind Phase 2 and only on capable devices. Target: keep Lighthouse performance healthy and not regress current fast loads. Respect data-saver and low-power hints.
- **SEO:** static HTML for all real content is preserved (Astro renders it). Meta, OG, sitemap, JSON-LD stay. The agent layer does not hide content from crawlers.
- **The fast path is sacred:** "Skip to content" is reachable in one action from the first frame and is remembered for return visits.

---

## 13. Rollout plan (phased, so we ship value early)

**Phase 0, Foundations.** Add `@astrojs/react`, Framer Motion, GSAP, Lenis, XState, nanostores. Wire View Transitions and a persistent (empty) agent island. Structure the experience data. No visible change yet beyond plumbing.

**Phase 1, The Boot + Greeting + Fork.** The landing cold-start, the agent waking, token-by-token greeting, and the three-way fork. This is the headline moment and validates the whole idea on its own. Ship it, review, iterate.

**Phase 2, The Walkthrough stages.** Model Card, then Training Run (loss curve), then Eval Suite (projects). Autopilot and manual modes. The core of the experience.

**Phase 3, Retrieval + Open Weights + Finale.** Blog/papers retrieval surface, volunteering, and the FitScore finale with the terminal and gamification HUD.

**Phase 4, Polish + optional 3D.** Sound (optional), the R3F upgrade of the entity (optional), reduced-motion transcript pass, performance and accessibility audit, cross-device QA.

Each phase is independently deployable and reviewable. We do not big-bang this.

---

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Alienates time-poor recruiters | Skip-to-content fast path from frame one; solid static site underneath |
| Feels gimmicky | Dry competent tone; correct ML; sparing jokes; senior visual language |
| Performance regression | Phased libs, code-splitting, lazy 3D, reduced-motion default respected |
| Scope creep / never ships | Strict phasing; Phase 1 is a complete win by itself |
| Accessibility gaps | Real DOM text, aria-live, keyboard-first, transcript mode |
| Migration risk to the existing blog/SEO | Stay on Astro; do not rewrite what works |

---

## 15. Decisions I need from you (review these)

Answer any or all. Defaults are my recommendation if you say nothing.

- **D1. Stack.** Astro + React islands (recommended, keeps content and SEO) vs full Next.js rewrite. Default: Astro + islands.
- **D2. Agent name and persona.** `AXON` (default) or one of ATLAS / LATENT / GRADIENT / ORACLE / KV / `tiwari-1`, or your own. And: how meta should it be about "a model of a model engineer"? Default: light, one or two beats.
- **D3. Tone dial.** On a line from "playful arcade" to "restrained and senior," where do you want it? Default: about 70 percent restrained, competent-with-a-smile.
- **D4. Gamification depth.** Cosmetic only (meters and chips as flavor) vs fully interactive (terminal, easter eggs, FitScore finale, unlocks). Default: full, since it is the differentiator, but all skippable.
- **D5. The FitScore finale.** In or out? It is the strongest on-brand payoff but it is the most "gamified" moment. Default: in, clearly labeled as playful.
- **D6. 3D entity.** Commit to react-three-fiber for the agent, or keep it 2D and only upgrade later? Default: 2D first, R3F as an optional Phase 4.
- **D7. Scope of re-skin.** Does the whole site adopt the agent framing, or only the landing page while inner pages stay closer to the current clean design? Default: landing is the full experience; inner pages get lighter agent presence so they stay usable.
- **D8. Sound.** Any interest in subtle audio (muted by default), or hard no? Default: skip for now.

Once you mark these up, I will lock the plan and start Phase 0 plus Phase 1 (the boot and greeting), which is the piece worth seeing first.
