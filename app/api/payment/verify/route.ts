import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        // Use test secret if env not set
        const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment Verified - Update User Status
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                await supabase
                    .from('users')
                    .update({
                        subscription_status: 'premium',
                        is_premium: true
                    })
                    .eq('id', user.id);
            }

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
