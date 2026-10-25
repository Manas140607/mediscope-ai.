import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  Info,
  Printer,
  RotateCw,
  Save,
  Stethoscope,
} from 'lucide-react';
import type { ScreeningResult } from '@/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';

interface Props {
  result: ScreeningResult;
  onRepeat: () => void;
  onSave: () => void;
  onReviewInputs: () => void;
  onPrint: () => void;
  saved: boolean;
}

const STATUS_META = {
  review_recommended: { label: 'Review Recommended', tone: 'warning' as const, icon: <AlertTriangle className="h-4 w-4" /> },
  no_immediate_flag: { label: 'No Immediate Flag in This Screening', tone: 'success' as const, icon: <CheckCircle2 className="h-4 w-4" /> },
  insufficient_data: { label: 'Insufficient Data', tone: 'neutral' as const, icon: <Info className="h-4 w-4" /> },
};

export function ScreeningResultCard({ result, onRepeat, onSave, onReviewInputs, onPrint, saved }: Props) {
  const meta = STATUS_META[result.status];
  const tone = result.status === 'insufficient_data' ? 'neutral' : meta.tone;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      {/* Header band */}
      <div
        className={`relative px-6 py-5 ${
          tone === 'warning'
            ? 'bg-amber-500/10'
            : tone === 'success'
              ? 'bg-emerald-500/10'
              : 'bg-white/[0.02]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                tone === 'warning'
                  ? 'border-amber-400/30 bg-amber-500/10 text-amber-300'
                  : tone === 'success'
                    ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/10 bg-white/[0.03] text-slate-300'
              }`}
            >
              {meta.icon}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">{meta.label}</h2>
              <p className="text-xs text-slate-400">
                Patient {result.patientId} · {formatDate(result.timestamp)}
              </p>
            </div>
          </div>
          <StatusBadge tone={result.mode === 'demo' ? 'neutral' : 'info'}>
            {result.mode === 'demo' ? 'Demo Mode' : 'Model Inference'}
          </StatusBadge>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Effective vitals */}
        <div className="grid gap-4 sm:grid-cols-3">
          <VitalCard label="Systolic" value={result.effectiveSystolic} unit="mmHg" />
          <VitalCard label="Diastolic" value={result.effectiveDiastolic} unit="mmHg" />
          <VitalCard label="Pulse" value={result.effectivePulse} unit="bpm" />
        </div>

        {/* Category */}
        {result.sufficientEvidence && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">BP category (screening)</div>
            <div className="mt-1 text-lg font-semibold text-cyan-200">{result.explanation.categoryLabel}</div>
            <p className="mt-2 text-sm text-slate-300">{result.explanation.summary}</p>
          </div>
        )}

        {/* Explainability factors */}
        {result.sufficientEvidence && result.explanation.factors.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Eye className="h-4 w-4 text-cyan-300" /> Factors that contributed to this result
            </div>
            <div className="space-y-2">
              {result.explanation.factors.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                >
                  <ContributionDot contribution={f.contribution} />
                  <div>
                    <div className="text-sm font-medium text-slate-200">{f.label}</div>
                    <div className="mt-0.5 text-xs text-slate-400">{f.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quality / validation warnings */}
        {(result.qualityFlags.length > 0 || result.validationIssues.length > 0) && (
          <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-200">
              <AlertTriangle className="h-4 w-4" /> Measurement & validation warnings
            </div>
            <ul className="ml-5 list-disc space-y-1 text-xs text-amber-100/90">
              {result.qualityFlags.map((f, i) => (
                <li key={`q-${i}`}>{f.message}</li>
              ))}
              {result.validationIssues.map((v, i) => (
                <li key={`v-${i}`}>{v.message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendation */}
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-200">
            <Stethoscope className="h-4 w-4" /> Recommended next step for the healthcare worker
          </div>
          <p className="text-sm text-slate-200">{result.recommendation}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Referral review:</span>
            <ReferralBadge state={result.referralReview} />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[11px] leading-relaxed text-slate-500">
          MediScope AI is a screening decision-support prototype. It is not a diagnostic device and
          does not replace a qualified healthcare professional. Results depend on input quality and
          model limitations.
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-ghost" onClick={onReviewInputs}>
            Review Inputs
          </button>
          <button type="button" className="btn-secondary" onClick={onRepeat}>
            <RotateCw className="h-4 w-4" /> Repeat Measurement
          </button>
          <button type="button" className="btn-primary" onClick={onSave} disabled={saved}>
            <Save className="h-4 w-4" /> {saved ? 'Saved' : 'Save Result'}
          </button>
          <button type="button" className="btn-ghost" onClick={onPrint}>
            <Printer className="h-4 w-4" /> Print Summary
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function VitalCard({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-3xl font-semibold text-white">
        {value !== null ? <AnimatedNumber value={value} suffix={` ${unit}`} /> : '—'}
      </div>
    </div>
  );
}

function ContributionDot({ contribution }: { contribution: 'elevating' | 'protective' | 'neutral' }) {
  const cls =
    contribution === 'elevating'
      ? 'bg-amber-400'
      : contribution === 'protective'
        ? 'bg-emerald-400'
        : 'bg-slate-500';
  const icon =
    contribution === 'elevating' ? (
      <ArrowRight className="h-3 w-3 text-amber-300" />
    ) : contribution === 'protective' ? (
      <CheckCircle2 className="h-3 w-3 text-emerald-300" />
    ) : (
      <Info className="h-3 w-3 text-slate-400" />
    );
  return (
    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${cls}/20`}>
      {icon}
    </span>
  );
}

function ReferralBadge({ state }: { state: ScreeningResult['referralReview'] }) {
  const map = {
    not_required: { label: 'Not required', tone: 'success' as const },
    suggested: { label: 'Suggested', tone: 'warning' as const },
    required: { label: 'Required', tone: 'danger' as const },
    insufficient: { label: 'Insufficient evidence', tone: 'neutral' as const },
  };
  const m = map[state];
  return <StatusBadge tone={m.tone}>{m.label}</StatusBadge>;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
