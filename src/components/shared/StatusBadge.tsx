import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatusBadgeProps {
  tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: ReactNode;
  icon?: ReactNode;
}

const tones: Record<StatusBadgeProps['tone'], string> = {
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  danger: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
  info: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/30',
  neutral: 'bg-white/5 text-slate-300 border-white/10',
};

export function StatusBadge({ tone, children, icon }: StatusBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`badge border ${tones[tone]}`}
    >
      {icon}
      {children}
    </motion.span>
  );
}
