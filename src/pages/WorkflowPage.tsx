import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnConnect,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Eye,
  FlaskConical,
  HeartPulse,
  RotateCcw,
  ShieldCheck,
  Stethoscope,
  Workflow,
  XCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { WorkflowNode, type WorkflowNodeData } from '@/components/flowchart/WorkflowNode';
import { useToastContext } from '@/hooks/useToastContext';

interface FlowNodeData extends WorkflowNodeData {}

const NODE_TYPES = { workflow: WorkflowNode };

// Stage order for "Run Demo Workflow" progression.
const MAIN_PATH = [
  'register',
  'vitals',
  'validate',
  'quality',
  'process',
  'engine',
  'explain',
  'review',
  'save',
];

const initialNodes: Node<FlowNodeData>[] = [
  {
    id: 'register',
    type: 'workflow',
    position: { x: 320, y: 0 },
    data: {
      label: 'Patient Registration',
      description: 'A non-identifying demo patient ID is generated. No real personal data is collected.',
      icon: Stethoscope,
      type: 'start',
    },
  },
  {
    id: 'vitals',
    type: 'workflow',
    position: { x: 320, y: 110 },
    data: {
      label: 'Vitals Data Entry',
      description: 'Blood pressure, pulse, and optional repeat readings are entered with validation.',
      icon: HeartPulse,
      type: 'process',
    },
  },
  {
    id: 'validate',
    type: 'workflow',
    position: { x: 320, y: 220 },
    data: {
      label: 'Input Validation',
      description: 'Required fields and value ranges are checked before processing continues.',
      icon: ShieldCheck,
      type: 'decision',
    },
  },
  {
    id: 'quality',
    type: 'workflow',
    position: { x: 320, y: 330 },
    data: {
      label: 'Measurement Quality Check',
      description: 'Implausible values and single-reading advisories are flagged.',
      icon: AlertTriangle,
      type: 'decision',
    },
  },
  {
    id: 'process',
    type: 'workflow',
    position: { x: 320, y: 440 },
    data: {
      label: 'Data Processing',
      description: 'Inputs are normalized and effective (averaged) values are computed.',
      icon: Cpu,
      type: 'process',
    },
  },
  {
    id: 'engine',
    type: 'workflow',
    position: { x: 320, y: 550 },
    data: {
      label: 'Screening Model / Demo Engine',
      description: 'Deterministic, evidence-based BP categories. Clearly labelled Demo Mode. A real model can replace this stage via the model adapter.',
      icon: FlaskConical,
      type: 'process',
    },
  },
  {
    id: 'explain',
    type: 'workflow',
    position: { x: 320, y: 660 },
    data: {
      label: 'Explainable Result',
      description: 'Each factor that contributed to the screening flag is shown alongside the recommendation.',
      icon: Eye,
      type: 'process',
    },
  },
  {
    id: 'review',
    type: 'workflow',
    position: { x: 320, y: 770 },
    data: {
      label: 'Healthcare Worker Review',
      description: 'The worker confirms, repeats the measurement, or refers. They retain full clinical responsibility.',
      icon: Activity,
      type: 'decision',
    },
  },
  {
    id: 'save',
    type: 'workflow',
    position: { x: 320, y: 880 },
    data: {
      label: 'Save Screening Record',
      description: 'The record is stored in the local demonstration history (or configured database).',
      icon: CheckCircle2,
      type: 'end',
    },
  },
  // Branch: invalid inputs
  {
    id: 'correct',
    type: 'workflow',
    position: { x: 40, y: 220 },
    data: {
      label: 'Correct Invalid Inputs',
      description: 'Missing or out-of-range fields must be fixed before the pipeline continues.',
      icon: XCircle,
      type: 'branch',
    },
  },
  // Branch: implausible / single reading
  {
    id: 'remeasure',
    type: 'workflow',
    position: { x: 600, y: 330 },
    data: {
      label: 'Repeat Measurement',
      description: 'Remeasure the indicated values before producing a screening result.',
      icon: RotateCcw,
      type: 'branch',
    },
  },
  // Branch: insufficient evidence
  {
    id: 'insufficient',
    type: 'workflow',
    position: { x: 600, y: 550 },
    data: {
      label: 'Insufficient Evidence',
      description: 'Request remeasurement or clinician review before acting on a result.',
      icon: AlertTriangle,
      type: 'branch',
    },
  },
  // Branch: referral review
  {
    id: 'referral',
    type: 'workflow',
    position: { x: 600, y: 770 },
    data: {
      label: 'Referral Review',
      description: 'Arrange specialist or clinician review per local protocol when the screening flag suggests it.',
      icon: Stethoscope,
      type: 'branch',
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'register', target: 'vitals', animated: false },
  { id: 'e2', source: 'vitals', target: 'validate', animated: false },
  { id: 'e3', source: 'validate', target: 'quality', animated: false, label: 'valid' },
  { id: 'e4', source: 'quality', target: 'process', animated: false, label: 'plausible' },
  { id: 'e5', source: 'process', target: 'engine', animated: false },
  { id: 'e6', source: 'engine', target: 'explain', animated: false },
  { id: 'e7', source: 'explain', target: 'review', animated: false },
  { id: 'e8', source: 'review', target: 'save', animated: false, label: 'confirmed' },
  // branch edges
  { id: 'b1', source: 'validate', target: 'correct', animated: false, label: 'invalid', style: { stroke: '#f43f5e' } },
  { id: 'b2', source: 'correct', target: 'vitals', animated: false, style: { stroke: '#f43f5e' } },
  { id: 'b3', source: 'quality', target: 'remeasure', animated: false, label: 'implausible', style: { stroke: '#fbbf24' } },
  { id: 'b4', source: 'remeasure', target: 'quality', animated: false, style: { stroke: '#fbbf24' } },
  { id: 'b5', source: 'engine', target: 'insufficient', animated: false, label: 'low evidence', style: { stroke: '#fbbf24' } },
  { id: 'b6', source: 'insufficient', target: 'review', animated: false, style: { stroke: '#fbbf24' } },
  { id: 'b7', source: 'review', target: 'referral', animated: false, label: 'refer', style: { stroke: '#22d3ee' } },
  { id: 'b8', source: 'referral', target: 'save', animated: false, style: { stroke: '#22d3ee' } },
];

export function WorkflowPage() {
  return (
    <ReactFlowProvider>
      <WorkflowPageInner />
    </ReactFlowProvider>
  );
}

function WorkflowPageInner() {
  const { notify } = useToastContext();
  const [nodes, setNodes] = useState<Node<FlowNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<FlowNodeData> | null>(null);
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds) as Node<FlowNodeData>[]),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);

  const resetHighlights = useCallback(() => {
    setNodes((nds) =>
      nds.map((n) => ({ ...n, data: { ...n.data, active: false, done: false } })),
    );
    setEdges((eds) => eds.map((e) => ({ ...e, animated: false })));
  }, []);

  // Highlight a single node + the edge leading into the main path.
  const highlightStep = useCallback(
    (stepIndex: number) => {
      const stageId = MAIN_PATH[stepIndex];
      setNodes((nds) =>
        nds.map((n) => {
          const isCurrent = n.id === stageId;
          const isPast = MAIN_PATH.indexOf(n.id) < stepIndex && MAIN_PATH.includes(n.id);
          return {
            ...n,
            data: { ...n.data, active: isCurrent, done: isPast },
          };
        }),
      );
      // animate the incoming main-path edge for the current step
      const incomingEdgeId = [`e1`, `e2`, `e3`, `e4`, `e5`, `e6`, `e7`, `e8`][stepIndex];
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          animated: e.id === incomingEdgeId,
        })),
      );
    },
    [],
  );

  const runDemo = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setSelectedNode(null);
    resetHighlights();
    for (let i = 0; i < MAIN_PATH.length; i++) {
      setActiveStep(i);
      highlightStep(i);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 700));
    }
    setActiveStep(-1);
    setRunning(false);
    notify('Demo workflow complete. Each stage is labelled and deterministic.');
  }, [running, resetHighlights, highlightStep, notify]);

  const reset = useCallback(() => {
    resetHighlights();
    setActiveStep(-1);
    setSelectedNode(null);
    notify('Workflow diagram reset.');
  }, [resetHighlights, notify]);

  // Highlight the branch edges when their source decision node is active.
  const branchEdgeIds = useMemo(() => ['b1', 'b3', 'b5', 'b7'], []);
  useEffect(() => {
    if (activeStep < 0) return;
    const stageId = MAIN_PATH[activeStep];
    setEdges((eds) =>
      eds.map((e) => {
        if (branchEdgeIds.includes(e.id) && e.source === stageId) {
          return { ...e, animated: true };
        }
        return e;
      }),
    );
  }, [activeStep, branchEdgeIds]);

  const minimapColor = (node: Node) => {
    if (node.data?.active) return '#22d3ee';
    if (node.data?.done) return '#34d399';
    if (node.data?.type === 'branch' || node.data?.type === 'decision') return '#fbbf24';
    return '#1c2d5e';
  };

  return (
    <div>
      <PageHeader
        title="How MediScope AI Works"
        subtitle="An interactive screening pipeline with decision branches. The healthcare worker always retains clinical responsibility."
        icon={<Workflow className="h-5 w-5" />}
        action={
          <div className="flex gap-2">
            <button type="button" className="btn-ghost" onClick={reset} disabled={running}>
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <button type="button" className="btn-primary" onClick={runDemo} disabled={running}>
              {running ? 'Running…' : 'Run Demo Workflow'}
            </button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="glass-card relative h-[640px] overflow-hidden p-0 lg:col-span-3">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNode(node as Node<FlowNodeData>)}
            nodeTypes={NODE_TYPES}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.4}
            maxZoom={1.6}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1c2d5e" />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={minimapColor}
              maskColor="rgba(5,10,20,0.6)"
              style={{ background: '#0a1124', border: '1px solid rgba(255,255,255,0.05)' }}
            />
          </ReactFlow>
          <span className="pointer-events-none absolute left-4 top-3 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
            Simulated pipeline
          </span>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="mb-3 text-sm font-semibold text-white">Selected stage</h3>
            {selectedNode ? (
              <SelectedStageDetail node={selectedNode} />
            ) : (
              <p className="text-xs text-slate-500">
                Click any node to see a short description. Use the controls to zoom, pan, and fit the
                diagram to the screen.
              </p>
            )}
          </div>

          <div className="glass-card p-5">
            <h3 className="mb-3 text-sm font-semibold text-white">Branch legend</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Invalid inputs → correct & re-enter</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Implausible / single reading → repeat measurement</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Insufficient evidence → clinician review</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Review suggests referral → arrange specialist review</li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-[11px] leading-relaxed text-slate-400">
            The healthcare worker retains responsibility for all clinical decisions. This workflow is
            screening support, not a diagnostic pathway.
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectedStageDetail({ node }: { node: Node<FlowNodeData> }) {
  const Icon = node.data.icon;
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold text-white">{node.data.label}</span>
      </div>
      <p className="text-xs leading-relaxed text-slate-400">{node.data.description}</p>
      <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500">
        <span className="rounded-full bg-white/[0.04] px-2 py-0.5">{node.data.type}</span>
      </div>
    </div>
  );
}
