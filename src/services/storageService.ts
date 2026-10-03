import { Project, ChatThread, SavedQuery } from '../types';
import { MOCK_DATABASES } from '../data/mockDatasets';

const PROJECTS_KEY = 'ragsql_projects_v1';
const CHATS_KEY = 'ragsql_chats_v1';
const SAVED_QUERIES_KEY = 'ragsql_saved_queries_v1';
const SETTINGS_KEY = 'ragsql_settings_v1';

export interface UserSettings {
  theme: 'dark' | 'light';
  demoMode: boolean;
  selectedModel: 'RAGSQL-text' | 'RAGSQL-code' | 'all-MiniLM-L6-v2' | 'OpenAI-3-large';
  autoVisualize: boolean;
  showSqlByDefault: boolean;
  showRetrievalContext: boolean;
  enterToSend: boolean;
  voiceLanguage: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  demoMode: true,
  selectedModel: 'RAGSQL-text',
  autoVisualize: true,
  showSqlByDefault: true,
  showRetrievalContext: true,
  enterToSend: true,
  voiceLanguage: 'en-US'
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj_sales',
    name: 'Sales Analytics',
    icon: 'BarChart3',
    description: 'Enterprise revenue trends, regional performance, and top customers',
    databaseId: 'sales_db',
    databaseName: 'Sales Analytics',
    chatCount: 4,
    savedQueryCount: 3,
    createdAt: '2024-10-01',
    lastActive: 'Just now',
    isPinned: true
  },
  {
    id: 'proj_hr',
    name: 'HR Analytics',
    icon: 'Users',
    description: 'Department salaries, employee headcount, and executive compensation',
    databaseId: 'hr_db',
    databaseName: 'HR Analytics',
    chatCount: 2,
    savedQueryCount: 2,
    createdAt: '2024-10-02',
    lastActive: '2 hours ago',
    isPinned: true
  },
  {
    id: 'proj_ecom',
    name: 'E-Commerce Intelligence',
    icon: 'ShoppingBag',
    description: 'User conversion rates, top selling product lines, and order trends',
    databaseId: 'ecommerce_db',
    databaseName: 'E-Commerce Intelligence',
    chatCount: 1,
    savedQueryCount: 1,
    createdAt: '2024-10-03',
    lastActive: 'Yesterday'
  },
  {
    id: 'proj_health',
    name: 'Healthcare Data',
    icon: 'Activity',
    description: 'Patient admissions, medical inventory, and clinical diagnostic logs',
    databaseId: 'sales_db',
    databaseName: 'Sales Analytics',
    chatCount: 0,
    savedQueryCount: 0,
    createdAt: '2024-10-03',
    lastActive: '3 days ago'
  }
];

