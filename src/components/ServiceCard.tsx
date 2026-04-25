import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Clock, Award, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  providerName: string;
  providerImage?: string;
  service: string;
  rating: number;
  reviews: number;
  location: string;
  availability: string;
  points: number;
  price: string;
  providerId?: string;
}

const ServiceCard = ({
  providerName,
  providerImage,
  service,
  rating,
  reviews,
  location,
  availability,
  points,
  price,
  providerId,
}: ServiceCardProps) => {
  const initials = providerName.split(' ').map(n => n[0]).join('');
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!providerId) return;
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !active) return;
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("provider_id", providerId)
        .maybeSingle();
      if (active) setIsSaved(!!data);
    })();
    return () => { active = false; };
  }, [providerId]);

  const toggleSave = async () => {
    if (!providerId) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to save services");
        navigate("/auth");
        return;
      }
      if (isSaved) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("provider_id", providerId);
        if (error) throw error;
        setIsSaved(false);
        toast.success("Removed from saved");
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, provider_id: providerId });
        if (error) throw error;
        setIsSaved(true);
        toast.success("Service saved");
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not update saved services");
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={providerImage} alt={providerName} />
              <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{providerName}</h3>
              <p className="text-sm text-muted-foreground">{service}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Award className="h-3 w-3" />
              {points}
            </Badge>
            {providerId && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleSave}
                disabled={saving}
                aria-label={isSaved ? "Unsave service" : "Save service"}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-medium">{rating}</span>
            <span className="text-muted-foreground">({reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-medium text-primary">{availability}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div>
            <div className="text-xs text-muted-foreground">Starting from</div>
            <div className="text-xl font-bold text-primary">{price}</div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-secondary/50 p-4 gap-2">
        <Button className="flex-1" size="sm">
          Contact Provider
        </Button>
        {providerId && (
          <Button
            variant={isSaved ? "secondary" : "outline"}
            size="sm"
            onClick={toggleSave}
            disabled={saving}
          >
            <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? "fill-primary text-primary" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
