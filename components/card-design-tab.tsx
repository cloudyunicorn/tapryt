"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SparklesIcon, PaintBrushIcon } from "@heroicons/react/24/outline";

// Import design system
import {
  THEMES,
  FONTS,
  BACKGROUND_PATTERNS,
  CARD_SHAPES,
  LAYOUTS,
  GRADIENT_DIRECTIONS,
  DESIGN_DEFAULTS,
  type ThemeConfig
} from "@/lib/design-system";

// ✅ Import centralized types
import { CardFormData } from "@/lib/types";

interface CardDesignTabProps {
  designData: CardFormData;
  onDesignChange: (field: string, value: string | number) => void;
}

export function CardDesignTab({ designData, onDesignChange }: CardDesignTabProps) {
  // Apply theme handler
  const applyTheme = (e: React.MouseEvent, theme: ThemeConfig) => {
    e.preventDefault();
    e.stopPropagation();
    onDesignChange('theme', theme.id);
    onDesignChange('primaryColor', theme.colors[0]);
    onDesignChange('secondaryColor', theme.colors[1]);
    onDesignChange('gradientDirection', 'to-r');
    // Reset text color to auto-adaptive when theme changes
    onDesignChange('textColor', '');
  };

  // ✅ Helper function to create gradient style from theme
  const getThemeGradientStyle = (theme: ThemeConfig): React.CSSProperties => {
    return {
      backgroundImage: `linear-gradient(to right, ${theme.colors[0]}, ${theme.colors[1]})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    };
  };

  const handlePatternClick = (e: React.MouseEvent, patternId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDesignChange('backgroundPattern', patternId);
  };

  const handleFontClick = (e: React.MouseEvent, fontId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDesignChange('fontFamily', fontId);
  };

  const handleShapeClick = (e: React.MouseEvent, shapeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDesignChange('cardShape', shapeId);
  };

  const handleLayoutClick = (e: React.MouseEvent, layoutId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDesignChange('layout', layoutId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PaintBrushIcon className="w-5 h-5" />
          Card Design Studio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="themes" className="text-xs">Themes</TabsTrigger>
            <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
            <TabsTrigger value="typography" className="text-xs">Fonts</TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
            <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
          </TabsList>

          {/* Themes Tab - FIXED with inline styles */}
          <TabsContent value="themes" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((theme) => (
                <div key={theme.id} className="space-y-2">
                  <div
                    onClick={(e) => applyTheme(e, theme)}
                    className={`cursor-pointer w-full p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      designData.theme === theme.id 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* ✅ FIXED: Use inline styles instead of Tailwind gradient classes */}
                    <div 
                      className="h-12 rounded-md mb-2"
                      style={getThemeGradientStyle(theme)}
                    />
                    <p className="text-xs font-medium">{theme.name}</p>
                    {theme.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{theme.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-2">
                💡 Theme Tip
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Themes automatically set background colors and gradients. Text color adapts automatically for readability, or you can customize it in the Colors tab.
              </p>
            </div>
          </TabsContent>

          {/* Colors Tab - Updated with Text Color */}
          <TabsContent value="colors" className="space-y-4">
            {/* Text Color Control */}
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={designData.textColor || '#000000'}
                  onChange={(e) => onDesignChange('textColor', e.target.value)}
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={designData.textColor || ''}
                  onChange={(e) => onDesignChange('textColor', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded text-sm font-mono"
                  placeholder="Auto (Adaptive)"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDesignChange('textColor', '');
                  }}
                  className="px-3 py-2 text-xs"
                >
                  Auto
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Leave empty for automatic text color based on background. Click "Auto" to reset.
              </p>
            </div>

            <div className="border-t pt-4">
              <Label>Gradient Direction</Label>
              <select
                value={designData.gradientDirection}
                onChange={(e) => onDesignChange('gradientDirection', e.target.value)}
                className="w-full mt-2 p-2 border rounded-lg"
              >
                {GRADIENT_DIRECTIONS.map((direction) => (
                  <option key={direction.value} value={direction.value}>
                    {direction.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Controls the direction of the background gradient.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Background Pattern</Label>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUND_PATTERNS.map((pattern) => (
                  <div
                    key={pattern.id}
                    onClick={(e) => handlePatternClick(e, pattern.id)}
                    className={`cursor-pointer p-3 border-2 rounded-lg text-xs transition-all ${
                      designData.backgroundPattern === pattern.id
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* ✅ FIXED: Enhanced pattern previews with actual patterns */}
                    <div className="h-8 w-full bg-slate-100 mb-1 rounded relative overflow-hidden">
                      {pattern.id === 'dots' && (
                        <div className="absolute inset-0 opacity-60" style={{
                          backgroundImage: 'radial-gradient(circle at 2px 2px, #666 1px, transparent 0)',
                          backgroundSize: '8px 8px'
                        }} />
                      )}
                      {pattern.id === 'grid' && (
                        <div className="absolute inset-0 opacity-60" style={{
                          backgroundImage: 'linear-gradient(#666 1px, transparent 1px), linear-gradient(90deg, #666 1px, transparent 1px)',
                          backgroundSize: '8px 8px'
                        }} />
                      )}
                      {pattern.id === 'diagonal' && (
                        <div className="absolute inset-0 opacity-60" style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, #666 4px, #666 8px)'
                        }} />
                      )}
                      {pattern.id === 'waves' && (
                        <div className="absolute inset-0 opacity-40" style={{
                          backgroundImage: 'radial-gradient(ellipse at top, #666, transparent 50%)',
                          backgroundSize: '12px 12px'
                        }} />
                      )}
                      {pattern.id === 'circles' && (
                        <div className="absolute inset-0 opacity-60" style={{
                          backgroundImage: 'radial-gradient(circle at 4px 4px, #666 1px, transparent 1px)',
                          backgroundSize: '12px 12px'
                        }} />
                      )}
                    </div>
                    <p className="font-medium">{pattern.name}</p>
                    {pattern.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{pattern.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-4">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <div className="grid grid-cols-1 gap-2">
                {FONTS.map((font) => (
                  <div
                    key={font.id}
                    onClick={(e) => handleFontClick(e, font.id)}
                    className={`cursor-pointer p-3 border-2 rounded-lg text-left transition-all ${
                      designData.fontFamily === font.id
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-200 hover:border-slate-300'
                    } ${font.className}`}
                  >
                    <div className="text-sm font-medium">{font.name}</div>
                    <div className="text-xs text-slate-500">The quick brown fox jumps</div>
                    <div className="text-xs text-slate-400 mt-1">{font.category}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Font Size: {designData.fontSize}px</Label>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={designData.fontSize}
                onChange={(e) => onDesignChange('fontSize', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>12px (Small)</span>
                <span>18px (Default)</span>
                <span>24px (Large)</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="text-xs font-semibold text-green-800 dark:text-green-200 mb-2">
                📝 Typography Tip
              </h4>
              <p className="text-xs text-green-700 dark:text-green-300">
                Professional business cards typically use 14-18px font sizes. Sans-serif fonts like Inter and Poppins are great for digital cards.
              </p>
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-2">
              <Label>Card Shape</Label>
              <div className="grid grid-cols-2 gap-2">
                {CARD_SHAPES.map((shape) => (
                  <div
                    key={shape.id}
                    onClick={(e) => handleShapeClick(e, shape.id)}
                    className={`cursor-pointer p-3 border-2 transition-all text-xs rounded-lg ${
                      designData.cardShape === shape.id
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div 
                      className="h-8 bg-slate-200 mb-2" 
                      style={{ borderRadius: shape.borderRadius }}
                    />
                    {shape.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content Layout</Label>
              <div className="grid grid-cols-2 gap-2">
                {LAYOUTS.map((layout) => (
                  <div
                    key={layout.id}
                    onClick={(e) => handleLayoutClick(e, layout.id)}
                    className={`cursor-pointer p-3 border-2 rounded-lg transition-all text-xs ${
                      designData.layout === layout.id
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{layout.icon}</div>
                    <p className="font-medium">{layout.name}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{layout.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Border Radius: {designData.borderRadius}px</Label>
              <input
                type="range"
                min="0"
                max="50"
                step="2"
                value={designData.borderRadius}
                onChange={(e) => onDesignChange('borderRadius', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0px (Sharp)</span>
                <span>25px (Medium)</span>
                <span>50px (Very Round)</span>
              </div>
            </div>
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects" className="space-y-4">
            <div className="space-y-2">
              <Label>Shadow Intensity: {designData.shadowIntensity}</Label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={designData.shadowIntensity}
                onChange={(e) => onDesignChange('shadowIntensity', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0 (No Shadow)</span>
                <span>5 (Medium)</span>
                <span>10 (Strong Shadow)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Border Width: {designData.borderWidth}px</Label>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={designData.borderWidth}
                onChange={(e) => onDesignChange('borderWidth', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0px (No Border)</span>
                <span>4px (Medium)</span>
                <span>8px (Thick Border)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Border Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={designData.borderColor}
                  onChange={(e) => onDesignChange('borderColor', e.target.value)}
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={designData.borderColor}
                  onChange={(e) => onDesignChange('borderColor', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded text-sm font-mono"
                  placeholder="#E5E7EB"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  Object.entries(DESIGN_DEFAULTS).forEach(([key, value]) => {
                    onDesignChange(key, value);
                  });
                }}
                className="w-full"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>

            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-2">
                ✨ Effects Tip
              </h4>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Subtle effects work best for professional cards. Try a medium shadow (3-5) with no border for a clean, modern look.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
