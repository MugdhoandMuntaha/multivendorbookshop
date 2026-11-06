"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "@/lib/validators/auth";
import { register as registerUser } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons } from "./oauth-buttons";
import { Loader2, CheckCircle2 } from "lucide-react";

export function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpInput) => {
    setFormError(null);
    const result = await registerUser(values);
    if (result && !result.success && result.error) {
      setFormError(result.error);
    } else if (result?.success) {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-4 py-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="text-lg font-bold">Check your email</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We&apos;ve sent a verification link to your email address. Please
          click the link to activate your account and start browsing books.
        </p>
        <Link href="/login">
          <Button variant="outline" className="mt-4">
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <OAuthButtons />

      {formError && (
        <div className="text-destructive bg-destructive/10 rounded-lg p-3 text-center text-sm font-medium">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Jane Doe"
            autoComplete="name"
            {...register("fullName")}
            disabled={isSubmitting}
          />
          {errors.fullName && (
            <p className="text-destructive text-xs">
              {errors.fullName.message}
            </p>
          )}
        </div>

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
          <Label htmlFor="password">
            Password (min 8 characters, letter + number)
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("password")}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("confirmPassword")}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="text-muted-foreground text-center text-xs">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
