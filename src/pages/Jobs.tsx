import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Search, Phone, MessageCircle, User, Heart, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Service {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  category: string;
  price_range: string;
  availability: string | null;
  profiles: {
    full_name: string;
    location: string;
    phone: string | null;
  };
}

const Jobs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  const categories = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Cleaning",
    "Gardening",
    "Moving",
    "Other",
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchQuery, selectedCategory, services]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    } else {
      setUserId(session.user.id);
      fetchServices();
      fetchFavorites(session.user.id);
    }
  };

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        provider_id,
        profiles (full_name, location, phone)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } else {
      setServices(data || []);
    }
  };

  const fetchFavorites = async (uid: string) => {
    const { data } = await supabase
      .from("favorites")
      .select("provider_id")
      .eq("user_id", uid);
    
    if (data) {
      setFavorites(new Set(data.map(f => f.provider_id)));
    }
  };

  const toggleFavorite = async (providerId: string) => {
    if (!userId) return;

    const isFavorited = favorites.has(providerId);

    if (isFavorited) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("provider_id", providerId);

      if (!error) {
        setFavorites(prev => {
          const next = new Set(prev);
          next.delete(providerId);
          return next;
        });
        toast({ title: "Removed from favorites" });
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: userId, provider_id: providerId });

      if (!error) {
        setFavorites(prev => new Set(prev).add(providerId));
        toast({ title: "Added to favorites" });
      }
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const handleSearch = async () => {
    if (!searchQuery && selectedCategory === "all") {
      toast({
        title: "Search required",
        description: "Please enter a search term or select a category",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("service_searches").insert({
      searcher_id: user.id,
      service_category: selectedCategory !== "all" ? selectedCategory : "General",
      search_query: searchQuery,
    });

    if (!error) {
      toast({
        title: "Search recorded",
        description: "Service providers have been notified!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Briefcase className="h-8 w-8" />
          Find Services
        </h1>

        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="w-full md:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleFavorite(service.provider_id)}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.has(service.provider_id)
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {service.category}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
              <div className="flex items-center justify-between text-sm mb-3">
                <div>
                  <p className="font-medium">{service.profiles?.full_name}</p>
                  <p className="text-muted-foreground">{service.profiles?.location}</p>
                </div>
                <p className="font-semibold text-primary">{service.price_range}</p>
              </div>
              {service.availability && (
                <div className="flex items-center gap-2 text-sm text-primary mb-3">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{service.availability}</span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                {service.profiles?.phone && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <a href={`tel:${service.profiles.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-[#25D366] border-[#25D366] hover:bg-[#25D366]/10"
                      asChild
                    >
                      <a 
                        href={`https://wa.me/${service.profiles.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in your ${service.title} service.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/provider/${service.provider_id}`)}
                >
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card className="p-8 text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No services found</p>
          </Card>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Jobs;
