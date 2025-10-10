import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            books (*)
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
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
        <h1 className="text-4xl font-serif font-bold mb-8">My Profile</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Email: {user.email}</p>
          </CardContent>
        </Card>

        <h2 className="text-3xl font-serif font-bold mb-6">Order History</h2>
        
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Order #{order.id.slice(0, 8)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()} • Status: {order.status}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.books.title} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">${order.total_amount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No orders yet</p>
        )}
      </div>
    </Layout>
  );
};

export default Profile;