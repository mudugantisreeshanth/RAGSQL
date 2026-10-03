import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { BarChart2, TrendingUp, PieChart as PieIcon, Maximize2, Layers, X } from 'lucide-react';
import { ChartConfig, QueryResultTable } from '../../types';

interface VisualizationChartProps {
  chartConfig?: ChartConfig;
  tableData?: QueryResultTable;
}

const COLOR_PALETTE = ['#06b6d4', '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const VisualizationChart: React.FC<VisualizationChartProps> = ({ chartConfig, tableData }) => {
  if (!chartConfig || !tableData || !tableData.rows || tableData.rows.length === 0) return null;

  const [currentChartType, setCurrentChartType] = useState<ChartConfig['type']>(chartConfig.type || 'bar');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Format data for recharts
  const formattedData = tableData.rows.map((row) => {
    const formattedRow: Record<string, any> = { ...row };
    Object.keys(row).forEach((key) => {
      const val = row[key];
      if (typeof val === 'string') {
        // Strip $ or % or M if parsing numerical string
        const cleaned = val.replace(/[\$,%M]/g, '').trim();
        const num = parseFloat(cleaned);
        if (!isNaN(num) && (val.includes('$') || val.includes('%') || val.includes('M'))) {
          formattedRow[`${key}_num`] = num;
        }
      }
    });
    return formattedRow;
  });

  const xAxisKey = chartConfig.xAxisKey || tableData.columns[0];
  const yAxisKey = chartConfig.yAxisKey || tableData.columns[1] || tableData.columns[0];
  // Determine numerical key for chart
  const activeYKey = formattedData[0][`${yAxisKey}_num`] !== undefined ? `${yAxisKey}_num` : yAxisKey;

  const renderChartBody = () => {
    switch (currentChartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
              <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }} 
              />
              <Line type="monotone" dataKey={activeYKey} stroke="#06b6d4" strokeWidth={3} dot={{ r: 5, fill: '#06b6d4' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
              <Pie
                data={formattedData}
                dataKey={activeYKey}
                nameKey={xAxisKey}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={currentChartType === 'donut' ? 60 : 0}
                paddingAngle={4}
                label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {formattedData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formattedData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
              <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }} 
              />
              <Area type="monotone" dataKey={activeYKey} stroke="#06b6d4" fillOpacity={1} fill="url(#areaGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
              <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }} 
              />
              <Bar dataKey={activeYKey} fill="#06b6d4" radius={[6, 6, 0, 0]}>
                {formattedData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden my-3 shadow-sm">
        {/* Toolbar Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-300">{chartConfig.title || 'Data Analytics Visualization'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Chart Type Switches */}
            <div className="flex items-center bg-white dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setCurrentChartType('bar')}
                className={`p-1 rounded text-[11px] transition-colors ${currentChartType === 'bar' ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                title="Bar Chart"
              >
                <BarChart2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentChartType('line')}
                className={`p-1 rounded text-[11px] transition-colors ${currentChartType === 'line' ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                title="Line Chart"
              >
                <TrendingUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentChartType('pie')}
                className={`p-1 rounded text-[11px] transition-colors ${currentChartType === 'pie' ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                title="Pie Chart"
              >
                <PieIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentChartType('area')}
                className={`p-1 rounded text-[11px] transition-colors ${currentChartType === 'area' ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                title="Area Chart"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1 rounded bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Fullscreen Chart"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="p-4 bg-white dark:bg-slate-950/80 flex items-center justify-center">
          {renderChartBody()}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                {chartConfig.title}
              </h3>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4">
              {renderChartBody()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
