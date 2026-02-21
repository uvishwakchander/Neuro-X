from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class NeuroProfile:
    """Self-declared user preferences that guide workload adaptation."""

    focus_window_minutes: int
    prefers_short_bursts: bool
    sensory_overload_risk: float

    def __post_init__(self) -> None:
        if self.focus_window_minutes <= 0:
            msg = "focus_window_minutes must be > 0"
            raise ValueError(msg)
        if not 0 <= self.sensory_overload_risk <= 1:
            msg = "sensory_overload_risk must be between 0 and 1"
            raise ValueError(msg)


@dataclass(frozen=True)
class Task:
    """A normalized work item used by the adaptive engine."""

    title: str
    estimate_minutes: int
    urgency: int

    def __post_init__(self) -> None:
        if not self.title.strip():
            msg = "title must not be empty"
            raise ValueError(msg)
        if self.estimate_minutes <= 0:
            msg = "estimate_minutes must be > 0"
            raise ValueError(msg)
        if not 1 <= self.urgency <= 5:
            msg = "urgency must be between 1 and 5"
            raise ValueError(msg)


def task_score(task: Task, profile: NeuroProfile) -> float:
    """Compute a score balancing urgency and cognitive sustainability."""

    urgency_weight = task.urgency * 2
    time_penalty = max(task.estimate_minutes - profile.focus_window_minutes, 0) / 10
    burst_bonus = 1.5 if profile.prefers_short_bursts and task.estimate_minutes <= 30 else 0
    overload_penalty = profile.sensory_overload_risk * (task.estimate_minutes / 60)

    return urgency_weight + burst_bonus - time_penalty - overload_penalty


def prioritize_tasks(tasks: list[Task], profile: NeuroProfile) -> list[Task]:
    """Return tasks ordered for sustainable productivity."""

    return sorted(tasks, key=lambda task: (-task_score(task, profile), task.estimate_minutes, task.title))


def rank_tasks(tasks: list[Task], profile: NeuroProfile) -> list[tuple[Task, float]]:
    """Return prioritized tasks including their explainable score."""

    prioritized = prioritize_tasks(tasks, profile)
    return [(task, task_score(task, profile)) for task in prioritized]
