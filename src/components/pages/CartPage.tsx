"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import type { PaymentMethod, PaymentMethodType, OrderItem } from "@/lib/store";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/ui/image-upload";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  CreditCard,
  Building2,
  Wallet,
  Smartphone,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const TAX_RATE = 0.08;

type CheckoutStep = "closed" | "method" | "online" | "verify" | "success";

const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  bank: "Bank Transfer",
  esewa: "eSewa",
  khalti: "Khalti",
  imepay: "IME Pay",
};

const PAYMENT_METHOD_ICONS: Record<PaymentMethodType, React.ReactNode> = {
  bank: <Building2 className="w-6 h-6" />,
  esewa: <Wallet className="w-6 h-6" />,
  khalti: <Smartphone className="w-6 h-6" />,
  imepay: <Smartphone className="w-6 h-6" />,
};

export default function CartPage() {
  const cart = useAppStore((s) => s.cart);
  const products = useAppStore((s) => s.products);
  const updateCartQuantity = useAppStore((s) => s.updateCartQuantity);
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const clearCart = useAppStore((s) => s.clearCart);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const currentUser = useAppStore((s) => s.currentUser);
  const addOrder = useAppStore((s) => s.addOrder);
  const paymentMethods = useAppStore((s) => s.paymentMethods);

  // Checkout dialog state
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("closed");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [fullName, setFullName] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [paymentSlip, setPaymentSlip] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successSubMessage, setSuccessSubMessage] = useState("");

  // Active payment methods from store
  const activePaymentMethods = useMemo(
    () => paymentMethods.filter((pm) => pm.active),
    [paymentMethods]
  );

  // Resolve cart items with product data
  const cartItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        ...item,
        product,
        lineTotal: product.price * item.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    toast("Item removed");
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity);
  };

  // Build OrderItem[] from cart
  const buildOrderItems = (): OrderItem[] => {
    return cartItems.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));
  };

  // Open checkout dialog
  const handleCheckout = () => {
    if (!currentUser) {
      toast.error("Please log in to checkout");
      setCurrentPage("login");
      return;
    }
    setCheckoutStep("method");
  };

  // Cash on Delivery
  const handleCashOnDelivery = () => {
    setIsSubmitting(true);
    // Small delay for UX
    setTimeout(() => {
      addOrder({
        userId: currentUser!.id,
        userName: currentUser!.name,
        userEmail: currentUser!.email,
        items: buildOrderItems(),
        total: grandTotal,
        paymentMethod: "cash_on_delivery",
        status: "pending",
      });
      clearCart();
      setSuccessMessage("Order Submitted Successfully!");
      setSuccessSubMessage("Your order has been placed. You will pay when your order is delivered.");
      setCheckoutStep("success");
      setIsSubmitting(false);
    }, 500);
  };

  // Select online payment method
  const handleSelectPaymentMethod = (pm: PaymentMethod) => {
    setSelectedPaymentMethod(pm);
    setCheckoutStep("verify");
  };

  // Submit online payment order
  const handleSubmitOnlineOrder = () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!transactionNumber.trim()) {
      toast.error("Please enter the transaction number");
      return;
    }
    if (!currentUser) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addOrder({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        items: buildOrderItems(),
        total: grandTotal,
        paymentMethod: selectedPaymentMethod!.type,
        status: "pending",
        fullName: fullName.trim(),
        transactionNumber: transactionNumber.trim(),
        paymentSlip: paymentSlip || undefined,
      });
      clearCart();
      setSuccessMessage("Order Submitted Successfully!");
      setSuccessSubMessage("Your payment is being verified.");
      setCheckoutStep("success");
      setIsSubmitting(false);
    }, 500);
  };

  // Close dialog and reset
  const handleCloseDialog = () => {
    setCheckoutStep("closed");
    setSelectedPaymentMethod(null);
    setFullName("");
    setTransactionNumber("");
    setPaymentSlip("");
    setSuccessMessage("");
    setSuccessSubMessage("");
  };

  // Go back to payment method selection
  const handleBackToMethod = () => {
    setCheckoutStep("method");
    setSelectedPaymentMethod(null);
  };

  // Go back to online payment methods
  const handleBackToOnline = () => {
    setCheckoutStep("online");
    setFullName("");
    setTransactionNumber("");
    setPaymentSlip("");
  };

  // ============ EMPTY STATE ============
  if (cartItems.length === 0 && checkoutStep === "closed") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="mx-auto w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <ShoppingCart className="w-14 h-14 sm:w-18 sm:h-18 text-primary/40" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">
            Looks like you haven&apos;t added any products yet. Browse our collection and find something you love!
          </p>
          <Button
            size="lg"
            className="rounded-full px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            onClick={() => setCurrentPage("products")}
          >
            <ShoppingBag className="mr-2 w-5 h-5" />
            Browse Products
          </Button>
        </motion.div>
      </div>
    );
  }

  // ============ CART WITH ITEMS ============
  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold">Shopping Cart</h1>
            <Badge variant="secondary" className="text-sm">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Review your items before checkout
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* ============ CART ITEMS LIST ============ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1"
          >
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Cart Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-4 p-4 sm:p-6 hover:bg-muted/30 transition-colors duration-200">
                        {/* Product Image */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            NPR {item.product.price.toFixed(2)} each
                          </p>
                          {item.product.category && (
                            <Badge
                              variant="outline"
                              className="mt-1 text-xs border-primary/20 text-primary"
                            >
                              {item.product.category}
                            </Badge>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-colors"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                          <span className="w-8 text-center font-semibold text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-colors"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>

                        {/* Line Total */}
                        <div className="hidden sm:block text-right flex-shrink-0 w-24">
                          <p className="font-bold text-primary">
                            NPR {item.lineTotal.toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                          onClick={() => handleRemove(item.productId)}
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Mobile line total */}
                      <div className="sm:hidden px-4 pb-3 flex justify-end">
                        <span className="text-sm text-muted-foreground mr-2">Subtotal:</span>
                        <span className="font-bold text-primary">
                          NPR {item.lineTotal.toFixed(2)}
                        </span>
                      </div>

                      {index < cartItems.length - 1 && (
                        <Separator className="mx-4 sm:mx-6" />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>

              <CardFooter className="border-t pt-4 flex justify-between items-center">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    clearCart();
                    toast("Cart cleared");
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-primary/30 hover:bg-primary/5"
                  onClick={() => setCurrentPage("products")}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* ============ ORDER SUMMARY ============ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-80 xl:w-96"
          >
            <Card className="rounded-2xl border-0 shadow-sm sticky top-24">
              <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)}{" "}
                    {cartItems.reduce((s, i) => s + i.quantity, 0) === 1
                      ? "item"
                      : "items"}
                    )
                  </span>
                  <span className="font-medium">
                    NPR {subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Tax ({(TAX_RATE * 100).toFixed(0)}%)
                  </span>
                  <span className="font-medium">NPR {tax.toFixed(2)}</span>
                </div>

                {/* Shipping note */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Shipping
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-0 text-xs"
                  >
                    FREE
                  </Badge>
                </div>

                <Separator />

                {/* Grand Total */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">
                    NPR {grandTotal.toFixed(2)}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="w-full rounded-full py-6 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                  onClick={handleCheckout}
                >
                  Checkout
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Secure checkout powered by La Bella
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* ============ CHECKOUT DIALOG ============ */}
      <Dialog open={checkoutStep !== "closed"} onOpenChange={(open) => { if (!open) handleCloseDialog(); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* ===== STEP 1: Payment Method Selection ===== */}
            {checkoutStep === "method" && (
              <motion.div
                key="method"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-xl">Choose Payment Method</DialogTitle>
                  <DialogDescription>
                    Select how you would like to pay for your order
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={handleCashOnDelivery}
                    disabled={isSubmitting}
                    className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-muted hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-2xl">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    )}
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Truck className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Cash on Delivery</h3>
                      <p className="text-sm text-muted-foreground">
                        Pay when your order is delivered
                      </p>
                    </div>
                  </button>

                  {/* Pay Now */}
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("online")}
                    className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-muted hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <CreditCard className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Pay Now</h3>
                      <p className="text-sm text-muted-foreground">
                        Pay online using Bank, eSewa, Khalti, or IME Pay
                      </p>
                    </div>
                  </button>
                </div>

                {/* Order Summary in Dialog */}
                <div className="mt-6 p-4 rounded-xl bg-muted/50">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Order Total</span>
                    <span className="font-bold text-primary text-lg">NPR {grandTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Including {(TAX_RATE * 100).toFixed(0)}% tax • Free shipping
                  </p>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 2b: Online Payment Methods ===== */}
            {checkoutStep === "online" && (
              <motion.div
                key="online"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <DialogHeader className="mb-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full -ml-2"
                      onClick={handleBackToMethod}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                      <DialogTitle className="text-xl">Select Payment Method</DialogTitle>
                      <DialogDescription>
                        Choose your preferred online payment method
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {activePaymentMethods.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">No Payment Methods Available</h3>
                    <p className="text-sm text-muted-foreground">
                      Please try Cash on Delivery instead
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 rounded-full"
                      onClick={handleBackToMethod}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Go Back
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {activePaymentMethods.map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => handleSelectPaymentMethod(pm)}
                        className="group flex flex-col gap-3 p-5 rounded-2xl border-2 border-muted hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors text-primary">
                            {PAYMENT_METHOD_ICONS[pm.type]}
                          </div>
                          <h3 className="font-semibold text-base">
                            {PAYMENT_METHOD_LABELS[pm.type]}
                          </h3>
                        </div>

                        {/* Bank details */}
                        {pm.type === "bank" && (
                          <div className="space-y-1.5 text-sm text-muted-foreground">
                            {pm.accountHolderName && (
                              <p><span className="font-medium text-foreground">Name:</span> {pm.accountHolderName}</p>
                            )}
                            {pm.accountNumber && (
                              <p><span className="font-medium text-foreground">Account:</span> {pm.accountNumber}</p>
                            )}
                            {pm.branchName && (
                              <p><span className="font-medium text-foreground">Branch:</span> {pm.branchName}</p>
                            )}
                          </div>
                        )}

                        {/* Wallet details */}
                        {(pm.type === "esewa" || pm.type === "khalti" || pm.type === "imepay") && (
                          <div className="space-y-1.5 text-sm text-muted-foreground">
                            {pm.walletName && (
                              <p><span className="font-medium text-foreground">Name:</span> {pm.walletName}</p>
                            )}
                            {pm.walletNumber && (
                              <p><span className="font-medium text-foreground">Number:</span> {pm.walletNumber}</p>
                            )}
                          </div>
                        )}

                        {/* QR Code */}
                        {pm.qrImage && (
                          <div className="mt-2">
                            <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-muted">
                              <Image
                                src={pm.qrImage}
                                alt={`${PAYMENT_METHOD_LABELS[pm.type]} QR Code`}
                                fill
                                unoptimized
                                className="object-contain"
                                sizes="112px"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <QrCode className="w-3 h-3" />
                              Scan to pay
                            </p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Order Total */}
                <div className="mt-6 p-4 rounded-xl bg-muted/50">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Order Total</span>
                    <span className="font-bold text-primary text-lg">NPR {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 3: Payment Verification ===== */}
            {checkoutStep === "verify" && selectedPaymentMethod && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <DialogHeader className="mb-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full -ml-2"
                      onClick={handleBackToOnline}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                      <DialogTitle className="text-xl">Payment Verification</DialogTitle>
                      <DialogDescription>
                        Verify your {PAYMENT_METHOD_LABELS[selectedPaymentMethod.type]} payment
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {/* Selected method summary */}
                <div className="p-4 rounded-xl bg-muted/50 border border-muted mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {PAYMENT_METHOD_ICONS[selectedPaymentMethod.type]}
                    </div>
                    <div>
                      <p className="font-medium">{PAYMENT_METHOD_LABELS[selectedPaymentMethod.type]}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedPaymentMethod.type === "bank"
                          ? selectedPaymentMethod.accountNumber
                          : selectedPaymentMethod.walletNumber}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <p className="font-bold text-primary text-lg">NPR {grandTotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment details to transfer */}
                <div className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    Payment Details
                  </h4>
                  {selectedPaymentMethod.type === "bank" ? (
                    <div className="space-y-1.5 text-sm">
                      {selectedPaymentMethod.accountHolderName && (
                        <p><span className="text-muted-foreground">Account Holder:</span> <span className="font-medium">{selectedPaymentMethod.accountHolderName}</span></p>
                      )}
                      {selectedPaymentMethod.accountNumber && (
                        <p><span className="text-muted-foreground">Account Number:</span> <span className="font-medium font-mono">{selectedPaymentMethod.accountNumber}</span></p>
                      )}
                      {selectedPaymentMethod.branchName && (
                        <p><span className="text-muted-foreground">Branch:</span> <span className="font-medium">{selectedPaymentMethod.branchName}</span></p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-sm">
                      {selectedPaymentMethod.walletName && (
                        <p><span className="text-muted-foreground">Wallet Name:</span> <span className="font-medium">{selectedPaymentMethod.walletName}</span></p>
                      )}
                      {selectedPaymentMethod.walletNumber && (
                        <p><span className="text-muted-foreground">Wallet Number:</span> <span className="font-medium font-mono">{selectedPaymentMethod.walletNumber}</span></p>
                      )}
                    </div>
                  )}
                  {selectedPaymentMethod.qrImage && (
                    <div className="mt-3">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-muted bg-white">
                        <Image
                          src={selectedPaymentMethod.qrImage}
                          alt="QR Code"
                          fill
                          unoptimized
                          className="object-contain"
                          sizes="128px"
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    Please transfer NPR {grandTotal.toFixed(2)} using the details above, then fill in the verification form below.
                  </p>
                </div>

                {/* Verification Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionNumber">Transaction Number <span className="text-destructive">*</span></Label>
                    <Input
                      id="transactionNumber"
                      placeholder="Enter the transaction/reference number"
                      value={transactionNumber}
                      onChange={(e) => setTransactionNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <ImageUpload
                      value={paymentSlip}
                      onChange={setPaymentSlip}
                      label="Payment Slip / Screenshot (Optional)"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full flex-1"
                    onClick={handleBackToOnline}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    className="rounded-full flex-1 shadow-lg shadow-primary/25"
                    onClick={handleSubmitOnlineOrder}
                    disabled={isSubmitting || !fullName.trim() || !transactionNumber.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Order
                        <CheckCircle2 className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ===== SUCCESS STEP ===== */}
            {checkoutStep === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </motion.div>

                <h2 className="text-2xl font-bold mb-2">{successMessage}</h2>
                <p className="text-muted-foreground mb-8">{successSubMessage}</p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    className="rounded-full shadow-lg shadow-primary/25"
                    onClick={() => {
                      handleCloseDialog();
                      setCurrentPage("products");
                    }}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={handleCloseDialog}
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
