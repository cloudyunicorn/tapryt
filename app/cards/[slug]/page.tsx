import { createClient } from "@/lib/supabase/server";
import { getCardBySlug } from "@/lib/actions/card.actions";
import { notFound } from "next/navigation";
import { CardViewer } from "@/components/card-viewer";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  // AWAIT params before accessing its properties
  const { slug } = await params;
  const cardResult = await getCardBySlug(slug, false); // Don't track view for metadata
  
  if (!cardResult.success || !cardResult.data) {
    return {
      title: 'Card Not Found - TapRyt',
      description: 'This digital business card could not be found.',
    };
  }

  const card = cardResult.data;

  return {
    title: `${card.fullName} - Digital Business Card | TapRyt`,
    description: card.bio || `View ${card.fullName}'s digital business card. ${card.jobTitle ? `${card.jobTitle} at ${card.company || 'their company'}.` : ''}`,
    openGraph: {
      title: `${card.fullName}'s Digital Business Card`,
      description: card.bio || `Connect with ${card.fullName}${card.jobTitle ? `, ${card.jobTitle}` : ''}`,
      type: 'profile',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/cards/${card.slug}`,
      images: card.profileImage ? [card.profileImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${card.fullName}'s Digital Business Card`,
      description: card.bio || `Connect with ${card.fullName}`,
      images: card.profileImage ? [card.profileImage] : undefined,
    },
  };
}

export default async function CardViewPage({ params }: PageProps) {
  // AWAIT params before accessing its properties
  const { slug } = await params;
  
  // Create Supabase client (works for both authenticated and anonymous users)
  const supabase = await createClient();
  
  // Get user information (will be null for anonymous users)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // Get the card - this should work for anonymous users viewing public cards
  const cardResult = await getCardBySlug(slug, true);
  
  if (!cardResult.success || !cardResult.data) {
    notFound();
  }

  const card = cardResult.data;
  const isOwner = user?.id === card.ownerId;

  // Allow access if:
  // 1. Card is public (anyone can view, including anonymous users)
  // 2. User is the owner (even if card is private)
  if (!card.isPublic && !isOwner) {
    notFound();
  }

  return <CardViewer card={card} isOwner={isOwner} user={user} />;
}
