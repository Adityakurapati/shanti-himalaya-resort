"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Check, X, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PendingUser {
  id: string
  user_id: string
  role: string
  approved: boolean
  created_at: string
  email: string
  user_created_at: string
}

const UserApproval = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      const { data, error } = await supabase.rpc("get_pending_admin_requests")

      if (error) throw error
      setPendingUsers(data || [])
    } catch (error: any) {
      toast({
        title: "Error loading pending users",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (roleId: string, approve: boolean, role?: string) => {
    try {
      if (role === "main_admin") {
        toast({
          title: "Not allowed",
          description: "Main admin cannot be modified.",
          variant: "destructive",
        })
        return
      }

      if (approve) {
        const { error } = await supabase.from("user_roles").update({ approved: true }).eq("id", roleId)
        if (error) throw error
        toast({ title: "User approved", description: "The user can now access the admin panel" })
      } else {
        const { error } = await supabase.from("user_roles").delete().eq("id", roleId)
        if (error) throw error
        toast({ title: "Request rejected", description: "The user's request has been denied" })
      }

      fetchPendingUsers()
    } catch (error: any) {
      toast({
        title: "Error processing request",
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
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Pending Admin Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingUsers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No pending requests</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{user.email}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{user.role}</Badge>
                    <span>Requested: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {user.role === "main_admin" ? (
                    <Badge variant="secondary">Main Admin</Badge>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700 bg-transparent"
                        onClick={() => handleApproval(user.id, true, user.role)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleApproval(user.id, false, user.role)}
                      >
                        <X className="h-4 w-4 mr-1" />
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

export default UserApproval
