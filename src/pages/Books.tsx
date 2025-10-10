import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceSort, setPriceSort] = useState("none");

  const { data: books, isLoading } = useQuery({
    queryKey: ["books", search, category, priceSort],
    queryFn: async () => {
      let query = supabase.from("books").select("*");
      
      if (search) {
        query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
      }
      
      if (category !== "all") {
        query = query.eq("category", category);
      }
      
      if (priceSort === "asc") {
        query = query.order("price", { ascending: true });
      } else if (priceSort === "desc") {
        query = query.order("price", { ascending: false });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-8">Browse Books</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Fiction">Fiction</SelectItem>
              <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
              <SelectItem value="Mystery">Mystery</SelectItem>
              <SelectItem value="Romance">Romance</SelectItem>
              <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priceSort} onValueChange={setPriceSort}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Sorting</SelectItem>
              <SelectItem value="asc">Price: Low to High</SelectItem>
              <SelectItem value="desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books?.map((book) => (
              <Card 
                key={book.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/books/${book.id}`)}
              >
                <CardHeader>
                  <img 
                    src={book.image_url || "/placeholder.svg"} 
                    alt={book.title} 
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">{book.author}</p>
                  <p className="text-xs text-muted-foreground mb-2">{book.category}</p>
                  <p className="text-primary font-bold text-xl">${book.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Books;