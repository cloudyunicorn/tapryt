import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t py-12 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-4">
                    <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                        Tapryt
                    </span>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        The secret weapon for faceless creators and personal brands.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-8 text-sm">
                    <div className="space-y-3">
                        <h4 className="font-semibold">Product</h4>
                        <Link href="#generator" className="block text-muted-foreground hover:text-foreground">Generator</Link>
                        <Link href="/pricing" className="block text-muted-foreground hover:text-foreground">Pricing</Link>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-semibold">Legal</h4>
                        <Link href="/privacy" className="block text-muted-foreground hover:text-foreground">Privacy</Link>
                        <Link href="/terms" className="block text-muted-foreground hover:text-foreground">Terms</Link>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 md:px-6 mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
                © 2026 Tapryt. All rights reserved. Built with ❤️ in Bangalore.
            </div>
        </footer>
    );
}
