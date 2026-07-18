# Migration QE Estimator

A public, AI-assisted quality engineering estimation and actual-time tracking app for complex data-migration testing programs.

## Capabilities

- Estimate requirements analysis, test planning, entry and exit criteria, execution, defect work, bug reporting, coordination, and reporting.
- Compare estimated versus actual effort and surface delivery-risk insights.
- Use the AI QA Copilot for estimate review, requirements analysis, defect intelligence, evidence inspection, executive summaries, and knowledge search.
- Keep OpenAI credentials server-side; the browser never receives `OPENAI_API_KEY`.

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open the local URL shown in the terminal.

## OpenAI configuration

Create `.env.local` (it is ignored by Git):

```bash
OPENAI_API_KEY=your_secret_key
OPENAI_MODEL=gpt-5.6-sol
```

Never commit API keys. Without a key, the Copilot returns a safe setup message while the rest of the estimator remains usable.

## Validation

```bash
npm test
```

The test command builds the app, validates the deployable artifact, and checks rendered metadata.

## Deployment

Configure `OPENAI_API_KEY` as a server-side secret in the hosting provider, then run the provider's standard Next.js deployment flow. The public Sites deployment is available at:

https://migration-qa-estimator.ajmillertperez562.chatgpt.site

## Security

- Do not place `OPENAI_API_KEY` in client-side code or `NEXT_PUBLIC_*` variables.
- Review AI-generated recommendations before using them for project commitments.
- Avoid submitting unnecessary personal or confidential production data.
