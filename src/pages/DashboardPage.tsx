import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  FlaskConical,
  LayoutDashboard,
  RotateCcw,
  ShieldAlert,
  UserPlus,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingSkeleton } from '@/components/shared/Loading';
import { useScreeningHistory } from '@/hooks/useScreeningHistory';
import { useToastContext } from '@/hooks/useToastContext';
import { BpHistoryChart } from '@/components/charts/BpHistoryChart';
import { StatusDistributionChart } from '@/components/charts/StatusDistributionChart';
import type { ScreeningStatus } from '@/types';

const STATUS_META: Record<ScreeningStatus, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  review_recommended: { label: 'Review Recommended', tone: 'warning' },
  no_immediate_flag: { label: 'No Immediate Flag', tone: 'success' },
  insufficient_data: { label: 'Insufficient Data', tone: 'neutral' },
};

export function DashboardPage() {
  const { records, loaded, reset } = useScreeningHistory();
  const { notify } = useToastContext();

  const stats = useMemo(() => {
    const total = records.length;
    const review = records.filter((r) => r.status === 'review_recommended').length;
    const clean = records.filter((r) => r.status === 'no_immediate_flag').length;
    const insufficient = records.filter((r) => r.status === 'insufficient_data').length;
    const uniquePatients = new Set(records.map((r) => r.patientId)).size;
    return { total, review, clean, insufficient, uniquePatients };
  }, [records]);

  return (
    <div>
      <PageHeader
        title="Healthcare Worker Dashboard"
        subtitle="Screening records from the local demonstration store. All records are synthetic."
        icon={<LayoutDashboard className="h-5 w-5" />}
        action={
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                reset();
                notify('Demo data has been reset.');
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

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} label="Total screenings" value={stats.total} icon={<Activity className="h-4 w-4" />} tone="info" />
        <StatCard index={1} label="Unique patients" value={stats.uniquePatients} icon={<Users className="h-4 w-4" />} tone="info" />
        <StatCard index={2} label="Review recommended" value={stats.review} icon={<ShieldAlert className="h-4 w-4" />} tone="warning" />
        <StatCard index={3} label="No immediate flag" value={stats.clean} icon={<FlaskConical className="h-4 w-4" />} tone="success" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 lg:col-span-3"
        >
          <h3 className="mb-1 text-sm font-semibold text-white">Blood pressure over recent screenings</h3>
          <p className="mb-4 text-xs text-slate-500">Systolic and diastolic readings across all demo records.</p>
          <BpHistoryChart records={records} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <h3 className="mb-1 text-sm font-semibold text-white">Screening status distribution</h3>
          <p className="mb-4 text-xs text-slate-500">Demo records grouped by screening outcome.</p>
          <StatusDistributionChart records={records} />
        </motion.div>
      </div>

      {/* Records table */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="glass-card mt-6 overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <h3 className="text-sm font-semibold text-white">Recent screening records</h3>
          <Link to="/history" className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {!loaded ? (
          <div className="p-5"><LoadingSkeleton rows={4} /></div>
        ) : records.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500">
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">BP</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 6).map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="border-b border-white/[0.03] transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-slate-300">{r.patientId}</td>
                    <td className="px-5 py-3 text-xs text-slate-400">{formatDate(r.timestamp)}</td>
                    <td className="px-5 py-3 text-xs text-slate-300">
                      {r.effectiveSystolic ?? '—'}/{r.effectiveDiastolic ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-300">{r.explanation.categoryLabel}</td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={STATUS_META[r.status].tone}>
                        {STATUS_META[r.status].label}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to="/history"
                        className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
                      >
                        Open
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
  index,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: 'info' | 'warning' | 'success';
  index: number;
}) {
  const toneClass =
    tone === 'warning'
      ? 'border-amber-400/30 text-amber-300'
      : tone === 'success'
        ? 'border-emerald-400/30 text-emerald-300'
        : 'border-cyan-400/30 text-cyan-300';
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg border bg-white/[0.02] ${toneClass}`}>
          {icon}
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 + index * 0.06 }}
        className="mt-3 text-3xl font-semibold text-white"
      >
        {value}
      </motion.div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-5 py-10 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-slate-500">
        <Activity className="h-6 w-6" />
      </div>
      <p className="text-sm text-slate-400">No screening records yet.</p>
      <Link to="/register" className="btn-secondary mt-4">
        <UserPlus className="h-4 w-4" /> Start a screening
      </Link>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}
