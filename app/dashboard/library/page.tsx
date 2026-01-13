"use client";

import { IdeaLibrary } from "@/components/dashboard/IdeaLibrary";

export default function LibraryPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Idea Library</h2>
            <p className="text-muted-foreground">Manage and organize your saved content ideas.</p>
            <div className="mt-8">
                <IdeaLibrary />
            </div>
        </div>
    );
}
