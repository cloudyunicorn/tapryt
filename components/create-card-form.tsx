"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCard } from "@/lib/actions/card.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  PaintBrushIcon,
  ShareIcon,
  MapPinIcon,
  EyeIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";

export function CreateCardForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState({
    title: "My Business Card",
    fullName: "Your Name",
    jobTitle: "Your Job Title",
    company: "Your Company",
    email: "your.email@example.com",
    phone: "+1 (555) 123-4567",
    theme: "modern"
  });

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      setError(null);
      
      const result = await createCard(formData);
      
      if (result.success) {
        router.push(`/cards/${result.data.slug}`);
        router.refresh();
      } else {
        setError(result.error || "Failed to create card");
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setPreviewData(prev => ({
      ...prev,
      [field]: value || `Your ${field.charAt(0).toUpperCase() + field.slice(1)}`
    }));
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
          Fill in your professional information to create a stunning digital business card that represents you perfectly.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <form action={handleSubmit} className="space-y-6">
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
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                      <p className="text-xs text-slate-500">This will be used in your card URL</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="John Doe"
                          required
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          name="jobTitle"
                          placeholder="Senior Developer"
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
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+1 (555) 123-4567"
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="123 Main St, City, State, Country"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Brief description about yourself..."
                        rows={3}
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
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter Profile</Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          placeholder="https://twitter.com/yourusername"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram Profile</Label>
                        <Input
                          id="instagram"
                          name="instagram"
                          placeholder="https://instagram.com/yourusername"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook Profile</Label>
                        <Input
                          id="facebook"
                          name="facebook"
                          placeholder="https://facebook.com/yourprofile"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub Profile</Label>
                        <Input
                          id="github"
                          name="github"
                          placeholder="https://github.com/yourusername"
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
                        defaultValue="modern"
                        onChange={(e) => handleInputChange('theme', e.target.value)}
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
                      {['modern', 'minimal', 'creative', 'professional', 'elegant'].map((theme) => (
                        <label key={theme} className="cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            value={theme}
                            defaultChecked={theme === 'modern'}
                            className="sr-only peer"
                          />
                          <div className="p-4 border-2 border-slate-200 peer-checked:border-primary rounded-lg transition-colors">
                            <div className={`h-20 rounded ${
                              theme === 'modern' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                              theme === 'minimal' ? 'bg-slate-100 border border-slate-300' :
                              theme === 'creative' ? 'bg-gradient-to-r from-pink-500 to-orange-500' :
                              theme === 'professional' ? 'bg-slate-800' :
                              'bg-gradient-to-r from-emerald-500 to-teal-600'
                            }`}></div>
                            <p className="text-xs text-center mt-2 capitalize">{theme}</p>
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
                        <p className="text-sm text-slate-500">Allow your card to be discovered and shared publicly</p>
                      </div>
                      <Switch id="isPublic" name="isPublic" defaultChecked />
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Card URL Preview</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                        tapryt.com/card/{previewData.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                      </p>
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
                "Create Digital Card"
              )}
            </Button>
          </form>
        </div>

        {/* Live Preview Section */}
        <div className="lg:sticky lg:top-6">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EyeIcon className="w-5 h-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-6 rounded-xl shadow-lg ${
                previewData.theme === 'modern' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' :
                previewData.theme === 'minimal' ? 'bg-white text-slate-900 border border-slate-200' :
                previewData.theme === 'creative' ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' :
                previewData.theme === 'professional' ? 'bg-slate-800 text-white' :
                'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
              }`}>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <UserIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold">{previewData.fullName}</h3>
                    <p className="text-sm opacity-80">{previewData.jobTitle}</p>
                    <p className="text-sm opacity-60">{previewData.company}</p>
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <p className="text-sm">{previewData.email}</p>
                    <p className="text-sm">{previewData.phone}</p>
                  </div>
                  
                  <div className="flex justify-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
