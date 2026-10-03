import { ChatMessage, QueryResultTable } from '../types';
import { DemoEngine } from './demoEngine';
import { StorageService } from './storageService';
import alasql from 'alasql';
import { MOCK_DATABASES } from '../data/mockDatasets';

export interface AskQuestionParams {
  question: string;
  projectId: string;
  databaseId: string;
}

export class RagsqlService {
  /**
   * Main abstraction point for natural language to SQL retrieval & generation.
   */
  static async askQuestion(params: AskQuestionParams): Promise<Partial<ChatMessage>> {
    const settings = StorageService.getSettings();

    // Check if backend API is configured
    const backendUrl = import.meta.env.VITE_RAGSQL_BACKEND_URL;

    if (!settings.demoMode && backendUrl) {
      try {
        const response = await fetch(`${backendUrl}/api/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (err) {
        console.warn('Real RAGSQL backend unavailable, auto-falling back to RAGSQL Demo Engine:', err);
      }
    }

    // Fallback to local RAGSQL Demo Engine
    return await DemoEngine.processQuestion(params.question, params.databaseId);
  }

  /**
   * Executes custom user-edited SQL live against in-memory dataset
   */
  static executeCustomSql(sql: string, databaseId: string): QueryResultTable {
    const targetDb = MOCK_DATABASES.find(d => d.id === databaseId) || MOCK_DATABASES[0];

    try {
      // Register tables in AlaSQL in memory
      targetDb.tables.forEach(t => {
        alasql(`CREATE TABLE IF NOT EXISTS ${t.name}`);
        alasql(`DELETE FROM ${t.name}`);
        alasql.tables[t.name].data = [...t.sampleData];
      });

      const cleanSql = sql.trim().replace(/;$/, '');
      const result = alasql(cleanSql);

      if (Array.isArray(result) && result.length > 0) {
        return {
          columns: Object.keys(result[0]),
          rows: result
        };
      }
    } catch (err) {
      console.warn('SQL execution error:', err);
    }

    // Fallback rows
    const firstTable = targetDb.tables[0];
    return {
      columns: Object.keys(firstTable.sampleData[0] || {}),
      rows: firstTable.sampleData
    };
  }
}
