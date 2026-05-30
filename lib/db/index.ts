import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./core";

// Re-export core for backwards compatibility
export * from "./core";

// Custom React Hook
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
