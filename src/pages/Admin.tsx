import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminRole } from "@/hooks/useAdminRole";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, KeyRound, Search, Copy, Check, Loader2 } from "lucide-react";

interface UserWithProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [resettingUser, setResettingUser] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<{ userId: string; link: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [adminLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get user emails from auth (we'll use a workaround since we can't query auth.users directly)
      // The profiles table id matches auth.users id
      const usersWithProfiles: UserWithProfile[] = (profiles || []).map((profile) => ({
        id: profile.id,
        email: "", // We'll need to fetch this differently
        full_name: profile.full_name,
        created_at: profile.created_at || "",
      }));

      setUsers(usersWithProfiles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId: string, userEmail: string) => {
    if (!userEmail) {
      toast.error("Please enter the user's email address");
      return;
    }

    setResettingUser(userId);
    setGeneratedLink(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in");
        return;
      }

      const { data, error } = await supabase.functions.invoke("admin-reset-password", {
        body: { userId, userEmail },
      });

      if (error) throw error;

      if (data.actionLink) {
        setGeneratedLink({ userId, link: data.actionLink });
        toast.success("Password reset link generated! Share it with the user.");
      } else {
        toast.success("Password reset initiated");
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setResettingUser(null);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users and system settings</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              User Password Management
            </CardTitle>
            <CardDescription>
              Generate password reset links for users. The link can be shared with the user to reset their password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {generatedLink && (
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Password Reset Link Generated:</p>
                <div className="flex items-center gap-2">
                  <Input 
                    value={generatedLink.link} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedLink.link)}
                  >
                    {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Share this link with the user. It will expire after use.
                </p>
              </div>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Email (Enter to Reset)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        onResetPassword={handleResetPassword}
                        isResetting={resettingUser === user.id}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

interface UserRowProps {
  user: UserWithProfile;
  onResetPassword: (userId: string, email: string) => void;
  isResetting: boolean;
}

const UserRow = ({ user, onResetPassword, isResetting }: UserRowProps) => {
  const [email, setEmail] = useState("");

  return (
    <TableRow>
      <TableCell className="font-medium">
        {user.full_name || <span className="text-muted-foreground">No name</span>}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-mono text-xs">
          {user.id.slice(0, 8)}...
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Input
          type="email"
          placeholder="Enter user email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="max-w-[200px]"
        />
      </TableCell>
      <TableCell className="text-right">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onResetPassword(user.id, email)}
          disabled={isResetting || !email}
        >
          {isResetting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <KeyRound className="h-4 w-4 mr-2" />
          )}
          Reset Password
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Admin;