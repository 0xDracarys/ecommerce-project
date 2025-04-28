"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthFormWrapper from "./auth-form-wrapper";
import { signUp } from "@/lib/auth";
import { SignUpFormData } from "@/types/auth";

const SignUpForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password validation
  const validatePassword = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  // Form field validation
  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (passwordStrength < 3) {
      setError(
        "Please use a stronger password (include uppercase, numbers, and special characters)"
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update password strength on change
    if (name === "password") {
      validatePassword(value);
    }

    // Clear any previous errors when the user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await signUp(formData);

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(
          "Account created successfully! Please check your email to verify your account."
        );
        
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
        });
        
        // Redirect to sign-in page after 2 seconds
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrengthText = () => {
    if (formData.password.length === 0) return "";
    if (passwordStrength === 0) return "Very weak";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Medium";
    if (passwordStrength === 3) return "Strong";
    return "Very strong";
  };

  const getPasswordStrengthColor = () => {
    if (formData.password.length === 0) return "bg-gray-200";
    if (passwordStrength === 0) return "bg-red-500";
    if (passwordStrength === 1) return "bg-orange-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-green-500";
    return "bg-green-600";
  };

  return (
    <AuthFormWrapper
      title="Create an Account"
      description="Sign up to start shopping and save your favorite items"
      error={error}
      success={success}
      isLoading={isLoading}
      footerText="Already have an account?"
      footerLink={{
        text: "Sign in",
        href: "/signin",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>

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
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
            placeholder="john.doe@example.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number (Optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
            placeholder="+1 (555) 123-4567"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
            placeholder="••••••••"
            disabled={isLoading}
          />
          {formData.password && (
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <div className="text-xs">{getPasswordStrengthText()}</div>
                <div className="text-xs">
                  {passwordStrength >= 3 ? "✓" : "Use a stronger password"}
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>
    </AuthFormWrapper>
  );
};

export default SignUpForm;

