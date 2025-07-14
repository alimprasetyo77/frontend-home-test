"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-4 py-6 space-y-9">
        <h1 className="text-xl font-semibold text-center">User Profile</h1>
        <div className="flex flex-col items-center gap-6">
          <div className="size-[68px] bg-blue-200 text-blue-900 font-medium text-2xl flex items-center justify-center rounded-full">
            {user?.username.slice(0, 1).toUpperCase()}
          </div>
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-between w-full bg-gray-100 border border-slate-200 rounded-[6px] py-2.5 px-3">
              <div className="font-semibold min-w-[97px] flex items-center justify-between space-x-4">
                <span>Username</span> <span className="w-[5px]">:</span>
              </div>
              <span className="text-slate-900 w-full text-center max-w-[210px]">{user?.username}</span>
            </div>
            <div className="flex items-center justify-between w-full bg-gray-100 border border-slate-200 rounded-[6px] py-2.5 px-3">
              <div className="font-semibold min-w-[97px] flex items-center justify-between space-x-4">
                <span>Password</span> <span className="w-[5px]">:</span>
              </div>
              <span className="text-slate-900 w-full text-center max-w-[210px]">
                {user?.password ?? "Admin123"}
              </span>
            </div>
            <div className="flex items-center justify-between w-full bg-gray-100 border border-slate-200 rounded-[6px] py-2.5 px-3">
              <div className="font-semibold min-w-[97px] flex items-center justify-between space-x-4">
                <span>Role</span> <span className="w-[5px]">:</span>
              </div>
              <span className="text-slate-900 w-full text-center max-w-[210px]">{user?.role}</span>
            </div>
          </div>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 w-full" onClick={() => router.push("/articles")}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
