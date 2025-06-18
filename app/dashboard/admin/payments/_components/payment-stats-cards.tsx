"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface PaymentStats {
  totalRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
}

export function PaymentStatsCards() {
  const [stats, setStats] = useState<PaymentStats | null>(null);
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
          totalRevenue: data.payments?.totalRevenue || 0,
          totalPayments: data.payments?.total || 0,
          successfulPayments: data.payments?.successful || 0,
          // Assuming failedPayments is calculated as total - successful on the frontend or needs a dedicated API field
          failedPayments: (data.payments?.total || 0) - (data.payments?.successful || 0),
          // monthlyRevenue and monthlyGrowth might come from charts data or need specific fields in payments stats
          // For now, let's assume they are part of a different structure or will be addressed separately
          // Placeholder for monthlyRevenue, assuming it might be in charts or a specific API field
          monthlyRevenue: data.charts?.monthlyRevenue?.reduce((acc: number, cur: { revenue: number }) => acc + cur.revenue, 0) || 0, 
          // Placeholder for monthlyGrowth, this usually requires comparison with the previous month
          monthlyGrowth: 0, // This needs more complex logic or a dedicated API field
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
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Failed to load payment stats: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="bg-muted h-8 w-24 animate-pulse rounded" />
            ) : (
              formatCurrency(stats?.totalRevenue || 0)
            )}
          </div>
          <p className="text-muted-foreground text-xs">All-time revenue</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          <CreditCard className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="bg-muted h-8 w-16 animate-pulse rounded" />
            ) : (
              stats?.totalPayments?.toLocaleString() || "0"
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            {loading ? (
              <span className="bg-muted inline-block h-3 w-20 animate-pulse rounded" />
            ) : (
              `${stats?.successfulPayments || 0} successful, ${stats?.failedPayments || 0} failed`
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="bg-muted h-8 w-24 animate-pulse rounded" />
            ) : (
              formatCurrency(stats?.monthlyRevenue || 0)
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            {loading ? (
              <span className="bg-muted inline-block h-3 w-16 animate-pulse rounded" />
            ) : (
              `${formatPercentage(stats?.monthlyGrowth || 0)} from last month`
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CreditCard className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="bg-muted h-8 w-16 animate-pulse rounded" />
            ) : (
              `${stats?.totalPayments ? Math.round((stats.successfulPayments / stats.totalPayments) * 100) : 0}%`
            )}
          </div>
          <p className="text-muted-foreground text-xs">Payment success rate</p>
        </CardContent>
      </Card>
    </div>
  );
}
