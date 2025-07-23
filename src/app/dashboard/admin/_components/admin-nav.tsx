"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth/client";
import { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  CreditCard,
  Database,
  Menu,
  Shield,
  Upload,
  Users,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

import { isAdminRole, UserRole } from "@/lib/config/roles";
import { enabledTablesMap } from "@/lib/config/admin-tables";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

// Core admin navigation configuration
const coreAdminNavigation: {
  title: string;
  url: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: BarChart3,
  },
  {
    title: "Users",
    url: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Payments",
    url: "/dashboard/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Subscriptions",
    url: "/dashboard/admin/subscriptions",
    icon: Shield,
  },
  {
    title: "Uploads",
    url: "/dashboard/admin/uploads",
    icon: Upload,
  },
];

function formatTableTitle(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function NavItem({
  item,
  pathname,
  className,
}: {
  item: { title: string; url: string; icon: LucideIcon };
  pathname: string;
  className?: string;
}) {
  const isActive = pathname === item.url;
  
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      asChild
      className={cn(
        "h-9 justify-start",
        isActive && "bg-primary text-primary-foreground",
        className
      )}
    >
      <Link href={item.url} className="flex items-center gap-2">
        <item.icon className="h-4 w-4" />
        {item.title}
      </Link>
    </Button>
  );
}

function DesktopNav({
  coreNavigation,
  tableNavigation,
  pathname,
}: {
  coreNavigation: typeof coreAdminNavigation;
  tableNavigation: Array<{ title: string; url: string; icon: LucideIcon }>;
  pathname: string;
}) {
  return (
    <div className="hidden lg:flex lg:items-center lg:gap-1">
      {/* Core navigation items */}
      {coreNavigation.map((item) => (
        <NavItem
          key={item.title}
          item={item}
          pathname={pathname}
        />
      ))}

      {/* Table management dropdown */}
      {tableNavigation.length > 0 && (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-9 text-sm">
                <Database className="mr-2 h-4 w-4" />
                Tables
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-1 p-2">
                  <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
                    Data Management
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {tableNavigation.map((item) => (
                      <NavigationMenuLink key={item.title} asChild>
                        <Link
                          href={item.url}
                          className={cn(
                            "flex items-center gap-2 rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                            pathname === item.url && "bg-accent text-accent-foreground"
                          )}
                        >
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span>{item.title}</span>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </div>
  );
}

function MobileNav({
  coreNavigation,
  tableNavigation,
  pathname,
}: {
  coreNavigation: typeof coreAdminNavigation;
  tableNavigation: Array<{ title: string; url: string; icon: LucideIcon }>;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const [tablesSectionOpen, setTablesSectionOpen] = useState(false);

  return (
    <div className="flex lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle>Admin Navigation</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
            <div className="space-y-4">
              {/* Core navigation */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Core Admin
                </div>
                {coreNavigation.map((item) => (
                  <NavItem
                    key={item.title}
                    item={item}
                    pathname={pathname}
                    className="w-full"
                  />
                ))}
              </div>

              {/* Table management */}
              {tableNavigation.length > 0 && (
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    onClick={() => setTablesSectionOpen(!tablesSectionOpen)}
                    className="w-full justify-between text-sm font-medium text-muted-foreground h-8 px-2"
                  >
                    <span className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Table Management
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        tablesSectionOpen && "rotate-180"
                      )}
                    />
                  </Button>
                  {tablesSectionOpen && (
                    <div className="space-y-1 pl-4">
                      {tableNavigation.map((item) => (
                        <NavItem
                          key={item.title}
                          item={item}
                          pathname={pathname}
                          className="w-full"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Check if user is admin
  const isAdmin =
    session?.user &&
    isAdminRole((session.user as { role?: UserRole }).role || "user");

  if (!isAdmin) {
    return null;
  }

  // Generate generic table navigation
  const tableNavigation = Object.keys(enabledTablesMap).map((key) => ({
    title: formatTableTitle(key),
    url: `/dashboard/admin/tables/${key}`,
    icon: Database,
  }));

  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-foreground">
              Admin Panel
            </div>
            <DesktopNav
              coreNavigation={coreAdminNavigation}
              tableNavigation={tableNavigation}
              pathname={pathname}
            />
          </div>
          <MobileNav
            coreNavigation={coreAdminNavigation}
            tableNavigation={tableNavigation}
            pathname={pathname}
          />
        </div>
      </div>
    </div>
  );
}