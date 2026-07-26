"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/lib/validations/account";
import { useAuthStore } from "@/store/authStore";
import { Camera, Loader2, Save, X } from "lucide-react";
import BlurFade from "@/components/ui/blur-fade";

export function ProfileForm() {
  const { user, login } = useAuthStore(); // Using login to update the mock user state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      mobile: "", // Mock empty
      dob: "",
      gender: "",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    setIsSaving(true);
    // Mock API call
    setTimeout(() => {
      // Update our mock user store
      if (user) {
        login({
          ...user,
          fullName: data.fullName,
          email: data.email,
        });
      }
      setIsSaving(false);
      setIsEditing(false);
      setToastMessage("Profile updated successfully!");
      setTimeout(() => setToastMessage(""), 3000);
    }, 1000);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <BlurFade delay={0.2}>
      <div className="bg-white rounded-3xl border border-brand-gray/10 p-6 md:p-8 shadow-sm relative overflow-hidden">
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-brand-green text-white px-6 py-2 rounded-full font-medium text-sm shadow-md animate-in slide-in-from-top-4 fade-in duration-300 z-10">
            {toastMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-8 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer">
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${form.watch('fullName') || 'User'}`}
                alt="Profile Avatar"
                className="w-32 h-32 rounded-full border-4 border-brand-light object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            {isEditing && (
              <p className="text-xs text-brand-gray/70 text-center max-w-[120px]">
                Click to change profile picture
              </p>
            )}
          </div>

          {/* Form Section */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-2xl text-brand-blue">Personal Information</h2>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-semibold text-brand-green hover:text-[#0F6B46] bg-brand-green/10 px-4 py-2 rounded-xl transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-brand-blue">Full Name</label>
                  <input
                    {...form.register("fullName")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green disabled:bg-brand-gray/5 disabled:text-brand-gray transition-colors"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-brand-blue">Email Address</label>
                  <input
                    {...form.register("email")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green disabled:bg-brand-gray/5 disabled:text-brand-gray transition-colors"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-brand-blue">Mobile Number</label>
                  <input
                    {...form.register("mobile")}
                    disabled={!isEditing}
                    placeholder="+91"
                    className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green disabled:bg-brand-gray/5 disabled:text-brand-gray transition-colors"
                  />
                  {form.formState.errors.mobile && (
                    <p className="text-sm text-red-500">{form.formState.errors.mobile.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-brand-blue">Date of Birth</label>
                  <input
                    type="date"
                    {...form.register("dob")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green disabled:bg-brand-gray/5 disabled:text-brand-gray transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-brand-blue">Gender</label>
                  <select
                    {...form.register("gender")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-brand-gray/20 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green disabled:bg-brand-gray/5 disabled:text-brand-gray transition-colors"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center gap-3 pt-4 border-t border-brand-gray/10 mt-6">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#0F6B46] hover:bg-[#148356] text-white font-semibold py-3 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 min-w-[140px]"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <><Save className="w-5 h-5" /> Save Changes</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="bg-white border border-brand-gray/20 hover:bg-brand-gray/5 text-brand-gray font-semibold py-3 px-8 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" /> Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </BlurFade>
  );
}
