import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  BarChart3, Calendar, FileText, Lightbulb, 
  TrendingUp, Download, CheckCircle2, Circle,
  Instagram, Linkedin, Youtube, Twitter, Send, LogOut,
  Wrench, Star, ShieldCheck, Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AITools from './AITools';

const platformIcons: Record<string, any> = {
  Instagram: Instagram,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  Twitter: Twitter,
  TikTok: Send
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: profileData } = await supabase
      .from('brand_profiles')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const { data: contentData } = await supabase
      .from('content_items')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    setProfile(profileData);
    setContent(contentData || []);
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'posted' ? 'draft' : 'posted';
    await supabase
      .from('content_items')
      .update({ status: newStatus })
      .eq('id', id)
      .eq('user_id', user?.id);
    
    fetchData();
  };

  const exportPDF = async () => {
    const element = document.getElementById('dashboard-content');
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('brand-strategy.pdf');
  };

  if (!profile) return null;

  const chartData = [
    { name: 'Day 1', followers: 100 },
    { name: 'Day 15', followers: 450 },
    { name: 'Day 30', followers: 1200 },
    { name: 'Day 45', followers: 2800 },
    { name: 'Day 60', followers: 5000 },
    { name: 'Day 75', followers: 8500 },
    { name: 'Day 90', followers: 15000 },
  ];

  const score = profile.strategy_json.brandScore || { overall: 0 };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-8 bg-white dark:bg-zinc-950">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">B</div>
          BrandPilot
        </div>
        
        <nav className="flex flex-col gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'calendar', label: 'Content Plan', icon: Calendar },
            { id: 'scripts', label: 'Ideas & Hooks', icon: Lightbulb },
            { id: 'growth', label: 'Growth Roadmap', icon: TrendingUp },
            { id: 'tools', label: 'AI Power Tools', icon: Wrench },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                activeTab === item.id 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" 
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download size={16} /> Export Strategy
          </button>
          <button 
            onClick={signOut}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto" id="dashboard-content">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.user_metadata?.full_name || 'Creator'}</h1>
            <p className="text-zinc-500">Your brand strategy for <span className="text-indigo-600 font-semibold">{profile.name}</span> is ready.</p>
          </div>
          <div className="flex gap-2">
            {profile.platforms.map((p: string) => {
              const Icon = platformIcons[p] || Send;
              return (
                <div key={p} className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                  <Icon size={18} />
                </div>
              );
            })}
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Positioning</h3>
                  <p className="text-lg font-medium leading-relaxed">{profile.strategy_json.positioning}</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Content Pillars</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.strategy_json.contentPillars.map((p: string) => (
                      <span key={p} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Monetization</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile.strategy_json.monetization}</p>
                </div>
              </div>

              {/* Brand Score Card */}
              <div className="p-6 bg-indigo-600 rounded-3xl text-white flex flex-col items-center justify-center text-center">
                <h3 className="text-xs font-bold uppercase opacity-80 mb-2">Personal Brand Score</h3>
                <div className="text-5xl font-bold mb-2">{score.overall}</div>
                <div className="text-[10px] font-medium opacity-70">Based on clarity, focus & monetization</div>
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 w-full text-[10px] font-bold uppercase">
                  <div className="flex justify-between"><span>Clarity</span> <span>{score.clarity}%</span></div>
                  <div className="flex justify-between"><span>Focus</span> <span>{score.focus}%</span></div>
                  <div className="flex justify-between"><span>Authority</span> <span>{score.authority}%</span></div>
                  <div className="flex justify-between"><span>Money</span> <span>{score.monetization}%</span></div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-6">Projected Growth (90 Days)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888822" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Line type="monotone" dataKey="followers" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.strategy_json.contentCalendar.map((item: any) => (
              <motion.div 
                whileHover={{ y: -4 }}
                key={item.day} 
                className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-600 uppercase">Day {item.day}</span>
                  <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold uppercase">{item.type}</span>
                </div>
                <h4 className="font-bold">{item.topic}</h4>
                <p className="text-sm text-zinc-500 italic">" {item.hook} "</p>
                <button className="mt-2 text-xs font-semibold text-indigo-600 hover:underline text-left">Save to drafts</button>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'scripts' && (
          <div className="space-y-6">
            <div className="p-8 bg-indigo-600 rounded-3xl text-white">
              <h3 className="text-2xl font-bold mb-4">Viral Hooks Generator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.strategy_json.viralHooks.map((hook: string, i: number) => (
                  <div key={i} className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    {hook}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(profile.strategy_json.bios).map(([platform, bio]: [string, any]) => (
                <div key={platform} className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="capitalize font-bold">{platform} Bio</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{bio}</p>
                  <button className="mt-4 text-xs font-bold text-indigo-600">Copy to clipboard</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="text-indigo-600" /> Engagement Tips</h3>
                <ul className="space-y-4">
                  {profile.strategy_json.insights.engagementTips.map((tip: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar className="text-indigo-600" /> Posting Schedule</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{profile.strategy_json.insights.postingSchedule}</p>
                <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xs font-bold uppercase mb-2 text-zinc-400">Trend Suggestions</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.strategy_json.insights.trendSuggestions.map((trend: string) => (
                      <span key={trend} className="px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-[10px] font-bold">
                        {trend}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">90-Day Roadmap</h3>
              <div className="space-y-4">
                {profile.strategy_json.growthRoadmap.map((phase: any, i: number) => (
                  <div key={i} className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-indigo-600">{phase.phase}</h4>
                      <span className="text-xs font-medium text-zinc-400">{phase.goal}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {phase.actions.map((action: string, j: number) => (
                        <div key={j} className="flex items-center gap-3 text-sm text-zinc-500">
                          <Circle size={14} className="text-zinc-300" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <AITools profile={profile} />
        )}
      </main>
    </div>
  );
}
