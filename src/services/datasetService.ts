// Dataset service — boundary for loading a real public dataset.
//
// In this prototype, no dataset is loaded by default. The page shows an
// informative empty state explaining how to load one. When a dataset is
// provided (via VITE_DATASET_ENDPOINT or a future server loader), the
// summary is populated with REAL values only — never fabricated.

import type { DatasetSummary } from '@/types';

const DATASET_ENDPOINT = import.meta.env.VITE_DATASET_ENDPOINT as string | undefined;

export async function loadDatasetSummary(): Promise<DatasetSummary> {
  if (!DATASET_ENDPOINT) {
    return emptyDatasetSummary();
  }
  try {
    const res = await fetch(DATASET_ENDPOINT);
    if (!res.ok) return emptyDatasetSummary();
    return (await res.json()) as DatasetSummary;
  } catch {
    return emptyDatasetSummary();
  }
}

export function emptyDatasetSummary(): DatasetSummary {
  return {
    name: 'No dataset loaded',
    source:
      'Configure a public vital-signs / cardiovascular-risk dataset (e.g. CDC NHANES, UCI Heart Disease) via VITE_DATASET_ENDPOINT to populate this page with real values.',
    license: 'Not loaded',
    loaded: false,
    recordCount: 0,
    variables: [],
    labelDistribution: [],
    preprocessing: [],
  };
}
