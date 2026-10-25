// Patient + screening record persistence.
//
// Demo mode: localStorage. Records are clearly labelled as demonstration
// data and the privacy notice explains this limitation. No real patient
// data is collected.
//
// If Supabase auth + a screening_records table are configured in future,
// the same API can be backed by the database with RLS enforcing
// ownership. Not enabled by default to keep the demo offline-capable.

import type { ScreeningResult } from '@/types';
import { seedDemoHistory } from './demoScenarios';

const STORAGE_KEY = 'mediscope_screening_history_v1';

export function loadHistory(): ScreeningResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = seedDemoHistory();
      saveHistory(seed);
      return seed;
    }
    const parsed = JSON.parse(raw) as ScreeningResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(records: ScreeningResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // storage may be unavailable (private mode); demo degrades gracefully
  }
}

export function addRecord(record: ScreeningResult): ScreeningResult[] {
  const all = loadHistory();
  // Replace if same id exists, else prepend.
  const filtered = all.filter((r) => r.id !== record.id);
  const next = [record, ...filtered];
  saveHistory(next);
  return next;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function resetDemoData(): ScreeningResult[] {
  clearHistory();
  const seed = seedDemoHistory();
  saveHistory(seed);
  return seed;
}
