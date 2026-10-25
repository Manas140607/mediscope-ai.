import { motion } from 'framer-motion';
import { FlaskConical, Play } from 'lucide-react';
import { DEMO_SCENARIOS, type DemoScenario } from '@/services/demoScenarios';

interface Props {
  onLoad: (scenario: DemoScenario) => void;
}

export function DemoScenarioLoader({ onLoad }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
          <FlaskConical className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-white">Load a demo scenario</h3>
          <p className="text-xs text-slate-500">Synthetic records — not real patients. Deterministic outputs.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {DEMO_SCENARIOS.map((s, i) => (
          <motion.button
            key={s.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onLoad(s)}
            className="group flex flex-col rounded-xl border border-white/5 bg-navy-900/40 p-4 text-left transition hover:border-cyan-400/40 hover:bg-cyan-500/5"
          >
            <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
              <Play className="h-3 w-3" /> Demo
            </span>
            <span className="text-sm font-semibold text-white">{s.label}</span>
            <span className="mt-1.5 text-xs leading-relaxed text-slate-400">{s.description}</span>
            <span className="mt-2 text-[11px] text-cyan-300/80">Expected: {s.expected}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
