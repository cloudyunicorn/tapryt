"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Archive } from "lucide-react";

export function StatsCards() {
    const [stats, setStats] = useState({ dailyCount: 0, totalSaved: 0, isPremium: false });
    const supabase = createClient();

    useEffect(() => {
        const fetchStats = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch User Details
            const { data: userData } = await supabase
                .from('users')
                .select('daily_generation_count, subscription_status')
                .eq('id', user.id)
                .single();

            // Fetch Total Saved Ideas
            const { count } = await supabase
                .from('saved_ideas')
                .select('*', { count: 'exact', head: true });

            setStats({
                dailyCount: userData?.daily_generation_count || 0,
                isPremium: userData?.subscription_status === 'premium',
                totalSaved: count || 0
            });
        };
        fetchStats();
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-100/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Generations</CardTitle>
                    <Zap className="h-4 w-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.isPremium ? "Unlimited" : `${stats.dailyCount} / 3`}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.isPremium ? "You are a Pro user" : "Refreshes daily"}
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-100/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Saved Ideas</CardTitle>
                    <Archive className="h-4 w-4 text-pink-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSaved}</div>
                    <p className="text-xs text-muted-foreground">Lifetime ideas stored</p>
                </CardContent>
            </Card>
        </div>
    );
}
