"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Trash2, MessageSquare, User } from "lucide-react";
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

// Star rating display component
function StarRating({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg"
      ? "w-8 h-8"
      : size === "md"
        ? "w-5 h-5"
        : "w-4 h-4";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= Math.round(rating)
              ? "fill-amber-500 text-amber-500"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

// Interactive star selector component
function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            className={`w-8 h-8 cursor-pointer transition-colors ${
              star <= (hovered || value)
                ? "fill-amber-500 text-amber-500"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

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

export default function ReviewsPage() {
  const { currentUser, reviews, addReview, deleteReview, setCurrentPage } =
    useAppStore();

  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  const handleSubmitReview = () => {
    if (newRating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!newText.trim()) {
      toast.error("Please write your review");
      return;
    }

    addReview(newText.trim(), newRating);
    toast.success("Review submitted!", {
      description: "Thank you for sharing your experience.",
    });
    setNewRating(0);
    setNewText("");
  };

  const handleDeleteReview = (id: string) => {
    deleteReview(id);
    toast.success("Review deleted");
  };

  const isAdmin =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";

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
                <MessageSquare className="w-4 h-4" />
                Testimonials
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              custom={0}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
            >
              Client{" "}
              <span className="bg-gradient-to-r from-primary via-rose-500 to-primary bg-clip-text text-transparent">
                Reviews
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              custom={1}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Hear what our valued clients have to say about their experiences at
              La Bella
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ============ AVERAGE RATING SECTION ============ */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerItem}
          >
            <Card className="glass rounded-2xl border-0">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  {/* Average rating display */}
                  <div className="flex flex-col items-center gap-2 min-w-[160px]">
                    <span className="text-5xl sm:text-6xl font-bold text-amber-500">
                      {averageRating.toFixed(1)}
                    </span>
                    <StarRating rating={Math.round(averageRating)} size="md" />
                    <span className="text-sm text-muted-foreground">
                      Based on {reviews.length} review
                      {reviews.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Rating distribution bars */}
                  <div className="flex-1 w-full max-w-md">
                    {ratingCounts.map(({ star, count }) => {
                      const percentage =
                        reviews.length > 0
                          ? (count / reviews.length) * 100
                          : 0;
                      return (
                        <div
                          key={star}
                          className="flex items-center gap-3 mb-1.5"
                        >
                          <span className="text-sm font-medium w-8 text-right text-muted-foreground">
                            {star}
                          </span>
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-amber-500 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percentage}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.8,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ============ WRITE A REVIEW SECTION ============ */}
      {currentUser ? (
        <section className="py-4 sm:py-6 px-4 sm:px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerItem}
            >
              <Card className="glass rounded-2xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Write a Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Your Rating
                    </Label>
                    <div className="flex items-center gap-3">
                      <StarSelector
                        value={newRating}
                        onChange={setNewRating}
                      />
                      {newRating > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {newRating} star{newRating !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review-text" className="text-sm font-medium">
                      Your Review
                    </Label>
                    <Textarea
                      id="review-text"
                      placeholder="Share your experience at La Bella..."
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      className="min-h-[100px] resize-none rounded-xl"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSubmitReview}
                    className="rounded-full shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                  >
                    <Star className="mr-2 w-4 h-4" />
                    Submit Review
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="py-4 sm:py-6 px-4 sm:px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerItem}
            >
              <Card className="glass rounded-2xl border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      Please{" "}
                      <Button
                        variant="link"
                        className="px-1 text-primary h-auto p-0 font-semibold"
                        onClick={() => setCurrentPage("login")}
                      >
                        log in
                      </Button>{" "}
                      to write a review and share your experience.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* ============ REVIEWS LIST ============ */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-background pb-16">
        <div className="max-w-6xl mx-auto">
          {reviews.length === 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerItem}
            >
              <Card className="glass rounded-2xl border-0">
                <CardContent className="p-10 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">No reviews yet</h3>
                    <p className="text-muted-foreground text-sm">
                      Be the first to share your experience at La Bella!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {reviews.map((review) => (
                <motion.div key={review.id} variants={staggerItem}>
                  <Card className="glass rounded-2xl border-0 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 bg-primary/10">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                              {getInitials(review.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base font-semibold">
                              {review.userName}
                            </CardTitle>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(review.date)}
                            </span>
                          </div>
                        </div>
                        {isAdmin && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Review
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this review by{" "}
                                  <span className="font-semibold">
                                    {review.userName}
                                  </span>
                                  ? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() =>
                                    handleDeleteReview(review.id)
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="mb-3">
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
