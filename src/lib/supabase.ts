import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  // @ts-ignore
  const envUrl = import.meta.env.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : undefined);
  // @ts-ignore
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : undefined);

  // Fallback to the credentials you provided if environment variables are missing
  const url = envUrl || "https://xzaditwkgrlhmrgmnmji.supabase.co";
  const key = envKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6YWRpdHdrZ3JsaG1yZ21ubWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTQ5ODcsImV4cCI6MjA4NzU3MDk4N30.c1xnVs5ysASVAaBxMWsNBVk5W-bhk7qK2Lgi0ylmWV8";

  if (!url || !key) {
    console.error('Supabase URL or Anon Key is missing.');
  }

  return { url, key };
};

const { url, key } = getSupabaseConfig();

export const supabase = createClient(url, key);
