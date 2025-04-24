import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';

import Navbar from "@/components/navbar";
import FooterBar from "@/components/footer-bar";
import Footer from "@/components/footer";
import AuthLoading from "@/components/auth/auth-loading";

import "./globals.css";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";
import AuthProvider from "@/providers/auth-provider";

const font = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store4U",
  description: "Project of a store for future clients",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Error fallback component
  const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
        <p className="text-gray-700 mb-4">{error.message || "An unexpected error occurred"}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
        >
          Try again
        </button>
      </div>
    );
  };

  return (
    <html lang="en">
      <body className={font.className}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthProvider>
            <ModalProvider />
            <ToastProvider />
            <Toaster position="top-center" />
            <Navbar />
            {children}
            <FooterBar />
            <Footer />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
