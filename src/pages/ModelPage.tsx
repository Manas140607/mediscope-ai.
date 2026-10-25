import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Database,
  FileBarChart,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EvaluationEmptyState } from '@/components/charts/EvaluationEmptyState';
import { LoadingSkeleton } from '@/components/shared/Loading';
import { getModelMetadata } from '@/services/modelMetadata';
import { loadDatasetSummary } from '@/services/datasetService';
import type { DatasetSummary, ModelMetadata } from '@/types';

export function ModelPage() {
  const [meta] = useState<ModelMetadata>(() => getModelMetadata());
  const [dataset, setDataset] = useState<DatasetSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadDatasetSummary().then((d) => {
      if (active) {
        setDataset(d);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <PageHeader
        title="Model & Dataset Information"
        subtitle="Transparent reporting of the screening engine, its intended use, and the status of any real model or evaluation data."
        icon={<Cpu className="h-5 w-5" />}
        action={<StatusBadge tone={meta.mode === 'demo' ? 'warning' : 'info'} icon={<span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}>{meta.mode === 'demo' ? 'Demo Mode' : meta.mode}</StatusBadge>}
      />

      <div className="space-y-6">
        {/* Engine status banner */}
        <div className="glass-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
              <Cpu className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">{meta.name}</h3>
              <p className="text-xs text-slate-400">Version {meta.version} · {meta.type}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="neutral"><CheckCircle2 className="h-3.5 w-3.5" /> Deterministic</StatusBadge>
            <StatusBadge tone="warning"><AlertTriangle className="h-3.5 w-3.5" /> Not clinically validated</StatusBadge>
            <StatusBadge tone="info"><Info className="h-3.5 w-3.5" /> Explainable</StatusBadge>
          </div>
        </div>

        {/* Intended use */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-card p-5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white"><ShieldCheck className="h-4 w-4 text-cyan-300" /> Intended use</h3>
            <p className="text-sm leading-relaxed text-slate-300">{meta.intendedUse}</p>
          </div>
          <div className="glass-card p-5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white"><AlertTriangle className="h-4 w-4 text-amber-300" /> Excluded use cases</h3>
            <p className="text-sm leading-relaxed text-slate-300">{meta.excludedUse}</p>
          </div>
        </div>

        {/* Limitations */}
        <div className="glass-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">Limitations</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {meta.limitations.map((l, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dataset */}
        <div className="glass-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-300" />
            <h3 className="text-sm font-semibold text-white">Dataset</h3>
            {dataset && (
              <StatusBadge tone={dataset.loaded ? 'success' : 'neutral'}>
                {dataset.loaded ? 'Loaded' : 'Not loaded'}
              </StatusBadge>
            )}
          </div>
          {loading || !dataset ? (
            <LoadingSkeleton rows={3} />
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <InfoTile label="Name" value={dataset.name} />
                <InfoTile label="Licence" value={dataset.license} />
                <InfoTile label="Records" value={dataset.loaded ? String(dataset.recordCount) : '—'} />
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Source</div>
                <p className="text-sm text-slate-300">{dataset.source}</p>
              </div>
              {dataset.variables.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Variables</div>
                  <div className="overflow-x-auto rounded-xl border border-white/5">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-500">
                        <tr className="border-b border-white/5">
                          <th className="px-3 py-2 font-medium">Name</th>
                          <th className="px-3 py-2 font-medium">Type</th>
                          <th className="px-3 py-2 font-medium">Missing %</th>
                          <th className="px-3 py-2 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataset.variables.map((v) => (
                          <tr key={v.name} className="border-b border-white/[0.03]">
                            <td className="px-3 py-2 text-slate-200">{v.name}</td>
                            <td className="px-3 py-2 text-slate-400">{v.type}</td>
                            <td className="px-3 py-2 text-slate-400">{v.missingPercent.toFixed(1)}%</td>
                            <td className="px-3 py-2 text-slate-400">{v.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {dataset.preprocessing.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Preprocessing</div>
                  <ul className="ml-5 list-disc space-y-1 text-sm text-slate-300">
                    {dataset.preprocessing.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!dataset.loaded && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-500/5 p-4 text-xs text-amber-200">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    No dataset is loaded in this prototype. To populate this page with real values,
                    configure a public vital-signs / cardiovascular-risk dataset (for example CDC
                    NHANES or the UCI Heart Disease dataset) via the <code>VITE_DATASET_ENDPOINT</code> environment
                    variable. Record counts and label distributions are shown only after a dataset is
                    actually loaded — never fabricated.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Evaluation */}
        <div className="glass-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <FileBarChart className="h-5 w-5 text-cyan-300" />
            <h3 className="text-sm font-semibold text-white">Model evaluation</h3>
            <StatusBadge tone="neutral">No evaluation data</StatusBadge>
          </div>
          <p className="mb-4 text-sm text-slate-400">
            Evaluation metrics will appear here only when computed from genuine held-out results. Until
            then, the panels below explain what will be shown and how to produce it.
          </p>
          <EvaluationEmptyState />
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-200">{value}</div>
    </div>
  );
}
