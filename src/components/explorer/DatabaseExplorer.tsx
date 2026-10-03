import React, { useState } from 'react';
import { Database, Table as TableIcon, Layers, Key, FileText, Search, Grid, Eye } from 'lucide-react';
import { DatabaseSchema, TableSchema } from '../../types';

interface DatabaseExplorerProps {
  databases: DatabaseSchema[];
  activeDatabaseId: string;
  onSelectDatabase: (id: string) => void;
}

export const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({
  databases,
  activeDatabaseId,
  onSelectDatabase
}) => {
  const activeDb = databases.find(d => d.id === activeDatabaseId) || databases[0];
  const [selectedTableName, setSelectedTableName] = useState<string>(activeDb.tables[0]?.name || '');
  const [searchTerm, setSearchTerm] = useState('');

  const activeTable = activeDb.tables.find(t => t.name === selectedTableName) || activeDb.tables[0];

  const filteredTables = activeDb.tables.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Database & Schema Explorer</h2>
            <p className="text-xs text-slate-400">Inspect relational schemas, data types, and sample records</p>
          </div>
        </div>

        {/* Database Selector */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
          <span className="text-slate-400">Database:</span>
          <select
            value={activeDb.id}
            onChange={(e) => {
              onSelectDatabase(e.target.value);
              const target = databases.find(d => d.id === e.target.value);
              if (target && target.tables[0]) setSelectedTableName(target.tables[0].name);
            }}
            className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
          >
            {databases.map(d => (
              <option key={d.id} value={d.id} className="bg-slate-900 text-slate-200">
                {d.name} ({d.totalTables} tables)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Table Nav */}
        <div className="w-full md:w-64 border-r border-slate-800 bg-slate-950/80 p-3 space-y-3 overflow-y-auto shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 px-2">
              Tables ({filteredTables.length})
            </p>
            {filteredTables.map(t => {
              const isSelected = t.name === activeTable?.name;
              return (
                <button
                  key={t.name}
                  onClick={() => setSelectedTableName(t.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <TableIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{t.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{t.rowCount} rows</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Schema & Sample Data Area */}
        {activeTable && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950">
            {/* Table Overview Header */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TableIcon className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white font-mono">{activeTable.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">{activeTable.columns.length} Columns</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">{activeTable.rowCount} Total Rows</span>
                </div>
              </div>
              <p className="text-xs text-slate-300">{activeTable.description}</p>
            </div>

            {/* Column Schema Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Column Schema Dictionary</span>
              </h4>

              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/40">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                      <th className="px-4 py-2.5">Column</th>
                      <th className="px-4 py-2.5">Data Type</th>
                      <th className="px-4 py-2.5">Key Type</th>
                      <th className="px-4 py-2.5">Description</th>
                      <th className="px-4 py-2.5">Sample Values</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {activeTable.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-slate-900/60 transition-colors">
                        <td className="px-4 py-2.5 font-mono font-bold text-cyan-300">{col.name}</td>
                        <td className="px-4 py-2.5 font-mono text-indigo-300">{col.type}</td>
                        <td className="px-4 py-2.5">
                          {col.isPrimaryKey ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              <Key className="w-3 h-3" /> PK
                            </span>
                          ) : col.isForeignKey ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                              <Layers className="w-3 h-3" /> FK ({col.references})
                            </span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-slate-300">{col.description}</td>
                        <td className="px-4 py-2.5 font-mono text-slate-400">
                          {col.sampleValues.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sample Data Preview Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Grid className="w-4 h-4 text-indigo-400" />
                <span>Live Sample Records ({activeTable.sampleData.length} preview rows)</span>
              </h4>

              <div className="rounded-xl border border-slate-800 overflow-x-auto bg-slate-950">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold">
                      {activeTable.columns.map(c => (
                        <th key={c.name} className="px-4 py-2.5 font-mono text-cyan-300">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-200">
                    {activeTable.sampleData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        {activeTable.columns.map(c => (
                          <td key={c.name} className="px-4 py-2 font-mono text-[11.5px]">
                            {String(row[c.name] ?? '-')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
