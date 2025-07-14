"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";

import { useAuth } from "@/context/auth-context";

export default function CustomPopover({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const { changeToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40" />}

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
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
                setOpen(false);
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="relative" asChild>
          {children}
        </PopoverTrigger>
        <PopoverContent align="end" className="z-50 relative w-[224px] p-0 ">
          <div
            className="text-sm text-slate-600  cursor-pointer p-3"
            onClick={() => {
              if (user?.role === "Admin") {
                setOpen(false);
                router.push("/dashboard/profile");
              } else {
                setOpen(false);
                router.push("/profile");
              }
            }}
          >
            My Account
          </div>
          <hr />
          <div
            className="text-sm text-red-500 flex items-center p-3 cursor-pointer gap-x-2 font-medium"
            onClick={() => {
              setOpen(false);
              setShowAlert(true);
            }}
          >
            <LogOut className="size-4" /> <span>Logout</span>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
