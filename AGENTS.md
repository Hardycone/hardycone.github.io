# AGENTS.md

## Project Priorities

- Preserve the `ProjectSummary` layout morph between home preview, case-study header, and next-project bottom card.
- Do not change animation timing, easing, transition structure, or scroll behavior unless explicitly requested.
- Treat visual regressions as serious, especially stutters, snapping, opacity changes, layout shifts, or altered transition direction.
- Home view should not create normal page scrolling. Be especially careful with iOS Safari viewport behavior and the existing use of `svh`. Or suggest alternatives that would achieve the same purpose.
- Case-study document height matters because scroll-driven interactions depend on it. Avoid lazy mounting whole sections unless the layout height is preserved.
- Do not push or commit unless explicitly asked.

## Development

- The local app usually runs on port `3000`.
- Use `rg` for searches.
- Prefer `npx tsc --noEmit` for quick verification after TypeScript changes.
- Global lint may include existing unrelated issues. Do not churn unrelated files while chasing them.
- Preserve user edits in the working tree. Never revert changes unless explicitly asked.

## Design Direction

- This is an interaction-first portfolio, not a marketing landing page.
- Keep UI changes quiet, intentional, and consistent with the current visual language.
- Avoid replacing custom motion with simpler behavior just because it is easier to implement.
- Mobile visitors matter, but the central `ProjectSummary` concept should remain intact across viewport sizes.
