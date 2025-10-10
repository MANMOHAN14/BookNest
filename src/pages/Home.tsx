import { Button } from "@/components/ui/button";
import { Book, ShoppingCart, Heart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-8 w-8 text-primary" />
            <span className="text-2xl font-serif font-bold text-foreground">BookNest</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Books</Button>
            <Button variant="ghost" size="sm">Categories</Button>
            <Button variant="ghost" size="icon"><ShoppingCart className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button>
            <Button onClick={() => navigate("/auth")} size="sm">Sign In</Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
              Discover Your Next Great Read
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore thousands of books, from timeless classics to contemporary bestsellers
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="text-lg">Browse Books</Button>
              <Button size="lg" variant="outline" className="text-lg">View Collections</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;