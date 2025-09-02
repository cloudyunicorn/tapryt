// app/cards/[slug]/edit/page.tsx
import { redirect, notFound } from "next/navigation";
import { EditCardForm } from "@/components/edit-card-form";
import { Header } from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import { getCardBySlug } from "@/lib/actions/card.actions";

interface EditCardPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditCardPage({ params }: EditCardPageProps) {
  const { slug } = await params;
  
  // Check authentication
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  // ✅ Use the getCardBySlug action to fetch complete card data
  const result = await getCardBySlug(slug, false); // Don't track view for edit page

  if (!result.success) {
    if (result.error === 'Card not found') {
      notFound();
    } else {
      throw new Error(result.error);
    }
  }

  const card = result.data;

  // Check ownership
  if (card.ownerId !== user.id) {
    redirect('/cards');
  }

  // ✅ Prepare complete form data with saved design properties
  const initialFormData = {
    // Basic info
    id: card.id,
    title: card.title || '',
    fullName: card.fullName || '',
    jobTitle: card.jobTitle || '',
    company: card.company || '',
    email: card.email || '',
    phone: card.phone || '',
    website: card.website || '',
    address: card.address || '',
    bio: card.bio || '',
    isPublic: card.isPublic ?? true,

    // ✅ Design properties from database with fallbacks
    theme: card.theme || 'modern',
    primaryColor: card.primaryColor || '#3B82F6',
    secondaryColor: card.secondaryColor || '#8B5CF6',
    backgroundColor: card.backgroundColor || '#FFFFFF',
    textColor: card.textColor || '#1F2937',
    fontFamily: card.fontFamily || 'inter',
    fontSize: card.fontSize || 16,
    borderRadius: card.borderRadius || 12,
    borderWidth: card.borderWidth || 0,
    borderColor: card.borderColor || '#E5E7EB',
    shadowIntensity: card.shadowIntensity || 3,
    backgroundPattern: card.backgroundPattern || 'none',
    gradientDirection: card.gradientDirection || 'to-r',
    cardShape: card.cardShape || 'rounded',
    layout: card.layout || 'centered',

    // Social links
    socialLinks: card.socialLinks || [],

    slug: slug
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl"></div>
      </div>

      <Header user={user} />

      <div className="relative z-10">
        {/* ✅ Pass complete initial form data including design properties */}
        <EditCardForm card={initialFormData} />
      </div>
    </div>
  );
}
