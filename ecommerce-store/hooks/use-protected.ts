"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { useAuth } from "@/providers/auth-provider";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
  redirectOnUnauthorized?: boolean;
  showToastOnError?: boolean;
}

interface UseProtectedOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Custom hook for handling protected routes and authenticated API requests
 */
export const useProtected = (options: UseProtectedOptions = {}) => {
  const { redirectTo = "/signin", requireAuth = true } = options;
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth();
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);

  // Check if user is authenticated and redirect if needed
  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      toast.error("Please sign in to access this page");
      router.push(`${redirectTo}?returnUrl=${window.location.pathname}`);
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  /**
   * Make an authenticated API request
   */
  const fetchWithAuth = async <T = any>(
    url: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    const {
      requireAuth: requireAuthForRequest = true,
      redirectOnUnauthorized = true,
      showToastOnError = true,
      ...fetchOptions
    } = options;

    try {
      setIsFetching(true);

      // Ensure auth check is completed before making requests
      if (requireAuthForRequest && !isAuthenticated) {
        if (isLoading) {
          // If still loading auth state, wait a bit
          await new Promise((resolve) => setTimeout(resolve, 500));
          if (!isAuthenticated) {
            throw new Error("Authentication required");
          }
        } else {
          throw new Error("Authentication required");
        }
      }

      // Set default headers
      const headers = new Headers(fetchOptions.headers);
      if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }

      // Make the API request
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: "include", // Include cookies for auth
      });

      // Handle unauthorized responses
      if (response.status === 401) {
        // Refresh auth state to see if the session is still valid
        await refreshUser();
        
        if (!isAuthenticated && redirectOnUnauthorized) {
          if (showToastOnError) {
            toast.error("Your session has expired. Please sign in again.");
          }
          router.push(`${redirectTo}?returnUrl=${window.location.pathname}`);
          throw new Error("Unauthorized - Session expired");
        }
      }

      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Error: ${response.status} ${response.statusText}`;
        if (showToastOnError) {
          toast.error(errorMessage);
        }
        throw new Error(errorMessage);
      }

      // Parse and return response data
      const data = await response.json();
      return data as T;
    } catch (error) {
      // Handle and rethrow error
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (showToastOnError && errorMessage !== "Authentication required") {
        toast.error(errorMessage);
      }
      throw error;
    } finally {
      setIsFetching(false);
    }
  };

  /**
   * Check if the current user has the required role
   */
  const hasRole = (role: string | string[]): boolean => {
    if (!user || !user.role) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  /**
   * Redirect to login with return URL
   */
  const redirectToLogin = () => {
    router.push(`${redirectTo}?returnUrl=${window.location.pathname}`);
  };

  return {
    user,
    isLoading: isLoading || isFetching,
    isAuthenticated,
    fetchWithAuth,
    hasRole,
    redirectToLogin,
    refreshUser,
  };
};

