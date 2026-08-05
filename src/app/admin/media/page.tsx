import { getMediaAssets } from "@/lib/services/admin-media.service";
import MediaDashboardClient from "./MediaDashboardClient";

export default async function AdminMediaPage() {
  const assets = await getMediaAssets();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Media Library</h2>
        <p className="text-sm text-gray-500">Manage all your product images, brand logos, and assets in one place.</p>
      </div>

      <MediaDashboardClient initialAssets={assets || []} />
    </div>
  );
}
