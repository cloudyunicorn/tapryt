"use client";

import { useState } from "react";
import { InputForm } from "@/components/generator/InputForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Bookmark, Copy } from "lucide-react";

interface Idea {
    hook: string;
    angle: string;
    cta: string;
}

export default function CreatePage() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentNiche, setCurrentNiche] = useState("");
    const [currentPlatform, setCurrentPlatform] = useState("");
    const supabase = createClient();

    const handleGenerate = async (niche: string, platform: string) => {
        setIsLoading(true);
        setCurrentNiche(niche);
        setCurrentPlatform(platform);
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ niche, platform }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Please sign in first"); return;
                }
                if (response.status === 403) {
                    toast.error("Daily limit reached. Upgrade to Pro!"); return;
                }
                throw new Error(data.error || "Failed to generate ideas");
            }

            setIdeas(data.ideas);
            toast.success("Fresh ideas generated!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (idea: Idea) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('saved_ideas').insert({
            user_id: user.id,
            niche: currentNiche,
            platform: currentPlatform,
            hook: idea.hook,
            angle: idea.angle,
            cta: idea.cta
        });

        if (error) {
            toast.error("Failed to save idea");
        } else {
            toast.success("Saved to Library!");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Create New Ideas</h2>
                <p className="text-muted-foreground">Select your niche and platform to get started.</p>
            </div>

            <InputForm onGenerate={handleGenerate} isLoading={isLoading} />

            {ideas.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 mt-8">
                    {ideas.map((idea, i) => (
                        <div key={i} className="relative p-6 rounded-xl border bg-card/60 backdrop-blur-sm text-card-foreground shadow-sm group hover:shadow-md transition-all">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" onClick={() => handleSave(idea)} title="Save Idea">
                                    <Bookmark className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => {
                                    navigator.clipboard.writeText(`Hook: ${idea.hook}\nAngle: ${idea.angle}\nCTA: ${idea.cta}`);
                                    toast.success("Copied!");
                                }}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hook</span>
                                    <p className="text-lg font-medium leading-relaxed">{idea.hook}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Angle</span>
                                    <p className="text-sm">{idea.angle}</p>
                                </div>
                                <div className="bg-secondary/50 p-3 rounded-lg">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Call to Action</span>
                                    <p className="text-sm text-indigo-500 font-bold">{idea.cta}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
