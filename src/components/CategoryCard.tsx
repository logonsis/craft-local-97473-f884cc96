import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  count: number;
}

const CategoryCard = ({ icon: Icon, title, description, count }: CategoryCardProps) => {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="p-6">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="mb-3 text-sm text-muted-foreground">{description}</p>
        <div className="text-xs font-medium text-primary">
          {count.toLocaleString()} listings
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
