"use client";

import { useState } from "react";
import { useOfflineData, db, Client } from "@/lib/db";
import { format } from "date-fns";
import { CloudOff, Trash2, Mail, Phone, User, Briefcase, FileText, Search, RotateCcw, Edit, ExternalLink, Globe } from "lucide-react";
import { toast } from "sonner";
import { parseBudget } from "./crm-dashboard";

interface ClientListProps {
  onEditClient: (client: Client) => void;
}

export function ClientList({ onEditClient }: ClientListProps) {
  const { clients, offlineQueue, isLoading } = useOfflineData();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showRecycleBin, setShowRecycleBin] = useState(false);

  // Soft delete handler
  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      const client = await db.clients.get(id);
      if (!client) return;

      const updatedClient: Client = {
        ...client,
        deletedAt: Date.now(),
        syncStatus: "pending",
        updatedAt: Date.now(),
      };

      await db.clients.put(updatedClient);

      await db.offlineQueue.add({
        entityType: "client",
        entityId: id,
        action: "delete",
        payload: updatedClient,
        createdAt: Date.now(),
        retryCount: 0,
      });

      toast.success("Klient bol presunutý do koša.");
    } catch (err) {
      console.error(err);
      toast.error("Nepodarilo sa presunúť klienta do koša.");
    }
  };

  // Restore handler
  const handleRestore = async (id?: number) => {
    if (!id) return;
    try {
      const client = await db.clients.get(id);
      if (!client) return;

      const updatedClient: Client = {
        ...client,
        deletedAt: null,
        syncStatus: "pending",
        updatedAt: Date.now(),
      };

      await db.clients.put(updatedClient);

      await db.offlineQueue.add({
        entityType: "client",
        entityId: id,
        action: "update",
        payload: updatedClient,
        createdAt: Date.now(),
        retryCount: 0,
      });

      toast.success("Klient bol obnovený z koša.");
    } catch (err) {
      console.error(err);
      toast.error("Nepodarilo sa obnoviť klienta.");
    }
  };

  // Permanent delete handler
  const handlePermanentDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Naozaj chcete tohto klienta trvalo vymazať? Táto akcia je nevratná.")) return;
    try {
      await db.clients.delete(id);
      toast.success("Klient bol trvalo vymazaný.");
    } catch (err) {
      console.error(err);
      toast.error("Nepodarilo sa vymazať klienta.");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Načítavam klientov...</div>;
  }

  // Count deleted items
  const deletedClientsCount = clients.filter(c => !!c.deletedAt).length;

  // Filter logic
  const filteredClients = clients.filter((client) => {
    // Soft-delete filter
    const isDeleted = !!client.deletedAt;
    if (showRecycleBin) {
      if (!isDeleted) return false;
    } else {
      if (isDeleted) return false;
    }

    // Status filter
    if (filterStatus !== "all" && client.status !== filterStatus) return false;

    // Service filter
    if (filterService !== "all" && client.service !== filterService) return false;

    // Search query check
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCompany = client.companyName.toLowerCase().includes(q);
      const matchContact = client.contactName?.toLowerCase().includes(q) || false;
      const matchEmail = client.email?.toLowerCase().includes(q) || false;
      const matchPhone = client.phone?.includes(q) || false;
      const matchWebsite = client.website?.toLowerCase().includes(q) || false;
      const matchNotes = client.notes?.toLowerCase().includes(q) || false;
      
      return matchCompany || matchContact || matchEmail || matchPhone || matchWebsite || matchNotes;
    }

    return true;
  });

  // Sort logic
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === "newest") {
      return b.createdAt - a.createdAt;
    }
    if (sortBy === "oldest") {
      return a.createdAt - b.createdAt;
    }
    if (sortBy === "companyName") {
      return a.companyName.localeCompare(b.companyName);
    }
    if (sortBy === "highestBudget") {
      return parseBudget(b.budget) - parseBudget(a.budget);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header and Queue Badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-white">
          {showRecycleBin ? "Odstránení klienti (Kôš)" : "Zoznam klientov"}
        </h2>
        {offlineQueue.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
            <CloudOff className="w-4 h-4" />
            Čaká na sync: {offlineQueue.length}
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Vyhľadať (firma, meno, e-mail, poznámky)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-9 pr-4 bg-black/40 border border-white/10 rounded-lg outline-none focus:ring-1 focus:ring-white/20 text-white text-sm"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 px-3 bg-[#1d1d1f] border border-white/10 rounded-lg outline-none text-white text-sm"
          >
            <option value="newest">Najnovší</option>
            <option value="oldest">Najstarší</option>
            <option value="companyName">Názov firmy</option>
            <option value="highestBudget">Najvyšší budget</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-3 bg-[#1d1d1f] border border-white/10 rounded-lg outline-none text-white text-xs"
          >
            <option value="all">Všetky statusy</option>
            <option value="Lead">Lead</option>
            <option value="Kontaktovaný">Kontaktovaný</option>
            <option value="Nacenenie">Nacenenie</option>
            <option value="Vo vývoji">Vo vývoji</option>
            <option value="Čaká sa">Čaká sa</option>
            <option value="Dokončené">Dokončené</option>
            <option value="Odmietnuté">Odmietnuté</option>
          </select>

          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="h-9 px-3 bg-[#1d1d1f] border border-white/10 rounded-lg outline-none text-white text-xs"
          >
            <option value="all">Všetky služby</option>
            <option value="Web stránka">Web stránka</option>
            <option value="SEO">SEO</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Booking systém">Booking systém</option>
            <option value="PWA aplikácia">PWA aplikácia</option>
            <option value="CMS">CMS</option>
            <option value="Automatizácia">Automatizácia</option>
            <option value="Iné">Iné</option>
          </select>

          <button
            onClick={() => setShowRecycleBin(!showRecycleBin)}
            className={`h-9 px-3 border rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
              showRecycleBin 
                ? "bg-red-500/20 border-red-500/40 text-red-300" 
                : "border-white/10 text-white/60 hover:text-white"
            }`}
          >
            🗑️ Kôš {deletedClientsCount > 0 && `(${deletedClientsCount})`}
          </button>
        </div>
      </div>

      {/* Clients Cards List */}
      {sortedClients.length === 0 ? (
        <div className="p-12 text-center border border-white/10 border-dashed rounded-xl text-white/50 bg-black/40 backdrop-blur-md">
          Žiadni klienti nezodpovedajú vybraným filtrom.
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedClients.map((client) => {
            let statusColor = "bg-white/10 text-white";
            if (client.status === "Vo vývoji") statusColor = "bg-blue-500/20 text-blue-400 border-blue-500/30";
            if (client.status === "Dokončené") statusColor = "bg-green-500/20 text-green-400 border-green-500/30";
            if (client.status === "Odmietnuté") statusColor = "bg-red-500/20 text-red-400 border-red-500/30";
            if (client.status === "Nacenenie") statusColor = "bg-purple-500/20 text-purple-400 border-purple-500/30";
            if (client.status === "Kontaktovaný") statusColor = "bg-amber-500/20 text-amber-400 border-amber-500/30";

            // Count open tasks
            const openTasksCount = client.tasks?.filter(t => !t.done).length || 0;

            return (
              <div key={client.id} className="p-5 border border-white/10 rounded-xl bg-black/60 backdrop-blur-xl hover:bg-white/5 transition-all relative group flex flex-col gap-3">
                
                {/* Header - Company Name & Status */}
                <div className="flex justify-between items-start pr-12">
                  <div>
                    <h3 className="font-medium text-lg text-white flex items-center gap-2">
                      {client.companyName}
                      {client.syncStatus === "pending" && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="Čaká na synchronizáciu" />
                      )}
                    </h3>
                    {client.contactName && (
                      <div className="flex items-center gap-1.5 text-white/60 text-sm mt-1">
                        <User className="w-3.5 h-3.5" />
                        {client.contactName}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs px-2.5 py-1 rounded-full border ${statusColor}`}>
                    {client.status}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                  {client.email && (
                    <div className="flex items-center gap-1.5 text-sm font-mono text-white/80">
                      <Mail className="w-3.5 h-3.5 text-white/40" />
                      <a href={`mailto:${client.email}`} className="hover:text-white transition-colors">{client.email}</a>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-1.5 text-sm font-mono text-white/80">
                      <Phone className="w-3.5 h-3.5 text-white/40" />
                      <a href={`tel:${client.phone}`} className="hover:text-white transition-colors">{client.phone}</a>
                    </div>
                  )}
                  {client.website && (
                    <div className="flex items-center gap-1.5 text-sm font-mono text-white/80">
                      <Globe className="w-3.5 h-3.5 text-white/40" />
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                        {client.website.replace(/^https?:\/\//i, "")}
                        <ExternalLink className="w-2.5 h-2.5 text-white/30" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
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
                  {openTasksCount > 0 && (
                    <div className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-md">
                      Otvorené úlohy: {openTasksCount}
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
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-white/40 text-xs">
                  <span>Pridané: {format(client.createdAt, "dd.MM.yyyy HH:mm")}</span>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onEditClient(client)}
                      className="flex items-center gap-1 text-white hover:text-white/80 transition-colors bg-white/5 border border-white/10 px-3 py-1.5 rounded-md hover:bg-white/10 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Upraviť
                    </button>
                    <a href={`/crm/${client.id}`} className="text-white hover:text-white/80 transition-colors bg-white/10 px-3 py-1.5 rounded-md hover:bg-white/20">
                      Zobraziť profil
                    </a>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {showRecycleBin ? (
                    <>
                      <button 
                        onClick={() => handleRestore(client.id)}
                        className="p-1.5 text-white/60 hover:text-green-400 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                        title="Obnoviť"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handlePermanentDelete(client.id)}
                        className="p-1.5 text-white/60 hover:text-red-500 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                        title="Trvalo vymazať"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleDelete(client.id)}
                      className="p-1.5 text-white/60 hover:text-red-400 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                      title="Zmazať (presunúť do koša)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
