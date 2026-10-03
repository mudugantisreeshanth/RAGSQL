import React, { useState } from 'react';
import { Copy, Check, Play, HelpCircle, Code, Edit2, Download } from 'lucide-react';

interface SqlCodeBlockProps {
  sql: string;
  onExplainSql?: () => void;
  onRunCustomSql?: (editedSql: string) => void;
}

export const SqlCodeBlock: React.FC<SqlCodeBlockProps> = ({
  sql,
  onExplainSql,
  onRunCustomSql
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSql, setEditedSql] = useState(sql);

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editedSql : sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    if (onRunCustomSql) {
      onRunCustomSql(editedSql);
      setIsEditing(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden my-3 shadow-lg">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <Code className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[11px] font-semibold text-slate-300">Generated ANSI SQL</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onExplainSql && (
            <button
              onClick={onExplainSql}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/80 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors text-[11px]"
              title="Explain query step-by-step"
            >
              <HelpCircle className="w-3 h-3 text-cyan-400" />
              <span>Explain SQL</span>
            </button>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors ${
              isEditing 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Edit SQL Query"
          >
            <Edit2 className="w-3 h-3" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit SQL'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-[11px]"
            title="Copy SQL to Clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1 rounded-md bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
            title="Download .sql file"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Code Editor or Highlighting Area */}
      {isEditing ? (
        <div className="p-3 bg-slate-950 space-y-2">
          <textarea
            value={editedSql}
            onChange={(e) => setEditedSql(e.target.value)}
            className="w-full h-28 bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Run Modified Query</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-950/90 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
          <pre className="text-cyan-300 selection:bg-cyan-500/30">
            <code>{sql}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
