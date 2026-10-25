import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { ScreeningFlowProvider } from '@/hooks/useScreeningFlow';
import { ToastProvider } from '@/hooks/useToastContext';
import { Toast } from '@/components/shared/Toast';

import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { VitalsPage } from '@/pages/VitalsPage';
import { ScreeningPage } from '@/pages/ScreeningPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { WorkflowPage } from '@/pages/WorkflowPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { ModelPage } from '@/pages/ModelPage';
import { AboutPage } from '@/pages/AboutPage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrap><LandingPage /></PageWrap>} />
        <Route path="/dashboard" element={<PageWrap><DashboardPage /></PageWrap>} />
        <Route path="/register" element={<PageWrap><RegisterPage /></PageWrap>} />
        <Route path="/vitals" element={<PageWrap><VitalsPage /></PageWrap>} />
        <Route path="/screening" element={<PageWrap><ScreeningPage /></PageWrap>} />
        <Route path="/results" element={<PageWrap><ResultsPage /></PageWrap>} />
        <Route path="/workflow" element={<PageWrap><WorkflowPage /></PageWrap>} />
        <Route path="/history" element={<PageWrap><HistoryPage /></PageWrap>} />
        <Route path="/model" element={<PageWrap><ModelPage /></PageWrap>} />
        <Route path="/about" element={<PageWrap><AboutPage /></PageWrap>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ScreeningFlowProvider>
        <HashRouter>
          <AppLayout>
            <AnimatedRoutes />
          </AppLayout>
        </HashRouter>
        <Toast />
      </ScreeningFlowProvider>
    </ToastProvider>
  );
}
