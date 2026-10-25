// Core domain types for MediScope AI screening

export type Sex = 'male' | 'female' | 'undisclosed';

export type ScreeningStatus =
  | 'review_recommended'
  | 'no_immediate_flag'
  | 'insufficient_data';

export type BpCategory =
  | 'normal'
  | 'elevated'
  | 'stage1'
  | 'stage2'
  | 'crisis'
  | 'unknown';

export type ModelMode = 'demo' | 'real' | 'unavailable';

export interface Patient {
  id: string;
  age: number | null;
  sex: Sex;
  heightCm: number | null;
  weightKg: number | null;
  screeningDate: string; // ISO date
  notes: string;
  historyHypertension: boolean | null;
  historyDiabetes: boolean | null;
  familyHistory: boolean | null;
  currentMedication: boolean | null;
}

export interface Vitals {
  systolic: number | null;
  diastolic: number | null;
  pulse: number | null;
  // Optional repeat readings (averaging support)
  systolic2: number | null;
  diastolic2: number | null;
  pulse2: number | null;
}

export interface ValidationIssue {
  field: keyof Vitals | keyof Patient | string;
  message: string;
  severity: 'error' | 'warning';
}

export interface MeasurementQualityFlag {
  kind: 'implausible' | 'missing' | 'pulse_mismatch' | 'single_reading';
  message: string;
  requiresRemeasure: boolean;
}

export interface ScreeningFactor {
  label: string;
  detail: string;
  contribution: 'elevating' | 'protective' | 'neutral';
}

export interface ScreeningExplanation {
  category: BpCategory;
  categoryLabel: string;
  factors: ScreeningFactor[];
  summary: string;
}

export interface ScreeningResult {
  id: string;
  patientId: string;
  timestamp: string;
  status: ScreeningStatus;
  mode: ModelMode;
  vitals: Vitals;
  effectiveSystolic: number | null;
  effectiveDiastolic: number | null;
  effectivePulse: number | null;
  explanation: ScreeningExplanation;
  validationIssues: ValidationIssue[];
  qualityFlags: MeasurementQualityFlag[];
  recommendation: string;
  referralReview: 'not_required' | 'suggested' | 'required' | 'insufficient';
  sufficientEvidence: boolean;
}

export interface ScreeningRecordSummary {
  id: string;
  patientId: string;
  timestamp: string;
  status: ScreeningStatus;
  category: BpCategory;
  systolic: number | null;
  diastolic: number | null;
}

export interface ModelMetadata {
  name: string;
  version: string;
  mode: ModelMode;
  type: string;
  intendedUse: string;
  excludedUse: string;
  limitations: string[];
  dataSource: string | null;
  dataLicense: string | null;
  recordCount: number | null;
  variableCount: number | null;
  targetLabel: string | null;
  evaluation: ModelEvaluation | null;
}

export interface ModelEvaluation {
  confusionMatrix: { tp: number; fp: number; fn: number; tn: number };
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    sensitivity: number;
    specificity: number;
    f1: number;
    auc: number;
  };
  rocCurve: { fpr: number; tpr: number }[];
  calibration: { predicted: number; observed: number }[];
  split: { train: number; validation: number; test: number };
}

export interface DatasetVariable {
  name: string;
  type: 'numeric' | 'categorical' | 'binary';
  description: string;
  missingPercent: number;
}

export interface DatasetSummary {
  name: string;
  source: string;
  license: string;
  loaded: boolean;
  recordCount: number;
  variables: DatasetVariable[];
  labelDistribution: { label: string; count: number }[];
  preprocessing: string[];
}
