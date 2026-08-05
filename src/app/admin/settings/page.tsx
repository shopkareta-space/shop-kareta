import { getStoreSettings } from "@/lib/services/admin-settings.service";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();
  
  // Transform settings array into a key-value map for easier client consumption
  const settingsMap = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Store Settings</h2>
        <p className="text-sm text-gray-500">Manage global configuration for the storefront.</p>
      </div>

      <SettingsClient initialSettings={settingsMap} />
    </div>
  );
}
