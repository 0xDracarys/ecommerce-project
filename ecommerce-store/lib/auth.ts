/**
 * Authentication utility functions
 */

import { 
  SignUpFormData, 
  SignInFormData, 
  ResetPasswordFormData,
  NewPasswordFormData,
  ProfileFormData,
  AddressFormData,
  AuthResponse,
  AuthUser,
  SessionData
} from '@/types/auth';

// API endpoint base
const API_BASE = '/api/auth';

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpFormData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { 
        user: null, 
        error: result.error || 'An error occurred during sign up'
      };
    }

    return result;
  } catch (error) {
    console.error('Sign up error:', error);
    return { 
      user: null, 
      error: 'An unexpected error occurred'
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInFormData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { 
        user: null, 
        error: result.error || 'Invalid email or password'
      };
    }

    return result;
  } catch (error) {
    console.error('Sign in error:', error);
    return { 
      user: null, 
      error: 'An unexpected error occurred'
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch(`${API_BASE}/session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const session: SessionData = await response.json();
    return session.user || null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Send password reset email
 */
export async function requestPasswordReset(data: ResetPasswordFormData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { 
        user: null, 
        error: result.error || 'Failed to send password reset email'
      };
    }

    return { 
      user: null, 
      message: 'Password reset email sent'
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { 
      user: null, 
      error: 'An unexpected error occurred'
    };
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(data: NewPasswordFormData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE}/reset-password/${data.token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        password: data.password, 
        confirmPassword: data.confirmPassword 
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { 
        user: null, 
        error: result.error || 'Failed to reset password'
      };
    }

    return { 
      user: null, 
      message: 'Password has been reset successfully'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return { 
      user: null, 
      error: 'An unexpected error occurred'
    };
  }
}

/**
 * Update user profile
 */
export async function updateProfile(data: ProfileFormData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { 
        user: null, 
        error: result.error || 'Failed to update profile'
      };
    }

    return result;
  } catch (error) {
    console.error('Profile update error:', error);
    return { 
      user: null, 
      error: 'An unexpected error occurred'
    };
  }
}

/**
 * Add a new address
 */
export async function addAddress(data: AddressFormData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { 
        user: null, 
        error: result.error || 'Failed to add address'
      };
    }

    return result;
  } catch (error) {
    console.error('Add address error:', error);
    return { 
      user: null, 
      error: 'An unexpected error occurred'
    };
  }
}

/**
 * Update an existing address
 */
export async function updateAddress(id: string, data: AddressFormData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE}/addresses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { 
        user: null, 
        error: result.error || 'Failed to update address'
      };
    }

    return result;
  } catch (error) {
    console.error('Update address error:', error);
    return { 
      user: null, 
      error: 'An unexpected error occurred'
    };
  }
}

/**
 * Delete an address
 */
export async function deleteAddress(id: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE}/addresses/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { 
        user: null, 
        error: result.error || 'Failed to delete address'
      };
    }

    return result;
  } catch (error) {
    console.error('Delete address error:', error);
    return { 
      user: null, 
      error: 'An unexpected error occurred'
    };
  }
}

