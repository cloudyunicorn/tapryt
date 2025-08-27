"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, UserIcon } from "@heroicons/react/24/outline";

// Import design system
import {
  getThemeById,
  getFontById,
  getPatternById,
  getShapeById,
  getLayoutById,
  getShadowClass,
  DESIGN_DEFAULTS
} from "@/lib/design-system";

interface CardFormData {
  title: string;
  fullName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  theme: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  shadowIntensity?: number;
  backgroundPattern?: string;
  gradientDirection?: string;
  cardShape?: string;
  layout?: string;
}

interface LiveCardPreviewProps {
  formData: CardFormData;
  className?: string;
}

export function LiveCardPreview({ formData, className = "" }: LiveCardPreviewProps) {
  if (!formData) {
    return (
      <Card className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EyeIcon className="w-5 h-5" />
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            style={{
              backgroundColor: '#3B82F6',
              backgroundImage: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
              padding: '1.5rem',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Your Name</h3>
              <p className="text-sm opacity-80">Your Job Title</p>
              <p className="text-sm opacity-60">Your Company</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get design configurations
  const themeConfig = getThemeById(formData.theme) || getThemeById(DESIGN_DEFAULTS.theme)!;
  const fontConfig = getFontById(formData.fontFamily || DESIGN_DEFAULTS.fontFamily);
  const patternConfig = getPatternById(formData.backgroundPattern || DESIGN_DEFAULTS.backgroundPattern);
  const shapeConfig = getShapeById(formData.cardShape || DESIGN_DEFAULTS.cardShape);
  const layoutConfig = getLayoutById(formData.layout || DESIGN_DEFAULTS.layout);

  // Preview data with fallbacks
  const previewData = {
    title: formData.title || "My Business Card",
    fullName: formData.fullName || "Your Name",
    jobTitle: formData.jobTitle || "Your Job Title",
    company: formData.company || "Your Company",
    email: formData.email || "your.email@example.com",
    phone: formData.phone || "+1 (555) 123-4567",
    fontSize: formData.fontSize || DESIGN_DEFAULTS.fontSize,
    shadowIntensity: formData.shadowIntensity || DESIGN_DEFAULTS.shadowIntensity,
  };

  // ✅ FIXED: Proper gradient direction conversion
  const getGradientDirection = (direction: string): string => {
    const directionMap: { [key: string]: string } = {
      'to-r': 'to right',
      'to-l': 'to left',
      'to-t': 'to top',
      'to-b': 'to bottom',
      'to-br': 'to bottom right',
      'to-bl': 'to bottom left',
      'to-tr': 'to top right',
      'to-tl': 'to top left'
    };
    return directionMap[direction] || 'to right';
  };

  // Extract colors and direction
  const primaryColor = formData.primaryColor || themeConfig.colors[0];
  const secondaryColor = formData.secondaryColor || themeConfig.colors[1];
  const gradientDirection = getGradientDirection(formData.gradientDirection || 'to-r');
  
  // ✅ FIXED: Create proper gradient background
  let backgroundImages: string[] = [];
  
  // Add pattern first (if selected)
  if (formData.backgroundPattern && formData.backgroundPattern !== 'none' && patternConfig?.cssProperties.backgroundImage) {
    backgroundImages.push(patternConfig.cssProperties.backgroundImage as string);
  }
  
  // Add gradient (always)
  backgroundImages.push(`linear-gradient(${gradientDirection}, ${primaryColor}, ${secondaryColor})`);

  // ✅ WORKING: Create comprehensive card styles
  const cardStyles: React.CSSProperties = {
    // Background properties
    backgroundColor: primaryColor, // Fallback
    backgroundImage: backgroundImages.join(', '), // Layer patterns over gradient
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    
    // Border properties
    borderRadius: `${formData.borderRadius || DESIGN_DEFAULTS.borderRadius}px`,
    borderWidth: `${formData.borderWidth || DESIGN_DEFAULTS.borderWidth}px`,
    borderColor: formData.borderColor || DESIGN_DEFAULTS.borderColor,
    borderStyle: (formData.borderWidth || 0) > 0 ? 'solid' : 'none',
    
    // Text properties
    color: formData.textColor || themeConfig.textColor,
    fontSize: `${previewData.fontSize}px`,
    fontFamily: fontConfig?.fontFamily || 'Inter, sans-serif',
    
    // Layout properties
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    minHeight: '200px',
    width: '100%',
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
        <div 
          className={`${getShadowClass(previewData.shadowIntensity)} ${fontConfig?.className || 'font-sans'} transition-all duration-300`}
          style={cardStyles}
        >
          <div className={`relative z-10 space-y-4 ${layoutConfig?.containerClass || 'text-center'}`}>
            {formData.layout === "split" ? (
              // Split layout
              <div className="flex items-center justify-between">
                <div className="text-left flex-1">
                  <h3 
                    className="font-bold mb-1" 
                    style={{ fontSize: `${previewData.fontSize + 6}px` }}
                  >
                    {previewData.fullName}
                  </h3>
                  <p 
                    className="opacity-80 mb-1" 
                    style={{ fontSize: `${previewData.fontSize}px` }}
                  >
                    {previewData.jobTitle}
                  </p>
                  <p 
                    className="opacity-60 mb-2" 
                    style={{ fontSize: `${previewData.fontSize - 2}px` }}
                  >
                    {previewData.company}
                  </p>
                  <div className="space-y-1">
                    <p 
                      className="opacity-80" 
                      style={{ fontSize: `${previewData.fontSize - 4}px` }}
                    >
                      {previewData.email}
                    </p>
                    <p 
                      className="opacity-80" 
                      style={{ fontSize: `${previewData.fontSize - 4}px` }}
                    >
                      {previewData.phone}
                    </p>
                  </div>
                </div>
                <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center ml-4">
                  <UserIcon className="w-6 h-6" />
                </div>
              </div>
            ) : (
              // Other layouts
              <div className="space-y-4">
                <div className={layoutConfig?.containerClass || 'text-center'}>
                  <div className={`w-20 h-20 bg-black/20 rounded-full mb-4 flex items-center justify-center ${
                    formData.layout === "left-aligned" ? "mx-0" : "mx-auto"
                  }`}>
                    <UserIcon className="w-8 h-8" />
                  </div>
                  <h3 
                    className="font-bold" 
                    style={{ fontSize: `${previewData.fontSize + 6}px` }}
                  >
                    {previewData.fullName}
                  </h3>
                  <p 
                    className="opacity-80" 
                    style={{ fontSize: `${previewData.fontSize}px` }}
                  >
                    {previewData.jobTitle}
                  </p>
                  <p 
                    className="opacity-60" 
                    style={{ fontSize: `${previewData.fontSize - 2}px` }}
                  >
                    {previewData.company}
                  </p>
                </div>
                
                <div className={`space-y-2 ${layoutConfig?.containerClass || 'text-center'}`}>
                  <p style={{ fontSize: `${previewData.fontSize - 2}px` }}>
                    {previewData.email}
                  </p>
                  <p style={{ fontSize: `${previewData.fontSize - 2}px` }}>
                    {previewData.phone}
                  </p>
                </div>
                
                <div className={`flex gap-2 ${formData.layout === "left-aligned" ? "justify-start" : "justify-center"}`}>
                  <div className="w-8 h-8 bg-black/20 rounded-full"></div>
                  <div className="w-8 h-8 bg-black/20 rounded-full"></div>
                  <div className="w-8 h-8 bg-black/20 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Design info with gradient preview */}
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
            Current Design
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div>Theme: <span className="font-mono">{themeConfig.name}</span></div>
            <div>Font: <span className="font-mono">{fontConfig?.name || 'Inter'}</span></div>
            <div>Layout: <span className="font-mono">{layoutConfig?.name || 'Centered'}</span></div>
            <div>Shape: <span className="font-mono">{shapeConfig?.name || 'Rounded'}</span></div>
            <div>Size: <span className="font-mono">{previewData.fontSize}px</span></div>
            <div>Gradient: <span className="font-mono">{gradientDirection}</span></div>
          </div>
          
          {/* Gradient preview strip */}
          <div className="flex items-center gap-2 mt-2">
            <div 
              className="h-4 flex-1 rounded border border-white/30" 
              style={{ 
                backgroundImage: `linear-gradient(${gradientDirection}, ${primaryColor}, ${secondaryColor})` 
              }}
              title="Current Gradient"
            />
            <span className="text-xs text-slate-500">Gradient Preview</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div 
              className="w-4 h-4 rounded border border-white/30" 
              style={{ backgroundColor: primaryColor }}
              title="Primary Color"
            />
            <div 
              className="w-4 h-4 rounded border border-white/30" 
              style={{ backgroundColor: secondaryColor }}
              title="Secondary Color"
            />
            <span className="text-xs text-slate-500 ml-2">Colors</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
