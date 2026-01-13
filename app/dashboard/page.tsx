"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";

interface SavedIdea {
    id: string;
    hook: string;
    angle: string;
    cta: string;
    niche: string;
    platform: string;
    created_at: string;
}

export default function Dashboard() {
    const [ideas, setIdeas] = useState<SavedIdea[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const fetchSavedIdeas = async () => {
        const { data, error } = await supabase
            .from('saved_ideas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            toast.error("Failed to load saved ideas");
        } else {
            setIdeas(data || []);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('saved_ideas').delete().eq('id', id);
        if (error) {
            toast.error("Failed to delete idea");
        } else {
            setIdeas(ideas.filter(idea => idea.id !== id));
            toast.success("Idea deleted");
        }
    };

    useEffect(() => {
        fetchSavedIdeas();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
                <h1 className="text-3xl font-bold mb-8">Your Saved Ideas</h1>

                {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading...</div>
                ) : ideas.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No saved ideas yet. Go generate some!
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {ideas.map((idea) => (
                            <div key={idea.id} className="relative p-6 rounded-xl border bg-card/60 backdrop-blur-sm text-card-foreground shadow-sm group hover:shadow-md transition-all">
                                <div className="absolute top-4 right-4 flex gap-2 overflow-hidden">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `Hook: ${idea.hook}\nAngle: ${idea.angle}\nCTA: ${idea.cta}`
                                            );
                                            toast.success("Copied!");
                                        }}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => handleDelete(idea.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-4 pr-12">
                                    <div className="flex gap-2 mb-2">
                                        <span className="text-[10px] bg-secondary px-2 py-1 rounded-full uppercase tracking-wider">{idea.niche}</span>
                                        <span className="text-[10px] bg-secondary px-2 py-1 rounded-full uppercase tracking-wider">{idea.platform}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hook</span>
                                        <p className="text-lg font-medium leading-snug">{idea.hook}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Angle</span>
                                        <p className="text-sm">{idea.angle}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Call to Action</span>
                                        <p className="text-sm text-indigo-500 font-medium">{idea.cta}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
