'use client';

import { useState, useEffect } from 'react';
import { useAppStore, type UserRole, type User, type Service, type Product, type Appointment, type HomePageContent, type Order, type PaymentMethod, type PaymentMethodType } from '@/lib/store';
import { toast } from 'sonner';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';

import {
  Crown,
  Shield,
  Users,
  Plus,
  Pencil,
  Trash2,
  Scissors,
  ShoppingBag,
  CalendarDays,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Settings,
  Sparkles,
  MapPin,
  MessageSquare,
  Package,
  Send,
  Mail,
  ChevronDown,
  ChevronUp,
  Eye,
  CreditCard,
  Save,
  X,
  Truck,
  Building2,
  Smartphone,
  Wallet,
} from 'lucide-react';
import ImageUpload from '@/components/ui/image-upload';

// ==================== HELPERS ====================

function getRoleBadgeVariant(role: UserRole) {
  switch (role) {
    case 'superadmin':
      return 'destructive';
    case 'admin':
      return 'secondary';
    default:
      return 'default';
  }
}

function getRoleIcon(role: UserRole) {
  switch (role) {
    case 'superadmin':
      return <Crown className="h-3.5 w-3.5" />;
    case 'admin':
      return <Shield className="h-3.5 w-3.5" />;
    default:
      return <Users className="h-3.5 w-3.5" />;
  }
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function getPaymentMethodLabel(method: string): string {
  switch (method) {
    case 'cash_on_delivery': return 'Cash on Delivery';
    case 'bank': return 'Bank Transfer';
    case 'esewa': return 'eSewa';
    case 'khalti': return 'Khalti';
    case 'imepay': return 'IME Pay';
    default: return method;
  }
}

function getOrderStatusBadge(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100';
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
    case 'cancelled':
      return 'bg-red-100 text-red-600 border-red-200 hover:bg-red-100 line-through';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100';
  }
}

function getPaymentMethodIcon(type: PaymentMethodType) {
  switch (type) {
    case 'bank':
      return <Building2 className="h-5 w-5" />;
    case 'esewa':
      return <Smartphone className="h-5 w-5" />;
    case 'khalti':
      return <Wallet className="h-5 w-5" />;
    case 'imepay':
      return <Smartphone className="h-5 w-5" />;
  }
}

function getPaymentMethodTypeName(type: PaymentMethodType): string {
  switch (type) {
    case 'bank': return 'Bank Transfer';
    case 'esewa': return 'eSewa';
    case 'khalti': return 'Khalti';
    case 'imepay': return 'IME Pay';
  }
}

// ==================== MAIN COMPONENT ====================

