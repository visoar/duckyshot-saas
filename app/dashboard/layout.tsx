import { Suspense } from "react";
import Loading from "@/app/loading";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <div className="flex flex-1 flex-col">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
