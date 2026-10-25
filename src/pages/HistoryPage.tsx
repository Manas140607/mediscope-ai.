import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, History, RotateCcw, Search, UserPlus } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingSkeleton } from '@/components/shared/Loading';
import { BpHistoryChart } from '@/components/charts/BpHistoryChart';
import { useScreeningHistory } from '@/hooks/useScreeningHistory';
import { useToastContext } from '@/hooks/useToastContext';
import type { ScreeningStatus } from '@/types';

const STATUS_META: Record<ScreeningStatus, { label: string; tone: 'success' | 'warning' | 'neutral' }> = {
  review_recommended: { label: 'Review Recommended', tone: 'warning' },
  no_immediate_flag: { label: 'No Immediate Flag', tone: 'success' },
  insufficient_data: { label: 'Insufficient Data', tone: 'neutral' },
};

export function HistoryPage() {
  const { records, loaded, reset } = useScreeningHistory();
  const { notify } = useToastContext();
  const [statusFilter, setStatusFilter] = useState<'all' | ScreeningStatus>('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!r.patientId.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [records, statusFilter, query]);

  return (
    <div>
      <PageHeader
        title="Patient Screening History"
        subtitle="All records are synthetic demonstration data stored locally in your browser. No real patient data is collected."
        icon={<History className="h-5 w-5" />}
        action={
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                reset();
                notify('Demo history reset to seed records.');
              }}
            >
              <RotateCcw className="h-4 w-4" /> Reset Demo
            </button>
            <Link to="/register" className="btn-primary">
              <UserPlus className="h-4 w-4" /> New Screening
            </Link>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-5">
        <div className="glass-card p-5 lg:col-span-3">
          <h3 className="mb-1 text-sm font-semibold text-white">Blood pressure trend</h3>
          <p className="mb-3 text-xs text-slate-500">Systolic and diastolic across all screening records.</p>
          <BpHistoryChart records={records} />
        </div>
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-white">Filters</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="status-filter" className="label-field">
                <Filter className="mr-1 inline h-3.5 w-3.5" /> Status
              </label>
              <select
                id="status-filter"
                className="input-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              >
                <option value="all">All statuses</option>
                <option value="review_recommended">Review Recommended</option>
                <option value="no_immediate_flag">No Immediate Flag</option>
                <option value="insufficient_data">Insufficient Data</option>
              </select>
            </div>
            <div>
              <label htmlFor="search" className="label-field">
                <Search className="mr-1 inline h-3.5 w-3.5" /> Search patient / screening ID
              </label>
              <input
                id="search"
                className="input-field"
                placeholder="e.g. PT-DEMO-A1"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500">
              Showing {filtered.length} of {records.length} records.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="border-b border-white/5 px-5 py-4">
          <h3 className="text-sm font-semibold text-white">Screening records</h3>
        </div>
        {!loaded ? (
          <div className="p-5"><LoadingSkeleton rows={5} /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-10 text-center">
            <p className="text-sm text-slate-400">No records match the current filters.</p>
            <button
              type="button"
              className="btn-ghost mt-3"
              onClick={() => {
                setStatusFilter('all');
                setQuery('');
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {filtered.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-white/[0.02]"
                  onClick={() => setExpanded((cur) => (cur === r.id ? null : r.id))}
                  aria-expanded={expanded === r.id}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-slate-300">{r.patientId}</span>
                    <span className="text-xs text-slate-500">{formatDate(r.timestamp)}</span>
                    <span className="text-xs text-slate-300">
                      BP {r.effectiveSystolic ?? '—'}/{r.effectiveDiastolic ?? '—'} · Pulse {r.effectivePulse ?? '—'}
                    </span>
                    <StatusBadge tone={STATUS_META[r.status].tone}>{STATUS_META[r.status].label}</StatusBadge>
                    <StatusBadge tone={r.mode === 'demo' ? 'neutral' : 'info'}>Demo</StatusBadge>
                  </div>
                  <span className="text-xs text-cyan-300">{expanded === r.id ? 'Hide' : 'View'}</span>
                </button>
                {expanded === r.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white/[0.01] px-5 py-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Contributing factors</h4>
                        {r.explanation.factors.length === 0 ? (
                          <p className="text-xs text-slate-500">No factors — insufficient evidence was produced.</p>
                        ) : (
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {r.explanation.factors.map((f) => (
                              <li key={f.label} className="flex gap-2">
                                <span
                                  className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                                    f.contribution === 'elevating'
                                      ? 'bg-amber-400'
                                      : f.contribution === 'protective'
                                        ? 'bg-emerald-400'
                                        : 'bg-slate-500'
                                  }`}
                                />
                                <span>
                                  <span className="font-medium text-slate-200">{f.label}.</span> {f.detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Recommendation</h4>
                        <p className="text-xs text-slate-300">{r.recommendation}</p>
                        {(r.qualityFlags.length > 0 || r.validationIssues.length > 0) && (
                          <div className="mt-3">
                            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-300">Warnings</h4>
                            <ul className="ml-4 list-disc space-y-1 text-[11px] text-amber-100/90">
                              {r.qualityFlags.map((f, idx) => (
                                <li key={`q-${idx}`}>{f.message}</li>
                              ))}
                              {r.validationIssues.map((v, idx) => (
                                <li key={`v-${idx}`}>{v.message}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
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
