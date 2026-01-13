"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";

interface InputFormProps {
    onGenerate: (niche: string, platform: string) => Promise<void>;
    isLoading: boolean;
}

const NICHES = [
    "Fitness",
    "Finance",
    "Motivation",
    "Travel",
    "Tech",
    "Education",
    "Business",
    "Lifestyle"
];

const PLATFORMS = [
    "Instagram Reels",
    "YouTube Shorts",
    "LinkedIn"
];

export function InputForm({ onGenerate, isLoading }: InputFormProps) {
    const [niche, setNiche] = useState<string>("");
    const [platform, setPlatform] = useState<string>("");

    const handleGenerate = () => {
        if (niche && platform) {
            onGenerate(niche, platform);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-4 p-6 bg-card/80 backdrop-blur-md rounded-xl border shadow-lg ring-1 ring-black/5">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Select Your Niche
                </label>
                <Select value={niche} onValueChange={setNiche}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a niche..." />
                    </SelectTrigger>
                    <SelectContent>
                        {NICHES.map((n) => (
                            <SelectItem key={n} value={n}>
                                {n}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Target Platform
                </label>
                <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a platform..." />
                    </SelectTrigger>
                    <SelectContent>
                        {PLATFORMS.map((p) => (
                            <SelectItem key={p} value={p}>
                                {p}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button
                className="w-full"
                variant="gradient"
                onClick={handleGenerate}
                disabled={!niche || !platform || isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cooking up ideas...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Viral Ideas
                    </>
                )}
            </Button>
        </div>
    );
}
