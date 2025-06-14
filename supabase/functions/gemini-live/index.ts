
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === 'GET') {
    // WebSocket upgrade for real-time communication
    const upgrade = req.headers.get("upgrade") || "";
    if (upgrade.toLowerCase() !== "websocket") {
      return new Response("Expected websocket", { status: 426 });
    }

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return new Response("GEMINI_API_KEY not configured", { status: 500 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    let geminiWs: WebSocket | null = null;

    socket.onopen = async () => {
      console.log("Client connected to Edge Function");
      
      // Connect to Gemini Live API
      try {
        const geminiUrl = `wss://generativelanguage.googleapis.com/ws/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${GEMINI_API_KEY}`;
        console.log('Connecting to Gemini API...');
        geminiWs = new WebSocket(geminiUrl);
        
        geminiWs.onopen = () => {
          console.log("Connected to Gemini Live API successfully");
          
          // Initialize session
          const initMessage = {
            setup: {
              model: "models/gemini-2.0-flash-exp",
              systemInstruction: {
                parts: [
                  {
                    text: "You are PulsePal, an AI assistant for CityPulse that helps users discover deals and events in South Africa. Be conversational, helpful, and respond naturally to voice interactions. Keep responses concise but engaging."
                  }
                ]
              },
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: {
                      voiceName: "Zephyr"
                    }
                  }
                }
              }
            }
          };
          
          console.log('Sending init message to Gemini');
          geminiWs?.send(JSON.stringify(initMessage));
        };

        geminiWs.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received from Gemini:', data.type || 'unknown type');
            socket.send(JSON.stringify(data));
          } catch (error) {
            console.error("Error parsing Gemini response:", error);
          }
        };

        geminiWs.onerror = (error) => {
          console.error("Gemini WebSocket error:", error);
          socket.send(JSON.stringify({ error: "Gemini connection error" }));
        };

        geminiWs.onclose = (event) => {
          console.log("Gemini WebSocket closed:", event.code, event.reason);
          socket.close();
        };

      } catch (error) {
        console.error("Failed to connect to Gemini:", error);
        socket.send(JSON.stringify({ error: "Failed to connect to Gemini Live API: " + error.message }));
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received from client:', data.type || 'unknown type');
        if (geminiWs && geminiWs.readyState === WebSocket.OPEN) {
          geminiWs.send(JSON.stringify(data));
        } else {
          console.error('Gemini WebSocket not ready, state:', geminiWs?.readyState);
        }
      } catch (error) {
        console.error("Error handling client message:", error);
      }
    };

    socket.onclose = () => {
      console.log("Client disconnected from Edge Function");
      if (geminiWs) {
        geminiWs.close();
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (geminiWs) {
        geminiWs.close();
      }
    };

    return response;
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
});
