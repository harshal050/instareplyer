"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { useAuthStore } from "@/lib/stores/auth.store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, accessToken } = useAuthStore();

  // Check if user is authenticated on mount
  useEffect(() => {
    if (!isLoading && !accessToken && !user) {
      // Not authenticated, redirect to login
      if (!pathname.includes('/login') && !pathname.includes('/register') && !pathname.includes('/forgot-password')) {
        router.push("/login");
      }
    }
  }, [isLoading, accessToken, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!accessToken || !user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
