"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  trialSubscriptions: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
}

export function SubscriptionStatsCards() {
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats({
          totalSubscriptions: data.totalSubscriptions || 0,
          activeSubscriptions: data.activeSubscriptions || 0,
          cancelledSubscriptions: data.cancelledSubscriptions || 0,
          trialSubscriptions: data.trialSubscriptions || 0,
          monthlyRecurringRevenue: data.monthlyRecurringRevenue || 0,
          churnRate: data.churnRate || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100); // Assuming amounts are in cents
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Failed to load subscription stats: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Subscriptions
          </CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="bg-muted h-8 w-16 animate-pulse rounded" />
            ) : (
              stats?.totalSubscriptions?.toLocaleString() || "0"
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            All-time subscriptions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Subscriptions
          </CardTitle>
          <UserCheck className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="bg-muted h-8 w-16 animate-pulse rounded" />
            ) : (
              stats?.activeSubscriptions?.toLocaleString() || "0"
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            {loading ? (
              <span className="bg-muted inline-block h-3 w-20 animate-pulse rounded" />
            ) : (
              `${stats?.trialSubscriptions || 0} on trial`
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Recurring Revenue
          </CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="bg-muted h-8 w-24 animate-pulse rounded" />
            ) : (
              formatCurrency(stats?.monthlyRecurringRevenue || 0)
            )}
          </div>
          <p className="text-muted-foreground text-xs">Current MRR</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
          <UserX className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="bg-muted h-8 w-16 animate-pulse rounded" />
            ) : (
              formatPercentage(stats?.churnRate || 0)
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            {loading ? (
              <span className="bg-muted inline-block h-3 w-20 animate-pulse rounded" />
            ) : (
              `${stats?.cancelledSubscriptions || 0} cancelled this month`
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
