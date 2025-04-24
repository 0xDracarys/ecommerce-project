'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/utils/supabase/auth';
import { createClient } from '@/utils/supabase/client';
import Container from '@/components/ui/container';
import Button from '@/components/ui/button';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/auth/login');
          return;
        }
        
        // Fetch additional user profile data from your API if needed
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // If no extended profile, use Supabase user
          setUser({
            name: user.user_metadata?.full_name || 'User',
            email: user.email,
            image: user.user_metadata?.avatar_url
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-t-4 border-purple-500 rounded-full animate-spin"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {user?.image ? (
                <img 
                  src={user.image} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="font-medium">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex gap-2">
                      <span className="font-medium">Phone:</span>
                      <span>{user?.phone}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <span className="font-medium">Member since:</span>
                    <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              {user?.address && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                  <p className="text-gray-600">
                    {user.address}
                  </p>
                </div>
              )}
              
              <div className="flex gap-4">
                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                  Edit Profile
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  My Orders
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
} 