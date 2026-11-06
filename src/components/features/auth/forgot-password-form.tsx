"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validators/auth";
import { forgotPassword } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setFormError(null);
    const result = await forgotPassword(values);
    if (!result.success && result.error) {
      setFormError(result.error);
    } else {
      setIsSent(true);
    }
  };

  if (isSent) {
    return (
      <div className="space-y-4 py-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="text-lg font-bold">Check your inbox</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          If an account exists for that email, we&apos;ve sent instructions to
          reset your password.
        </p>
        <Link href="/login">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {formError && (
        <div className="text-destructive bg-destructive/10 rounded-lg p-3 text-center text-sm font-medium">
          {formError}
        </div>
      )}

      <p className="text-muted-foreground text-center text-sm">
        Enter your registered email address and we&apos;ll send you a link to
        reset your password.
      </p>

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

        <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      <div className="text-center text-xs">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
