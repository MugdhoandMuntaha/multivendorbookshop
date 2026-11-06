import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Database, UserRole } from "@/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<{
  user: Awaited<ReturnType<typeof getCurrentUser>>;
  profile: Profile | null;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, profile: null };
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile: profile ?? null };
}

export async function requireUser(nextPath?: string) {
  const user = await getCurrentUser();
  if (!user) {
    const query = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${query}`);
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[], nextPath?: string) {
  const { user, profile } = await getCurrentProfile();
  if (!user || !profile) {
    const query = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${query}`);
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect("/");
  }

  return { user, profile };
}
