import { AuthForm } from "@/components/forms/auth-form";
import { getAvailableSocialProviders } from "@/lib/auth/providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account with magic link",
};

export default async function LoginPage() {
  const availableProviders = getAvailableSocialProviders();
  return <AuthForm mode="login" availableProviders={availableProviders} />;
}
