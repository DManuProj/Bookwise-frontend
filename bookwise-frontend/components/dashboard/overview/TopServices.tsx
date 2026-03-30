"use client";

import { Card, CardContent } from "@/components/ui/card";
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

const DATA = [
  { name: "Haircut", bookings: 38 },
  { name: "Massage", bookings: 27 },
  { name: "Manicure", bookings: 19 },
  { name: "Facial", bookings: 14 },
  { name: "Beard Trim", bookings: 10 },
];

const TopServices = () => (
  <Card className="border border-brand-500/40 dark:border-brand-500/10">
    <CardContent className="p-5">
      <h2 className="text-base font-semibold text-foreground ">Top Services</h2>
      <p className="text-sm text-muted-foreground mb-5">
        Most booked this month
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={DATA}
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
            formatter={(value, name) => [`${value} bookings`, "Bookings"]}
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              fontSize: "12px",
              color: "hsl(var(--popover-foreground))",
            }}
          />
          <Bar dataKey="bookings" radius={[0, 4, 4, 0]}>
            {DATA.map((_, i) => (
              <Cell
                key={i}
                fill={i === 0 ? "#10b981" : `rgba(16,185,129,${0.6 - i * 0.1})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default TopServices;
