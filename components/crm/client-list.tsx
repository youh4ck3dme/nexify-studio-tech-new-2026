"use client";

import { useOfflineData, db } from "@/lib/db";
import { format } from "date-fns";
import { CloudOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClientList() {
  const { clients, offlineQueue, isLoading } = useOfflineData();

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await db.clients.delete(id);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Načítavam klientov...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display">Zoznam klientov</h2>
        {offlineQueue.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
            <CloudOff className="w-4 h-4" />
            Čaká na sync: {offlineQueue.length}
          </div>
        )}
      </div>

      {clients.length === 0 ? (
        <div className="p-12 text-center border border-border border-dashed rounded-xl text-muted-foreground">
          Zatiaľ nemáte žiadnych klientov. Formulár funguje aj v offline režime!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {clients.map((client) => (
            <div key={client.id} className="p-4 border border-border rounded-xl bg-card hover-lift transition-all relative group">
              <div className="pr-10">
                <div className="font-medium text-lg">{client.name}</div>
                <div className="text-muted-foreground text-sm font-mono mt-1">{client.email}</div>
                <div className="text-muted-foreground text-sm mt-4">
                  Pridané: {format(client.createdAt, "dd.MM.yyyy HH:mm")}
                </div>
              </div>
              <button 
                onClick={() => handleDelete(client.id)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Zmazať"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
