"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Lock,
  Key,
  CalendarDays,
  Star,
  ShoppingCart,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Get initials from a name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Role badge variant helper
function getRoleBadgeVariant(
  role: "user" | "admin" | "superadmin"
): "default" | "secondary" | "destructive" {
  switch (role) {
    case "admin":
      return "secondary";
    case "superadmin":
      return "destructive";
    default:
      return "default";
  }
}

export default function ProfilePage() {
  const {
    currentUser,
    appointments,
    reviews,
    cart,
    changePassword,
    setCurrentPage,
  } = useAppStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Not logged in state
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="glass rounded-2xl border-0 max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Please log in</h2>
                <p className="text-muted-foreground">
                  You need to be logged in to view your profile.
                </p>
                <Button
                  onClick={() => setCurrentPage("login")}
                  className="rounded-full shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  <Lock className="mr-2 w-4 h-4" />
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Account stats
  const userAppointments = appointments.filter(
    (a) => a.userId === currentUser.id
  );
  const userReviews = reviews.filter((r) => r.userId === currentUser.id);
  const cartItemCount = cart.length;

  // Change password handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (!newPassword) {
      toast.error("New password is required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (!confirmPassword) {
      toast.error("Please confirm your new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const success = changePassword(currentPassword, newPassword);
    if (success) {
      toast.success("Password changed successfully!", {
        description: "Your account password has been updated.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error("Current password is incorrect", {
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ============ PAGE HEADER ============ */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 dark:from-rose-950/40 dark:via-pink-950/30 dark:to-rose-900/20" />

        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-300/8 dark:bg-rose-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem} className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <User className="w-4 h-4" />
                My Account
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              custom={0}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
            >
              My{" "}
              <span className="bg-gradient-to-r from-primary via-rose-500 to-primary bg-clip-text text-transparent">
                Profile
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              custom={1}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Manage your account settings and view your activity
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ============ PROFILE CONTENT ============ */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-background pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ============ PROFILE CARD ============ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerItem}
              className="lg:col-span-1"
            >
              <Card className="glass rounded-2xl border-0 h-full">
                <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center">
                  {/* Avatar */}
                  <Avatar className="w-24 h-24 mb-5">
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name */}
                  <h2 className="text-2xl font-bold mb-1">
                    {currentUser.name}
                  </h2>

                  {/* Email */}
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                    <Mail className="w-4 h-4" />
                    <span>{currentUser.email}</span>
                  </div>

                  {/* Role Badge */}
                  <Badge
                    variant={getRoleBadgeVariant(currentUser.role)}
                    className="mb-4 rounded-full px-3 py-1 text-xs font-semibold capitalize"
                  >
                    {currentUser.role === "superadmin"
                      ? "Super Admin"
                      : currentUser.role === "admin"
                        ? "Admin"
                        : "User"}
                  </Badge>

                  <Separator className="my-4" />

                  {/* Member since */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <span>
                      Member since{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(currentUser.joinDate)}
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ============ RIGHT COLUMN ============ */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* ============ ACCOUNT STATS ============ */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-3 gap-4"
              >
                <motion.div variants={staggerItem}>
                  <Card className="glass rounded-2xl border-0 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <CalendarDays className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold text-primary">
                        {userAppointments.length}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Appointments
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card className="glass rounded-2xl border-0 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Star className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold text-primary">
                        {userReviews.length}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Reviews
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card className="glass rounded-2xl border-0 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <ShoppingCart className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold text-primary">
                        {cartItemCount}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Cart Items
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* ============ CHANGE PASSWORD ============ */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerItem}
              >
                <Card className="glass rounded-2xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Key className="w-5 h-5 text-primary" />
                      Change Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleChangePassword}
                      className="space-y-4"
                    >
                      {/* Current Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="current-password"
                          className="text-sm font-medium"
                        >
                          Current Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="pl-10 pr-10 rounded-xl"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="new-password"
                          className="text-sm font-medium"
                        >
                          New Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password (min 6 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pl-10 pr-10 rounded-xl"
                            required
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowNewPassword(!showNewPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirm-password"
                          className="text-sm font-medium"
                        >
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 pr-10 rounded-xl"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="rounded-full shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                      >
                        <Key className="mr-2 w-4 h-4" />
                        Update Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
