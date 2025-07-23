import { AdminNav } from "./_components/admin-nav";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}