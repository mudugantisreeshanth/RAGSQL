import React, { useState } from 'react';
import { Database, FileCode, FileText, ChevronDown, ChevronUp, Sparkles, Target, HelpCircle } from 'lucide-react';
import { RetrievedContext } from '../../types';

interface RetrievedContextPanelProps {
  contexts?: RetrievedContext[];
}

export const RetrievedContextPanel: React.FC<RetrievedContextPanelProps> = ({ contexts = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!contexts || contexts.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 overflow-hidden my-3 shadow-sm">
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
            Retrieved Context & RAG Evidence ({contexts.length} sources)
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
            Avg Relevance: {Math.round(contexts.reduce((acc, c) => acc + c.relevanceScore, 0) / contexts.length * 100)}%
          </span>
        </div>

        <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="p-3 space-y-2.5 bg-white dark:bg-slate-950/80">
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Top cosine-similarity matches retrieved using fine-tuned <span className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">all-MiniLM-L6-v2</span> vector embeddings on BIRD benchmark schema tensors:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {contexts.map((ctx) => {
              const relevancePct = Math.round(ctx.relevanceScore * 100);
              const isSchema = ctx.type === 'schema';
              const isSql = ctx.type === 'sql_example';

              return (
                <div 
                  key={ctx.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800/90 bg-slate-50 dark:bg-slate-900/50 p-3 space-y-2 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {isSchema ? (
                        <Database className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      ) : isSql ? (
                        <FileCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{ctx.title}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-300">{relevancePct}%</span>
                    </div>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80 font-mono text-[11px] text-slate-800 dark:text-slate-300 overflow-x-auto">
                    {ctx.snippet}
                  </div>

                  <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 dark:text-slate-400 pt-0.5">
                    <HelpCircle className="w-3 h-3 text-indigo-500 dark:text-indigo-400 shrink-0" />
                    <span className="truncate">Why: {ctx.reason}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
