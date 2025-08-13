"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { CheckCircleIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-brand-purple/20 rounded-full blur-3xl"></div>
      </div>

      <div className={cn("w-full max-w-md relative z-10", className)} {...props}>
        {/* Brand logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">TR</span>
          </div>
          <span className="text-2xl font-bold text-brand-gradient">
            TapRyt
          </span>
        </div>

        {success ? (
          // Success State
          <Card className="border-slate-200 dark:border-slate-700 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold">
                Check Your
                <span className="text-brand-gradient"> Email</span>
              </CardTitle>
              <CardDescription className="text-base">
                Password reset instructions have been sent to your email
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 justify-center text-green-700 dark:text-green-300 mb-2">
                    <EnvelopeIcon className="w-5 h-5" />
                    <span className="font-medium">Email sent to:</span>
                  </div>
                  <p className="text-sm font-mono text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded">
                    {email}
                  </p>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    If you registered using your email and password, you will receive a password reset email within the next few minutes.
                  </p>
                  <p>
                    Didn&apos;t receive the email? Check your spam folder or try again.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                    setError(null);
                  }}
                  variant="outline" 
                  className="w-full border-primary hover:bg-primary/5"
                >
                  Try Different Email
                </Button>
                
                <Link href="/auth/login" className="block">
                  <Button className="w-full bg-brand-gradient hover:opacity-90">
                    Back to Sign In
                  </Button>
                </Link>
              </div>

              {/* Help section */}
              <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  Still having trouble?
                </p>
                <Link 
                  href="/support" 
                  className="text-sm text-brand-blue hover:text-brand-purple transition-colors underline-offset-4 hover:underline"
                >
                  Contact Support
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Form State
          <Card className="border-slate-200 dark:border-slate-700 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold">
                Reset Your
                <span className="text-brand-gradient"> Password</span>
              </CardTitle>
              <CardDescription className="text-base">
                Enter your email address and we&apos;ll send you a secure link to reset your password
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-12 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary"
                    />
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter the email address associated with your TapRyt account
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-brand-gradient hover:opacity-90 text-white font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Sending Reset Link...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-5 h-5" />
                      Send Reset Link
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">
                    Or
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="grid grid-cols-2 gap-3">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full border-primary hover:bg-primary/5">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button variant="outline" className="w-full border-primary hover:bg-primary/5">
                    Create Account
                  </Button>
                </Link>
              </div>

              {/* Security note */}
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  🔒 This is a secure password reset process. The link will expire in 24 hours for your security.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} TapRyt. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
