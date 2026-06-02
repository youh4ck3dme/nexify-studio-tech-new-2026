"use client";

import { useOptimistic, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { Client, ClientStatus, ClientService, db } from "@/lib/db";
import { Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

interface ClientFormProps {
  clientToEdit?: Client;
  onSuccess?: () => void;
}

export function ClientForm({ clientToEdit, onSuccess }: ClientFormProps) {
  const isOnline = useNetworkStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep track of values if editing
  const [companyName, setCompanyName] = useState(clientToEdit?.companyName || "");
  const [contactName, setContactName] = useState(clientToEdit?.contactName || "");
  const [email, setEmail] = useState(clientToEdit?.email || "");
  const [phone, setPhone] = useState(clientToEdit?.phone || "");
  const [website, setWebsite] = useState(clientToEdit?.website || "");
  const [service, setService] = useState<ClientService | string>(clientToEdit?.service || "Web stránka");
  const [status, setStatus] = useState<ClientStatus | string>(clientToEdit?.status || "Lead");
  const [budget, setBudget] = useState(clientToEdit?.budget || "");
  const [notes, setNotes] = useState(clientToEdit?.notes || "");

  useEffect(() => {
    if (clientToEdit) {
      setCompanyName(clientToEdit.companyName || "");
      setContactName(clientToEdit.contactName || "");
      setEmail(clientToEdit.email || "");
      setPhone(clientToEdit.phone || "");
      setWebsite(clientToEdit.website || "");
      setService(clientToEdit.service || "Web stránka");
      setStatus(clientToEdit.status || "Lead");
      setBudget(clientToEdit.budget || "");
      setNotes(clientToEdit.notes || "");
    }
  }, [clientToEdit]);

  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    { status: "idle", message: "" } as { status: "idle" | "saving" | "success" | "error"; message: string },
    (state, newStatus: { status: "idle" | "saving" | "success" | "error"; message?: string }) => ({
      ...state,
      ...newStatus,
      message: newStatus.message || "",
    })
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error("Názov firmy je povinný");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Zadajte platný e-mail");
      return;
    }

    // Budget check
    if (budget) {
      const parsed = parseFloat(budget.replace(/[^0-9.]/g, ""));
      if (!isNaN(parsed) && parsed < 0) {
        toast.error("Rozpočet nesmie byť záporný");
        return;
      }
    }

    setIsSubmitting(true);
    addOptimisticStatus({ 
      status: "saving", 
      message: isOnline ? "Ukladám na server..." : "Ukladám lokálne (Offline)..." 
    });

    const isEdit = !!clientToEdit;
    const clientData: Client = {
      ...clientToEdit,
      companyName: companyName.trim(),
      contactName: contactName.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      website: website.trim() || undefined,
      service,
      status,
      budget: budget.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: clientToEdit?.createdAt || Date.now(),
      updatedAt: Date.now(),
      deletedAt: clientToEdit?.deletedAt || null,
      syncStatus: "pending",
    };

    try {
      let savedId: number;

      if (isEdit) {
        savedId = clientToEdit.id!;
        await db.clients.put(clientData);

        // Automatic activity log if status changed
        if (clientToEdit.status !== status) {
          await db.activities.add({
            clientId: savedId,
            type: "status_change",
            title: "Zmena stavu",
            content: `Stav zmenený z "${clientToEdit.status}" na "${status}"`,
            createdAt: Date.now(),
          });
        }
      } else {
        savedId = await db.clients.add(clientData);
        clientData.id = savedId;
      }

      // Add to offlineQueue for sync
      await db.offlineQueue.add({
        entityType: "client",
        entityId: savedId,
        action: isEdit ? "update" : "create",
        payload: clientData,
        createdAt: Date.now(),
        retryCount: 0,
      });

      // Background Sync trigger if available
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await (registration as unknown as { sync: { register: (tag: string) => Promise<void> } }).sync.register("sync-crm-data");
        } catch (err) {
          console.warn("Background Sync registration failed:", err);
        }
      }

      toast.success(isEdit ? "Klient upravený úspešne!" : "Klient vytvorený úspešne!");
      
      if (!isEdit) {
        // Reset form
        setCompanyName("");
        setContactName("");
        setEmail("");
        setPhone("");
        setWebsite("");
        setService("Web stránka");
        setStatus("Lead");
        setBudget("");
        setNotes("");
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Nepodarilo sa uložiť dáta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 lg:p-8 relative overflow-hidden backdrop-blur-xl bg-black/60">
      <div className="absolute top-4 right-4 flex items-center gap-2 text-sm font-mono text-muted-foreground">
        {isOnline ? (
          <><Wifi className="w-4 h-4 text-green-500" /> Online</>
        ) : (
          <><WifiOff className="w-4 h-4 text-yellow-500" /> Offline</>
        )}
      </div>

      <h2 className="text-2xl font-display mb-6 text-white">
        {clientToEdit ? "Upraviť klienta" : "Nový klient"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80 block">Názov klienta / Firmy *</label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            placeholder="Názov firmy s.r.o."
            className="w-full h-12 px-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 input-glow text-white"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80 block">Kontaktná osoba</label>
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Jozef Mrkva"
            className="w-full h-12 px-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 input-glow text-white"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 block">E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="firma@example.com"
              className="w-full h-12 px-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 input-glow text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 block">Telefón</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="+421 900 000 000"
              className="w-full h-12 px-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 input-glow text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80 block">Webová stránka</label>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://www.firma.sk"
            className="w-full h-12 px-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 input-glow text-white"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 block">Služba</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              className="w-full h-12 px-4 border border-white/10 bg-[#1D1D1F] rounded-lg outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
            >
              <option value="Web stránka">Web stránka</option>
              <option value="SEO">SEO</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Booking systém">Booking systém</option>
              <option value="PWA aplikácia">PWA aplikácia</option>
              <option value="CMS">CMS</option>
              <option value="Automatizácia">Automatizácia</option>
              <option value="Iné">Iné</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 block">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full h-12 px-4 border border-white/10 bg-[#1D1D1F] rounded-lg outline-none focus:ring-2 focus:ring-white/20 text-white appearance-none"
            >
              <option value="Lead">Lead</option>
              <option value="Kontaktovaný">Kontaktovaný</option>
              <option value="Nacenenie">Nacenenie</option>
              <option value="Vo vývoji">Vo vývoji</option>
              <option value="Čaká sa">Čaká sa</option>
              <option value="Dokončené">Dokončené</option>
              <option value="Odmietnuté">Odmietnuté</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 block">Rozpočet</label>
            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 2000 €"
              className="w-full h-12 px-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 input-glow text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80 block">Poznámka</label>
          <textarea
            placeholder="Poznámka"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full p-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 input-glow text-white resize-none"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          {clientToEdit && onSuccess && (
            <Button
              type="button"
              onClick={onSuccess}
              variant="outline"
              className="h-12 border-white/15 text-white hover:bg-white/5 rounded-lg"
            >
              Zrušiť
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full sm:w-auto h-12 btn-micro text-black bg-white hover:bg-white/90 rounded-lg"
          >
            {optimisticStatus.status === "saving" ? <Spinner className="mr-2" /> : null}
            {optimisticStatus.status === "saving" ? optimisticStatus.message : clientToEdit ? "Uložiť zmeny" : "Uložiť klienta do CRM"}
          </Button>
        </div>
      </form>
    </div>
  );
}
