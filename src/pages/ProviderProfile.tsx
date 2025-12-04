import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, MessageCircle, MapPin, Briefcase, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
}

interface Service {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price_range: string | null;
  availability: string | null;
}

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    if (providerId) {
      fetchProviderData();
    }
  }, [providerId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchProviderData = async () => {
    setLoading(true);
    
    // Fetch profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", providerId)
      .maybeSingle();

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to load provider profile",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!profileData) {
      toast({
        title: "Not Found",
        description: "Provider not found",
        variant: "destructive",
      });
      navigate("/jobs");
      return;
    }

    setProfile(profileData);

    // Fetch services
    const { data: servicesData, error: servicesError } = await supabase
      .from("services")
      .select("*")
      .eq("provider_id", providerId)
      .order("created_at", { ascending: false });

    if (!servicesError) {
      setServices(servicesData || []);
    }

    setLoading(false);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-24 bg-muted rounded-lg" />
            <div className="h-48 bg-muted rounded-lg" />
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Provider not found</p>
            <Button onClick={() => navigate("/jobs")} className="mt-4">
              Back to Services
            </Button>
          </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2">
                {profile.full_name || "Anonymous Provider"}
              </h1>
              {profile.location && (
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-1 mb-2">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </p>
              )}
              {profile.bio && (
                <p className="text-muted-foreground mt-3">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Contact Buttons */}
          {profile.phone && (
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" asChild>
                <a href={`tel:${profile.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </a>
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-[#25D366] border-[#25D366] hover:bg-[#25D366]/10"
                asChild
              >
                <a
                  href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${profile.full_name || ''}, I found your profile on ConnectNest and would like to discuss your services.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          )}
        </Card>

        {/* Services Section */}
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Services Offered
        </h2>

        {services.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <Card key={service.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{service.title}</h3>
                  <Badge variant="secondary">{service.category}</Badge>
                </div>
                {service.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {service.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  {service.price_range && (
                    <span className="font-semibold text-primary">
                      {service.price_range}
                    </span>
                  )}
                  {service.availability && (
                    <span className="text-muted-foreground">
                      {service.availability}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No services listed yet</p>
          </Card>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default ProviderProfile;
