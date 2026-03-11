using TMPro;
using UnityEngine;

namespace NeuroX.UnityTherapy
{
    public class CalmAffirmationBoard : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI textField;
        [SerializeField] private float rotateEverySeconds = 5f;

        [TextArea]
        [SerializeField]
        private string[] affirmations =
        {
            "You are safe in this moment.",
            "Small steps still count as progress.",
            "Breathe in calm, breathe out tension.",
            "Your pace is valid and enough.",
            "You can reset and begin again."
        };

        private int index;
        private float timer;

        private void Start()
        {
            ShowCurrent();
        }

        private void Update()
        {
            if (affirmations == null || affirmations.Length == 0)
            {
                return;
            }

            timer += Time.deltaTime;
            if (timer >= rotateEverySeconds)
            {
                timer = 0f;
                index = (index + 1) % affirmations.Length;
                ShowCurrent();
            }
        }

        private void ShowCurrent()
        {
            if (textField != null && affirmations != null && affirmations.Length > 0)
            {
                textField.text = affirmations[index];
            }
        }
    }
}
