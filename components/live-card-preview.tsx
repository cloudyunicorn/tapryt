"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, UserIcon } from "@heroicons/react/24/outline";

interface CardFormData {
  title: string;
  fullName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  theme: string;
}

interface LiveCardPreviewProps {
  formData: CardFormData;
  className?: string;
}

export function LiveCardPreview({ formData, className = "" }: LiveCardPreviewProps) {
  // Preview data with fallbacks
  const previewData = {
    title: formData.title || "My Business Card",
    fullName: formData.fullName || "Your Name",
    jobTitle: formData.jobTitle || "Your Job Title",
    company: formData.company || "Your Company",
    email: formData.email || "your.email@example.com",
    phone: formData.phone || "+1 (555) 123-4567",
    theme: formData.theme || "modern"
  };

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'modern':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white';
      case 'minimal':
        return 'bg-white text-slate-900 border border-slate-200';
      case 'creative':
        return 'bg-gradient-to-r from-pink-500 to-orange-500 text-white';
      case 'professional':
        return 'bg-slate-800 text-white';
      case 'elegant':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white';
      default:
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white';
    }
  };

  return (
    <Card className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <EyeIcon className="w-5 h-5" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`p-6 rounded-xl shadow-lg ${getThemeStyles(previewData.theme)}`}>
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
  );
}
