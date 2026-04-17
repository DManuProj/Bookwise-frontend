import ProfileSetupShell from "@/components/profile/ProfileSetupShell";
import ProfileSetupForm from "@/components/profile/ProfileSetupForm";

// TODO: add guard when backend is ready
// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
//
// const { userId } = await auth()
// if (!userId) redirect("/sign-in")
//
// const user = await fetchUserByClerkId(userId)
// if (user.profileComplete) redirect("/dashboard")
// if (user.role === "OWNER") redirect("/dashboard")

const ProfileSetupPage = () => (
  <ProfileSetupShell>
    <ProfileSetupForm />
  </ProfileSetupShell>
);

export default ProfileSetupPage;
