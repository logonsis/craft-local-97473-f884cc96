import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Phone, MessageSquare, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Booking {
  id: string;
  provider_id: string;
  customer_id: string;
  service_id: string | null;
  customer_name: string;
  customer_phone: string;
  preferred_date: string;
  message: string | null;
  status: string;
  created_at: string;
}

const statusVariant: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
  accepted: { label: "Accepted", className: "bg-green-500/10 text-green-600 dark:text-green-400" },
  declined: { label: "Declined", className: "bg-destructive/10 text-destructive" },
  completed: { label: "Completed", className: "bg-primary/10 text-primary" },
};

const Bookings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("received");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUserId(session.user.id);
    await fetchBookings();
    setLoading(false);
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("preferred_date", { ascending: false });
    if (error) {
      toast({ title: "Failed to load bookings", description: error.message, variant: "destructive" });
    } else {
      setBookings(data || []);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Booking ${status}` });
      fetchBookings();
    }
  };

  const received = bookings.filter((b) => b.provider_id === userId);
  const sent = bookings.filter((b) => b.customer_id === userId);

  const renderList = (list: Booking[], isProvider: boolean) => {
    if (list.length === 0) {
      return (
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No bookings yet</p>
        </Card>
      );
    }
    return (
      <div className="grid gap-4">
        {list.map((b) => {
          const s = statusVariant[b.status] ?? statusVariant.pending;
          return (
            <Card key={b.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{b.customer_name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(b.preferred_date).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={s.className} variant="outline">{s.label}</Badge>
                </div>
                {b.message && (
                  <div className="flex gap-2 text-sm bg-muted/50 p-2 rounded">
                    <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p>{b.message}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${b.customer_phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      {b.customer_phone}
                    </a>
                  </Button>
                  {isProvider && b.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => updateStatus(b.id, "accepted")}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => updateStatus(b.id, "declined")}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                    </>
                  )}
                  {isProvider && b.status === "accepted" && (
                    <Button variant="secondary" size="sm" onClick={() => updateStatus(b.id, "completed")}>
                      Mark Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          Appointments
        </h1>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="received">Received ({received.length})</TabsTrigger>
              <TabsTrigger value="sent">My Requests ({sent.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="received">{renderList(received, true)}</TabsContent>
            <TabsContent value="sent">{renderList(sent, false)}</TabsContent>
          </Tabs>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Bookings;