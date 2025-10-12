"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Package, Crown, MapPin, Compass, Route, Users, Utensils, Mountain, Calendar, Images } from "lucide-react"
import JourneysAdmin from "@/components/admin/JourneysAdmin"
import DestinationsAdmin from "@/components/admin/DestinationsAdmin"
import ExperiencesAdmin from "@/components/admin/ExperiencesAdmin"
import PackagesAdmin from "@/components/admin/PackagesAdmin"
import PendingUsersAdmin from "@/components/admin/PendingUsersAdmin"
import { MenuMealsAdmin } from "@/components/admin/MenuMealsAdmin"
import { ResortPackagesAdmin } from "@/components/admin/ResortPackagesAdmin"
import { ResortActivitiesAdmin } from "@/components/admin/ResortActivitiesAdmin"
import ResortGalleryAdmin from "@/components/admin/ResortGalleryAdmin"
import ManageAdmins from "@/components/admin/ManageAdmins"


const AdminPanel = () => {
        const [loading, setLoading] = useState(true)
        const [isAdmin, setIsAdmin] = useState(false)
        const navigate = useNavigate()
        const { toast } = useToast()

        useEffect(() => {
                checkAdminStatus()
        }, [])

        // Update the checkAdminStatus function in AdminPanel.tsx
        const checkAdminStatus = async () => {
                try {
                        const {
                                data: { user },
                        } = await supabase.auth.getUser()

                        if (!user) {
                                navigate("/admin/login")
                                return
                        }

                        // Check if email is confirmed
                        if (!user.email_confirmed_at) {
                                toast({
                                        title: "Email not confirmed",
                                        description: "Please check your email and confirm your account before accessing admin panel",
                                        variant: "destructive",
                                })
                                await supabase.auth.signOut()
                                navigate("/admin/login")
                                return
                        }

                        const { data: roleData } = await supabase
                                .from("user_roles")
                                .select("role, approved")
                                .eq("user_id", user.id)
                                .in("role", ["admin", "main_admin"])
                                .maybeSingle()

                        if (roleData && roleData.approved && (roleData.role === "admin" || roleData.role === "main_admin")) {
                                setIsAdmin(true)
                        } else if (roleData && !roleData.approved) {
                                toast({
                                        title: "Pending approval",
                                        description: "Your admin access request is pending approval",
                                        variant: "destructive",
                                })
                                await supabase.auth.signOut()
                                navigate("/")
                        } else {
                                toast({
                                        title: "Access denied",
                                        description: "You don't have admin privileges",
                                        variant: "destructive",
                                })
                                navigate("/")
                        }
                } catch (error) {
                        navigate("/admin/login")
                } finally {
                        setLoading(false)
                }
        }

        const handleLogout = async () => {
                await supabase.auth.signOut()
                navigate("/admin/login")
        }

        if (loading) {
                return (
                        <div className="min-h-screen flex items-center justify-center">
                                <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                        <p className="mt-4 text-muted-foreground">Loading...</p>
                                </div>
                        </div>
                )
        }

        if (!isAdmin) return null

        return (
                <div className="min-h-screen bg-background">
                        <header className="border-b bg-card">
                                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                                        <h1 className="text-2xl font-bold">Admin Panel</h1>
                                        <Button onClick={handleLogout} variant="outline">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Logout
                                        </Button>
                                </div>
                        </header>

                        <main className="container mx-auto px-4 py-8">
                                <Tabs defaultValue="pending" className="space-y-6">
                                        <TabsList className="grid grid-cols-4 lg:grid-cols-9 w-full">

                                                <TabsTrigger value="journeys" className="flex items-center gap-2">
                                                        <Route className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Journeys</span>
                                                </TabsTrigger>
                                                <TabsTrigger value="destinations" className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Destinations</span>
                                                </TabsTrigger>
                                                <TabsTrigger value="experiences" className="flex items-center gap-2">
                                                        <Compass className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Experiences</span>
                                                </TabsTrigger>
                                                <TabsTrigger value="blogs" className="flex items-center gap-2">
                                                        <Package className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Blogs</span>
                                                </TabsTrigger>
                                                <TabsTrigger value="meals" className="flex items-center gap-2">
                                                        <Utensils className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Meals</span>
                                                </TabsTrigger>
                                                <TabsTrigger value="packages" className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Packages</span>
                                                </TabsTrigger>
                                                <TabsTrigger value="activities" className="flex items-center gap-2">
                                                        <Mountain className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Activities</span>
                                                </TabsTrigger>
                                                <TabsTrigger value="gallery" className="flex items-center gap-2">
                                                        <Images className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Gallery</span>
                                                </TabsTrigger>
                                                <TabsTrigger value="manage-admins" className="flex items-center gap-2">
                                                        <Crown className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Manage Admins</span>
                                                </TabsTrigger>
                                                <TabsTrigger value="pending" className="flex items-center gap-2">
                                                        <Users className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Pending</span>
                                                </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="pending">
                                                <PendingUsersAdmin />
                                        </TabsContent>

                                        <TabsContent value="manage-admins">
                                                <ManageAdmins />
                                        </TabsContent>

                                        <TabsContent value="journeys">
                                                <JourneysAdmin />
                                        </TabsContent>

                                        <TabsContent value="destinations">
                                                <DestinationsAdmin />
                                        </TabsContent>

                                        <TabsContent value="experiences">
                                                <ExperiencesAdmin />
                                        </TabsContent>

                                        <TabsContent value="blogs">
                                                <PackagesAdmin />
                                        </TabsContent>

                                        <TabsContent value="meals">
                                                <MenuMealsAdmin />
                                        </TabsContent>

                                        <TabsContent value="packages">
                                                <ResortPackagesAdmin />
                                        </TabsContent>

                                        <TabsContent value="activities">
                                                <ResortActivitiesAdmin />
                                        </TabsContent>

                                        <TabsContent value="gallery">
                                                <ResortGalleryAdmin />
                                        </TabsContent>
                                </Tabs>
                        </main>
                </div>
        )
}

export default AdminPanel
