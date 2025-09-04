'use server';

import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { generateQRCode, generateStyledQRCode } from '@/lib/utils/qrcode';
import { v4 as uuidv4 } from 'uuid';

// Import the correct transaction type
import type { PrismaClient } from '@prisma/client';

// Create the correct transaction type
type PrismaTransaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>;

export interface CardData {
  title: string;
  fullName: string;
  jobTitle?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  bio?: string;
  profileImage?: string;
  theme?: string;
  isPublic?: boolean;
  socialLinks?: { type: string; url: string }[];
}

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

// Generate unique slug for the card
async function generateUniqueSlug(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 5;
  
  while (attempts < maxAttempts) {
    const slug = uuidv4(); // Generates: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    
    const existing = await prisma.card.findUnique({ 
      where: { slug } 
    });
    
    if (!existing) {
      return slug;
    }
    
    attempts++;
  }
  
  // Fallback: add timestamp to ensure uniqueness
  return `${uuidv4()}-${Date.now()}`;
}

export async function createCard(formData: FormData): Promise<ActionResult> {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Ensure user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      // Create user if doesn't exist
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          image: user.user_metadata?.avatar_url,
        },
      });
    }

    // ✅ FIXED: Extract ALL form data including design properties
    const cardData = {
      // Basic information
      title: formData.get('title') as string,
      fullName: formData.get('fullName') as string,
      jobTitle: (formData.get('jobTitle') as string) || undefined,
      company: (formData.get('company') as string) || undefined,
      phone: (formData.get('phone') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      website: (formData.get('website') as string) || undefined,
      address: (formData.get('address') as string) || undefined,
      bio: (formData.get('bio') as string) || undefined,
      isPublic: formData.get('isPublic') !== 'false',

      // ✅ ADDED: Design properties
      theme: (formData.get('theme') as string) || 'modern',
      primaryColor: (formData.get('primaryColor') as string) || '#3B82F6',
      secondaryColor: (formData.get('secondaryColor') as string) || '#8B5CF6',
      backgroundColor: (formData.get('backgroundColor') as string) || '#FFFFFF',
      textColor: (formData.get('textColor') as string) || '#1F2937',
      fontFamily: (formData.get('fontFamily') as string) || 'inter',
      fontSize: parseInt((formData.get('fontSize') as string) || '16'),
      borderRadius: parseInt((formData.get('borderRadius') as string) || '12'),
      borderWidth: parseInt((formData.get('borderWidth') as string) || '0'),
      borderColor: (formData.get('borderColor') as string) || '#E5E7EB',
      shadowIntensity: parseInt((formData.get('shadowIntensity') as string) || '3'),
      backgroundPattern: (formData.get('backgroundPattern') as string) || 'none',
      gradientDirection: (formData.get('gradientDirection') as string) || 'to-r',
      cardShape: (formData.get('cardShape') as string) || 'rounded',
      layout: (formData.get('layout') as string) || 'centered',
    };

    // Validate required fields
    if (!cardData.title?.trim()) {
      return {
        success: false,
        error: 'Card title is required',
      };
    }

    if (!cardData.fullName?.trim()) {
      return {
        success: false,
        error: 'Full name is required',
      };
    }

    // Generate unique slug from title
    const slug = await generateUniqueSlug();

    // Generate card URL for QR code
    const cardUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || 'https://tapryt.vercel.app'
    }/cards/${slug}`;

    // Generate QR code
    const qrCodeData = await generateStyledQRCode(cardUrl, {
      foreground: cardData.primaryColor, // Use user's primary color
      background: cardData.backgroundColor, // Use user's background color
      size: 300,
    });

    // Extract social links
    const socialLinks: { type: string; url: string }[] = [];
    const socialTypes = [
      'linkedin',
      'twitter',
      'instagram',
      'facebook',
      'github',
    ];

    socialTypes.forEach((type) => {
      const url = formData.get(type) as string;
      if (url?.trim()) {
        socialLinks.push({ type, url: url.trim() });
      }
    });

    // Create card with social links in a transaction - WITH ALL DESIGN FIELDS
    const result = await prisma.$transaction(async (tx: PrismaTransaction) => {
      // Create the card with ALL fields including design properties
      const card = await tx.card.create({
        data: {
          // Basic information
          title: cardData.title,
          fullName: cardData.fullName,
          jobTitle: cardData.jobTitle,
          company: cardData.company,
          phone: cardData.phone,
          email: cardData.email,
          website: cardData.website,
          address: cardData.address,
          bio: cardData.bio,
          isPublic: cardData.isPublic,
          slug: slug,
          qrCodeUrl: cardUrl,
          qrCodeData: qrCodeData,
          ownerId: user.id,

          // ✅ ADDED: All design properties
          theme: cardData.theme,
          primaryColor: cardData.primaryColor,
          secondaryColor: cardData.secondaryColor,
          backgroundColor: cardData.backgroundColor,
          textColor: cardData.textColor,
          fontFamily: cardData.fontFamily,
          fontSize: cardData.fontSize,
          borderRadius: cardData.borderRadius,
          borderWidth: cardData.borderWidth,
          borderColor: cardData.borderColor,
          shadowIntensity: cardData.shadowIntensity,
          backgroundPattern: cardData.backgroundPattern,
          gradientDirection: cardData.gradientDirection,
          cardShape: cardData.cardShape,
          layout: cardData.layout,
        },
      });

      // Create social links if any
      if (socialLinks.length > 0) {
        await tx.socialLink.createMany({
          data: socialLinks.map((link) => ({
            type: link.type,
            url: link.url,
            cardId: card.id,
          })),
        });
      }

      // Create initial analytics entry for card creation
      await tx.cardAnalytics.create({
        data: {
          cardId: card.id,
          eventType: 'card_created',
        },
      });

      return card;
    });

    // Revalidate relevant pages
    revalidatePath('/dashboard');
    revalidatePath('/cards');

    return {
      success: true,
      data: {
        cardId: result.id,
        slug: result.slug,
      },
    };
  } catch (error) {
    console.error('Error creating card:', error);
    return {
      success: false,
      error: 'Failed to create card. Please try again.',
    };
  }
}


// Add function to regenerate QR code if needed
export async function regenerateQRCode(cardId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Get the card
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card || card.ownerId !== user.id) {
      return {
        success: false,
        error: 'Card not found or access denied',
      };
    }

    // Generate new QR code
    const cardUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || 'https://tapryt.com'
    }/cards/${card.slug}`;
    const qrCodeData = await generateStyledQRCode(cardUrl);

    // Update the card
    await prisma.card.update({
      where: { id: cardId },
      data: {
        qrCodeUrl: cardUrl,
        qrCodeData: qrCodeData,
      },
    });

    revalidatePath(`/cards/${card.slug}`);

    return {
      success: true,
      data: { qrCodeData },
    };
  } catch (error) {
    console.error('Error regenerating QR code:', error);
    return {
      success: false,
      error: 'Failed to regenerate QR code',
    };
  }
}

