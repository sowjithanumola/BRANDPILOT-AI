import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { generateBrandStrategy } from '../services/geminiService';
import { Loader2, ChevronRight, ChevronLeft, Sparkles, Target, Users, Layout, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

const steps = [
  { id: 'basic', title: 'The Basics', icon: Sparkles },
  { id: 'niche', title: 'Your Niche', icon: Target },
  { id: 'audience', title: 'Audience', icon: Users },
  { id: 'platforms', title: 'Platforms', icon: Layout },
  { id: 'goals', title: 'Goals', icon: Trophy },
];

export default function BrandWizard({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    audience: '',
    goals: '',
    platforms: [] as string[],
    skillLevel: 'beginner'
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('You must be logged in to generate a strategy.');
      return;
    }
    setLoading(true);
    try {
      console.log('Generating strategy with inputs:', formData);
      const strategy = await generateBrandStrategy(formData);
      console.log('Strategy generated successfully');

      const { data, error } = await supabase
        .from('brand_profiles')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            niche: formData.niche,
            audience: formData.audience,
            goals: formData.goals,
            platforms: formData.platforms,
            skill_level: formData.skillLevel,
            strategy_json: strategy
          }
        ])
        .select();
      
      if (error) {
        console.error('Supabase Insert Error:', error);
        throw error;
      }
      
      console.log('Profile saved to Supabase:', data);
      onComplete();
    } catch (error: any) {
      console.error('Submission Error:', error);
      alert(error.message || 'Failed to generate or save brand strategy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (p: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(item => item !== p)
        : [...prev.platforms, p]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between mb-8">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              idx <= currentStep ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
            )}>
              <step.icon size={18} />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-50">{step.title}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[300px]"
        >
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">What's your brand name?</h2>
              <p className="text-zinc-500">This could be your actual name or a creative handle.</p>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 ring-indigo-500 outline-none"
                placeholder="e.g. Alex Growth"
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">What is your niche?</h2>
              <p className="text-zinc-500">Be as specific as possible for better AI results.</p>
              <input
                type="text"
                value={formData.niche}
                onChange={e => setFormData({ ...formData, niche: e.target.value })}
                className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 ring-indigo-500 outline-none"
                placeholder="e.g. AI Automation for Real Estate"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Who is your target audience?</h2>
              <p className="text-zinc-500">Describe who you want to reach.</p>
              <textarea
                value={formData.audience}
                onChange={e => setFormData({ ...formData, audience: e.target.value })}
                className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 ring-indigo-500 outline-none h-32"
                placeholder="e.g. Small business owners looking to save time using technology..."
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Where will you post?</h2>
              <div className="grid grid-cols-2 gap-3">
                {['Instagram', 'YouTube', 'LinkedIn', 'Twitter', 'TikTok'].map(p => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={cn(
                      "p-4 rounded-xl border transition-all text-left",
                      formData.platforms.includes(p)
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-indigo-500"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">What are your main goals?</h2>
              <textarea
                value={formData.goals}
                onChange={e => setFormData({ ...formData, goals: e.target.value })}
                className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 ring-indigo-500 outline-none h-32"
                placeholder="e.g. Reach 10k followers, build authority in AI, sell my $97 course..."
              />
              <div className="pt-4">
                <label className="block text-sm font-medium mb-2">Skill Level</label>
                <select
                  value={formData.skillLevel}
                  onChange={e => setFormData({ ...formData, skillLevel: e.target.value })}
                  className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={loading || (currentStep === 0 && !formData.name) || (currentStep === 3 && formData.platforms.length === 0)}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>Generating Strategy <Loader2 className="animate-spin" size={20} /></>
          ) : (
            <>
              {currentStep === steps.length - 1 ? 'Launch Brand' : 'Next'}
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
