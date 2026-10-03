import React from 'react';
import { BarChart2, Activity, Clock, CheckCircle2, Target, TrendingUp, Layers } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const AnalyticsView: React.FC = () => {
  const queryVolumeData = [
    { time: '08:00', queries: 4 },
    { time: '10:00', queries: 12 },
    { time: '12:00', queries: 18 },
    { time: '14:00', queries: 28 },
    { time: '16:00', queries: 42 }
  ];

  const tableFrequencyData = [
    { table: 'sales', count: 24 },
    { table: 'employees', count: 14 },
    { table: 'customers', count: 11 },
    { table: 'products', count: 8 },
    { table: 'departments', count: 6 }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">RAGSQL Analytics Dashboard</h2>
            <p className="text-xs text-slate-400">Real-time system latency, retrieval precision, and dataset usage telemetry</p>
          </div>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Queries Today</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">42</p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% from yesterday
          </p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>SQL Execution Success</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">95.2%</p>
          <p className="text-[10px] text-slate-400">2 errors caught by AST validation</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Pipeline Latency</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 font-mono">0.78s</p>
          <p className="text-[10px] text-indigo-300">Fast Sentence-Transformer embedding</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Retrieval NDCG@10</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 font-mono">94.6%</p>
          <p className="text-[10px] text-cyan-300">Fine-tuned RAGSQL embedding</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Query Volume Trends Over Time</span>
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={queryVolumeData}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }} />
              <Area type="monotone" dataKey="queries" stroke="#06b6d4" fillOpacity={1} fill="url(#volGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Most Queried Schema Tables</span>
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tableFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="table" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
