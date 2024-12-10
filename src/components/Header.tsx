import { Link } from "react-router-dom";
import { Coins } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Coins className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">Crypto Tracker</span>
          </Link>
          <nav className="flex space-x-4">
            <Link
              to="/"
              className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-md hover:bg-secondary transition-colors"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};