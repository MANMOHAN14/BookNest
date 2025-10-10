import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Book, ShoppingCart, Heart, User, Moon, Sun, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Book className="h-8 w-8 text-primary" />
            <span className="text-2xl font-serif font-bold text-foreground">BookNest</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/books")}>Books</Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            {user ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => navigate("/cart")}>
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate("/wishlist")}>
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} size="sm">Sign In</Button>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;