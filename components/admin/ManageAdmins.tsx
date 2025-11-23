// components/admin/ManageAdmins.tsx
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Users, Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AdminUser {
        id: string
        user_id: string
        email: string
        role: string
        approved: boolean
        created_at: string
}

const ManageAdmins = () => {
        const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
        const [loading, setLoading] = useState(true)
        const [currentUserRole, setCurrentUserRole] = useState<string>("")
        const { toast } = useToast()

        useEffect(() => {
                fetchAdminUsers()
                checkCurrentUserRole()
        }, [])

        const checkCurrentUserRole = async () => {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                        const { data: roleData } = await supabase
                                .from("user_roles")
                                .select("role")
                                .eq("user_id", user.id)
                                .in("role", ["admin", "main_admin"])
                                .single()

                        if (roleData) {
                                setCurrentUserRole(roleData.role)
                        }
                }
        }

        const fetchAdminUsers = async () => {
                try {
                        const { data: adminUsers, error } = await supabase
                                .rpc('get_admin_users_with_emails')

                        if (error) throw error

                        setAdminUsers(adminUsers || [])
                } catch (error: any) {
                        console.error('Error in fetchAdminUsers:', error)
                        toast({
                                title: "Error fetching admin users",
                                description: error.message,
                                variant: "destructive",
                        })
                } finally {
                        setLoading(false)
                }
        }

        const handleRemoveAdmin = async (roleId: string, email: string, role: string) => {
                try {
                        if (role === "main_admin") {
                                toast({
                                        title: "Cannot remove main admin",
                                        description: "Main admin role cannot be removed",
                                        variant: "destructive",
                                })
                                return
                        }

                        const { error } = await supabase
                                .from("user_roles")
                                .delete()
                                .eq("id", roleId)

                        if (error) throw error

                        toast({
                                title: "Admin removed",
                                description: `${email} has been removed from admin role`,
                        })

                        fetchAdminUsers()
                } catch (error: any) {
                        toast({
                                title: "Error removing admin",
                                description: error.message,
                                variant: "destructive",
                        })
                }
        }

        if (loading) {
                return (
                        <div className="flex items-center justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                )
        }

        if (currentUserRole !== "main_admin") {
                return (
                        <Card>
                                <CardHeader>
                                        <CardTitle>Access Denied</CardTitle>
                                </CardHeader>
                                <CardContent>
                                        <p>You need to be a main admin to access this section.</p>
                                </CardContent>
                        </Card>
                )
        }

        return (
                <Card>
                        <CardHeader>
                                <div className="flex items-center gap-2">
                                        <Crown className="h-5 w-5" />
                                        <CardTitle>Manage Admins</CardTitle>
                                </div>
                        </CardHeader>
                        <CardContent>
                                {adminUsers.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-8">No admin users found</p>
                                ) : (
                                        <div className="space-y-4">
                                                {adminUsers.map((user: any) => (
                                                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                                <div className="space-y-1">
                                                                        <div className="flex items-center gap-2">
                                                                                <p className="font-medium">{user.email}</p>
                                                                                {user.role === "main_admin" ? (
                                                                                        <Badge variant="default" className="bg-amber-500">
                                                                                                <Crown className="h-3 w-3 mr-1" />
                                                                                                Main Admin
                                                                                        </Badge>
                                                                                ) : (
                                                                                        <Badge variant="secondary">Admin</Badge>
                                                                                )}
                                                                        </div>
                                                                        <div className="text-sm text-muted-foreground">
                                                                                <span>Added: {new Date(user.created_at).toLocaleDateString()}</span>
                                                                                {!user.approved && (
                                                                                        <Badge variant="outline" className="ml-2">
                                                                                                Pending
                                                                                        </Badge>
                                                                                )}
                                                                        </div>
                                                                </div>
                                                                {user.role !== "main_admin" && (
                                                                        <Button
                                                                                size="sm"
                                                                                variant="destructive"
                                                                                onClick={() => handleRemoveAdmin(user.id, user.email, user.role)}
                                                                        >
                                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                                Remove
                                                                        </Button>
                                                                )}
                                                        </div>
                                                ))}
                                        </div>
                                )}
                        </CardContent>
                </Card>
        )
}

export default ManageAdmins