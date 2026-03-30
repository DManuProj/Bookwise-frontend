"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type CenterLabelProps = {
  cx?: number;
  cy?: number;
};

const DATA = {
  totalBooking: 94,
  bookings: [
    { name: "Confirmed", value: 42, color: "#10b981" },
    { name: "Pending", value: 18, color: "#f59e0b" },
    { name: "Completed", value: 28, color: "#64748b" },
    { name: "Cancelled", value: 6, color: "#ef4444" },
  ],
};

const renderCenterLabel = ({ cx, cy }: CenterLabelProps) => {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan
        x={cx}
        dy="-0.2em"
        className="fill-foreground"
        fontSize="24"
        fontWeight="700"
      >
        {DATA.totalBooking}
      </tspan>
      <tspan x={cx} dy="1.4em" className="fill-muted-foreground" fontSize="11">
        Total
      </tspan>
    </text>
  );
};

const BookingsByStatus = () => (
  <Card className="border border-brand-500/40 dark:border-brand-500/10">
    <CardContent className="p-5">
      <h2 className="text-base font-semibold text-foreground ">
        Bookings by Status
      </h2>
      <p className="text-xs text-muted-foreground ">This month</p>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={DATA.bookings}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            label={renderCenterLabel}
          >
            {DATA.bookings.map((entry, i) => (
              <Cell key={i} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} bookings`, name]}
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              fontSize: "12px",
              color: "hsl(var(--popover-foreground))",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span
                style={{
                  fontSize: "14px",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default BookingsByStatus;
