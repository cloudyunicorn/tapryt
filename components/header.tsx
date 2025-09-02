'use client';

import React from 'react';
import { type User } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface HeaderProps {
  user: User | null;
  onSignOut?: () => void;
}

export function Header({ user, onSignOut }: HeaderProps) {
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (onSignOut) {
      onSignOut();
    } else {
      window.location.href = '/auth/login';
    }
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TR</span>
              </div>
              <span className="text-xl font-bold text-brand-gradient">
                TapRyt
              </span>
            </Link>
            <Badge
              variant="secondary"
              className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
            >
              Pro Plan
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {user.user_metadata?.name ||
                      user.email?.split('@')[0] ||
                      'User'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="border-slate-300 dark:border-slate-600"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/auth/login">
                <Button className="bg-brand-gradient hover:opacity-90">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
