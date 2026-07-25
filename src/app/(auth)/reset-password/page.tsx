import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Shop Kareta",
  description: "Create a new password for your Shop Kareta account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Set New Password"
      description="Your new password must be different to previously used passwords."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
