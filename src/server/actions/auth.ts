"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginInput,
  type SignUpInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/validators/auth";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function signIn(
  input: LoginInput,
  redirectTo: string = "/"
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function register(input: SignUpInput): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // If email confirmation is required and session is null
  if (data?.user && !data.session) {
    return {
      success: true,
      error: undefined,
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function forgotPassword(
  input: ForgotPasswordInput
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
    }
  );

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return { success: true };
}

export async function resetPassword(
  input: ResetPasswordInput
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
