import AlertsBanner from "@/components/dashboard/overview/AlertsBanner";
import BookingsByStatus from "@/components/dashboard/overview/BookingsByStatus";
import RecentBookingsTable from "@/components/dashboard/overview/RecentBookingsTable";
import StatsCards from "@/components/dashboard/overview/StatsCards";
import TopServices from "@/components/dashboard/overview/TopServices";
import UpcomingToday from "@/components/dashboard/overview/UpcomingToday";

const DashboardPage = () => {
  return (
    <div className="p-4 lg:px-8  max-w-8xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back — here's what's happening today.
        </p>
      </div>

      {/* Alerts */}
      <AlertsBanner />

      {/* Stats */}
      <StatsCards />

      {/* Recent bookings + Upcoming today */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentBookingsTable />
        </div>
        <UpcomingToday />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BookingsByStatus />
        <TopServices />
      </div>
    </div>
  );
};

export default DashboardPage;
