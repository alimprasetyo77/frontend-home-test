"use client";
import CustomPopover from "@/components/popover";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean)[1];

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full bg-gray-100 ">
        <header className="bg-white border-b border-b-slate-200 p-6 flex items-center justify-between">
          <h1 className="font-semibold text-xl capitalize">{segments}</h1>
          <CustomPopover>
            <div className="flex items-center gap-x-1.5">
              <div className="size-8 bg-blue-200 text-blue-900 font-semibold flex items-center justify-center rounded-full">
                {user?.username.slice(0, 1).toUpperCase()}
              </div>
              <span className="hover:underline text-sm font-medium text-slate-900">{user?.username}</span>
            </div>
          </CustomPopover>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
