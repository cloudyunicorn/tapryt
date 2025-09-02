import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserCards } from "@/lib/actions/card.actions";
import { MyCardsContent } from "@/components/my-cards-content";
import { Header } from "@/components/header";

export const metadata = {
  title: 'My Digital Business Cards | TapRyt',
  description: 'View and manage all your digital business cards in one place.',
};

export default async function MyCardsPage() {
  // Check authentication
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  // Fetch user's cards
  const cardsResult = await getUserCards(user.id);
  const cards = cardsResult.success ? cardsResult.data : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl"></div>
      </div>

      <Header user={user} />

      <div className="relative z-10">
        <MyCardsContent cards={cards} user={user} />
      </div>
    </div>
  );
}
