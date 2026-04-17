import Link from "next/link";
import Logo from "@/components/shared/Logo";

type Props = { children: React.ReactNode };

const InviteShell = ({ children }: Props) => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
    <Link href="/" className="mb-8">
      <Logo />
    </Link>
    <div className="w-full max-w-md">{children}</div>
  </div>
);

export default InviteShell;
