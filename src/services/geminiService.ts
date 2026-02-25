import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const brandStrategySchema = {
  type: Type.OBJECT,
  properties: {
    positioning: { type: Type.STRING, description: "Unique brand positioning statement" },
    bios: {
      type: Type.OBJECT,
      properties: {
        instagram: { type: Type.STRING },
        youtube: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        twitter: { type: Type.STRING },
      }
    },
    contentPillars: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 core themes"
    },
    contentCalendar: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          topic: { type: Type.STRING },
          type: { type: Type.STRING, description: "Reel, Post, Story, etc." },
          hook: { type: Type.STRING }
        }
      }
    },
    viralHooks: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    monetization: { type: Type.STRING },
    growthRoadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          goal: { type: Type.STRING },
          actions: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    insights: {
      type: Type.OBJECT,
      properties: {
        engagementTips: { type: Type.ARRAY, items: { type: Type.STRING } },
        postingSchedule: { type: Type.STRING },
        trendSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    brandScore: {
      type: Type.OBJECT,
      properties: {
        overall: { type: Type.NUMBER },
        consistency: { type: Type.NUMBER },
        clarity: { type: Type.NUMBER },
        focus: { type: Type.NUMBER },
        monetization: { type: Type.NUMBER },
        authority: { type: Type.NUMBER }
      }
    }
  },
  required: ["positioning", "bios", "contentPillars", "contentCalendar", "viralHooks", "monetization", "growthRoadmap", "insights", "brandScore"]
};

export async function generateBrandStrategy(inputs: any) {
  const prompt = `
    Act as a world-class personal branding expert. Generate a comprehensive brand strategy for:
    Name: ${inputs.name}
    Niche: ${inputs.niche}
    Target Audience: ${inputs.audience}
    Goals: ${inputs.goals}
    Platforms: ${inputs.platforms.join(", ")}
    Skill Level: ${inputs.skillLevel}

    Provide a detailed 90-day roadmap and 30-day content calendar.
    Also calculate a "Brand Score" (0-100) for their current starting position based on their inputs.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: brandStrategySchema,
      },
    });

    if (!response.text) throw new Error("Empty response from AI");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

export async function scanCompetitor(username: string, platform: string, userNiche: string) {
  const prompt = `Analyze the competitor "${username}" on ${platform} within the niche "${userNiche}". 
  Provide: 
  1. Posting style analysis
  2. Hook patterns they use
  3. Content themes
  4. Engagement type
  5. What they're doing right
  6. Where the user can beat them
  7. Gap opportunities.
  Return as JSON.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      postingStyle: { type: Type.STRING },
      hookPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
      themes: { type: Type.ARRAY, items: { type: Type.STRING } },
      engagementType: { type: Type.STRING },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      gaps: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema: schema }
  });
  return JSON.parse(response.text || "{}");
}

export async function predictHooks(topic: string) {
  const prompt = `Generate 10 viral hooks for the topic: "${topic}". 
  For each hook, provide a predicted engagement score (0-100), emotion type (curiosity, fear, authority, story), and best format (reel, carousel, short, tweet). 
  Return as JSON.`;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        hook: { type: Type.STRING },
        score: { type: Type.NUMBER },
        emotion: { type: Type.STRING },
        format: { type: Type.STRING }
      }
    }
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema: schema }
  });
  return JSON.parse(response.text || "[]");
}

export async function simulatePerformance(content: string, platform: string) {
  const prompt = `Simulate the performance of this content for ${platform}: "${content}". 
  Predict: estimated reach, engagement %, improvement suggestions, and best posting time.
  Return as JSON.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      reach: { type: Type.STRING },
      engagementRate: { type: Type.STRING },
      suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      bestTime: { type: Type.STRING }
    }
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema: schema }
  });
  return JSON.parse(response.text || "{}");
}

export async function trainVoice(posts: string[]) {
  const prompt = `Analyze these past posts to learn the writing tone, vocabulary style, and personality:
  ${posts.join("\n---\n")}
  Provide a summary of the voice profile.
  Return as JSON.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      tone: { type: Type.STRING },
      vocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
      personalityTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
      voiceSummary: { type: Type.STRING }
    }
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema: schema }
  });
  return JSON.parse(response.text || "{}");
}

export async function getMonetizationStrategy(niche: string, audience: string) {
  const prompt = `Generate a monetization strategy for a personal brand in the "${niche}" niche targeting "${audience}".
  Include: digital products, price ranges, funnel strategy, lead magnet ideas, and DM conversion scripts.
  Return as JSON.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      products: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, price: { type: Type.STRING } } } },
      funnel: { type: Type.STRING },
      leadMagnets: { type: Type.ARRAY, items: { type: Type.STRING } },
      dmScripts: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema: schema }
  });
  return JSON.parse(response.text || "{}");
}

export async function getTrendRadar(niche: string) {
  const prompt = `Detect 5 trending topics in the "${niche}" niche. 
  For each, suggest a fast content idea, a remix strategy, and the trend timing window.
  Return as JSON.`;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        trend: { type: Type.STRING },
        idea: { type: Type.STRING },
        remix: { type: Type.STRING },
        window: { type: Type.STRING }
      }
    }
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema: schema }
  });
  return JSON.parse(response.text || "[]");
}

export async function findCollaborations(niche: string, goals: string) {
  const prompt = `Find 5 types of similar creators for collaboration in the "${niche}" niche with goals of "${goals}".
  Provide: creator type, collab pitch message, and why the partnership makes sense.
  Return as JSON.`;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        creatorType: { type: Type.STRING },
        pitch: { type: Type.STRING },
        reason: { type: Type.STRING }
      }
    }
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema: schema }
  });
  return JSON.parse(response.text || "[]");
}
