import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | Shop Kareta",
  description: "Reset your Shop Kareta account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email address and we'll send you a link to reset your password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
