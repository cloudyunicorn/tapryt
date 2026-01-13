"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, Library, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const sidebarItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Create",
        href: "/dashboard/create",
        icon: PlusCircle,
    },
    {
        title: "Library",
        href: "/dashboard/library",
        icon: Library,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [userName, setUserName] = useState("User");
    const [userInitial, setUserInitial] = useState("U");

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                let name = user.user_metadata?.full_name;
                if (!name) {
                    try {
                        const { data: userData } = await supabase
                            .from('users')
                            .select('full_name')
                            .eq('id', user.id)
                            .single();
                        if (userData?.full_name) name = userData.full_name;
                    } catch (e) { }
                }
                name = name || user.email?.split('@')[0] || "User";
                setUserName(name);
                setUserInitial(name.charAt(0).toUpperCase());
            }
        };
        getUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    return (
        <div className="flex flex-col h-full w-64 border-r bg-background/60 backdrop-blur-xl p-4 transition-all duration-300 ease-in-out">
            <div className="mb-10 px-4 pt-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="size-8 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                        T
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                        Tapryt
                    </span>
                </Link>
            </div>

            <nav className="flex-1 space-y-1.5 px-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <span
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary/10 text-primary font-semibold shadow-sm"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("size-5 transition-transform duration-200 group-hover:scale-110", isActive && "text-primary")} />
                                <span>{item.title}</span>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                )}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto px-2 pb-4">
                <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-2xl p-4 mb-4 border border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-3">Signed in as</p>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {userInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" title={userName}>{userName}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-9"
                        onClick={handleSignOut}
                    >
                        <LogOut className="size-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
