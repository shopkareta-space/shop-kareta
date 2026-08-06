"use client";

import { useState } from "react";
import { Save, Store, Briefcase, Truck, Share2, Search, Layout } from "lucide-react";
import { updateStoreSetting } from "@/lib/services/admin-settings.service";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import Image from "next/image";

type Tab = 'general' | 'business' | 'shipping' | 'social' | 'seo' | 'footer' | 'email';

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, any> }) {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  
  // Media Picker state
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{isOpen: boolean, target: string} | null>(null);

  const handleUpdate = (category: string, field: string, value: any) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value
      }
    });
  };

  const handleSave = async (category: string) => {
    try {
      setIsSaving(true);
      await updateStoreSetting(category, settings[category]);
      alert(`${category.charAt(0).toUpperCase() + category.slice(1)} settings saved successfully.`);
    } catch (error: any) {
      alert("Failed to save settings: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'seo', label: 'Global SEO', icon: Search },
    { id: 'footer', label: 'Footer', icon: Layout },
    { id: 'email', label: 'Email', icon: Share2 } // Reusing Share2 or another icon
  ];

  const handleTestEmail = async () => {
    const testEmailAddress = prompt("Enter an email address to send the test email to:");
    if (!testEmailAddress) return;
    
    setIsTestingEmail(true);
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmailAddress })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      alert("Test email queued successfully! Check the email logs.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* Sidebar Navigation */}
      <div className="md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#0D1B2A] text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">General Settings</h3>
            
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input 
                  type="text" 
                  value={settings.general?.store_name || ''}
                  onChange={e => handleUpdate('general', 'store_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                      {settings.general?.store_logo ? (
                        <Image src={settings.general.store_logo} alt="Logo" width={64} height={64} className="object-contain w-full h-full" />
                      ) : (
                        <Store className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <button 
                      onClick={() => setMediaPickerConfig({ isOpen: true, target: 'store_logo' })}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200"
                    >
                      Choose Image
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                      {settings.general?.favicon ? (
                        <Image src={settings.general.favicon} alt="Favicon" width={64} height={64} className="object-contain w-full h-full" />
                      ) : (
                        <Store className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <button 
                      onClick={() => setMediaPickerConfig({ isOpen: true, target: 'favicon' })}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200"
                    >
                      Choose Image
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Description (Meta/Global)</label>
                <textarea 
                  value={settings.general?.store_description || ''}
                  onChange={e => handleUpdate('general', 'store_description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A] h-24"
                />
              </div>

              <div className="pt-4 flex justify-end border-t border-gray-100">
                <button 
                  onClick={() => handleSave('general')}
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-2.5 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a3553] transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Business Settings */}
        {activeTab === 'business' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Legal Name</label>
                <input 
                  type="text" 
                  value={settings.business?.company_name || ''}
                  onChange={e => handleUpdate('business', 'company_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input 
                  type="text" 
                  value={settings.business?.gst_number || ''}
                  onChange={e => handleUpdate('business', 'gst_number', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                <input 
                  type="email" 
                  value={settings.business?.email || ''}
                  onChange={e => handleUpdate('business', 'email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                <input 
                  type="text" 
                  value={settings.business?.phone || ''}
                  onChange={e => handleUpdate('business', 'phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
                <textarea 
                  value={settings.business?.address || ''}
                  onChange={e => handleUpdate('business', 'address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A] h-24"
                />
              </div>

              <div className="md:col-span-2 pt-4 flex justify-end border-t border-gray-100">
                <button 
                  onClick={() => handleSave('business')}
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-2.5 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a3553] transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Settings */}
        {activeTab === 'shipping' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Shipping Configuration</h3>
            
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold (₹)</label>
                <p className="text-xs text-gray-500 mb-2">Orders above this amount will get free shipping.</p>
                <input 
                  type="number" 
                  value={settings.shipping?.free_shipping_threshold || 0}
                  onChange={e => handleUpdate('shipping', 'free_shipping_threshold', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Flat Shipping Charge (₹)</label>
                <p className="text-xs text-gray-500 mb-2">Applied to orders below the threshold.</p>
                <input 
                  type="number" 
                  value={settings.shipping?.default_shipping_charge || 0}
                  onChange={e => handleUpdate('shipping', 'default_shipping_charge', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>

              <div className="pt-4 flex justify-end border-t border-gray-100">
                <button 
                  onClick={() => handleSave('shipping')}
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-2.5 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a3553] transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Social Settings */}
        {activeTab === 'social' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Social Media Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              {['facebook', 'instagram', 'youtube', 'linkedin', 'whatsapp'].map(platform => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform}</label>
                  <input 
                    type="url" 
                    placeholder={`https://${platform}.com/...`}
                    value={settings.social?.[platform] || ''}
                    onChange={e => handleUpdate('social', platform, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                  />
                </div>
              ))}

              <div className="md:col-span-2 pt-4 flex justify-end border-t border-gray-100">
                <button 
                  onClick={() => handleSave('social')}
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-2.5 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a3553] transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEO Settings */}
        {activeTab === 'seo' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Global SEO Defaults</h3>
            
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Meta Title</label>
                <input 
                  type="text" 
                  value={settings.seo?.meta_title || ''}
                  onChange={e => handleUpdate('seo', 'meta_title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Meta Description</label>
                <textarea 
                  value={settings.seo?.meta_description || ''}
                  onChange={e => handleUpdate('seo', 'meta_description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A] h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Meta Keywords</label>
                <input 
                  type="text" 
                  placeholder="e-commerce, shop, online..."
                  value={settings.seo?.keywords || ''}
                  onChange={e => handleUpdate('seo', 'keywords', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>

              <div className="pt-4 flex justify-end border-t border-gray-100">
                <button 
                  onClick={() => handleSave('seo')}
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-2.5 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a3553] transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Settings */}
        {activeTab === 'footer' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Footer Configuration</h3>
            
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer About Description</label>
                <textarea 
                  value={settings.footer?.footer_description || ''}
                  onChange={e => handleUpdate('footer', 'footer_description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A] h-24"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                <input 
                  type="text" 
                  value={settings.footer?.copyright_text || ''}
                  onChange={e => handleUpdate('footer', 'copyright_text', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>

              <div className="pt-4 flex justify-end border-t border-gray-100">
                <button 
                  onClick={() => handleSave('footer')}
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-2.5 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a3553] transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">Email Configuration</h3>
              <a href="/admin/settings/email/logs" className="text-sm font-semibold text-blue-600 hover:underline">
                View Email Logs &rarr;
              </a>
            </div>
            
            <div className="space-y-4 max-w-2xl">
              <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 text-sm mb-4">
                <strong>Note:</strong> Email Provider is controlled by the <code>EMAIL_PROVIDER</code> environment variable. 
                Other settings below are used by the Notification Service when sending emails.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider (from Environment)</label>
                <input 
                  type="text" 
                  value={process.env.NEXT_PUBLIC_EMAIL_PROVIDER || 'resend'}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
                <input 
                  type="text" 
                  value={settings.email_config?.sender_name || 'Shop Kareta'}
                  onChange={e => handleUpdate('email_config', 'sender_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sender Email</label>
                <p className="text-xs text-gray-500 mb-2">Must be verified with your provider.</p>
                <input 
                  type="email" 
                  value={settings.email_config?.sender_email || 'orders@shopkareta.com'}
                  onChange={e => handleUpdate('email_config', 'sender_email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reply-To Email</label>
                <input 
                  type="email" 
                  value={settings.email_config?.reply_to || 'support@shopkareta.com'}
                  onChange={e => handleUpdate('email_config', 'reply_to', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D1B2A]"
                />
              </div>

              <div className="pt-4 flex justify-between border-t border-gray-100">
                <button 
                  onClick={handleTestEmail}
                  disabled={isTestingEmail}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {isTestingEmail ? 'Sending...' : 'Send Test Email'}
                </button>

                <button 
                  onClick={() => handleSave('email_config')}
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-2.5 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a3553] transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {mediaPickerConfig && mediaPickerConfig.isOpen && (
        <MediaPickerModal 
          isOpen={mediaPickerConfig.isOpen}
          onClose={() => setMediaPickerConfig(null)}
          onSelect={(url) => {
            handleUpdate('general', mediaPickerConfig.target, url);
            setMediaPickerConfig(null);
          }}
          defaultFolder="General"
        />
      )}
    </div>
  );
}
