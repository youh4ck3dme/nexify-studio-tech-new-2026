"use client";

import { useEffect, useState } from "react";
import { db, Client, ClientTask } from "@/lib/db";
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
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientDetailProps {
  clientId: string;
}

export function ClientDetail({ clientId }: ClientDetailProps) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    const loadClient = async () => {
      try {
        const id = parseInt(clientId, 10);
        if (isNaN(id)) throw new Error("Invalid ID");
        const data = await db.clients.get(id);
        if (!data) {
          router.push("/crm");
          return;
        }
        setClient(data);
      } catch (e) {
        console.error(e);
        router.push("/crm");
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [clientId, router]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!client?.id) return;
    await db.clients.update(client.id, { status: newStatus, updatedAt: Date.now() });
    setClient({ ...client, status: newStatus });
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client?.id || !newTaskText.trim()) return;

    const newTask: ClientTask = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      done: false,
      createdAt: Date.now(),
    };

    const updatedTasks = [...(client.tasks || []), newTask];
    await db.clients.update(client.id, { tasks: updatedTasks, updatedAt: Date.now() });
    setClient({ ...client, tasks: updatedTasks });
    setNewTaskText("");
  };

  const toggleTask = async (taskId: string) => {
    if (!client?.id || !client.tasks) return;
    const updatedTasks = client.tasks.map(t => 
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    await db.clients.update(client.id, { tasks: updatedTasks, updatedAt: Date.now() });
    setClient({ ...client, tasks: updatedTasks });
  };

  const deleteTask = async (taskId: string) => {
    if (!client?.id || !client.tasks) return;
    const updatedTasks = client.tasks.filter(t => t.id !== taskId);
    await db.clients.update(client.id, { tasks: updatedTasks, updatedAt: Date.now() });
    setClient({ ...client, tasks: updatedTasks });
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

  return (
    <div className="space-y-6 pb-20">
      {/* Back Button */}
      <button 
        onClick={() => router.push("/crm")}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Späť na CRM
      </button>

      {/* Header Profile */}
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 lg:p-8 relative">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          <div>
            <h1 className="text-3xl font-display text-white mb-2">{client.name}</h1>
            <div className="flex items-center gap-4 text-white/70">
              <select
                value={client.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className={`text-xs px-3 py-1.5 rounded-full border outline-none cursor-pointer appearance-none ${statusColor}`}
              >
                <option value="Nový lead">Nový lead</option>
                <option value="Nacenenie">Nacenenie</option>
                <option value="Vo vývoji">Vo vývoji</option>
                <option value="Dokončené">Dokončené</option>
                <option value="Odmietnuté">Odmietnuté</option>
              </select>
              <span className="text-xs font-mono">
                Pridané: {format(client.createdAt, "dd.MM.yyyy")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px]">
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact & Notes */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-white mb-4">Kontakt</h3>
            <div className="space-y-4">
              {client.contactPerson && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-white/40 mb-0.5">Kontaktná osoba</div>
                    <div className="text-white/90">{client.contactPerson}</div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-white/40 mb-0.5">E-mail</div>
                  <a href={`mailto:${client.email}`} className="text-white/90 hover:underline">{client.email}</a>
                </div>
              </div>
              {client.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-white/40 mb-0.5">Telefón</div>
                    <a href={`tel:${client.phone}`} className="text-white/90 hover:underline">{client.phone}</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(client.notes && client.notes.trim() !== "") && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-medium text-white mb-3">Poznámka</h3>
              <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                {client.notes}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Tasks / To-Do */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <h3 className="text-xl font-medium text-white mb-6 flex items-center justify-between">
              Klientske úlohy (To-Do)
              <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded">
                {client.tasks?.filter(t => t.done).length || 0} / {client.tasks?.length || 0}
              </span>
            </h3>

            {/* Task Form */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Pridať novú úlohu..."
                className="flex-1 h-12 px-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30"
              />
              <Button type="submit" disabled={!newTaskText.trim()} className="h-12 px-6 bg-white text-black hover:bg-white/90">
                <Plus className="w-4 h-4 mr-2" /> Pridať
              </Button>
            </form>

            {/* Task List */}
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
                      <button className="text-white/50 hover:text-white transition-colors focus:outline-none">
                        {task.done ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <span className={`text-sm select-none ${task.done ? "text-white/50 line-through" : "text-white/90"}`}>
                        {task.text}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-white/30 hover:text-red-400 transition-all focus:outline-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
