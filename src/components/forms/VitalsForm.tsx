import { useMemo } from 'react';
import type { Vitals } from '@/types';
import { computeEffectiveVitals } from '@/services/screeningEngine';
import { HeartPulse, Repeat } from 'lucide-react';

interface Props {
  vitals: Vitals;
  onChange: (v: Vitals) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function VitalsForm({ vitals, onChange, onSubmit, onBack }: Props) {
  const update = (patch: Partial<Vitals>) => onChange({ ...vitals, ...patch });
  const effective = useMemo(() => computeEffectiveVitals(vitals), [vitals]);

  const hasReading1 = vitals.systolic !== null || vitals.diastolic !== null;

  return (
    <form
      className="glass-card p-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
          <HeartPulse className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-white">Vital signs entry</h3>
          <p className="text-xs text-slate-500">Enter blood pressure and pulse. A repeat reading is recommended.</p>
        </div>
      </div>

      <ReadingBlock
        title="Reading 1"
        systolic={vitals.systolic}
        diastolic={vitals.diastolic}
        pulse={vitals.pulse}
        onChange={(patch) => update(patch)}
      />

      <div className="my-5 h-px bg-white/5" />

      <ReadingBlock
        title="Reading 2 (recommended)"
        optional
        systolic={vitals.systolic2}
        diastolic={vitals.diastolic2}
        pulse={vitals.pulse2}
        onChange={(patch) =>
          update({
            systolic2: patch.systolic ?? vitals.systolic2,
            diastolic2: patch.diastolic ?? vitals.diastolic2,
            pulse2: patch.pulse ?? vitals.pulse2,
          })
        }
      />

      {hasReading1 && (effective.systolic !== null || effective.diastolic !== null) && (
        <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Repeat className="h-3.5 w-3.5" /> Effective values (averaged)
          </div>
          <div className="mt-2 grid grid-cols-3 gap-3 text-center text-sm">
            <EffStat label="Systolic" value={effective.systolic} unit="mmHg" />
            <EffStat label="Diastolic" value={effective.diastolic} unit="mmHg" />
            <EffStat label="Pulse" value={effective.pulse} unit="bpm" />
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <button type="button" className="btn-ghost" onClick={onBack}>
          Back
        </button>
        <button type="submit" className="btn-primary">
          Run Screening
        </button>
      </div>
    </form>
  );
}

function ReadingBlock({
  title,
  systolic,
  diastolic,
  pulse,
  onChange,
  optional,
}: {
  title: string;
  systolic: number | null;
  diastolic: number | null;
  pulse: number | null;
  onChange: (patch: Partial<Vitals>) => void;
  optional?: boolean;
}) {
  return (
    <div>
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title} {optional && <span className="text-slate-500">(optional)</span>}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Systolic" unit="mmHg">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={300}
            className="input-field"
            value={systolic ?? ''}
            onChange={(e) => onChange({ systolic: e.target.value === '' ? null : Number(e.target.value) })}
            aria-label={`${title} systolic blood pressure in mmHg`}
          />
        </Field>
        <Field label="Diastolic" unit="mmHg">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={200}
            className="input-field"
            value={diastolic ?? ''}
            onChange={(e) => onChange({ diastolic: e.target.value === '' ? null : Number(e.target.value) })}
            aria-label={`${title} diastolic blood pressure in mmHg`}
          />
        </Field>
        <Field label="Pulse" unit="bpm">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={250}
            className="input-field"
            value={pulse ?? ''}
            onChange={(e) => onChange({ pulse: e.target.value === '' ? null : Number(e.target.value) })}
            aria-label={`${title} pulse rate in bpm`}
          />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, unit, children }: { label: string; unit: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-field">{label} <span className="text-slate-500">({unit})</span></label>
      {children}
    </div>
  );
}

function EffStat({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  return (
    <div>
      <div className="text-lg font-semibold text-white">{value ?? '—'}</div>
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label} · {unit}</div>
    </div>
  );
}
