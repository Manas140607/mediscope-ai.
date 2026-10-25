// Model metadata — honest status reporting. No fabricated metrics.

import type { ModelMetadata } from '@/types';

export function getModelMetadata(): ModelMetadata {
  return {
    name: 'MediScope Hypertension Screening Engine',
    version: '0.1.0-demo',
    mode: 'demo',
    type: 'Rule-based screening decision-support (deterministic, evidence-based BP categories)',
    intendedUse:
      'Screening decision support at Primary Health Centres to help healthcare workers decide when repeat measurement or clinician review is appropriate. Used alongside — not in place of — professional clinical judgement.',
    excludedUse:
      'Not a diagnostic device. Not for standalone hypertension diagnosis. Not for titrating medication. Not for self-diagnosis by patients. Not for use without a qualified healthcare worker reviewing the output.',
    limitations: [
      'Demo mode uses deterministic rule-based logic, not a trained or validated model.',
      'No real held-out evaluation has been performed — all metric panels show an informative empty state until genuine results exist.',
      'A single blood-pressure measurement is insufficient for diagnosis; repeat measurements are required.',
      'The screening flag is sensitive to input quality and measurement technique.',
      'No claim of clinical validation, regulatory clearance, or fitness for any diagnostic purpose.',
      'Thresholds are configurable and based on ACC/AHA 2017 screening categories; local protocols may differ.',
    ],
    dataSource: null,
    dataLicense: null,
    recordCount: null,
    variableCount: null,
    targetLabel: null,
    evaluation: null,
  };
}
