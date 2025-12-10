# 📱 Mobile UI/UX Excellence Plan

## Goal
Transform VacyMax into a native-quality mobile web application (PWA) that feels indistinguishable from a high-end iOS app.

## Core Pillars
1.  **Thumb-First Ergonomics**: All key actions within easy reach.
2.  **Fluid Gestures**: Swipe to navigate, organic transitions.
3.  **Tactile Feedback**: Haptic responses for key interactions.
4.  **Native Integration**: Proper keyboard types, safe areas, and viewport behaviors.

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (The "App" Feel)
- [ ] **Viewport Hardening**: Prevent rubber-banding and accidental zooming.
- [ ] **Input Optimization**: Update `DebouncedInput` to support `inputMode="numeric"` and `pattern="[0-9]*"` for proper mobile keyboards.
- [ ] **Tap Hygiene**: Remove 300ms tap delays (already handled by viewport meta, but verify) and add active states.

### Phase 2: Tactile Experience
- [ ] **Haptics Engine**: Create `useHaptics` hook using `navigator.vibrate` for:
    - Button clicks (light tick)
    - Selecting options (medium tick)
    - Success/Celebration (heavy/multiple ticks)
    - Errors (double tick)
- [ ] **Touch Feedback**: Add visual ripple/scale-down effects on all interactive elements.

### Phase 3: Gestural Navigation
- [ ] **Swipe Gestures**: Implement swipe-left/right to navigate wizard steps.
- [ ] **Pull-to-Refresh Control**: Disable native pull-to-refresh to prevent UI displacement during swipes.

### Phase 4: Visual Polish
- [ ] **Floating Action Button (FAB) Physics**: Ensure the "Continue" button feels anchored and responsive.
- [ ] **Sheet-like Transitions**: Make results view slide up like a bottom sheet on mobile.

---

## Technical Details

### New Hook: `useMobileUX`
Will encapsulate all mobile logic to keep components clean.

```typescript
export const useMobileUX = () => {
  const vibrate = (pattern) => ...
  const swipeHandlers = ...
  return { vibrate, ...swipeHandlers }
}
```

### Input Changes
Refactor `DebouncedInput` to accept:
- `type` (e.g., 'tel', 'number')
- `inputMode` (e.g., 'numeric', 'decimal')
- `pattern`

### Swipe Logic
Simple touch start/end listener with 50px threshold to trigger `onNext`/`onBack`.

---

## Success Criteria
- [ ] Number inputs trigger numeric keypad instantly on iOS/Android.
- [ ] Swiping left/right changes steps naturally.
- [ ] Buttons feel "physical" with micro-scale animations and vibration.
- [ ] No "web jank" (scrolling past boundaries, zooming inputs).
