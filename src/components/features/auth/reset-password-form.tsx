"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validators/auth";
import { resetPassword } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function ResetPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    setFormError(null);
    const result = await resetPassword(values);
    if (result && !result.success && result.error) {
      setFormError(result.error);
    }
  };

  return (
    <div className="w-full space-y-6">
      {formError && (
        <div className="text-destructive bg-destructive/10 rounded-lg p-3 text-center text-sm font-medium">
          {formError}
        </div>
      )}

      <p className="text-muted-foreground text-center text-sm">
        Create a new secure password for your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">
            New Password (min 8 characters, letter + number)
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
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
              Updating password...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  );
}
