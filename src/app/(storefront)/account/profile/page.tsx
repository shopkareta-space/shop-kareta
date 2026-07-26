"use client";

import { ProfileForm } from "@/components/account/ProfileForm";
import BlurFade from "@/components/ui/blur-fade";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <BlurFade delay={0.1}>
        <div className="border-b border-brand-gray/10 pb-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-blue mb-2">
            My Profile
          </h1>
          <p className="text-brand-gray">
            Manage your personal information and preferences.
          </p>
        </div>
      </BlurFade>

      <ProfileForm />
    </div>
  );
}
