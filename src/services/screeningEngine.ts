// Screening engine — modular, deterministic, separated from UI.
// The demo algorithm uses evidence-based BP categories and rule-based
// screening flags. It is NOT a trained model and never claims clinical
// validation. A real trained model can be plugged in via ModelAdapter.

import type {
  MeasurementQualityFlag,
  Patient,
  ScreeningExplanation,
  ScreeningFactor,
  ScreeningResult,
  ScreeningStatus,
  ValidationIssue,
  Vitals,
  ModelMode,
} from '@/types';
import { SCREENING_CONFIG, classifyBp } from './screeningConfig';

export interface ScreeningInput {
  patient: Patient;
  vitals: Vitals;
}

export function validateInput(input: ScreeningInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const { patient, vitals } = input;

  if (patient.age === null || Number.isNaN(patient.age)) {
    issues.push({ field: 'age', message: 'Age is required.', severity: 'error' });
  } else if (patient.age < 0 || patient.age > 130) {
    issues.push({ field: 'age', message: 'Age must be between 0 and 130.', severity: 'error' });
  }

  if (vitals.systolic === null || Number.isNaN(vitals.systolic)) {
    issues.push({ field: 'systolic', message: 'Systolic blood pressure is required.', severity: 'error' });
  }
  if (vitals.diastolic === null || Number.isNaN(vitals.diastolic)) {
    issues.push({ field: 'diastolic', message: 'Diastolic blood pressure is required.', severity: 'error' });
  }
  if (vitals.pulse === null || Number.isNaN(vitals.pulse)) {
    issues.push({ field: 'pulse', message: 'Pulse rate is required.', severity: 'error' });
  }

  if (!patient.screeningDate) {
    issues.push({ field: 'screeningDate', message: 'Screening date is required.', severity: 'error' });
  }

  return issues;
}

export function checkMeasurementQuality(
  vitals: Vitals,
  config = SCREENING_CONFIG,
): MeasurementQualityFlag[] {
  const flags: MeasurementQualityFlag[] = [];
  const { plausible } = config;

  if (vitals.systolic !== null) {
    if (vitals.systolic < plausible.systolicMin || vitals.systolic > plausible.systolicMax) {
      flags.push({
        kind: 'implausible',
        message: `Systolic value ${vitals.systolic} mmHg is outside the plausible range (${plausible.systolicMin}–${plausible.systolicMax}). Please remeasure.`,
        requiresRemeasure: true,
      });
    }
  }
  if (vitals.diastolic !== null) {
    if (vitals.diastolic < plausible.diastolicMin || vitals.diastolic > plausible.diastolicMax) {
      flags.push({
        kind: 'implausible',
        message: `Diastolic value ${vitals.diastolic} mmHg is outside the plausible range (${plausible.diastolicMin}–${plausible.diastolicMax}). Please remeasure.`,
        requiresRemeasure: true,
      });
    }
  }
  if (vitals.pulse !== null) {
    if (vitals.pulse < plausible.pulseMin || vitals.pulse > plausible.pulseMax) {
      flags.push({
        kind: 'implausible',
        message: `Pulse rate ${vitals.pulse} bpm is outside the plausible range (${plausible.pulseMin}–${plausible.pulseMax}). Please remeasure.`,
        requiresRemeasure: true,
      });
    }
  }

  // Pulse pressure check
  if (vitals.systolic !== null && vitals.diastolic !== null) {
    const pp = vitals.systolic - vitals.diastolic;
    if (pp < config.pulsePressureMin || pp > config.pulsePressureMax) {
      flags.push({
        kind: 'implausible',
        message: `Pulse pressure ${pp} mmHg is unusual (expected ${config.pulsePressureMin}–${config.pulsePressureMax}). Verify the reading.`,
        requiresRemeasure: true,
      });
    }
    if (vitals.diastolic >= vitals.systolic) {
      flags.push({
        kind: 'implausible',
        message: 'Diastolic pressure is greater than or equal to systolic. Please remeasure.',
        requiresRemeasure: true,
      });
    }
  }

  // Single-reading advisory
  const hasRepeat =
    vitals.systolic2 !== null && vitals.systolic2 !== undefined &&
    vitals.diastolic2 !== null && vitals.diastolic2 !== undefined;
  if (!hasRepeat && vitals.systolic !== null && vitals.diastolic !== null) {
    flags.push({
      kind: 'single_reading',
      message: 'Only a single BP reading was recorded. Guidelines recommend confirming with a repeat measurement before flagging.',
      requiresRemeasure: false,
    });
  }

  return flags;
}

