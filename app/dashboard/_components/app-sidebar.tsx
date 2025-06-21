"use client";

import * as React from "react";
import {
  Home,
  Settings,
  LucideIcon,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { APP_NAME } from "@/constants";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
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

const navigation: {
  title: string;
  url: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, toggleSidebar } = useSidebar();

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
        <Logo className="m-0 size-5 p-1" />
        {open && <>{APP_NAME}</>}
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup>
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
                  <SidebarMenuButton isActive={item.url === pathname}>
                    <div className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <UserButton />
          </div>
          {open && (
            <ModeToggle variant="ghost" size="icon" className="shrink-0" />
          )}
        </div>
        {!open && (
          <div className="flex justify-center">
            <ModeToggle variant="ghost" size="icon" />
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
