import Dexie, { type Table } from "dexie";

// 1. Strict TypeScript Interfaces and Types
export type ClientStatus =
  | "Lead"
  | "Kontaktovaný"
  | "Nacenenie"
  | "Vo vývoji"
  | "Čaká sa"
  | "Dokončené"
  | "Odmietnuté";

export type ClientService =
  | "Web stránka"
  | "SEO"
  | "Google Ads"
  | "Booking systém"
  | "PWA aplikácia"
  | "CMS"
  | "Automatizácia"
  | "Iné";

export interface ClientTask {
  id: string;
  text: string;
  done: boolean;
  dueDate?: string; // ISO date string (YYYY-MM-DD)
  createdAt: number;
  updatedAt: number;
}

export interface ClientActivity {
  id?: number;
  clientId: number;
  type: "note" | "call" | "email" | "meeting" | "proposal" | "status_change";
  title: string;
  content?: string;
  createdAt: number;
}

export interface Client {
  id?: number;
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  service: ClientService | string;
  status: ClientStatus | string;
  budget?: string;
  notes?: string;
  tasks?: ClientTask[];
  createdAt: number;
  updatedAt: number;
  deletedAt?: number | null;
  syncStatus: "synced" | "pending" | "error";
}

export interface OfflineQueueItem {
  id?: number;
  entityType: "client" | "task" | "activity";
  entityId: string | number;
  action: "create" | "update" | "delete";
  payload: unknown;
  createdAt: number;
  retryCount: number;
  lastError?: string;
}

// 2. Class extending Dexie
export class NexifyDatabase extends Dexie {
  clients!: Table<Client>;
  activities!: Table<ClientActivity>;
  offlineQueue!: Table<OfflineQueueItem>;

  constructor() {
    super("NexifyDatabase");
    
    // 3. Schema history and definition
    this.version(1).stores({
      clients: "++id, name, email, createdAt",
      offlineQueue: "++id, action, createdAt",
    });

    this.version(2).stores({
      clients: "++id, name, email, status, service, createdAt",
    });

    // Version 3: Upgraded offline-first schema
    this.version(3).stores({
      clients: "++id, companyName, contactName, email, service, status, budget, createdAt, updatedAt, deletedAt, syncStatus",
      activities: "++id, clientId, type, createdAt",
      offlineQueue: "++id, entityType, entityId, action, createdAt, retryCount",
    }).upgrade(async (tx) => {
      // Safe migration logic
      await tx.table("clients").toCollection().modify((oldClient: {
        name?: string;
        companyName?: string;
        contactPerson?: string;
        contactName?: string;
        createdAt?: number;
        updatedAt?: number;
        deletedAt?: number | null;
        syncStatus?: string;
        tasks?: Array<{
          id: string;
          text: string;
          done: boolean;
          dueDate?: string;
          createdAt: number;
          updatedAt?: number;
        }>;
      }) => {
        // Map old name -> companyName
        if (oldClient.name && !oldClient.companyName) {
          oldClient.companyName = oldClient.name;
        }
        // Map old contactPerson -> contactName
        if (oldClient.contactPerson && !oldClient.contactName) {
          oldClient.contactName = oldClient.contactPerson;
        }

        // Fill missing defaults
        if (!oldClient.createdAt) oldClient.createdAt = Date.now();
        if (!oldClient.updatedAt) oldClient.updatedAt = oldClient.createdAt;
        if (oldClient.deletedAt === undefined) oldClient.deletedAt = null;
        if (!oldClient.syncStatus) oldClient.syncStatus = "synced";

        // Migrate sub-tasks if they exist to include updatedAt
        if (Array.isArray(oldClient.tasks)) {
          oldClient.tasks = oldClient.tasks.map((task) => ({
            ...task,
            updatedAt: task.updatedAt || task.createdAt || Date.now(),
          }));
        }

        // Clean up obsolete fields
        delete oldClient.name;
        delete oldClient.contactPerson;
      });

      // Migrate existing items in the offlineQueue to match the version 3 schema
      await tx.table("offlineQueue").toCollection().modify((oldItem: {
        entityType?: string;
        entityId?: string | number;
        action?: string;
        retryCount?: number;
        payload?: unknown;
      }) => {
        if (!oldItem.entityType) {
          oldItem.entityType = "client";
          const payload = oldItem.payload as Record<string, unknown> | undefined;
          oldItem.entityId = payload?.id ? String(payload.id) : "unknown";
          oldItem.action = oldItem.action === "CREATE_CLIENT" ? "create" : "update";
          oldItem.retryCount = 0;
        }
      });
    });
  }
}

// Export singleton instance
export const db = new NexifyDatabase();
