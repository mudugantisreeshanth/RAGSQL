import { DatabaseSchema, BenchmarkMetrics } from '../types';

export const BENCHMARK_PAPER_METRICS: BenchmarkMetrics[] = [
  {
    modelName: 'all-mpnet-base-v2',
    size: '110M',
    embDim: '768',
    mtebBench: 43.81,
    qEvdInDb: 65.11,
    qEvdOutDb: 63.59,
    qSqlInDb: 67.69,
    qSqlOutDb: 70.93,
  },
  {
    modelName: 'all-MiniLM-L6-v2 (Baseline)',
    size: '23M',
    embDim: '384',
    mtebBench: 41.95,
    qEvdInDb: 75.55,
    qEvdOutDb: 70.23,
    qSqlInDb: 68.86,
    qSqlOutDb: 71.56,
  },
  {
    modelName: 'OpenAI-3-small',
    size: 'API',
    embDim: '1536',
    mtebBench: 51.08,
    qEvdInDb: 80.53,
    qEvdOutDb: 75.01,
    qSqlInDb: 81.56,
    qSqlOutDb: 81.34,
  },
  {
    modelName: 'OpenAI-3-large',
    size: 'API',
    embDim: '3072',
    mtebBench: 55.44,
    qEvdInDb: 80.27,
    qEvdOutDb: 75.08,
    qSqlInDb: 87.85,
    qSqlOutDb: 88.10,
  },
  {
    modelName: 'OpenAI-ada-002',
    size: 'API',
    embDim: '1536',
    mtebBench: 49.25,
    qEvdInDb: 81.62,
    qEvdOutDb: 76.53,
    qSqlInDb: 82.00,
    qSqlOutDb: 80.62,
  },
  {
    modelName: 'Cohere-eng-v3',
    size: 'API',
    embDim: '1024',
    mtebBench: 55.00,
    qEvdInDb: 80.66,
    qEvdOutDb: 76.36,
    qSqlInDb: 67.49,
    qSqlOutDb: 70.53,
  },
  {
    modelName: 'RAGSQL-text (Fine-tuned)',
    size: '23M',
    embDim: '384',
    mtebBench: 41.95,
    qEvdInDb: 91.80,
    qEvdOutDb: 84.99,
    qSqlInDb: 84.50,
    qSqlOutDb: 83.07,
    isFineTuned: true,
    highlighted: true,
  },
  {
    modelName: 'RAGSQL-code (Fine-tuned)',
    size: '23M',
    embDim: '384',
    mtebBench: 41.95,
    qEvdInDb: 85.21,
    qEvdOutDb: 77.91,
    qSqlInDb: 93.02,
    qSqlOutDb: 89.62,
    isFineTuned: true,
    highlighted: true,
  }
];

