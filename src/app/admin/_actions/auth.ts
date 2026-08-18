"use server";

import { redirect } from "next/navigation";
import { verifyAdminCredentials, setAdminSession, clearAdminSession } from "@/lib/auth";

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    return { error: "Wypełnij wszystkie pola." };
  }

  const ok = verifyAdminCredentials(email, password);
  if (!ok) {
    return { error: "Nieprawidłowy e-mail lub hasło." };
  }

  await setAdminSession(email);
  redirect("/admin");
  return null;
}

export async function logoutAction(): Promise<never> {
  await clearAdminSession();
  redirect("/admin/login");
}