const SEED_CHATS: ChatThread[] = [
  {
    id: 'chat_rev_2024',
    projectId: 'proj_sales',
    title: 'Revenue by region in 2024',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    isPinned: true,
    starred: true,
    messages: [
      {
        id: 'msg_u1',
        role: 'user',
        text: 'Which region generated the highest revenue in 2024?',
        timestamp: '10:14 AM'
      },
      {
        id: 'msg_a1',
        role: 'assistant',
        text: `### 📊 Regional Revenue Breakdown (2024)

**Executive Summary:**
The **West region** emerged as the top revenue driver for 2024, generating **$12.4M** ($12,400,000.00) in gross sales. This accounts for **38.8%** of total enterprise revenue across all territories.

---

### 🔍 Key Regional Highlights:
- **🥇 1. West Region ($12.4M - 38.8% share):** Led overall sales performance driven by strong enterprise customer adoption in Q1 and Q2.
- **🥈 2. East Region ($8.9M - 27.8% share):** Solid secondary market with consistent quarterly subscription renewals.
- **🥉 3. North Region ($6.5M - 20.3% share):** Steady growth with expanding SMB accounts.
- **📍 4. South Region ($4.2M - 13.1% share):** Opportunity area for market expansion and targeted customer outreach.

---

### 💡 Strategic Insights & Takeaways:
> **Key Finding:** The West and East regions combined contributed **66.6%** of total sales in 2024. Reallocating additional account management resources to the South region could help unlock untapped revenue potential.

*Below, you can explore the complete dataset breakdown in the interactive table and view the visual bar chart comparison.*`,
        timestamp: '10:14 AM',
        executionTimeMs: 780,
        confidenceScore: 0.96,
        sql: `SELECT region, SUM(revenue) AS total_revenue\nFROM sales\nWHERE year = 2024\nGROUP BY region\nORDER BY total_revenue DESC;`,
        sqlExplanation: [
          'Filter the `sales` table for records where `year = 2024`.',
          'Group transaction records by the `region` column.',
          'Aggregate gross sales using `SUM(revenue)`.',
          'Sort results in descending order of total revenue to identify top performing regions.'
        ],
        resultTable: {
          columns: ['region', 'total_revenue', 'year_share'],
          rows: [
            { region: 'West', total_revenue: '$12,400,000.00', year_share: '38.8%' },
            { region: 'East', total_revenue: '$8,900,000.00', year_share: '27.8%' },
            { region: 'North', total_revenue: '$6,500,000.00', year_share: '20.3%' },
            { region: 'South', total_revenue: '$4,200,000.00', year_share: '13.1%' }
          ]
        },
        chartConfig: {
          type: 'bar',
          xAxisKey: 'region',
          yAxisKey: 'total_revenue_num',
          series: ['total_revenue_num'],
          title: '2024 Revenue Distribution by Region (in USD Millions)'
        },
        retrievedContext: [
          {
            id: 'ctx_1',
            title: 'Schema: sales table',
            type: 'schema',
            snippet: 'sales(id INT, region VARCHAR(50), revenue DECIMAL(12,2), year INT, month VARCHAR(20), date DATE, customer_id INT)',
            relevanceScore: 0.96,
            reason: 'High cosine similarity (0.96) matching query intent to `sales.region` and `sales.revenue` fields.'
          },
          {
            id: 'ctx_2',
            title: 'BIRD Benchmark Gold SQL Match',
            type: 'sql_example',
            snippet: 'SELECT region, SUM(revenue) FROM sales WHERE year = 2024 GROUP BY region ORDER BY SUM(revenue) DESC LIMIT 1;',
            relevanceScore: 0.94,
            reason: 'Top-1 fine-tuned RAGSQL-code embedding match for "highest revenue by region in [year]".'
          },
          {
            id: 'ctx_3',
            title: 'Table Evidence & Metadata',
            type: 'evidence_doc',
            snippet: 'sales.revenue denotes gross financial sales in USD; year denotes calendar fiscal year.',
            relevanceScore: 0.89,
            reason: 'Contextual evidence extracted from database dictionary for financial metric resolution.'
          }
        ],
        pipeline: [
          { id: 'p1', name: 'Question Understanding', status: 'completed', timeMs: 120, details: 'Normalized query: [intent: max_aggregation, target: revenue, group: region, filter: year=2024]' },
          { id: 'p2', name: 'Context Retrieval', status: 'completed', timeMs: 84, details: 'Retrieved top-3 evidence vectors using all-MiniLM-L6-v2 fine-tuned model (NDCG@10: 0.96)' },
          { id: 'p3', name: 'Schema Matching', status: 'completed', timeMs: 51, details: 'Mapped columns: sales.region, sales.revenue, sales.year' },
          { id: 'p4', name: 'Prompt Augmentation', status: 'completed', timeMs: 40, details: 'Injected gold SQL template and schema DDL into prompt context' },
          { id: 'p5', name: 'SQL Generation', status: 'completed', timeMs: 380, details: 'Generated syntactically valid ANSI SQL query' },
          { id: 'p6', name: 'SQL Validation', status: 'completed', timeMs: 33, details: 'AST parsing & table reference verification passed without syntax errors' },
          { id: 'p7', name: 'Query Execution', status: 'completed', timeMs: 72, details: 'Query executed against Sales Analytics DB in 72ms. 4 rows returned.' }
        ]
      }
    ]
  }
];

const DEFAULT_SAVED_QUERIES: SavedQuery[] = [
  {
    id: 'sq_1',
    title: 'Monthly Revenue Analysis 2024',
    description: 'Calculates monthly gross revenue breakdown for fiscal year 2024 sorted chronologically.',
    sql: `SELECT month, SUM(revenue) AS monthly_revenue\nFROM sales\nWHERE year = 2024\nGROUP BY month;\n`,
    projectId: 'proj_sales',
    databaseId: 'sales_db',
    tags: ['Revenue', '2024', 'Monthly'],
    createdAt: '2024-10-02',
    isStarred: true,
    executionCount: 14
  },
  {
    id: 'sq_2',
    title: 'Top 5 Highest Paid Employees',
    description: 'Ranks employees by current annual salary along with department information.',
    sql: `SELECT e.emp_name, d.dept_name, e.salary, e.position\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nORDER BY e.salary DESC\nLIMIT 5;`,
    projectId: 'proj_hr',
    databaseId: 'hr_db',
    tags: ['HR', 'Salary', 'Top-5'],
    createdAt: '2024-10-03',
    isStarred: true,
    executionCount: 8
  }
];

export class StorageService {
  static getProjects(): Project[] {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) {
      this.saveProjects(DEFAULT_PROJECTS);
      return DEFAULT_PROJECTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PROJECTS;
    }
  }

  static saveProjects(projects: Project[]): void {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }

  static getChats(): ChatThread[] {
    const raw = localStorage.getItem(CHATS_KEY);
    if (!raw) {
      this.saveChats(SEED_CHATS);
      return SEED_CHATS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_CHATS;
    }
  }

  static saveChats(chats: ChatThread[]): void {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  }

  static getSavedQueries(): SavedQuery[] {
    const raw = localStorage.getItem(SAVED_QUERIES_KEY);
    if (!raw) {
      this.saveSavedQueries(DEFAULT_SAVED_QUERIES);
      return DEFAULT_SAVED_QUERIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SAVED_QUERIES;
    }
  }

  static saveSavedQueries(queries: SavedQuery[]): void {
    localStorage.setItem(SAVED_QUERIES_KEY, JSON.stringify(queries));
  }

  static getSettings(): UserSettings {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: UserSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
}
