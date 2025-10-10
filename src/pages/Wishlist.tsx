import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlistItems, isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select(`
          *,
          books (*)
        `)
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Item removed from wishlist" });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-8">My Wishlist</h1>
        
        {wishlistItems && wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item: any) => (
              <Card key={item.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => removeItem.mutate(item.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                <CardHeader className="cursor-pointer" onClick={() => navigate(`/books/${item.books.id}`)}>
                  <img
                    src={item.books.image_url || "/placeholder.svg"}
                    alt={item.books.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <CardTitle className="line-clamp-2 text-lg">{item.books.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{item.books.author}</p>
                  <p className="text-primary font-bold text-xl">${item.books.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">Your wishlist is empty</p>
            <Button onClick={() => navigate("/books")}>Browse Books</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;