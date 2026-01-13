"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, LogOut, User as UserIcon, CreditCard, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { PricingModal } from "@/components/payment/PricingModal";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data: userData } = await supabase
                    .from('users')
                    .select('daily_generation_count, subscription_status')
                    .eq('id', user.id)
                    .single();
                setStats(userData);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login"); // Redirect to login, middleware should handle it too
    };

    if (isLoading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
    }

    const isPro = stats?.subscription_status === 'premium';

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account and subscription.</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                            Profile
                        </CardTitle>
                        <CardDescription>Your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                {user?.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h3 className="font-medium text-lg leading-none">{user?.email}</h3>
                            <p className="text-sm text-muted-foreground">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            Subscription
                        </CardTitle>
                        <CardDescription>View and manage your plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Current Plan:</span>
                                    <Badge variant={isPro ? "default" : "secondary"}>
                                        {isPro ? "Pro Plan" : "Free Plan"}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {isPro
                                        ? "You have unlimited access to all features."
                                        : "You are on the free tier with limited daily generations."}
                                </p>
                            </div>
                            {!isPro && (
                                <Button onClick={() => setIsPricingOpen(true)} variant="gradient" size="sm">
                                    Upgrade to Pro
                                </Button>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 rounded-lg border flex items-center gap-4">
                                <div className="p-2 bg-indigo-500/10 rounded-full">
                                    <Zap className="h-5 w-5 text-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Daily Generations</p>
                                    <p className="text-2xl font-bold">
                                        {isPro ? "Unlimited" : `${stats?.daily_generation_count || 0} / 3`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end">
                    <Button variant="destructive" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>

            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
        </div>
    );
}
