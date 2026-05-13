"use client";

import { Card, CardContent } from "@/components/ui/card";
import { OverviewBookingsByStatus } from "@/types/overview";
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

const BookingsByStatus = ({ data }: { data: OverviewBookingsByStatus }) => {
  // Reshape the flat object into the array recharts expects
  const chartData = [
    { name: "Confirmed", value: data.confirmed, color: "#10b981" },
    { name: "Pending", value: data.pending, color: "#f59e0b" },
    { name: "Completed", value: data.completed, color: "#64748b" },
    { name: "Cancelled", value: data.cancelled, color: "#ef4444" },
    { name: "No Show", value: data.noShow, color: "#f43f5e" },
  ].filter((entry) => entry.value > 0); // hide zero-value slices

  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

  const renderCenterLabel = ({ cx, cy }: CenterLabelProps) => (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan
        x={cx}
        dy="-0.2em"
        className="fill-foreground"
        fontSize="24"
        fontWeight="700"
      >
        {total}
      </tspan>
      <tspan x={cx} dy="1.4em" className="fill-muted-foreground" fontSize="11">
        Total
      </tspan>
    </text>
  );

  return (
    <Card className="border border-brand-500/40 dark:border-brand-500/10">
      <CardContent className="p-5">
        <h2 className="text-base font-semibold text-foreground">
          Bookings by Status
        </h2>
        <p className="text-xs text-muted-foreground">This month</p>

        {total === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground">
            No bookings this month yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                label={renderCenterLabel}
              >
                {chartData.map((entry, i) => (
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
        )}
      </CardContent>
    </Card>
  );
};

export default BookingsByStatus;
