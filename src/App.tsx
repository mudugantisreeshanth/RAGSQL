import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/sidebar/Sidebar';
import { Header } from './components/common/Header';
import { ChatWorkspace } from './components/chat/ChatWorkspace';
import { RightInspector } from './components/chat/RightInspector';
import { ProjectsView } from './components/projects/ProjectsView';
import { DatabaseExplorer } from './components/explorer/DatabaseExplorer';
import { SavedQueriesView } from './components/saved/SavedQueriesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { CommandPalette } from './components/modals/CommandPalette';
import { FileUploadModal } from './components/modals/FileUploadModal';
import { LoginPage } from './components/auth/LoginPage';

import { NavigationTab, Project, ChatThread, ChatMessage, DatabaseSchema, SavedQuery } from './types';
import { StorageService, UserSettings } from './services/storageService';
import { AuthService } from './services/authService';
import { MOCK_DATABASES } from './data/mockDatasets';
import { RagsqlService } from './services/ragsqlService';

export function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => AuthService.isAuthenticated());

  // State initialization from LocalStorage
  const [projects, setProjects] = useState<Project[]>(() => StorageService.getProjects());
  const [activeProject, setActiveProject] = useState<Project>(() => projects[0] || StorageService.getProjects()[0]);
  const [chats, setChats] = useState<ChatThread[]>(() => StorageService.getChats());
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const projChats = StorageService.getChats().filter(c => c.projectId === StorageService.getProjects()[0]?.id);
    return projChats[0]?.id || StorageService.getChats()[0]?.id || null;
  });

  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(() => StorageService.getSavedQueries());
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.getSettings());
  const [databases, setDatabases] = useState<DatabaseSchema[]>(MOCK_DATABASES);
  const [activeDatabaseId, setActiveDatabaseId] = useState<string>(activeProject.databaseId || MOCK_DATABASES[0].id);

  const [activeTab, setActiveTab] = useState<NavigationTab>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState<boolean>(false);

  // Persist edits
  useEffect(() => {
    StorageService.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    StorageService.saveChats(chats);
  }, [chats]);

  useEffect(() => {
    StorageService.saveSavedQueries(savedQueries);
  }, [savedQueries]);

  useEffect(() => {
    StorageService.saveSettings(settings);
    // Dark mode class application
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings]);

  // Sync active database when project changes
  const handleSelectProject = (proj: Project) => {
    setActiveProject(proj);
    setActiveDatabaseId(proj.databaseId);
    const projChats = chats.filter(c => c.projectId === proj.id);
    if (projChats.length > 0) {
      setActiveChatId(projChats[0].id);
    } else {
      handleCreateNewChat(proj.id);
    }
  };

  const activeChatThread = chats.find(c => c.id === activeChatId) || {
    id: 'temp',
    projectId: activeProject.id,
    title: 'New Natural Query',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: []
  };

  const activeDatabase = databases.find(d => d.id === activeDatabaseId) || databases[0];

  // Handler: Create New Chat
  const handleCreateNewChat = (projId: string = activeProject.id) => {
    const newChat: ChatThread = {
      id: `chat_${Date.now()}`,
      projectId: projId,
      title: 'New Natural Query',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setActiveChatId(newChat.id);

    // Update project chat count
    setProjects(projects.map(p => p.id === projId ? { ...p, chatCount: p.chatCount + 1 } : p));
  };

  // Handler: Send Message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    let targetThread = chats.find(c => c.id === activeChatId);
    let targetThreadId = activeChatId;

    if (!targetThread || targetThread.projectId !== activeProject.id) {
      const newChat: ChatThread = {
        id: `chat_${Date.now()}`,
        projectId: activeProject.id,
        title: text.length > 30 ? `${text.slice(0, 30)}...` : text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      targetThread = newChat;
      targetThreadId = newChat.id;
    }

    const userMsg: ChatMessage = {
      id: `umsg_${Date.now()}`,
      role: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessagesWithUser = [...targetThread.messages, userMsg];

    // If title was default, update title to question snippet
    const updatedTitle = targetThread.messages.length === 0 
      ? (text.length > 32 ? `${text.slice(0, 32)}...` : text) 
      : targetThread.title;

    setChats(prev => prev.map(c => c.id === targetThreadId ? {
      ...c,
      title: updatedTitle,
      updatedAt: new Date().toISOString(),
      messages: updatedMessagesWithUser
    } : c));

    setIsLoading(true);

    try {
      const aiResponsePartial = await RagsqlService.askQuestion({
        question: text,
        projectId: activeProject.id,
        databaseId: activeDatabaseId
      });

      const aiMsg: ChatMessage = {
        id: `amsg_${Date.now()}`,
        role: 'assistant',
        text: aiResponsePartial.text || 'Processing query completed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sql: aiResponsePartial.sql,
        sqlExplanation: aiResponsePartial.sqlExplanation,
        resultTable: aiResponsePartial.resultTable,
        chartConfig: aiResponsePartial.chartConfig,
        retrievedContext: aiResponsePartial.retrievedContext,
        pipeline: aiResponsePartial.pipeline,
        executionTimeMs: aiResponsePartial.executionTimeMs,
        confidenceScore: aiResponsePartial.confidenceScore
      };

      setChats(prev => prev.map(c => c.id === targetThreadId ? {
        ...c,
        updatedAt: new Date().toISOString(),
        messages: [...c.messages, aiMsg]
      } : c));
    } catch (err) {
      console.error('Error processing query:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Delete chat
  const handleDeleteChat = (chatId: string) => {
    const updated = chats.filter(c => c.id !== chatId);
    setChats(updated);
    if (activeChatId === chatId) {
      const remaining = updated.filter(c => c.projectId === activeProject.id);
      setActiveChatId(remaining[0]?.id || null);
    }
  };

  // Handler: Rename chat
  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChats(chats.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
  };

  // Handler: Pin chat
  const handlePinChat = (chatId: string) => {
    setChats(chats.map(c => c.id === chatId ? { ...c, isPinned: !c.isPinned } : c));
  };

  // Handler: Create Project
  const handleCreateProject = (name: string, description: string) => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name: name,
      icon: 'Layers',
      description: description,
      databaseId: activeDatabaseId,
      databaseName: activeDatabase.name,
      chatCount: 0,
      savedQueryCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: 'Just now'
    };
    setProjects([...projects, newProj]);
    handleSelectProject(newProj);
  };

  // Handler: Delete Project
  const handleDeleteProject = (projectId: string) => {
    if (projects.length <= 1) return;
    const updated = projects.filter(p => p.id !== projectId);
    setProjects(updated);
    if (activeProject.id === projectId) {
      handleSelectProject(updated[0]);
    }
  };

  // Handler: Rename Project
  const handleRenameProject = (projectId: string, newName: string) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, name: newName } : p));
  };

  // Handler: Custom Uploaded Dataset
  const handleDatasetUploaded = (newDb: DatabaseSchema) => {
    setDatabases([...databases, newDb]);
    setActiveDatabaseId(newDb.id);
    setActiveTab('chat');
  };

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  // Unauthenticated Starting Screen
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Authenticated Main Workspace Layout
  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Left Collapsible Sidebar */}
      {!isPresentationMode && isSidebarOpen && (
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          projects={projects}
          activeProject={activeProject}
          onSelectProject={handleSelectProject}
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          onNewChat={() => handleCreateNewChat()}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          onPinChat={handlePinChat}
          theme={settings.theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Center & Right Workspace Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <Header
          projects={projects}
          activeProject={activeProject}
          onSelectProject={handleSelectProject}
          databases={databases}
          activeDatabaseId={activeDatabaseId}
          onSelectDatabase={setActiveDatabaseId}
          isPresentationMode={isPresentationMode}
          onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
          showRightPanel={showRightPanel}
          onToggleRightPanel={() => setShowRightPanel(!showRightPanel)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Tab View Switching */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'chat' && (
            <ChatWorkspace
              chatThread={activeChatThread}
              database={activeDatabase}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onOpenFileUploadModal={() => setIsFileUploadModalOpen(true)}
              onUpdateThreadMessages={(chatId, updatedMsgs) => {
                setChats(chats.map(c => c.id === chatId ? { ...c, messages: updatedMsgs } : c));
              }}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              activeProject={activeProject}
              onSelectProject={handleSelectProject}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onRenameProject={handleRenameProject}
              onOpenChatForProject={(projId) => {
                setActiveTab('chat');
              }}
              databases={databases}
            />
          )}

          {activeTab === 'explorer' && (
            <DatabaseExplorer
              databases={databases}
              activeDatabaseId={activeDatabaseId}
              onSelectDatabase={setActiveDatabaseId}
            />
          )}

          {activeTab === 'saved' && (
            <SavedQueriesView
              savedQueries={savedQueries}
              onRunQuery={(sql) => {
                setActiveTab('chat');
                handleSendMessage(`Execute query: ${sql}`);
              }}
              onDeleteQuery={(id) => setSavedQueries(savedQueries.filter(q => q.id !== id))}
              onToggleStar={(id) => setSavedQueries(savedQueries.map(q => q.id === id ? { ...q, isStarred: !q.isStarred } : q))}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={setSettings}
            />
          )}

          {/* Right Inspector Panel (Collapsible & Hidden in Presentation Mode) */}
          {!isPresentationMode && showRightPanel && activeTab === 'chat' && (
            <RightInspector
              database={activeDatabase}
              messages={activeChatThread.messages}
              onClose={() => setShowRightPanel(false)}
            />
          )}
        </div>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        onNewChat={() => handleCreateNewChat()}
      />

      {/* Dataset File Upload Modal */}
      <FileUploadModal
        isOpen={isFileUploadModalOpen}
        onClose={() => setIsFileUploadModalOpen(false)}
        onDatasetUploaded={handleDatasetUploaded}
      />
    </div>
  );
}

export default App;
