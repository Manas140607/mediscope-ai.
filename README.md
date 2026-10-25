# MediScope AI — Explainable AI-Assisted Screening for Primary Health Centres

A hackathon prototype for **Problem Statement PS 3.1: AI-Assisted Screening Tool for a Single
Common Condition at PHC Level**. The selected condition is **hypertension risk screening** using
basic patient vital signs.

> **MediScope AI is a screening decision-support prototype.** It is not a diagnostic device and does
> not replace a qualified healthcare professional. Results depend on input quality and model
> limitations. Clinical decisions require appropriate professional assessment.

---

## Highlights

- Premium dark navy + cyan animated landing page.
- Healthcare worker dashboard with screening records and charts.
- Patient registration + vital-signs entry with validation and demo scenarios.
- Transparent, deterministic **demo screening engine** clearly separated from any real model.
- Explainable screening results with contributing factors, warnings, and review recommendations.
- Interactive **React Flow** workflow diagram with animated edges, decision branches, and a
  "Run Demo Workflow" progression.
- Recharts visualisations for blood-pressure trend, vitals overview, and status distribution.
- Patient screening history with filtering and expandable detail.
- Model & dataset information page with honest empty states (no fabricated metrics).
- Privacy notice, safety guardrails, and demo-data reset.
- Responsive mobile design, keyboard accessibility, and reduced-motion support.
- Works offline in **DEMO MODE** — no backend required.

---

## Tech stack

- React 18 + TypeScript
- Vite 7
- Tailwind CSS 3
- Framer Motion (animations)
- Recharts (charts)
- React Flow (workflow diagram)
- React Router (navigation)
- Lucide React (icons)
- Supabase client (available but not required for demo mode)

---

## Getting started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# type-check
npm run typecheck

# production build
npm run build

# preview the production build
npm run preview
```

The app runs entirely in **DEMO MODE** with no environment variables required. Screening records
are stored in the browser's `localStorage` and can be reset from the dashboard or the Privacy &
Safety page.

---

## Environment variables

Copy `.env.example` to `.env` and fill in only what you need. **Never commit real credentials.**
All variables are optional — the app falls back to demo mode.

| Variable | Purpose |
| --- | --- |
| `VITE_MODEL_ENDPOINT` | URL of a server-side screening-model inference endpoint. When set, the app attempts live inference and falls back to the demo engine on error. |
| `VITE_DATASET_ENDPOINT` | URL that returns a JSON dataset summary (name, source, licence, variables, label distribution). When set, the Model & Data page shows real dataset values. |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Supabase project URL and anon key (pre-populated for this project). Used only if you choose to enable remote persistence. |

Secrets (service-role keys, model API keys) must live **server-side only** — never in frontend code.

---

## Project structure

```
src/
  components/
    layout/        App shell, sidebar, mobile nav
    dashboard/     (dashboard page composes shared + chart components)
    forms/         PatientForm, VitalsForm, DemoScenarioLoader
    charts/        BpHistoryChart, VitalsOverviewChart, StatusDistributionChart, EvaluationEmptyState
    flowchart/     WorkflowNode (custom React Flow node)
    screening/     ScreeningPipelineProgress, ScreeningResultCard, ValidationSummary
    shared/        PageHeader, StatusBadge, Toast, Loading, AnimatedNumber, AnimatedBackground
  pages/           Landing, Dashboard, Register, Vitals, Screening, Results, Workflow, History, Model, About
  hooks/           useScreeningFlow, useScreeningHistory, useToastContext
  services/        screeningEngine, screeningConfig, modelAdapter, datasetService, patientService, modelMetadata, demoScenarios
  types/           domain types
```

### Screening engine boundary

`src/services/screeningEngine.ts` contains the **deterministic demo logic** (validation, measurement
quality checks, evidence-based BP category classification, explainability). It is deliberately
separated from the UI.

`src/services/modelAdapter.ts` is the integration boundary. `runModel()` calls a real endpoint if
`VITE_MODEL_ENDPOINT` is configured, and transparently falls back to the demo engine (clearly
labelled) on any error. **The demo engine is never presented as a clinically validated model.**

### Clinical thresholds

`src/services/screeningConfig.ts` exposes configurable BP category thresholds aligned with the
**ACC/AHA 2017** screening categories. They are used for screening flagging only — **not diagnosis**.
The source and intended use are documented in that file.

---

## Demo scenarios

Three deterministic synthetic scenarios are available on the registration page and can be loaded
with one click:

- **Scenario A — Measurement Review:** a single elevated reading that triggers a repeat-measurement
  advisory before any flag is acted upon.
- **Scenario B — Clinical Assessment:** confirmed elevated readings (average of two) with risk
  history, requiring healthcare-worker review.
- **Scenario C — Invalid Inputs:** implausible values that must be corrected before a result is
  produced.

The same inputs always produce the same outputs.

---

## Data persistence

- **Demo mode (default):** records are stored in `localStorage` under `mediscope_screening_history_v1`.
  This is clearly a browser-storage limitation, not a secure vault — do not store real patient data.
- **Remote (optional):** a Supabase project is available. To enable remote persistence you must
  create a table with row-level security policies and update `patientService.ts` to use it. The
  current demo keeps everything local so it works offline.

Use **Reset Demo** on the dashboard or the Privacy & Safety page to clear local data and restore
the seed records.

---

## Testing the main user journey

1. Open the app → landing page.
2. Click **Start Screening** (or load a demo scenario on the registration page).
3. Enter patient details → continue to vitals.
4. Enter blood pressure and pulse (a repeat reading is recommended).
5. Run screening → watch the simulated pipeline progress.
6. Review the explainable result, contributing factors, and recommendation.
7. Save the result and view it in the dashboard / patient history.
8. Open **How It Works** and run the demo workflow to see the flowchart animate.

---

## Limitations & responsible AI

- Demo mode uses deterministic rule-based logic, **not** a trained or validated model.
- No real held-out evaluation has been performed — all metric panels show an informative empty
  state until genuine results exist.
- A single blood-pressure measurement is insufficient for diagnosis; repeat measurements are
  required.
- No claim of clinical validation, regulatory clearance, or fitness for any diagnostic purpose.
- Thresholds are configurable and based on ACC/AHA 2017 screening categories; local protocols may
  differ.

---

## Deployment

The production build outputs static assets to `dist/` and can be hosted on any static host. For
Bolt, the app deploys automatically. No server is required for demo mode.

If you connect a real model or dataset endpoint, ensure CORS is configured on the server and that
secrets remain server-side.
