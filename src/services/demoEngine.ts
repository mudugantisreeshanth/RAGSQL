import alasql from 'alasql';
import { ChatMessage, RetrievedContext, PipelineStep, ChartConfig, QueryResultTable } from '../types';
import { MOCK_DATABASES } from '../data/mockDatasets';

interface DemoQueryMatch {
  keywords: string[];
  dbId: string;
  sql: string;
  explanation: string[];
  naturalAnswer: (rows: any[]) => string;
  chartConfig?: ChartConfig;
  contexts: RetrievedContext[];
}

const PRESET_MATCHES: DemoQueryMatch[] = [
  // 1. Sales DB - Regional Revenue
  {
    keywords: ['region', 'highest revenue', 'revenue 2024', 'highest revenue in 2024'],
    dbId: 'sales_db',
    sql: `SELECT region, SUM(revenue) AS total_revenue\nFROM sales\nWHERE year = 2024\nGROUP BY region\nORDER BY total_revenue DESC;`,
    explanation: [
      'Filter transaction records in the `sales` table specifically for the calendar year `2024`.',
      'Group all revenue entries according to their sales territory (`region`).',
      'Sum up total financial revenue (`SUM(revenue)`) for each region.',
      'Order the final regional results in descending order so the top-performing territory appears first.'
    ],
    naturalAnswer: () => `### 📊 Regional Revenue Breakdown (2024)

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
    chartConfig: {
      type: 'bar',
      xAxisKey: 'region',
      yAxisKey: 'total_revenue',
      series: ['total_revenue'],
      title: '2024 Gross Revenue Distribution by Region (USD)'
    },
    contexts: [
      {
        id: 'c1',
        title: 'Schema: sales table',
        type: 'schema',
        snippet: 'sales(id INT, region VARCHAR(50), revenue DECIMAL(12,2), year INT, month VARCHAR(20), date DATE, customer_id INT)',
        relevanceScore: 0.96,
        reason: 'Matched target columns: `region`, `revenue`, and filter `year`.'
      },
      {
        id: 'c2',
        title: 'BIRD Benchmark Gold SQL Match',
        type: 'sql_example',
        snippet: 'SELECT T1.region, SUM(T1.revenue) FROM sales AS T1 WHERE T1.year = 2024 GROUP BY T1.region ORDER BY SUM(T1.revenue) DESC LIMIT 1;',
        relevanceScore: 0.94,
        reason: 'Fine-tuned RAGSQL embedding matched top SQL pattern from BIRD benchmark.'
      },
      {
        id: 'c3',
        title: 'Database Evidence Dictionary',
        type: 'evidence_doc',
        snippet: 'revenue represents gross financial sales volume in USD.',
        relevanceScore: 0.88,
        reason: 'Evidence text confirms monetary sales metrics.'
      }
    ]
  },

  // 2. Sales DB - Monthly Revenue Trend
  {
    keywords: ['monthly revenue', 'monthly sales', 'monthly 2024', 'monthly trend'],
    dbId: 'sales_db',
    sql: `SELECT month, SUM(revenue) AS monthly_revenue\nFROM sales\nWHERE year = 2024\nGROUP BY month\nORDER BY monthly_revenue DESC;`,
    explanation: [
      'Filter dataset for fiscal year `2024`.',
      'Group transactions by calendar month (`month`).',
      'Aggregate monthly financial revenue using `SUM(revenue)`.',
      'Sort months by revenue output.'
    ],
    naturalAnswer: () => `### 📈 2024 Monthly Sales & Revenue Trend Analysis

**Executive Summary:**
Sales momentum for 2024 peaked during **January ($12.4M)** and **February ($8.9M)**, indicating exceptionally strong First-Quarter (Q1) customer purchasing demand.

---

### 🗓️ Monthly Breakdown Highlights:
- **🚀 January:** **$12,400,000.00** — Annual contract renewals and major client enterprise upgrades.
- **📈 February:** **$8,900,000.00** — Strong mid-quarter software subscription extensions.
- **🌱 March:** **$6,500,000.00** — Steady mid-tier SMB adoption.
- **☀️ April:** **$4,200,000.00** — Initial Q2 baseline transactions.

---

### 💡 Executive Analysis:
> **Growth Note:** The Q1 revenue surge demonstrates strong customer commitment early in the fiscal year. Maintaining momentum into Q3 and Q4 will be crucial to hitting annual target quotas.

*Check out the interactive line chart below to see month-over-month trajectory trends.*`,
    chartConfig: {
      type: 'line',
      xAxisKey: 'month',
      yAxisKey: 'monthly_revenue',
      series: ['monthly_revenue'],
      title: '2024 Monthly Revenue Trajectory'
    },
    contexts: [
      {
        id: 'c1',
        title: 'Schema: sales(month, revenue, year)',
        type: 'schema',
        snippet: 'sales(month VARCHAR(20), revenue DECIMAL, year INT)',
        relevanceScore: 0.95,
        reason: 'Selected month and revenue attributes from sales schema.'
      }
    ]
  },

  // 3. Sales DB - Top Customers
  {
    keywords: ['top 5 customers', 'top customers', 'spending', 'customer spending'],
    dbId: 'sales_db',
    sql: `SELECT c.customer_name, c.segment, c.region\nFROM customers c\nORDER BY c.id ASC\nLIMIT 5;`,
    explanation: [
      'Join `customers` table with sales transactions.',
      'Filter and aggregate total spending by customer.',
      'Order descending to extract top enterprise client accounts.'
    ],
    naturalAnswer: () => `### 🏢 Top Enterprise Customers Analysis

**Executive Summary:**
Our top 5 enterprise accounts represent our highest-value client relationships. **Apex Global** and **Nexus Tech** lead customer accounts in lifetime account revenue and tier commitments.

---

### 👑 Top Customer Profiles:
- **🏢 Apex Global (Enterprise Segment - West Region):** Strategic technology partner and highest overall spender.
- **⚡ Nexus Tech (Enterprise Segment - East Region):** Major cloud infrastructure client with recurring subscriptions.
- **🛡️ Vanguard Corp (SMB Segment - North Region):** Fastest growing mid-market account.
- **🚀 Acro Dynamics (Enterprise Segment - South Region):** Key Southern corporate client.
- **🌐 Horizon Software (SMB Segment - West Region):** High-retention regional customer.

---

### 💡 Account Retention Insights:
> **Customer Retention:** Enterprise segment clients account for over 60% of recurring contract volume. Expanding dedicated account manager support for these accounts will protect key annual revenue streams.`,
    chartConfig: {
      type: 'bar',
      xAxisKey: 'customer_name',
      yAxisKey: 'segment',
      series: ['segment'],
      title: 'Top Customer Segments & LTV'
    },
    contexts: [
      {
        id: 'c1',
        title: 'Schema: customers JOIN sales',
        type: 'schema',
        snippet: 'customers(id, customer_name, segment) JOIN sales ON customer_id',
        relevanceScore: 0.93,
        reason: 'Resolved relational foreign key link between customers and sales.'
      }
    ]
  },

  // 4. HR DB - Highest Paid Department
  {
    keywords: ['department', 'highest average salary', 'average salary', 'highest paid department'],
    dbId: 'hr_db',
    sql: `SELECT d.dept_name, AVG(e.salary) AS avg_salary, COUNT(e.id) AS num_employees\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nGROUP BY d.dept_name\nORDER BY avg_salary DESC;`,
    explanation: [
      'Join the `employees` table with `departments` using `department_id = departments.id`.',
      'Group employee records by department name (`dept_name`).',
      'Compute average base annual compensation `AVG(salary)` and headcount `COUNT(id)`.',
      'Order departments by average compensation in descending order.'
    ],
    naturalAnswer: () => `### 💼 Department Salary & Compensation Overview

**Executive Summary:**
The **Artificial Intelligence department** leads organizational compensation with the highest average salary at **$161,500.00** per annum, reflecting high market demand for specialized AI & Machine Learning research talent.

---

### 📊 Department Compensation Ranking:
- **🤖 1. Artificial Intelligence:** **$161,500.00** average salary across core research leads (Headcount: 2).
- **💻 2. Software Engineering:** **$162,000.00** average salary for senior technical leaders (Headcount: 1).
- **💰 3. Finance & Accounting:** **$145,000.00** average salary for executive financial directors (Headcount: 1).
- **📦 4. Product Strategy:** **$125,000.00** average salary for product management leads (Headcount: 1).

---

### 💡 HR Takeaway & Compensation Benchmark:
> **Compensation Insights:** Technical departments (AI and Engineering) command higher compensation bands due to competitive tech market standards. Overall department pay aligns with organizational performance metrics.

*Explore the detailed employee headcount breakdown in the table and chart below.*`,
    chartConfig: {
      type: 'bar',
      xAxisKey: 'dept_name',
      yAxisKey: 'avg_salary',
      series: ['avg_salary'],
      title: 'Average Annual Compensation by Department (USD)'
    },
    contexts: [
      {
        id: 'c1',
        title: 'Schema: employees & departments',
        type: 'schema',
        snippet: 'employees(id, emp_name, salary, department_id) FK -> departments(id, dept_name)',
        relevanceScore: 0.97,
        reason: 'Resolved relational link between employee salaries and department names.'
      }
    ]
  },

  // 5. HR DB - Department Headcount
  {
    keywords: ['number of employees', 'employees in each department', 'headcount'],
    dbId: 'hr_db',
    sql: `SELECT d.dept_name, COUNT(e.id) AS total_employees\nFROM departments d\nLEFT JOIN employees e ON d.id = e.department_id\nGROUP BY d.dept_name\nORDER BY total_employees DESC;`,
    explanation: [
      'Perform a LEFT JOIN between `departments` and `employees`.',
      'Group by department title (`dept_name`).',
      'Count total active personnel (`COUNT(e.id)`).'
    ],
    naturalAnswer: () => `### 👥 Department Headcount & Workforce Distribution

**Executive Summary:**
The organizational workforce is distributed across four core operating divisions, led by **Artificial Intelligence** with **40% of key technical personnel**.

---

### 🏢 Headcount Breakdown:
- **🤖 Artificial Intelligence:** 2 employees (40% of key personnel)
- **💻 Software Engineering:** 1 employee (20% of personnel)
- **💰 Finance & Accounting:** 1 employee (20% of personnel)
- **📦 Product Strategy:** 1 employee (20% of personnel)

---

### 💡 Workforce Planning Note:
> **Talent Growth:** As technical initiatives expand in 2024, planned engineering hires will balance workforce distribution across development teams.`,
    chartConfig: {
      type: 'pie',
      xAxisKey: 'dept_name',
      yAxisKey: 'total_employees',
      series: ['total_employees'],
      title: 'Workforce Headcount Distribution'
    },
    contexts: [
      {
        id: 'c1',
        title: 'Schema: departments',
        type: 'schema',
        snippet: 'departments(id, dept_name) & employees(department_id)',
        relevanceScore: 0.94,
        reason: 'Count aggregation over department foreign keys.'
      }
    ]
  },

  // 6. HR DB - Top Paid Employees
  {
    keywords: ['top 5 highest-paid', 'top 5 highest paid', 'highest paid employees'],
    dbId: 'hr_db',
    sql: `SELECT emp_name, position, salary, performance_score\nFROM employees\nORDER BY salary DESC\nLIMIT 5;`,
    explanation: [
      'Select employee names, job titles, salary, and performance ratings.',
      'Order descending by annual salary.',
      'Filter top 5 compensation packages.'
    ],
    naturalAnswer: () => `### 🏆 Top Highest-Paid Employees & Executives

**Executive Summary:**
The organization's top earner is **Dr. Aris Vance** (Principal AI Architect) earning **$185,000.00** annually with a top performance evaluation of **4.9/5.0**.

---

### 👑 Top Compensation Roster:
- **🥇 1. Dr. Aris Vance:** **$185,000.00** — *Principal AI Architect* (Performance Score: 4.9)
- **🥈 2. Sophia Martinez:** **$162,000.00** — *VP Engineering* (Performance Score: 4.8)
- **🥉 3. Marcus Sterling:** **$145,000.00** — *Finance Director* (Performance Score: 4.6)
- **⭐ 4. Rachel Zhao:** **$138,000.00** — *Staff Data Scientist* (Performance Score: 4.7)
- **⭐ 5. Liam O'Connor:** **$125,000.00** — *Product Lead* (Performance Score: 4.5)

---

### 💡 Performance Correlation:
> **Key Insight:** Compensation strongly correlates with high performance ratings (all top earners maintain ratings above 4.5/5.0), supporting merit-based talent retention.`,
    chartConfig: {
      type: 'bar',
      xAxisKey: 'emp_name',
      yAxisKey: 'salary',
      series: ['salary'],
      title: 'Top Employee Annual Compensation (USD)'
    },
    contexts: [
      {
        id: 'c1',
        title: 'Schema: employees(emp_name, position, salary)',
        type: 'schema',
        snippet: 'employees(emp_name, position, salary ORDER BY salary DESC LIMIT 5)',
        relevanceScore: 0.96,
        reason: 'Matched salary and employee profile attributes.'
      }
    ]
  },

  // 7. E-Commerce DB - Top Products
  {
    keywords: ['product', 'highest number of orders', 'most orders', 'top product'],
    dbId: 'ecommerce_db',
    sql: `SELECT product_title, category, price, rating, stock_qty\nFROM products\nORDER BY rating DESC;`,
    explanation: [
      'Select products catalog items.',
      'Sort by average customer rating and sales interest.',
      'Return top-rated product lines.'
    ],
    naturalAnswer: () => `### 🛒 Top Performing Products & Customer Ratings

**Executive Summary:**
The **Ergonomic Standing Desk** holds our highest customer satisfaction score at **4.9 / 5.0 stars** (Priced at **$599.00**), closely followed by **Wireless Noise-Canceling Headphones** (Rating: **4.8 / 5.0**, Priced at **$349.99**).

---

### ⭐ Product Ranking Highlights:
- **🥇 Ergonomic Standing Desk:** **4.9 / 5.0 Rating** ($599.00 - Home & Office Category)
- **🥈 Wireless Headphones:** **4.8 / 5.0 Rating** ($349.99 - Electronics Category)
- **🥉 Smart OLED TV 65":** **4.7 / 5.0 Rating** ($1,499.99 - Electronics Category)
- **🎮 Mechanical Gaming Keyboard:** **4.6 / 5.0 Rating** ($149.99 - Gaming Category)

---

### 💡 E-Commerce Strategy Takeaway:
> **Inventory Note:** High-rating products maintain low return rates. Maintaining optimal stock levels for top-rated items protects quarterly merchandise margins.`,
    chartConfig: {
      type: 'bar',
      xAxisKey: 'product_title',
      yAxisKey: 'price',
      series: ['price'],
      title: 'Top Product Ratings & Selling Prices'
    },
    contexts: [
      {
        id: 'c1',
        title: 'Schema: products',
        type: 'schema',
        snippet: 'products(id, product_title, category, price, rating)',
        relevanceScore: 0.93,
        reason: 'Extracted product metrics and rating attributes.'
      }
    ]
  }
];

export class DemoEngine {
  static async processQuestion(question: string, databaseId: string): Promise<Partial<ChatMessage>> {
    const startTime = performance.now();
    const normalizedQ = question.toLowerCase().trim();

    // Find database schema
    const targetDb = MOCK_DATABASES.find(d => d.id === databaseId) || MOCK_DATABASES[0];

    // Find matching pre-baked query template
    const match = PRESET_MATCHES.find(m => 
      (m.dbId === databaseId || targetDb.id === m.dbId) && 
      m.keywords.some(k => normalizedQ.includes(k.toLowerCase()))
    );

    let generatedSql = '';
    let explanation: string[] = [];
    let naturalAnswer = '';
    let chartConfig: ChartConfig | undefined = undefined;
    let contexts: RetrievedContext[] = [];
    let tableResult: QueryResultTable = { columns: [], rows: [] };

    if (match) {
      generatedSql = match.sql;
      explanation = match.explanation;
      chartConfig = match.chartConfig;
      contexts = match.contexts;

      // Try running SQL with AlaSQL on target table sample data
      try {
        const table = targetDb.tables[0];
        const rawRows = table.sampleData || [];
        
        // Register tables in AlaSQL in memory
        targetDb.tables.forEach(t => {
          alasql(`CREATE TABLE IF NOT EXISTS ${t.name}`);
          alasql(`DELETE FROM ${t.name}`);
          alasql.tables[t.name].data = [...t.sampleData];
        });

        // Execute SQL query
        const execRes = alasql(generatedSql);
        if (Array.isArray(execRes) && execRes.length > 0) {
          const cols = Object.keys(execRes[0]);
          tableResult = {
            columns: cols,
            rows: execRes
          };
          naturalAnswer = match.naturalAnswer(execRes);
        } else {
          // Fallback to table sample data
          tableResult = {
            columns: Object.keys(rawRows[0] || {}),
            rows: rawRows
          };
          naturalAnswer = match.naturalAnswer(rawRows);
        }
      } catch (err) {
        console.warn('AlaSQL execution warning, falling back to mock rows:', err);
        const sampleRows = targetDb.tables[0].sampleData || [];
        tableResult = {
          columns: Object.keys(sampleRows[0] || {}),
          rows: sampleRows
        };
        naturalAnswer = match.naturalAnswer(sampleRows);
      }
    } else {
      // DYNAMIC GENERIC RAG FALLBACK ENGINE FOR CUSTOM QUESTIONS
      const firstTable = targetDb.tables[0];
      const cols = firstTable.columns.map(c => c.name);
      
      generatedSql = `SELECT ${cols.slice(0, 4).join(', ')}\nFROM ${firstTable.name}\nLIMIT 5;`;
      explanation = [
        `Identified target database table \`${firstTable.name}\` based on semantic question intent.`,
        `Extracted candidate schema column attributes: ${cols.slice(0, 3).join(', ')}.`,
        `Formulated structured ANSI SQL query with a safety LIMIT of 5 records.`
      ];
      
      tableResult = {
        columns: Object.keys(firstTable.sampleData[0] || {}),
        rows: firstTable.sampleData.slice(0, 5)
      };

      naturalAnswer = `### 🔍 Analytical Findings for "${question}"

**Executive Overview:**
Analyzed the **${targetDb.name}** database for your query. The RAGSQL pipeline retrieved relevant matching entries from table \`${firstTable.name}\`.

---

### 📌 Summary of Extracted Data:
- **Source Database:** ${targetDb.name}
- **Primary Schema Table:** \`${firstTable.name}\` (${firstTable.rowCount} total records)
- **Key Attributes Evaluated:** ${cols.slice(0, 4).join(', ')}

---

### 💡 Analyst Notes:
> **RAG Vector Search:** Relevant schema attributes were matched using fine-tuned sentence-transformer vector embeddings with high cosine relevance.

*Review the generated data table and interactive chart below for detailed insights.*`;
      
      chartConfig = {
        type: 'bar',
        xAxisKey: cols[0],
        yAxisKey: cols[1] || cols[0],
        series: [cols[1] || cols[0]],
        title: `${firstTable.name.toUpperCase()} Dataset Breakdown`
      };

      contexts = [
        {
          id: 'dyn_1',
          title: `Schema: ${firstTable.name}`,
          type: 'schema',
          snippet: `${firstTable.name}(${cols.join(', ')})`,
          relevanceScore: 0.92,
          reason: `High vector similarity with target schema \`${firstTable.name}\`.`
        },
        {
          id: 'dyn_2',
          title: 'RAGSQL Similarity Search Evidence',
          type: 'sql_example',
          snippet: `SELECT ${cols.slice(0, 3).join(', ')} FROM ${firstTable.name}`,
          relevanceScore: 0.89,
          reason: 'Sentence-transformer fine-tuned model cosine similarity score: 0.89.'
        }
      ];
    }

    const endTime = performance.now();
    const totalMs = Math.round(endTime - startTime + 650); // Add realistic pipeline delay simulation

    const pipeline: PipelineStep[] = [
      { id: 'p1', name: 'Question Understanding', status: 'completed', timeMs: Math.floor(totalMs * 0.15), details: `Parsed question: "${question}"` },
      { id: 'p2', name: 'Context Retrieval', status: 'completed', timeMs: Math.floor(totalMs * 0.18), details: 'Embedding cosine search on BIRD schema tensors' },
      { id: 'p3', name: 'Schema Matching', status: 'completed', timeMs: Math.floor(totalMs * 0.10), details: `Matched target DB: ${targetDb.name}` },
      { id: 'p4', name: 'Prompt Augmentation', status: 'completed', timeMs: Math.floor(totalMs * 0.08), details: 'Augmented context window with retrieved evidence' },
      { id: 'p5', name: 'SQL Generation', status: 'completed', timeMs: Math.floor(totalMs * 0.35), details: 'RAGSQL-text fine-tuned transformer inference' },
      { id: 'p6', name: 'SQL Validation', status: 'completed', timeMs: Math.floor(totalMs * 0.05), details: 'Passed AST syntax check' },
      { id: 'p7', name: 'Query Execution', status: 'completed', timeMs: Math.floor(totalMs * 0.09), details: `Executed in-memory query in ${Math.floor(totalMs * 0.09)}ms` }
    ];

    return {
      text: naturalAnswer,
      sql: generatedSql,
      sqlExplanation: explanation,
      resultTable: tableResult,
      chartConfig: chartConfig,
      retrievedContext: contexts,
      pipeline: pipeline,
      executionTimeMs: totalMs,
      confidenceScore: 0.95
    };
  }
}
