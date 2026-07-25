import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | Shop Kareta",
  description: "Create a new Shop Kareta account to enjoy a premium shopping experience.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an account"
      description="Join Shop Kareta for exclusive benefits and seamless shopping."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
