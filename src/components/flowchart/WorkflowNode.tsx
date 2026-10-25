import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export type NodeType = 'start' | 'process' | 'decision' | 'branch' | 'end';

export interface WorkflowNodeData {
  label: string;
  description: string;
  icon: LucideIcon;
  type: NodeType;
  active?: boolean;
  done?: boolean;
}

function WorkflowNodeInner({ data }: { data: WorkflowNodeData }) {
  const Icon = data.icon;
  const isActive = data.active;
  const isDone = data.done;
  const isBranch = data.type === 'branch' || data.type === 'decision';

  const borderColor = isActive
    ? 'border-cyan-400/70'
    : isDone
      ? 'border-emerald-400/40'
      : isBranch
        ? 'border-amber-400/30'
        : 'border-white/10';

  const glow = isActive ? 'shadow-glow' : '';

  return (
    <motion.div
      animate={isActive ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={{ duration: 1.2, repeat: isActive ? Infinity : 0 }}
      className={`relative rounded-2xl border ${borderColor} bg-navy-850/90 px-4 py-3 backdrop-blur-md ${glow}`}
      style={{ width: 200 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-cyan-400 !border-cyan-300" />
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
            isActive
              ? 'border-cyan-400/40 bg-cyan-500/15 text-cyan-300'
              : isDone
                ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                : 'border-white/10 bg-white/[0.03] text-slate-300'
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white">{data.label}</div>
          {isBranch && (
            <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
              {data.type === 'branch' ? 'Branch' : 'Decision'}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-cyan-400 !border-cyan-300" />
    </motion.div>
  );
}

export const WorkflowNode = memo(WorkflowNodeInner);
