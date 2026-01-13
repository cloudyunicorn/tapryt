import { Zap, TrendingUp, Copy, Lock } from "lucide-react";

const FEATURES = [
    {
        icon: Zap,
        title: "Instant Generation",
        description: "Get 10 fresh ideas in under 5 seconds. No more staring at a blank screen."
    },
    {
        icon: TrendingUp,
        title: "Proven Angles",
        description: "We use viral psychology (Negativity bias, Curiosity gaps) to ensure views."
    },
    {
        icon: Copy,
        title: "Click to Copy",
        description: "Formatted perfectly for your scripts. Just copy, paste, and record."
    },
    {
        icon: Lock,
        title: "Private Dashboard",
        description: "Save your winning ideas to your personal dashboard. Never lose a gem."
    }
];

export function Features() {
    return (
        <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Why Creators Love Tapryt
                    </h2>
                    <p className="mt-4 text-muted-foreground md:text-xl">
                        Built for speed, engagement, and consistency.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map((feature, i) => (
                        <div key={i} className="p-6 bg-background rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
