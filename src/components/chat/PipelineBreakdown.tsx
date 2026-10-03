import React, { useState } from 'react';
import { CheckCircle2, Clock, ChevronDown, ChevronUp, Workflow } from 'lucide-react';
import { PipelineStep } from '../../types';

interface PipelineBreakdownProps {
  pipeline?: PipelineStep[];
  totalTimeMs?: number;
}

export const PipelineBreakdown: React.FC<PipelineBreakdownProps> = ({
  pipeline = [],
  totalTimeMs = 780
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!pipeline || pipeline.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 overflow-hidden my-2">
      {/* Header Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-900/60 cursor-pointer select-none text-xs"
      >
        <div className="flex items-center gap-2">
          <Workflow className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-300">How RAGSQL Reasoned</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">({pipeline.length} stages)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            <Clock className="w-3 h-3" />
            <span>{totalTimeMs}ms</span>
          </div>
          <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Pipeline Flow */}
      {isOpen && (
        <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 space-y-2 text-xs">
          <div className="space-y-1.5">
            {pipeline.map((step) => (
              <div key={step.id} className="flex items-start justify-between gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60">
                <div className="flex items-start gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-200 text-xs">{step.name}</p>
                    {step.details && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{step.details}</p>
                    )}
                  </div>
                </div>

                {step.timeMs && (
                  <span className="text-[10.5px] font-mono font-medium text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 shrink-0">
                    {step.timeMs}ms
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-900 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400">
            <span>Model: fine-tuned RAGSQL-text (23M params)</span>
            <span>Benchmark: BIRD dev set</span>
          </div>
        </div>
      )}
    </div>
  );
};
