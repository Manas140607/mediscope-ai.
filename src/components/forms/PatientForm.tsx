import type { Patient, Sex } from '@/types';
import { generatePatientId } from '@/services/screeningEngine';
import { RotateCcw, UserPlus } from 'lucide-react';

interface Props {
  patient: Patient;
  onChange: (p: Patient) => void;
  onReset: () => void;
  onSubmit: () => void;
  submitLabel?: string;
}

export function PatientForm({ patient, onChange, onReset, onSubmit, submitLabel = 'Continue to Vitals' }: Props) {
  const update = (patch: Partial<Patient>) => onChange({ ...patient, ...patch });

  const toggleHistory = (key: keyof Patient, value: boolean) => update({ [key]: value } as Partial<Patient>);

  return (
    <form
      className="glass-card p-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">Patient registration</h3>
          <p className="mt-1 text-xs text-slate-500">
            No personally identifying information is required for this demonstration.
          </p>
        </div>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => update({ id: generatePatientId() })}
          aria-label="Generate a new patient ID"
        >
          <RotateCcw className="h-4 w-4" /> New ID
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Patient ID" htmlFor="patientId">
          <input
            id="patientId"
            className="input-field font-mono"
            value={patient.id}
            onChange={(e) => update({ id: e.target.value })}
            aria-describedby="patientId-help"
          />
          <p id="patientId-help" className="mt-1 text-[11px] text-slate-500">
            Non-identifying demo ID. Auto-generated.
          </p>
        </Field>

        <Field label="Screening date" htmlFor="screeningDate">
          <input
            id="screeningDate"
            type="date"
            className="input-field"
            value={patient.screeningDate}
            onChange={(e) => update({ screeningDate: e.target.value })}
          />
        </Field>

        <Field label="Age (years)" htmlFor="age">
          <input
            id="age"
            type="number"
            min={0}
            max={130}
            inputMode="numeric"
            className="input-field"
            value={patient.age ?? ''}
            onChange={(e) => update({ age: e.target.value === '' ? null : Number(e.target.value) })}
          />
        </Field>

        <Field label="Sex" htmlFor="sex">
          <select
            id="sex"
            className="input-field"
            value={patient.sex}
            onChange={(e) => update({ sex: e.target.value as Sex })}
          >
            <option value="undisclosed">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </Field>

        <Field label="Height (cm)" htmlFor="height" optional>
          <input
            id="height"
            type="number"
            min={0}
            max={250}
            inputMode="numeric"
            className="input-field"
            value={patient.heightCm ?? ''}
            onChange={(e) => update({ heightCm: e.target.value === '' ? null : Number(e.target.value) })}
          />
        </Field>

        <Field label="Weight (kg)" htmlFor="weight" optional>
          <input
            id="weight"
            type="number"
            min={0}
            max={300}
            inputMode="numeric"
            className="input-field"
            value={patient.weightKg ?? ''}
            onChange={(e) => update({ weightKg: e.target.value === '' ? null : Number(e.target.value) })}
          />
        </Field>
      </div>

      <div className="mt-6">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Relevant medical history (optional)
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <TriField
            label="Prior hypertension"
            value={patient.historyHypertension}
            onChange={(v) => toggleHistory('historyHypertension', v)}
          />
          <TriField
            label="Diabetes"
            value={patient.historyDiabetes}
            onChange={(v) => toggleHistory('historyDiabetes', v)}
          />
          <TriField
            label="Family history of hypertension"
            value={patient.familyHistory}
            onChange={(v) => toggleHistory('familyHistory', v)}
          />
          <TriField
            label="Currently on BP medication"
            value={patient.currentMedication}
            onChange={(v) => toggleHistory('currentMedication', v)}
          />
        </div>
      </div>

      <div className="mt-6">
        <Field label="Notes (optional)" htmlFor="notes">
          <textarea
            id="notes"
            rows={3}
            className="input-field resize-none"
            value={patient.notes}
            onChange={(e) => update({ notes: e.target.value })}
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" className="btn-ghost" onClick={onReset}>
          <RotateCcw className="h-4 w-4" /> Clear
        </button>
        <button type="submit" className="btn-primary">
          <UserPlus className="h-4 w-4" /> {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
  optional,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label-field">
        {label} {optional && <span className="text-slate-500">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

function TriField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  const options: { v: boolean | null; l: string }[] = [
    { v: null, l: 'Unknown' },
    { v: true, l: 'Yes' },
    { v: false, l: 'No' },
  ];
  return (
    <div className="glass-panel p-3">
      <div className="mb-2 text-xs font-medium text-slate-300">{label}</div>
      <div className="flex gap-1.5" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.l}
            type="button"
            onClick={() => onChange(o.v as boolean)}
            className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              value === o.v
                ? 'bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/40'
                : 'bg-white/[0.02] text-slate-400 hover:bg-white/[0.06]'
            }`}
            aria-pressed={value === o.v}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}
