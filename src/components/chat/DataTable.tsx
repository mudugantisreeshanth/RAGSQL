import React, { useState, useMemo } from 'react';
import { 
  Table as TableIcon, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  Copy, 
  Check, 
  Eye, 
  FileSpreadsheet,
  FileJson
} from 'lucide-react';
import { QueryResultTable } from '../../types';

interface DataTableProps {
  data: QueryResultTable;
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const { columns, rows } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [copiedCellIndex, setCopiedCellIndex] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    columns.forEach(c => initial[c] = true);
    return initial;
  });
  const [showColumnPicker, setShowColumnPicker] = useState(false);

  // Filter rows by search term
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(term)
      )
    );
  }, [rows, searchTerm]);

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sortColumn) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      const strA = String(valA || '');
      const strB = String(valB || '');
      return sortDirection === 'asc' 
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [filteredRows, sortColumn, sortDirection]);

  // Paginated rows
  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  const handleCopyCell = (val: any, cellKey: string) => {
    navigator.clipboard.writeText(String(val));
    setCopiedCellIndex(cellKey);
    setTimeout(() => setCopiedCellIndex(null), 1500);
  };

  const exportCSV = () => {
    const activeCols = columns.filter(c => visibleColumns[c] !== false);
    const header = activeCols.join(',');
    const body = sortedRows.map(r => activeCols.map(c => `"${r[c] ?? ''}"`).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${header}\n${body}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ragsql_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const jsonStr = JSON.stringify(sortedRows, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ragsql_results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!columns || columns.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden my-3 shadow-sm">
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <TableIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-300">Query Results ({rows.length} records)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs rounded-lg pl-7 pr-2 py-1 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 w-36 sm:w-44"
            />
          </div>

          {/* Columns Toggle Menu */}
          <div className="relative">
            <button
              onClick={() => setShowColumnPicker(!showColumnPicker)}
              className="p-1 rounded-md bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              title="Toggle Columns"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {showColumnPicker && (
              <div className="absolute right-0 top-7 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-2xl z-20 space-y-1">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 py-1">Toggle Columns</p>
                {columns.map(c => (
                  <label key={c} className="flex items-center gap-2 px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns[c] !== false}
                      onChange={(e) => setVisibleColumns({ ...visibleColumns, [c]: e.target.checked })}
                      className="rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-cyan-500"
                    />
                    <span className="truncate">{c}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Export Buttons */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors text-[11px]"
            title="Export CSV"
          >
            <FileSpreadsheet className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={exportJSON}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors text-[11px]"
            title="Export JSON"
          >
            <FileJson className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">JSON</span>
          </button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
              {columns.filter(c => visibleColumns[c] !== false).map(col => (
                <th 
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{col}</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortColumn === col ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-600'}`} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50 text-slate-800 dark:text-slate-200">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  {columns.filter(c => visibleColumns[c] !== false).map((col, cIdx) => {
                    const cellVal = row[col];
                    const cellKey = `${rIdx}-${col}`;
                    const isCopied = copiedCellIndex === cellKey;

                    return (
                      <td 
                        key={cIdx} 
                        className="px-4 py-2 relative group font-mono text-[11.5px]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={typeof cellVal === 'number' ? 'text-cyan-700 dark:text-cyan-300 font-semibold' : ''}>
                            {cellVal !== undefined && cellVal !== null ? String(cellVal) : '-'}
                          </span>
                          <button
                            onClick={() => handleCopyCell(cellVal, cellKey)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-opacity"
                            title="Copy cell value"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-500 italic">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400">
        <div>
          Showing {paginatedRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, sortedRows.length)} of {sortedRows.length} entries
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1 py-0.5 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-slate-800 dark:text-slate-300 font-semibold">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
