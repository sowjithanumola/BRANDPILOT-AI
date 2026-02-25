import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Loader2, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      if (isLogin) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (authError) throw authError;
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      if (err.message === 'Failed to fetch') {
        setError('Connection failed. Please check your internet or Supabase configuration.');
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800"
      >
        <div className="flex items-center gap-2 font-bold text-2xl mb-8 justify-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">B</div>
          BrandPilot AI
        </div>

        <h2 className="text-xl font-bold mb-2 text-center">{isLogin ? 'Welcome Back' : 'Create Your Account'}</h2>
        <p className="text-zinc-500 text-sm text-center mb-8">
          {isLogin ? 'Sign in to manage your brand growth' : 'Start your personal brand journey today'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input name="name" type="text" required className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none focus:ring-2 ring-indigo-500" placeholder="Ravit" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5">Email Address</label>
            <input name="email" type="email" required className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none focus:ring-2 ring-indigo-500" placeholder="ravit@gmail.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input name="password" type="password" required className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none focus:ring-2 ring-indigo-500" placeholder="••••••••" />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button 
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-indigo-600 font-medium hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
