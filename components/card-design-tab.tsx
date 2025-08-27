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
  getThemeById,
  type ThemeConfig
} from "@/lib/design-system";

interface DesignData {
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  shadowIntensity: number;
  backgroundPattern: string;
  gradientDirection: string;
  cardShape: string;
  layout: string;
}

interface CardDesignTabProps {
  designData: DesignData;
  onDesignChange: (field: string, value: string | number) => void;
}

export function CardDesignTab({ designData, onDesignChange }: CardDesignTabProps) {
  // Apply theme handler
  const applyTheme = (e: React.MouseEvent, theme: ThemeConfig) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎨 Applying theme:', theme.id);
    onDesignChange('theme', theme.id);
    onDesignChange('primaryColor', theme.colors[0]);
    onDesignChange('secondaryColor', theme.colors[1]);
    onDesignChange('gradientDirection', 'to-r');
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

          {/* Themes Tab */}
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
                    <div className={`h-12 rounded-md bg-gradient-to-r ${theme.gradient} mb-2`} />
                    <p className="text-xs font-medium">{theme.name}</p>
                    {theme.description && (
                      <p className="text-xs text-slate-500 mt-1">{theme.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={designData.primaryColor}
                    onChange={(e) => onDesignChange('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <input
                    type="text"
                    value={designData.primaryColor}
                    onChange={(e) => onDesignChange('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded text-sm font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={designData.secondaryColor}
                    onChange={(e) => onDesignChange('secondaryColor', e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <input
                    type="text"
                    value={designData.secondaryColor}
                    onChange={(e) => onDesignChange('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gradient Direction</Label>
              <select
                value={designData.gradientDirection}
                onChange={(e) => onDesignChange('gradientDirection', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {GRADIENT_DIRECTIONS.map((direction) => (
                  <option key={direction.value} value={direction.value}>
                    {direction.label}
                  </option>
                ))}
              </select>
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
                    <div className="h-8 w-full bg-slate-100 mb-1 rounded" />
                    <p className="font-medium">{pattern.name}</p>
                    {pattern.description && (
                      <p className="text-xs text-slate-500 mt-1">{pattern.description}</p>
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
                    <p className="text-xs text-slate-500 mt-1">{layout.description}</p>
                  </div>
                ))}
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
