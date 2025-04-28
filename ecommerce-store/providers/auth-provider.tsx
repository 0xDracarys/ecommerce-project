"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { signIn, signOut, getCurrentUser } from "@/lib/auth";
import { AuthUser, SignInFormData, SignUpFormData } from "@/types/auth";

// Define the shape of the context
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (data: SignInFormData) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignUpFormData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => ({ success: false, error: "Not implemented" }),
  signUp: async () => ({ success: false, error: "Not implemented" }),
  signOut: async () => false,
  refreshUser: async () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the application
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Function to refresh user data
  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign in
  const handleSignIn = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      const response = await signIn(data);

      if (response.error) {
        return { success: false, error: response.error };
      }

      // Update user state with the authenticated user
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      return { 
        success: false, 
        error: "An unexpected error occurred during sign in" 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign up
  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      
      // This is handled by our sign-up component and API route
      // We don't automatically sign in after registration since email verification is required
      return { success: true };
    } catch (error) {
      console.error("Sign up error:", error);
      return { 
        success: false, 
        error: "An unexpected error occurred during sign up" 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const success = await signOut();

      if (success) {
        setUser(null);
        router.push("/");
        router.refresh();
      }

      return success;
    } catch (error) {
      console.error("Sign out error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

