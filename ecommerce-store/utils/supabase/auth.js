import { createClient } from './client';

export const getUser = async () => {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting user session:', error);
    return null;
  }
  
  return session?.user || null;
};

export const signIn = async (email, password) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const signUp = async (email, password) => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  return true;
};

export const updateSession = async () => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    await supabase.auth.refreshSession();
  }
  
  return session;
};