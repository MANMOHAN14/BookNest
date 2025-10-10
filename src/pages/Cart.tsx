import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_items")
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
        .from("cart_items")
        .delete()
        .eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Item removed from cart" });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const total = cartItems?.reduce((sum, item: any) => {
    return sum + (item.books.price * item.quantity);
  }, 0) || 0;

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
        <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>
        
        {cartItems && cartItems.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item: any) => (
                <Card key={item.id}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <img
                      src={item.books.image_url || "/placeholder.svg"}
                      alt={item.books.title}
                      className="w-24 h-32 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-lg">{item.books.title}</h3>
                      <p className="text-muted-foreground">{item.books.author}</p>
                      <p className="text-primary font-bold mt-2">${item.books.price}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem.mutate(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-serif font-bold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate("/books")}>Browse Books</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;