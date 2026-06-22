import SettingsBusinessInfo from "@/components/dashboard/settings/SettingsBusinessInfo";
import SettingsWorkingHours from "@/components/dashboard/settings/SettingsWorkingHours";
import SettingsBookingPrefs from "@/components/dashboard/settings/SettingsBookingPrefs";
import SettingsProfile from "@/components/dashboard/settings/SettingsProfile";
import SettingsDangerZone from "@/components/dashboard/settings/SettingsDangerZone";
import SettingsBillingCard from "@/components/dashboard/settings/SettingsBillingCard";

const SettingsPage = () => (
  <div className="p-6 max-w-8xl mx-auto">
    {/* Page header */}
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Settings
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your business and account settings.
      </p>
    </div>

    {/* Centered content with max width */}
    <div className="mx-auto  space-y-5">
      <SettingsBusinessInfo />
      <SettingsBookingPrefs />
      <SettingsWorkingHours />

      <SettingsBillingCard />
      <SettingsProfile />
      <SettingsDangerZone />
    </div>
  </div>
);

export default SettingsPage;
