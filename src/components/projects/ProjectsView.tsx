import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit3, ArrowRight, MessageSquare, Database, Calendar, Bookmark, Check } from 'lucide-react';
import { Project, DatabaseSchema } from '../../types';

interface ProjectsViewProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (project: Project) => void;
  onCreateProject: (name: string, description: string) => void;
  onDeleteProject: (projectId: string) => void;
  onRenameProject: (projectId: string, newName: string) => void;
  onOpenChatForProject: (projectId: string) => void;
  databases: DatabaseSchema[];
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onRenameProject,
  onOpenChatForProject,
  databases
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editNameText, setEditNameText] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim(), newProjectDesc.trim() || 'Custom analytical dataset project');
      setNewProjectName('');
      setNewProjectDesc('');
      setShowCreateModal(false);
    }
  };

  const handleSaveRename = (projectId: string) => {
    if (editNameText.trim()) {
      onRenameProject(projectId, editNameText.trim());
    }
    setEditingProjectId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-y-auto p-4 sm:p-8 space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Projects Workspace</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Organize natural language query threads by database domains</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const isActive = proj.id === activeProject.id;
          const isEditing = editingProjectId === proj.id;
          const associatedDb = databases.find(d => d.id === proj.databaseId) || databases[0];

          return (
            <div
              key={proj.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-md ${
                isActive
                  ? 'border-cyan-500/50 bg-white dark:bg-slate-900/90 shadow-cyan-500/10'
                  : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Card Top Title Bar */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">
                      {proj.name.includes('Sales') ? '📊' : proj.name.includes('HR') ? '👥' : proj.name.includes('E-Commerce') ? '💰' : proj.name.includes('Health') ? '🏥' : '📦'}
                    </span>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editNameText}
                          onChange={(e) => setEditNameText(e.target.value)}
                          className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs px-2 py-1 rounded border border-cyan-500 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(proj.id)}
                          className="p-1 text-cyan-600 dark:text-cyan-400"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          {proj.name}
                          {isActive && (
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                              Active
                            </span>
                          )}
                        </h3>
                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400">Database: {proj.databaseName || associatedDb.name}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingProjectId(proj.id);
                        setEditNameText(proj.name);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Rename project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {projects.length > 1 && (
                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-h-[36px]">
                  {proj.description}
                </p>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <div>
                      <span className="block font-bold text-slate-900 dark:text-slate-200">{proj.chatCount}</span>
                      <span className="text-[9.5px] text-slate-500 dark:text-slate-400">Queries</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
                    <Bookmark className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <span className="block font-bold text-slate-900 dark:text-slate-200">{proj.savedQueryCount || 2}</span>
                      <span className="text-[9.5px] text-slate-500 dark:text-slate-400">Saved SQL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 dark:text-slate-500 font-mono">Created {proj.createdAt}</span>

                <button
                  onClick={() => {
                    onSelectProject(proj);
                    onOpenChatForProject(proj.id);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 font-bold text-xs text-cyan-700 dark:text-cyan-300 transition-colors"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Creating Project */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Create New Project
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Finance & Investment Intelligence"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="e.g. Quarterly earnings, expense reports, and ledger tables"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
