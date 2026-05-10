import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/api/useMe";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const SignedInActions = () => {
  const { data: me, isLoading } = useMe();

  // While fetching /me, show skeleton matching button size
  if (isLoading || !me) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-32 rounded-lg bg-brand-200 dark:bg-brand-900 animate-pulse" />
        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    );
  }

  // OWNER + onboarding incomplete
  if (me.role === "OWNER" && !me.onboardingComplete) {
    return (
      <>
        <Button
          size="sm"
          className="bg-brand-500 hover:bg-brand-600 text-white"
          asChild
        >
          <Link href="/onboarding">Continue Setup</Link>
        </Button>
        <UserButton />
      </>
    );
  }

  // STAFF + profile incomplete
  if (me.role !== "OWNER" && !me.profileComplete) {
    return (
      <>
        <Button
          size="sm"
          className="bg-brand-500 hover:bg-brand-600 text-white"
          asChild
        >
          <Link href="/profile/setup">Complete Profile</Link>
        </Button>
        <UserButton />
      </>
    );
  }

  // Fully set up
  return (
    <>
      <Button
        size="sm"
        className="bg-brand-500 hover:bg-brand-600 text-white"
        asChild
      >
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <UserButton />
    </>
  );
};

export default SignedInActions;
