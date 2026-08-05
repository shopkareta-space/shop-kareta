export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-gray-500">This is the secure control center for Shop Kareta. Select a module from the sidebar to manage your store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">Quick Stats</h3>
          <p className="text-sm text-gray-500">Module coming soon in the next phase.</p>
        </div>
      </div>
    </div>
  );
}
