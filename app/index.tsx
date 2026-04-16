// ----- Updated as of Iteration 8 : Seed Data & Profile -----
// log out buttons weren't working and delete account button wasn't redirecting to log in screen
// register.tsx replaced index.tsx and uses its content
// index.tsx redirects to login.tsx


import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { user } = useAuth();
  return <Redirect href={user ? '/(tabs)' : '/login'} />;
}