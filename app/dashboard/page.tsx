"use client";

import { StatsCards } from "@/components/dashboard/StatsCards";
import { IdeaLibrary } from "@/components/dashboard/IdeaLibrary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function DashboardOverview() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                <Link href="/dashboard/create">
                    <Button variant="gradient" size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Create New
                    </Button>
                </Link>
            </div>

            <StatsCards />

            <div>
                <h3 className="text-xl font-semibold mb-4">Recent Ideas</h3>
                <IdeaLibrary />
            </div>
        </div>
    );
}
