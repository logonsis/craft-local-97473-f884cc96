import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ServiceCard from "@/components/ServiceCard";
import GamificationSection from "@/components/GamificationSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  Package, 
  Sprout, 
  Laptop, 
  Home, 
  Car,
  PaintBucket,
  Truck
} from "lucide-react";

const Index = () => {
  const categories = [
    { 
      icon: Wrench, 
      title: "Professional Services", 
      description: "Plumbers, electricians, carpenters & more",
      count: 5420
    },
    { 
      icon: Package, 
      title: "Products & Goods", 
      description: "Buy and sell local products",
      count: 8340
    },
    { 
      icon: Sprout, 
      title: "Farm Produce", 
      description: "Fresh vegetables, fruits & organic items",
      count: 2150
    },
    { 
      icon: Laptop, 
      title: "Digital Services", 
      description: "Web design, content writing & more",
      count: 3280
    },
    { 
      icon: Home, 
      title: "Home Services", 
      description: "Cleaning, moving, repairs & maintenance",
      count: 4590
    },
    { 
      icon: Car, 
      title: "Transport & Delivery", 
      description: "Moving services, delivery & logistics",
      count: 1820
    },
    { 
      icon: PaintBucket, 
      title: "Creative Services", 
      description: "Design, photography, art & crafts",
      count: 2640
    },
    { 
      icon: Truck, 
      title: "Equipment Rental", 
      description: "Tools, machinery & equipment for hire",
      count: 980
    }
  ];

  const featuredProviders = [
    {
      providerName: "John Smith",
      service: "Professional Plumber",
      rating: 4.9,
      reviews: 127,
      location: "Downtown, 2.3 km away",
      availability: "Available Today",
      points: 850,
      price: "$45/hr"
    },
    {
      providerName: "Sarah Johnson",
      service: "Organic Farm Produce",
      rating: 5.0,
      reviews: 89,
      location: "Green Valley, 4.1 km away",
      availability: "Open Now",
      points: 620,
      price: "$Free delivery"
    },
    {
      providerName: "Mike Rodriguez",
      service: "Web Developer",
      rating: 4.8,
      reviews: 156,
      location: "Tech Hub, 1.8 km away",
      availability: "Available Tomorrow",
      points: 940,
      price: "$60/hr"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      
      {/* Categories Section */}
      <section id="categories" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4">Popular Categories</Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              What Are You Looking For?
            </h2>
            <p className="text-lg text-muted-foreground">
              Browse through our wide range of services and products
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Providers Section */}
      <section id="services" className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4">Featured Providers</Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Top Rated Services Near You
            </h2>
            <p className="text-lg text-muted-foreground">
              Connect with trusted professionals in your area
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProviders.map((provider, index) => (
              <ServiceCard key={index} {...provider} />
            ))}
          </div>
        </div>
      </section>

      <GamificationSection />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4">Simple Process</Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              How ConnectNest Works
            </h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up and list your services or browse available offerings
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Connect Directly</h3>
              <p className="text-muted-foreground">
                Contact service providers or customers in your local area
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Complete & Earn</h3>
              <p className="text-muted-foreground">
                Finish the job, get paid, and earn points for your activity
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
