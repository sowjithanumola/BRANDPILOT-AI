import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Zap, BarChart, Mic, DollarSign, 
  Radio, Trophy, Users, Loader2, Sparkles,
  ChevronRight, MessageSquare, Target
} from 'lucide-react';
import { 
  scanCompetitor, predictHooks, simulatePerformance, 
  trainVoice, getMonetizationStrategy, getTrendRadar, 
  findCollaborations 
} from '../services/geminiService';
import { cn } from '../lib/utils';

export default function AITools({ profile }: { profile: any }) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [inputs, setInputs] = useState<any>({});

  const tools = [
    { id: 'competitor', name: 'Competitor Scanner', icon: Search, desc: 'Analyze competitor gaps' },
    { id: 'hooks', name: 'Viral Hook Predictor', icon: Zap, desc: '10 viral hooks with scores' },
    { id: 'simulator', name: 'Performance Simulator', icon: BarChart, desc: 'Predict reach & engagement' },
    { id: 'voice', name: 'Voice Trainer', icon: Mic, desc: 'Learn your writing style' },
    { id: 'monetization', name: 'Monetization Engine', icon: DollarSign, desc: 'Products & funnel strategy' },
    { id: 'trends', name: 'Trend Radar', icon: Radio, desc: 'Niche trending topics' },
    { id: 'collab', name: 'Collab Finder', icon: Users, desc: 'Find similar creators' },
  ];

  const handleRunTool = async (id: string) => {
    setLoading(true);
    setResult(null);
    try {
      let data;
      switch (id) {
        case 'competitor':
          data = await scanCompetitor(inputs.username, inputs.platform || 'Instagram', profile.niche);
          break;
        case 'hooks':
          data = await predictHooks(inputs.topic);
          break;
        case 'simulator':
          data = await simulatePerformance(inputs.content, inputs.platform || 'Instagram');
          break;
        case 'voice':
          data = await trainVoice(inputs.posts.split('\n---\n'));
          break;
        case 'monetization':
          data = await getMonetizationStrategy(profile.niche, profile.audience);
          break;
        case 'trends':
          data = await getTrendRadar(profile.niche);
          break;
        case 'collab':
          data = await findCollaborations(profile.niche, profile.goals);
          break;
      }
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {!activeTool ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-left hover:border-indigo-500 transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <tool.icon size={24} />
              </div>
              <h3 className="font-bold text-lg mb-1">{tool.name}</h3>
              <p className="text-sm text-zinc-500">{tool.desc}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => { setActiveTool(null); setResult(null); }}
            className="text-sm font-bold text-indigo-600 flex items-center gap-2"
          >
            ← Back to Tools
          </button>

          <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              {tools.find(t => t.id === activeTool)?.name}
            </h2>

            <div className="space-y-4 mb-8">
              {activeTool === 'competitor' && (
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="Competitor Username" 
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none"
                    onChange={e => setInputs({ ...inputs, username: e.target.value })}
                  />
                  <select 
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none"
                    onChange={e => setInputs({ ...inputs, platform: e.target.value })}
                  >
                    <option>Instagram</option>
                    <option>YouTube</option>
                    <option>TikTok</option>
                    <option>LinkedIn</option>
                  </select>
                </div>
              )}
              {activeTool === 'hooks' && (
                <input 
                  placeholder="Topic (e.g. How to save time with AI)" 
                  className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none"
                  onChange={e => setInputs({ ...inputs, topic: e.target.value })}
                />
              )}
              {activeTool === 'simulator' && (
                <textarea 
                  placeholder="Paste your content here..." 
                  className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none h-32"
                  onChange={e => setInputs({ ...inputs, content: e.target.value })}
                />
              )}
              {activeTool === 'voice' && (
                <textarea 
                  placeholder="Paste 5-10 past posts separated by ---" 
                  className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none h-48"
                  onChange={e => setInputs({ ...inputs, posts: e.target.value })}
                />
              )}

              <button 
                onClick={() => handleRunTool(activeTool)}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Run AI Analysis'}
              </button>
            </div>

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800"
              >
                {activeTool === 'competitor' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-2">Posting Style</h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{result.postingStyle}</p>
                      </div>
                      <div>
                        <h4 className="font-bold mb-2">Engagement Type</h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{result.engagementType}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Strengths</h4>
                      <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400">
                        {result.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                      <h4 className="font-bold text-indigo-600 mb-2">Gap Opportunities</h4>
                      <ul className="list-disc list-inside text-sm text-indigo-600/80">
                        {result.gaps.map((g: string, i: number) => <li key={i}>{g}</li>)}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTool === 'hooks' && (
                  <div className="space-y-4">
                    {result.map((h: any, i: number) => (
                      <div key={i} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <p className="font-medium mb-1">{h.hook}</p>
                          <div className="flex gap-2">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">{h.emotion}</span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">{h.format}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-zinc-400 font-bold uppercase">Score</div>
                          <div className="text-xl font-bold text-indigo-600">{h.score}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTool === 'simulator' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                        <div className="text-xs text-zinc-400 font-bold uppercase mb-1">Est. Reach</div>
                        <div className="text-2xl font-bold">{result.reach}</div>
                      </div>
                      <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                        <div className="text-xs text-zinc-400 font-bold uppercase mb-1">Engagement</div>
                        <div className="text-2xl font-bold text-indigo-600">{result.engagementRate}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Improvement Suggestions</h4>
                      <ul className="space-y-2">
                        {result.suggestions.map((s: string, i: number) => (
                          <li key={i} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <Sparkles size={14} className="text-indigo-500 shrink-0 mt-1" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-center p-4 bg-indigo-600 rounded-xl text-white">
                      <div className="text-xs font-bold uppercase opacity-80 mb-1">Best Posting Time</div>
                      <div className="text-xl font-bold">{result.bestTime}</div>
                    </div>
                  </div>
                )}

                {activeTool === 'voice' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold mb-2">Tone Profile</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{result.tone}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Personality Traits</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.personalityTraits.map((t: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <h4 className="font-bold mb-2">Voice Summary</h4>
                      <p className="text-sm text-zinc-500 italic">"{result.voiceSummary}"</p>
                    </div>
                  </div>
                )}

                {activeTool === 'monetization' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold mb-4">Digital Products</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.products.map((p: any, i: number) => (
                          <div key={i} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                            <span className="font-medium">{p.name}</span>
                            <span className="font-bold text-indigo-600">{p.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Funnel Strategy</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{result.funnel}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Lead Magnet Ideas</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.leadMagnets.map((l: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-medium">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTool === 'trends' && (
                  <div className="space-y-4">
                    {result.map((t: any, i: number) => (
                      <div key={i} className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-bold text-lg">{t.trend}</h4>
                          <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-bold uppercase">{t.window}</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex gap-3 text-sm">
                            <Zap size={16} className="text-indigo-500 shrink-0" />
                            <p><span className="font-bold">Idea:</span> {t.idea}</p>
                          </div>
                          <div className="flex gap-3 text-sm">
                            <Radio size={16} className="text-indigo-500 shrink-0" />
                            <p><span className="font-bold">Remix:</span> {t.remix}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTool === 'collab' && (
                  <div className="space-y-4">
                    {result.map((c: any, i: number) => (
                      <div key={i} className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                          <Users size={18} className="text-indigo-600" />
                          {c.creatorType}
                        </h4>
                        <p className="text-sm text-zinc-500 mb-4">{c.reason}</p>
                        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                          <div className="text-[10px] font-bold uppercase text-zinc-400 mb-2">Pitch Message</div>
                          <p className="text-xs italic leading-relaxed">"{c.pitch}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
