import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-20 lg:py-32">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-accent text-accent-foreground hover:bg-accent/90">
            <TrendingUp className="mr-2 h-3 w-3" />
            Join 10,000+ Active Community Members
          </Badge>
          
          <h1 className="mb-6 text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Connect, Trade & Grow in Your Local Community
          </h1>
          
          <p className="mb-10 text-lg text-primary-foreground/90 md:text-xl">
            Buy services, hire local talent, or sell your skills and products. 
            A trusted marketplace for services, products, and fresh farm produce.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              variant="secondary" 
              className="w-full sm:w-auto"
              onClick={() => navigate("/list-services")}
            >
              <Users className="mr-2 h-5 w-5" />
              List Your Services
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 sm:w-auto"
              onClick={() => navigate("/jobs")}
            >
              <Search className="mr-2 h-5 w-5" />
              Find Services
            </Button>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary-foreground">15K+</div>
              <div className="text-sm text-primary-foreground/80">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary-foreground">5K+</div>
              <div className="text-sm text-primary-foreground/80">Service Providers</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary-foreground">98%</div>
              <div className="text-sm text-primary-foreground/80">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
    </section>
  );
};

export default Hero;
