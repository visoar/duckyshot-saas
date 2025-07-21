import { Suspense } from "react";
import Loading from "@/app/loading";
import { Header } from "@/components/homepage/header";
import { Footer } from "@/components/homepage/footer";
import { SessionGuard } from "./_components/session-guard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <SessionGuard>
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </SessionGuard>
      </main>
      <Footer />
    </div>
  );
}
