"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAppStore, type Page } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Scissors,
  Sun,
  Moon,
  ShoppingCart,
  Menu,
  User,
  LogOut,
  LogIn,
  Home,
  Sparkles,
  ShoppingBag,
  CalendarDays,
  ImageIcon,
  Star,
  Shield,
  Crown,
  UserCircle,
  MessageSquare,
  Package,
} from "lucide-react";

const NAV_ITEMS: { label: string; page: Page; icon: React.ReactNode; roles?: string[]; homeKey?: boolean }[] = [
  { label: "Home", page: "home", icon: <Home className="h-4 w-4" />, homeKey: true },
  { label: "Services", page: "services", icon: <Sparkles className="h-4 w-4" /> },
  { label: "Products", page: "products", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Appointments", page: "appointments", icon: <CalendarDays className="h-4 w-4" /> },
  { label: "Gallery", page: "gallery", icon: <ImageIcon className="h-4 w-4" /> },
  { label: "Reviews", page: "reviews", icon: <Star className="h-4 w-4" /> },
  { label: "Admin Panel", page: "admin", icon: <Shield className="h-4 w-4" />, roles: ["admin", "superadmin"] },
  { label: "Super Admin", page: "superadmin", icon: <Crown className="h-4 w-4" />, roles: ["superadmin"] },
];

export function Navbar() {
  const currentPage = useAppStore((s) => s.currentPage);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const currentUser = useAppStore((s) => s.currentUser);
  const logout = useAppStore((s) => s.logout);
  const cart = useAppStore((s) => s.cart);
  const homeButtonText = useAppStore((s) => s.homeButtonText);
  const messages = useAppStore((s) => s.messages);
  const orders = useAppStore((s) => s.orders);
  const homePageContent = useAppStore((s) => s.homePageContent);
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadMsgCount = messages.filter((m) => !m.read).length;
  const pendingOrderCount = orders.filter((o) => o.status === "pending").length;
  const isAdmin = currentUser && (currentUser.role === "admin" || currentUser.role === "superadmin");
  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.roles || (currentUser && item.roles.includes(currentUser.role))
  );

  const handleNav = (page: Page) => {
    setCurrentPage(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button
          onClick={() => handleNav("home")}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          {homePageContent.navbarLogoUrl ? (
            <img
              src={homePageContent.navbarLogoUrl}
              alt={homePageContent.navbarBrandName}
              className="h-8 w-8 object-contain"
            />
          ) : (
            <Scissors className="h-7 w-7 text-primary" />
          )}
          <span className="text-xl font-bold tracking-tight text-primary">{homePageContent.navbarBrandName}</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {visibleNavItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNav(item.page)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === item.page
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {item.icon}
              {item.homeKey ? homeButtonText : item.label}
            </button>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Messages (Admin/SuperAdmin only) */}
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNav("admin")}
              className="h-9 w-9 relative"
              aria-label="Messages"
            >
              <MessageSquare className="h-4 w-4" />
              {unreadMsgCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-[10px] bg-red-500 text-white">
                  {unreadMsgCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Orders (Admin/SuperAdmin only) */}
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNav("admin")}
              className="h-9 w-9 relative"
              aria-label="Orders"
            >
              <Package className="h-4 w-4" />
              {pendingOrderCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-[10px] bg-amber-500 text-white">
                  {pendingOrderCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNav("cart")}
            className="h-9 w-9 relative"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground">
                {cartCount}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserCircle className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  <Badge variant="outline" className="mt-1 text-[10px] capitalize">
                    {currentUser.role === "superadmin" ? "Super Admin" : currentUser.role}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNav("profile")}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNav("appointments")}>
                  <CalendarDays className="mr-2 h-4 w-4" /> My Appointments
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLogoutOpen(true)} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleNav("login")}
              className="gap-1.5"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="px-4 pt-6 pb-2 flex items-center gap-2">
                {homePageContent.navbarLogoUrl ? (
                  <img
                    src={homePageContent.navbarLogoUrl}
                    alt={homePageContent.navbarBrandName}
                    className="h-7 w-7 object-contain"
                  />
                ) : (
                  <Scissors className="h-6 w-6 text-primary" />
                )}
                <span className="text-lg font-bold text-primary">{homePageContent.navbarBrandName}</span>
              </SheetTitle>
              <nav className="flex flex-col gap-1 px-2 pb-4">
                {visibleNavItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => handleNav(item.page)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item.page
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {item.icon}
                    {item.homeKey ? homeButtonText : item.label}
                  </button>
                ))}
                {currentUser ? (
                  <>
                    <div className="border-t my-2" />
                    <button
                      onClick={() => handleNav("profile")}
                      className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <UserCircle className="h-4 w-4" /> Profile
                    </button>
                    <button
                      onClick={() => setLogoutOpen(true)}
                      className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t my-2" />
                    <button
                      onClick={() => handleNav("login")}
                      className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <LogIn className="h-4 w-4" /> Login
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your account and redirected to the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { logout(); setMobileOpen(false); setLogoutOpen(false); }} className="bg-destructive text-white hover:bg-destructive/90">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
