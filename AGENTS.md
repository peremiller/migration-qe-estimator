# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Selected direction

- Build target: `/workspace/scratch/0127361d9628/generated_images/exec-603e8a6b-c9d4-43f0-a6d5-9c3d0d5d13d8.png`.
- Combine the executive sidebar and portfolio table, analyst workbench health/forecast panel, and decision-focused quality operations brief.
- Preserve MigrateQA's estimation, applications, time logging, insights, team settings, data export/import, and responsive behavior.
- Brand identity: use the navy, indigo, and emerald migration/checkmark mark in `public/migrateqa-logo.png` for the product logo and favicon family.

# Project agent instructions

<!-- BEGIN: graphify-airllm -->
## Graphify + AirLLM workflow

- Use Graphify as the default codebase-context layer. If `graphify-out/graph.json` exists, run a scoped `graphify query "<question>"` before broad raw-file searches.
- When a complete local checkout is available and repository analysis is in scope, build or update the graph with the official `graphifyy` package. Treat `EXTRACTED` and `INFERRED` relationships differently and verify important conclusions against source locations.
- Prefer AirLLM for local or self-hosted open-model inference only when the project has a compatible Python server, worker, desktop, or batch runtime plus adequate compute and disk.
- Do not bundle AirLLM into browser JavaScript, static sites, mobile clients, or Vercel/edge-only functions. Put inference behind a provider-neutral Python service and keep model caches, tokens, and layer shards out of source control.
- If the task does not involve LLM inference, do not add AirLLM as a dependency; simply preserve this rule for future AI features.
<!-- END: graphify-airllm -->
