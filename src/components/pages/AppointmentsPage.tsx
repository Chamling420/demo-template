'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from '@/components/ui/alert-dialog';
import { CalendarDays, Clock, User, XCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function AppointmentsPage() {
  const { currentUser, appointments, services, confirmAppointment, cancelAppointment, setCurrentPage } =
    useAppStore();
  const [activeTab, setActiveTab] = useState('all');

  // Not logged in state
  if (!currentUser) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CalendarDays className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">View Your Appointments</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to view and manage your beauty appointments.
          </p>
          <Button
            onClick={() => setCurrentPage('login')}
            className="rounded-full px-8 shadow-lg shadow-primary/25"
          >
            Log In
          </Button>
        </motion.div>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin';

  // Filter appointments based on role
  const userAppointments = isAdmin
    ? appointments
    : appointments.filter((a) => a.userId === currentUser.id);

  // Sort by date descending
  const sortedAppointments = [...userAppointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter by tab
  const filteredAppointments = sortedAppointments.filter((a) => {
    if (activeTab === 'pending') return a.status === 'pending';
    if (activeTab === 'confirmed') return a.status === 'confirmed';
    if (activeTab === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  const pendingCount = sortedAppointments.filter(
    (a) => a.status === 'pending'
  ).length;
  const confirmedCount = sortedAppointments.filter(
    (a) => a.status === 'confirmed'
  ).length;
  const cancelledCount = sortedAppointments.filter(
    (a) => a.status === 'cancelled'
  ).length;

  const handleConfirm = (id: string) => {
    confirmAppointment(id);
    toast.success('Appointment confirmed');
  };

  const handleCancel = (id: string) => {
    cancelAppointment(id);
    toast.success('Appointment cancelled');
  };

  // Get duration for a service
  const getServiceDuration = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    return service?.duration ?? '';
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-rose-50 to-pink-50 py-12 md:py-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-rose-200/30 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <CalendarDays className="w-4 h-4 mr-1.5" />
              Appointments
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              {isAdmin ? 'Manage Appointments' : 'My Appointments'}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {isAdmin
                ? 'View and manage all salon appointments in one place.'
                : 'Track and manage your upcoming beauty appointments.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 w-full sm:w-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">
              All
              <span className="ml-1.5 text-xs bg-muted rounded-full px-1.5 py-0.5">
                {sortedAppointments.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 sm:flex-none">
              Pending
              <span className="ml-1.5 text-xs bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5">
                {pendingCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="flex-1 sm:flex-none">
              Confirmed
              <span className="ml-1.5 text-xs bg-emerald-100 text-emerald-700 rounded-full px-1.5 py-0.5">
                {confirmedCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex-1 sm:flex-none">
              Cancelled
              <span className="ml-1.5 text-xs bg-red-100 text-red-700 rounded-full px-1.5 py-0.5">
                {cancelledCount}
              </span>
            </TabsTrigger>
          </TabsList>

          {['all', 'pending', 'confirmed', 'cancelled'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              {filteredAppointments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <CalendarDays className="w-10 h-10 text-primary/50" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No Appointments
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    {tab === 'cancelled'
                      ? "You don't have any cancelled appointments."
                      : tab === 'confirmed'
                        ? "You don't have any confirmed appointments. Book one today!"
                        : tab === 'pending'
                          ? "You don't have any pending appointments."
                          : "You haven't booked any appointments yet."}
                  </p>
                  {tab !== 'cancelled' && (
                    <Button
                      onClick={() => setCurrentPage('services')}
                      className="rounded-full px-8 shadow-lg shadow-primary/25"
                    >
                      <CalendarDays className="w-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4"
                >
                  {filteredAppointments.map((appointment) => {
                    const canConfirm =
                      appointment.status === 'pending' &&
                      isAdmin;
                    const canCancel =
                      (appointment.status === 'pending' || appointment.status === 'confirmed') &&
                      (isAdmin || appointment.userId === currentUser.id);
                    const duration = getServiceDuration(appointment.serviceId);

                    return (
                      <motion.div key={appointment.id} variants={staggerItem}>
                        <Card
                          className={`transition-shadow hover:shadow-lg hover:shadow-primary/5 ${
                            appointment.status === 'cancelled'
                              ? 'opacity-70'
                              : ''
                          }`}
                        >
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              {/* Date column */}
                              <div className="flex items-center gap-3 sm:w-44 shrink-0">
                                <div
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                    appointment.status === 'confirmed'
                                      ? 'bg-primary/10 text-primary'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  <CalendarDays className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium leading-tight">
                                    {formatDate(appointment.date)}
                                  </p>
                                  {duration && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                      <Clock className="w-3 h-3" />
                                      {duration}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Service & User info */}
                              <div className="flex-1 min-w-0">
                                <h3
                                  className={`font-semibold text-base ${
                                    appointment.status === 'cancelled'
                                      ? 'line-through text-muted-foreground'
                                      : ''
                                  }`}
                                >
                                  {appointment.serviceName}
                                </h3>
                                {isAdmin && (
                                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                    <User className="w-3.5 h-3.5" />
                                    {appointment.userName}
                                  </p>
                                )}
                              </div>

                              {/* Status & Actions */}
                              <div className="flex items-center gap-3 sm:shrink-0">
                                <Badge
                                  variant={
                                    appointment.status === 'confirmed'
                                      ? 'default'
                                      : appointment.status === 'pending'
                                        ? 'secondary'
                                        : 'secondary'
                                  }
                                  className={
                                    appointment.status === 'confirmed'
                                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                                      : appointment.status === 'pending'
                                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200'
                                        : 'bg-red-100 text-red-600 hover:bg-red-100 border-red-200 line-through'
                                  }
                                >
                                  {appointment.status === 'confirmed' ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                  ) : appointment.status === 'pending' ? (
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 mr-1" />
                                  )}
                                  {appointment.status === 'confirmed'
                                    ? 'Confirmed'
                                    : appointment.status === 'pending'
                                      ? 'Pending'
                                      : 'Cancelled'}
                                </Badge>

                                {canConfirm && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 rounded-full"
                                      >
                                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                        Confirm
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Confirm Appointment
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to confirm the{' '}
                                          <span className="font-semibold text-foreground">
                                            {appointment.serviceName}
                                          </span>{' '}
                                          appointment on{' '}
                                          <span className="font-semibold text-foreground">
                                            {formatDate(appointment.date)}
                                          </span>
                                          ?
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-full">
                                          Don&apos;t Confirm
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleConfirm(appointment.id)
                                          }
                                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                                        >
                                          Yes, Confirm
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}

                                {canCancel && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded-full"
                                      >
                                        <XCircle className="w-4 h-4 mr-1.5" />
                                        Cancel
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Cancel Appointment
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to cancel your{' '}
                                          <span className="font-semibold text-foreground">
                                            {appointment.serviceName}
                                          </span>{' '}
                                          appointment on{' '}
                                          <span className="font-semibold text-foreground">
                                            {formatDate(appointment.date)}
                                          </span>
                                          ? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-full">
                                          Keep Appointment
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleCancel(appointment.id)
                                          }
                                          className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                                        >
                                          Yes, Cancel
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
}
