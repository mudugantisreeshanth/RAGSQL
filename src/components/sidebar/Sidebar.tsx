import React, { useState } from 'react';
import { 
  MessageSquarePlus, 
  Database, 
  FileText, 
  Bookmark, 
  BarChart2, 
  Settings, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Pin, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Layers, 
  Moon, 
  Sun,
  Check,
  LogOut
} from 'lucide-react';
import { NavigationTab, Project, ChatThread } from '../../types';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  projects: Project[];
  activeProject: Project;
  onSelectProject: (p: Project) => void;
  chats: ChatThread[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onPinChat: (chatId: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout?: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  projects,
  activeProject,
  onSelectProject,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
  theme,
  onToggleTheme,
  onLogout,
  isOpenMobile,
  onCloseMobile
}) => {
  const [showRecentChats, setShowRecentChats] = useState(true);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');

  const projectChats = chats.filter(c => c.projectId === activeProject.id);

  const navItems = [
    { id: 'chat' as NavigationTab, label: 'Chat Workspace', icon: MessageSquarePlus },
    { id: 'projects' as NavigationTab, label: 'Projects', icon: Layers },
    { id: 'explorer' as NavigationTab, label: 'Database Explorer', icon: Database },
    { id: 'saved' as NavigationTab, label: 'Saved Queries', icon: Bookmark },
    { id: 'analytics' as NavigationTab, label: 'Analytics', icon: BarChart2 },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings },
  ];

  const handleStartRename = (e: React.MouseEvent, chat: ChatThread) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitleText(chat.title);
  };

  const handleSaveRename = (chatId: string) => {
    if (editTitleText.trim()) {
      onRenameChat(chatId, editTitleText.trim());
    }
    setEditingChatId(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 flex flex-col h-full
        transition-all duration-200 ease-in-out shrink-0
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold font-display tracking-tight text-slate-900 dark:text-white text-base">RAGSQL</span>
                <span className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">AI</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Text-to-SQL RAG Assistant</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onSelectTab('chat');
              onCloseMobile();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-indigo-700 hover:from-cyan-500 hover:via-indigo-500 hover:to-indigo-600 text-white font-medium text-xs shadow-md shadow-cyan-500/15 flex items-center justify-center gap-2 transition-all group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span>New Natural Query</span>
          </button>
        </div>

        {/* Main Nav Links */}
        <div className="px-2 py-1 space-y-0.5 border-b border-slate-200 dark:border-slate-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 font-semibold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Scrollable Middle Section */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {/* Recent Queries Section */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <button 
                onClick={() => setShowRecentChats(!showRecentChats)}
                className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 uppercase"
              >
                {showRecentChats ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>Recent Queries ({activeProject.name})</span>
              </button>
            </div>

            {showRecentChats && (
              <div className="space-y-0.5">
                {projectChats.length === 0 ? (
                  <p className="px-3 py-2 text-[11px] text-slate-400 dark:text-slate-500 italic">No queries yet in this project.</p>
                ) : (
                  projectChats.map((chat) => {
                    const isSelected = activeTab === 'chat' && activeChatId === chat.id;
                    const isEditing = editingChatId === chat.id;

                    return (
                      <div
                        key={chat.id}
                        onClick={() => {
                          onSelectChat(chat.id);
                          onSelectTab('chat');
                          onCloseMobile();
                        }}
                        className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-slate-100 dark:bg-slate-900 text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-slate-800 font-semibold' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-6 min-w-0">
                          {chat.isPinned ? (
                            <Pin className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0 rotate-45" />
                          ) : (
                            <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                          )}
                          
                          {isEditing ? (
                            <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editTitleText}
                                onChange={(e) => setEditTitleText(e.target.value)}
                                className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs px-1.5 py-0.5 rounded border border-cyan-500 focus:outline-none w-full"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRename(chat.id);
                                }}
                              />
                              <button 
                                onClick={() => handleSaveRename(chat.id)}
                                className="p-0.5 text-cyan-600 dark:text-cyan-400"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="truncate text-[11.5px]">{chat.title}</span>
                          )}
                        </div>

                        {!isEditing && (
                          <div className="hidden group-hover:flex items-center gap-1 absolute right-1 bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800 shadow">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPinChat(chat.id);
                              }}
                              className="p-1 text-slate-400 hover:text-amber-500"
                              title={chat.isPinned ? "Unpin query" : "Pin query"}
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => handleStartRename(e, chat)}
                              className="p-1 text-slate-400 hover:text-cyan-600"
                              title="Rename query"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChat(chat.id);
                              }}
                              className="p-1 text-slate-400 hover:text-rose-500"
                              title="Delete query"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom User Profile Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-900 bg-slate-50/60 dark:bg-slate-950/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                T
              </div>
              <div className="leading-none">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">testuser</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Research User</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleTheme}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
