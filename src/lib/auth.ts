"use server";
import { IUser } from "@/types/auth-type";
import { cookies } from "next/headers";

export async function getUserAction(): Promise<IUser | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const user = await res.json();
    return user as IUser;
  } catch {
    return null;
  }
}
