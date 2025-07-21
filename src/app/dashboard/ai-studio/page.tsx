import { createMetadata } from "@/lib/metadata";
import { DashboardPageWrapper } from "../_components/dashboard-page-wrapper";
import { AIStudioWorkflow } from "./_components/ai-studio-workflow";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = createMetadata({
  title: "AI Art Studio",
  description: "Transform your pet into magical AI artwork in seconds",
});

export default function AIStudioPage() {
  return (
    <DashboardPageWrapper 
      title="AI Art Studio"
      description="Transform your pet photos into stunning AI artwork with multiple artistic styles"
    >
      <AIStudioWorkflow />
    </DashboardPageWrapper>
  );
}