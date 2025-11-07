import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import BottomNav from "@/components/BottomNav";
import ServiceManagement from "@/components/ServiceManagement";
import { useToast } from "@/hooks/use-toast";

const ListServices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to list your services",
        variant: "destructive",
      });
      navigate("/auth");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">List My Services</h1>
            <p className="text-lg text-muted-foreground">
              Manage and showcase your services to potential customers
            </p>
          </div>

          <ServiceManagement />
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
      <BottomNav />
    </div>
  );
};

export default ListServices;
