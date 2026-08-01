# Design QA

## Scope

- Source: the approved combined enterprise direction generated from concepts 1, 2, and 3.
- Implementation evidence: `qa/migrateqa-final-dashboard.jpg`.
- Comparison evidence: `qa/final-comparison.jpg`.
- Viewport: 1363 × 936.
- State: Dashboard, chart view, default sample data.

## Comparison history

### Pass 1 — blocked

Evidence: `qa/qa-comparison-full.jpg`.

The first implementation preserved the approved direction but exposed several medium-severity fidelity issues:

- The KPI band and activity chart were too tall, leaving only two migration rows visible.
- The migration title sat outside the table panel instead of within its framed surface.
- Chart phase labels were abbreviated.
- Row actions used unbordered vertical dots rather than the approved compact horizontal action control.

The implementation was revised to tighten vertical density, move the table heading into the panel, restore full chart labels, add the Hours axis title, and match the selected KPI and row-action icon treatment.

### Pass 2 — passed

Evidence: `qa/final-comparison.jpg`.

- Sidebar, header, KPI band, chart, and table geometry match the approved desktop composition.
- All three migration rows are visible at the target viewport.
- Typography, color hierarchy, borders, radii, spacing, and control density are consistent with the target.
- No visible overflow, clipping, collision, or broken alignment was found.
- No P0, P1, or P2 visual issues remain.

## Functional evidence

- Production Vite build completed successfully.
- Chart/list view toggle works and the list renders nine phase rows.
- Log-time modal opens, validates, submits, updates totals, and closes correctly.
- A temporary QA entry was added, verified, and removed, restoring the original sample totals.
- Applications, Insights, and Settings navigation states render correctly.
- Application source system remains optional as intended.
- Health insights remain available on the Insights screen.
- No application-origin console errors were observed; browser-extension diagnostics were excluded.

## August 1 component updates

- Source references: application-title crop (620 × 210), activity table (838 × 316), and application editor references (2048 × 955 and 2048 × 957).
- The long application title now clamps to exactly two lines without collision or horizontal overflow. Evidence: `qa/application-title-wrap-comparison.jpg` and `qa/application-title-two-lines-focus.jpg`.
- The accuracy table renders all nine requested activity groups, including Test Execution, Bug Retest, Exit Criteria, Bug Reporting, and Coordination.
- Time Log renders one header checkbox plus 30 row checkboxes. Single-row edit, multi-row shared edit, select-all, clear, and selected-row delete confirmation were verified in the browser.
- Application logos can be uploaded, replaced, or removed. File validation accepts PNG, JPG, and WebP up to 1 MB while preserving a default icon fallback.
- Test Phase persists with SIT, UAT, and Regression options and is surfaced on each application card.
- Start Date and End Date persist with the application, render as a date range on the card, and constrain the End Date to the selected Start Date.
- The application editor and selected-row toolbar were visually inspected at 1363 × 936; no clipping, collision, or broken alignment was found.
- The production build completed successfully. No application-origin console errors were observed; browser-extension diagnostics were excluded.

## Testing team allocation update

- Source visual truth: `/workspace/scratch/b52b154abcd0/upload/Screenshot 2026-08-01 at 7.28.17 PM.png` (628 × 672 px).
- Implementation screenshot: `cloud-browser://migration-qe-estimator/testing-team-selected` (browser-rendered in the current QA session at 1363 × 936 px).
- CSS comparison size: both source and implementation use the existing 610 px desktop application modal; browser canvas size differs, so the comparison was normalized to the modal region at 1× CSS density.
- State: Applications → Edit application; Aria Santos and Diego Tan selected with 80h and 60h estimates.
- Full-view comparison: the existing typography, two-column form rhythm, borders, radii, blue primary action, dimmed backdrop, and application-logo panel remain consistent with the source.
- Focused-region comparison: the new Testing team fieldset was reviewed together with the source modal. It extends the established form language with compact checkbox rows, avatars, enabled/disabled hour inputs, selected states, and an allocation progress summary.
- Fonts and typography: Inter hierarchy, field labels, helper copy, weights, and input sizing remain consistent with the source.
- Spacing and layout rhythm: the new two-column tester grid aligns to the source form tracks; the modal uses its existing internal scroll region so actions remain reachable without page overflow.
- Colors and visual tokens: selected rows use the existing indigo focus token, while disabled inputs, borders, and allocation progress reuse established neutral and semantic tokens.
- Image quality and asset fidelity: the supplied application-logo treatment is unchanged; tester initials reuse the app's existing avatar component and no placeholder imagery was introduced.
- Copy and content: Testing team, selected count, per-tester hour labels, allocated hours, and remaining/over-estimate feedback are concise and application-specific.
- Primary interactions tested: select two testers, enable only their hour inputs, enter hours, update allocated/unallocated totals, save, reopen, and confirm both selections and estimates persist.
- Console check: no application-origin errors or warnings.
- Findings: no actionable P0, P1, or P2 differences. The added vertical height is an intentional product requirement and remains contained by the existing modal scroll behavior.

## Final result

passed
