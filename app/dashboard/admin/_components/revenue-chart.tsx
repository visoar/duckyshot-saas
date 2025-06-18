"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle } from "lucide-react";

interface RevenueData {
  month: string;
  revenue: number;
  count: number;
}

export function RevenueChart() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch revenue data");
        }
        const result = await response.json();

        // Transform the data for the chart
        const chartData = result.charts.monthlyRevenue
          .map((item: { month: string; revenue: number; count: number }) => ({
            month: new Date(item.month + "-01").toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            revenue: item.revenue / 100, // Convert from cents to dollars
            count: item.count,
          }))
          .reverse(); // Reverse to show oldest to newest

        setData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="bg-muted h-[400px] animate-pulse rounded" />;
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-destructive flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Failed to load chart: {error}</span>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background rounded-lg border p-2 shadow-sm">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-[0.70rem] uppercase">
                        {label}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-[0.70rem] uppercase">
                        Revenue
                      </span>
                      <span className="font-bold">
                        {formatCurrency(payload[0].value as number)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-[0.70rem] uppercase">
                        Payments
                      </span>
                      <span className="text-muted-foreground font-bold">
                        {payload[0].payload.count}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="revenue" className="fill-primary" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
