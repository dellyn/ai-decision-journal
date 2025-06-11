"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/shared/api/auth";
import { SignUpFormData, AuthState } from "@/shared/types/auth";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ isLoading: true, error: null });

    if (formData.password !== formData.repeatPassword) {
      setState({
        isLoading: false,
        error: { message: "Passwords do not match" },
      });
      return;
    }

    try {
      await authApi.signUp(formData);
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setState({
        isLoading: false,
        error: {
          message: error instanceof Error ? error.message : "An error occurred",
        },
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={formData.repeatPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      repeatPassword: e.target.value,
                    }))
                  }
                />
              </div>
              {state.error && (
                <p className="text-sm text-red-500">{state.error.message}</p>
              )}
              <Button type="submit" className="w-full" disabled={state.isLoading}>
                {state.isLoading ? "Creating an account..." : "Sign up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 