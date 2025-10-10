import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import Chatbot from "@/components/Chatbot";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const { data: featuredBooks, isLoading } = useQuery({
    queryKey: ["featured-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("featured", true)
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const { data: trendingBooks } = useQuery({
    queryKey: ["trending-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("trending", true)
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <Chatbot />
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 animate-fade-in">
            Discover Your Next Great Read
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Explore thousands of books, from timeless classics to contemporary bestsellers
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="text-lg" onClick={() => navigate("/books")}>
              Browse Books
            </Button>
            <Button size="lg" variant="outline" className="text-lg" onClick={() => navigate("/books")}>
              View Collections
            </Button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <h2 className="text-3xl font-serif font-bold mb-8">Featured Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredBooks?.map((book) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/books/${book.id}`)}>
                    <CardHeader>
                      <img src={book.image_url || "/placeholder.svg"} alt={book.title} className="w-full h-48 object-cover rounded-md mb-4" />
                      <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{book.author}</p>
                      <p className="text-primary font-bold text-xl mt-2">${book.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto">
              <h2 className="text-3xl font-serif font-bold mb-8">Trending Now</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingBooks?.map((book) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/books/${book.id}`)}>
                    <CardHeader>
                      <img src={book.image_url || "/placeholder.svg"} alt={book.title} className="w-full h-48 object-cover rounded-md mb-4" />
                      <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{book.author}</p>
                      <p className="text-primary font-bold text-xl mt-2">${book.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
};

export default Home;