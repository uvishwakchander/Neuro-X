using System;
using UnityEngine;

namespace NeuroX.UnityTherapy
{
    public enum TherapyState
    {
        Idle,
        Grounding,
        Breathing,
        Focus,
        Reflection,
        Complete
    }

    public class TherapySessionManager : MonoBehaviour
    {
        [Header("Session Timing (seconds)")]
        [SerializeField] private float groundingDuration = 45f;
        [SerializeField] private float breathingDuration = 120f;
        [SerializeField] private float focusDuration = 90f;
        [SerializeField] private float reflectionDuration = 45f;

        [Header("Optional References")]
        [SerializeField] private BreathingOrbController breathingOrb;

        public TherapyState CurrentState { get; private set; } = TherapyState.Idle;
        public float StateTimeRemaining { get; private set; }

        public event Action<TherapyState> OnStateChanged;

        private void Update()
        {
            if (CurrentState == TherapyState.Idle || CurrentState == TherapyState.Complete)
            {
                return;
            }

            StateTimeRemaining -= Time.deltaTime;
            if (StateTimeRemaining <= 0f)
            {
                AdvanceState();
            }
        }

        public void StartSession()
        {
            SetState(TherapyState.Grounding, groundingDuration);
        }

        public void StopSession()
        {
            breathingOrb?.StopGuidance();
            SetState(TherapyState.Idle, 0f);
        }

        private void AdvanceState()
        {
            switch (CurrentState)
            {
                case TherapyState.Grounding:
                    SetState(TherapyState.Breathing, breathingDuration);
                    breathingOrb?.StartGuidance();
                    break;
                case TherapyState.Breathing:
                    breathingOrb?.StopGuidance();
                    SetState(TherapyState.Focus, focusDuration);
                    break;
                case TherapyState.Focus:
                    SetState(TherapyState.Reflection, reflectionDuration);
                    break;
                case TherapyState.Reflection:
                    SetState(TherapyState.Complete, 0f);
                    break;
            }
        }

        private void SetState(TherapyState next, float duration)
        {
            CurrentState = next;
            StateTimeRemaining = Mathf.Max(0f, duration);
            OnStateChanged?.Invoke(CurrentState);
        }
    }
}
