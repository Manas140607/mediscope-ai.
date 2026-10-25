// Configurable clinical thresholds for hypertension screening.
// Sources documented inline; thresholds aligned with ACC/AHA 2017 guideline
// categories used for screening-support flagging only (NOT diagnosis).
// Reference: Whelton PK et al. 2017 ACC/AHA/AAPA/ABC/ACPM/AGS/APhA/ASH/ASPC/
// NMA/PCNA Guideline for the Prevention, Detection, Evaluation, and Management
// of High Blood Pressure in Adults. J Am Coll Cardiol. 2018;71(19):e127-e248.
// Intended use: screening decision support at PHC level. Excludes diagnosis.

export interface BpThreshold {
  label: string;
  category: BpCategory;
  // minimum systolic OR minimum diastolic triggers the category
  minSystolic?: number;
  minDiastolic?: number;
}

export interface ScreeningConfig {
  // Plausible physiological ranges (for measurement quality checks)
  plausible: {
    systolicMin: number;
    systolicMax: number;
    diastolicMin: number;
    diastolicMax: number;
    pulseMin: number;
    pulseMax: number;
  };
  // BP category thresholds in escalating order
  categories: BpThreshold[];
  // Pulse pressure plausibility
  pulsePressureMin: number;
  pulsePressureMax: number;
  // Whether repeat measurements are available/required
  requireTwoReadings: boolean;
  // Threshold above which immediate review is required
  reviewCategoryThreshold: BpCategory;
}

export const SCREENING_CONFIG: ScreeningConfig = {
  plausible: {
    systolicMin: 60,
    systolicMax: 260,
    diastolicMin: 30,
    diastolicMax: 150,
    pulseMin: 30,
    pulseMax: 220,
  },
  categories: [
    { label: 'Normal', category: 'normal' },
    { label: 'Elevated', category: 'elevated', minSystolic: 120 },
    { label: 'Stage 1 Hypertension', category: 'stage1', minSystolic: 130, minDiastolic: 80 },
    { label: 'Stage 2 Hypertension', category: 'stage2', minSystolic: 140, minDiastolic: 90 },
    { label: 'Hypertensive Crisis', category: 'crisis', minSystolic: 180, minDiastolic: 120 },
  ],
  pulsePressureMin: 20,
  pulsePressureMax: 100,
  requireTwoReadings: false,
  reviewCategoryThreshold: 'elevated',
};

import type { BpCategory } from '@/types';

export function classifyBp(
  systolic: number,
  diastolic: number,
  config: ScreeningConfig = SCREENING_CONFIG,
): { category: BpCategory; label: string } {
  // Iterate from most severe to least; first match wins.
  for (let i = config.categories.length - 1; i >= 0; i--) {
    const c = config.categories[i];
    const sOk = c.minSystolic === undefined || systolic >= c.minSystolic;
    const dOk = c.minDiastolic === undefined || diastolic >= c.minDiastolic;
    if (sOk || dOk) {
      return { category: c.category, label: c.label };
    }
  }
  return { category: 'normal', label: 'Normal' };
}
