# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Selected direction

- Build target: `/workspace/scratch/b52b154abcd0/generated_images/exec-10c0fe4d-9629-48b4-9153-8ee4b830d348.png`.
- Combine the premium dark navigation, clean executive KPI strip, focused activity analytics, and airy migration-progress table selected on August 1, 2026.
- Preserve MigrateQA's estimation, applications, time logging, insights, team settings, data export/import, and responsive behavior.
- Brand identity: use the navy, indigo, and emerald migration/checkmark mark in `public/migrateqa-logo.png` for the product logo and favicon family.

# Project agent instructions

<!-- BEGIN: graphify-airllm -->
## Graphify + AirLLM workflow

- A current Graphify knowledge graph is required for repository work. Retrieve the newest successful `graphify-*` workflow artifact or use `graphify-out/graph.json` before broad raw-file searches.
- Run a scoped `graphify query "<question>"`, `graphify path`, or `graphify explain` before broad codebase analysis. Verify important conclusions against source locations and distinguish `EXTRACTED` from `INFERRED` relationships.
- If the graph is absent or stale, run Graphify locally or dispatch the **Graphify Knowledge Graph** workflow. Keep `graphify-out/` out of source control.
- Prefer AirLLM for local or self-hosted open-model inference only when the project has a compatible Python server, worker, desktop, or batch runtime plus adequate compute and disk.
- Do not bundle AirLLM into browser JavaScript, static sites, mobile clients, or Vercel/edge-only functions. Put inference behind a provider-neutral Python service and keep model caches, tokens, and layer shards out of source control.
- If the task does not involve LLM inference, do not add AirLLM as a dependency; preserve this rule for future AI features.
<!-- END: graphify-airllm -->
