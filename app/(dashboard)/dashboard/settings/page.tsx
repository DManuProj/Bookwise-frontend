import SettingsBusinessInfo from "@/components/dashboard/settings/SettingsBusinessInfo";
import SettingsWorkingHours from "@/components/dashboard/settings/SettingsWorkingHours";
import SettingsBookingPrefs from "@/components/dashboard/settings/SettingsBookingPrefs";
import SettingsNotifications from "@/components/dashboard/settings/SettingsNotifications";
import SettingsProfile from "@/components/dashboard/settings/SettingsProfile";
import SettingsDangerZone from "@/components/dashboard/settings/SettingsDangerZone";

const SettingsPage = () => (
  <div className="p-6 lg:p-8">
    {/* Page header */}
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground">
        Manage your business and account settings.
      </p>
    </div>

    {/* Centered content with max width */}
    <div className="max-w-2xl mx-auto space-y-4">
      <SettingsBusinessInfo />
      <SettingsBookingPrefs />
      <SettingsWorkingHours />

      {/* <SettingsNotifications /> */}
      <SettingsProfile />
      <SettingsDangerZone />
    </div>
  </div>
);

export default SettingsPage;