export const MOCK_DATABASES: DatabaseSchema[] = [
  {
    id: 'sales_db',
    name: 'Sales Analytics',
    description: 'Enterprise revenue, regional performance, products, and customer order records.',
    totalTables: 5,
    totalRows: 12450,
    tables: [
      {
        name: 'sales',
        description: 'Historical revenue transactions aggregated by region, date, and customer',
        rowCount: 4850,
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique transaction ID', sampleValues: [1001, 1002, 1003, 1004] },
          { name: 'region', type: 'VARCHAR(50)', description: 'Geographic sales territory', sampleValues: ['West', 'East', 'North', 'South'] },
          { name: 'revenue', type: 'DECIMAL(12,2)', description: 'Total gross sales in USD', sampleValues: [12400000, 8900000, 6500000, 4200000] },
          { name: 'profit', type: 'DECIMAL(12,2)', description: 'Net profit margin', sampleValues: [3100000, 2200000, 1400000, 950000] },
          { name: 'year', type: 'INTEGER', description: 'Transaction year', sampleValues: [2024, 2024, 2023, 2024] },
          { name: 'month', type: 'VARCHAR(20)', description: 'Transaction month', sampleValues: ['Jan', 'Feb', 'Mar', 'Apr'] },
          { name: 'date', type: 'DATE', description: 'ISO date string', sampleValues: ['2024-01-15', '2024-02-18', '2024-03-22'] },
          { name: 'customer_id', type: 'INTEGER', isForeignKey: true, references: 'customers.id', description: 'Associated customer ID', sampleValues: [501, 502, 503] }
        ],
        sampleData: [
          { id: 1001, region: 'West', revenue: 12400000, profit: 3100000, year: 2024, month: 'Jan', date: '2024-01-15', customer_id: 501 },
          { id: 1002, region: 'East', revenue: 8900000, profit: 2200000, year: 2024, month: 'Feb', date: '2024-02-18', customer_id: 502 },
          { id: 1003, region: 'North', revenue: 6500000, profit: 1400000, year: 2024, month: 'Mar', date: '2024-03-22', customer_id: 503 },
          { id: 1004, region: 'South', revenue: 4200000, profit: 950000, year: 2024, month: 'Apr', date: '2024-04-10', customer_id: 504 },
          { id: 1005, region: 'West', revenue: 11800000, profit: 2950000, year: 2023, month: 'Dec', date: '2023-12-05', customer_id: 505 }
        ]
      },
      {
        name: 'customers',
        description: 'Corporate and enterprise customer database',
        rowCount: 1200,
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, description: 'Customer ID', sampleValues: [501, 502, 503] },
          { name: 'customer_name', type: 'VARCHAR(100)', description: 'Company or individual name', sampleValues: ['Apex Global', 'Nexus Tech', 'Vanguard Corp', 'Acro Dynamics'] },
          { name: 'segment', type: 'VARCHAR(50)', description: 'Market segment (Enterprise, SMB, Consumer)', sampleValues: ['Enterprise', 'SMB', 'Consumer'] },
          { name: 'region', type: 'VARCHAR(50)', description: 'Customer territory', sampleValues: ['West', 'East', 'North'] },
          { name: 'joined_date', type: 'DATE', description: 'Account creation date', sampleValues: ['2021-04-12', '2022-08-01'] }
        ],
        sampleData: [
          { id: 501, customer_name: 'Apex Global', segment: 'Enterprise', region: 'West', joined_date: '2021-04-12' },
          { id: 502, customer_name: 'Nexus Tech', segment: 'Enterprise', region: 'East', joined_date: '2022-08-01' },
          { id: 503, customer_name: 'Vanguard Corp', segment: 'SMB', region: 'North', joined_date: '2023-01-15' },
          { id: 504, customer_name: 'Acro Dynamics', segment: 'Enterprise', region: 'South', joined_date: '2020-11-30' },
          { id: 505, customer_name: 'Horizon Software', segment: 'SMB', region: 'West', joined_date: '2022-03-19' }
        ]
      },
      {
        name: 'products',
        description: 'Catalog of software subscriptions and enterprise solutions',
        rowCount: 450,
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, description: 'Product SKU ID', sampleValues: [201, 202, 203] },
          { name: 'product_name', type: 'VARCHAR(100)', description: 'Product Title', sampleValues: ['Cloud Suite Pro', 'Data Analytics Engine', 'Cyber Shield Premium', 'AI Assistant Pro'] },
          { name: 'category', type: 'VARCHAR(50)', description: 'Product Category', sampleValues: ['Cloud Infrastructure', 'Analytics', 'Security', 'AI'] },
          { name: 'unit_price', type: 'DECIMAL(10,2)', description: 'Selling price per license', sampleValues: [499.00, 1299.00, 899.00, 299.00] },
          { name: 'cost_price', type: 'DECIMAL(10,2)', description: 'Base COGS cost', sampleValues: [150.00, 400.00, 250.00, 80.00] }
        ],
        sampleData: [
          { id: 201, product_name: 'Cloud Suite Pro', category: 'Cloud Infrastructure', unit_price: 499.00, cost_price: 150.00 },
          { id: 202, product_name: 'Data Analytics Engine', category: 'Analytics', unit_price: 1299.00, cost_price: 400.00 },
          { id: 203, product_name: 'Cyber Shield Premium', category: 'Security', unit_price: 899.00, cost_price: 250.00 },
          { id: 204, product_name: 'AI Assistant Pro', category: 'AI', unit_price: 299.00, cost_price: 80.00 }
        ]
      },
      {
        name: 'orders',
        description: 'Individual order line items and status',
        rowCount: 5800,
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, description: 'Order ID', sampleValues: [8001, 8002] },
          { name: 'customer_id', type: 'INTEGER', isForeignKey: true, references: 'customers.id', description: 'Customer ID', sampleValues: [501, 502] },
          { name: 'product_id', type: 'INTEGER', isForeignKey: true, references: 'products.id', description: 'Product ID', sampleValues: [201, 202] },
          { name: 'order_date', type: 'DATE', description: 'Date order placed', sampleValues: ['2024-01-10', '2024-02-14'] },
          { name: 'year', type: 'INTEGER', description: 'Order Year', sampleValues: [2024, 2024] },
          { name: 'month', type: 'VARCHAR(20)', description: 'Order Month', sampleValues: ['Jan', 'Feb'] },
          { name: 'total_amount', type: 'DECIMAL(10,2)', description: 'Order total amount', sampleValues: [4990.00, 12990.00] },
          { name: 'quantity', type: 'INTEGER', description: 'License units', sampleValues: [10, 10] },
          { name: 'status', type: 'VARCHAR(20)', description: 'Fulfillment status', sampleValues: ['Completed', 'Pending', 'Shipped'] }
        ],
        sampleData: [
          { id: 8001, customer_id: 501, product_id: 201, order_date: '2024-01-10', year: 2024, month: 'Jan', total_amount: 4990.00, quantity: 10, status: 'Completed' },
          { id: 8002, customer_id: 502, product_id: 202, order_date: '2024-02-14', year: 2024, month: 'Feb', total_amount: 12990.00, quantity: 10, status: 'Completed' },
          { id: 8003, customer_id: 503, product_id: 204, order_date: '2024-03-05', year: 2024, month: 'Mar', total_amount: 5980.00, quantity: 20, status: 'Completed' }
        ]
      },
      {
        name: 'regions',
        description: 'Territory management and sales target tracking',
        rowCount: 4,
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, description: 'Region ID', sampleValues: [1, 2, 3, 4] },
          { name: 'region_name', type: 'VARCHAR(50)', description: 'Region Name', sampleValues: ['West', 'East', 'North', 'South'] },
          { name: 'manager', type: 'VARCHAR(100)', description: 'VP of Sales', sampleValues: ['Sarah Jenkins', 'Michael Chang', 'Elena Rostova', 'David Vance'] },
          { name: 'target_revenue_2024', type: 'DECIMAL(12,2)', description: 'Annual target target', sampleValues: [15000000, 10000000, 8000000, 5000000] }
        ],
        sampleData: [
          { id: 1, region_name: 'West', manager: 'Sarah Jenkins', target_revenue_2024: 15000000 },
          { id: 2, region_name: 'East', manager: 'Michael Chang', target_revenue_2024: 10000000 },
          { id: 3, region_name: 'North', manager: 'Elena Rostova', target_revenue_2024: 8000000 },
          { id: 4, region_name: 'South', manager: 'David Vance', target_revenue_2024: 5000000 }
        ]
      }
    ]
  },
  {
    id: 'hr_db',
    name: 'HR Analytics',
    description: 'Employee headcount, department compensation, performance ratings, and organizational structure.',
    totalTables: 4,
    totalRows: 3400,
    tables: [
      {
        name: 'employees',
        description: 'Active employee master directory',
        rowCount: 1200,
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, description: 'Employee ID', sampleValues: [101, 102, 103] },
          { name: 'emp_name', type: 'VARCHAR(100)', description: 'Full Name', sampleValues: ['Dr. Aris Vance', 'Sophia Martinez', 'Marcus Sterling', 'Rachel Zhao'] },
          { name: 'email', type: 'VARCHAR(100)', description: 'Work Email', sampleValues: ['aris.v@company.com', 'sophia.m@company.com'] },
          { name: 'department_id', type: 'INTEGER', isForeignKey: true, references: 'departments.id', description: 'Department ID', sampleValues: [1, 2, 3] },
          { name: 'salary', type: 'DECIMAL(10,2)', description: 'Current Annual Salary in USD', sampleValues: [185000.00, 162000.00, 145000.00, 128000.00] },
          { name: 'hire_date', type: 'DATE', description: 'Date of joining', sampleValues: ['2019-03-15', '2020-07-01'] },
          { name: 'position', type: 'VARCHAR(100)', description: 'Job Title', sampleValues: ['Principal AI Architect', 'VP Engineering', 'Senior Data Scientist', 'Financial Analyst'] },
          { name: 'performance_score', type: 'DECIMAL(3,2)', description: 'Latest performance evaluation (1.0 - 5.0)', sampleValues: [4.9, 4.8, 4.6, 4.5] }
        ],
        sampleData: [
          { id: 101, emp_name: 'Dr. Aris Vance', email: 'aris.v@company.com', department_id: 1, salary: 185000.00, hire_date: '2019-03-15', position: 'Principal AI Architect', performance_score: 4.9 },
          { id: 102, emp_name: 'Sophia Martinez', email: 'sophia.m@company.com', department_id: 2, salary: 162000.00, hire_date: '2020-07-01', position: 'VP Engineering', performance_score: 4.8 },
          { id: 103, emp_name: 'Marcus Sterling', email: 'marcus.s@company.com', department_id: 3, salary: 145000.00, hire_date: '2018-11-12', position: 'Finance Director', performance_score: 4.6 },
          { id: 104, emp_name: 'Rachel Zhao', email: 'rachel.z@company.com', department_id: 1, salary: 138000.00, hire_date: '2021-02-20', position: 'Staff Data Scientist', performance_score: 4.7 },
          { id: 105, emp_name: 'Liam O\'Connor', email: 'liam.o@company.com', department_id: 4, salary: 125000.00, hire_date: '2022-05-10', position: 'Product Lead', performance_score: 4.5 }
        ]
      },
      {
        name: 'departments',
        description: 'Organizational divisions and executive leaders',
        rowCount: 6,
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, description: 'Department ID', sampleValues: [1, 2, 3, 4] },
          { name: 'dept_name', type: 'VARCHAR(50)', description: 'Department Name', sampleValues: ['Artificial Intelligence', 'Software Engineering', 'Finance & Accounting', 'Product Strategy', 'Human Resources'] },
          { name: 'manager', type: 'VARCHAR(100)', description: 'Department Lead', sampleValues: ['Dr. Aris Vance', 'Sophia Martinez', 'Marcus Sterling'] },
          { name: 'location', type: 'VARCHAR(100)', description: 'Primary Campus Location', sampleValues: ['Building A - AI Hub', 'Building B - Tech', 'Building C - Exec'] },
          { name: 'budget_2024', type: 'DECIMAL(12,2)', description: 'Annual Department Budget USD', sampleValues: [12000000, 18000000, 6000000, 8000000] }
        ],
        sampleData: [
          { id: 1, dept_name: 'Artificial Intelligence', manager: 'Dr. Aris Vance', location: 'Building A - AI Hub', budget_2024: 12000000 },
          { id: 2, dept_name: 'Software Engineering', manager: 'Sophia Martinez', location: 'Building B - Tech', budget_2024: 18000000 },
          { id: 3, dept_name: 'Finance & Accounting', manager: 'Marcus Sterling', location: 'Building C - Exec', budget_2024: 6000000 },
          { id: 4, dept_name: 'Product Strategy', manager: 'Liam O\'Connor', location: 'Building D - Product', budget_2024: 8000000 }
        ]
      },
      {
        name: 'salaries',
        description: 'Historical salary adjustments and compensation packages',
        rowCount: 1800,
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, description: 'Salary Record ID', sampleValues: [5001, 5002] },
          { name: 'emp_id', type: 'INTEGER', isForeignKey: true, references: 'employees.id', description: 'Employee ID', sampleValues: [101, 102] },
          { name: 'base_salary', type: 'DECIMAL(10,2)', description: 'Base annual pay', sampleValues: [185000.00, 162000.00] },
          { name: 'bonus', type: 'DECIMAL(10,2)', description: 'Annual performance bonus', sampleValues: [35000.00, 28000.00] },
          { name: 'year', type: 'INTEGER', description: 'Fiscal Year', sampleValues: [2024, 2023] }
        ],
        sampleData: [
          { id: 5001, emp_id: 101, base_salary: 185000.00, bonus: 35000.00, year: 2024 },
          { id: 5002, emp_id: 102, base_salary: 162000.00, bonus: 28000.00, year: 2024 },
          { id: 5003, emp_id: 103, base_salary: 145000.00, bonus: 22000.00, year: 2024 }
        ]
      }
    ]
  },
  {
    id: 'ecommerce_db',
    name: 'E-Commerce Intelligence',
    description: 'User engagement, product reviews, payment methods, and digital orders.',
    totalTables: 4,
    totalRows: 18900,
    tables: [
      {
        name: 'products',
        description: 'E-commerce digital catalog items',
        rowCount: 850,
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, description: 'Product ID', sampleValues: [301, 302, 303] },
          { name: 'product_title', type: 'VARCHAR(150)', description: 'Title', sampleValues: ['Wireless Noise-Canceling Headphones', 'Smart OLED TV 65"', 'Ergonomic Standing Desk', 'Mechanical Gaming Keyboard'] },
          { name: 'category', type: 'VARCHAR(50)', description: 'Product Category', sampleValues: ['Electronics', 'Home & Office', 'Gaming'] },
          { name: 'price', type: 'DECIMAL(10,2)', description: 'Retail Price USD', sampleValues: [349.99, 1499.99, 599.00, 149.99] },
          { name: 'rating', type: 'DECIMAL(3,2)', description: 'Average User Rating (1-5 stars)', sampleValues: [4.8, 4.7, 4.9, 4.6] },
          { name: 'stock_qty', type: 'INTEGER', description: 'Inventory stock count', sampleValues: [450, 120, 85, 300] }
        ],
        sampleData: [
          { id: 301, product_title: 'Wireless Noise-Canceling Headphones', category: 'Electronics', price: 349.99, rating: 4.8, stock_qty: 450 },
          { id: 302, product_title: 'Smart OLED TV 65"', category: 'Electronics', price: 1499.99, rating: 4.7, stock_qty: 120 },
          { id: 303, product_title: 'Ergonomic Standing Desk', category: 'Home & Office', price: 599.00, rating: 4.9, stock_qty: 85 },
          { id: 304, product_title: 'Mechanical Gaming Keyboard', category: 'Gaming', price: 149.99, rating: 4.6, stock_qty: 300 }
        ]
      },
      {
        name: 'orders',
        description: 'Customer transactions and order totals',
        rowCount: 14500,
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, description: 'Order ID', sampleValues: [9001, 9002] },
          { name: 'user_id', type: 'INTEGER', isForeignKey: true, references: 'users.id', description: 'User ID', sampleValues: [701, 702] },
          { name: 'order_date', type: 'DATE', description: 'Order Timestamp', sampleValues: ['2024-01-05', '2024-01-12'] },
          { name: 'month', type: 'VARCHAR(20)', description: 'Month String', sampleValues: ['Jan', 'Feb', 'Mar'] },
          { name: 'total_usd', type: 'DECIMAL(10,2)', description: 'Checkout price USD', sampleValues: [349.99, 1499.99] },
          { name: 'status', type: 'VARCHAR(20)', description: 'Status', sampleValues: ['Delivered', 'Processing', 'Cancelled'] }
        ],
        sampleData: [
          { id: 9001, user_id: 701, order_date: '2024-01-05', month: 'Jan', total_usd: 349.99, status: 'Delivered' },
          { id: 9002, user_id: 702, order_date: '2024-01-12', month: 'Jan', total_usd: 1499.99, status: 'Delivered' },
          { id: 9003, user_id: 703, order_date: '2024-02-01', month: 'Feb', total_usd: 748.99, status: 'Delivered' }
        ]
      }
    ]
  }
];
