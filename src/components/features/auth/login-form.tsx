"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";
import { signIn } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons } from "./oauth-buttons";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const urlError = searchParams.get("error");
  const [formError, setFormError] = useState<string | null>(urlError);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setFormError(null);
    const result = await signIn(values, next);
    if (result && !result.success && result.error) {
      setFormError(result.error);
    }
  };

  return (
    <div className="w-full space-y-6">
      <OAuthButtons redirectTo={next} />

      {formError && (
        <div className="text-destructive bg-destructive/10 rounded-lg p-3 text-center text-sm font-medium">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="reader@example.com"
            autoComplete="email"
            {...register("email")}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-primary text-xs transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="text-muted-foreground text-center text-xs">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
