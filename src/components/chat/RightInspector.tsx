import React, { useState } from 'react';
import { 
  Database, 
  Activity, 
  Key, 
  Layers, 
  FileText, 
  X,
  Cpu
} from 'lucide-react';
import { DatabaseSchema, ChatMessage } from '../../types';

interface RightInspectorProps {
  database: DatabaseSchema;
  messages: ChatMessage[];
  onClose: () => void;
}

export const RightInspector: React.FC<RightInspectorProps> = ({
  database,
  messages,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'rag' | 'timeline'>('schema');
  const [selectedTableName, setSelectedTableName] = useState<string>(database.tables[0]?.name || '');

  const activeTable = database.tables.find(t => t.name === selectedTableName) || database.tables[0];
  const lastAiMessage = [...messages].reverse().find(m => m.role === 'assistant');

  return (
    <aside className="w-80 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800/80 flex flex-col h-full shrink-0 shadow-2xl z-10 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="font-bold text-xs text-slate-900 dark:text-white">RAGSQL Inspector</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 p-1.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-900 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('schema')}
          className={`py-1.5 px-2 rounded-lg font-medium text-[11px] transition-colors ${
            activeTab === 'schema' 
              ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-bold' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Schema
        </button>
        <button
          onClick={() => setActiveTab('rag')}
          className={`py-1.5 px-2 rounded-lg font-medium text-[11px] transition-colors ${
            activeTab === 'rag' 
              ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 font-bold' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          RAG Metrics
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`py-1.5 px-2 rounded-lg font-medium text-[11px] transition-colors ${
            activeTab === 'timeline' 
              ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-bold' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Timeline
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === 'schema' && (
          <div className="space-y-3">
            {/* Table selector */}
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Database Tables ({database.tables.length})
              </label>
              <select
                value={activeTable?.name}
                onChange={(e) => setSelectedTableName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-cyan-300 font-semibold focus:outline-none"
              >
                {database.tables.map(t => (
                  <option key={t.name} value={t.name}>
                    {t.name} ({t.rowCount} rows)
                  </option>
                ))}
              </select>
            </div>

            {activeTable && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-200 dark:border-slate-800/60">
                  "{activeTable.description}"
                </p>

                <div>
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-300 mb-2 flex items-center justify-between">
                    <span>Columns & Data Types</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{activeTable.columns.length} cols</span>
                  </p>

                  <div className="space-y-1.5">
                    {activeTable.columns.map((col) => (
                      <div key={col.name} className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {col.isPrimaryKey ? (
                              <span title="Primary Key"><Key className="w-3 h-3 text-amber-500" /></span>
                            ) : col.isForeignKey ? (
                              <span title="Foreign Key"><Layers className="w-3 h-3 text-indigo-500" /></span>
                            ) : (
                              <FileText className="w-3 h-3 text-slate-400" />
                            )}
                            <span className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-200">{col.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 font-bold">
                            {col.type}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400">{col.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rag' && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>RAGSQL Architecture</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Evaluates sentence transformer vector embeddings (<code className="text-cyan-600 dark:text-cyan-300">all-MiniLM-L6-v2</code>) on BIRD benchmark dataset.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-300">Retrieval Accuracy Metrics</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">NDCG@10 Score</p>
                  <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400 font-mono">93.02%</p>
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">★ Outperforms SOTA</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">HitRate@10</p>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono">96.80%</p>
                  <p className="text-[9px] text-indigo-600 dark:text-indigo-300 mt-0.5 font-semibold">Precision Retrieval</p>
                </div>
              </div>
            </div>

            {lastAiMessage?.retrievedContext && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-300">Current Vector Distances</p>
                <div className="space-y-1.5">
                  {lastAiMessage.retrievedContext.map((c) => (
                    <div key={c.id} className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/60 text-xs flex items-center justify-between">
                      <span className="truncate text-[11px] text-slate-800 dark:text-slate-300">{c.title}</span>
                      <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400">{Math.round(c.relevanceScore * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-300">Query Execution Trace</p>
            
            {lastAiMessage?.pipeline ? (
              <div className="space-y-2 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {lastAiMessage.pipeline.map((step) => (
                  <div key={step.id} className="pl-6 relative text-xs space-y-0.5">
                    <span className="absolute left-0 top-1 w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500 text-[9px] text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center">
                      ✓
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{step.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{step.timeMs}ms</span>
                    </div>
                    {step.details && (
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-mono leading-tight">{step.details}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No execution trace available for this query.</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
