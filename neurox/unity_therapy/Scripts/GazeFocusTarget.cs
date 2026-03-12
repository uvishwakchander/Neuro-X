using UnityEngine;
using UnityEngine.Events;

namespace NeuroX.UnityTherapy
{
    public class GazeFocusTarget : MonoBehaviour
    {
        [SerializeField] private float requiredFocusSeconds = 3f;
        [SerializeField] private UnityEvent onFocusSuccess;
        [SerializeField] private Renderer targetRenderer;
        [SerializeField] private Color idleColor = new Color(0.35f, 0.75f, 0.95f);
        [SerializeField] private Color activeColor = new Color(0.5f, 0.95f, 0.7f);

        private float focusedTime;
        private bool completed;

        private void Start()
        {
            SetColor(idleColor);
        }

        private void Update()
        {
            if (!completed && focusedTime > 0f)
            {
                focusedTime = Mathf.Max(0f, focusedTime - (Time.deltaTime * 0.3f));
            }
        }

        public void BeginFocus()
        {
            if (completed)
            {
                return;
            }

            focusedTime += Time.deltaTime;
            SetColor(activeColor);

            if (focusedTime >= requiredFocusSeconds)
            {
                completed = true;
                onFocusSuccess?.Invoke();
            }
        }

        public void EndFocus()
        {
            if (!completed)
            {
                SetColor(idleColor);
            }
        }

        public void ResetFocusTask()
        {
            completed = false;
            focusedTime = 0f;
            SetColor(idleColor);
        }

        private void SetColor(Color c)
        {
            if (targetRenderer != null && targetRenderer.material != null)
            {
                targetRenderer.material.color = c;
            }
        }
    }
}
