import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExclamationTriangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CardNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-orange-500" />
            </div>
            <CardTitle className="text-2xl">Card Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              The digital business card you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/cards">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back to Cards
                </Button>
              </Link>
              <Link href="/create-card">
                <Button className="bg-brand-gradient hover:opacity-90">
                  Create Your Own Card
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
