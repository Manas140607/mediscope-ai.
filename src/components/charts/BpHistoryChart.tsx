import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ScreeningResult } from '@/types';

interface Props {
  records: ScreeningResult[];
}

export function BpHistoryChart({ records }: Props) {
  const data = useMemo(
    () =>
      [...records]
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
        .map((r) => ({
          name: shortDate(r.timestamp),
          patient: r.patientId,
          Systolic: r.effectiveSystolic ?? null,
          Diastolic: r.effectiveDiastolic ?? null,
        })),
    [records],
  );

  if (data.length === 0) {
    return <EmptyChart label="No blood-pressure readings recorded yet." />;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -16 }}>
          <CartesianGrid stroke="#1c2d5e" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#1c2d5e' }}
          />
          <YAxis
            domain={[40, 200]}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#1c2d5e' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#cbd5e1' }} />
          <Line
            type="monotone"
            dataKey="Systolic"
            stroke="#22d3ee"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#22d3ee' }}
            activeDot={{ r: 5 }}
            isAnimationActive
          />
          <Line
            type="monotone"
            dataKey="Diastolic"
            stroke="#2dd4bf"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#2dd4bf' }}
            activeDot={{ r: 5 }}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-navy-900/95 px-3 py-2 text-xs text-slate-200 shadow-card backdrop-blur-md">
      <div className="mb-1 font-semibold text-cyan-300">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span>{p.dataKey}: {p.value ?? '—'} mmHg</span>
        </div>
      ))}
    </div>
  );
}

function shortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

export function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-slate-500">
      {label}
    </div>
  );
}
