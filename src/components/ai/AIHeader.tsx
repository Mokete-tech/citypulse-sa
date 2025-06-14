
import { Bot, Sparkles } from "lucide-react";

interface AIHeaderProps {
  darkMode: boolean;
}

const AIHeader = ({ darkMode }: AIHeaderProps) => {
  return (
    <section className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-r from-purple-900/80 via-blue-900/80 to-indigo-900/80' : 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600'} py-16 border-b backdrop-blur-sm`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 animate-pulse"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl mb-8 shadow-2xl">
          <div className="relative">
            <Bot className="w-8 h-8 text-yellow-300" />
            <Sparkles className="w-4 h-4 text-yellow-200 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">PulsePal AI</span>
            <p className="text-sm text-blue-100 opacity-90">Powered by Gemini</p>
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">
          Your Smart City Assistant
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Discover the best deals, events, and local recommendations across South Africa with AI-powered insights
        </p>
      </div>
    </section>
  );
};

export default AIHeader;
