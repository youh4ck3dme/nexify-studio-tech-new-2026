import Dexie, { type Table } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

// 1. Strict TypeScript Interfaces
export interface Client {
  id?: number;
  name: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  status: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface OfflineQueueItem {
  id?: number;
  action: string;
  payload: unknown;
  createdAt: number;
  updatedAt: number;
}

// 2. Class extending Dexie
export class NexifyDatabase extends Dexie {
  clients!: Table<Client>;
  offlineQueue!: Table<OfflineQueueItem>;

  constructor() {
    super("NexifyDatabase");
    
    // 3. Schema definition
    // ++id means auto-increment. We also index fields we might query by.
    this.version(1).stores({
      clients: "++id, name, email, createdAt",
      offlineQueue: "++id, action, createdAt",
    });

    // Version 2: Pridanie nových polí a indexov pre vyhľadávanie/filtrovanie
    this.version(2).stores({
      clients: "++id, name, email, status, service, createdAt",
    });
  }
}

// Export singleton instance
export const db = new NexifyDatabase();

// 4. Custom React Hook
export function useOfflineData() {
  // useLiveQuery will re-render the component whenever the underlying table changes
  const clients = useLiveQuery(() => db.clients.orderBy("createdAt").reverse().toArray(), []);
  const offlineQueue = useLiveQuery(() => db.offlineQueue.orderBy("createdAt").toArray(), []);

  return {
    clients: clients ?? [],
    offlineQueue: offlineQueue ?? [],
    // If undefined is returned, it means the query is still loading
    isLoading: clients === undefined || offlineQueue === undefined,
  };
}
