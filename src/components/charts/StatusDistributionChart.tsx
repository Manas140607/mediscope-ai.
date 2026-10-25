import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { ScreeningResult } from '@/types';

const COLORS: Record<string, string> = {
  'Review Recommended': '#fbbf24',
  'No Immediate Flag': '#34d399',
  'Insufficient Data': '#64748b',
};

export function StatusDistributionChart({ records }: { records: ScreeningResult[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {
      'Review Recommended': 0,
      'No Immediate Flag': 0,
      'Insufficient Data': 0,
    };
    for (const r of records) {
      if (r.status === 'review_recommended') counts['Review Recommended']++;
      else if (r.status === 'no_immediate_flag') counts['No Immediate Flag']++;
      else counts['Insufficient Data']++;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-slate-500">
        No screening records yet.
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={3}
            isAnimationActive
          >
            {data.map((d) => (
              <Cell key={d.name} fill={COLORS[d.name] ?? '#64748b'} stroke="#0a1124" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#0a1124',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#e6edf7',
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-400">
        {data.map((d) => (
          <span key={d.name} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[d.name] }} />
            {d.name} ({d.value})
          </span>
        ))}
      </div>
    </div>
  );
}
