import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getUserAction } from "@/lib/auth";
import { IUser } from "@/types/auth-type";

const roleRedirectMap: Record<IUser["role"], string> = {
  Admin: "/dashboard/articles",
  User: "/articles",
};

interface ProtectedLayoutProps {
  children: ReactNode;
  onlyRole?: IUser["role"];
}

export default async function ProtectedLayout({ children, onlyRole }: ProtectedLayoutProps) {
  const user = await getUserAction();

  if (!user) {
    redirect("/login");
  }

  if (onlyRole && user.role !== onlyRole) {
    redirect(roleRedirectMap[user.role]);
  }

  return <>{children}</>;
}