function average(a: number | null, b: number | null): number | null {
  if (a === null && b === null) return null;
  if (a === null) return b;
  if (b === null) return a;
  return Math.round((a + b) / 2);
}

export function computeEffectiveVitals(vitals: Vitals) {
  return {
    systolic: average(vitals.systolic, vitals.systolic2),
    diastolic: average(vitals.diastolic, vitals.diastolic2),
    pulse: average(vitals.pulse, vitals.pulse2),
  };
}

function buildExplanation(
  patient: Patient,
  effectiveSys: number,
  effectiveDia: number,
  pulse: number | null,
): ScreeningExplanation {
  const { category, label } = classifyBp(effectiveSys, effectiveDia);
  const factors: ScreeningFactor[] = [];

  factors.push({
    label: 'Systolic Blood Pressure',
    detail: `${effectiveSys} mmHg — classified within the "${label}" category.`,
    contribution:
      effectiveSys >= 130 ? 'elevating' : effectiveSys >= 120 ? 'elevating' : 'protective',
  });
  factors.push({
    label: 'Diastolic Blood Pressure',
    detail: `${effectiveDia} mmHg — assessed against ACC/AHA category thresholds.`,
    contribution: effectiveDia >= 80 ? 'elevating' : 'protective',
  });

  if (pulse !== null) {
    factors.push({
      label: 'Pulse Rate',
      detail: `${pulse} bpm — used for measurement-quality context, not as a standalone hypertension indicator.`,
      contribution: 'neutral',
    });
  }

  if (patient.age !== null && patient.age >= 55) {
    factors.push({
      label: 'Age',
      detail: `Age ${patient.age} — advancing age is an established cardiovascular risk factor.`,
      contribution: 'elevating',
    });
  }

  if (patient.historyHypertension) {
    factors.push({
      label: 'Prior Hypertension History',
      detail: 'Documented history increases pre-test likelihood of elevated BP.',
      contribution: 'elevating',
    });
  }
  if (patient.historyDiabetes) {
    factors.push({
      label: 'Diabetes History',
      detail: 'Diabetes increases cardiovascular risk and warrants closer BP monitoring.',
      contribution: 'elevating',
    });
  }
  if (patient.familyHistory) {
    factors.push({
      label: 'Family History',
      detail: 'Family history of hypertension contributes additional risk context.',
      contribution: 'elevating',
    });
  }

  const summary =
    category === 'normal'
      ? 'Blood pressure falls within the normal range for screening. This is not a guarantee of cardiovascular health.'
      : category === 'elevated'
        ? 'Blood pressure is elevated above the normal range. Lifestyle review and a repeat measurement are appropriate.'
        : category === 'crisis'
          ? 'Blood pressure is in the hypertensive crisis range. Immediate clinical review is recommended.'
          : 'Blood pressure exceeds the normal screening range. Healthcare-worker review is recommended.';

  return { category, categoryLabel: label, factors, summary };
}

export interface ScreeningOptions {
  mode?: ModelMode;
  /** Override the generated id (useful for deterministic tests). */
  id?: string;
  /** Override timestamp (ISO string) for deterministic tests. */
  timestamp?: string;
}

