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

## Final result

passed
