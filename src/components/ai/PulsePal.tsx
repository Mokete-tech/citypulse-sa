import React, { useState, useEffect } from "react";
import { supabase } from "../../integrations/supabase/client";
import { Coins, MapPin, Search, Brain, Sparkles, Calculator } from "lucide-react";
import { toast } from "sonner";

// Updated Gemini API URL with correct model name - fixing the 404 error
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export function PulsePal({ apiKey }: { apiKey: string }) {
  const [deals, setDeals] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Load deals from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: dealsData } = await supabase.from("deals").select("*");
      setDeals(dealsData || []);
      
      const { data: eventsData } = await supabase.from("events").select("*");
      setEvents(eventsData || []);
    };
    
    fetchData();
    
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.log("Location access denied:", err);
        }
      );
    }
  }, []);

  // Calculate distance between two coordinates in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  // Compose prompt for Gemini with enhanced context
  const makePrompt = (q: string) => {
    // Get deals with their distances if location is available
    let dealsWithContext = deals;
    if (userLocation && deals.some(d => d.latitude && d.longitude)) {
      dealsWithContext = deals
        .filter(d => d.latitude && d.longitude)
        .map(d => ({
          ...d,
          distance: calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            parseFloat(d.latitude), 
            parseFloat(d.longitude)
          )
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    // Format deals for the prompt
    const dealsText = dealsWithContext.length
      ? dealsWithContext
          .map(
            (d, i) => {
              const locationStr = d.location || d.city || "Unknown location";
              const distanceStr = d.distance ? ` (${d.distance.toFixed(1)}km away)` : '';
              return `${i + 1}. ${d.title} at ${locationStr}${distanceStr}${d.date ? " on " + d.date : ""} for R${d.price || d.discount || "Unknown price"}`;
            }
          )
          .join("\n")
      : "No deals available right now.";

    // Format events for the prompt
    const eventsText = events.length
      ? events
          .map(
            (e, i) => {
              const locationStr = e.location || e.city || "Unknown location";
              return `${i + 1}. ${e.title} at ${locationStr} on ${e.date || "Unknown date"} for R${e.price || "Free"}`;
            }
          )
          .join("\n")
      : "No events available right now.";

    return `
You are PulsePal, a helpful assistant for CityPulse users in South Africa.
You have access to the following list of event deals:
${dealsText}

And these events:
${eventsText}

User location context: ${userLocation ? `The user is currently located at coordinates ${userLocation.lat}, ${userLocation.lng}.` : "User location is unknown."}

User request: "${q}"

If the user asks about their budget, recommend deals and events within that budget.
If the user mentions a location or distance, prioritize nearby deals and events.
If the user asks for a summary, summarize the deals in simple language.
If the user wants recommendations, pick events that sound fun, unique, or affordable.
Always be friendly, concise and practical. Use South African Rands (R) for all prices.
Format your response in a clear, easy to read way.
    `.trim();
  };

  // Ask Gemini AI - Updated API format for the current Gemini API
  const askPulsePal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const prompt = makePrompt(question);
      if (!apiKey) {
        setError("Missing Gemini API key.");
        toast.error("API key missing", {
          description: "Please provide a Gemini API key in the environment variables."
        });
        setLoading(false);
        return;
      }

      try {
        // Updated request format for the current Gemini API
        const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ text: prompt }] 
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            }
          })
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Gemini API error:", errorData);
          setError(`API error: ${JSON.stringify(errorData)}`);
          toast.error("Gemini API error", {
            description: "Failed to get a response from Gemini. Check the console for details."
          });
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          setResponse(data.candidates[0].content.parts[0].text);
          // Log the successful interaction
          try {
            await supabase.from("analytics").insert({
              event_type: 'ai_interaction',
              event_source: 'pulsepal',
              source_id: 0,
              metadata: { query: question, success: true }
            });
          } catch (err) {
            console.error("Failed to log AI interaction:", err);
          }
        } else {
          setError("No AI response.");
          toast.error("No response received", {
            description: "Gemini didn't provide a response."
          });
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
        toast.error("Request failed", {
          description: err.message || "An unknown error occurred"
        });
      } finally {
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setLoading(false);
    }
  };

  // Quick action buttons
  const quickAsk = (q: string) => {
    setQuestion(q);
    setTimeout(() => {
      const form = document.getElementById("pulsepal-form") as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 100);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold">PulsePal AI Assistant</h2>
      </div>
      
      {!apiKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-700 text-sm mb-3">
          <strong>Missing API key:</strong> Add VITE_GEMINI_API_KEY to your .env file to enable AI features.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
        <button 
          onClick={() => quickAsk("What deals are available under R100?")}
          className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-md text-purple-700 text-sm font-medium transition-colors"
        >
          <Coins className="h-4 w-4" />
          <span>Budget Deals</span>
        </button>
        
        <button 
          onClick={() => quickAsk("What events are happening near me this weekend?")}
          className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-md text-purple-700 text-sm font-medium transition-colors"
        >
          <MapPin className="h-4 w-4" />
          <span>Nearby Events</span>
        </button>
        
        <button 
          onClick={() => quickAsk("I have R200 for entertainment this weekend, what do you recommend?")}
          className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-md text-purple-700 text-sm font-medium transition-colors"
        >
          <Calculator className="h-4 w-4" />
          <span>Plan My Weekend</span>
        </button>
      </div>

      <form id="pulsepal-form" onSubmit={askPulsePal} className="flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask about deals, events, budgets, locations..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-10"
            required
          />
          <Brain className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !apiKey}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Ask PulsePal</span>
            </>
          )}
        </button>
      </form>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
          {error}
        </div>
      )}
      
      {response && (
        <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm overflow-auto max-h-[400px]">
          <div className="prose prose-sm max-w-none">
            {response.split('\n').map((line, i) => (
              line ? <p key={i}>{line}</p> : <br key={i} />
            ))}
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        <p>PulsePal uses Google's Gemini AI to provide personalized recommendations based on available deals and events.</p>
      </div>
    </div>
  );
}
