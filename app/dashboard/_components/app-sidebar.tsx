"use client";

import * as React from "react";
import {
  Home,
  Settings,
  Upload,
  Shield,
  Users,
  CreditCard,
  BarChart3,
  LucideIcon,
} from "lucide-react";
import { APP_NAME } from "@/lib/config/constants";
import { isAdminRole, UserRole } from "@/lib/config/roles";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { UserButton } from "./user-btn";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { useSession } from "@/lib/auth/client";

const navigation: {
  title: string;
  url: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Home",
    url: "/dashboard/home",
    icon: Home,
  },
  {
    title: "Upload",
    url: "/dashboard/upload",
    icon: Upload,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

const adminNavigation: {
  title: string;
  url: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Admin Dashboard",
    url: "/dashboard/admin",
    icon: BarChart3,
  },
  {
    title: "User Management",
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
    title: "Uploads Managements",
    url: "/dashboard/admin/uploads",
    icon: Upload,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, toggleSidebar } = useSidebar();
  const { data: session } = useSession();

  const isAdmin =
    session?.user &&
    isAdminRole((session.user as { role?: UserRole }).role || "user");

  const handleNavigation = (url: string) => () => {
    router.replace(url);
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader
        className={cn(
          "flex flex-row items-center py-3 text-sm font-semibold",
          open ? "px-4" : "justify-center",
        )}
      >
        <Link href="/">
          <Logo className="m-0 size-5 p-1" />
        </Link>
        {open && (
          <>
            <span className="text-base font-semibold">{APP_NAME}</span>
          </>
        )}
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div
                    onClick={handleNavigation(item.url)}
                    onDoubleClick={() => {
                      handleNavigation(item.url)();
                      toggleSidebar();
                    }}
                  >
                    <SidebarMenuButton
                      isActive={item.url === pathname}
                      tooltip={item.title}
                      className="cursor-pointer"
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
              {open && (
                <div className="text-muted-foreground px-2 py-1 text-xs font-semibold">
                  Admin
                </div>
              )}
              <SidebarMenu>
                {adminNavigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <div
                      onClick={handleNavigation(item.url)}
                      onDoubleClick={() => {
                        handleNavigation(item.url)();
                        toggleSidebar();
                      }}
                    >
                      <SidebarMenuButton
                        isActive={item.url === pathname}
                        tooltip={item.title}
                        className="cursor-pointer"
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-sidebar-divider border-t p-2">
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
