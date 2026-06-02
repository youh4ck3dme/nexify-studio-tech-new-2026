import { ClientDetail } from "@/components/crm/client-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Detail Klienta | CRM',
  robots: {
    index: false,
    follow: false,
  },
};

// V App Router je params Promise
export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  
  return (
    <div className="max-w-7xl mx-auto">
      <ClientDetail clientId={resolvedParams.id} />
    </div>
  );
}
