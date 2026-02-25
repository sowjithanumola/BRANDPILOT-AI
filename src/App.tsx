import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import BrandWizard from './components/BrandWizard';
import Dashboard from './components/Dashboard';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from('brand_profiles')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .then(({ data }) => setHasProfile(!!data && data.length > 0));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (hasProfile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black p-4">
        <div className="max-w-4xl mx-auto pt-12 text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Let's build your brand.</h1>
          <p className="text-zinc-500">Answer a few questions and our AI will generate a complete 90-day growth strategy.</p>
        </div>
        <BrandWizard onComplete={() => setHasProfile(true)} />
      </div>
    );
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
