'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createCard } from '@/lib/actions/card.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  UserIcon,
  BuildingOfficeIcon,
  PaintBrushIcon,
  ShareIcon,
  MapPinIcon,
  EyeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { LiveCardPreview } from './live-card-preview';

export function CreateCardForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Consolidated form state - this will preserve data across tab switches
  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    jobTitle: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    bio: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    facebook: '',
    github: '',
    theme: 'modern',
    isPublic: true,
  });

  // Preview data based on actual form values or placeholders
  const previewData = {
    title: formData.title || 'My Business Card',
    fullName: formData.fullName || 'Your Name',
    jobTitle: formData.jobTitle || 'Your Job Title',
    company: formData.company || 'Your Company',
    email: formData.email || 'your.email@example.com',
    phone: formData.phone || '+1 (555) 123-4567',
    theme: formData.theme,
  };

  // Handle form field changes
  const handleInputChange = (field: string, value: string | boolean) => {
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

      // Create FormData from state
      const submitFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value.toString());
      });

      const result = await createCard(submitFormData);

      if (result.success) {
        router.push(`/cards/${result.data.slug}`);
        router.refresh();
      } else {
        setError(result.error || 'Failed to create card');
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          Create Your
          <span className="text-brand-gradient"> Digital Card</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Fill in your professional information to create a stunning digital
          business card that represents you perfectly.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
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
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2"
                >
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
                        onChange={(e) =>
                          handleInputChange('title', e.target.value)
                        }
                      />
                      <p className="text-xs text-slate-500">
                        This will be used in your card URL
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
                          onChange={(e) =>
                            handleInputChange('fullName', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          name="jobTitle"
                          placeholder="Senior Developer"
                          value={formData.jobTitle}
                          onChange={(e) =>
                            handleInputChange('jobTitle', e.target.value)
                          }
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
                        onChange={(e) =>
                          handleInputChange('company', e.target.value)
                        }
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
                          onChange={(e) =>
                            handleInputChange('email', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange('phone', e.target.value)
                          }
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
                        onChange={(e) =>
                          handleInputChange('website', e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="123 Main St, City, State, Country"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange('address', e.target.value)
                        }
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
                        onChange={(e) =>
                          handleInputChange('bio', e.target.value)
                        }
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
                          onChange={(e) =>
                            handleInputChange('linkedin', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter Profile</Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          placeholder="https://twitter.com/yourusername"
                          value={formData.twitter}
                          onChange={(e) =>
                            handleInputChange('twitter', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram Profile</Label>
                        <Input
                          id="instagram"
                          name="instagram"
                          placeholder="https://instagram.com/yourusername"
                          value={formData.instagram}
                          onChange={(e) =>
                            handleInputChange('instagram', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook Profile</Label>
                        <Input
                          id="facebook"
                          name="facebook"
                          placeholder="https://facebook.com/yourprofile"
                          value={formData.facebook}
                          onChange={(e) =>
                            handleInputChange('facebook', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub Profile</Label>
                        <Input
                          id="github"
                          name="github"
                          placeholder="https://github.com/yourusername"
                          value={formData.github}
                          onChange={(e) =>
                            handleInputChange('github', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Design Tab */}
              <TabsContent value="design" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PaintBrushIcon className="w-5 h-5" />
                      Card Theme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Choose Theme</Label>
                      <select
                        id="theme"
                        name="theme"
                        className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                        value={formData.theme}
                        onChange={(e) =>
                          handleInputChange('theme', e.target.value)
                        }
                      >
                        <option value="modern">Modern</option>
                        <option value="minimal">Minimal</option>
                        <option value="creative">Creative</option>
                        <option value="professional">Professional</option>
                        <option value="elegant">Elegant</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {/* Theme Preview Cards */}
                      {[
                        'modern',
                        'minimal',
                        'creative',
                        'professional',
                        'elegant',
                      ].map((theme) => (
                        <label key={theme} className="cursor-pointer">
                          <input
                            type="radio"
                            name="themeRadio"
                            value={theme}
                            checked={formData.theme === theme}
                            onChange={(e) =>
                              handleInputChange('theme', e.target.value)
                            }
                            className="sr-only peer"
                          />
                          <div className="p-4 border-2 border-slate-200 peer-checked:border-primary rounded-lg transition-colors">
                            <div
                              className={`h-20 rounded ${
                                theme === 'modern'
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                                  : theme === 'minimal'
                                  ? 'bg-slate-100 border border-slate-300'
                                  : theme === 'creative'
                                  ? 'bg-gradient-to-r from-pink-500 to-orange-500'
                                  : theme === 'professional'
                                  ? 'bg-slate-800'
                                  : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                              }`}
                            ></div>
                            <p className="text-xs text-center mt-2 capitalize">
                              {theme}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
                      <h4 className="font-semibold mb-2">Card URL Preview</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                        tapryt.com/cards/[random-secure-url]
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Your card will have a unique, secure URL for sharing
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-brand-gradient hover:opacity-90 text-white font-semibold text-base"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Creating Your Card...
                </div>
              ) : (
                'Create Digital Card'
              )}
            </Button>
          </form>
        </div>

        {/* Live Preview Section - Now using the separated component */}
        <div className="lg:sticky lg:top-6">
          <LiveCardPreview formData={formData} />
        </div>
      </div>
    </div>
  );
}
