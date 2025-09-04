// lib/types.ts - Centralized Type Definitions

// ============================================================================
// IMPORTS
// ============================================================================

import { User, Card, SocialLink, CardAnalytics, Subscription } from './generated/prisma';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { ReactNode } from 'react';

// ============================================================================
// DATABASE MODELS (Prisma Types Re-exports)
// ============================================================================

export type { User, Card, SocialLink, CardAnalytics, Subscription };

// ============================================================================
// AUTH TYPES (Supabase Types Re-exports)
// ============================================================================

export type { SupabaseUser, Session };

// Additional Auth-related types
export interface AuthUser extends SupabaseUser {
  // Extended auth user if needed
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PasswordResetData {
  email: string;
}

// ============================================================================
// CARD TYPES
// ============================================================================

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

export interface CardWithRelations extends Card {
  socialLinks: SocialLink[];
  owner: {
    name: string | null;
    image: string | null;
  };
  _count?: {
    analytics: number;
  };
}

export interface CardFormData extends CardData {
  id?: string;
  slug?: string;
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
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
}

// ============================================================================
// DESIGN TYPES
// ============================================================================

export interface DesignTheme {
  name: string;
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

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
}

export interface TypographySettings {
  fontFamily: string;
  fontSize: number;
  fontWeight?: string;
  lineHeight?: number;
}

export interface LayoutSettings {
  cardShape: 'rounded' | 'square' | 'pill';
  layout: 'centered' | 'left' | 'right';
  padding: number;
  margin: number;
}

export interface ShadowSettings {
  intensity: number;
  color?: string;
  blur?: number;
  spread?: number;
}

// ============================================================================
// UI TYPES
// ============================================================================

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================================
// ACTIONS TYPES
// ============================================================================

export interface ActionResult<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface CreateCardResult {
  cardId: string;
  slug: string;
}

export interface UpdateCardResult {
  id: string;
  slug: string;
  updatedAt: Date;
}

export interface CardAnalyticsSummary {
  totalViews: number;
  totalShares: number;
  totalContacts: number;
}

export interface CardAnalyticsResult {
  analytics: CardAnalytics[];
  summary: CardAnalyticsSummary;
}

// ============================================================================
// PAGE PROPS TYPES
// ============================================================================

export interface PageProps {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
}

export interface CardPageProps extends PageProps {
  params: {
    slug: string;
  };
}

export interface DashboardPageProps extends PageProps {
  // Dashboard specific props
}

export interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type SocialPlatform = 'linkedin' | 'twitter' | 'instagram' | 'facebook' | 'github';

export interface SocialLinkData {
  type: SocialPlatform;
  url: string;
}

export interface QRCodeOptions {
  foreground?: string;
  background?: string;
  size?: number;
  margin?: number;
}

export interface FileUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps extends FormFieldProps {
  options: SelectOption[];
  multiple?: boolean;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
}

// ============================================================================
// THEME TYPES
// ============================================================================

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: Record<string, string>;
  typography: Record<string, any>;
  breakpoints: Record<string, string>;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export type AnalyticsEventType = 'card_viewed' | 'card_shared' | 'contact_saved' | 'card_created';

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  cardId: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

// ============================================================================
// SUBSCRIPTION TYPES
// ============================================================================

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    cards: number;
    analytics: boolean;
    customDomain: boolean;
  };
}

export interface SubscriptionStatus {
  plan: SubscriptionPlan;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}