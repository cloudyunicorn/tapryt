// lib/design-system.ts

export interface ThemeConfig {
  id: string;
  name: string;
  gradient: string;
  colors: [string, string]; // [primary, secondary]
  textColor: string;
  description?: string;
}

export interface FontConfig {
  id: string;
  name: string;
  className: string;
  fontFamily: string;
  category: 'sans-serif' | 'serif' | 'monospace';
}

export interface PatternConfig {
  id: string;
  name: string;
  cssProperties: React.CSSProperties;
  description?: string;
}

export interface ShapeConfig {
  id: string;
  name: string;
  borderRadius: string;
  cssClass: string;
}

export interface LayoutConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  containerClass: string;
  contentClass: string;
  flexDirection: string;
}

// THEMES CONFIGURATION
export const THEMES: ThemeConfig[] = [
  {
    id: 'modern',
    name: 'Modern',
    gradient: 'from-blue-500 to-purple-600',
    colors: ['#3B82F6', '#8B5CF6'],
    textColor: '#FFFFFF',
    description: 'Clean and contemporary design with blue-purple gradient'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    gradient: 'from-slate-100 to-slate-300',
    colors: ['#F1F5F9', '#CBD5E1'],
    textColor: '#1F2937',
    description: 'Simple and clean with subtle gray tones'
  },
  {
    id: 'creative',
    name: 'Creative',
    gradient: 'from-pink-500 to-orange-500',
    colors: ['#EC4899', '#F97316'],
    textColor: '#FFFFFF',
    description: 'Bold and vibrant pink-orange combination'
  },
  {
    id: 'professional',
    name: 'Professional',
    gradient: 'from-slate-700 to-slate-900',
    colors: ['#374151', '#111827'],
    textColor: '#FFFFFF',
    description: 'Corporate and sophisticated dark theme'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    gradient: 'from-emerald-500 to-teal-600',
    colors: ['#10B981', '#0D9488'],
    textColor: '#FFFFFF',
    description: 'Sophisticated green-teal combination'
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    gradient: 'from-yellow-400 to-red-500',
    colors: ['#FACC15', '#EF4444'],
    textColor: '#FFFFFF',
    description: 'Energetic yellow-red gradient'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    gradient: 'from-cyan-400 to-blue-600',
    colors: ['#22D3EE', '#2563EB'],
    textColor: '#FFFFFF',
    description: 'Calming ocean-inspired blues'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    gradient: 'from-orange-400 to-pink-600',
    colors: ['#FB923C', '#DB2777'],
    textColor: '#FFFFFF',
    description: 'Warm sunset orange-pink blend'
  },
  {
    id: 'forest',
    name: 'Forest',
    gradient: 'from-green-600 to-emerald-800',
    colors: ['#16A34A', '#065F46'],
    textColor: '#FFFFFF',
    description: 'Natural forest green theme'
  },
  {
    id: 'royal',
    name: 'Royal',
    gradient: 'from-purple-700 to-indigo-800',
    colors: ['#7C3AED', '#3730A3'],
    textColor: '#FFFFFF',
    description: 'Luxurious purple-indigo combination'
  }
];

// FONTS CONFIGURATION
export const FONTS: FontConfig[] = [
  {
    id: 'inter',
    name: 'Inter',
    className: 'font-sans',
    fontFamily: 'Inter, sans-serif',
    category: 'sans-serif'
  },
  {
    id: 'roboto',
    name: 'Roboto',
    className: 'font-sans',
    fontFamily: 'Roboto, sans-serif',
    category: 'sans-serif'
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    className: 'font-serif',
    fontFamily: 'Playfair Display, serif',
    category: 'serif'
  },
  {
    id: 'poppins',
    name: 'Poppins',
    className: 'font-sans',
    fontFamily: 'Poppins, sans-serif',
    category: 'sans-serif'
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    className: 'font-sans',
    fontFamily: 'Montserrat, sans-serif',
    category: 'sans-serif'
  },
  {
    id: 'lora',
    name: 'Lora',
    className: 'font-serif',
    fontFamily: 'Lora, serif',
    category: 'serif'
  },
  {
    id: 'opensans',
    name: 'Open Sans',
    className: 'font-sans',
    fontFamily: 'Open Sans, sans-serif',
    category: 'sans-serif'
  },
  {
    id: 'sourcecodepro',
    name: 'Source Code Pro',
    className: 'font-mono',
    fontFamily: 'Source Code Pro, monospace',
    category: 'monospace'
  }
];

// BACKGROUND PATTERNS CONFIGURATION
export const BACKGROUND_PATTERNS: PatternConfig[] = [
  {
    id: 'none',
    name: 'None',
    cssProperties: {},
    description: 'Solid color background'
  },
  {
    id: 'dots',
    name: 'Dots',
    cssProperties: {
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
      backgroundSize: '20px 20px'
    },
    description: 'Subtle dot pattern overlay'
  },
  {
    id: 'grid',
    name: 'Grid',
    cssProperties: {
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    },
    description: 'Grid pattern overlay'
  },
  {
    id: 'waves',
    name: 'Waves',
    cssProperties: {
      backgroundImage: 'radial-gradient(ellipse at top, rgba(255,255,255,0.1), transparent 50%)',
      backgroundSize: '40px 40px'
    },
    description: 'Flowing wave pattern'
  },
  {
    id: 'diagonal',
    name: 'Diagonal Lines',
    cssProperties: {
      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
    },
    description: 'Diagonal stripe pattern'
  },
  {
    id: 'circles',
    name: 'Circles',
    cssProperties: {
      backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.1) 2px, transparent 2px)',
      backgroundSize: '40px 40px'
    },
    description: 'Circular pattern overlay'
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    cssProperties: {
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 2px, transparent 2px)',
      backgroundSize: '30px 30px'
    },
    description: 'Hexagonal pattern'
  }
];

