import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginSchema } from "@/schemas/auth.schema";
import type { LoginFormData } from "@/schemas/auth.schema";
import { login } from "@/services/auth/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);

    try {
      const { accessToken, refreshToken, tokenType } = await login(data);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("tokenType", tokenType);

      navigate("/dashboard");
    } catch {
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md">
     
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black">
          Logo
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Expense Approval System
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Secure Enterprise Expense Management
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>

          <CardDescription>
            Access your enterprise workspace
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Email
              </label>

              <Input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />

              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Password
              </label>

              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />

              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            {loginError && (
              <p className="text-sm text-red-500" role="alert">
                {loginError}
              </p>
            )}
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-black"
          >
            Forgot Password?
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
