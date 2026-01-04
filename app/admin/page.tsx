"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Package, MapPin, Crown, Compass, Route, Users, Utensils, Mountain, Calendar, Images, Mail, Bell } from "lucide-react"
import JourneysAdmin from "@/components/admin/JourneysAdmin"
import DestinationsAdmin from "@/components/admin/DestinationsAdmin"
import ExperiencesAdmin from "@/components/admin/ExperiencesAdmin"
import PackagesAdmin from "@/components/admin/PackagesAdmin"
import PendingUsersAdmin from "@/components/admin/PendingUsersAdmin"
import { MenuMealsAdmin } from "@/components/admin/MenuMealsAdmin"
import { ResortPackagesAdmin } from "@/components/admin/ResortPackagesAdmin"
import { ResortActivitiesAdmin } from "@/components/admin/ResortActivitiesAdmin"
import ResortGalleryAdmin from "@/components/admin/ResortGalleryAdmin"
import SitemapAdmin from "@/components/admin/SitemapAdmin"
import ManageAdmins from "@/components/admin/ManageAdmins"
import EnquiriesAdmin from "@/components/admin/EnquiriesAdmin"

const AdminPanel = () => {
        const [loading, setLoading] = useState(true)
        const [isAdmin, setIsAdmin] = useState(false)
        const [unreadEnquiries, setUnreadEnquiries] = useState(0)
        const router = useRouter()
        const { toast } = useToast()

        useEffect(() => {
                checkAdminStatus()
        }, [])

        useEffect(() => {
                if (isAdmin) {
                        fetchUnreadEnquiries()
                        // Set up real-time subscription for enquiries
                        const subscription = supabase
                                .channel('enquiries-changes')
                                .on(
                                        'postgres_changes',
                                        {
                                                event: '*',
                                                schema: 'public',
                                                table: 'enquiries'
                                        },
                                        () => {
                                                fetchUnreadEnquiries()
                                        }
                                )
                                .subscribe()

                        return () => {
                                subscription.unsubscribe()
                        }
                }
        }, [isAdmin])

        const fetchUnreadEnquiries = async () => {
                try {
                        const { count, error } = await supabase
                                .from('enquiries')
                                .select('*', { count: 'exact', head: true })
                                .eq('is_read', false)

                        if (error) throw error
                        setUnreadEnquiries(count || 0)
                } catch (error) {
                        console.error('Error fetching unread enquiries:', error)
                }
        }

        const checkAdminStatus = async () => {
                try {
                        const {
                                data: { user },
                        } = await supabase.auth.getUser()

                        if (!user) {
                                router.push("/admin/login")
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
                                router.push("/")
                        } else {
                                toast({
                                        title: "Access denied",
                                        description: "You don't have admin privileges",
                                        variant: "destructive",
                                })
                                router.push("/")
                        }
                } catch (error) {
                        router.push("/admin/login")
                } finally {
                        setLoading(false)
                }
        }

        const handleLogout = async () => {
                await supabase.auth.signOut()
                router.push("/admin/login")
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
                                        <div className="flex items-center space-x-4">
                                                <h1 className="text-2xl font-bold">Admin Panel</h1>
                                                {unreadEnquiries > 0 && (
                                                        <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                                                                <Bell className="h-4 w-4" />
                                                                <span>{unreadEnquiries} new enquiries</span>
                                                        </div>
                                                )}
                                        </div>
                                        <Button onClick={handleLogout} variant="outline">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Logout
                                        </Button>
                                </div>
                        </header>

                        <main className="container mx-auto px-4 py-8">
                                <Tabs defaultValue="enquiries" className="space-y-6">
                                        <TabsList className="grid grid-cols-4 lg:grid-cols-11 w-full">
                                                <TabsTrigger value="enquiries" className="flex items-center gap-2 relative">
                                                        <Mail className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Enquiries</span>
                                                        {unreadEnquiries > 0 && (
                                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                                                        {unreadEnquiries}
                                                                </span>
                                                        )}
                                                </TabsTrigger>
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

                                        <TabsContent value="enquiries">
                                                <EnquiriesAdmin />
                                        </TabsContent>

                                        <TabsContent value="pending">
                                                <PendingUsersAdmin />
                                        </TabsContent>

                                        <TabsContent value="journeys">
                                                <JourneysAdmin />
                                        </TabsContent>

                                        <TabsContent value="manage-admins">
                                                <ManageAdmins />
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