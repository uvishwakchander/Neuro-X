using UnityEngine;

namespace NeuroX.UnityTherapy
{
    public class BreathingOrbController : MonoBehaviour
    {
        [SerializeField] private Transform orb;
        [SerializeField] private float inhaleSeconds = 4f;
        [SerializeField] private float holdSeconds = 2f;
        [SerializeField] private float exhaleSeconds = 6f;
        [SerializeField] private Vector3 minScale = new Vector3(0.6f, 0.6f, 0.6f);
        [SerializeField] private Vector3 maxScale = new Vector3(1.4f, 1.4f, 1.4f);

        private bool running;
        private float phaseTime;
        private int phase;

        private void Reset()
        {
            orb = transform;
        }

        private void Update()
        {
            if (!running || orb == null)
            {
                return;
            }

            phaseTime += Time.deltaTime;

            if (phase == 0) // inhale
            {
                float t = Mathf.Clamp01(phaseTime / inhaleSeconds);
                orb.localScale = Vector3.Lerp(minScale, maxScale, t);
                if (phaseTime >= inhaleSeconds)
                {
                    phase = 1;
                    phaseTime = 0f;
                }
            }
            else if (phase == 1) // hold
            {
                orb.localScale = maxScale;
                if (phaseTime >= holdSeconds)
                {
                    phase = 2;
                    phaseTime = 0f;
                }
            }
            else // exhale
            {
                float t = Mathf.Clamp01(phaseTime / exhaleSeconds);
                orb.localScale = Vector3.Lerp(maxScale, minScale, t);
                if (phaseTime >= exhaleSeconds)
                {
                    phase = 0;
                    phaseTime = 0f;
                }
            }
        }

        public void StartGuidance()
        {
            running = true;
            phase = 0;
            phaseTime = 0f;
        }

        public void StopGuidance()
        {
            running = false;
            phase = 0;
            phaseTime = 0f;
            if (orb != null)
            {
                orb.localScale = minScale;
            }
        }
    }
}
