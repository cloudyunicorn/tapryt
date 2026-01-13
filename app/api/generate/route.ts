import { NextRequest, NextResponse } from "next/server";
import { generateIdeas } from "@/lib/ai/openrouter";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in to generate ideas." },
                { status: 401 }
            );
        }

        // Check User Limits
        const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('daily_generation_count, last_generation_date, subscription_status')
            .eq('id', user.id)
            .single();

        if (dbError) {
            console.error("Database Error:", dbError);
            return NextResponse.json({ error: "User profile not found. Please log out and back in." }, { status: 404 });
        }

        const today = new Date().toISOString().split('T')[0];
        let currentCount = userData.daily_generation_count || 0;
        const lastDate = userData.last_generation_date;

        // Reset loop if new day
        if (lastDate !== today) {
            currentCount = 0;
        }

        // Check Limit (3 for free)
        if (userData.subscription_status !== 'premium' && currentCount >= 3) {
            return NextResponse.json(
                { error: "Daily limit reached. Upgrade to Pro for unlimited ideas." },
                { status: 403 }
            );
        }

        const { niche, platform } = await req.json();

        if (!niche || !platform) {
            return NextResponse.json(
                { error: "Niche and platform are required" },
                { status: 400 }
            );
        }

        const ideas = await generateIdeas(niche, platform);

        // Fallback if AI returns empty or fails to parse
        if (!ideas || !Array.isArray(ideas)) {
            return NextResponse.json({ error: "Failed to generate ideas" }, { status: 500 });
        }

        // Increment Usage Count
        await supabase
            .from('users')
            .update({
                daily_generation_count: currentCount + 1,
                last_generation_date: today
            })
            .eq('id', user.id);

        return NextResponse.json({ ideas, remaining: 3 - (currentCount + 1) });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
