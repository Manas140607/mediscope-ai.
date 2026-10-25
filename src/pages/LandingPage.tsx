import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  HeartPulse,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Workflow,
  Accessibility,
  WifiOff,
  Eye,
  Cpu,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';

export function LandingPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative -mx-4 -mt-6 overflow-hidden px-4 pb-16 pt-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <AnimatedBackground />
        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              AI-Assisted Screening · PHC Level
            </span>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
              MediScope <span className="text-cyan-400">AI</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 max-w-2xl text-lg text-slate-300 sm:text-xl"
            >
              Earlier Screening. Clearer Decisions. Better Access.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400"
            >
              An explainable screening-support tool for Primary Health Centres. Rural PHCs often
              lack specialist access, delaying identification of common conditions like hypertension.
              MediScope AI helps healthcare workers decide when repeat measurement or clinician review
              is appropriate — using basic vital signs and a transparent, configurable workflow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <Link to="/register" className="btn-primary">
                <Stethoscope className="h-4 w-4" aria-hidden />
                Start Screening
              </Link>
              <Link to="/dashboard" className="btn-secondary">
                <Activity className="h-4 w-4" aria-hidden />
                Explore Demo
              </Link>
              <Link to="/workflow" className="btn-ghost">
                <Workflow className="h-4 w-4" aria-hidden />
                How It Works
              </Link>
            </motion.div>

            <DemoBadge />
          </motion.div>

          {/* Animated pipeline illustration */}
          <PipelineIllustration />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl py-12">
        <SectionHeading
          eyebrow="How it works"
          title="A transparent screening pipeline"
          subtitle="Every stage is labelled and configurable. The healthcare worker always retains responsibility for clinical decisions."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_STEPS.map((s, i) => (
            <FeatureCard key={s.title} {...s} index={i} />
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl py-12">
        <SectionHeading
          eyebrow="Why it matters"
          title="Designed for the realities of rural PHCs"
          subtitle="Low-bandwidth, offline-capable demo mode, clear language, and a privacy-conscious default that never collects real patient identifiers."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BenefitCard icon={<WifiOff className="h-5 w-5" />} title="Low-bandwidth" text="Core demo runs locally without network access." />
          <BenefitCard icon={<Accessibility className="h-5 w-5" />} title="Accessible" text="Keyboard-friendly forms, strong contrast, labelled controls." />
          <BenefitCard icon={<Eye className="h-5 w-5" />} title="Explainable" text="Each screening flag shows the factors that contributed to it." />
          <BenefitCard icon={<ShieldAlert className="h-5 w-5" />} title="Honest" text="Demo mode is clearly labelled. No fabricated model metrics." />
        </div>
      </section>

      {/* Responsible AI */}
      <section className="mx-auto max-w-5xl py-12">
        <div className="glass-card overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-8">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Responsible AI
              </span>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                Screening support, not a diagnosis
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                MediScope AI is a screening decision-support prototype. It is not a diagnostic
                device and does not replace a qualified healthcare professional. Results depend on
                input quality and model limitations. Clinical decisions require appropriate
                professional assessment.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-400">
                <li className="flex gap-2"><Dot /> Deterministic demo logic, separated from any real model.</li>
                <li className="flex gap-2"><Dot /> No invented accuracy, sensitivity, or specificity.</li>
                <li className="flex gap-2"><Dot /> Repeat measurements are required before any flag is acted upon.</li>
              </ul>
            </div>
            <div className="relative min-h-[220px] border-t border-white/5 bg-navy-950/40 p-8 lg:border-l lg:border-t-0">
              <HeartbeatSVG />
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mx-auto max-w-5xl py-12 text-center">
        <h3 className="text-2xl font-semibold text-white">Try the screening workflow</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
          Load a synthetic demo patient, run the deterministic screening, and explore the
          explainability and flowchart.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="btn-primary">
            Start Screening <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/model" className="btn-secondary">
            <Cpu className="h-4 w-4" /> Model & Data
          </Link>
        </div>
      </section>
    </div>
  );
}

function DemoBadge() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="mt-6"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
        Demo Mode — synthetic data, deterministic logic, not clinically validated
      </span>
    </motion.div>
  );
}

function PipelineIllustration() {
  const stages = ['Vitals', 'Validate', 'Quality', 'Engine', 'Explain', 'Review'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.7 }}
      className="relative mt-12"
    >
      <div className="glass-card relative overflow-hidden p-6 sm:p-8">
        <div className="grid-bg absolute inset-0 opacity-20" aria-hidden />
        <div className="relative flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {stages.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.12 }}
                className="relative flex-1 rounded-xl border border-cyan-400/20 bg-navy-900/60 px-3 py-4 text-center"
              >
                <motion.div
                  className="absolute inset-x-2 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                />
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                  {label}
                </div>
              </motion.div>
              {i < stages.length - 1 && (
                <motion.div
                  className="hidden text-cyan-400/60 sm:block"
                  animate={{ x: [0, 4, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
                  aria-hidden
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
        <p className="relative mt-5 text-center text-xs text-slate-500">
          Simulated screening pipeline — clearly labelled as a demonstration.
        </p>
      </div>
    </motion.div>
  );
}

interface FeatureCardProps {
  title: string;
  text: string;
  icon: React.ReactNode;
  index: number;
}

function FeatureCard({ title, text, icon, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card p-5"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
    </motion.div>
  );
}

function BenefitCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="glass-panel p-5"
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-cyan-300">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{text}</p>
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">{eyebrow}</span>
      <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">{subtitle}</p>
    </motion.div>
  );
}

function Dot() {
  return <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden />;
}

function HeartbeatSVG() {
  return (
    <svg viewBox="0 0 400 120" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="hb" x1="0" x2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M0 60 L80 60 L100 60 L110 30 L130 90 L150 40 L170 60 L260 60 L280 30 L300 90 L320 40 L340 60 L400 60"
        fill="none"
        stroke="url(#hb)"
        strokeWidth="2.5"
        className="heartbeat-line"
      />
    </svg>
  );
}

const HOW_STEPS: FeatureCardProps[] = [
  {
    title: 'Patient registration',
    text: 'A non-identifying demo ID is generated. No real personal data is required for the demonstration.',
    icon: <Stethoscope className="h-5 w-5" />,
    index: 0,
  },
  {
    title: 'Vitals entry',
    text: 'Blood pressure, pulse, and optional repeat readings with clear unit labels and validation.',
    icon: <HeartPulse className="h-5 w-5" />,
    index: 1,
  },
  {
    title: 'Quality checks',
    text: 'Implausible values and single-reading advisories are flagged before any result is produced.',
    icon: <ShieldAlert className="h-5 w-5" />,
    index: 2,
  },
  {
    title: 'Transparent engine',
    text: 'Deterministic, evidence-based BP categories. A clean interface lets a real model replace demo logic.',
    icon: <Cpu className="h-5 w-5" />,
    index: 3,
  },
  {
    title: 'Explainable result',
    text: 'Each factor that contributed to the screening flag is shown alongside the recommendation.',
    icon: <Eye className="h-5 w-5" />,
    index: 4,
  },
  {
    title: 'Healthcare-worker review',
    text: 'The worker confirms, repeats the measurement, or refers — retaining full clinical responsibility.',
    icon: <Activity className="h-5 w-5" />,
    index: 5,
  },
];
