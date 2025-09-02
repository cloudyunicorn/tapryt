'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QRCodeDisplay } from '@/components/qr-code-display';
import {
  ArrowLeftIcon,
  ShareIcon,
  QrCodeIcon,
  PencilIcon,
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  UserIcon,
  BuildingOfficeIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// ✅ Import design system utilities
import {
  getThemeById,
  getFontById,
  getLayoutById,
  getShadowClass,
  DESIGN_DEFAULTS
} from '@/lib/design-system';

interface SocialLink {
  id: string;
  type: string;
  url: string;
}

interface CardData {
  id: string;
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
  qrCodeUrl?: string;
  qrCodeData?: string;
  slug: string;
  theme?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  socialLinks: SocialLink[];
  owner: {
    name: string | null;
    image: string | null;
  };
  _count?: {
    analytics: number;
  };
}

interface CardViewerProps {
  card: CardData;
  isOwner: boolean;
  user?: any;
}

export function CardViewer({ card, isOwner, user }: CardViewerProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // ✅ Get theme configuration from design system
  const themeConfig = getThemeById(card.theme || DESIGN_DEFAULTS.theme) || getThemeById(DESIGN_DEFAULTS.theme)!;
  const fontConfig = getFontById(DESIGN_DEFAULTS.fontFamily);
  const layoutConfig = getLayoutById(DESIGN_DEFAULTS.layout);

  // ✅ Create comprehensive card styles using design system
  const getCardStyles = (): React.CSSProperties => {
    const primaryColor = themeConfig.colors[0];
    const secondaryColor = themeConfig.colors[1];

    return {
      // Use inline gradient instead of Tailwind classes
      backgroundImage: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`,
      backgroundColor: primaryColor, // Fallback
      color: themeConfig.textColor,
      fontFamily: fontConfig?.fontFamily || 'Inter, sans-serif',
      padding: '2rem',
      borderRadius: '12px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    };
  };

  // ✅ Get accent styles for interactive elements
  const getAccentStyles = (): React.CSSProperties => {
    // Create semi-transparent background based on text color
    const isLightText = themeConfig.textColor === '#FFFFFF';
    return {
      backgroundColor: isLightText ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    };
  };

  const getSocialIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      linkedin: '💼',
      twitter: '🐦',
      instagram: '📸',
      facebook: '👥',
      github: '💻',
      youtube: '📺',
      tiktok: '🎵',
      snapchat: '👻',
    };
    return iconMap[type.toLowerCase()] || '🔗';
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(`Failed to copy ${label}:`, error);
    }
  };

  const shareCard = async () => {
    const shareUrl = `${window.location.origin}/cards/${card.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.fullName}'s Digital Business Card`,
          text: `Check out ${card.fullName}'s digital business card`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard(shareUrl, 'card URL');
      }
    } else {
      copyToClipboard(shareUrl, 'card URL');
    }
  };

  const saveContact = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${card.fullName}
${card.jobTitle ? `TITLE:${card.jobTitle}` : ''}
${card.company ? `ORG:${card.company}` : ''}
${card.email ? `EMAIL:${card.email}` : ''}
${card.phone ? `TEL:${card.phone}` : ''}
${card.website ? `URL:${card.website}` : ''}
${card.address ? `ADR:;;${card.address};;;` : ''}
${card.bio ? `NOTE:${card.bio}` : ''}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.fullName.replace(/\s+/g, '_')}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const cardStyles = getCardStyles();
  const accentStyles = getAccentStyles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-end">
          {isOwner && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-primary/5"
              >
                <ChartBarIcon className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Link href={`/cards/${card.slug}/edit`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-primary/5"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Card Display */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Digital Card - Takes 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">
                <span className="text-brand-gradient">{card.fullName}'s</span>{' '}
                Digital Card
              </h1>
              <Badge variant={card.isPublic ? 'default' : 'secondary'}>
                {card.isPublic ? 'Public' : 'Private'}
              </Badge>
            </div>

            {/* ✅ Main Card with design system styles */}
            <div
              className="shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
              style={cardStyles}
            >
              <div className="space-y-6 text-center">
                {/* Profile Image */}
                <div className="flex justify-center">
                  <div 
                    className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center"
                    style={accentStyles}
                  >
                    {card.profileImage ? (
                      <img
                        src={card.profileImage}
                        alt={card.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-16 h-16 opacity-70" />
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold" style={{ color: themeConfig.textColor }}>
                    {card.fullName}
                  </h1>
                  {card.jobTitle && (
                    <div className="flex items-center justify-center gap-2">
                      <BuildingOfficeIcon className="w-5 h-5 opacity-80" />
                      <p className="text-xl opacity-90">{card.jobTitle}</p>
                    </div>
                  )}
                  {card.company && (
                    <p className="text-lg opacity-80">{card.company}</p>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  {card.email && (
                    <div className="flex items-center justify-center gap-3 p-3 rounded-lg" style={accentStyles}>
                      <EnvelopeIcon className="w-5 h-5 opacity-80" />
                      <a
                        href={`mailto:${card.email}`}
                        className="hover:underline transition-colors"
                        style={{ color: themeConfig.textColor }}
                      >
                        {card.email}
                      </a>
                    </div>
                  )}
                  {card.phone && (
                    <div className="flex items-center justify-center gap-3 p-3 rounded-lg" style={accentStyles}>
                      <PhoneIcon className="w-5 h-5 opacity-80" />
                      <a
                        href={`tel:${card.phone}`}
                        className="hover:underline transition-colors"
                        style={{ color: themeConfig.textColor }}
                      >
                        {card.phone}
                      </a>
                    </div>
                  )}
                  {card.website && (
                    <div className="flex items-center justify-center gap-3 p-3 rounded-lg" style={accentStyles}>
                      <GlobeAltIcon className="w-5 h-5 opacity-80" />
                      <a
                        href={card.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline transition-colors"
                        style={{ color: themeConfig.textColor }}
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  {card.address && (
                    <div className="flex items-center justify-center gap-3 p-3 rounded-lg" style={accentStyles}>
                      <MapPinIcon className="w-5 h-5 opacity-80" />
                      <span className="text-center" style={{ color: themeConfig.textColor }}>
                        {card.address}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {card.bio && (
                  <div className="p-4 rounded-lg" style={accentStyles}>
                    <p className="opacity-90 leading-relaxed text-center" style={{ color: themeConfig.textColor }}>
                      {card.bio}
                    </p>
                  </div>
                )}

                {/* Social Links */}
                {card.socialLinks && card.socialLinks.length > 0 && (
                  <div className="pt-4">
                    <p className="text-sm opacity-80 mb-4" style={{ color: themeConfig.textColor }}>
                      Connect with me:
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                      {card.socialLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                          style={accentStyles}
                          title={`${link.type} - ${link.url}`}
                        >
                          <span className="text-xl">
                            {getSocialIcon(link.type)}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions & Info Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={shareCard}
                  className="w-full bg-brand-gradient hover:opacity-90"
                >
                  <ShareIcon className="w-5 h-5 mr-2" />
                  Share Card
                </Button>

                <Button
                  onClick={saveContact}
                  variant="outline"
                  className="w-full border-primary hover:bg-primary/5"
                >
                  <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
                  Save Contact
                </Button>

                <Button
                  onClick={() => setShowQR(!showQR)}
                  variant="outline"
                  className="w-full border-primary hover:bg-primary/5"
                >
                  <QrCodeIcon className="w-5 h-5 mr-2" />
                  {showQR ? 'Hide' : 'Show'} QR Code
                </Button>
              </CardContent>
            </Card>

            {/* QR Code Display */}
            {card.qrCodeData ? (
              <QRCodeDisplay
                qrCodeData={card.qrCodeData}
                cardUrl={
                  card.qrCodeUrl ||
                  `${
                    typeof window !== 'undefined' ? window.location.origin : ''
                  }/cards/${card.slug}`
                }
                cardTitle={card.title}
                isOwner={isOwner}
              />
            ) : (
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <QrCodeIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    QR code not generated
                  </p>
                  {isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      Regenerate QR Code
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ✅ Enhanced Card Information */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Card Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Theme
                  </span>
                  <Badge className="bg-brand-gradient text-white">
                    {themeConfig.name}
                  </Badge>
                </div>

                {/* ✅ Show theme colors */}
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Colors
                  </span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border-2 border-white shadow-sm" 
                      style={{ backgroundColor: themeConfig.colors[0] }}
                      title="Primary Color"
                    />
                    <div 
                      className="w-4 h-4 rounded border-2 border-white shadow-sm" 
                      style={{ backgroundColor: themeConfig.colors[1] }}
                      title="Secondary Color"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Created
                  </span>
                  <span className="text-sm font-medium">
                    {format(new Date(card.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">
                    Social Links
                  </span>
                  <span className="text-sm font-medium">
                    {card.socialLinks?.length || 0}
                  </span>
                </div>

                {isOwner && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Total Views
                    </span>
                    <span className="text-sm font-medium">
                      {card._count?.analytics || 0}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Owner Info (if not owner) */}
            {!isOwner && (
              <Card className="bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 border-brand-blue/20">
                <CardHeader>
                  <CardTitle className="text-brand-gradient">
                    About this Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    This digital business card belongs to {card.fullName}. You
                    can save their contact information or share this card with
                    others.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Copy Status */}
            {copied && (
              <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                Copied to clipboard!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
