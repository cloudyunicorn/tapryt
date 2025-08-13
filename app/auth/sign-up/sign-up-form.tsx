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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon, CheckIcon } from "@heroicons/react/24/outline";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Password strength validation
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  };

  const isPasswordStrong = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password === repeatPassword && password.length > 0;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!isPasswordStrong) {
      setError("Password does not meet requirements");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/dashboard");
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
          <Link href="/">         
            <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">TR</span>
            </div>
          </Link>
        </div>

        <Card className="border-slate-200 dark:border-slate-700 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold">
              Join
              <span className="text-brand-gradient"> TapRyt</span>
            </CardTitle>
            <CardDescription className="text-base">
              Create your account and start building your digital business card
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pr-12 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  {password && (
                    <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Password requirements:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center gap-1 ${passwordRequirements.length ? 'text-green-600' : 'text-slate-500'}`}>
                          <CheckIcon className={`w-3 h-3 ${passwordRequirements.length ? 'opacity-100' : 'opacity-30'}`} />
                          8+ characters
                        </div>
                        <div className={`flex items-center gap-1 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-slate-500'}`}>
                          <CheckIcon className={`w-3 h-3 ${passwordRequirements.uppercase ? 'opacity-100' : 'opacity-30'}`} />
                          Uppercase
                        </div>
                        <div className={`flex items-center gap-1 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-slate-500'}`}>
                          <CheckIcon className={`w-3 h-3 ${passwordRequirements.lowercase ? 'opacity-100' : 'opacity-30'}`} />
                          Lowercase
                        </div>
                        <div className={`flex items-center gap-1 ${passwordRequirements.number ? 'text-green-600' : 'text-slate-500'}`}>
                          <CheckIcon className={`w-3 h-3 ${passwordRequirements.number ? 'opacity-100' : 'opacity-30'}`} />
                          Number
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Repeat Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="repeat-password" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="repeat-password"
                      type={showRepeatPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className={`h-12 pr-12 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary ${
                        repeatPassword && !passwordsMatch ? 'border-red-300 focus:border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    >
                      {showRepeatPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {repeatPassword && !passwordsMatch && (
                    <p className="text-xs text-red-600">Passwords do not match</p>
                  )}
                  {repeatPassword && passwordsMatch && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckIcon className="w-3 h-3" />
                      Passwords match
                    </p>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Terms and Privacy */}
              <div className="text-xs text-slate-600 dark:text-slate-400 text-center">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-brand-blue hover:text-brand-purple underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-brand-blue hover:text-brand-purple underline">
                  Privacy Policy
                </Link>
              </div>

              {/* Sign Up Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-brand-gradient hover:opacity-90 text-white font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading || !isPasswordStrong || !passwordsMatch}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
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
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sign in to access your digital business cards
              </p>
              <Link
                href="/auth/login"
                className="inline-block mt-2 px-6 py-2 text-sm font-semibold text-brand-blue hover:text-brand-purple border-2 border-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

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
