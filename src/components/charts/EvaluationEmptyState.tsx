// Model evaluation panels. When no genuine held-out evaluation exists,
// we show an informative empty state explaining how to produce the metrics.
// We never fabricate ROC curves, confusion matrices, or metric values.

import { Cpu, FileBarChart, Info } from 'lucide-react';

export function EvaluationEmptyState() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <EmptyPanel
        icon={<FileBarChart className="h-5 w-5" />}
        title="Confusion matrix"
        text="Once a model is trained and evaluated on a held-out test set, a 2×2 confusion matrix (TP, FP, FN, TN) will be displayed here."
      />
      <EmptyPanel
        icon={<Cpu className="h-5 w-5" />}
        title="ROC curve & AUC"
        text="A receiver-operating-characteristic curve and area under the curve will appear once genuine evaluation results are available."
      />
      <EmptyPanel
        icon={<FileBarChart className="h-5 w-5" />}
        title="Precision · Recall · Sensitivity · Specificity"
        text="These metrics will be computed from the held-out evaluation set. They are not shown until real results exist."
      />
      <EmptyPanel
        icon={<Cpu className="h-5 w-5" />}
        title="Calibration"
        text="A calibration plot comparing predicted probabilities to observed frequencies will appear after genuine evaluation."
      />
    </div>
  );
}

function EmptyPanel({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="glass-panel flex flex-col p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-cyan-300">
          {icon}
        </span>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
      </div>
      <p className="text-sm leading-relaxed text-slate-400">{text}</p>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200">
        <Info className="h-3.5 w-3.5" />
        Not available — no model evaluation has been run.
      </div>
    </div>
  );
}
