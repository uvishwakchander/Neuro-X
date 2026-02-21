# NeuroX — Different Minds, Equal Power

## Synopsis

Modern workplaces are built for speed, uniformity, and constant availability—but human minds are not. An estimated **15–20%** of the global workforce is neurodiverse, including individuals with ADHD, autism spectrum conditions, dyslexia, anxiety, and other cognitive differences. Research consistently shows that neurodiverse employees can be **30–40%** more productive in environments suited to their cognitive styles.

Yet nearly **60%** leave their roles—not because of ability, but because workplaces fail to adapt to how they think, communicate, and focus.

This mismatch fuels disengagement, burnout, and attrition, contributing to an estimated **$322 billion** in annual global productivity losses. Most enterprise productivity and collaboration tools unintentionally worsen the problem by optimizing for a narrow definition of “normal” productivity: fast responses, rigid workflows, constant visibility, and one-size-fits-all performance metrics.

**NeuroX exists to flip this model.**

## Current Build (Working MVP)

This repository includes a working Python MVP for adaptive task prioritization:

- `NeuroProfile`: self-declared focus and sensory preferences with input validation
- `Task`: normalized work item with safe constraints (non-empty title, positive estimate, urgency 1-5)
- `task_score`: explainable score balancing urgency, time-load, burst preference, and overload risk
- `prioritize_tasks`: deterministic ordering optimized for sustainable productivity
- `rank_tasks`: score + ordering output for explainability/use in UIs

## Quick Start

### Build

```bash
make build
```

### Test

```bash
make test
```

### Show Working (Demo)

```bash
make demo
```

Example output:

```text
NeuroX prioritized plan:

1. Review sprint backlog (urgency=4, estimate=30m, score=9.40)
2. Send standup update (urgency=3, estimate=10m, score=7.47)
3. Prepare board report (urgency=5, estimate=75m, score=6.75)
```
