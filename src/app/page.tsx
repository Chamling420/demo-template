"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import HomePage from "@/components/pages/HomePage";
import ServicesPage from "@/components/pages/ServicesPage";
import ProductsPage from "@/components/pages/ProductsPage";
import CartPage from "@/components/pages/CartPage";
import AppointmentsPage from "@/components/pages/AppointmentsPage";
import GalleryPage from "@/components/pages/GalleryPage";
import ReviewsPage from "@/components/pages/ReviewsPage";
import AdminPanel from "@/components/pages/AdminPanel";
import SuperAdminPanel from "@/components/pages/SuperAdminPanel";
import ProfilePage from "@/components/pages/ProfilePage";
import { LoginPage, RegisterPage } from "@/components/pages/AuthPages";
import MessageUs from "@/components/MessageUs";

function PageRouter() {
  const currentPage = useAppStore((s) => s.currentPage);

  switch (currentPage) {
    case "home":
      return <HomePage />;
    case "services":
      return <ServicesPage />;
    case "products":
      return <ProductsPage />;
    case "cart":
      return <CartPage />;
    case "appointments":
      return <AppointmentsPage />;
    case "gallery":
      return <GalleryPage />;
    case "reviews":
      return <ReviewsPage />;
    case "admin":
      return <AdminPanel />;
    case "superadmin":
      return <SuperAdminPanel />;
    case "profile":
      return <ProfilePage />;
    case "login":
      return <LoginPage />;
    case "register":
      return <RegisterPage />;
    default:
      return <HomePage />;
  }
}

export default function Home() {
  const hydrate = useAppStore((s) => s.hydrate);
  const hydrated = useAppStore((s) => s._hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Don't render app until store is hydrated from localStorage
  // This prevents flash of default data and ensures reactivity works
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading La Bella...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PageRouter />
      </main>
      <Footer />
      <MessageUs />
    </div>
  );
}