export default function SuperAdminPanel() {
  // ===== Store selectors =====
  const currentUser = useAppStore(s => s.currentUser);
  const users = useAppStore(s => s.users);
  const changeUserRole = useAppStore(s => s.changeUserRole);
  const deleteUser = useAppStore(s => s.deleteUser);
  const services = useAppStore(s => s.services);
  const addService = useAppStore(s => s.addService);
  const updateService = useAppStore(s => s.updateService);
  const deleteService = useAppStore(s => s.deleteService);
  const products = useAppStore(s => s.products);
  const addProduct = useAppStore(s => s.addProduct);
  const updateProduct = useAppStore(s => s.updateProduct);
  const deleteProduct = useAppStore(s => s.deleteProduct);
  const appointments = useAppStore(s => s.appointments);
  const confirmAppointment = useAppStore(s => s.confirmAppointment);
  const cancelAppointment = useAppStore(s => s.cancelAppointment);
  const homeButtonText = useAppStore(s => s.homeButtonText);
  const setHomeButtonText = useAppStore(s => s.setHomeButtonText);
  const homePageContent = useAppStore(s => s.homePageContent);
  const setHomePageContent = useAppStore(s => s.setHomePageContent);
  const messages = useAppStore(s => s.messages);
  const replyToMessage = useAppStore(s => s.replyToMessage);
  const markMessageRead = useAppStore(s => s.markMessageRead);
  const deleteMessage = useAppStore(s => s.deleteMessage);
  const orders = useAppStore(s => s.orders);
  const confirmOrder = useAppStore(s => s.confirmOrder);
  const cancelOrder = useAppStore(s => s.cancelOrder);
  const paymentMethods = useAppStore(s => s.paymentMethods);
  const addPaymentMethod = useAppStore(s => s.addPaymentMethod);
  const updatePaymentMethod = useAppStore(s => s.updatePaymentMethod);
  const deletePaymentMethod = useAppStore(s => s.deletePaymentMethod);

  // ===== State =====
  const [activeTab, setActiveTab] = useState('users');
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [paymentSlipViewerOpen, setPaymentSlipViewerOpen] = useState(false);
  const [paymentSlipUrl, setPaymentSlipUrl] = useState('');
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ===== Unsaved changes state =====
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);

  // ===== Computed values =====
  const unreadCount = messages.filter(m => !m.read).length;
  const pendingOrderCount = orders.filter(o => o.status === 'pending').length;
  const hasUnsavedChanges =
    serviceDialogOpen ||
    productDialogOpen ||
    Object.values(replyTexts).some(t => t.trim() !== '');

  // ===== BeforeUnload for browser close/refresh =====
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  // ---- Access Control ----
  if (!currentUser || currentUser.role !== 'superadmin') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md border-destructive/30">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-destructive">
              Access Denied
            </h2>
            <p className="text-muted-foreground">
              Super Admin Only — You do not have permission to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ===== Message Handlers =====
  const handleExpandMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && !message.read) {
      markMessageRead(messageId);
    }
    setExpandedMessageId(prev => prev === messageId ? null : messageId);
  };

  const handleReplySubmit = (messageId: string) => {
    const text = replyTexts[messageId]?.trim();
    if (!text) return;
    replyToMessage(messageId, text);
    setReplyTexts(prev => {
      const next = { ...prev };
      delete next[messageId];
      return next;
    });
    toast.success('Reply sent');
  };

  // ===== Tab Change Handler (with unsaved changes check) =====
  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges) {
      setPendingTab(newTab);
      setUnsavedDialogOpen(true);
    } else {
      setActiveTab(newTab);
    }
  };

  const handleUnsavedSave = () => {
    // Send pending replies
    Object.entries(replyTexts).forEach(([msgId, text]) => {
      if (text.trim()) {
        replyToMessage(msgId, text.trim());
        toast.success('Reply sent');
      }
    });
    setReplyTexts({});

    // Close dialogs
    if (serviceDialogOpen) {
      setServiceDialogOpen(false);
      setEditingServiceId(null);
    }
    if (productDialogOpen) {
      setProductDialogOpen(false);
      setEditingProductId(null);
    }

    // Proceed to new tab
    setUnsavedDialogOpen(false);
    if (pendingTab) setActiveTab(pendingTab);
    setPendingTab(null);
  };

  const handleUnsavedDiscard = () => {
    // Close dialogs without saving
    setServiceDialogOpen(false);
    setEditingServiceId(null);
    setProductDialogOpen(false);
    setEditingProductId(null);
    // Clear reply texts
    setReplyTexts({});
    // Proceed to new tab
    setUnsavedDialogOpen(false);
    if (pendingTab) setActiveTab(pendingTab);
    setPendingTab(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 p-6 text-white sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Crown className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Super Admin Panel
            </h1>
            <p className="text-white/80">
              Full control over users, services, products, orders &amp; payments
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="w-full flex-wrap sm:w-auto sm:flex-nowrap">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Manage Users</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Scissors className="h-4 w-4" />
            <span className="hidden sm:inline">Manage Services</span>
            <span className="sm:hidden">Services</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Manage Products</span>
            <span className="sm:hidden">Products</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">All Appointments</span>
            <span className="sm:hidden">Appts</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
            <span className="sm:hidden">Msgs</span>
            {unreadCount > 0 && (
              <Badge className="ml-0.5 h-5 min-w-5 px-1.5 text-[10px] bg-destructive text-destructive-foreground rounded-full">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
            <span className="sm:hidden">Orders</span>
            {pendingOrderCount > 0 && (
              <Badge className="ml-0.5 h-5 min-w-5 px-1.5 text-[10px] bg-amber-500 text-white rounded-full">
                {pendingOrderCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="payment-methods" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payment Methods</span>
            <span className="sm:hidden">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* ===== TAB 1: MANAGE USERS ===== */}
        <TabsContent value="users">
          <ManageUsersTab
            users={users}
            currentUserId={currentUser.id}
            changeUserRole={changeUserRole}
            deleteUser={deleteUser}
          />
        </TabsContent>

        {/* ===== TAB 2: MANAGE SERVICES ===== */}
        <TabsContent value="services">
          <ManageServicesTab
            services={services}
            addService={addService}
            updateService={updateService}
            deleteService={deleteService}
            dialogOpen={serviceDialogOpen}
            setDialogOpen={setServiceDialogOpen}
            editingServiceId={editingServiceId}
            setEditingServiceId={setEditingServiceId}
          />
        </TabsContent>

        {/* ===== TAB 3: MANAGE PRODUCTS ===== */}
        <TabsContent value="products">
          <ManageProductsTab
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            dialogOpen={productDialogOpen}
            setDialogOpen={setProductDialogOpen}
            editingProductId={editingProductId}
            setEditingProductId={setEditingProductId}
          />
        </TabsContent>

        {/* ===== TAB 4: ALL APPOINTMENTS ===== */}
        <TabsContent value="appointments">
          <AllAppointmentsTab
            appointments={appointments}
            confirmAppointment={confirmAppointment}
            cancelAppointment={cancelAppointment}
          />
        </TabsContent>

        {/* ===== TAB 5: MESSAGES ===== */}
        <TabsContent value="messages">
          <MessagesTab
            messages={messages}
            expandedMessageId={expandedMessageId}
            onExpandMessage={handleExpandMessage}
            replyTexts={replyTexts}
            setReplyTexts={setReplyTexts}
            onReplySubmit={handleReplySubmit}
            deleteMessage={deleteMessage}
          />
        </TabsContent>

        {/* ===== TAB 6: ORDERS ===== */}
        <TabsContent value="orders">
          <OrdersTab
            orders={orders}
            confirmOrder={confirmOrder}
            cancelOrder={cancelOrder}
            paymentDetailsOpen={paymentDetailsOpen}
            setPaymentDetailsOpen={setPaymentDetailsOpen}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            paymentSlipViewerOpen={paymentSlipViewerOpen}
            setPaymentSlipViewerOpen={setPaymentSlipViewerOpen}
            paymentSlipUrl={paymentSlipUrl}
            setPaymentSlipUrl={setPaymentSlipUrl}
          />
        </TabsContent>

        {/* ===== TAB 7: PAYMENT METHODS ===== */}
        <TabsContent value="payment-methods">
          <PaymentMethodsTab
            paymentMethods={paymentMethods}
            addPaymentMethod={addPaymentMethod}
            updatePaymentMethod={updatePaymentMethod}
            deletePaymentMethod={deletePaymentMethod}
          />
        </TabsContent>

        {/* ===== TAB 8: SETTINGS ===== */}
        <TabsContent value="settings">
          <SettingsTab
            homeButtonText={homeButtonText}
            setHomeButtonText={setHomeButtonText}
            homePageContent={homePageContent}
            setHomePageContent={setHomePageContent}
          />
        </TabsContent>
      </Tabs>

      {/* ===== Unsaved Changes AlertDialog ===== */}
      <AlertDialog open={unsavedDialogOpen} onOpenChange={setUnsavedDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Unsaved Changes
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Would you like to save them before leaving this tab?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleUnsavedDiscard} className="gap-2 rounded-full">
              <X className="h-4 w-4" />
              Discard Changes
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUnsavedSave} className="gap-2 rounded-full">
              <Save className="h-4 w-4" />
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ==================== TAB 1: MANAGE USERS ====================

function ManageUsersTab({
  users,
  currentUserId,
  changeUserRole,
  deleteUser,
}: {
  users: User[];
  currentUserId: string;
  changeUserRole: (userId: string, role: UserRole) => void;
  deleteUser: (userId: string) => void;
}) {
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteUserName, setDeleteUserName] = useState('');

  const handleDeleteClick = (userId: string, userName: string) => {
    setDeleteUserId(userId);
    setDeleteUserName(userName);
  };

  const handleDeleteConfirm = () => {
    if (deleteUserId) {
      deleteUser(deleteUserId);
      toast.success('User deleted');
      setDeleteUserId(null);
      setDeleteUserName('');
    }
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    changeUserRole(userId, newRole);
    toast.success('Role updated');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-rose-500" />
            All Users
            <Badge variant="secondary" className="ml-2">
              {users.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isSelf = user.id === currentUserId;
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{user.name}</span>
                          {isSelf && (
                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              You
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getRoleBadgeVariant(user.role)}
                            className="gap-1"
                          >
                            {getRoleIcon(user.role)}
                            {user.role}
                          </Badge>
                          {!isSelf && (
                            <Select
                              value={user.role}
                              onValueChange={(val: UserRole) =>
                                handleRoleChange(user.id, val)
                              }
                            >
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">user</SelectItem>
                                <SelectItem value="admin">admin</SelectItem>
                                <SelectItem value="superadmin">
                                  superadmin
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(user.joinDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        {!isSelf && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() =>
                              handleDeleteClick(user.id, user.name)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete User AlertDialog */}
      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteUserId(null);
            setDeleteUserName('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong className="text-foreground">{deleteUserName}</strong>? This
              action cannot be undone. All their data will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ==================== TAB 2: MANAGE SERVICES ====================

function ManageServicesTab({
  services,
  addService,
  updateService,
  deleteService,
  dialogOpen,
  setDialogOpen,
  editingServiceId,
  setEditingServiceId,
}: {
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingServiceId: string | null;
  setEditingServiceId: (id: string | null) => void;
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [icon, setIcon] = useState('scissors');

  const resetForm = () => {
    setName('');
    setPrice('');
    setDuration('');
    setIcon('scissors');
    setEditingServiceId(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingServiceId(service.id);
    setName(service.name);
    setPrice(String(service.price));
    setDuration(service.duration);
    setIcon(service.icon);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!name.trim() || !price.trim() || !duration.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (editingServiceId) {
      updateService(editingServiceId, {
        name: name.trim(),
        price: priceNum,
        duration: duration.trim(),
        icon,
      });
      toast.success('Service updated');
    } else {
      addService({
        name: name.trim(),
        price: priceNum,
        duration: duration.trim(),
        icon,
      });
      toast.success('Service added');
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteService(deleteId);
      toast.success('Service deleted');
      setDeleteId(null);
    }
  };

  const iconOptions = [
    { value: 'scissors', label: 'Scissors' },
    { value: 'sparkles', label: 'Sparkles' },
    { value: 'hand', label: 'Hand' },
    { value: 'crown', label: 'Crown' },
    { value: 'leaf', label: 'Leaf' },
    { value: 'pen-tool', label: 'Pen Tool' },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-rose-500" />
              Services
              <Badge variant="secondary" className="ml-2">
                {services.length}
              </Badge>
            </CardTitle>
            <Button onClick={openAdd} className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Scissors className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No services yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        {service.name}
                      </TableCell>
                      <TableCell>NPR {service.price.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {service.duration}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => openEdit(service)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setDeleteId(service.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Service Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-rose-500" />
              {editingServiceId ? 'Edit Service' : 'Add Service'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="svc-name">Name</Label>
              <Input
                id="svc-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Service name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-price">Price (NPR)</Label>
              <Input
                id="svc-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-duration">Duration</Label>
              <Input
                id="svc-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 45 min"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setDialogOpen(false); resetForm(); }}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="rounded-full">
              {editingServiceId ? 'Save Changes' : 'Add Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Service AlertDialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Service
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ==================== TAB 3: MANAGE PRODUCTS ====================

function ManageProductsTab({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  dialogOpen,
  setDialogOpen,
  editingProductId,
  setEditingProductId,
}: {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingProductId: string | null;
  setEditingProductId: (id: string | null) => void;
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Hair');
  const [image, setImage] = useState('');

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('Hair');
    setImage('');
    setEditingProductId(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setCategory(product.category);
    setImage(product.image);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!name.trim() || !price.trim() || !category.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: name.trim(),
        price: priceNum,
        category,
        image: image.trim(),
      });
      toast.success('Product updated');
    } else {
      addProduct({
        name: name.trim(),
        price: priceNum,
        category,
        image: image.trim(),
      });
      toast.success('Product added');
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      toast.success('Product deleted');
      setDeleteId(null);
    }
  };

  const categoryOptions = ['Hair', 'Skin', 'Lips'];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-rose-500" />
              Products
              <Badge variant="secondary" className="ml-2">
                {products.length}
              </Badge>
            </CardTitle>
            <Button onClick={openAdd} className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No products yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <div className="h-10 w-10 overflow-hidden rounded-lg">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>NPR {product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => openEdit(product)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setDeleteId(product.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-rose-500" />
              {editingProductId ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="prod-name">Name</Label>
              <Input
                id="prod-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prod-price">Price (NPR)</Label>
              <Input
                id="prod-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ImageUpload
              value={image}
              onChange={(url) => setImage(url)}
              label="Product Image"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setDialogOpen(false); resetForm(); }}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="rounded-full">
              {editingProductId ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product AlertDialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ==================== TAB 4: ALL APPOINTMENTS ====================

function AllAppointmentsTab({
  appointments,
  confirmAppointment,
  cancelAppointment,
}: {
  appointments: Appointment[];
  confirmAppointment: (id: string) => void;
  cancelAppointment: (id: string) => void;
}) {
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [actionInfo, setActionInfo] = useState({
    serviceName: '',
    date: '',
    userName: '',
  });

  const handleCancelClick = (
    id: string,
    serviceName: string,
    date: string,
    userName: string
  ) => {
    setCancelId(id);
    setActionInfo({ serviceName, date, userName });
  };

  const handleConfirmClick = (
    id: string,
    serviceName: string,
    date: string,
    userName: string
  ) => {
    setConfirmId(id);
    setActionInfo({ serviceName, date, userName });
  };

  const handleCancelConfirm = () => {
    if (cancelId) {
      cancelAppointment(cancelId);
      toast.success('Appointment cancelled');
      setCancelId(null);
      setActionInfo({ serviceName: '', date: '', userName: '' });
    }
  };

  const handleConfirmConfirm = () => {
    if (confirmId) {
      confirmAppointment(confirmId);
      toast.success('Appointment confirmed');
      setConfirmId(null);
      setActionInfo({ serviceName: '', date: '', userName: '' });
    }
  };

  const pendingCount = appointments.filter(
    (a) => a.status === 'pending'
  ).length;
  const confirmedCount = appointments.filter(
    (a) => a.status === 'confirmed'
  ).length;
  const cancelledCount = appointments.filter(
    (a) => a.status === 'cancelled'
  ).length;

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
            <Clock className="h-5 w-5 text-amber-500" />
            <span className="text-2xl font-bold">{pendingCount}</span>
            <span className="text-xs text-muted-foreground">Pending</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-2xl font-bold">{confirmedCount}</span>
            <span className="text-xs text-muted-foreground">Confirmed</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-2xl font-bold">{cancelledCount}</span>
            <span className="text-xs text-muted-foreground">Cancelled</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-rose-500" />
            All Appointments
            <Badge variant="secondary" className="ml-2">
              {appointments.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <CalendarDays className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No appointments yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((apt) => (
                    <TableRow
                      key={apt.id}
                      className={
                        apt.status === 'cancelled' ? 'opacity-60' : ''
                      }
                    >
                      <TableCell className="font-medium">
                        {apt.userName}
                      </TableCell>
                      <TableCell>
                        {apt.status === 'cancelled' ? (
                          <span className="line-through">
                            {apt.serviceName}
                          </span>
                        ) : (
                          apt.serviceName
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(apt.date)}
                      </TableCell>
                      <TableCell>
                        {apt.status === 'confirmed' ? (
                          <Badge className="gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Confirmed
                          </Badge>
                        ) : apt.status === 'pending' ? (
                          <Badge className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        ) : (
                          <Badge className="gap-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            <XCircle className="h-3 w-3" />
                            Cancelled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {apt.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                              onClick={() =>
                                handleConfirmClick(
                                  apt.id,
                                  apt.serviceName,
                                  apt.date,
                                  apt.userName
                                )
                              }
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Confirm
                            </Button>
                          )}
                          {(apt.status === 'pending' || apt.status === 'confirmed') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() =>
                                handleCancelClick(
                                  apt.id,
                                  apt.serviceName,
                                  apt.date,
                                  apt.userName
                                )
                              }
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Appointment AlertDialog */}
      <AlertDialog
        open={!!confirmId}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmId(null);
            setActionInfo({ serviceName: '', date: '', userName: '' });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm appointment for{' '}
              <strong className="text-foreground">{actionInfo.serviceName}</strong>{' '}
              on <strong className="text-foreground">{actionInfo.date}</strong>{' '}
              for {actionInfo.userName}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmConfirm}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Appointment AlertDialog */}
      <AlertDialog
        open={!!cancelId}
        onOpenChange={(open) => {
          if (!open) {
            setCancelId(null);
            setActionInfo({ serviceName: '', date: '', userName: '' });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Cancel Appointment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cancel appointment for{' '}
              <strong className="text-foreground">{actionInfo.serviceName}</strong>{' '}
              on <strong className="text-foreground">{actionInfo.date}</strong>{' '}
              for {actionInfo.userName}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ==================== TAB 5: MESSAGES ====================

function MessagesTab({
  messages,
  expandedMessageId,
  onExpandMessage,
  replyTexts,
  setReplyTexts,
  onReplySubmit,
  deleteMessage,
}: {
  messages: ReturnType<typeof useAppStore>['messages'];
  expandedMessageId: string | null;
  onExpandMessage: (id: string) => void;
  replyTexts: Record<string, string>;
  setReplyTexts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onReplySubmit: (messageId: string) => void;
  deleteMessage: (id: string) => void;
}) {
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
  const [deleteMessageName, setDeleteMessageName] = useState('');

  const handleDeleteConfirm = () => {
    if (deleteMessageId) {
      deleteMessage(deleteMessageId);
      toast.success('Message deleted');
      setDeleteMessageId(null);
      setDeleteMessageName('');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-rose-500" />
            Messages
            <Badge variant="secondary" className="ml-2">
              {messages.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Mail className="h-12 w-12 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold">No Messages</h3>
              <p className="text-muted-foreground">No messages from users yet.</p>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto space-y-3 pr-1">
              {[...messages]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((message) => {
                  const isExpanded = expandedMessageId === message.id;
                  return (
                    <Card
                      key={message.id}
                      className={`transition-all ${!message.read ? 'border-primary/30 bg-primary/5' : ''} ${isExpanded ? 'ring-1 ring-primary/20' : ''}`}
                    >
                      <CardContent className="p-4">
                        {/* Message header - clickable to expand */}
                        <div
                          className="flex items-start gap-3 cursor-pointer"
                          onClick={() => onExpandMessage(message.id)}
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                            {message.userName
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-semibold text-sm ${!message.read ? 'text-primary' : ''}`}>
                                {message.userName}
                              </h3>
                              {!message.read && (
                                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                              )}
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{message.userEmail}</p>
                            {!isExpanded && (
                              <p className="text-sm text-muted-foreground mt-1 truncate">{message.text}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(message.timestamp)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteMessageId(message.id);
                                setDeleteMessageName(message.userName);
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="mt-3 space-y-3">
                            {/* Full message */}
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            </div>

                            {/* Replies */}
                            {message.replies.length > 0 && (
                              <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                                {message.replies.map((reply) => (
                                  <div key={reply.id} className="bg-primary/5 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-semibold text-primary">{reply.adminName}</span>
                                      <span className="text-xs text-muted-foreground">{formatDateTime(reply.timestamp)}</span>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{reply.text}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reply input */}
                            <div className="flex gap-2">
                              <Input
                                placeholder="Type your reply..."
                                value={replyTexts[message.id] || ''}
                                onChange={(e) => setReplyTexts(prev => ({ ...prev, [message.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && replyTexts[message.id]?.trim()) {
                                    e.preventDefault();
                                    onReplySubmit(message.id);
                                  }
                                }}
                                className="flex-1"
                              />
                              <Button
                                size="sm"
                                onClick={() => onReplySubmit(message.id)}
                                disabled={!replyTexts[message.id]?.trim()}
                                className="rounded-full"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Message AlertDialog */}
      <AlertDialog
        open={!!deleteMessageId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteMessageId(null);
            setDeleteMessageName('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Message
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message from{' '}
              <strong className="text-foreground">{deleteMessageName}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ==================== TAB 6: ORDERS ====================

function OrdersTab({
  orders,
  confirmOrder,
  cancelOrder,
  paymentDetailsOpen,
  setPaymentDetailsOpen,
  selectedOrder,
  setSelectedOrder,
  paymentSlipViewerOpen,
  setPaymentSlipViewerOpen,
  paymentSlipUrl,
  setPaymentSlipUrl,
}: {
  orders: Order[];
  confirmOrder: (id: string) => void;
  cancelOrder: (id: string) => void;
  paymentDetailsOpen: boolean;
  setPaymentDetailsOpen: (open: boolean) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  paymentSlipViewerOpen: boolean;
  setPaymentSlipViewerOpen: (open: boolean) => void;
  paymentSlipUrl: string;
  setPaymentSlipUrl: (url: string) => void;
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-rose-500" />
            Orders
            <Badge variant="secondary" className="ml-2">
              {orders.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold">No Orders</h3>
              <p className="text-muted-foreground">No orders have been placed yet.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...orders]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((order) => (
                        <TableRow key={order.id} className={order.status === 'cancelled' ? 'opacity-60' : ''}>
                          <TableCell className="font-mono text-xs">#{order.id.slice(-6)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{order.userName}</p>
                              <p className="text-xs text-muted-foreground">{order.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-48">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="text-xs">
                                  {item.productName} &times; {item.quantity}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">NPR {order.total}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {order.paymentMethod === 'cash_on_delivery' ? (
                                <Truck className="w-3 h-3 mr-1" />
                              ) : (
                                <CreditCard className="w-3 h-3 mr-1" />
                              )}
                              {getPaymentMethodLabel(order.paymentMethod)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getOrderStatusBadge(order.status)}>
                              {order.status === 'pending' ? (
                                <Clock className="w-3 h-3 mr-1" />
                              ) : order.status === 'confirmed' ? (
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {formatDateTime(order.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {order.paymentMethod !== 'cash_on_delivery' && (order.fullName || order.transactionNumber || order.paymentSlip) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 hover:text-primary"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setPaymentDetailsOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              {order.status === 'pending' && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 rounded-full text-xs h-7"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                      Confirm
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirm Order</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to confirm order{' '}
                                        <span className="font-semibold text-foreground">#{order.id.slice(-6)}</span>?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          confirmOrder(order.id);
                                          toast.success('Order confirmed');
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                                      >
                                        Yes, Confirm
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                              {(order.status === 'pending' || order.status === 'confirmed') && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 rounded-full text-xs h-7"
                                    >
                                      <XCircle className="w-3.5 h-3.5 mr-1" />
                                      Cancel
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel order{' '}
                                        <span className="font-semibold text-foreground">#{order.id.slice(-6)}</span>?
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="rounded-full">Keep Order</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          cancelOrder(order.id);
                                          toast.success('Order cancelled');
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                                      >
                                        Yes, Cancel
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                              {order.status === 'cancelled' && (
                                <span className="text-xs text-muted-foreground">&mdash;</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden grid gap-3">
                {[...orders]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((order) => (
                    <Card key={order.id} className={`transition-shadow hover:shadow-lg ${order.status === 'cancelled' ? 'opacity-70' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(-6)}</span>
                          <Badge variant="outline" className={getOrderStatusBadge(order.status)}>
                            {order.status === 'pending' ? (
                              <Clock className="w-3 h-3 mr-1" />
                            ) : order.status === 'confirmed' ? (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="font-semibold text-sm">{order.userName}</p>
                        <p className="text-xs text-muted-foreground">{order.userEmail}</p>
                        <div className="mt-2 space-y-0.5">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">
                              {item.productName} &times; {item.quantity} &mdash; NPR {item.price * item.quantity}
                            </p>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t">
                          <span className="font-semibold text-sm">NPR {order.total}</span>
                          <Badge variant="outline" className="text-xs">
                            {order.paymentMethod === 'cash_on_delivery' ? (
                              <Truck className="w-3 h-3 mr-1" />
                            ) : (
                              <CreditCard className="w-3 h-3 mr-1" />
                            )}
                            {getPaymentMethodLabel(order.paymentMethod)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{formatDateTime(order.createdAt)}</p>

                        {/* Payment verification details for online payments */}
                        {order.paymentMethod !== 'cash_on_delivery' && (order.fullName || order.transactionNumber || order.paymentSlip) && (
                          <div className="mt-2 p-2 bg-muted/50 rounded-lg text-xs space-y-1">
                            <p className="font-medium text-primary mb-1">Payment Verification</p>
                            {order.fullName && <p><span className="font-medium">Name:</span> {order.fullName}</p>}
                            {order.transactionNumber && <p><span className="font-medium">Transaction #:</span> {order.transactionNumber}</p>}
                            {order.paymentSlip && (
                              <div>
                                <p className="font-medium mb-1">Payment Slip:</p>
                                <img
                                  src={order.paymentSlip}
                                  alt="Payment slip"
                                  className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => {
                                    setPaymentSlipUrl(order.paymentSlip!);
                                    setPaymentSlipViewerOpen(true);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          {order.status === 'pending' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-full text-xs h-7 flex-1"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Confirm
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm Order</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to confirm order{' '}
                                    <span className="font-semibold text-foreground">#{order.id.slice(-6)}</span>?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      confirmOrder(order.id);
                                      toast.success('Order confirmed');
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                                  >
                                    Yes, Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          {(order.status === 'pending' || order.status === 'confirmed') && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 rounded-full text-xs h-7 flex-1"
                                >
                                  <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel order{' '}
                                    <span className="font-semibold text-foreground">#{order.id.slice(-6)}</span>?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-full">Keep Order</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      cancelOrder(order.id);
                                      toast.success('Order cancelled');
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                                  >
                                    Yes, Cancel
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={paymentDetailsOpen} onOpenChange={setPaymentDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-rose-500" />
              Payment Verification Details
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-2">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Order</span>
                  <span className="font-mono text-sm">#{selectedOrder.id.slice(-6)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment Method</span>
                  <Badge variant="outline" className="text-xs">
                    {getPaymentMethodLabel(selectedOrder.paymentMethod)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="font-semibold">NPR {selectedOrder.total}</span>
                </div>
              </div>
              {selectedOrder.fullName && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <p className="text-sm font-medium">{selectedOrder.fullName}</p>
                </div>
              )}
              {selectedOrder.transactionNumber && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Transaction Number</Label>
                  <p className="text-sm font-medium font-mono">{selectedOrder.transactionNumber}</p>
                </div>
              )}
              {selectedOrder.paymentSlip && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Payment Slip / Screenshot</Label>
                  <div className="relative group">
                    <img
                      src={selectedOrder.paymentSlip}
                      alt="Payment slip"
                      className="w-full max-h-64 object-contain rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        setPaymentSlipUrl(selectedOrder.paymentSlip!);
                        setPaymentSlipViewerOpen(true);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Slip Viewer Dialog */}
      <Dialog open={paymentSlipViewerOpen} onOpenChange={setPaymentSlipViewerOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Slip</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {paymentSlipUrl && (
              <img
                src={paymentSlipUrl}
                alt="Payment slip full view"
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ==================== TAB 7: PAYMENT METHODS (SUPER ADMIN ONLY) ====================

function PaymentMethodsTab({
  paymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
}: {
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (pm: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (id: string, pm: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [type, setType] = useState<PaymentMethodType>('bank');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchName, setBranchName] = useState('');
  const [walletName, setWalletName] = useState('');
  const [walletNumber, setWalletNumber] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [active, setActive] = useState(true);

  const resetForm = () => {
    setType('bank');
    setAccountHolderName('');
    setAccountNumber('');
    setBranchName('');
    setWalletName('');
    setWalletNumber('');
    setQrImage('');
    setActive(true);
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (pm: PaymentMethod) => {
    setEditingId(pm.id);
    setType(pm.type);
    setAccountHolderName(pm.accountHolderName || '');
    setAccountNumber(pm.accountNumber || '');
    setBranchName(pm.branchName || '');
    setWalletName(pm.walletName || '');
    setWalletNumber(pm.walletNumber || '');
    setQrImage(pm.qrImage || '');
    setActive(pm.active);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (type === 'bank') {
      if (!accountHolderName.trim() || !accountNumber.trim()) {
        toast.error('Please fill in Account Holder Name and Account Number');
        return;
      }
    } else {
      if (!walletName.trim() || !walletNumber.trim()) {
        toast.error('Please fill in Wallet Name and Wallet Number');
        return;
      }
    }

    const pmData = type === 'bank'
      ? {
          type,
          accountHolderName: accountHolderName.trim(),
          accountNumber: accountNumber.trim(),
          branchName: branchName.trim() || undefined,
          walletName: undefined,
          walletNumber: undefined,
          qrImage: qrImage.trim() || undefined,
          active,
        }
      : {
          type,
          accountHolderName: undefined,
          accountNumber: undefined,
          branchName: undefined,
          walletName: walletName.trim(),
          walletNumber: walletNumber.trim(),
          qrImage: qrImage.trim() || undefined,
          active,
        };

    if (editingId) {
      updatePaymentMethod(editingId, pmData);
      toast.success('Payment method updated');
    } else {
      addPaymentMethod(pmData as Omit<PaymentMethod, 'id'>);
      toast.success('Payment method added');
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deletePaymentMethod(deleteId);
      toast.success('Payment method deleted');
      setDeleteId(null);
    }
  };

  const handleToggleActive = (pm: PaymentMethod) => {
    updatePaymentMethod(pm.id, { active: !pm.active });
    toast.success(pm.active ? 'Payment method deactivated' : 'Payment method activated');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-rose-500" />
              Payment Methods
              <Badge variant="secondary" className="ml-2">
                {paymentMethods.length}
              </Badge>
            </CardTitle>
            <Button onClick={openAdd} className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold">No Payment Methods</h3>
              <p className="text-muted-foreground">Add payment methods for online payments.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {paymentMethods.map((pm) => (
                <Card key={pm.id} className={`transition-all ${!pm.active ? 'opacity-60' : 'ring-1 ring-primary/10'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          {getPaymentMethodIcon(pm.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{getPaymentMethodTypeName(pm.type)}</h3>
                          {pm.type === 'bank' ? (
                            <p className="text-xs text-muted-foreground">{pm.accountHolderName}</p>
                          ) : (
                            <p className="text-xs text-muted-foreground">{pm.walletName} &bull; {pm.walletNumber}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={pm.active}
                          onCheckedChange={() => handleToggleActive(pm)}
                        />
                      </div>
                    </div>

                    {pm.type === 'bank' && (
                      <div className="space-y-1 text-xs text-muted-foreground mb-3">
                        <p><span className="font-medium text-foreground">Account:</span> {pm.accountNumber}</p>
                        {pm.branchName && <p><span className="font-medium text-foreground">Branch:</span> {pm.branchName}</p>}
                      </div>
                    )}

                    {pm.qrImage && (
                      <div className="mb-3">
                        <img
                          src={pm.qrImage}
                          alt="QR Code"
                          className="h-20 w-20 object-contain rounded-lg border"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <Badge variant={pm.active ? 'default' : 'secondary'} className="text-xs">
                        {pm.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:text-primary"
                          onClick={() => openEdit(pm)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:text-red-600"
                          onClick={() => setDeleteId(pm.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Payment Method Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-rose-500" />
              {editingId ? 'Edit Payment Method' : 'Add Payment Method'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Type selector */}
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(val: PaymentMethodType) => setType(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Bank Transfer
                    </span>
                  </SelectItem>
                  <SelectItem value="esewa">
                    <span className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" /> eSewa
                    </span>
                  </SelectItem>
                  <SelectItem value="khalti">
                    <span className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" /> Khalti
                    </span>
                  </SelectItem>
                  <SelectItem value="imepay">
                    <span className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" /> IME Pay
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional fields based on type */}
            {type === 'bank' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pm-accountHolder">Account Holder Name</Label>
                  <Input
                    id="pm-accountHolder"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    placeholder="e.g. La Bella Beauty Salon"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pm-accountNumber">Account Number</Label>
                  <Input
                    id="pm-accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pm-branchName">Branch Name</Label>
                  <Input
                    id="pm-branchName"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="e.g. Kathmandu Main Branch"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pm-walletName">
                    {type === 'esewa' ? 'eSewa' : type === 'khalti' ? 'Khalti' : 'IME Pay'} Name
                  </Label>
                  <Input
                    id="pm-walletName"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    placeholder={`e.g. La Bella`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pm-walletNumber">
                    {type === 'esewa' ? 'eSewa' : type === 'khalti' ? 'Khalti' : 'IME Pay'} Number
                  </Label>
                  <Input
                    id="pm-walletNumber"
                    value={walletNumber}
                    onChange={(e) => setWalletNumber(e.target.value)}
                    placeholder="e.g. 9800000000"
                  />
                </div>
              </>
            )}

            {/* QR Image upload */}
            <ImageUpload
              value={qrImage}
              onChange={(url) => setQrImage(url)}
              label="QR Code Image (optional)"
            />

            {/* Active toggle */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Enable this payment method for checkout
                </p>
              </div>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setDialogOpen(false); resetForm(); }}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="rounded-full">
              {editingId ? 'Save Changes' : 'Add Payment Method'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Payment Method AlertDialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Payment Method
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment method? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ==================== TAB 8: SETTINGS ====================

function SettingsTab({
  homeButtonText,
  setHomeButtonText,
  homePageContent,
  setHomePageContent,
}: {
  homeButtonText: string;
  setHomeButtonText: (text: string) => void;
  homePageContent: HomePageContent;
  setHomePageContent: (content: Partial<HomePageContent>) => void;
}) {
  return (
    <div className="grid gap-6 max-w-2xl">
      {/* Navigation Button Text */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Navigation Button Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="home-btn-text">Home Button Text</Label>
            <p className="text-xs text-muted-foreground">
              Change the text displayed on the &quot;Home&quot; navigation button.
            </p>
            <Input
              id="home-btn-text"
              value={homeButtonText ?? ""}
              onChange={(e) => setHomeButtonText(e.target.value)}
              placeholder="Home"
            />
            <p className="text-xs text-muted-foreground">
              Changes are saved automatically and update the navbar in real-time.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Home Page Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Home Page Content
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Edit all the text content displayed on the Home page. Changes take effect immediately.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Hero Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-primary">Hero Section</h4>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="hp-heroBadge" className="text-xs">Badge Text</Label>
                <Input id="hp-heroBadge" value={homePageContent.heroBadge ?? ""} onChange={(e) => setHomePageContent({ heroBadge: e.target.value })} placeholder="Premium Beauty Salon" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hp-heroTitle" className="text-xs">Main Title</Label>
                <Input id="hp-heroTitle" value={homePageContent.heroTitle ?? ""} onChange={(e) => setHomePageContent({ heroTitle: e.target.value })} placeholder="La Bella" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hp-heroSubtitle" className="text-xs">Subtitle</Label>
                <Input id="hp-heroSubtitle" value={homePageContent.heroSubtitle ?? ""} onChange={(e) => setHomePageContent({ heroSubtitle: e.target.value })} placeholder="Where Beauty Meets Elegance" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hp-heroDescription" className="text-xs">Description</Label>
                <Input id="hp-heroDescription" value={homePageContent.heroDescription ?? ""} onChange={(e) => setHomePageContent({ heroDescription: e.target.value })} placeholder="Experience luxury beauty treatments tailored just for you" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-heroButtonText1" className="text-xs">Primary Button</Label>
                  <Input id="hp-heroButtonText1" value={homePageContent.heroButtonText1 ?? ""} onChange={(e) => setHomePageContent({ heroButtonText1: e.target.value })} placeholder="Book Appointment" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-heroButtonText2" className="text-xs">Secondary Button</Label>
                  <Input id="hp-heroButtonText2" value={homePageContent.heroButtonText2 ?? ""} onChange={(e) => setHomePageContent({ heroButtonText2: e.target.value })} placeholder="View Services" />
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-primary">Why Choose Section</h4>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-whyChooseTitle" className="text-xs">Section Title</Label>
                  <Input id="hp-whyChooseTitle" value={homePageContent.whyChooseTitle ?? ""} onChange={(e) => setHomePageContent({ whyChooseTitle: e.target.value })} placeholder="Why Choose" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-whyChooseBrandName" className="text-xs">Brand Name (Highlighted)</Label>
                  <Input id="hp-whyChooseBrandName" value={homePageContent.whyChooseBrandName ?? ""} onChange={(e) => setHomePageContent({ whyChooseBrandName: e.target.value })} placeholder="La Bella" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hp-whyChooseSubtitle" className="text-xs">Subtitle</Label>
                <Input id="hp-whyChooseSubtitle" value={homePageContent.whyChooseSubtitle ?? ""} onChange={(e) => setHomePageContent({ whyChooseSubtitle: e.target.value })} placeholder="Discover the excellence that sets us apart" />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-primary">Statistics</h4>
            <div className="grid gap-3">
              {[1, 2, 3].map((num) => (
                <div key={num} className="grid grid-cols-3 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor={`hp-stat${num}Value`} className="text-xs">Stat {num} Value</Label>
                    <Input id={`hp-stat${num}Value`} value={homePageContent[`stat${num}Value` as keyof HomePageContent] as string} onChange={(e) => setHomePageContent({ [`stat${num}Value`]: e.target.value })} placeholder="15+" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor={`hp-stat${num}Label`} className="text-xs">Stat {num} Label</Label>
                    <Input id={`hp-stat${num}Label`} value={homePageContent[`stat${num}Label` as keyof HomePageContent] as string} onChange={(e) => setHomePageContent({ [`stat${num}Label`]: e.target.value })} placeholder="Years of Experience" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor={`hp-stat${num}Description`} className="text-xs">Stat {num} Description</Label>
                    <Input id={`hp-stat${num}Description`} value={homePageContent[`stat${num}Description` as keyof HomePageContent] as string} onChange={(e) => setHomePageContent({ [`stat${num}Description`]: e.target.value })} placeholder="Description" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Services Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-primary">Popular Services Section</h4>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-popularServicesTitle" className="text-xs">Section Title</Label>
                  <Input id="hp-popularServicesTitle" value={homePageContent.popularServicesTitle ?? ""} onChange={(e) => setHomePageContent({ popularServicesTitle: e.target.value })} placeholder="Popular" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-popularServicesHighlight" className="text-xs">Highlighted Text</Label>
                  <Input id="hp-popularServicesHighlight" value={homePageContent.popularServicesHighlight ?? ""} onChange={(e) => setHomePageContent({ popularServicesHighlight: e.target.value })} placeholder="Services" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hp-popularServicesSubtitle" className="text-xs">Subtitle</Label>
                <Input id="hp-popularServicesSubtitle" value={homePageContent.popularServicesSubtitle ?? ""} onChange={(e) => setHomePageContent({ popularServicesSubtitle: e.target.value })} placeholder="Explore our most loved beauty treatments" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hp-viewAllServicesButton" className="text-xs">View All Button Text</Label>
                <Input id="hp-viewAllServicesButton" value={homePageContent.viewAllServicesButton ?? ""} onChange={(e) => setHomePageContent({ viewAllServicesButton: e.target.value })} placeholder="View All Services" />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-primary">CTA Section</h4>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="hp-ctaTitle" className="text-xs">Title</Label>
                <Input id="hp-ctaTitle" value={homePageContent.ctaTitle ?? ""} onChange={(e) => setHomePageContent({ ctaTitle: e.target.value })} placeholder="Ready to Transform Your Look?" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hp-ctaDescription" className="text-xs">Description</Label>
                <Input id="hp-ctaDescription" value={homePageContent.ctaDescription ?? ""} onChange={(e) => setHomePageContent({ ctaDescription: e.target.value })} placeholder="Let our expert team create the perfect look for you." />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hp-ctaButtonText" className="text-xs">Button Text</Label>
                <Input id="hp-ctaButtonText" value={homePageContent.ctaButtonText ?? ""} onChange={(e) => setHomePageContent({ ctaButtonText: e.target.value })} placeholder="Book Your Appointment Today" />
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-primary">Footer Section</h4>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-footerBrandName" className="text-xs">Brand Name</Label>
                  <Input id="hp-footerBrandName" value={homePageContent.footerBrandName ?? ""} onChange={(e) => setHomePageContent({ footerBrandName: e.target.value })} placeholder="La Bella" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-footerBrandDescription" className="text-xs">Brand Description</Label>
                  <Input id="hp-footerBrandDescription" value={homePageContent.footerBrandDescription ?? ""} onChange={(e) => setHomePageContent({ footerBrandDescription: e.target.value })} placeholder="Your premier destination for luxury beauty treatments." />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hp-footerContactHeading" className="text-xs">Contact Heading</Label>
                <Input id="hp-footerContactHeading" value={homePageContent.footerContactHeading ?? ""} onChange={(e) => setHomePageContent({ footerContactHeading: e.target.value })} placeholder="Contact Us" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-footerAddressLine1" className="text-xs">Address Line 1</Label>
                  <Input id="hp-footerAddressLine1" value={homePageContent.footerAddressLine1 ?? ""} onChange={(e) => setHomePageContent({ footerAddressLine1: e.target.value })} placeholder="123 Beauty Lane, Suite 100" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-footerAddressLine2" className="text-xs">Address Line 2</Label>
                  <Input id="hp-footerAddressLine2" value={homePageContent.footerAddressLine2 ?? ""} onChange={(e) => setHomePageContent({ footerAddressLine2: e.target.value })} placeholder="New York, NY 10001" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-footerPhone" className="text-xs">Phone</Label>
                  <Input id="hp-footerPhone" value={homePageContent.footerPhone ?? ""} onChange={(e) => setHomePageContent({ footerPhone: e.target.value })} placeholder="(555) 123-4567" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-footerEmail" className="text-xs">Email</Label>
                  <Input id="hp-footerEmail" value={homePageContent.footerEmail ?? ""} onChange={(e) => setHomePageContent({ footerEmail: e.target.value })} placeholder="hello@labella.com" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hp-footerHoursHeading" className="text-xs">Hours Heading</Label>
                <Input id="hp-footerHoursHeading" value={homePageContent.footerHoursHeading ?? ""} onChange={(e) => setHomePageContent({ footerHoursHeading: e.target.value })} placeholder="Opening Hours" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-footerHoursWeekday" className="text-xs">Weekday Hours</Label>
                  <Input id="hp-footerHoursWeekday" value={homePageContent.footerHoursWeekday ?? ""} onChange={(e) => setHomePageContent({ footerHoursWeekday: e.target.value })} placeholder="Mon - Fri: 9:00 AM - 8:00 PM" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-footerHoursSaturday" className="text-xs">Saturday Hours</Label>
                  <Input id="hp-footerHoursSaturday" value={homePageContent.footerHoursSaturday ?? ""} onChange={(e) => setHomePageContent({ footerHoursSaturday: e.target.value })} placeholder="Saturday: 9:00 AM - 6:00 PM" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="hp-footerHoursSunday" className="text-xs">Sunday Hours</Label>
                  <Input id="hp-footerHoursSunday" value={homePageContent.footerHoursSunday ?? ""} onChange={(e) => setHomePageContent({ footerHoursSunday: e.target.value })} placeholder="Sunday: 10:00 AM - 5:00 PM" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="hp-footerLinksHeading" className="text-xs">Links Heading</Label>
                <Input id="hp-footerLinksHeading" value={homePageContent.footerLinksHeading ?? ""} onChange={(e) => setHomePageContent({ footerLinksHeading: e.target.value })} placeholder="Quick Links" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="grid gap-1.5">
                    <Label htmlFor={`hp-footerLink${num}`} className="text-xs">Link {num}</Label>
                    <Input id={`hp-footerLink${num}`} value={homePageContent[`footerLink${num}` as keyof HomePageContent] as string} onChange={(e) => setHomePageContent({ [`footerLink${num}`]: e.target.value })} placeholder={`Link ${num}`} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[4, 5].map((num) => (
                  <div key={num} className="grid gap-1.5">
                    <Label htmlFor={`hp-footerLink${num}`} className="text-xs">Link {num}</Label>
                    <Input id={`hp-footerLink${num}`} value={homePageContent[`footerLink${num}` as keyof HomePageContent] as string} onChange={(e) => setHomePageContent({ [`footerLink${num}`]: e.target.value })} placeholder={`Link ${num}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Social Media Links
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Edit the social media links displayed in the footer. Changes take effect immediately.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-1.5">
            <Label htmlFor="hp-footerInstagramLink" className="text-xs">Instagram Link</Label>
            <Input id="hp-footerInstagramLink" value={homePageContent.footerInstagramLink ?? ""} onChange={(e) => setHomePageContent({ footerInstagramLink: e.target.value })} placeholder="https://instagram.com/..." />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="hp-footerFacebookLink" className="text-xs">Facebook Link</Label>
            <Input id="hp-footerFacebookLink" value={homePageContent.footerFacebookLink ?? ""} onChange={(e) => setHomePageContent({ footerFacebookLink: e.target.value })} placeholder="https://facebook.com/..." />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="hp-footerTwitterLink" className="text-xs">Twitter Link</Label>
            <Input id="hp-footerTwitterLink" value={homePageContent.footerTwitterLink ?? ""} onChange={(e) => setHomePageContent({ footerTwitterLink: e.target.value })} placeholder="https://twitter.com/..." />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="hp-footerTiktokLink" className="text-xs">TikTok Link</Label>
            <Input id="hp-footerTiktokLink" value={homePageContent.footerTiktokLink ?? ""} onChange={(e) => setHomePageContent({ footerTiktokLink: e.target.value })} placeholder="https://tiktok.com/@..." />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="hp-footerYoutubeLink" className="text-xs">YouTube Link</Label>
            <Input id="hp-footerYoutubeLink" value={homePageContent.footerYoutubeLink ?? ""} onChange={(e) => setHomePageContent({ footerYoutubeLink: e.target.value })} placeholder="https://youtube.com/@..." />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="hp-footerWhatsappLink" className="text-xs">WhatsApp Link/Number</Label>
            <Input id="hp-footerWhatsappLink" value={homePageContent.footerWhatsappLink ?? ""} onChange={(e) => setHomePageContent({ footerWhatsappLink: e.target.value })} placeholder="https://wa.me/9779800000000" />
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Changes are saved automatically. Leave a field empty to hide the icon in the footer.
          </p>
        </CardContent>
      </Card>

      {/* Navbar Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Navbar Branding
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Customize the logo and brand name displayed in the top navigation bar.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="hp-navbarBrandName" className="text-xs">Brand Name</Label>
            <Input id="hp-navbarBrandName" value={homePageContent.navbarBrandName ?? ""} onChange={(e) => setHomePageContent({ navbarBrandName: e.target.value })} placeholder="La Bella" />
          </div>
          <ImageUpload
            value={homePageContent.navbarLogoUrl ?? ""}
            onChange={(url) => setHomePageContent({ navbarLogoUrl: url })}
            label="Logo Image"
          />
          <p className="text-xs text-muted-foreground pt-1">
            Changes are saved automatically. Leave the logo empty to use the default scissors icon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
