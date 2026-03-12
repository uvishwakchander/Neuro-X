# NeuroX Unity VR/AR Therapy Layer

This folder adds starter Unity C# scripts for a VR/AR therapy mini-experience that can be used alongside the NeuroX web MVP.

## Contents

- `Scripts/TherapySessionManager.cs`
  - Session states, timing, and progression.
- `Scripts/BreathingOrbController.cs`
  - Guided breathe-in / hold / breathe-out visual pacing.
- `Scripts/GazeFocusTarget.cs`
  - Focus target that rewards sustained gaze/attention.
- `Scripts/CalmAffirmationBoard.cs`
  - Rotates supportive affirmations during session.

## Unity Setup (XR)

1. Create/open a Unity 3D project (2022 LTS+ recommended).
2. Install XR packages:
   - XR Plugin Management
   - OpenXR
   - XR Interaction Toolkit
   - AR Foundation (optional AR mode)
3. Create scene objects:
   - `TherapySessionManager` (empty GameObject)
   - `BreathingOrb` (Sphere + `BreathingOrbController`)
   - `FocusTarget` (3D object + collider + `GazeFocusTarget`)
   - `AffirmationBoard` (World-space TextMeshPro + `CalmAffirmationBoard`)
4. Wire references in inspector:
   - Assign orb transform and optional material to manager/orb scripts.
   - Assign TMP text field to affirmation board.
5. Press Play to validate logic in editor before headset/device testing.

## Notes

- Scripts are framework-agnostic and can be connected to XR rig input/gaze events.
- Replace placeholder gaze trigger methods with headset/controller raycast callbacks.
