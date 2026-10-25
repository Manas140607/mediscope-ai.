import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  LayoutDashboard,
  UserPlus,
  HeartPulse,
  FlaskConical,
  History,
  Cpu,
  ShieldAlert,
  Workflow,
  Menu,
  X,
  Info,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: typeof Activity;
}

const NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: Activity },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/register', label: 'New Patient', icon: UserPlus },
  { to: '/vitals', label: 'Vitals Entry', icon: HeartPulse },
  { to: '/screening', label: 'Screening', icon: FlaskConical },
  { to: '/workflow', label: 'How It Works', icon: Workflow },
  { to: '/history', label: 'Patient History', icon: History },
  { to: '/model', label: 'Model & Data', icon: Cpu },
  { to: '/about', label: 'Privacy & Safety', icon: ShieldAlert },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-navy-gradient text-slate-100">
      <div className="grid-bg pointer-events-none fixed inset-0 opacity-40" aria-hidden />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-navy-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="MediScope AI home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-wide text-white">MediScope AI</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-cyan-400/70">
                Screening Support
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <DemoModePill />
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 p-2 text-slate-200 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-white/5 p-4 md:flex">
          <nav className="flex flex-col gap-1" aria-label="Primary">
            {NAV.map((item) => (
              <DesktopNavItem key={item.to} item={item} active={isActive(location.pathname, item.to)} />
            ))}
          </nav>
          <DisclaimerStrip />
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
                aria-hidden
              />
              <motion.nav
                className="absolute left-0 top-0 h-full w-72 max-w-[80%] border-r border-white/10 bg-navy-900 p-4"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                aria-label="Mobile navigation"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Menu</span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg border border-white/10 p-1.5 text-slate-300"
                    aria-label="Close menu"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {NAV.map((item) => (
                    <MobileNavItem
                      key={item.to}
                      item={item}
                      active={isActive(location.pathname, item.to)}
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                </div>
                <div className="mt-4">
                  <DemoModePill />
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="relative min-h-[calc(100vh-4rem)] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function isActive(current: string, target: string) {
  if (target === '/') return current === '/';
  return current === target || current.startsWith(target + '/');
}

function DesktopNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active ? 'bg-cyan-500/10 text-cyan-200' : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-cyan-400"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
      <Icon className="h-4 w-4" aria-hidden />
      <span>{item.label}</span>
    </Link>
  );
}

function MobileNavItem({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
        active ? 'bg-cyan-500/10 text-cyan-200' : 'text-slate-300 hover:bg-white/[0.04]'
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span>{item.label}</span>
    </Link>
  );
}

function DemoModePill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Demo Mode
    </span>
  );
}

function DisclaimerStrip() {
  return (
    <div className="mt-auto rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[11px] leading-relaxed text-slate-400">
      <div className="mb-1 flex items-center gap-1.5 text-amber-300">
        <Info className="h-3 w-3" aria-hidden />
        <span className="font-semibold uppercase tracking-wider">Screening support only</span>
      </div>
      Not a diagnostic device. Does not replace a qualified healthcare professional.
    </div>
  );
}
