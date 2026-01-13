import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden">
            {/* Background Gradients moved to layout */}

            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6">
                    <Sparkles className="w-3 h-3 mr-2 text-indigo-500" />
                    <span className="bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent font-bold">
                        New: AI-Powered Viral Hooks
                    </span>
                </div>

                <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6">
                    Stop Guessing. <br />
                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                        Start Going Viral.
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mb-8 leading-relaxed">
                    Generate scroll-stopping content ideas for Instagram Reels, YouTube Shorts, and LinkedIn in seconds.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link href="/login">
                        <Button size="lg" variant="gradient" className="w-full sm:w-auto text-lg h-12 px-8 shadow-lg shadow-indigo-500/25">
                            Start Generating Free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 px-8" onClick={() => {
                        document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        Try the Demo
                    </Button>
                </div>

                <div className="mt-12 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                                U{i}
                            </div>
                        ))}
                    </div>
                    <p>Trusted by 1,000+ creators</p>
                </div>
            </div>
        </section>
    );
}
