
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === 'GET') {
    // WebSocket upgrade for real-time communication
    const upgrade = req.headers.get("upgrade") || "";
    if (upgrade.toLowerCase() !== "websocket") {
      return new Response("Expected websocket", { status: 426 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    let geminiWs: WebSocket | null = null;

    socket.onopen = async () => {
      console.log("Client connected");
      
      // Connect to Gemini Live API
      try {
        const geminiUrl = `wss://generativelanguage.googleapis.com/ws/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${GEMINI_API_KEY}`;
        geminiWs = new WebSocket(geminiUrl);
        
        geminiWs.onopen = () => {
          console.log("Connected to Gemini Live API");
          
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
          
          geminiWs?.send(JSON.stringify(initMessage));
        };

        geminiWs.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            socket.send(JSON.stringify(data));
          } catch (error) {
            console.error("Error parsing Gemini response:", error);
          }
        };

        geminiWs.onerror = (error) => {
          console.error("Gemini WebSocket error:", error);
          socket.send(JSON.stringify({ error: "Gemini connection error" }));
        };

        geminiWs.onclose = () => {
          console.log("Gemini WebSocket closed");
          socket.close();
        };

      } catch (error) {
        console.error("Failed to connect to Gemini:", error);
        socket.send(JSON.stringify({ error: "Failed to connect to Gemini Live API" }));
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (geminiWs && geminiWs.readyState === WebSocket.OPEN) {
          geminiWs.send(JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error handling client message:", error);
      }
    };

    socket.onclose = () => {
      console.log("Client disconnected");
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
