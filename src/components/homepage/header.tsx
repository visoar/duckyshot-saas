"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth/client";
import { Session } from "@/types/auth";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  Menu,
  UserCircle,
  ExternalLink,
  Settings,
  LogOut,
  CreditCard,
} from "lucide-react";
import { APP_NAME } from "@/lib/config/constants";
import { isAdminRole, UserRole } from "@/lib/config/roles";
import { CreditsDisplay } from "@/components/ui/credits-display";
import { getUserAvatarUrl } from "@/lib/avatar";

interface NavItem {
  title: string;
  href?: string;
  description?: string;
  items?: NavItem[];
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  external?: boolean;
}

// Navigation focused on core product features only
const unifiedNavItems: NavItem[] = [
  {
    title: "Create",
    href: "/ai-studio",
  },
  {
    title: "Explore",
    href: "/gallery",
  },
  {
    title: "My Art",
    href: "/artworks",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
];

const mobileNavItems: NavItem[] = [
  {
    title: "Create",
    href: "/ai-studio",
  },
  {
    title: "Explore",
    href: "/gallery",
  },
  {
    title: "My Art",
    href: "/artworks",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
];

function NavigationDropdown({ item }: { item: NavItem }) {
  if (!item.items) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-muted-foreground data-[state=open]:text-foreground h-9 px-3 text-sm font-medium"
        >
          {item.title}
          <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 p-2" sideOffset={8}>
        {item.items.map((subItem, index) => {
          const IconComponent = subItem.icon;

          return (
            <DropdownMenuItem key={index} asChild>
              {subItem.href ? (
                <Link
                  href={subItem.href}
                  className="hover:bg-accent flex items-start gap-3 rounded-md p-3 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {IconComponent && (
                        <IconComponent className="text-primary h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">
                        {subItem.title}
                      </span>
                      {subItem.badge && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs font-medium">
                          {subItem.badge}
                        </span>
                      )}
                      {subItem.external && (
                        <ExternalLink className="text-muted-foreground h-3 w-3" />
                      )}
                    </div>
                    {subItem.description && (
                      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                        {subItem.description}
                      </p>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="flex items-start gap-3 p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {IconComponent && (
                        <IconComponent className="text-primary h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">
                        {subItem.title}
                      </span>
                      {subItem.badge && (
                        <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs font-medium">
                          {subItem.badge}
                        </span>
                      )}
                    </div>
                    {subItem.description && (
                      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                        {subItem.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// User Avatar Dropdown component for authenticated users
function UserAvatarDropdown({
  session,
  isPending,
}: {
  session: Session | null;
  isPending: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isPending || !user) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  const isAdmin = isAdminRole((user as { role?: UserRole }).role || "user");
  const avatarUrl = getUserAvatarUrl(
    (user as { image?: string }).image,
    (user as { email?: string }).email,
    (user as { name?: string }).name,
  );
  const userInitials =
    (user as { name?: string }).name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    (user as { email?: string }).email?.[0]?.toUpperCase() ||
    "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={avatarUrl}
              alt={(user as { name?: string }).name || "User"}
            />
            <AvatarFallback className="text-xs font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {(user as { name?: string }).name && (
              <p className="text-sm leading-none font-medium">
                {(user as { name?: string }).name}
              </p>
            )}
            <p className="text-muted-foreground text-xs leading-none">
              {(user as { email?: string }).email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="px-2 py-1">
          <CreditsDisplay compact />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center">
            <UserCircle className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/pricing" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/admin" className="flex items-center">
                <UserCircle className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/api/auth/signout"
            className="flex items-center text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Auth buttons component to handle loading state
function AuthButtons({
  session,
  isPending,
}: {
  session: Session | null;
  isPending: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isPending) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        {/* <Skeleton className="h-8 w-16" /> */}
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  if (session?.user && session?.session) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <UserAvatarDropdown session={session} isPending={isPending} />
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">Sign In</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/signup">Get Started</Link>
      </Button>
    </div>
  );
}

// Mobile auth buttons component
function MobileAuthButtons({
  session,
  isPending,
}: {
  session: Session | null;
  isPending: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isPending) {
    return (
      <div className="mt-8 space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (session?.user && session?.session) {
    const user = session.user;
    const isAdmin = isAdminRole((user as { role?: UserRole }).role || "user");

    return (
      <div className="mt-8 space-y-3">
        <div className="bg-muted/50 flex items-center justify-center gap-3 rounded-lg border p-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={getUserAvatarUrl(
                (user as { image?: string }).image,
                (user as { email?: string }).email,
                (user as { name?: string }).name,
              )}
              alt={(user as { name?: string }).name || "User"}
            />
            <AvatarFallback className="text-sm font-medium">
              {(user as { name?: string }).name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() ||
                (user as { email?: string }).email?.[0]?.toUpperCase() ||
                "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            {(user as { name?: string }).name && (
              <p className="text-sm font-medium">
                {(user as { name?: string }).name}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              {(user as { email?: string }).email}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <CreditsDisplay />
        </div>
        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href="/dashboard">
              <UserCircle className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          {isAdmin && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/admin">
                <UserCircle className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
          )}
          <Button asChild variant="ghost" className="w-full text-red-600">
            <Link href="/api/auth/signout">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      <Button asChild className="w-full">
        <Link href="/login">Sign In</Link>
      </Button>
      <Button asChild variant="outline" className="w-full">
        <Link href="/signup">Get Started</Link>
      </Button>
    </div>
  );
}

function MobileNavigation({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: session, isPending } = useSession();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="border-border flex items-center gap-2 border-b p-6">
          <Logo className="text-primary h-6 w-6" variant="icon-only" />
          <span className="text-lg font-bold">{APP_NAME}</span>
        </div>

        <div className="flex flex-col p-6">
          <nav className="space-y-4">
            {/* Show appropriate nav based on auth status */}
            {mobileNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.href!}
                className="text-foreground hover:text-primary block py-2 text-sm font-medium transition-colors"
                onClick={onClose}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <MobileAuthButtons session={session} isPending={isPending} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-200",
          isScrolled && "border-border/80 bg-background/80 shadow-sm",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            {/* Left side - Logo + Navigation */}
            <div className="flex items-center gap-6 lg:gap-8">
              {/* Logo */}
              <Link href="/" className="flex flex-shrink-0 items-center gap-2">
                <Logo className="text-primary h-6 w-6" variant="icon-only" />
                <span className="text-foreground text-xl font-bold">
                  {APP_NAME}
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden items-center gap-2 md:flex">
                {/* Unified navigation for all users */}
                {unifiedNavItems.map((item, index) => (
                  <div key={index}>
                    {item.items ? (
                      <NavigationDropdown item={item} />
                    ) : (
                      <Button
                        asChild
                        variant="ghost"
                        className="h-9 px-4 text-sm font-medium"
                      >
                        <Link
                          href={item.href!}
                          className={cn(
                            "text-muted-foreground transition-colors",
                            pathname === item.href && "text-foreground",
                          )}
                        >
                          {item.title}
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Right side actions */}
            <div className="ml-auto flex items-center gap-2 md:gap-3">
              {/* Theme toggle */}
              <ModeToggle variant="ghost" size="icon" />

              {/* Desktop CTA buttons */}
              <AuthButtons session={session} isPending={isPending} />

              {/* Mobile menu trigger */}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
