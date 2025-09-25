import { Button } from "@/components/ui/button";
import NotificationCenter from "@/components/NotificationCenter";
import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="glass-card backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center animate-bounce-in">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg animate-ping opacity-20" />
            </div>
            <span className="ml-3 text-xl font-bold text-white gradient-text">
              HairLens AI ✨
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 animate-shimmer">
              10 runs per day
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
