import React, { useState } from 'react';
import { Bookmark, Play, Copy, Check, Trash2, Tag, Search, Plus, Star } from 'lucide-react';
import { SavedQuery } from '../../types';

interface SavedQueriesViewProps {
  savedQueries: SavedQuery[];
  onRunQuery: (sql: string) => void;
  onDeleteQuery: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export const SavedQueriesView: React.FC<SavedQueriesViewProps> = ({
  savedQueries,
  onRunQuery,
  onDeleteQuery,
  onToggleStar
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredQueries = savedQueries.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopy = (sql: string, id: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Saved Query Library</h2>
            <p className="text-xs text-slate-400">Curated enterprise SQL queries and recurring analytical templates</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search saved queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQueries.length > 0 ? (
          filteredQueries.map((q) => (
            <div key={q.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleStar(q.id)}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-4 h-4 ${q.isStarred ? 'fill-amber-400' : ''}`} />
                    </button>
                    <h3 className="font-bold text-sm text-slate-100">{q.title}</h3>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">Executions: {q.executionCount}</span>
                </div>

                <p className="text-xs text-slate-400">{q.description}</p>

                {/* SQL Box */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                  <pre><code>{q.sql}</code></pre>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {q.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-[10px] text-slate-500 font-mono">Created {q.createdAt}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(q.sql, q.id)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                    title="Copy SQL"
                  >
                    {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onDeleteQuery(q.id)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400"
                    title="Delete saved query"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRunQuery(q.sql)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Run Query</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-slate-500 italic">
            No saved queries found.
          </div>
        )}
      </div>
    </div>
  );
};
