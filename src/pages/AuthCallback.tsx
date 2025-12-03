import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus("error");
          setErrorMessage(error.message);
          return;
        }

        if (data.session) {
          setStatus("success");
        } else {
          // Check URL for error parameters
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const errorDescription = hashParams.get("error_description");
          
          if (errorDescription) {
            setStatus("error");
            setErrorMessage(errorDescription);
          } else {
            setStatus("success");
          }
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage("An unexpected error occurred");
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Verifying your email...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your account.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Email Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Your email has been verified successfully. You can now access all features of BICO.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Continue to BICO
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
            <p className="text-muted-foreground mb-6">
              {errorMessage || "The confirmation link may have expired or is invalid."}
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate("/auth")} className="w-full">
                Back to Sign In
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} className="w-full">
                Go to Home
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
