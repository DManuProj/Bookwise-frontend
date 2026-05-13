"use client";

import { useOverview } from "@/hooks/api/useOverview";
import AlertsBanner from "@/components/dashboard/overview/AlertsBanner";
import StatsCards from "@/components/dashboard/overview/StatsCards";
import RecentActivity from "@/components/dashboard/overview/RecentActivity";
import UpcomingToday from "@/components/dashboard/overview/UpcomingToday";
import BookingsByStatus from "@/components/dashboard/overview/BookingsByStatus";
import TopServices from "@/components/dashboard/overview/TopServices";
import OverviewSkelton from "@/components/dashboard/overview/OverviewSkeleton";
// import a skeleton — match what other pages use (e.g. bookings/customers pages)

const DashboardPage = () => {
  const { data, isPending, isError } = useOverview();

  // Loading state
  if (isPending) {
    return <OverviewSkelton />; // we'll define this below
  }

  // Error state
  if (isError || !data) {
    return (
      <div className="p-4 lg:px-8 max-w-8xl mx-auto">
        <p className="text-sm text-muted-foreground">
          Failed to load dashboard. Please refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:px-8 max-w-8xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back — here's what's happening today.
        </p>
      </div>

      {/* Alerts */}
      <AlertsBanner pendingCount={data.pendingBookingsCount} />

      {/* Stats */}
      <StatsCards stats={data.stats} />

      {/* Activity + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <UpcomingToday bookings={data.upcomingToday} />
        </div>
        <RecentActivity items={data.recentActivity} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BookingsByStatus data={data.bookingsByStatus} />

        <TopServices services={data.topServices} />
      </div>
    </div>
  );
};

export default DashboardPage;
