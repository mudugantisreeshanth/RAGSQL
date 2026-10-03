import React from 'react';
import { HelpCircle, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface ExplainSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
  sql: string;
  explanations?: string[];
}

export const ExplainSqlModal: React.FC<ExplainSqlModalProps> = ({
  isOpen,
  onClose,
  sql,
  explanations = []
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Query Logic Explanation</h3>
              <p className="text-[11px] text-slate-400">Step-by-step ANSI SQL semantic parsing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Original SQL snippet */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs text-cyan-300">
          {sql}
        </div>

        {/* Step-by-Step Explanation List */}
        <div className="space-y-3 py-1">
          <p className="text-xs font-semibold text-slate-300">Execution Steps:</p>
          {explanations.length > 0 ? (
            explanations.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-slate-950/60 rounded-xl p-3 border border-slate-800/60">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{step}</p>
              </div>
            ))
          ) : (
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Filters records based on requested criteria and constraints.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Groups dataset by primary relational attributes.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Calculates financial aggregations and ranks output.</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
