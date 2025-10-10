import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Heart, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const addToCart = useMutation({
    mutationFn: async () => {
      if (!user) {
        navigate("/auth");
        return;
      }
      const { error } = await supabase
        .from("cart_items")
        .insert({ user_id: user.id, book_id: id, quantity: 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Added to cart!" });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const addToWishlist = useMutation({
    mutationFn: async () => {
      if (!user) {
        navigate("/auth");
        return;
      }
      const { error } = await supabase
        .from("wishlist_items")
        .insert({ user_id: user.id, book_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Added to wishlist!" });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

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
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={book?.image_url || "/placeholder.svg"}
              alt={book?.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-4xl font-serif font-bold mb-4">{book?.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {book?.author}</p>
            <p className="text-3xl text-primary font-bold mb-6">${book?.price}</p>
            <p className="text-muted-foreground mb-6">{book?.description}</p>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                onClick={() => addToCart.mutate()}
                disabled={addToCart.isPending}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => addToWishlist.mutate()}
                disabled={addToWishlist.isPending}
              >
                <Heart className="mr-2 h-5 w-5" />
                Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;