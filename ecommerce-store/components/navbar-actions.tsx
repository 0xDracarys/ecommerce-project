"use client";

import { useState } from "react";
import { MountedCheck } from "@/lib/mounted-check";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Search, X, User, Heart, LogOut, ChevronDown } from "lucide-react";

import SearchInput from "@/components/ui/search-input";
import CartDialog from "@/components/dialog/cart-dialog";

const NavbarActions = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // Mock authentication for now
  const isAuthenticated = false;
  const router = useRouter();

  const handleSignOut = () => {
    // Mock sign out
    console.log("Sign out clicked");
    setIsUserMenuOpen(false);
  };

  return (
    <MountedCheck>
      <nav className="flex items-center justify-end ml-auto transition-all gap-x-4">
        <div className="hidden w-56 md:flex">
          <SearchInput />
        </div>
        <div
          className={
            isSearchActive ? "transition-all w-56" : "w-0 overflow-hidden"
          }
        >
          <SearchInput />
        </div>
        {isSearchActive ? (
          <button
            onClick={() => setIsSearchActive(false)}
            className="md:hidden"
          >
            <X size={20} />
          </button>
        ) : (
          <button
            onClick={() => setIsSearchActive(true)}
            className="transition-all md:hidden "
          >
            <Search size={20} color="#d41d6d" />
          </button>
        )}
        
        {/* User Menu */}
        <div className="relative">
          <button 
            className="flex items-center gap-1 text-sm font-medium"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <User size={20} />
            <ChevronDown size={16} />
          </button>
          
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-50">
              {isAuthenticated ? (
                <>
                  <Link href="/profile" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                  <Link href="/profile/favorites" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Heart size={16} className="mr-2" />
                    Favorites
                  </Link>
                  <button 
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    Sign in
                  </Link>
                  <Link href="/auth/signup" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
        
        <CartDialog />
      </nav>
    </MountedCheck>
  );
};

export default NavbarActions;
