import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import TimeManagement from "@/components/TimeManagement";
import ServiceManagement from "@/components/ServiceManagement";
import BottomNav from "@/components/BottomNav";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Star,
  Edit2,
  Camera
} from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    fetchProfile(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      fetchProfile(profile.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getInitials = () => {
    if (!formData.full_name) return "U";
    return formData.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-20">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4 w-32 h-32">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-primary-foreground">
                    {getInitials()}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <CardTitle className="text-2xl">{formData.full_name || "User"}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-1 mt-2">
                  <MapPin className="h-4 w-4" />
                  {formData.location || "Location not set"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Availability Status</span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isAvailable}
                      onCheckedChange={setIsAvailable}
                    />
                    <span className="text-sm text-muted-foreground">
                      {isAvailable ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.phone || "No phone number"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.id || "No email"}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Plumbing</Badge>
                    <Badge variant="secondary">Electrical</Badge>
                    <Badge variant="secondary">Carpentry</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gamification Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Points</span>
                  <span className="text-2xl font-bold text-accent">1,250</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed Jobs</span>
                  <span className="text-xl font-semibold">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-accent text-accent-foreground">
                      🥇 Gold Member
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    250 points to Platinum level
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your profile and availability schedule
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Basic Info</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input
                          id="fullname"
                          placeholder="Your full name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={profile?.id || ""}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="City, State"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself and your services..."
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    {isEditing && (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => {
                          setIsEditing(false);
                          if (profile) {
                            setFormData({
                              full_name: profile.full_name || "",
                              phone: profile.phone || "",
                              location: profile.location || "",
                              bio: profile.bio || "",
                            });
                          }
                        }}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="schedule" className="pt-4">
                    <TimeManagement />
                  </TabsContent>

                  <TabsContent value="services" className="space-y-4 pt-4">
                    <ServiceManagement />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Activity History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest jobs and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Completed plumbing repair", time: "2 hours ago", points: "+50 points" },
                    { title: "New service listing added", time: "1 day ago", points: "+20 points" },
                    { title: "Received 5-star review", time: "3 days ago", points: "+30 points" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                      <span className="text-sm font-semibold text-accent">{activity.points}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
      <BottomNav />
    </div>
  );
};

export default Profile;
