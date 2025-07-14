"use client";

import { LogOut, Newspaper, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/auth-context";
const Sidebar = () => {
  const router = useRouter();
  const { changeToken } = useAuth();
  const pathname = usePathname();
  const [showAlert, setShowAlert] = useState(false);
  return (
    <aside className="w-[300px] pt-6 bg-blue-600 border-r sticky h-screen inset-y-0">
      <div className="space-y-6">
        <div className="px-8 py-2">
          <Image src={"/logo-light.svg"} alt="brand logo" width={134} height={24} />
        </div>
        <div className="px-4 space-y-2 w-full ">
          <Link
            href={"/dashboard/articles"}
            className={`${
              pathname === "/dashboard/articles" ? "bg-blue-500" : "hover:bg-blue-500"
            } rounded-[6px] flex items-center text-white h-[40px] gap-3 p-4`}
          >
            <Newspaper className="size-5" />
            <span className="font-medium">Articles</span>
          </Link>
          <Link
            href={"/dashboard/category"}
            className={`${
              pathname === "/dashboard/category" ? "bg-blue-500" : "hover:bg-blue-500"
            } rounded-[6px] flex items-center text-white h-[40px] gap-3 p-4`}
          >
            <Tag className="size-5" />
            <span className="font-medium">Category</span>
          </Link>
          <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
            <AlertDialogTrigger asChild>
              <div className="hover:bg-blue-500 rounded-[6px] flex items-center text-white h-[40px] gap-3 p-4 cursor-pointer">
                <LogOut className="size-5" />
                <span className="font-medium">Logout</span>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Logout</AlertDialogTitle>
                <AlertDialogDescription>Are you sure want to logout?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowAlert(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    router.push("/login");
                    changeToken();
                    setShowAlert(false);
                  }}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
