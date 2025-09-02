// app/create-card/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreateCardForm } from "@/components/create-card-form";
import { Header } from "@/components/header";

export default async function CreateCardPage() {
  // Check authentication
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl"></div>
      </div>

      <Header user={user} />

      <div className="relative z-10">
        <CreateCardForm />
      </div>
    </div>
  );
}
