import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // TODO: Check if user is admin
  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Books</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">0</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">0</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">0</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Admin functionality coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;