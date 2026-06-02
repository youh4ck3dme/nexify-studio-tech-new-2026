"use client";

import { useEffect, useState, useCallback } from "react";
import { db, Client, ClientTask, ClientActivity } from "@/lib/db";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Briefcase, 
  Mail, 
  Phone, 
  User, 
  CheckCircle2, 
  Circle,
  Plus,
  Trash2,
  Edit,
  Globe,
  FileText,
  Calendar,
  MessageSquare,
  Video,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientForm } from "./client-form";
import { toast } from "sonner";

interface ClientDetailProps {
  clientId: string;
}

export function ClientDetail({ clientId }: ClientDetailProps) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Task form state
  const [newTaskText, setNewTaskText] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Activity form state
  const [activityType, setActivityType] = useState<"note" | "call" | "email" | "meeting" | "proposal">("note");
  const [activityTitle, setActivityTitle] = useState("");
  const [activityContent, setActivityContent] = useState("");

  const loadClientAndActivities = useCallback(async () => {
    try {
      const id = parseInt(clientId, 10);
      if (isNaN(id)) throw new Error("Invalid ID");
      
      const clientData = await db.clients.get(id);
      if (!clientData) {
        router.push("/crm");
        return;
      }
      setClient(clientData);

      // Load activities (newest first)
      const activityData = await db.activities
        .where("clientId")
        .equals(id)
        .reverse()
        .sortBy("createdAt");
      
      setActivities(activityData);
    } catch (e) {
      console.error(e);
      router.push("/crm");
    } finally {
      setLoading(false);
    }
  }, [clientId, router]);

  useEffect(() => {
    loadClientAndActivities();
  }, [clientId, loadClientAndActivities]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!client?.id) return;
    const oldStatus = client.status;
    if (oldStatus === newStatus) return;

    try {
      const updatedClient: Client = {
        ...client,
        status: newStatus,
        updatedAt: Date.now(),
        syncStatus: "pending",
      };

      await db.clients.put(updatedClient);

      // Log status change activity
      const activityData: ClientActivity = {
        clientId: client.id,
        type: "status_change",
        title: "Zmena stavu",
        content: `Stav zmenený z "${oldStatus}" na "${newStatus}"`,
        createdAt: Date.now(),
      };
      
      const activityId = await db.activities.add(activityData);
      activityData.id = activityId;

      // Add to offlineQueue
      await db.offlineQueue.add({
        entityType: "client",
        entityId: client.id,
        action: "update",
        payload: updatedClient,
        createdAt: Date.now(),
        retryCount: 0,
      });

      await db.offlineQueue.add({
        entityType: "activity",
        entityId: activityId,
        action: "create",
        payload: activityData,
        createdAt: Date.now(),
        retryCount: 0,
      });

      setClient(updatedClient);
      setActivities([activityData, ...activities]);
      toast.success("Stav klienta bol zmenený");
    } catch (err) {
      console.error(err);
      toast.error("Chyba pri zmene stavu");
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client?.id || !newTaskText.trim()) return;

    const newTask: ClientTask = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      done: false,
      dueDate: dueDate ? dueDate : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedTasks = [...(client.tasks || []), newTask];
    const updatedClient: Client = {
      ...client,
      tasks: updatedTasks,
      updatedAt: Date.now(),
      syncStatus: "pending",
    };

    try {
      await db.clients.put(updatedClient);

      // Queue task creation
      await db.offlineQueue.add({
        entityType: "task",
        entityId: newTask.id,
        action: "create",
        payload: { clientId: client.id, task: newTask },
        createdAt: Date.now(),
        retryCount: 0,
      });

      setClient(updatedClient);
      setNewTaskText("");
      setDueDate("");
      toast.success("Úloha bola pridaná");
    } catch (err) {
      console.error(err);
      toast.error("Nepodarilo sa pridať úlohu");
    }
  };

  const toggleTask = async (taskId: string) => {
    if (!client?.id || !client.tasks) return;
    try {
      const updatedTasks = client.tasks.map(t => 
        t.id === taskId ? { ...t, done: !t.done, updatedAt: Date.now() } : t
      );
      const toggledTask = updatedTasks.find(t => t.id === taskId)!;
      
      const updatedClient: Client = {
        ...client,
        tasks: updatedTasks,
        updatedAt: Date.now(),
        syncStatus: "pending",
      };

      await db.clients.put(updatedClient);

      // Queue task update
      await db.offlineQueue.add({
        entityType: "task",
        entityId: taskId,
        action: "update",
        payload: { clientId: client.id, task: toggledTask },
        createdAt: Date.now(),
        retryCount: 0,
      });

      setClient(updatedClient);
    } catch (err) {
      console.error(err);
      toast.error("Nepodarilo sa zmeniť stav úlohy");
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!client?.id || !client.tasks) return;
    try {
      const updatedTasks = client.tasks.filter(t => t.id !== taskId);
      const updatedClient: Client = {
        ...client,
        tasks: updatedTasks,
        updatedAt: Date.now(),
        syncStatus: "pending",
      };

      await db.clients.put(updatedClient);

      // Queue task deletion
      await db.offlineQueue.add({
        entityType: "task",
        entityId: taskId,
        action: "delete",
        payload: { clientId: client.id, taskId },
        createdAt: Date.now(),
        retryCount: 0,
      });

      setClient(updatedClient);
      toast.success("Úloha bola vymazaná");
    } catch (err) {
      console.error(err);
      toast.error("Nepodarilo sa vymazať úlohu");
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client?.id || !activityTitle.trim()) return;

    try {
      const activityData: ClientActivity = {
        clientId: client.id,
        type: activityType,
        title: activityTitle.trim(),
        content: activityContent.trim() || undefined,
        createdAt: Date.now(),
      };

      const activityId = await db.activities.add(activityData);
      activityData.id = activityId;

      // Add to offlineQueue
      await db.offlineQueue.add({
        entityType: "activity",
        entityId: activityId,
        action: "create",
        payload: activityData,
        createdAt: Date.now(),
        retryCount: 0,
      });

      setActivities([activityData, ...activities]);
      setActivityTitle("");
      setActivityContent("");
      toast.success("Aktivita bola pridaná do časovej osi");
    } catch (err) {
      console.error(err);
      toast.error("Nepodarilo sa uložiť aktivitu");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white/50">Načítavam klienta...</div>;
  }

  if (!client) return null;

  // Status Color Logic
  let statusColor = "bg-white/10 text-white border-white/20";
  if (client.status === "Vo vývoji") statusColor = "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (client.status === "Dokončené") statusColor = "bg-green-500/20 text-green-400 border-green-500/30";
  if (client.status === "Odmietnuté") statusColor = "bg-red-500/20 text-red-400 border-red-500/30";
  if (client.status === "Nacenenie") statusColor = "bg-purple-500/20 text-purple-400 border-purple-500/30";
  if (client.status === "Kontaktovaný") statusColor = "bg-amber-500/20 text-amber-400 border-amber-500/30";

  return (
    <div className="space-y-6 pb-20 pt-32 px-6">
      {/* Back Link */}
      <button 
        onClick={() => router.push("/crm")}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Späť na CRM
      </button>

      {isEditing ? (
        <div className="max-w-[700px] mx-auto">
          <ClientForm 
            clientToEdit={client} 
            onSuccess={() => {
              setIsEditing(false);
              loadClientAndActivities();
            }} 
          />
        </div>
      ) : (
        <>
          {/* Header Profile Card */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 lg:p-8 relative">
            {client.deletedAt && (
              <div className="mb-4 bg-red-500/20 text-red-300 border border-red-500/30 px-4 py-2 rounded-lg text-sm">
                Tento klient bol presunutý do koša (soft-delete).
              </div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-display text-white mb-2">{client.companyName}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/70">
                  <select
                    value={client.status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    className={`text-xs px-3 py-1.5 rounded-full border outline-none cursor-pointer bg-[#1D1D1F] ${statusColor}`}
                  >
                    <option value="Lead">Lead</option>
                    <option value="Kontaktovaný">Kontaktovaný</option>
                    <option value="Nacenenie">Nacenenie</option>
                    <option value="Vo vývoji">Vo vývoji</option>
                    <option value="Čaká sa">Čaká sa</option>
                    <option value="Dokončené">Dokončené</option>
                    <option value="Odmietnuté">Odmietnuté</option>
                  </select>
                  <span className="text-xs font-mono">
                    Pridané: {format(client.createdAt, "dd.MM.yyyy")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch md:items-start shrink-0">
                <div className="flex flex-col gap-2 min-w-[150px]">
                  {client.service && (
                    <div className="flex items-center gap-2 text-sm text-white/80 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                      <Briefcase className="w-4 h-4 text-white/40" />
                      {client.service}
                    </div>
                  )}
                  {client.budget && (
                    <div className="flex items-center gap-2 text-sm text-white/80 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                      💳 {client.budget}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 text-black bg-white hover:bg-white/90 px-4 py-2 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  <Edit className="w-4 h-4" /> Upraviť profil
                </button>
              </div>
            </div>
          </div>

          {/* Grid Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Column - Contact Details & Notes */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-medium text-white mb-4">Kontakt</h3>
                <div className="space-y-4">
                  {client.contactName && (
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs text-white/40 mb-0.5">Kontaktná osoba</div>
                        <div className="text-white/90">{client.contactName}</div>
                      </div>
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs text-white/40 mb-0.5">E-mail</div>
                        <a href={`mailto:${client.email}`} className="text-white/90 hover:underline">{client.email}</a>
                      </div>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs text-white/40 mb-0.5">Telefón</div>
                        <a href={`tel:${client.phone}`} className="text-white/90 hover:underline">{client.phone}</a>
                      </div>
                    </div>
                  )}
                  {client.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs text-white/40 mb-0.5">Web</div>
                        <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:underline break-all">{client.website}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {client.notes && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-medium text-white mb-3">Poznámka</h3>
                  <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                    {client.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Middle Column - Tasks (To-Do) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tasks Box */}
              <div className="bg-black/45 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                <h3 className="text-xl font-medium text-white mb-6 flex items-center justify-between">
                  Klientske úlohy
                  <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded">
                    {client.tasks?.filter(t => t.done).length || 0} / {client.tasks?.length || 0}
                  </span>
                </h3>

                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="space-y-3 mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      placeholder="Pridať novú úlohu..."
                      required
                      className="flex-1 h-11 px-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30 text-sm"
                    />
                    <Button type="submit" disabled={!newTaskText.trim()} className="h-11 px-5 bg-white text-black hover:bg-white/90 rounded-lg shrink-0">
                      <Plus className="w-4 h-4 mr-1.5" /> Pridať
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <span className="text-xs">Termín splnenia (Voliteľné):</span>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none cursor-pointer focus:ring-1 focus:ring-white/25"
                    />
                  </div>
                </form>

                {/* Tasks List */}
                <div className="space-y-2">
                  {!client.tasks || client.tasks.length === 0 ? (
                    <div className="text-center py-8 text-white/30 text-sm border border-dashed border-white/10 rounded-lg">
                      Zatiaľ žiadne úlohy pre tohto klienta.
                    </div>
                  ) : (
                    client.tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${
                          task.done ? "bg-white/5 border-transparent opacity-50" : "bg-white/10 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div 
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                          onClick={() => toggleTask(task.id)}
                        >
                          <button type="button" className="text-white/50 hover:text-white transition-colors focus:outline-none">
                            {task.done ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5" />}
                          </button>
                          <div className="flex flex-col">
                            <span className={`text-sm select-none ${task.done ? "text-white/50 line-through" : "text-white/90"}`}>
                              {task.text}
                            </span>
                            {task.dueDate && (
                              <span className={`text-[10px] font-mono mt-0.5 ${
                                !task.done && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0)) 
                                  ? "text-red-400" 
                                  : "text-white/40"
                              }`}>
                                Termín: {format(new Date(task.dueDate), "dd.MM.yyyy")}
                              </span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-white/30 hover:text-red-400 transition-all focus:outline-none cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Activity Logger Form */}
              <div className="bg-black/45 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                <h3 className="text-lg font-medium text-white mb-4">Zaevidovať novú aktivitu / interakciu</h3>
                <form onSubmit={handleAddActivity} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-white/60 block">Typ aktivity</label>
                      <select
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value as "note" | "call" | "email" | "meeting" | "proposal")}
                        className="w-full h-10 px-3 bg-[#1d1d1f] border border-white/10 rounded-lg outline-none text-white text-xs"
                      >
                        <option value="note">Poznámka</option>
                        <option value="call">Telefonát</option>
                        <option value="email">E-mail</option>
                        <option value="meeting">Stretnutie</option>
                        <option value="proposal">Ponuka (Proposal)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-white/60 block">Názov / Predmet *</label>
                      <input
                        value={activityTitle}
                        onChange={(e) => setActivityTitle(e.target.value)}
                        placeholder="Napr. Telefonát s riaditeľom"
                        required
                        className="w-full h-10 px-3 bg-black/40 border border-white/10 rounded-lg outline-none focus:ring-1 focus:ring-white/20 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-white/60 block">Detaily aktivity</label>
                    <textarea
                      value={activityContent}
                      onChange={(e) => setActivityContent(e.target.value)}
                      placeholder="Dohodli sme sa na zaslaní cenovej ponuky do piatku..."
                      rows={2}
                      className="w-full p-3 bg-black/40 border border-white/10 rounded-lg outline-none focus:ring-1 focus:ring-white/20 text-white text-xs resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={!activityTitle.trim()} className="h-10 px-4 bg-white text-black hover:bg-white/90 text-xs font-semibold rounded-lg cursor-pointer">
                      Uložiť aktivitu
                    </Button>
                  </div>
                </form>
              </div>

              {/* Activity Timeline list */}
              <div className="bg-black/45 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                <h3 className="text-xl font-medium text-white mb-6">Časová os aktivít</h3>
                
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-white/30 text-sm border border-dashed border-white/10 rounded-lg">
                    Zatiaľ žiadna zaznamenaná aktivita pre tohto klienta.
                  </div>
                ) : (
                  <div className="relative border-l border-white/10 ml-3 space-y-6">
                    {activities.map((act) => {
                      let Icon = MessageSquare;
                      let iconColor = "bg-white/15 text-white/70";
                      
                      if (act.type === "call") { Icon = Phone; iconColor = "bg-blue-500/20 text-blue-400"; }
                      if (act.type === "email") { Icon = Mail; iconColor = "bg-emerald-500/20 text-emerald-400"; }
                      if (act.type === "meeting") { Icon = Video; iconColor = "bg-purple-500/20 text-purple-400"; }
                      if (act.type === "proposal") { Icon = FileSpreadsheet; iconColor = "bg-pink-500/20 text-pink-400"; }
                      if (act.type === "status_change") { Icon = FileText; iconColor = "bg-amber-500/20 text-amber-400"; }

                      return (
                        <div key={act.id} className="relative pl-7 group">
                          {/* Dot marker */}
                          <div className={`absolute -left-3.5 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border border-black/80 ${iconColor}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1 text-white/40">
                              <span className="font-mono">{format(act.createdAt, "dd.MM.yyyy HH:mm")}</span>
                            </div>
                            <h4 className="font-medium text-sm text-white/90">{act.title}</h4>
                            {act.content && (
                              <p className="text-xs text-white/60 mt-1 whitespace-pre-wrap leading-relaxed">{act.content}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
