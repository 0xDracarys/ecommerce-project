"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthFormWrapper from "./auth-form-wrapper";
import { signIn } from "@/lib/auth";
import { SignInFormData } from "@/types/auth";

const SignInForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear any previous errors when the user starts typing again
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await signIn(formData);

      if (response.error) {
        setError(response.error);
      } else {
        // Redirect to home or dashboard
        router.push("/");
        // Optional: refresh the page to update the auth state in the navbar
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="Welcome Back"
      description="Sign in to your account to continue shopping"
      error={error}
      isLoading={isLoading}
      footerText="Don't have an account?"
      footerLink={{
        text: "Create one",
        href: "/signup",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
            placeholder="john.doe@example.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-accent hover:text-accent/90 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
              disabled={isLoading}
            />
            <label
              htmlFor="rememberMe"
              className="block ml-2 text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </AuthFormWrapper>
  );
};

export default SignInForm;

