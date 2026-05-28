"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Scissors,
  Sparkles,
  Hand,
  Crown,
  Leaf,
  PenTool,
  Clock,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";

// Icon mapping from service icon string to Lucide component
const iconMap: Record<string, LucideIcon> = {
  scissors: Scissors,
  sparkles: Sparkles,
  hand: Hand,
  crown: Crown,
  leaf: Leaf,
  "pen-tool": PenTool,
};

function getServiceIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Sparkles;
}

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

export default function ServicesPage() {
  const { services, currentUser, setCurrentPage, addAppointment } =
    useAppStore();

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleBookNow = (serviceId: string, serviceName: string) => {
    if (!currentUser) {
      toast.error("Please log in to book an appointment", {
        description: "You need an account to make a booking.",
      });
      setCurrentPage("login");
      return;
    }
    setSelectedService({ id: serviceId, name: serviceName });
    setSelectedDate(undefined);
    setBookingDialogOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedService || !selectedDate) return;

    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    addAppointment(selectedService.id, selectedService.name, formattedDate);
    toast.success("Appointment booked!", {
      description: `${selectedService.name} on ${format(selectedDate, "MMMM d, yyyy")}`,
    });
    setBookingDialogOpen(false);
    setSelectedService(null);
    setSelectedDate(undefined);
  };

  // Disable past dates in calendar
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
                <Sparkles className="w-4 h-4" />
                Premium Treatments
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              custom={0}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
            >
              Our{" "}
              <span className="bg-gradient-to-r from-primary via-rose-500 to-primary bg-clip-text text-transparent">
                Services
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              custom={1}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Discover our range of luxury beauty treatments designed to pamper
              and transform you
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ============ SERVICES GRID ============ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <motion.div key={service.id} variants={staggerItem}>
                  <Card className="glass rounded-2xl hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-0 group h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                        {service.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-3xl font-bold text-primary">
                          NPR {service.price}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-full">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full rounded-full shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                        onClick={() =>
                          handleBookNow(service.id, service.name)
                        }
                      >
                        <CalendarDays className="mr-2 w-4 h-4" />
                        Book Now
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============ BOOKING DIALOG ============ */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Book Appointment
            </DialogTitle>
            <DialogDescription>
              {selectedService
                ? `Select a date for your ${selectedService.name} appointment`
                : "Select a date for your appointment"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={{ before: today }}
              className="rounded-md border"
            />
            {selectedDate && (
              <p className="text-sm text-muted-foreground">
                Selected:{" "}
                <span className="font-semibold text-foreground">
                  {format(selectedDate, "MMMM d, yyyy")}
                </span>
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setBookingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full shadow-md shadow-primary/15"
              disabled={!selectedDate}
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
