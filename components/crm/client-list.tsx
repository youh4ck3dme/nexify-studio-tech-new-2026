"use client";

import { useOfflineData, db } from "@/lib/db";
import { format } from "date-fns";
import { CloudOff, Trash2, Mail, Phone, User, Briefcase, FileText } from "lucide-react";

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
        <h2 className="text-2xl font-display text-white">Zoznam klientov</h2>
        {offlineQueue.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
            <CloudOff className="w-4 h-4" />
            Čaká na sync: {offlineQueue.length}
          </div>
        )}
      </div>

      {clients.length === 0 ? (
        <div className="p-12 text-center border border-white/10 border-dashed rounded-xl text-white/50 bg-black/40 backdrop-blur-md">
          Zatiaľ nemáte žiadnych klientov. Formulár funguje aj v offline režime!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {clients.map((client) => {
            let statusColor = "bg-white/10 text-white";
            if (client.status === "Vo vývoji") statusColor = "bg-blue-500/20 text-blue-400 border-blue-500/30";
            if (client.status === "Dokončené") statusColor = "bg-green-500/20 text-green-400 border-green-500/30";
            if (client.status === "Odmietnuté") statusColor = "bg-red-500/20 text-red-400 border-red-500/30";
            if (client.status === "Nacenenie") statusColor = "bg-purple-500/20 text-purple-400 border-purple-500/30";

            return (
              <div key={client.id} className="p-5 border border-white/10 rounded-xl bg-black/60 backdrop-blur-xl hover:bg-white/5 transition-all relative group flex flex-col gap-3">
                
                {/* Header - Name & Status */}
                <div className="flex justify-between items-start pr-8">
                  <div>
                    <h3 className="font-medium text-lg text-white">{client.name}</h3>
                    {client.contactPerson && (
                      <div className="flex items-center gap-1.5 text-white/60 text-sm mt-1">
                        <User className="w-3.5 h-3.5" />
                        {client.contactPerson}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs px-2.5 py-1 rounded-full border ${statusColor}`}>
                    {client.status}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                  <div className="flex items-center gap-1.5 text-sm font-mono text-white/80">
                    <Mail className="w-3.5 h-3.5 text-white/40" />
                    <a href={`mailto:${client.email}`} className="hover:text-white transition-colors">{client.email}</a>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-1.5 text-sm font-mono text-white/80">
                      <Phone className="w-3.5 h-3.5 text-white/40" />
                      <a href={`tel:${client.phone}`} className="hover:text-white transition-colors">{client.phone}</a>
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {client.service && (
                    <div className="flex items-center gap-1.5 text-xs bg-white/5 px-2 py-1 rounded-md text-white/70 border border-white/5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {client.service}
                    </div>
                  )}
                  {client.budget && (
                    <div className="flex items-center gap-1.5 text-xs bg-white/5 px-2 py-1 rounded-md text-white/70 border border-white/5">
                      💳 {client.budget}
                    </div>
                  )}
                </div>

                {/* Notes */}
                {client.notes && (
                  <div className="mt-2 pt-3 border-t border-white/5">
                    <div className="flex items-start gap-2 text-sm text-white/60">
                      <FileText className="w-4 h-4 mt-0.5 text-white/40 shrink-0" />
                      <p className="line-clamp-2">{client.notes}</p>
                    </div>
                  </div>
                )}

                {/* Metadata & Actions */}
                <div className="mt-2 text-white/40 text-xs flex justify-between items-center">
                  <span>Pridané: {format(client.createdAt, "dd.MM.yyyy HH:mm")}</span>
                </div>

                <button 
                  onClick={() => handleDelete(client.id)}
                  className="absolute top-4 right-4 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Zmazať"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
