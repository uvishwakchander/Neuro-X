from __future__ import annotations

from neurox import NeuroProfile, Task, rank_tasks


def main() -> None:
    profile = NeuroProfile(
        focus_window_minutes=45,
        prefers_short_bursts=True,
        sensory_overload_risk=0.2,
    )
    tasks = [
        Task("Prepare board report", estimate_minutes=75, urgency=5),
        Task("Send standup update", estimate_minutes=10, urgency=3),
        Task("Review sprint backlog", estimate_minutes=30, urgency=4),
    ]

    print("NeuroX prioritized plan:\n")
    for index, (task, score) in enumerate(rank_tasks(tasks, profile), start=1):
        print(f"{index}. {task.title} (urgency={task.urgency}, estimate={task.estimate_minutes}m, score={score:.2f})")


if __name__ == "__main__":
    main()
