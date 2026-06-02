"use client";

import { useState } from "react";
import { useOfflineData, Client } from "@/lib/db";
import { ClientForm } from "./client-form";
import { ClientList } from "./client-list";
import { SyncManager } from "./sync-manager";
import { ExportImport } from "./export-import";
import { Users, Briefcase, DollarSign, RefreshCw, LogOut } from "lucide-react";
import { logoutAction } from "@/app/login/actions";


// Budget parser helper
export function parseBudget(budgetStr?: string): number {
  if (!budgetStr) return 0;
  
  // Normalize string: lowercase, remove spaces, currency symbols
  let cleaned = budgetStr.toLowerCase().replace(/[\s€$]/g, "");

  // Match 2k / 1.5k
  const kMatch = cleaned.match(/^([0-9.]+)\s*k$/);
  if (kMatch) {
    const num = parseFloat(kMatch[1]);
    return isNaN(num) ? 0 : num * 1000;
  }

  // Replace k in standard strings, e.g. "2.5k" -> "2500"
  cleaned = cleaned.replace(/([0-9.]+)\s*k/g, (_, numStr) => {
    const val = parseFloat(numStr);
    return isNaN(val) ? "" : String(val * 1000);
  });

  // Check for range like "1000-2000"
  if (cleaned.includes("-")) {
    const parts = cleaned.split("-");
    const min = parseFloat(parts[0].replace(/[^0-9.]/g, ""));
    const max = parseFloat(parts[1].replace(/[^0-9.]/g, ""));
    if (!isNaN(min) && !isNaN(max)) {
      return (min + max) / 2;
    }
  }

  // Standard numbers (remove other prefix text like "od", "do", "+")
  const numMatch = cleaned.match(/[0-9.]+/);
  if (numMatch) {
    const num = parseFloat(numMatch[0]);
    return isNaN(num) ? 0 : num;
  }

  return 0;
}

export function CrmDashboard() {
  const { clients, offlineQueue, isLoading } = useOfflineData();
  const [clientToEdit, setClientToEdit] = useState<Client | undefined>(undefined);

  // Compute stats
  const activeClients = clients.filter(c => !c.deletedAt);
  const totalClientsCount = activeClients.length;
  
  const activeLeadsCount = activeClients.filter(
    c => c.status !== "Dokončené" && c.status !== "Odmietnuté"
  ).length;

  const totalPotentialBudget = activeClients.reduce((sum, client) => {
    return sum + parseBudget(client.budget);
  }, 0);

  const pendingSyncCount = offlineQueue.length;

  return (
    <div className="space-y-12">
      {/* Header section with Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <h2 className="text-xl font-mono uppercase tracking-wider text-white/50">Prehľad &amp; Nástroje</h2>
        <div className="flex items-center gap-3">
          <ExportImport />
          <button
            onClick={() => logoutAction()}
            className="flex items-center gap-2 px-4 h-10 border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all rounded-lg text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Odhlásiť sa
          </button>
        </div>
      </div>

      {/* Top Stats Dashboard Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1: Total Clients */}
        <div className="p-6 rounded-xl border border-foreground/10 bg-white/5 backdrop-blur-md dark:bg-black/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-2">Aktívni klienti</span>
            <p className="text-3xl font-display font-semibold text-foreground">
              {isLoading ? "..." : totalClientsCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2: Active Leads */}
        <div className="p-6 rounded-xl border border-foreground/10 bg-white/5 backdrop-blur-md dark:bg-black/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-2">Aktívne leady</span>
            <p className="text-3xl font-display font-semibold text-foreground">
              {isLoading ? "..." : activeLeadsCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3: Potential Budget */}
        <div className="p-6 rounded-xl border border-foreground/10 bg-white/5 backdrop-blur-md dark:bg-black/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-2">Potenciálny budget</span>
            <p className="text-3xl font-display font-semibold text-foreground">
              {isLoading ? "..." : `${totalPotentialBudget.toLocaleString("sk-SK")} €`}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4: Pending Sync Changes */}
        <div className="p-6 rounded-xl border border-foreground/10 bg-white/5 backdrop-blur-md dark:bg-black/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-2">Čaká na sync</span>
            <p className="text-3xl font-display font-semibold text-foreground">
              {isLoading ? "..." : pendingSyncCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center">
            <RefreshCw className={`w-6 h-6 ${pendingSyncCount > 0 ? "animate-spin-slow" : ""}`} />
          </div>
        </div>
      </div>

      {/* Sync Manager and Main Layout */}
      <SyncManager />

      <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-start">
        <div className="sticky top-28 space-y-6">
          <ClientForm 
            clientToEdit={clientToEdit} 
            onSuccess={() => setClientToEdit(undefined)} 
          />
        </div>
        <div>
          <ClientList 
            onEditClient={(client) => setClientToEdit(client)} 
          />
        </div>
      </div>
    </div>
  );
}
