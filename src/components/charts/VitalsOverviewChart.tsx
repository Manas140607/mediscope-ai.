import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Vitals } from '@/types';

interface Props {
  vitals: Vitals;
  effective: { systolic: number | null; diastolic: number | null; pulse: number | null };
}

export function VitalsOverviewChart({ vitals, effective }: Props) {
  const data = [
    { name: 'Systolic', value: effective.systolic ?? 0, ref: 120, unit: 'mmHg' },
    { name: 'Diastolic', value: effective.diastolic ?? 0, ref: 80, unit: 'mmHg' },
    { name: 'Pulse', value: effective.pulse ?? 0, ref: 72, unit: 'bpm' },
  ];

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -16 }}>
          <CartesianGrid stroke="#1c2d5e" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#1c2d5e' }} />
          <YAxis domain={[0, 200]} tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1c2d5e' }} />
          <Tooltip
            contentStyle={{
              background: '#0a1124',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#e6edf7',
              fontSize: 12,
            }}
            formatter={(value: any, _name, props: any) => [`${value} ${props.payload.unit}`, props.payload.name]}
          />
          <ReferenceLine y={120} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: 'Sys ref', fill: '#fbbf24', fontSize: 10, position: 'right' }} />
          <ReferenceLine y={80} stroke="#34d399" strokeDasharray="4 4" label={{ value: 'Dia ref', fill: '#34d399', fontSize: 10, position: 'right' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive>
            {data.map((d, i) => (
              <Cell key={i} fill={d.name === 'Systolic' ? '#22d3ee' : d.name === 'Diastolic' ? '#2dd4bf' : '#38bdf8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-center text-[11px] text-slate-500">
        Reference lines indicate ACC/AHA elevated thresholds (120/80 mmHg), not diagnostic cut-offs.
      </p>
    </div>
  );
}
