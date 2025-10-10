"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Lock } from "lucide-react"

const AdminLogin = () => {
        const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")
        const [loading, setLoading] = useState(false)
        const navigate = useNavigate()
        const { toast } = useToast()

        const handleLogin = async (e: React.FormEvent) => {
                e.preventDefault()
                setLoading(true)

                try {
                        const { error } = await supabase.auth.signInWithPassword({
                                email,
                                password,
                        })

                        if (error) {
                                const msg = (error as any)?.message || ""
                                const friendly = msg.toLowerCase().includes("email not confirmed")
                                        ? "Please confirm your email before logging in."
                                        : "Invalid email or password."
                                throw new Error(friendly)
                        }

                        // Fetch the authenticated user and check their role by user_id
                        const { data: userRes, error: userErr } = await supabase.auth.getUser()
                        if (userErr || !userRes?.user) {
                                await supabase.auth.signOut()
                                throw new Error("Could not retrieve authenticated user.")
                        }

                        const userId = userRes.user.id

                        const { data: roleData, error: roleErr } = await supabase
                                .from("user_roles")
                                .select("role, approved")
                                .eq("user_id", userId)
                                .in("role", ["admin", "main_admin"])
                                .maybeSingle()

                        if (roleErr) {
                                await supabase.auth.signOut()
                                throw new Error("Unable to check admin role.")
                        }

                        if (roleData && roleData.approved && (roleData.role === "admin" || roleData.role === "main_admin")) {
                                toast({
                                        title: "Login successful",
                                        description: "Welcome to the admin panel",
                                })
                                navigate("/admin")
                        } else if (roleData && !roleData.approved) {
                                await supabase.auth.signOut()
                                toast({
                                        title: "Approval pending",
                                        description: "Your admin access is pending approval.",
                                        variant: "destructive",
                                })
                        } else {
                                await supabase.auth.signOut()
                                toast({
                                        title: "Access denied",
                                        description: "You don't have admin privileges.",
                                        variant: "destructive",
                                })
                        }
                } catch (error: any) {
                        toast({
                                title: "Login failed",
                                description: error.message || "An unexpected error occurred.",
                                variant: "destructive",
                        })
                } finally {
                        setLoading(false)
                }
        }

        return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10 p-4">
                        <Card className="w-full max-w-md">
                                <CardHeader className="space-y-1 text-center">
                                        <div className="flex justify-center mb-4">
                                                <div className="p-3 bg-primary/10 rounded-full">
                                                        <Lock className="h-6 w-6 text-primary" />
                                                </div>
                                        </div>
                                        <CardTitle className="text-2xl">Admin Login</CardTitle>
                                        <CardDescription>Enter your credentials to access the admin panel</CardDescription>
                                </CardHeader>
                                <CardContent>
                                        <form onSubmit={handleLogin} className="space-y-4">
                                                <div className="space-y-2">
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input
                                                                id="email"
                                                                type="email"
                                                                placeholder="admin@example.com"
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
                                                        />
                                                </div>
                                                <Button type="submit" className="w-full" disabled={loading}>
                                                        {loading ? "Logging in..." : "Login"}
                                                </Button>
                                        </form>
                                        <div className="mt-4 text-center text-sm">
                                                <span className="text-muted-foreground">Need access? </span>
                                                <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/admin/signup")}>
                                                        Request admin access
                                                </Button>
                                        </div>
                                </CardContent>
                        </Card>
                </div>
        )
}

export default AdminLogin
