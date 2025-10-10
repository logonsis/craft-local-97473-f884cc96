import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, Target, Zap } from "lucide-react";

const GamificationSection = () => {
  const badges = [
    { icon: Award, name: "Rising Star", points: 100, color: "text-accent" },
    { icon: Trophy, name: "Top Provider", points: 500, color: "text-amber-500" },
    { icon: Target, name: "Quick Responder", points: 250, color: "text-emerald-500" },
    { icon: Zap, name: "Super Active", points: 750, color: "text-purple-500" }
  ];

  return (
    <section className="bg-secondary/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl text-center">
          <Badge className="mb-4 bg-accent text-accent-foreground">Gamification</Badge>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Earn Rewards for Being Active
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Build your reputation and stand out from the crowd. Points help you win when multiple providers are available!
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map((badge, index) => (
              <Card key={index} className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    <badge.icon className={`h-8 w-8 ${badge.color}`} />
                  </div>
                  <CardTitle className="text-lg">{badge.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{badge.points}</div>
                  <div className="text-xs text-muted-foreground">Points Required</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 rounded-lg border bg-card p-8">
            <h3 className="mb-4 text-xl font-semibold">How Points Work</h3>
            <div className="grid gap-6 text-left sm:grid-cols-3">
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">+10</div>
                <div className="text-sm text-muted-foreground">Complete a job successfully</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">+5</div>
                <div className="text-sm text-muted-foreground">Quick response (under 1 hour)</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">+15</div>
                <div className="text-sm text-muted-foreground">5-star rating received</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;
