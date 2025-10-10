import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Clock, Award } from "lucide-react";

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
  price
}: ServiceCardProps) => {
  const initials = providerName.split(' ').map(n => n[0]).join('');
  
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
          <Badge variant="secondary" className="gap-1">
            <Award className="h-3 w-3" />
            {points}
          </Badge>
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
      
      <CardFooter className="bg-secondary/50 p-4">
        <Button className="w-full" size="sm">
          Contact Provider
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
