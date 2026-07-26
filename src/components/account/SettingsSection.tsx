"use client";

import { useState } from "react";
import { Lock, Bell, Shield, Smartphone, Trash2 } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

export function SettingsSection() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [marketingNotifs, setMarketingNotifs] = useState(true);

  return (
    <div className="space-y-6">
      {/* Security */}
      <BlurFade delay={0.2}>
        <div className="bg-white rounded-3xl border border-brand-gray/10 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-brand-gray/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-green" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-brand-blue">Security</h3>
              <p className="text-sm text-brand-gray">Manage your password and security methods.</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-brand-blue">Change Password</p>
                <p className="text-sm text-brand-gray mt-1">Update your password regularly to keep your account secure.</p>
              </div>
              <button className="text-sm font-semibold text-brand-blue hover:text-brand-green bg-brand-gray/5 hover:bg-brand-gray/10 px-6 py-2.5 rounded-xl transition-colors shrink-0">
                Update Password
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-brand-gray/10">
              <div>
                <p className="font-medium text-brand-blue">Two-Factor Authentication (2FA)</p>
                <p className="text-sm text-brand-gray mt-1">Add an extra layer of security to your account.</p>
              </div>
              <button className="text-sm font-semibold text-brand-blue hover:text-brand-green bg-brand-gray/5 hover:bg-brand-gray/10 px-6 py-2.5 rounded-xl transition-colors shrink-0">
                Setup 2FA
              </button>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Notifications */}
      <BlurFade delay={0.3}>
        <div className="bg-white rounded-3xl border border-brand-gray/10 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-brand-gray/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-blue/5 flex items-center justify-center">
              <Bell className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-brand-blue">Notifications</h3>
              <p className="text-sm text-brand-gray">Choose how you want to be notified.</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-brand-blue">Order Updates (Email)</p>
                <p className="text-sm text-brand-gray mt-1">Receive updates about your order status.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-brand-gray/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-gray/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
              </label>
            </div>
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-brand-gray/10">
              <div>
                <p className="font-medium text-brand-blue">SMS Notifications</p>
                <p className="text-sm text-brand-gray mt-1">Receive delivery updates via SMS.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={smsNotifs} onChange={(e) => setSmsNotifs(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-brand-gray/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-gray/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
              </label>
            </div>
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-brand-gray/10">
              <div>
                <p className="font-medium text-brand-blue">Marketing & Promos</p>
                <p className="text-sm text-brand-gray mt-1">Exclusive offers and wellness tips.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={marketingNotifs} onChange={(e) => setMarketingNotifs(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-brand-gray/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-gray/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
              </label>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Danger Zone */}
      <BlurFade delay={0.4}>
        <div className="bg-red-50/50 rounded-3xl border border-red-100 overflow-hidden">
          <div className="p-6">
            <h3 className="font-heading font-bold text-lg text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600/80 mb-6">Permanently remove your account and all associated data.</p>
            <button className="flex items-center gap-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl transition-colors">
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
