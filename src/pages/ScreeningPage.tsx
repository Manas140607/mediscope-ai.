import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FlaskConical, Play } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ScreeningPipelineProgress } from '@/components/screening/ScreeningPipelineProgress';
import { ValidationSummary } from '@/components/screening/ValidationSummary';
import { Spinner } from '@/components/shared/Loading';
import { useScreeningFlow } from '@/hooks/useScreeningFlow';
import { useScreeningHistory } from '@/hooks/useScreeningHistory';
import { useToastContext } from '@/hooks/useToastContext';
import { runModel } from '@/services/modelAdapter';
import { validateInput, checkMeasurementQuality } from '@/services/screeningEngine';
import type { ScreeningResult } from '@/types';

export function ScreeningPage() {
  const navigate = useNavigate();
  const { patient, vitals, setResult } = useScreeningFlow();
  const { addRecord } = useScreeningHistory();
  const { notify } = useToastContext();

  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const issues = validateInput({ patient, vitals });
  const flags = checkMeasurementQuality(vitals);
  const sufficient = issues.filter((i) => i.severity === 'error').length === 0 && !flags.some((f) => f.requiresRemeasure) && vitals.systolic !== null && vitals.diastolic !== null;

  const handleRun = async () => {
    setRunning(true);
    setDone(false);
    // Simulated pipeline delay (labelled as simulated in the progress UI).
    const result: ScreeningResult = await runModel({ patient, vitals });
    await new Promise((r) => setTimeout(r, 900));
    setResult(result);
    addRecord(result);
    setRunning(false);
    setDone(true);
    notify('Screening complete. Result saved to demo history.');
    setTimeout(() => navigate('/results'), 500);
  };

  return (
    <div>
      <PageHeader
        title="Screening Analysis"
        subtitle={`Running the screening pipeline for ${patient.id}. This is a simulated, labelled demonstration.`}
        icon={<FlaskConical className="h-5 w-5" />}
        action={
          <button
            type="button"
            className="btn-primary"
            disabled={running || !sufficient}
            onClick={handleRun}
          >
            {running ? <Spinner /> : <Play className="h-4 w-4" />}
            {running ? 'Running…' : 'Run Screening'}
          </button>
        }
      />

      <div className="space-y-5">
        <ScreeningPipelineProgress active={running} done={done} />

        <div className="glass-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">Patient & vitals summary</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryItem label="Patient ID" value={patient.id} />
            <SummaryItem label="Age" value={patient.age ? `${patient.age} yrs` : '—'} />
            <SummaryItem label="Screening date" value={patient.screeningDate} />
            <SummaryItem label="Systolic" value={vitals.systolic ? `${vitals.systolic} mmHg` : '—'} />
            <SummaryItem label="Diastolic" value={vitals.diastolic ? `${vitals.diastolic} mmHg` : '—'} />
            <SummaryItem label="Pulse" value={vitals.pulse ? `${vitals.pulse} bpm` : '—'} />
          </div>
        </div>

        <ValidationSummary issues={issues} flags={flags} sufficientEvidence={sufficient} />

        {!sufficient && !running && (
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-ghost" onClick={() => navigate('/vitals')}>
              Review Inputs
            </button>
          </div>
        )}

        {sufficient && !running && (
          <div className="flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4">
            <p className="text-sm text-cyan-100">
              Ready to run the screening. The result will be saved to the local demo history.
            </p>
            <button type="button" className="btn-primary" onClick={handleRun}>
              Run Screening <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-200">{value}</div>
    </div>
  );
}
