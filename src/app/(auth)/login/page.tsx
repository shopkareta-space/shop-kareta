import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Shop Kareta",
  description: "Sign in to your Shop Kareta account to continue shopping.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your details to access your account."
    >
      <LoginForm />
    </AuthLayout>
  );
}
