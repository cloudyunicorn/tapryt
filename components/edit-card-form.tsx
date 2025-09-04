'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // ✅ Sonner toast
import { updateCard } from '@/lib/actions/card.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  UserIcon,
  ShareIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { LiveCardPreview } from './live-card-preview';
import { CardDesignTab } from './card-design-tab';
import Link from 'next/link';
import { SaveIcon } from "lucide-react";

interface EditCardFormProps {
  card: any; // Your card type
}

export function EditCardForm({ card }: EditCardFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // ✅ FIXED: Extract social links from socialLinks array
  const getSocialLinkUrl = (type: string) => {
    return card.socialLinks?.find((link: any) => link.type === type)?.url || '';
  };

  // Consolidated form state with card data pre-populated
  const [formData, setFormData] = useState({
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
    linkedin: getSocialLinkUrl('linkedin'),
    twitter: getSocialLinkUrl('twitter'),
    instagram: getSocialLinkUrl('instagram'),
    facebook: getSocialLinkUrl('facebook'),
    github: getSocialLinkUrl('github'),
    isPublic: card.isPublic ?? true,

    // Design properties
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
  });

  // Handle ALL state changes (both form and design)
  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      setError(null);
      
      // ✅ Show loading toast
      const toastId = toast.loading('Saving changes...');

      try {
        // Create FormData from state
        const submitFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          submitFormData.append(key, value.toString());
        });

        const result = await updateCard(card.slug, submitFormData);

        if (result.success) {
          // ✅ Dismiss loading and show success
          toast.dismiss(toastId);
          toast.success('Card updated successfully!', {
            description: 'Your changes have been saved.',
            action: {
              label: 'View Card',
              onClick: () => router.push(`/cards/${result.data.slug}`),
            },
          });
          
          // Navigate to card view
          router.push(`/cards/${result.data.slug}`);
          router.refresh();
        } else {
          // ✅ Show error toast
          toast.dismiss(toastId);
          toast.error('Failed to update card', {
            description: result.error || 'Please try again.',
          });
          setError(result.error || 'Failed to update card');
        }
      } catch (error) {
        // ✅ Show error toast
        toast.dismiss(toastId);
        toast.error('Something went wrong', {
          description: 'Please try again later.',
        });
        setError('An unexpected error occurred');
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/cards/${card.slug}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Card
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            Edit <span className="text-brand-gradient">{card.title}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href={`/cards/${card.slug}`}>
            <Button variant="outline" size="sm">
              <EyeIcon className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Badge variant={card.isPublic ? 'default' : 'secondary'}>
            {card.isPublic ? 'Public' : 'Private'}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: Form with ALL tabs including Design */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              {/* ALL FOUR TABS including Design */}
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-2">
                  <ShareIcon className="w-4 h-4" />
                  Social
                </TabsTrigger>
                <TabsTrigger value="design" className="flex items-center gap-2">
                  <PaintBrushIcon className="w-4 h-4" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <GlobeAltIcon className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5" />
                      Card Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Card Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="My Professional Card"
                        required
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                      <p className="text-xs text-slate-500">
                        For internal reference only
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="John Doe"
                          required
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          name="jobTitle"
                          placeholder="Senior Developer"
                          value={formData.jobTitle}
                          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Tech Solutions Inc."
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        placeholder="https://yourwebsite.com"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="123 Main St, City, State, Country"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Brief description about yourself..."
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Social Links Tab */}
              <TabsContent value="social" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShareIcon className="w-5 h-5" />
                      Social Media Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={formData.linkedin}
                          onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter Profile</Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          placeholder="https://twitter.com/yourusername"
                          value={formData.twitter}
                          onChange={(e) => handleInputChange('twitter', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram Profile</Label>
                        <Input
                          id="instagram"
                          name="instagram"
                          placeholder="https://instagram.com/yourusername"
                          value={formData.instagram}
                          onChange={(e) => handleInputChange('instagram', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook Profile</Label>
                        <Input
                          id="facebook"
                          name="facebook"
                          placeholder="https://facebook.com/yourprofile"
                          value={formData.facebook}
                          onChange={(e) => handleInputChange('facebook', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub Profile</Label>
                        <Input
                          id="github"
                          name="github"
                          placeholder="https://github.com/yourusername"
                          value={formData.github}
                          onChange={(e) => handleInputChange('github', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* DESIGN TAB - INSIDE THE FORM BUT WITH SAFE EVENT HANDLING */}
              <TabsContent value="design" className="space-y-4">
                <CardDesignTab
                  designData={formData}
                  onDesignChange={handleInputChange}
                />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GlobeAltIcon className="w-5 h-5" />
                      Privacy & Sharing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="isPublic">Public Card</Label>
                        <p className="text-sm text-slate-500">
                          Allow your card to be discovered and shared publicly
                        </p>
                      </div>
                      <Switch
                        id="isPublic"
                        name="isPublic"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) =>
                          handleInputChange('isPublic', checked)
                        }
                      />
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Current Card URL</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                        tapryt.com/cards/{card.slug}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Your card's unique, secure URL for sharing
                      </p>
                    </div>

                    {/* Card Statistics */}
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Card Statistics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Total Views</p>
                          <p className="font-semibold">{card._count?.analytics || 0}</p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Created</p>
                          <p className="font-semibold">
                            {new Date(card.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 h-12 bg-brand-gradient hover:opacity-90 text-white font-semibold text-base"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Saving Changes...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <SaveIcon className="w-4 h-4" />
                    Save Changes
                  </div>
                )}
              </Button>
              <Link href={`/cards/${card.slug}`}>
                <Button variant="outline" className="px-6">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Live Preview */}
        <div className="lg:sticky lg:top-6">
          <LiveCardPreview formData={formData} />
        </div>
      </div>
    </div>
  );
}
