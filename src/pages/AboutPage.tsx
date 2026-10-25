import {
  Database,
  Eye,
  FileText,
  Globe,
  Lock,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useScreeningHistory } from '@/hooks/useScreeningHistory';
import { useToastContext } from '@/hooks/useToastContext';
import { useScreeningFlow } from '@/hooks/useScreeningFlow';

export function AboutPage() {
  const { reset } = useScreeningHistory();
  const { resetFlow } = useScreeningFlow();
  const { notify } = useToastContext();

  const handleReset = () => {
    reset();
    resetFlow();
    notify('Demo data and current screening flow have been reset.');
  };

  return (
    <div>
      <PageHeader
        title="Privacy, Safety & About"
        subtitle="How MediScope AI handles data, the limits of the screening prototype, and the responsibilities of healthcare workers."
        icon={<ShieldAlert className="h-5 w-5" />}
      />

      <div className="space-y-6">
        {/* Disclaimer banner */}
        <div className="glass-card border-amber-400/30 p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-300" />
            <div>
              <h3 className="text-base font-semibold text-white">Important disclaimer</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                MediScope AI is a screening decision-support prototype. It is <strong>not</strong> a
                diagnostic device and does <strong>not</strong> replace a qualified healthcare
                professional. Results depend on input quality and model limitations. Clinical
                decisions require appropriate professional assessment.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <Section icon={<Lock className="h-5 w-5" />} title="Privacy-conscious defaults">
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2"><Dot /> Only synthetic demonstration patient records are used. No real personal data is required or collected.</li>
            <li className="flex gap-2"><Dot /> Patient identifiers in the demo are non-identifying codes (e.g. <code className="text-cyan-300">PT-DEMO-A1</code>).</li>
            <li className="flex gap-2"><Dot /> In demo mode, screening records are stored locally in your browser's <code className="text-cyan-300">localStorage</code>. They never leave your device.</li>
            <li className="flex gap-2"><Dot /> No real patient data or secrets are written to logs.</li>
            <li className="flex gap-2"><Dot /> If remote persistence is configured in future, server-side authorization and row-level security will be required before any real data is stored.</li>
          </ul>
        </Section>

        {/* Data storage */}
        <Section icon={<Database className="h-5 w-5" />} title="Where data is stored">
          <div className="grid gap-3 sm:grid-cols-3">
            <StorageTile label="Demo mode" value="Browser localStorage" tone="info" />
            <StorageTile label="Remote (if configured)" value="Supabase with RLS" tone="neutral" />
            <StorageTile label="Secrets / API keys" value="Server-side only" tone="success" />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Browser storage is not a secure vault — do not store real patient records in the demo. The
            privacy notice above makes this limitation explicit.
          </p>
        </Section>

        {/* Safety */}
        <Section icon={<ShieldCheck className="h-5 w-5" />} title="Safety guardrails">
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2"><Dot /> A screening flag is never presented as a diagnosis.</li>
            <li className="flex gap-2"><Dot /> Single measurements are flagged with a repeat-measurement advisory before any flag is acted upon.</li>
            <li className="flex gap-2"><Dot /> Implausible values block result generation and request remeasurement.</li>
            <li className="flex gap-2"><Dot /> The healthcare worker can always review inputs, repeat the measurement, or refer — the worker retains clinical responsibility.</li>
            <li className="flex gap-2"><Dot /> Demo mode is always clearly labelled; no fabricated model accuracy or clinical validation is shown.</li>
          </ul>
        </Section>

        {/* Responsible AI */}
        <Section icon={<Eye className="h-5 w-5" />} title="Explainability & responsible AI">
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2"><Dot /> Every result lists the factors that contributed to the screening flag.</li>
            <li className="flex gap-2"><Dot /> Clinical thresholds are configurable and documented with their source (ACC/AHA 2017 screening categories).</li>
            <li className="flex gap-2"><Dot /> The demo screening engine is deterministic — the same inputs always produce the same outputs.</li>
            <li className="flex gap-2"><Dot /> A clean model-adapter boundary lets a real trained model replace demo logic without changing the UI.</li>
          </ul>
        </Section>

        {/* Accessibility & connectivity */}
        <Section icon={<Globe className="h-5 w-5" />} title="Accessibility & low-bandwidth design">
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2"><Dot /> Keyboard-accessible forms and controls with visible focus rings.</li>
            <li className="flex gap-2"><Dot /> Strong contrast and readable typography.</li>
            <li className="flex gap-2"><Dot /> Reduced-motion preferences are respected.</li>
            <li className="flex gap-2"><Dot /> Core demo runs locally without network access.</li>
            <li className="flex gap-2"><Dot /> Clear language and simple navigation for users with varying technical literacy.</li>
          </ul>
        </Section>

        {/* Reset */}
        <Section icon={<RotateCcw className="h-5 w-5" />} title="Demo data reset">
          <p className="text-sm text-slate-300">
            You can reset the demonstration data at any time. This clears the locally stored screening
            history and restores the seed demo records. The current screening flow is also cleared.
          </p>
          <div className="mt-4">
            <button type="button" className="btn-secondary" onClick={handleReset}>
              <Trash2 className="h-4 w-4" /> Reset demo data
            </button>
          </div>
        </Section>

        {/* About */}
        <Section icon={<FileText className="h-5 w-5" />} title="About this prototype">
          <p className="text-sm leading-relaxed text-slate-300">
            MediScope AI was built as a hackathon prototype for Problem Statement PS 3.1: AI-Assisted
            Screening Tool for a Single Common Condition at PHC Level. The selected condition is
            hypertension risk screening using basic vital signs. The goal is an affordable, simple,
            explainable screening-support tool that works with limited connectivity and helps
            healthcare workers decide when specialist review may be appropriate.
          </p>
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <UserCheck className="h-4 w-4 text-cyan-300" />
            Built for demonstration purposes. Not for clinical deployment without validation, regulatory
            review, and integration of a trained, evaluated model.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function StorageTile({ label, value, tone }: { label: string; value: string; tone: 'info' | 'neutral' | 'success' }) {
  const cls =
    tone === 'success'
      ? 'border-emerald-400/30 text-emerald-300'
      : tone === 'neutral'
        ? 'border-white/10 text-slate-300'
        : 'border-cyan-400/30 text-cyan-300';
  return (
    <div className={`rounded-xl border bg-white/[0.02] p-4 ${cls}`}>
      <div className="text-[11px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-200">{value}</div>
    </div>
  );
}

function Dot() {
  return <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden />;
}
