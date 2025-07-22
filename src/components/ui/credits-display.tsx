"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth/client";

interface UserCredits {
  remaining: number;
  total: number;
}

export function CreditsDisplay({ compact = false }: { compact?: boolean }) {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCredits = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/ai/credits");
        if (response.ok) {
          const data = await response.json();
          setCredits({
            remaining: data.remainingCredits || 0,
            total: data.totalCredits || 0,
          });
        }
      } catch (error) {
        console.error("Failed to load credits:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCredits();
  }, [session?.user]);

  if (!session?.user) {
    return null;
  }

  if (isLoading) {
    return <Skeleton className={compact ? "h-6 w-12" : "h-8 w-16"} />;
  }

  if (compact) {
    return (
      <div className="text-muted-foreground flex items-center gap-1 text-sm">
        <Coins className="h-3 w-3" />
        <span>{credits?.remaining ?? 0} credits</span>
      </div>
    );
  }

  return (
    <Button asChild variant="ghost" size="sm" className="gap-1">
      <Link href="/pricing">
        <Coins className="h-4 w-4" />
        <span className="font-medium">{credits?.remaining ?? 0}</span>
      </Link>
    </Button>
  );
}
