import React from 'react';
import { 
  Database, 
  Layers, 
  PanelRightOpen, 
  PanelRightClose,
  PanelLeftOpen,
  PanelLeftClose,
  Maximize2
} from 'lucide-react';
import { Project, DatabaseSchema } from '../../types';

interface HeaderProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (p: Project) => void;
  databases: DatabaseSchema[];
  activeDatabaseId: string;
  onSelectDatabase: (dbId: string) => void;
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
  showRightPanel: boolean;
  onToggleRightPanel: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  activeProject,
  onSelectProject,
  databases,
  activeDatabaseId,
  onSelectDatabase,
  isPresentationMode,
  onTogglePresentationMode,
  showRightPanel,
  onToggleRightPanel,
  isSidebarOpen,
  onToggleSidebar
}) => {
  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0 transition-colors duration-200">
      {/* Left controls */}
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
          title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> : <PanelLeftOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
          <span className="hidden sm:inline text-slate-700 dark:text-slate-300 font-semibold">{isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}</span>
        </button>

        {/* Project Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300">
          <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="text-slate-500 dark:text-slate-500 font-medium hidden sm:inline">Project:</span>
          <select 
            value={activeProject.id}
            onChange={(e) => {
              const p = projects.find(proj => proj.id === e.target.value);
              if (p) onSelectProject(p);
            }}
            className="bg-transparent text-slate-900 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer pr-1"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Database Selector */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300">
          <Database className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-slate-500 dark:text-slate-500 font-medium">Database:</span>
          <select 
            value={activeDatabaseId}
            onChange={(e) => onSelectDatabase(e.target.value)}
            className="bg-transparent text-slate-900 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer pr-1"
          >
            {databases.map(db => (
              <option key={db.id} value={db.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                {db.name}
              </option>
            ))}
          </select>
        </div>

        {/* Live Connected Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          <span>Connected</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Presentation Mode Toggle */}
        <button
          onClick={onTogglePresentationMode}
          className={`p-1.5 rounded-lg border transition-colors ${
            isPresentationMode
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-600 dark:text-cyan-300'
              : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title={isPresentationMode ? "Exit Presentation Mode" : "Enter Presentation Mode"}
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Right Panel Inspector Toggle */}
        <button
          onClick={onToggleRightPanel}
          className={`p-1.5 rounded-lg border transition-colors ${
            showRightPanel
              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-600 dark:text-indigo-300'
              : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="Toggle RAG Inspector Panel"
        >
          {showRightPanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
