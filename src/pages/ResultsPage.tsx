import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ScreeningResultCard } from '@/components/screening/ScreeningResultCard';
import { VitalsOverviewChart } from '@/components/charts/VitalsOverviewChart';
import { useScreeningFlow } from '@/hooks/useScreeningFlow';
import { useScreeningHistory } from '@/hooks/useScreeningHistory';
import { useToastContext } from '@/hooks/useToastContext';
import { computeEffectiveVitals } from '@/services/screeningEngine';

export function ResultsPage() {
  const navigate = useNavigate();
  const { result, vitals, resetFlow } = useScreeningFlow();
  const { addRecord } = useScreeningHistory();
  const { notify } = useToastContext();

  if (!result) {
    return (
      <div>
        <PageHeader title="Screening Results" subtitle="No screening result is available yet." icon={<Eye className="h-5 w-5" />} />
        <div className="glass-card flex flex-col items-center p-10 text-center">
          <p className="text-sm text-slate-400">Run a screening first to see the explainable result here.</p>
          <button type="button" className="btn-primary mt-4" onClick={() => navigate('/register')}>
            Start Screening <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const effective = computeEffectiveVitals(vitals);

  const handlePrint = () => {
    notify('Opening print dialog for demonstration summary.');
    setTimeout(() => window.print(), 300);
  };

  return (
    <div>
      <PageHeader
        title="Screening Results & Explainability"
        subtitle="A screening-support result with the factors that contributed to it. The healthcare worker retains clinical responsibility."
        icon={<Eye className="h-5 w-5" />}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ScreeningResultCard
            result={result}
            saved
            onReviewInputs={() => navigate('/vitals')}
            onRepeat={() => {
              resetFlow();
              navigate('/register');
            }}
            onSave={() => {
              addRecord(result);
              notify('Result saved to demo history.');
            }}
            onPrint={handlePrint}
          />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="glass-card p-5">
            <h3 className="mb-1 text-sm font-semibold text-white">Vitals overview</h3>
            <p className="mb-3 text-xs text-slate-500">Effective (averaged) readings with reference bands.</p>
            <VitalsOverviewChart vitals={vitals} effective={effective} />
          </div>

          <div className="glass-card p-5">
            <h3 className="mb-2 text-sm font-semibold text-white">Next steps</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2"><Dot /> Confirm the result with a repeat measurement if only one reading was taken.</li>
              <li className="flex gap-2"><Dot /> Apply local clinical protocol for referral review.</li>
              <li className="flex gap-2"><Dot /> Record the outcome in the patient's official record.</li>
              <li className="flex gap-2"><Dot /> This screening flag is not a diagnosis.</li>
            </ul>
            <button type="button" className="btn-secondary mt-4 w-full" onClick={() => navigate('/history')}>
              View screening history <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden />;
}
