import { useState } from "react";
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

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4 w-32 h-32">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-primary-foreground">
                    JD
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <CardTitle className="text-2xl">John Doe</CardTitle>
                <CardDescription className="flex items-center justify-center gap-1 mt-2">
                  <MapPin className="h-4 w-4" />
                  Kerala, India
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
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>john.doe@example.com</span>
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
                          defaultValue="John Doe"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          defaultValue="+91 98765 43210"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          defaultValue="john.doe@example.com"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="City, State"
                          defaultValue="Kerala, India"
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
                        defaultValue="Experienced service provider with 10+ years in multiple trades. Committed to quality work and customer satisfaction."
                        disabled={!isEditing}
                      />
                    </div>
                    {isEditing && (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsEditing(false)}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="schedule" className="pt-4">
                    <TimeManagement />
                  </TabsContent>

                  <TabsContent value="services" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">My Services</h3>
                        <Button size="sm">Add Service</Button>
                      </div>
                      <div className="grid gap-4">
                        {[
                          { name: "Plumbing Repairs", rate: "₹500/hr", status: "Active" },
                          { name: "Electrical Work", rate: "₹600/hr", status: "Active" },
                          { name: "Carpentry", rate: "₹450/hr", status: "Inactive" },
                        ].map((service, index) => (
                          <Card key={index}>
                            <CardContent className="flex items-center justify-between p-4">
                              <div>
                                <h4 className="font-medium">{service.name}</h4>
                                <p className="text-sm text-muted-foreground">{service.rate}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={service.status === "Active" ? "default" : "secondary"}>
                                  {service.status}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
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
    </div>
  );
};

export default Profile;
