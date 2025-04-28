/**
 * Authentication-related TypeScript types
 */

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  image?: string;
}

export interface AddressFormData {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: 'ADMIN' | 'CUSTOMER';
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error?: string;
  message?: string;
}

export interface SessionData {
  user: AuthUser;
  expires: string;
}

