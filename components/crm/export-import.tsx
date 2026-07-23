"use client";

import React, { useRef } from "react";
import { db, Client, ClientActivity } from "@/lib/db";
import { exportClientsToCsv } from "@/lib/crm/export-csv";
import { Download, Upload, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

export function ExportImport() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV Export
  const handleExportCSV = async () => {
    try {
      const exportedCount = await exportClientsToCsv();
      if (exportedCount === null) {
        toast.info("Nemáte žiadnych aktívnych klientov na export.");
        return;
      }
      toast.success("CSV export stiahnutý úspešne!");
    } catch (err) {
      console.error(err);
      toast.error("CSV export zlyhal.");
    }
  };

  // JSON Backup Export
  const handleExportJSON = async () => {
    try {
      const clients = await db.clients.toArray();
      const activities = await db.activities.toArray();
      const offlineQueue = await db.offlineQueue.toArray();

      const backup = {
        schemaVersion: 3,
        exportedAt: Date.now(),
        clients,
        activities,
        offlineQueue
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
      const link = document.createElement("a");
      link.setAttribute("href", dataStr);
      link.setAttribute("download", `nexify_crm_backup_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("JSON záloha stiahnutá úspešne!");
    } catch (err) {
      console.error(err);
      toast.error("JSON export zlyhal.");
    }
  };

  // JSON Backup Import
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const backup = JSON.parse(text);

        // Validation
        if (backup.schemaVersion !== 3) {
          toast.error("Chyba: Neplatná verzia schémy JSON zálohy (očakáva sa verzia 3).");
          return;
        }

        if (!Array.isArray(backup.clients) || !Array.isArray(backup.activities)) {
          toast.error("Chyba: Neplatná štruktúra JSON zálohy.");
          return;
        }

        if (!confirm(`Naozaj chcete importovať zálohu s ${backup.clients.length} klientmi? Akcie prepíšu lokálnu databázu a chýbajúci klienti sa pridajú.`)) {
          return;
        }

        let addedCount = 0;
        let skippedCount = 0;

        const existingClients = await db.clients.toArray();

        for (const importClient of backup.clients as Client[]) {
          // Duplicate check
          const isDuplicate = existingClients.some(
            c => (importClient.id && c.id === importClient.id) || 
                 (importClient.email && c.email === importClient.email) || 
                 (c.companyName.toLowerCase() === importClient.companyName.toLowerCase())
          );

          if (isDuplicate) {
            skippedCount++;
            continue;
          }

          // Strip original ID if it would collide (auto-increment will allocate new one)
          const clientData: Client = {
            companyName: importClient.companyName,
            contactName: importClient.contactName,
            email: importClient.email,
            phone: importClient.phone,
            website: importClient.website,
            service: importClient.service,
            status: importClient.status,
            budget: importClient.budget,
            notes: importClient.notes,
            tasks: importClient.tasks,
            createdAt: importClient.createdAt || Date.now(),
            updatedAt: importClient.updatedAt || Date.now(),
            deletedAt: importClient.deletedAt || null,
            syncStatus: "pending" // mark as pending for sync
          };

          const newId = await db.clients.add(clientData);

          // Queue in offlineSync
          await db.offlineQueue.add({
            entityType: "client",
            entityId: newId,
            action: "create",
            payload: { id: newId, ...clientData },
            createdAt: Date.now(),
            retryCount: 0
          });

          addedCount++;
        }

        // Import activities matching imported clients
        for (const act of backup.activities as ClientActivity[]) {
          const activityData: ClientActivity = {
            clientId: act.clientId,
            type: act.type,
            title: act.title,
            content: act.content,
            createdAt: act.createdAt
          };
          const newActId = await db.activities.add(activityData);

          await db.offlineQueue.add({
            entityType: "activity",
            entityId: newActId,
            action: "create",
            payload: { id: newActId, ...activityData },
            createdAt: Date.now(),
            retryCount: 0
          });
        }

        toast.success(`Import dokončený! Pridané: ${addedCount}, Preskočené (duplicity): ${skippedCount}`);
        
        // Refresh page to load imports
        window.location.reload();
      } catch (err) {
        console.error(err);
        toast.error("Chyba pri čítaní / spracovaní JSON súboru.");
      }
    };
    reader.readAsText(file);
    
    // Clear file selection
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* CSV Export */}
      <button
        onClick={handleExportCSV}
        className="flex items-center gap-2 h-10 px-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-lg text-sm transition-all cursor-pointer"
        title="Exportovať aktívnych klientov do CSV"
      >
        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
        <span>Export CSV</span>
      </button>

      {/* JSON Backup Export */}
      <button
        onClick={handleExportJSON}
        className="flex items-center gap-2 h-10 px-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-lg text-sm transition-all cursor-pointer"
        title="Zálohovať celú CRM databázu do JSON"
      >
        <Download className="w-4 h-4 text-blue-400" />
        <span>Záloha JSON</span>
      </button>

      {/* JSON Backup Import */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 h-10 px-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-lg text-sm transition-all cursor-pointer"
        title="Obnoviť CRM databázu zo súboru JSON"
      >
        <Upload className="w-4 h-4 text-amber-400" />
        <span>Import JSON</span>
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJSON}
        accept=".json"
        className="hidden"
      />
    </div>
  );
}