// CARD SHAPES CONFIGURATION
export const CARD_SHAPES: ShapeConfig[] = [
  {
    id: 'rectangle',
    name: 'Rectangle',
    borderRadius: '8px',
    cssClass: 'rounded-lg'
  },
  {
    id: 'rounded',
    name: 'Rounded',
    borderRadius: '16px',
    cssClass: 'rounded-2xl'
  },
  {
    id: 'pill',
    name: 'Pill',
    borderRadius: '9999px',
    cssClass: 'rounded-full'
  },
  {
    id: 'sharp',
    name: 'Sharp',
    borderRadius: '0px',
    cssClass: 'rounded-none'
  },
  {
    id: 'subtle',
    name: 'Subtle Round',
    borderRadius: '12px',
    cssClass: 'rounded-xl'
  }
];

// LAYOUT CONFIGURATIONS
export const LAYOUTS: LayoutConfig[] = [
  {
    id: 'centered',
    name: 'Centered',
    icon: '◯',
    description: 'Traditional centered business card layout',
    containerClass: 'text-center',
    contentClass: 'items-center',
    flexDirection: 'flex-col'
  },
  {
    id: 'left-aligned',
    name: 'Left Aligned',
    icon: '◐',
    description: 'Modern left-aligned layout',
    containerClass: 'text-left',
    contentClass: 'items-start',
    flexDirection: 'flex-col'
  },
  {
    id: 'split',
    name: 'Split Layout',
    icon: '◑',
    description: 'Professional split design with photo on right',
    containerClass: 'flex justify-between items-center',
    contentClass: 'items-center',
    flexDirection: 'flex-row'
  },
  {
    id: 'minimal-center',
    name: 'Minimal Center',
    icon: '○',
    description: 'Clean minimal centered design',
    containerClass: 'text-center space-y-6',
    contentClass: 'items-center',
    flexDirection: 'flex-col'
  }
];

// DESIGN DEFAULTS
export const DESIGN_DEFAULTS = {
  theme: 'modern',
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  fontFamily: 'inter',
  fontSize: 16,
  borderRadius: 12,
  borderWidth: 0,
  borderColor: '#E5E7EB',
  shadowIntensity: 3,
  backgroundPattern: 'none',
  gradientDirection: 'to-r',
  cardShape: 'rounded',
  layout: 'centered'
};

// GRADIENT DIRECTIONS
export const GRADIENT_DIRECTIONS = [
  { value: 'to-r', label: 'Left to Right' },
  { value: 'to-l', label: 'Right to Left' },
  { value: 'to-t', label: 'Bottom to Top' },
  { value: 'to-b', label: 'Top to Bottom' },
  { value: 'to-br', label: 'Top-Left to Bottom-Right' },
  { value: 'to-bl', label: 'Top-Right to Bottom-Left' },
  { value: 'to-tr', label: 'Bottom-Left to Top-Right' },
  { value: 'to-tl', label: 'Bottom-Right to Top-Left' }
];

// SHADOW LEVELS
export const SHADOW_LEVELS = [
  'shadow-none',    // 0
  'shadow-sm',      // 1
  'shadow',         // 2
  'shadow-md',      // 3
  'shadow-lg',      // 4
  'shadow-xl',      // 5
  'shadow-2xl',     // 6
  'drop-shadow-lg', // 7
  'drop-shadow-xl', // 8
  'drop-shadow-2xl', // 9
  'drop-shadow-2xl filter blur-[1px]' // 10
];

// UTILITY FUNCTIONS
export const getThemeById = (id: string): ThemeConfig | undefined => {
  return THEMES.find(theme => theme.id === id);
};

export const getFontById = (id: string): FontConfig | undefined => {
  return FONTS.find(font => font.id === id);
};

export const getPatternById = (id: string): PatternConfig | undefined => {
  return BACKGROUND_PATTERNS.find(pattern => pattern.id === id);
};

export const getShapeById = (id: string): ShapeConfig | undefined => {
  return CARD_SHAPES.find(shape => shape.id === id);
};

export const getLayoutById = (id: string): LayoutConfig | undefined => {
  return LAYOUTS.find(layout => layout.id === id);
};

export const getShadowClass = (intensity: number): string => {
  return SHADOW_LEVELS[Math.min(Math.max(intensity, 0), SHADOW_LEVELS.length - 1)] || 'shadow-md';
};

// THEME STYLE GENERATOR
// export const generateThemeStyles = (
//   theme: ThemeConfig,
//   primaryColor?: string,
//   secondaryColor?: string,
//   gradientDirection: string = 'to-r'
// ): React.CSSProperties => {
//   const primary = primaryColor || theme.colors[0];
//   const secondary = secondaryColor || theme.colors[1];
  
//   return {
//     // ✅ Use individual properties instead of shorthand
//     backgroundColor: primary, // Fallback solid color
//     backgroundImage: `linear-gradient(${gradientDirection}, ${primary}, ${secondary})`,
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'center',
//     backgroundSize: 'cover',
//     color: theme.textColor
//   };
// };
