import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Database, 
  Layers, 
  ArrowRight, 
  BarChart3, 
  FileCode, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { ChatThread, ChatMessage, DatabaseSchema } from '../../types';
import { SqlCodeBlock } from './SqlCodeBlock';
import { ExplainSqlModal } from './ExplainSqlModal';
import { DataTable } from './DataTable';
import { VisualizationChart } from './VisualizationChart';
import { RetrievedContextPanel } from './RetrievedContextPanel';
import { PipelineBreakdown } from './PipelineBreakdown';
import { ChatInput } from './ChatInput';
import { RagsqlService } from '../../services/ragsqlService';
import { FormattedMarkdown } from '../../utils/formatMarkdown';

interface ChatWorkspaceProps {
  chatThread: ChatThread;
  database: DatabaseSchema;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onOpenFileUploadModal: () => void;
  onUpdateThreadMessages: (chatId: string, updatedMessages: ChatMessage[]) => void;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  chatThread,
  database,
  onSendMessage,
  isLoading,
  onOpenFileUploadModal,
  onUpdateThreadMessages
}) => {
  const [activeExplainSql, setActiveExplainSql] = useState<{ sql: string; explanations?: string[] } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThread.messages, isLoading]);

  const promptCards = [
    {
      title: "Regional Sales Performance",
      query: "Which region generated the highest revenue in 2024?",
      icon: "📊",
      db: "Sales Analytics"
    },
    {
      title: "Monthly Revenue Trend",
      query: "Show monthly revenue for 2024.",
      icon: "📈",
      db: "Sales Analytics"
    },
    {
      title: "Department Compensation",
      query: "Which department has the highest average salary?",
      icon: "👥",
      db: "HR Analytics"
    },
    {
      title: "Top E-Commerce Products",
      query: "Which product has the highest number of orders?",
      icon: "💰",
      db: "E-Commerce"
    }
  ];

  const handleRunCustomSql = (msgId: string, editedSql: string) => {
    const newResultTable = RagsqlService.executeCustomSql(editedSql, database.id);
    const updatedMessages = chatThread.messages.map((m) => {
      if (m.id === msgId) {
        return {
          ...m,
          sql: editedSql,
          resultTable: newResultTable
        };
      }
      return m;
    });
    onUpdateThreadMessages(chatThread.id, updatedMessages);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden relative transition-colors duration-200">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {chatThread.messages.length === 0 ? (
          /* Empty / Welcome State */
          <div className="max-w-3xl mx-auto py-12 px-4 space-y-8 text-center">
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-xl shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-cyan-400" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                RAGSQL <span className="text-gradient-cyan">AI Assistant</span>
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                Retrieval-Augmented Natural Language Interface for Database Querying. Ask complex data questions without writing SQL.
              </p>
            </div>

            {/* Prompt Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {promptCards.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(card.query)}
                  className="p-4 rounded-2xl text-left space-y-2 group border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{card.icon}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {card.db}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[11.5px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    "{card.query}"
                  </p>
                </button>
              ))}
            </div>

            {/* Active Database Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
              <Database className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Connected Database: <strong className="text-slate-900 dark:text-slate-200">{database.name}</strong> ({database.totalTables} tables, {database.totalRows.toLocaleString()} rows)</span>
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="max-w-4xl mx-auto space-y-6">
            {chatThread.messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shrink-0 shadow-md shadow-cyan-500/20 mt-1">
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>
                  )}

                  <div className={`space-y-3 max-w-[92%] sm:max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* User Bubble */}
                    {isUser ? (
                      <div className="bg-gradient-to-r from-cyan-600 to-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-md text-xs sm:text-sm font-medium leading-relaxed">
                        {msg.text}
                      </div>
                    ) : (
                      /* AI Response Card */
                      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/90 text-slate-900 dark:text-slate-100 space-y-4 shadow-md dark:shadow-xl">
                        {/* Status Pills Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800/80 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Query Succeeded</span>
                            </span>
                            
                            {msg.executionTimeMs && (
                              <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
                                latency: {msg.executionTimeMs}ms
                              </span>
                            )}
                          </div>

                          {msg.confidenceScore && (
                            <span className="text-[10.5px] font-mono font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                              RAG Relevance: {Math.round(msg.confidenceScore * 100)}%
                            </span>
                          )}
                        </div>

                        {/* Natural Language Text Answer */}
                        <FormattedMarkdown content={msg.text} />

                        {/* RAG Reasoning Observable Pipeline */}
                        {msg.pipeline && (
                          <PipelineBreakdown pipeline={msg.pipeline} totalTimeMs={msg.executionTimeMs} />
                        )}

                        {/* SQL Code Block */}
                        {msg.sql && (
                          <SqlCodeBlock 
                            sql={msg.sql} 
                            onExplainSql={() => setActiveExplainSql({ sql: msg.sql!, explanations: msg.sqlExplanation })}
                            onRunCustomSql={(editedSql) => handleRunCustomSql(msg.id, editedSql)}
                          />
                        )}

                        {/* Data Table */}
                        {msg.resultTable && (
                          <DataTable data={msg.resultTable} />
                        )}

                        {/* Chart Visualization */}
                        {msg.chartConfig && msg.resultTable && (
                          <VisualizationChart chartConfig={msg.chartConfig} tableData={msg.resultTable} />
                        )}

                        {/* Retrieved Context Cards */}
                        {msg.retrievedContext && (
                          <RetrievedContextPanel contexts={msg.retrievedContext} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400 animate-spin" />
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 max-w-sm animate-pulse shadow-md">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                    <span>RAGSQL vector retrieval in progress...</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Matching question embeddings with BIRD schema tensors...
                  </p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <ChatInput 
        onSendMessage={onSendMessage} 
        isLoading={isLoading} 
        onOpenFileUploadModal={onOpenFileUploadModal}
      />

      {/* Explain SQL Modal */}
      <ExplainSqlModal
        isOpen={!!activeExplainSql}
        onClose={() => setActiveExplainSql(null)}
        sql={activeExplainSql?.sql || ''}
        explanations={activeExplainSql?.explanations}
      />
    </div>
  );
};
