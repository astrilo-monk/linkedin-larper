import type { StoredResult } from "./types";

interface ResultStore {
  save(result: StoredResult): Promise<void>;
  get(id: string): Promise<StoredResult | null>;
}

// In-memory store — works for development and single-instance deployments.
// For production on Vercel (serverless), swap this for Vercel KV or Upstash Redis.
const store = new Map<string, StoredResult>();

export const resultStore: ResultStore = {
  async save(result: StoredResult): Promise<void> {
    store.set(result.id, result);
  },
  async get(id: string): Promise<StoredResult | null> {
    return store.get(id) ?? null;
  },
};
