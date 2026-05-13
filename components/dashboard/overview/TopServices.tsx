"use client";

import { Card, CardContent } from "@/components/ui/card";
import { OverviewTopService } from "@/types/overview";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const TopServices = ({ services }: { services: OverviewTopService[] }) => {
  // recharts expects { name, bookings } — rename bookingCount → bookings
  const chartData = services.map((s) => ({
    name: s.name,
    bookings: s.bookingCount,
  }));

  return (
    <Card className="border border-brand-500/40 dark:border-brand-500/10">
      <CardContent className="p-5">
        <h2 className="text-base font-semibold text-foreground">
          Top Services
        </h2>
        <p className="text-sm text-muted-foreground mb-5">Most booked</p>

        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground">
            No services with bookings yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={72}
                tick={{ fontSize: 13, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                formatter={(value) => [`${value} bookings`, "Bookings"]}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Bar dataKey="bookings" radius={[0, 4, 4, 0]}>
                {chartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === 0 ? "#10b981" : `rgba(16,185,129,${0.6 - i * 0.1})`
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default TopServices;
