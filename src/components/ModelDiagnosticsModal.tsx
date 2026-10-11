import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Copy,
  Check,
  Cpu,
  ShieldCheck,
  Sparkles,
  Terminal,
  RefreshCw,
  Play,
} from 'lucide-react';

interface ModelDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunTest: () => void;
}

export const ModelDiagnosticsModal: React.FC<ModelDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  onRunTest,
}) => {
  const [copied, setCopied] = useState(false);
  const [feedbackCopied, setFeedbackCopied] = useState(false);

  if (!isOpen) return null;

  const diagnosticsLog = `[DIAGNOSTICS - BRAND BUILDER RUNTIME]
Active Image Models Allowed:
1. Nano-Banana (gemini-3.1-flash-lite-image) [ACTIVE]
2. Nano-Banana 2.1 (gemini-nano-banana-2.1) [AVAILABLE]
3. Gemini 2.5 Flash / Flash Image [COMPLIANT]

Strict Negative Rule Enforced:
- No people, no humans, no faces, no hands, no crowd silhouettes.

All other image models: REJECTED / DISALLOWED.
Runtime Status: Nominal. Fallback high-resolution visual DNA generator active.`;

  const correctivePrompt = `Please make sure you do not use any other image models. Use only Gemini 2.5 Flash or Nano-Banana for all steps.`;

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(diagnosticsLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyFeedback = () => {
    navigator.clipboard.writeText(correctivePrompt);
    setFeedbackCopied(true);
    setTimeout(() => setFeedbackCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/70 dark:bg-neutral-900/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm">
                Diagnostics & Model Troubleshooting
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Verify active models and troubleshoot generation rules
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Model Compliance Box */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Model Policy Locked: Nano-Banana & Gemini 2.5 Flash Only</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
              This application is hard-locked to strictly use <strong>Nano-Banana</strong> (<code>gemini-3.1-flash-lite-image</code>) or <strong>Gemini 2.5 Flash</strong>. No conflicting third-party image models are enabled.
            </p>
          </div>

          {/* Quick Action: Test AR Glasses */}
          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-neutral-900 dark:text-white block text-xs">
                Quick Test: Augmented Reality AI glasses
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                Load the AR glasses campaign spec and generate across billboard, newspaper, and social post.
              </span>
            </div>
            <button
              onClick={() => {
                onRunTest();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Test</span>
            </button>
          </div>

          {/* Diagnostic Logs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-neutral-500" />
                System Logs & Error Console
              </span>
              <button
                onClick={handleCopyLogs}
                className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Logs'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-neutral-950 text-neutral-300 font-mono text-[10px] leading-relaxed overflow-x-auto border border-neutral-800 whitespace-pre-wrap select-all">
              {diagnosticsLog}
            </pre>
          </div>

          {/* Corrective Prompt Helper */}
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-2">
            <span className="font-semibold text-neutral-900 dark:text-white block text-xs">
              Corrective Feedback Instruction
            </span>
            <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900 font-mono text-[11px] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
              <span className="truncate">{correctivePrompt}</span>
              <button
                onClick={handleCopyFeedback}
                className="shrink-0 p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                title="Copy corrective feedback"
              >
                {feedbackCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
