# NeuroX Preview & Error Check

This file records preview and validation checks for the static MVP.

## Preview command

```bash
python -m http.server 4173 --directory /workspace/Neuro-X
```

Open in browser:

- `http://127.0.0.1:4173/neurox/index.html`

## Automated preview verification

A Playwright validation pass was run across:

- Landing / onboarding
- Dashboard (stats + wellbeing snapshot + leaderboard)
- AI Support chat (sample demo conversation)
- Forum (relevant seeded category posts)
- Games (Focus, Memory, Pattern, Speed Tap, Quick Match)
- AR/VR Therapy Game Demo (start/stop)
- Reminders (notify preview)

### Result

- `pageerror` events: **0**
- console error/warning logs during pass: **0**

## Captured preview images

- End-to-end pass: `neurox-ar-vr-water-chat-reminders.png`

## Comment-section check (Forum)

- Created a forum post and added comments.
- Reloaded the page and verified comments persisted via LocalStorage.
- Posted HTML-like content and verified comments render as escaped text (no script execution).

## Additional checks run

- JavaScript syntax checks with Node `--check` across core app/components/games files
- Python test suite with `PYTHONPATH=src pytest -q`
