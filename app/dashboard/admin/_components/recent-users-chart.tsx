"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle } from "lucide-react";

interface ChartData {
  date: string;
  count: number;
}

export function RecentUsersChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        const result = await response.json();

        // Transform the data for the chart
        const chartData = result.charts.recentUsers
          .map((item: { date: string; count: number }) => ({
            date: new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
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
    return <div className="bg-muted h-[300px] animate-pulse rounded" />;
  }

  if (error) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="text-destructive flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Failed to load chart: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background rounded-lg border p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-[0.70rem] uppercase">
                        Date
                      </span>
                      <span className="text-muted-foreground font-bold">
                        {label}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-[0.70rem] uppercase">
                        New Users
                      </span>
                      <span className="font-bold">{payload[0].value}</span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey="count"
          strokeWidth={2}
          activeDot={{ r: 6 }}
          className="stroke-primary"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
