"use client";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import CustomPopover from "./popover";

const Navbar = () => {
  const router = useRouter();
  const { user } = useAuth();
  const pathname = usePathname();
  // const isDetail = pathname?.includes("/articles/") && pathname?.split("/").length > 2;
  const isHomePage = pathname === "/articles";
  const isMobile = useMediaQuery({ maxWidth: 767 });

  if (!isMobile && isHomePage) {
    return (
      <nav className={`w-full py-8 px-[60px] h-24 fixed`}>
        <div className="flex items-center justify-between cursor-pointer">
          <Image
            src={"/logo-light.svg"}
            alt="brand logo"
            width={134}
            height={24}
            onClick={() => router.push("/articles")}
          />
          <CustomPopover>
            <div className="flex items-center gap-x-1.5">
              <div className="size-8 bg-blue-200 flex items-center justify-center rounded-full">
                {user?.username.slice(0, 1).toUpperCase()}
              </div>
              <span className="text-white hover:underline">{user?.username}</span>
            </div>
          </CustomPopover>
        </div>
      </nav>
    );
  }

  return (
    <nav className={"w-full py-[16px] md:py-[32px] px-[20px] md:px-[60px] border-b border-b-slate-200"}>
      <div className="flex items-center justify-between ">
        <Image
          src={"/logo-dark.svg"}
          alt="brand logo"
          width={134}
          height={24}
          onClick={() => router.push("/articles")}
        />
        <CustomPopover>
          <div className="flex items-center gap-x-1.5">
            <div className="size-8 bg-blue-200 text-blue-900 font-semibold flex items-center justify-center rounded-full">
              {user?.username.slice(0, 1).toUpperCase()}
            </div>
            <span className="hover:underline">{user?.username}</span>
          </div>
        </CustomPopover>
      </div>
    </nav>
  );
};

export default Navbar;
