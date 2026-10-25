import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import type { ValidationIssue, MeasurementQualityFlag } from '@/types';

interface Props {
  issues: ValidationIssue[];
  flags: MeasurementQualityFlag[];
  sufficientEvidence: boolean;
}

export function ValidationSummary({ issues, flags, sufficientEvidence }: Props) {
  const errors = issues.filter((i) => i.severity === 'error');
  const remeasure = flags.filter((f) => f.requiresRemeasure);
  const advisories = flags.filter((f) => !f.requiresRemeasure);

  if (errors.length === 0 && flags.length === 0 && sufficientEvidence) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/5 p-4"
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
        <div className="text-sm text-emerald-100">
          <p className="font-semibold">Inputs passed validation and quality checks.</p>
          <p className="mt-1 text-xs text-emerald-200/80">
            Proceed to the screening result. Remember: this is screening support, not a diagnosis.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {errors.length > 0 && (
        <Group tone="danger" icon={<XCircle className="h-5 w-5" />} title="Missing or invalid inputs">
          {errors.map((e, i) => (
            <li key={i}>{e.message}</li>
          ))}
        </Group>
      )}
      {remeasure.length > 0 && (
        <Group tone="warning" icon={<AlertTriangle className="h-5 w-5" />} title="Measurement quality — remeasure required">
          {remeasure.map((f, i) => (
            <li key={i}>{f.message}</li>
          ))}
        </Group>
      )}
      {advisories.length > 0 && (
        <Group tone="info" icon={<Info className="h-5 w-5" />} title="Advisories">
          {advisories.map((f, i) => (
            <li key={i}>{f.message}</li>
          ))}
        </Group>
      )}
      {!sufficientEvidence && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          Insufficient evidence to produce a screening result. Please correct the inputs above and re-run.
        </div>
      )}
    </div>
  );
}

function Group({
  tone,
  icon,
  title,
  children,
}: {
  tone: 'danger' | 'warning' | 'info';
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === 'danger'
      ? 'border-rose-400/30 bg-rose-500/5 text-rose-100'
      : tone === 'warning'
        ? 'border-amber-400/30 bg-amber-500/5 text-amber-100'
        : 'border-cyan-400/30 bg-cyan-500/5 text-cyan-100';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 ${toneClass}`}
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </div>
      <ul className="ml-6 list-disc space-y-1 text-xs leading-relaxed text-slate-200">{children}</ul>
    </motion.div>
  );
}
