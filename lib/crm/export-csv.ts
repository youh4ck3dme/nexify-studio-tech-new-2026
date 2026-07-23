import { db } from "@/lib/db";

const CSV_HEADERS = [
  "Meno",
  "E-mail",
  "Telefón",
  "Status",
  "Dátum vytvorenia",
  "Poznámky",
];

function csvCell(value: string | undefined): string {
  if (!value) return '""';
  // Replace newlines with spaces to avoid breaking CSV format and escape double quotes
  const cleaned = value.replace(/[\r\n]+/g, " ").replace(/"/g, '""');
  return `"${cleaned}"`;
}

/**
 * Exports every active (non-deleted) client to a downloaded CSV file.
 * Returns the number of exported rows, or null if there was nothing to export.
 */
export async function exportClientsToCsv(): Promise<number | null> {
  const clients = await db.clients.toArray();
  const activeClients = clients.filter((c) => !c.deletedAt);

  if (activeClients.length === 0) {
    return null;
  }

  const csvRows = [
    CSV_HEADERS.join(","),
    ...activeClients.map((c) => {
      // Map company name or contact name as 'Meno'
      const name = c.companyName || c.contactName || "";
      const createdDate = new Date(c.createdAt).toLocaleDateString("sk-SK");
      return [
        csvCell(name),
        csvCell(c.email),
        csvCell(c.phone),
        csvCell(c.status),
        csvCell(createdDate),
        csvCell(c.notes),
      ].join(",");
    }),
  ];

  // Excel UTF-8 BOM prefix
  const csvString = "\uFEFF" + csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `kestudio-export-${dateStr}.csv`;

  if (typeof window !== "undefined") {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Double vibrate haptic feedback for successful download
    if ("vibrate" in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  }

  return activeClients.length;
}
