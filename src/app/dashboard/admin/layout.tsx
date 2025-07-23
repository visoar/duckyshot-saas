import { AdminNav } from "./_components/admin-nav";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="bg-background min-h-screen">
      <AdminNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
