import React, { useState } from 'react';
import { BookOpen, Award, BarChart2, Cpu, CheckCircle2, FileText, ArrowUpRight, Zap, Target, ExternalLink } from 'lucide-react';
import { BENCHMARK_PAPER_METRICS } from '../../data/mockDatasets';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const ResearchPaperView: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'qEvdInDb' | 'qSqlInDb' | 'qEvdOutDb' | 'qSqlOutDb'>('qSqlInDb');

  const chartData = BENCHMARK_PAPER_METRICS.map(m => ({
    name: m.modelName,
    score: m[selectedMetric],
    isFineTuned: m.isFineTuned
  }));

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto p-4 sm:p-8 space-y-8">
      {/* Hero Paper Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen className="w-64 h-64 text-cyan-400" />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold text-xs flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>IEEE 2024 IS Conference Paper</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold text-xs">
              BIRD Benchmark Evaluation
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            RAGSQL: context retrieval evaluation on augmenting text-to-SQL prompts
          </h1>

          <p className="text-xs sm:text-sm text-slate-300">
            <strong>Authors:</strong> Sergey Vichev (Sofia University) & Angel Marchev, Jr. (University of National and World Economy)
          </p>
        </div>

        {/* Abstract quote box */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
          <p className="font-bold text-white flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-400" />
            Paper Abstract Overview:
          </p>
          <p>
            "A gained popularity method to improve LLM outputs is through giving relevant context about the database and organizational data as few-shot prompting. Recent research showcases that better results in text-to-SQL tasks can be achieved in a Retrieval Augmented Generation (RAG) setting by augmenting prompt context dynamically during LLM inference. In this paper we adapt data from the BIRD benchmark (over 10,000 examples) and fine-tune an open-source sentence transformer model that outperforms state-of-the-art (SOTA) embedding models on both question-to-evidence and question-to-SQL retrieval experiments."
          </p>
        </div>
      </div>

      {/* Core Contributions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Large-Prompt Limitation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Solves the "needle-in-a-haystack" problem where passing entire schemas degrades LLM reasoning and increases query latency.
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Sentence-BERT Fine-Tuning</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fine-tuned compact model (<code className="text-cyan-300">all-MiniLM-L6-v2</code> - 23M parameters) using MultipleNegativesRankingLoss on NVIDIA T4 GPU.
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Outperforms SOTA APIs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            RAGSQL-code achieves <strong>93.02% NDCG@10</strong> score, outperforming OpenAI-3-large (87.85%) and Cohere-eng-v3 (67.49%).
          </p>
        </div>
      </div>

      {/* Interactive Benchmark Comparison Table */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              <span>BIRD Benchmark Retrieval Performance (NDCG@10)</span>
            </h2>
            <p className="text-xs text-slate-400">Direct empirical results from Table III and Table IV of the research paper</p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedMetric('qSqlInDb')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${selectedMetric === 'qSqlInDb' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Q-SQL (In-DB)
            </button>
            <button
              onClick={() => setSelectedMetric('qEvdInDb')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${selectedMetric === 'qEvdInDb' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Q-Evidence (In-DB)
            </button>
            <button
              onClick={() => setSelectedMetric('qSqlOutDb')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${selectedMetric === 'qSqlOutDb' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Q-SQL (Out-of-DB)
            </button>
          </div>
        </div>

        {/* Visual Recharts Bar Chart */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
              <YAxis domain={[40, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }} />
              <Bar dataKey="score" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Full Empirical Metric Table */}
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="px-4 py-3">Embedding Model</th>
                <th className="px-4 py-3">Size (Params)</th>
                <th className="px-4 py-3">Emb Dim</th>
                <th className="px-4 py-3">MTEB Bench</th>
                <th className="px-4 py-3 text-cyan-300">Q-EVD (In-DB)</th>
                <th className="px-4 py-3 text-cyan-300">Q-EVD (Out-DB)</th>
                <th className="px-4 py-3 text-indigo-300">Q-SQL (In-DB)</th>
                <th className="px-4 py-3 text-indigo-300">Q-SQL (Out-DB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11.5px]">
              {BENCHMARK_PAPER_METRICS.map((row) => (
                <tr 
                  key={row.modelName}
                  className={`hover:bg-slate-900/80 transition-colors ${
                    row.isFineTuned ? 'bg-cyan-500/10 font-bold text-white' : 'text-slate-300'
                  }`}
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    {row.isFineTuned && <span className="text-amber-400">★</span>}
                    <span>{row.modelName}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{row.size}</td>
                  <td className="px-4 py-3 text-slate-400">{row.embDim}</td>
                  <td className="px-4 py-3 text-slate-400">{row.mtebBench}</td>
                  <td className={`px-4 py-3 ${row.qEvdInDb > 90 ? 'text-cyan-400 font-bold' : ''}`}>{row.qEvdInDb.toFixed(2)}%</td>
                  <td className="px-4 py-3">{row.qEvdOutDb.toFixed(2)}%</td>
                  <td className={`px-4 py-3 ${row.qSqlInDb > 90 ? 'text-indigo-400 font-bold' : ''}`}>{row.qSqlInDb.toFixed(2)}%</td>
                  <td className="px-4 py-3">{row.qSqlOutDb.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
