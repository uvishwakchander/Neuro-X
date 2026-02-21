import unittest

from neurox import NeuroProfile, Task, prioritize_tasks, rank_tasks


class PrioritizationTests(unittest.TestCase):
    def test_prefers_short_bursts_surfaces_short_tasks(self):
        profile = NeuroProfile(
            focus_window_minutes=45,
            prefers_short_bursts=True,
            sensory_overload_risk=0.2,
        )
        tasks = [
            Task("Deep architecture review", estimate_minutes=90, urgency=4),
            Task("Send standup update", estimate_minutes=10, urgency=3),
        ]

        prioritized = prioritize_tasks(tasks, profile)

        self.assertEqual(prioritized[0].title, "Send standup update")

    def test_urgency_still_matters_with_longer_tasks(self):
        profile = NeuroProfile(
            focus_window_minutes=60,
            prefers_short_bursts=False,
            sensory_overload_risk=0.1,
        )
        tasks = [
            Task("Prepare board report", estimate_minutes=75, urgency=5),
            Task("Sort inbox", estimate_minutes=20, urgency=2),
        ]

        prioritized = prioritize_tasks(tasks, profile)

        self.assertEqual(prioritized[0].title, "Prepare board report")

    def test_rank_tasks_returns_scores_in_sorted_order(self):
        profile = NeuroProfile(45, True, 0.2)
        tasks = [
            Task("A", estimate_minutes=90, urgency=4),
            Task("B", estimate_minutes=10, urgency=3),
            Task("C", estimate_minutes=20, urgency=3),
        ]

        ranked = rank_tasks(tasks, profile)

        self.assertGreaterEqual(ranked[0][1], ranked[1][1])
        self.assertGreaterEqual(ranked[1][1], ranked[2][1])


class ValidationTests(unittest.TestCase):
    def test_profile_validation(self):
        with self.assertRaises(ValueError):
            NeuroProfile(focus_window_minutes=0, prefers_short_bursts=True, sensory_overload_risk=0.2)

        with self.assertRaises(ValueError):
            NeuroProfile(focus_window_minutes=30, prefers_short_bursts=True, sensory_overload_risk=1.5)

    def test_task_validation(self):
        with self.assertRaises(ValueError):
            Task("", estimate_minutes=20, urgency=2)

        with self.assertRaises(ValueError):
            Task("Draft memo", estimate_minutes=0, urgency=2)

        with self.assertRaises(ValueError):
            Task("Draft memo", estimate_minutes=20, urgency=6)


if __name__ == "__main__":
    unittest.main()
