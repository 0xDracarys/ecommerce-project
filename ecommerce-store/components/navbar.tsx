"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { User, ChevronDown, LogOut, ShoppingBag, Heart, UserCircle } from "lucide-react";

import { Category } from "@/types";
import getCategories from "@/actions/get-categories";
import { useAuth } from "@/providers/auth-provider";
import AuthLoading from "@/components/auth/auth-loading";

import MainNav from "@/components/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";

import logo from "../public/logo.png";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get authentication state from context
  const { user, isLoading, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories();
      setCategories(result);
    };

    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-10 py-4 bg-white border-b-2 shadow-md border-accent/10 shadow-accent/5">
      <Container>
        <section className="relative flex items-center h-16 px-4 sm:px-6">
          <button
            className="md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Menu />
          </button>
          <ul className="w-full px-3 py-2 text-xl font-bold md:w-1/3 lg:w-1/5">
            <Link
              href="/"
              className="flex ml-r lg:ml-0 gap-x-2"
            >
              <Image
                src={logo}
                alt="logo"
                height={36}
                width={150}
              />
            </Link>
          </ul>

          {/* Normal navbar on md screens and up */}
          <div className="w-full">
            <MainNav data={categories} />
          </div>

          {/* Mobile navbar on sm screens */}
          <div className="md:hidden">
            <MainNav
              data={categories}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Authentication UI */}
            {isLoading ? (
              <AuthLoading size="small" />
            ) : isAuthenticated ? (
              // User is authenticated - show dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-accent"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full">
                    {user?.image ? (
                      <Image 
                        src={user.image}
                        alt={user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <UserCircle className="w-full h-full text-gray-400" />
                    )}
                  </div>
                  <span className="hidden md:inline">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white border rounded-md shadow-lg">
                    <div className="p-2">
                      <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b">
                        {user?.name || 'Your Account'}
                      </div>
                      <Link 
                        href="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link 
                        href="/profile/orders" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Orders
                      </Link>
                      <Link 
                        href="/profile/favorites" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Favorites
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // User is not authenticated - show sign in/sign up buttons
              <div className="flex items-center space-x-2">
                <Link
                  href="/signin"
                  className="px-3 py-1 text-sm transition-colors border rounded-md hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1 text-sm text-white transition-colors rounded-md bg-accent hover:bg-accent/90"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Cart and other actions */}
            <NavbarActions />
          </div>
        </section>
      </Container>
    </nav>
  );
};

export default Navbar;
