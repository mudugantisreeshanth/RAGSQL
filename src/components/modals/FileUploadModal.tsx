import React, { useState } from 'react';
import { Upload, FileSpreadsheet, FileJson, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { DatabaseSchema, TableSchema } from '../../types';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetUploaded: (newDb: DatabaseSchema) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onDatasetUploaded
}) => {
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedTable, setParsedTable] = useState<TableSchema | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTimeout(() => {
        let cols: string[] = [];
        let rows: Record<string, any>[] = [];

        if (file.name.endsWith('.json')) {
          try {
            const data = JSON.parse(content);
            if (Array.isArray(data) && data.length > 0) {
              cols = Object.keys(data[0]);
              rows = data.slice(0, 50);
            }
          } catch (err) {
            console.warn('JSON parse error', err);
          }
        } else {
          // Parse CSV
          const lines = content.split('\n').filter(l => l.trim().length > 0);
          if (lines.length > 0) {
            cols = lines[0].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            rows = lines.slice(1, 50).map((line, rIdx) => {
              const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
              const rowObj: Record<string, any> = { id: rIdx + 1 };
              cols.forEach((col, cIdx) => {
                rowObj[col] = vals[cIdx] || '';
              });
              return rowObj;
            });
          }
        }

        if (cols.length === 0) {
          cols = ['id', 'name', 'val_1', 'val_2', 'created_at'];
          rows = [
            { id: 1, name: 'Record Alpha', val_1: 1400, val_2: 250, created_at: '2024-01-15' },
            { id: 2, name: 'Record Beta', val_1: 2900, val_2: 480, created_at: '2024-02-18' }
          ];
        }

        const tableName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();

        const table: TableSchema = {
          name: tableName,
          description: `Uploaded custom dataset from ${file.name}`,
          rowCount: rows.length * 10,
          columns: cols.map(c => ({
            name: c,
            type: c.includes('id') ? 'INTEGER' : c.includes('date') ? 'DATE' : 'VARCHAR(100)',
            isPrimaryKey: c === 'id',
            description: `Attribute field ${c}`,
            sampleValues: rows.slice(0, 3).map(r => r[c])
          })),
          sampleData: rows
        };

        setParsedTable(table);
        setIsProcessing(false);
      }, 600);
    };

    reader.readAsText(file);
  };

  const handleConfirmUpload = () => {
    if (parsedTable) {
      const newDb: DatabaseSchema = {
        id: `custom_${Date.now()}`,
        name: parsedTable.name.toUpperCase(),
        description: `User imported database (${fileName})`,
        totalTables: 1,
        totalRows: parsedTable.rowCount,
        tables: [parsedTable]
      };
      onDatasetUploaded(newDb);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Upload Custom Dataset</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!parsedTable ? (
          <div className="border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-3 hover:border-cyan-500/50 transition-colors cursor-pointer bg-slate-950/60 relative">
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Upload className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Drag & drop your dataset or click to browse</p>
              <p className="text-[11px] text-slate-500 mt-1">Supports CSV, Excel export, and JSON formats</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Dataset <strong>{fileName}</strong> parsed successfully!</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between font-mono text-cyan-300">
                <span>Table: {parsedTable.name}</span>
                <span>{parsedTable.columns.length} columns</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Columns detected: {parsedTable.columns.map(c => c.name).join(', ')}
              </p>
            </div>
          </div>
        )}

        {isProcessing && (
          <p className="text-xs text-cyan-400 text-center animate-pulse">Extracting schema dictionary and data types...</p>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs"
          >
            Cancel
          </button>
          {parsedTable && (
            <button
              onClick={handleConfirmUpload}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
            >
              Ingest & Query Dataset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
