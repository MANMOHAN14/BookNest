import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
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

  const placeOrder = useMutation({
    mutationFn: async () => {
      if (!cartItems || cartItems.length === 0) return;
      
      const total = cartItems.reduce((sum, item: any) => {
        return sum + (item.books.price * item.quantity);
      }, 0);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id,
          total_amount: total,
          status: "pending"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item: any) => ({
        order_id: order.id,
        book_id: item.book_id,
        quantity: item.quantity,
        price: item.books.price
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      const { error: clearError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user?.id);

      if (clearError) throw clearError;
    },
    onSuccess: () => {
      toast({ title: "Order placed successfully!" });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate("/profile");
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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-serif font-bold mb-8">Checkout</h1>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-serif font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems?.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.books.title} x{item.quantity}</span>
                  <span>${(item.books.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-serif font-bold mb-4">Payment (Demo)</h2>
            <p className="text-muted-foreground mb-6">
              This is a demo payment system. Click "Place Order" to complete your purchase.
            </p>
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => placeOrder.mutate()}
              disabled={placeOrder.isPending || !cartItems || cartItems.length === 0}
            >
              {placeOrder.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Place Order"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Checkout;