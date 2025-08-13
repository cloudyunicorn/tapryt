"use client";

import { useEffect, useState } from "react";
import { type User, type AuthChangeEvent, type Session } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { 
  QrCodeIcon,
  ChartBarIcon,
  ShareIcon,
  CogIcon,
  PlusIcon,
  EyeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

const supabase = createClient();

// Mock data - replace with actual data from your database
const mockStats = {
  totalViews: 1247,
  totalContacts: 89,
  cardsCreated: 3,
  thisWeekViews: 156
};

const mockRecentActivity = [
  { id: 1, action: "Card viewed by John Doe", time: "2 hours ago", type: "view" },
  { id: 2, action: "New contact added", time: "5 hours ago", type: "contact" },
  { id: 3, action: "Card shared via QR code", time: "1 day ago", type: "share" },
  { id: 4, action: "Profile updated", time: "2 days ago", type: "update" },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-slate-500">?</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">You need to be authenticated to access this page</p>
            <Link href="/auth/login">
              <Button className="bg-brand-gradient hover:opacity-90">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TR</span>
                  </div>
                  <span className="text-xl font-bold text-brand-gradient">TapRyt</span>
                </Link>
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                  Pro Plan
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
                <Button variant="outline" onClick={handleSignOut} className="border-slate-300 dark:border-slate-600">
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Welcome back,{" "}
              <span className="text-brand-gradient">
                {user.user_metadata?.name || user.email?.split('@')[0] || 'there'}
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Here&apos;s what&apos;s happening with your digital business cards today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Views</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{mockStats.totalViews.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                    <EyeIcon className="w-6 h-6 text-brand-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Contacts</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{mockStats.totalContacts}</p>
                  </div>
                  <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-brand-purple" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Cards</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{mockStats.cardsCreated}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <QrCodeIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">This Week</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{mockStats.thisWeekViews}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-auto p-4 bg-brand-gradient hover:opacity-90 flex-col gap-2">
                <PlusIcon className="w-6 h-6" />
                Create New Card
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 border-primary hover:bg-primary/5">
                <QrCodeIcon className="w-6 h-6 text-brand-blue" />
                Generate QR Code
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 border-primary hover:bg-primary/5">
                <ShareIcon className="w-6 h-6 text-brand-purple" />
                Share Card
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 border-primary hover:bg-primary/5">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
                View Analytics
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Feature Cards */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold">Manage Your Cards</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <SparklesIcon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle>Digital Business Card</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Customize your digital card with your brand colors, logo, and professional information.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-brand-gradient hover:opacity-90">
                        Edit Card
                      </Button>
                      <Button size="sm" variant="outline">
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ChartBarIcon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle>Analytics Dashboard</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Track card views, contact interactions, and networking performance metrics.
                    </p>
                    <Button size="sm" variant="outline" className="w-full border-green-200 hover:bg-green-50 text-green-700">
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UserGroupIcon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle>Contact Management</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Organize and manage your professional contacts and networking leads.
                    </p>
                    <Button size="sm" variant="outline" className="w-full border-orange-200 hover:bg-orange-50 text-orange-700">
                      Manage Contacts
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CogIcon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle>Account Settings</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Update your profile, notification preferences, and account security.
                    </p>
                    <Button size="sm" variant="outline" className="w-full border-red-200 hover:bg-red-50 text-red-700">
                      Open Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity Sidebar */}
            <div className="space-y-6">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Recent Activity
                    <Badge variant="secondary" className="text-xs">
                      {mockRecentActivity.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'view' ? 'bg-blue-500' :
                          activity.type === 'contact' ? 'bg-green-500' :
                          activity.type === 'share' ? 'bg-purple-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900 dark:text-white">{activity.action}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4 text-brand-blue hover:text-brand-purple">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 border-brand-blue/20">
                <CardHeader>
                  <CardTitle className="text-brand-gradient">Pro Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                    Add a professional headshot to your digital card to increase engagement by up to 40%!
                  </p>
                  <Button size="sm" className="bg-brand-gradient hover:opacity-90">
                    Add Photo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
