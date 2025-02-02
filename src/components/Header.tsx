import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b border-gray-800 backdrop-blur-md bg-gray-900/50 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/placeholder.svg" alt="HairLens AI" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-semibold text-white">HairLens AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;