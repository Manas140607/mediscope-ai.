import { useCallback, useEffect, useState } from 'react';
import type { ScreeningResult } from '@/types';
import {
  addRecord as addRecordToStore,
  loadHistory,
  resetDemoData,
} from '@/services/patientService';

export function useScreeningHistory() {
  const [records, setRecords] = useState<ScreeningResult[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRecords(loadHistory());
    setLoaded(true);
  }, []);

  const addRecord = useCallback((record: ScreeningResult) => {
    setRecords(addRecordToStore(record));
  }, []);

  const reset = useCallback(() => {
    setRecords(resetDemoData());
  }, []);

  return { records, loaded, addRecord, reset };
}
