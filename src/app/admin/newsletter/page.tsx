import { getAdminNewsletterSubscribers } from "@/lib/services/admin-newsletter.service";
import NewsletterClient from "./NewsletterClient";

export default async function AdminNewsletterPage() {
  const subscribers = await getAdminNewsletterSubscribers();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Newsletter</h2>
        <p className="text-sm text-gray-500">Manage your newsletter subscribers.</p>
      </div>

      <NewsletterClient initialSubscribers={subscribers || []} />
    </div>
  );
}
