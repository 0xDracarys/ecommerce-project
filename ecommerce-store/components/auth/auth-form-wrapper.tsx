"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface AuthFormWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showLogo?: boolean;
  error?: string | null;
  success?: string | null;
  isLoading?: boolean;
  footerText?: string;
  footerLink?: {
    text: string;
    href: string;
  };
}

const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({
  children,
  title,
  description,
  showLogo = true,
  error = null,
  success = null,
  isLoading = false,
  footerText,
  footerLink,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-8 mx-auto">
      {showLogo && (
        <div className="mb-6">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold">Your Store</span>
            </div>
          </Link>
        </div>
      )}

      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-md">
            {success}
          </div>
        )}

        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          {children}
        </div>

        {footerText && footerLink && (
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              {footerText}{" "}
              <Link href={footerLink.href} className="text-accent hover:underline">
                {footerLink.text}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthFormWrapper;

