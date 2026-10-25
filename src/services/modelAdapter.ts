// Model adapter — the integration boundary between the demo screening
// engine and a real trained model. The app calls runModel() here; if no
// real model is configured, it falls back to the deterministic demo engine.
//
// To plug in a real model:
//   1. Implement a server-side inference endpoint (never ship weights/keys
//      to the browser).
//   2. Set VITE_MODEL_ENDPOINT and (server-side) the auth credentials.
//   3. Replace `realModelInference` with a fetch call to your endpoint that
//      returns the same ScreeningResult shape.
//
// NEVER fabricate model accuracy or claim clinical validation.

import type { ModelMode, ScreeningResult } from '@/types';
import type { ScreeningInput } from './screeningEngine';
import { runScreening } from './screeningEngine';

const MODEL_ENDPOINT = import.meta.env.VITE_MODEL_ENDPOINT as string | undefined;

export function getModelMode(): ModelMode {
  if (MODEL_ENDPOINT && MODEL_ENDPOINT.length > 0) {
    // A real endpoint is configured. The app will attempt live inference
    // and fall back to demo on error. Mode is reported as 'real' only when
    // a call actually succeeds; see runModel below.
    return 'real';
  }
  return 'demo';
}

export async function realModelInference(input: ScreeningInput): Promise<ScreeningResult | null> {
  if (!MODEL_ENDPOINT) return null;
  try {
    const res = await fetch(MODEL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ScreeningResult;
    return data;
  } catch {
    return null;
  }
}

export async function runModel(input: ScreeningInput): Promise<ScreeningResult> {
  const mode = getModelMode();
  if (mode === 'real') {
    const real = await realModelInference(input);
    if (real) return real;
    // Transparent fallback — never silently pretend the real model ran.
    const demoResult = runScreening(input, { mode: 'demo' });
    demoResult.recommendation =
      'Live model inference was unavailable — this result was produced by the transparent demo engine. ' +
      demoResult.recommendation;
    return demoResult;
  }
  // Default: deterministic demo engine, clearly labelled.
  return runScreening(input, { mode: 'demo' });
}
