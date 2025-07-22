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
  description,
  actions,
  children,
}: DashboardPageWrapperProps) {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
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
