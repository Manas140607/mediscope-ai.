import { motion } from 'framer-motion';
import { Activity, Cpu, Eye, FlaskConical, HeartPulse, ShieldCheck, Stethoscope, Workflow } from 'lucide-react';

const STAGES = [
  { label: 'Validate inputs', icon: ShieldCheck },
  { label: 'Check required fields', icon: Stethoscope },
  { label: 'Measurement quality', icon: HeartPulse },
  { label: 'Process inputs', icon: Cpu },
  { label: 'Screening engine', icon: FlaskConical },
  { label: 'Explainable result', icon: Eye },
  { label: 'Review recommendation', icon: Activity },
];

export function ScreeningPipelineProgress({ active, done }: { active: boolean; done: boolean }) {
  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
        <Workflow className="h-4 w-4" /> Screening pipeline
        <span className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-200">Simulated</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-7">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const isDone = done;
          const isActive = active && !done;
          const state = isDone ? 'done' : isActive ? 'active' : 'idle';
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition ${
                state === 'done'
                  ? 'border-emerald-400/30 bg-emerald-500/5'
                  : state === 'active'
                    ? 'border-cyan-400/40 bg-cyan-500/10'
                    : 'border-white/5 bg-white/[0.02]'
              }`}
            >
              <motion.span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  state === 'done'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : state === 'active'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-white/[0.03] text-slate-500'
                }`}
                animate={state === 'active' ? { scale: [1, 1.12, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Icon className="h-4 w-4" />
              </motion.span>
              <span className="text-[10px] leading-tight text-slate-300">{s.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
