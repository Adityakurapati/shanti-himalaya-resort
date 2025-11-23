"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { UserPlus } from "lucide-react"

const AdminSignup = () => {
        const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")
        const [confirmPassword, setConfirmPassword] = useState("")
        const [loading, setLoading] = useState(false)
        const router = useRouter()
        const { toast } = useToast()

        const handleSignup = async (e: React.FormEvent) => {
                e.preventDefault()

                if (password !== confirmPassword) {
                        toast({
                                title: "Error",
                                description: "Passwords do not match",
                                variant: "destructive",
                        })
                        return
                }

                if (password.length < 6) {
                        toast({
                                title: "Error",
                                description: "Password must be at least 6 characters",
                                variant: "destructive",
                        })
                        return
                }

                setLoading(true)

                try {
                        const redirectUrl = (process.env.NEXT_SUPABASE_REDIRECT_URL as string) || `${window.location.origin}/`

                        const { data, error } = await supabase.auth.signUp({
                                email,
                                password,
                                options: {
                                        emailRedirectTo: redirectUrl,
                                        // This metadata triggers the DB function to auto-insert a pending admin role row
                                        data: { request_admin: true },
                                },
                        })

                        if (error) {
                                const msg = (error as any)?.message || ""
                                if (msg.includes("already registered") || msg.includes("already exists")) {
                                        // Try to fetch current user (in case they're actually logged in)
                                        const {
                                                data: { user } = { user: null },
                                        } = await supabase.auth.getUser()

                                        if (user) {
                                                // Check if a role exists already
                                                const { data: existingRole } = await supabase
                                                        .from("user_roles")
                                                        .select("*")
                                                        .eq("user_id", user.id)
                                                        .eq("role", "admin")
                                                        .maybeSingle()

                                                if (existingRole) {
                                                        if (existingRole.approved) {
                                                                toast({
                                                                        title: "Already approved",
                                                                        description: "Your admin access has already been approved. Please login.",
                                                                })
                                                                router.push("/admin/login")
                                                        } else {
                                                                toast({
                                                                        title: "Request already exists",
                                                                        description: "Your admin access request is already pending approval.",
                                                                })
                                                                router.push("/admin/login")
                                                        }
                                                        return
                                                }
                                        }

                                        toast({
                                                title: "Account exists",
                                                description:
                                                        "This email is already registered. If you need admin access, please login or contact the main administrator.",
                                                variant: "destructive",
                                        })
                                        return
                                }
                                throw error
                        }

                        if (data?.user) {
                                // In most cases, the DB trigger will have created the pending role already.
                                // Fallback: insert pending role if it isn't there yet (RLS allows inserting your own pending admin row)
                                const { data: existingRole } = await supabase
                                        .from("user_roles")
                                        .select("*")
                                        .eq("user_id", data.user.id)
                                        .eq("role", "admin")
                                        .maybeSingle()

                                if (!existingRole) {
                                        const { error: roleError } = await supabase.from("user_roles").insert({
                                                user_id: data.user.id,
                                                role: "admin",
                                                approved: false,
                                        })

                                        if (roleError) {
                                                toast({
                                                        title: "Partial signup",
                                                        description: "Account created but role assignment failed. Please contact the main administrator.",
                                                        variant: "destructive",
                                                })
                                                await supabase.auth.signOut()
                                                router.push("/admin/login")
                                                return
                                        }
                                }

                                toast({
                                        title: "Request submitted",
                                        description: "Your admin access request has been submitted. Please confirm your email and wait for approval.",
                                })

                                await supabase.auth.signOut()
                                router.push("/admin/login")
                        }
                } catch (error: any) {
                        toast({
                                title: "Signup failed",
                                description: error.message || "An unexpected error occurred. Please try again.",
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
                                                        <button type="button" onClick={() => router.push("/admin/login")} className="text-primary hover:underline">
                                                                Already have access? Login here
                                                        </button>
                                                </div>
                                        </form>
                                </CardContent>
                        </Card>
                </div>
        )
}

export default AdminSignup
