import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardPageHeaderProps {
  title: string;
  parentTitle?: string;
  parentUrl?: string;
  description?: string;
  actions?: React.ReactNode;
  showSidebarTrigger?: boolean;
}

export function DashboardPageHeader({
  title,
  parentTitle,
  parentUrl,
  description,
  actions,
  showSidebarTrigger = true,
}: DashboardPageHeaderProps) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          {showSidebarTrigger && (
            <>
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
            </>
          )}
          <div className="flex flex-col gap-1">
            <Breadcrumb>
              <BreadcrumbList>
                {parentTitle && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href={parentUrl}>
                        {parentTitle}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {description && (
              <p className="text-sm text-muted-foreground hidden sm:block">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}