"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PendingUser {
  id: string
  user_id: string
  email: string
  role: string
  created_at: string
  user_created_at: string
}

const PendingUsersAdmin = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPendingUsers()

    const channel = supabase
      .channel("user-roles-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_roles",
        },
        () => {
          fetchPendingUsers()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchPendingUsers = async () => {
    try {
      const { data, error } = await supabase.rpc("get_pending_admin_requests")

      if (error) throw error
      setPendingUsers(data || [])
    } catch (error: any) {
      toast({
        title: "Error fetching pending users",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (roleId: string, role?: string) => {
    try {
      if (role === "main_admin") {
        toast({
          title: "Not allowed",
          description: "Main admin cannot be modified.",
          variant: "destructive",
        })
        return
      }
      const { error } = await supabase.from("user_roles").update({ approved: true }).eq("id", roleId)

      if (error) throw error

      toast({
        title: "User approved",
        description: "The user can now access the admin panel",
      })

      fetchPendingUsers()
    } catch (error: any) {
      toast({
        title: "Error approving user",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleReject = async (roleId: string, role?: string) => {
    try {
      if (role === "main_admin") {
        toast({
          title: "Not allowed",
          description: "Main admin cannot be modified.",
          variant: "destructive",
        })
        return
      }
      const { error } = await supabase.from("user_roles").delete().eq("id", roleId)

      if (error) throw error

      toast({
        title: "Request rejected",
        description: "The admin access request has been rejected",
      })

      fetchPendingUsers()
    } catch (error: any) {
      toast({
        title: "Error rejecting user",
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Pending Admin Requests</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {pendingUsers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No pending admin requests</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{user.email}</p>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{user.role}</Badge>
                    <span>Requested: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {user.role === "main_admin" ? (
                    <Badge variant="secondary">Main Admin</Badge>
                  ) : (
                    <>
                      <Button size="sm" variant="default" onClick={() => handleApprove(user.id, user.role)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(user.id, user.role)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PendingUsersAdmin
