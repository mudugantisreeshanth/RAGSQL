export type NavigationTab = 
  | 'chat'
  | 'projects'
  | 'explorer'
  | 'research'
  | 'saved'
  | 'analytics'
  | 'settings';

export interface Project {
  id: string;
  name: string;
  icon: string;
  description: string;
  databaseId: string;
  databaseName: string;
  chatCount: number;
  savedQueryCount: number;
  createdAt: string;
  lastActive: string;
  isPinned?: boolean;
}

export interface ColumnSchema {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  references?: string;
  description: string;
  sampleValues: (string | number)[];
}

export interface TableSchema {
  name: string;
  description: string;
  rowCount: number;
  columns: ColumnSchema[];
  sampleData: Record<string, any>[];
}

export interface DatabaseSchema {
  id: string;
  name: string;
  description: string;
  totalTables: number;
  totalRows: number;
  tables: TableSchema[];
}

export interface RetrievedContext {
  id: string;
  title: string;
  type: 'schema' | 'sql_example' | 'evidence_doc';
  snippet: string;
  relevanceScore: number; // 0 to 1 (e.g. 0.94 = 94%)
  reason: string;
}

export interface PipelineStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timeMs?: number;
  details?: string;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'donut';

export interface ChartConfig {
  type: ChartType;
  xAxisKey: string;
  yAxisKey: string;
  series: string[];
  title: string;
}

export interface QueryResultTable {
  columns: string[];
  rows: Record<string, any>[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sql?: string;
  sqlExplanation?: string[];
  resultTable?: QueryResultTable;
  chartConfig?: ChartConfig;
  retrievedContext?: RetrievedContext[];
  pipeline?: PipelineStep[];
  executionTimeMs?: number;
  confidenceScore?: number; // e.g. 0.96 for NDCG@10 96%
  error?: string;
}

export interface ChatThread {
  id: string;
  projectId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  isPinned?: boolean;
  starred?: boolean;
}

export interface SavedQuery {
  id: string;
  title: string;
  description: string;
  sql: string;
  projectId: string;
  databaseId: string;
  tags: string[];
  createdAt: string;
  isStarred?: boolean;
  executionCount: number;
}

export interface BenchmarkMetrics {
  modelName: string;
  size: string;
  embDim: string;
  mtebBench: number;
  qEvdInDb: number;
  qEvdOutDb: number;
  qSqlInDb: number;
  qSqlOutDb: number;
  isFineTuned?: boolean;
  highlighted?: boolean;
}
