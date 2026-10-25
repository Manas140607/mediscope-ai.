import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Patient, ScreeningResult, Vitals } from '@/types';
import { emptyPatient, emptyVitals } from '@/services/screeningEngine';

interface ScreeningFlowContextValue {
  patient: Patient;
  vitals: Vitals;
  result: ScreeningResult | null;
  setPatient: (p: Patient) => void;
  setVitals: (v: Vitals) => void;
  setResult: (r: ScreeningResult | null) => void;
  resetFlow: () => void;
}

const ScreeningFlowContext = createContext<ScreeningFlowContextValue | null>(null);

export function ScreeningFlowProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<Patient>(() => emptyPatient());
  const [vitals, setVitals] = useState<Vitals>(() => emptyVitals());
  const [result, setResult] = useState<ScreeningResult | null>(null);

  const resetFlow = useCallback(() => {
    setPatient(emptyPatient());
    setVitals(emptyVitals());
    setResult(null);
  }, []);

  const value = useMemo(
    () => ({ patient, vitals, result, setPatient, setVitals, setResult, resetFlow }),
    [patient, vitals, result, resetFlow],
  );

  return <ScreeningFlowContext.Provider value={value}>{children}</ScreeningFlowContext.Provider>;
}

export function useScreeningFlow() {
  const ctx = useContext(ScreeningFlowContext);
  if (!ctx) throw new Error('useScreeningFlow must be used within ScreeningFlowProvider');
  return ctx;
}
