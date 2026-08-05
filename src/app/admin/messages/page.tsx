import { getAdminMessages } from "@/lib/services/admin-messages.service";
import MessagesClient from "./MessagesClient";

export default async function AdminMessagesPage() {
  const messages = await getAdminMessages();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Customer Messages</h2>
        <p className="text-sm text-gray-500">Manage contact form submissions and inquiries.</p>
      </div>

      <MessagesClient initialMessages={messages || []} />
    </div>
  );
}
