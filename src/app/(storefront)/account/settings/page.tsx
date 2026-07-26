"use client";

import { SettingsSection } from "@/components/account/SettingsSection";
import BlurFade from "@/components/ui/blur-fade";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <BlurFade delay={0.1}>
        <div className="border-b border-brand-gray/10 pb-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-2">
            Account Settings
          </h1>
          <p className="text-brand-gray">
            Manage your security and notification preferences.
          </p>
        </div>
      </BlurFade>

      <SettingsSection />
    </div>
  );
}
