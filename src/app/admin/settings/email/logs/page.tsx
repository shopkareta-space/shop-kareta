import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";

export default async function EmailLogsPage() {
  const supabase = await createClient();
  
  // Fetch logs
  const { data: logs, error } = await supabase
    .from("email_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching email logs:", error);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Email Delivery Logs</h2>
          <p className="text-sm text-gray-500">Track the status of all outgoing system emails.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4">Subject & Template</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs?.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {log.recipient}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 mb-0.5">{log.subject}</div>
                    <div className="text-xs text-gray-500 font-mono">{log.template_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {log.status === 'sent' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                        </span>
                      )}
                      {log.status === 'failed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                      {log.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                      {log.retry_count > 0 && (
                        <span className="text-xs text-gray-400">({log.retry_count} retries)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {log.created_at ? format(new Date(log.created_at), 'MMM d, h:mm a') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {log.error_message ? (
                      <span className="text-xs text-red-600 truncate max-w-[150px] inline-block" title={log.error_message}>
                        {log.error_message}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}

              {!logs?.length && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No email logs found. Wait for a system event or send a test email.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
