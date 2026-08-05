"use client";

import { useState } from "react";
import { Search, Trash2, Eye, Mail, MessageSquare, CheckCircle, X } from "lucide-react";
import { updateMessageStatus, deleteMessage } from "@/lib/services/admin-messages.service";

export default function MessagesClient({ initialMessages }: { initialMessages: any[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const filteredMessages = messages.filter(msg => {
    let matchesSearch = true;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      matchesSearch = 
        (msg.name && msg.name.toLowerCase().includes(s)) ||
        (msg.email && msg.email.toLowerCase().includes(s)) ||
        (msg.subject && msg.subject.toLowerCase().includes(s));
    }
    const matchesStatus = statusFilter === "all" || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateMessageStatus(id, newStatus);
      setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (error: any) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error: any) {
      alert("Failed to delete message");
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'read': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 relative">
      
      {/* Left side: List */}
      <div className={`flex-1 space-y-4 ${selectedMessage ? 'hidden md:block md:w-1/2 lg:w-2/3' : 'w-full'}`}>
        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A] focus:ring-1 focus:ring-[#0D1B2A] bg-gray-50"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          {filteredMessages.map((msg: any) => (
            <div 
              key={msg.id} 
              onClick={() => {
                setSelectedMessage(msg);
                if (msg.status === 'new') handleStatusChange(msg.id, 'read');
              }}
              className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 flex items-start gap-4 ${selectedMessage?.id === msg.id ? 'bg-[#0D1B2A]/5 border-l-4 border-[#0D1B2A]' : 'border-l-4 border-transparent'}`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-[#0D1B2A] font-bold uppercase">
                {msg.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm truncate ${msg.status === 'new' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {msg.name}
                  </p>
                  <p className="text-xs text-gray-500 flex-shrink-0">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className={`text-sm mt-0.5 truncate ${msg.status === 'new' ? 'font-bold text-gray-900' : 'text-gray-900'}`}>
                  {msg.subject}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(msg.status)}`}>
                    {msg.status}
                  </span>
                  <button 
                    onClick={(e) => handleDelete(msg.id, e)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredMessages.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No messages found.
            </div>
          )}
        </div>
      </div>

      {/* Right side: Detail view */}
      {selectedMessage && (
        <div className="flex-1 md:w-1/2 lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col sticky top-6 h-[calc(100vh-120px)] overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Message Details
            </h3>
            <button 
              onClick={() => setSelectedMessage(null)}
              className="p-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-200 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0D1B2A]/10 flex items-center justify-center flex-shrink-0 text-[#0D1B2A] font-bold text-lg uppercase">
                  {selectedMessage.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedMessage.name}</p>
                  <a href={`mailto:${selectedMessage.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    {selectedMessage.email}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {selectedMessage.message}
            </div>
            
            <div className="text-xs text-gray-500">
              Received on: {new Date(selectedMessage.created_at).toLocaleString()}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
            <a 
              href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a3553] transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" /> Reply
            </a>
            {selectedMessage.status !== 'resolved' && (
              <button 
                onClick={() => handleStatusChange(selectedMessage.id, 'resolved')}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Resolve
              </button>
            )}
          </div>
        </div>
      )}
      
      {!selectedMessage && (
        <div className="hidden md:flex flex-1 md:w-1/2 lg:w-1/3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 items-center justify-center text-center p-8 sticky top-6 h-[calc(100vh-120px)]">
          <div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Mail className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="font-semibold text-gray-900">No Message Selected</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-[200px] mx-auto">Select a message from the list to view its contents.</p>
          </div>
        </div>
      )}
    </div>
  );
}
