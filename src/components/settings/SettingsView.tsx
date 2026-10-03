import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, Cpu, Mic, Database, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { UserSettings } from '../../services/storageService';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto p-4 sm:p-8 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">System Settings</h2>
            <p className="text-xs text-slate-400">Configure RAGSQL vector models, UI preferences, and backend connections</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Appearance & Mode */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Mode & Environment</span>
          </h3>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-200">Demo Mode</p>
              <p className="text-[11px] text-slate-400">Use curated fast mock pipeline for zero-latency presentation</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, demoMode: !settings.demoMode })}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${settings.demoMode ? 'bg-amber-500' : 'bg-slate-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.demoMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Model Selection */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Sentence Transformer Model Integration</span>
          </h3>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">Active Vector Embedding Model</label>
            <select
              value={settings.selectedModel}
              onChange={(e) => onUpdateSettings({ ...settings, selectedModel: e.target.value as any })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-semibold focus:outline-none"
            >
              <option value="RAGSQL-text">RAGSQL-text (Fine-tuned all-MiniLM-L6-v2 - Q-EVD Gold)</option>
              <option value="RAGSQL-code">RAGSQL-code (Fine-tuned all-MiniLM-L6-v2 - Q-SQL Gold)</option>
              <option value="all-MiniLM-L6-v2">all-MiniLM-L6-v2 (Baseline - 23M Params)</option>
              <option value="OpenAI-3-large">OpenAI text-embedding-3-large (3072 dims API)</option>
            </select>
          </div>
        </div>

        {/* Chat Experience Preferences */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Chat Workspace Preferences</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <span className="text-slate-200">Show Generated SQL Code Blocks by default</span>
              <input
                type="checkbox"
                checked={settings.showSqlByDefault}
                onChange={(e) => onUpdateSettings({ ...settings, showSqlByDefault: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <span className="text-slate-200">Show RAG Retrieved Context cards</span>
              <input
                type="checkbox"
                checked={settings.showRetrievalContext}
                onChange={(e) => onUpdateSettings({ ...settings, showRetrievalContext: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <span className="text-slate-200">Auto-generate Data Visualizations for query results</span>
              <input
                type="checkbox"
                checked={settings.autoVisualize}
                onChange={(e) => onUpdateSettings({ ...settings, autoVisualize: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500"
              />
            </label>
          </div>
        </div>

        {/* System Information */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 space-y-1">
          <p className="font-bold text-slate-200">RAGSQL AI System Information</p>
          <p>University Project based on "RAGSQL: context retrieval evaluation on augmenting text-to-SQL prompts"</p>
          <p className="text-[10px] text-slate-500">IEEE 2024 IS Conference • BIRD Benchmark Adaption</p>
        </div>
      </div>
    </div>
  );
};
