import { AuthForm } from "@/components/forms/auth-form";
import { getAvailableSocialProviders } from "@/lib/auth/providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your account with magic link",
};

export default function SignUpPage() {
  const availableProviders = getAvailableSocialProviders();
  return <AuthForm mode="signup" availableProviders={availableProviders} />;
}
