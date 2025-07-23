import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface DashboardPageWrapperProps {
  title: string;
  parentTitle?: string;
  parentUrl?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardPageWrapper({
  title,
  parentTitle,
  parentUrl,
  description,
  actions,
  children,
}: DashboardPageWrapperProps) {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          {/* Breadcrumb Navigation */}
          {parentTitle && parentUrl && (
            <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
              <Link
                href={parentUrl}
                className="hover:text-foreground transition-colors"
              >
                {parentTitle}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{title}</span>
            </nav>
          )}
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-2 text-sm">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>

      {/* Page Content */}
      <div className="space-y-6">{children}</div>
    </div>
  );
}