export function runScreening(
  input: ScreeningInput,
  options: ScreeningOptions = {},
): ScreeningResult {
  const mode: ModelMode = options.mode ?? 'demo';
  const issues = validateInput(input);
  const qualityFlags = checkMeasurementQuality(input.vitals);

  const blockingIssues = issues.filter((i) => i.severity === 'error');
  const remeasureRequired = qualityFlags.some((f) => f.requiresRemeasure);

  const effective = computeEffectiveVitals(input.vitals);

  const sufficientEvidence =
    blockingIssues.length === 0 &&
    !remeasureRequired &&
    effective.systolic !== null &&
    effective.diastolic !== null;

  const id = options.id ?? generateScreeningId();
  const timestamp = options.timestamp ?? new Date().toISOString();

  if (!sufficientEvidence) {
    return {
      id,
      patientId: input.patient.id,
      timestamp,
      status: 'insufficient_data',
      mode,
      vitals: input.vitals,
      effectiveSystolic: effective.systolic,
      effectiveDiastolic: effective.diastolic,
      effectivePulse: effective.pulse,
      explanation: {
        category: 'unknown',
        categoryLabel: 'Not determined',
        factors: [],
        summary:
          'Insufficient or implausible data. Correct the inputs and remeasure before producing a screening result.',
      },
      validationIssues: issues,
      qualityFlags,
      recommendation: remeasureRequired
        ? 'Remeasure the indicated values and re-run the screening.'
        : 'Complete the required fields and re-run the screening.',
      referralReview: 'insufficient',
      sufficientEvidence: false,
    };
  }

  const explanation = buildExplanation(
    input.patient,
    effective.systolic!,
    effective.diastolic!,
    effective.pulse,
  );

  const status =
    explanation.category === 'normal' ? 'no_immediate_flag' : 'review_recommended';

  let recommendation = '';
  let referralReview: ScreeningResult['referralReview'] = 'not_required';
  switch (explanation.category) {
    case 'normal':
      recommendation =
        'No immediate flag in this screening. Continue routine follow-up per local protocol. This is not a diagnosis.';
      referralReview = 'not_required';
      break;
    case 'elevated':
      recommendation =
        'Lifestyle review and a repeat BP measurement on a separate occasion are appropriate. If persistently elevated, consider healthcare-worker review.';
      referralReview = 'suggested';
      break;
    case 'stage1':
      recommendation =
        'Healthcare-worker review is recommended. Confirm with repeat measurements and consider cardiovascular risk assessment.';
      referralReview = 'suggested';
      break;
    case 'stage2':
      recommendation =
        'Healthcare-worker review is recommended. Arrange confirmatory measurements and clinical follow-up per local protocol.';
      referralReview = 'required';
      break;
    case 'crisis':
      recommendation =
        'Immediate healthcare-worker review is recommended. This screening flag is not a diagnosis but warrants prompt clinical assessment.';
      referralReview = 'required';
      break;
    default:
      recommendation = 'Review the inputs and re-run screening.';
  }

  return {
    id,
    patientId: input.patient.id,
    timestamp,
    status,
    mode,
    vitals: input.vitals,
    effectiveSystolic: effective.systolic,
    effectiveDiastolic: effective.diastolic,
    effectivePulse: effective.pulse,
    explanation,
    validationIssues: issues,
    qualityFlags,
    recommendation,
    referralReview,
    sufficientEvidence: true,
  };
}

let screeningCounter = 0;
export function generateScreeningId(): string {
  screeningCounter += 1;
  const stamp = Date.now().toString(36).slice(-5).toUpperCase();
  const counter = screeningCounter.toString(36).toUpperCase().padStart(3, '0');
  return `SCR-${stamp}${counter}`;
}

export function generatePatientId(): string {
  const stamp = Date.now().toString(36).slice(-5).toUpperCase();
  const rand = Math.floor(Math.random() * 1000)
    .toString(36)
    .toUpperCase()
    .padStart(3, '0');
  return `PT-${stamp}${rand}`;
}

export function emptyVitals(): Vitals {
  return {
    systolic: null,
    diastolic: null,
    pulse: null,
    systolic2: null,
    diastolic2: null,
    pulse2: null,
  };
}

export function emptyPatient(): Patient {
  return {
    id: generatePatientId(),
    age: null,
    sex: 'undisclosed',
    heightCm: null,
    weightKg: null,
    screeningDate: new Date().toISOString().slice(0, 10),
    notes: '',
    historyHypertension: null,
    historyDiabetes: null,
    familyHistory: null,
    currentMedication: null,
  };
}
