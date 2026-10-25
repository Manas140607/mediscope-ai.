import { useToastContext } from '@/hooks/useToastContext';

export function Toast() {
  const { message } = useToastContext();
  return <ToastView message={message} />;
}

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

function ToastView({ message }: { message: string | null }) {
  useEffect(() => {}, [message]);
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message + Math.random().toString(36).slice(2, 6)}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2.5 rounded-xl border border-cyan-400/30 bg-navy-800/95 px-4 py-3 text-sm text-cyan-100 shadow-glow backdrop-blur-md">
            <CheckCircle2 className="h-4 w-4 text-cyan-300" aria-hidden />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
