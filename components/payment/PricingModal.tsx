"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setIsLoading(true);

        const res = await loadRazorpay();

        if (!res) {
            toast.error("Razorpay SDK failed to load");
            setIsLoading(false);
            return;
        }

        // 1. Create Order
        const orderRes = await fetch("/api/payment/create-order", { method: "POST" });

        if (!orderRes.ok) {
            toast.error("Failed to create order. Please log in.");
            setIsLoading(false);
            return;
        }

        const orderData = await orderRes.json();

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy",
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Tapryt Pro",
            description: "Unlimited Viral Ideas",
            order_id: orderData.id,
            handler: async function (response: any) {
                // 2. Verify Payment (Mock or Real)
                const verifyRes = await fetch("/api/payment/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    }),
                });

                if (verifyRes.ok) {
                    toast.success("Payment Successful! You are now a Pro member.");
                    onClose();
                    router.refresh();
                } else {
                    toast.error("Payment verification failed.");
                }
            },
            prefill: {
                name: "Tapryt User",
                email: "user@example.com",
            },
            theme: {
                color: "#6366f1",
            },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Upgrade to Pro</DialogTitle>
                    <DialogDescription className="text-center">
                        Unlock unlimited ideas and unleash your potential.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-6">
                    <div className="flex justify-center mb-6">
                        <span className="text-4xl font-bold">₹499</span>
                        <span className="text-muted-foreground self-end mb-1">/ lifetime</span>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>Unlimited Idea Generation</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>Access to all future features</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>Priority Support</span>
                        </li>
                    </ul>
                </div>
                <DialogFooter>
                    <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-indigo-500"
                        size="lg"
                        onClick={handlePayment}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : "Get Pro Initial Lifetime Deal"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
