// Demo patient scenarios — clearly labelled synthetic records, not real
// patients. Deterministic inputs produce deterministic outputs.

import type { Patient, Vitals, ScreeningResult } from '@/types';
import { runScreening } from './screeningEngine';

export interface DemoScenario {
  id: string;
  label: string;
  description: string;
  patient: Patient;
  vitals: Vitals;
  expected: string; // human description of expected outcome
}

const basePatient = (overrides: Partial<Patient> = {}): Patient => ({
  id: 'PT-DEMO-A1',
  age: 58,
  sex: 'undisclosed',
  heightCm: 168,
  weightKg: 74,
  screeningDate: new Date().toISOString().slice(0, 10),
  notes: 'Synthetic demo patient — not a real person.',
  historyHypertension: null,
  historyDiabetes: null,
  familyHistory: null,
  currentMedication: null,
  ...overrides,
});

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scenario-a',
    label: 'Scenario A — Measurement Review',
    description:
      'Single elevated reading that should trigger a repeat-measurement workflow before any flag is acted upon.',
    patient: basePatient({
      id: 'PT-DEMO-A1',
      age: 62,
      notes: 'Demo: single elevated reading. Synthetic record, not a real patient.',
    }),
    vitals: {
      systolic: 148,
      diastolic: 94,
      pulse: 82,
      systolic2: null,
      diastolic2: null,
      pulse2: null,
    },
    expected: 'Review recommended with a single-reading advisory requesting confirmation.',
  },
  {
    id: 'scenario-b',
    label: 'Scenario B — Clinical Assessment',
    description:
      'Confirmed elevated readings (average of two) requiring healthcare-worker review under the configured screening rules.',
    patient: basePatient({
      id: 'PT-DEMO-B2',
      age: 54,
      historyHypertension: true,
      historyDiabetes: true,
      notes: 'Demo: confirmed high readings with risk history. Synthetic record, not a real patient.',
    }),
    vitals: {
      systolic: 156,
      diastolic: 98,
      pulse: 88,
      systolic2: 152,
      diastolic2: 96,
      pulse2: 84,
    },
    expected: 'Review recommended — Stage 2 category with risk-factor context.',
  },
  {
    id: 'scenario-c',
    label: 'Scenario C — Invalid Inputs',
    description:
      'Implausible values that must be corrected before a screening result is produced.',
    patient: basePatient({
      id: 'PT-DEMO-C3',
      age: 45,
      notes: 'Demo: implausible values to correct. Synthetic record, not a real patient.',
    }),
    vitals: {
      systolic: 280,
      diastolic: 40,
      pulse: 240,
      systolic2: null,
      diastolic2: null,
      pulse2: null,
    },
    expected: 'Insufficient data — implausible values flagged for remeasurement.',
  },
];

export function runDemoScenario(scenario: DemoScenario): ScreeningResult {
  // Deterministic id + timestamp so the same scenario produces the same result.
  return runScreening(
    { patient: scenario.patient, vitals: scenario.vitals },
    { mode: 'demo', id: `SCR-${scenario.id.toUpperCase()}`, timestamp: fixedTimestamp() },
  );
}

export function fixedTimestamp(): string {
  // Deterministic timestamp for demo reproducibility.
  return '2026-01-15T09:30:00.000Z';
}

// Seed history for the dashboard — clearly labelled demonstration records.
export function seedDemoHistory(): ScreeningResult[] {
  const seedScenarios: { patient: Patient; vitals: Vitals; id: string; ts: string }[] = [
    {
      patient: basePatient({ id: 'PT-DEMO-A1', age: 62 }),
      vitals: { systolic: 134, diastolic: 86, pulse: 78, systolic2: 130, diastolic2: 84, pulse2: 76 },
      id: 'SCR-SEED-1',
      ts: '2026-01-08T09:15:00.000Z',
    },
    {
      patient: basePatient({ id: 'PT-DEMO-B2', age: 54, historyHypertension: true }),
      vitals: { systolic: 142, diastolic: 92, pulse: 84, systolic2: 140, diastolic2: 90, pulse2: 82 },
      id: 'SCR-SEED-2',
      ts: '2026-01-09T11:40:00.000Z',
    },
    {
      patient: basePatient({ id: 'PT-DEMO-D4', age: 33 }),
      vitals: { systolic: 112, diastolic: 72, pulse: 68, systolic2: 110, diastolic2: 70, pulse2: 66 },
      id: 'SCR-SEED-3',
      ts: '2026-01-10T14:05:00.000Z',
    },
    {
      patient: basePatient({ id: 'PT-DEMO-A1', age: 62 }),
      vitals: { systolic: 150, diastolic: 96, pulse: 90, systolic2: null, diastolic2: null, pulse2: null },
      id: 'SCR-SEED-4',
      ts: '2026-01-12T08:20:00.000Z',
    },
  ];
  return seedScenarios.map((s) =>
    runScreening({ patient: s.patient, vitals: s.vitals }, { mode: 'demo', id: s.id, timestamp: s.ts }),
  );
}
