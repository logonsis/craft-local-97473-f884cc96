import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Wrench, Zap, Paintbrush, Sparkles, Flower2, Truck, MoreHorizontal } from "lucide-react";

const QuickSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const quickCategories = [
    { name: "Plumbing", icon: Wrench },
    { name: "Electrical", icon: Zap },
    { name: "Painting", icon: Paintbrush },
    { name: "Cleaning", icon: Sparkles },
    { name: "Gardening", icon: Flower2 },
    { name: "Moving", icon: Truck },
    { name: "Other", icon: MoreHorizontal },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/jobs?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="py-8 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-center mb-4">
            Quick Service Search
          </h3>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="What service do you need?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {/* Quick Category Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {quickCategories.map((cat) => (
              <Badge
                key={cat.name}
                variant="outline"
                className="cursor-pointer px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleCategoryClick(cat.name)}
              >
                <cat.icon className="h-4 w-4 mr-2" />
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickSearch;
