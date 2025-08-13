"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Import the correct transaction type
import type { PrismaClient } from '@prisma/client';

// Create the correct transaction type
type PrismaTransaction = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>;

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
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  let counter = 0;
  let finalSlug = slug;
  
  while (await prisma.card.findUnique({ where: { slug: finalSlug } })) {
    counter++;
    finalSlug = `${slug}-${counter}`;
  }
  
  return finalSlug;
}

export async function createCard(formData: FormData): Promise<ActionResult> {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: "Authentication required"
      };
    }

    // Ensure user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      // Create user if doesn't exist
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          image: user.user_metadata?.avatar_url,
        }
      });
    }

    // Extract form data
    const cardData = {
      title: formData.get("title") as string,
      fullName: formData.get("fullName") as string,
      jobTitle: formData.get("jobTitle") as string || undefined,
      company: formData.get("company") as string || undefined,
      phone: formData.get("phone") as string || undefined,
      email: formData.get("email") as string || undefined,
      website: formData.get("website") as string || undefined,
      address: formData.get("address") as string || undefined,
      bio: formData.get("bio") as string || undefined,
      theme: formData.get("theme") as string || "modern",
      isPublic: formData.get("isPublic") !== "false",
    };

    // Validate required fields
    if (!cardData.title?.trim()) {
      return {
        success: false,
        error: "Card title is required"
      };
    }

    if (!cardData.fullName?.trim()) {
      return {
        success: false,
        error: "Full name is required"
      };
    }

    // Generate unique slug from title
    const slug = await generateUniqueSlug(cardData.title);

    // Extract social links
    const socialLinks: { type: string; url: string }[] = [];
    const socialTypes = ['linkedin', 'twitter', 'instagram', 'facebook', 'github'];
    
    socialTypes.forEach(type => {
      const url = formData.get(type) as string;
      if (url?.trim()) {
        socialLinks.push({ type, url: url.trim() });
      }
    });

    // Create card with social links in a transaction - WITH CORRECT TYPING
    const result = await prisma.$transaction(async (tx: PrismaTransaction) => {
      // Create the card
      const card = await tx.card.create({
        data: {
          title: cardData.title,
          fullName: cardData.fullName,
          jobTitle: cardData.jobTitle,
          company: cardData.company,
          phone: cardData.phone,
          email: cardData.email,
          website: cardData.website,
          address: cardData.address,
          bio: cardData.bio,
          theme: cardData.theme,
          isPublic: cardData.isPublic,
          slug: slug,
          ownerId: user.id,
        },
      });

      // Create social links if any
      if (socialLinks.length > 0) {
        await tx.socialLink.createMany({
          data: socialLinks.map(link => ({
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
    revalidatePath("/dashboard");
    revalidatePath("/cards");

    return {
      success: true,
      data: { 
        cardId: result.id,
        slug: result.slug 
      }
    };

  } catch (error) {
    console.error("Error creating card:", error);
    return {
      success: false,
      error: "Failed to create card. Please try again."
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
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      success: true,
      data: cards
    };
  } catch (error) {
    console.error("Error fetching cards:", error);
    return {
      success: false,
      error: "Failed to fetch cards"
    };
  }
}

export async function getCardBySlug(slug: string, trackView: boolean = true): Promise<ActionResult> {
  try {
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
          }
        }
      }
    });

    if (!card) {
      return {
        success: false,
        error: "Card not found"
      };
    }

    // Track view if requested
    if (trackView) {
      await prisma.cardAnalytics.create({
        data: {
          cardId: card.id,
          eventType: 'card_viewed',
        }
      });
    }

    return {
      success: true,
      data: card
    };
  } catch (error) {
    console.error("Error fetching card:", error);
    return {
      success: false,
      error: "Failed to fetch card"
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
        createdAt: 'desc'
      },
      take: 100
    });

    // Calculate summary stats with proper typing
    const totalViews = analytics.filter(a => a.eventType === 'card_viewed').length;
    const totalShares = analytics.filter(a => a.eventType === 'card_shared').length;
    const totalContacts = analytics.filter(a => a.eventType === 'contact_saved').length;

    return {
      success: true,
      data: {
        analytics,
        summary: {
          totalViews,
          totalShares,
          totalContacts
        }
      }
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      success: false,
      error: "Failed to fetch analytics"
    };
  }
}
