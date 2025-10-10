import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

const AdminSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        // Check if user already exists
        if (error.message.includes("already registered") || error.message.includes("already exists")) {
          // Try to find the user and check if they have a user_role entry
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Check if user_role exists
            const { data: existingRole } = await supabase
              .from("user_roles")
              .select("*")
              .eq("user_id", user.id)
              .eq("role", "admin")
              .single();

            if (existingRole) {
              if (existingRole.approved) {
                toast({
                  title: "Already approved",
                  description: "Your admin access has already been approved. Please login.",
                });
                navigate("/admin/login");
              } else {
                toast({
                  title: "Request already exists",
                  description: "Your admin access request is already pending approval.",
                });
                navigate("/admin/login");
              }
              return;
            }
          }
          
          // If we get here, the auth user exists but no role entry - show helpful error
          toast({
            title: "Account exists",
            description: "This email is already registered. If you need admin access, please contact the main administrator or try logging in.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (data?.user) {
        // Check if user_role already exists (in case of race condition)
        const { data: existingRole } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (existingRole) {
          toast({
            title: "Request already exists",
            description: "Your admin access request is already pending approval.",
          });
          await supabase.auth.signOut();
          navigate("/admin/login");
          return;
        }

        // Create an unapproved admin role request
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: data.user.id,
            role: "admin",
            approved: false
          });

        if (roleError) {
          console.error("Role creation error:", roleError);
          toast({
            title: "Partial signup",
            description: "Account created but role assignment failed. Please contact the administrator.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          navigate("/admin/login");
          return;
        }

        toast({
          title: "Request submitted",
          description: "Your admin access request has been submitted. Please wait for approval from the main administrator.",
        });
        
        await supabase.auth.signOut();
        navigate("/admin/login");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Request Admin Access</CardTitle>
          <CardDescription>
            Submit a request to become an administrator. Your request will be reviewed by the main admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting request..." : "Request Admin Access"}
            </Button>
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => navigate("/admin/login")}
                className="text-primary hover:underline"
              >
                Already have access? Login here
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignup;
