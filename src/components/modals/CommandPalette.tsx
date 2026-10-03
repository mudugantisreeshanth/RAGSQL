import React, { useState, useEffect } from 'react';
import { Search, MessageSquarePlus, Database, BookOpen, Bookmark, BarChart2, Settings, Layers, X, Command } from 'lucide-react';
import { NavigationTab } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavigationTab) => void;
  onNewChat: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onNewChat
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { label: 'New Natural Language Query', icon: MessageSquarePlus, action: () => { onNewChat(); onSelectTab('chat'); onClose(); } },
    { label: 'Open Database & Schema Explorer', icon: Database, action: () => { onSelectTab('explorer'); onClose(); } },
    { label: 'View Research Paper Benchmark Insights', icon: BookOpen, action: () => { onSelectTab('research'); onClose(); } },
    { label: 'Saved Queries Library', icon: Bookmark, action: () => { onSelectTab('saved'); onClose(); } },
    { label: 'Analytics Telemetry Dashboard', icon: BarChart2, action: () => { onSelectTab('analytics'); onClose(); } },
    { label: 'System Settings', icon: Settings, action: () => { onSelectTab('settings'); onClose(); } },
  ];

  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden space-y-2">
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-950">
          <Search className="w-4 h-4 text-cyan-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono ml-2">ESC</kbd>
        </div>

        <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
          {filteredActions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={act.action}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
