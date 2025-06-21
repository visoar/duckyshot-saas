import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Your Email - Magic Link Sent",
  description: "We've sent you a secure magic link to access your account",
};

export default function SentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}