// Rest of your functions with proper typing
export async function getUserCards(userId: string): Promise<ActionResult> {
  try {
    const cards = await prisma.card.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        socialLinks: true,
        _count: {
          select: {
            analytics: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: cards,
    };
  } catch (error) {
    console.error('Error fetching cards:', error);
    return {
      success: false,
      error: 'Failed to fetch cards',
    };
  }
}

export async function getCardBySlug(
  slug: string,
  trackView: boolean = true
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const card = await prisma.card.findUnique({
      where: {
        slug: slug,
      },
      include: {
        socialLinks: true,
        owner: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!card) {
      return {
        success: false,
        error: 'Card not found',
      };
    }

    // Check access permissions
    const isOwner = user?.id === card.ownerId;
    const isPublic = card.isPublic;

    // Allow access if:
    // 1. Card is public (anyone can view)
    // 2. User owns the card
    if (!isPublic && !isOwner) {
      return {
        success: false,
        error: 'Card not found',
      };
    }

    // Track view for public cards or owner views
     if (trackView && isPublic) {
      try {
        await prisma.cardAnalytics.create({
          data: {
            cardId: card.id,
            eventType: 'card_viewed',
          },
        });
      } catch (error) {
        // Don't fail the request if analytics fails
        console.log('Failed to track view:', error);
      }
    }

    return {
      success: true,
      data: card,
    };
  } catch (error) {
    console.error('Error fetching card:', error);
    return {
      success: false,
      error: 'Failed to fetch card',
    };
  }
}

export async function getCardAnalytics(cardId: string): Promise<ActionResult> {
  try {
    const analytics = await prisma.cardAnalytics.findMany({
      where: {
        cardId: cardId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    // Calculate summary stats with proper typing
    const totalViews = analytics.filter(
      (a) => a.eventType === 'card_viewed'
    ).length;
    const totalShares = analytics.filter(
      (a) => a.eventType === 'card_shared'
    ).length;
    const totalContacts = analytics.filter(
      (a) => a.eventType === 'contact_saved'
    ).length;

    return {
      success: true,
      data: {
        analytics,
        summary: {
          totalViews,
          totalShares,
          totalContacts,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      success: false,
      error: 'Failed to fetch analytics',
    };
  }
}

// Add function to update card
// In your card.actions.ts file, update the updateCard function
export async function updateCard(slug: string, formData: FormData): Promise<ActionResult> {
  try {
    if (!slug) {
      return {
        success: false,
        error: 'Card slug is required',
      };
    }
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // ✅ Extract ALL form data including design properties
    const cardData = {
      // Basic information
      title: formData.get('title') as string,
      fullName: formData.get('fullName') as string,
      jobTitle: (formData.get('jobTitle') as string) || undefined,
      company: (formData.get('company') as string) || undefined,
      phone: (formData.get('phone') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      website: (formData.get('website') as string) || undefined,
      address: (formData.get('address') as string) || undefined,
      bio: (formData.get('bio') as string) || undefined,
      isPublic: formData.get('isPublic') === 'true',

      // ✅ FIXED: All design properties
      theme: (formData.get('theme') as string) || 'modern',
      primaryColor: (formData.get('primaryColor') as string) || '#3B82F6',
      secondaryColor: (formData.get('secondaryColor') as string) || '#8B5CF6',
      backgroundColor: (formData.get('backgroundColor') as string) || '#FFFFFF',
      textColor: (formData.get('textColor') as string) || '#1F2937',
      fontFamily: (formData.get('fontFamily') as string) || 'inter',
      fontSize: parseInt((formData.get('fontSize') as string) || '16'),
      borderRadius: parseInt((formData.get('borderRadius') as string) || '12'),
      borderWidth: parseInt((formData.get('borderWidth') as string) || '0'),
      borderColor: (formData.get('borderColor') as string) || '#E5E7EB',
      shadowIntensity: parseInt((formData.get('shadowIntensity') as string) || '3'),
      backgroundPattern: (formData.get('backgroundPattern') as string) || 'none',
      gradientDirection: (formData.get('gradientDirection') as string) || 'to-r',
      cardShape: (formData.get('cardShape') as string) || 'rounded',
      layout: (formData.get('layout') as string) || 'centered',
    };

    // Extract social links
    const socialLinks = [
      { type: 'linkedin', url: formData.get('linkedin') as string },
      { type: 'twitter', url: formData.get('twitter') as string },
      { type: 'instagram', url: formData.get('instagram') as string },
      { type: 'facebook', url: formData.get('facebook') as string },
      { type: 'github', url: formData.get('github') as string },
    ].filter(link => link.url?.trim());

    // ✅ Update card using Prisma transaction
    const result = await prisma.$transaction(async (tx: PrismaTransaction) => {
      // Update the card with ALL properties including design
      const updatedCard = await tx.card.update({
        where: {
          slug: slug,
          ownerId: user.id, // Ensure ownership
        },
        data: {
          // Basic information
          title: cardData.title,
          fullName: cardData.fullName,
          jobTitle: cardData.jobTitle,
          company: cardData.company,
          phone: cardData.phone,
          email: cardData.email,
          website: cardData.website,
          address: cardData.address,
          bio: cardData.bio,
          isPublic: cardData.isPublic,

          // ✅ FIXED: All design properties
          theme: cardData.theme,
          primaryColor: cardData.primaryColor,
          secondaryColor: cardData.secondaryColor,
          backgroundColor: cardData.backgroundColor,
          textColor: cardData.textColor,
          fontFamily: cardData.fontFamily,
          fontSize: cardData.fontSize,
          borderRadius: cardData.borderRadius,
          borderWidth: cardData.borderWidth,
          borderColor: cardData.borderColor,
          shadowIntensity: cardData.shadowIntensity,
          backgroundPattern: cardData.backgroundPattern,
          gradientDirection: cardData.gradientDirection,
          cardShape: cardData.cardShape,
          layout: cardData.layout,
          
          updatedAt: new Date(),
        },
      });

      // Delete existing social links
      await tx.socialLink.deleteMany({
        where: { cardId: updatedCard.id },
      });

      // Create new social links
      if (socialLinks.length > 0) {
        await tx.socialLink.createMany({
          data: socialLinks.map(link => ({
            cardId: updatedCard.id,
            type: link.type,
            url: link.url,
          })),
        });
      }

      return updatedCard;
    });

    // Revalidate pages
    revalidatePath(`/cards/${slug}`);
    revalidatePath(`/cards/${slug}/edit`);
    revalidatePath('/cards');

    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating card:', error);
    return { success: false, error: 'Failed to update card' };
  }
}


// Add function to delete card
export async function deleteCard(cardId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Get the card to verify ownership
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card || card.ownerId !== user.id) {
      return {
        success: false,
        error: 'Card not found or access denied',
      };
    }

    // Delete card and related data in a transaction
    await prisma.$transaction(async (tx: PrismaTransaction) => {
      // Delete social links
      await tx.socialLink.deleteMany({
        where: { cardId: cardId },
      });

      // Delete analytics
      await tx.cardAnalytics.deleteMany({
        where: { cardId: cardId },
      });

      // Delete the card
      await tx.card.delete({
        where: { id: cardId },
      });
    });

    // Revalidate relevant pages
    revalidatePath('/dashboard');
    revalidatePath('/cards');

    return {
      success: true,
      data: { message: 'Card deleted successfully' },
    };
  } catch (error) {
    console.error('Error deleting card:', error);
    return {
      success: false,
      error: 'Failed to delete card. Please try again.',
    };
  }
}

// Add function to get card for editing
export async function getCardForEdit(cardId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        socialLinks: true,
      },
    });

    if (!card || card.ownerId !== user.id) {
      return {
        success: false,
        error: 'Card not found or access denied',
      };
    }

    return {
      success: true,
      data: card,
    };
  } catch (error) {
    console.error('Error fetching card for edit:', error);
    return {
      success: false,
      error: 'Failed to fetch card',
    };
  }
}
