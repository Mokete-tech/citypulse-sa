import React, { useState, useEffect } from "react";
import { supabase } from "../../integrations/supabase/client";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export function PulsePal({ apiKey }: { apiKey: string }) {
  console.log("PulsePal apiKey prop:", apiKey);
  const [deals, setDeals] = useState<any[]>([]);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load deals from Supabase
  useEffect(() => {
    supabase.from("deals").select("*").then(({ data }) => setDeals(data || []));
  }, []);

  // Compose prompt for Gemini
  const makePrompt = (q: string) => {
    const dealsText = deals.length
      ? deals
          .map(
            (d, i) =>
              `${i + 1}. ${d.title} at ${d.location}${d.date ? " on " + d.date : ""} for R${d.price}`
          )
          .join("\n")
      : "No deals available right now.";

    return `
You are PulsePal, a helpful assistant for CityPulse users.
You have access to the following list of event deals:
${dealsText}

User request: "${q}"

If the user asks for a summary, summarize the deals in simple language.
If the user wants recommendations, pick events that sound fun, unique, or affordable.
If the user mentions a budget, suggest deals within that budget and give friendly advice.
If the user asks anything else, do your best to help based on the deals and context.
Always be concise, friendly, and practical.
    `.trim();
  };

  // Ask Gemini AI
  const askPulsePal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const prompt = makePrompt(question);
      if (!apiKey) {
        setError("Missing Gemini API key.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        if (!res.ok) {
          const text = await res.text();
          setError(`API error: ${text}`);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          setResponse(data.candidates[0].content.parts[0].text);
        } else {
          setError("No AI response.");
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
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
    <div style={{ margin: "2rem 0", padding: 20, border: "2px solid #673ab7", borderRadius: 12, background: "#f5f3ff" }}>
      <h2>🤖 PulsePal: Your Smart Event Buddy</h2>
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => quickAsk("Summarize the current deals.")}>📝 Summarize Deals</button>{" "}
        <button onClick={() => quickAsk("Recommend a fun event for this weekend.")}>🎉 Recommend Event</button>{" "}
        <button onClick={() => quickAsk("I have R100, what can I attend?")}>💸 Budget Buddy</button>
      </div>
      <form id="pulsepal-form" onSubmit={askPulsePal} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Ask PulsePal anything about events, deals, budget..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          style={{ flex: 1 }}
          required
        />
        <button type="submit" disabled={loading || !apiKey}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {!apiKey && <div style={{ color: "red" }}>No Gemini API key provided.</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {response && (
        <div style={{ whiteSpace: "pre-wrap", background: "#fff", padding: 12, borderRadius: 6, border: "1px solid #b39ddb" }}>
          {response}
        </div>
      )}
    </div>
  );
}
