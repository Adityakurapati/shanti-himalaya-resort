"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Mail, Calendar, User, Eye, EyeOff, Trash2, Reply } from "lucide-react"

type Enquiry = {
        id: string
        journey_id: string
        journey_title: string
        name: string
        email: string
        message: string
        status: string
        is_read: boolean
        created_at: string
}

const EnquiriesAdmin = () => {
        const [enquiries, setEnquiries] = useState<Enquiry[]>([])
        const [loading, setLoading] = useState(true)
        const { toast } = useToast()

        useEffect(() => {
                fetchEnquiries()
        }, [])

        const fetchEnquiries = async () => {
                try {
                        const { data, error } = await supabase
                                .from('enquiries')
                                .select('*')
                                .order('created_at', { ascending: false })

                        if (error) throw error
                        setEnquiries(data || [])
                } catch (error) {
                        console.error('Error fetching enquiries:', error)
                        toast({
                                title: "Error",
                                description: "Failed to load enquiries",
                                variant: "destructive",
                        })
                } finally {
                        setLoading(false)
                }
        }

        const markAsRead = async (id: string) => {
                try {
                        const { error } = await supabase
                                .from('enquiries')
                                .update({ is_read: true })
                                .eq('id', id)

                        if (error) throw error

                        setEnquiries(prev => prev.map(enq =>
                                enq.id === id ? { ...enq, is_read: true } : enq
                        ))

                        toast({
                                title: "Success",
                                description: "Enquiry marked as read",
                        })
                } catch (error) {
                        console.error('Error marking enquiry as read:', error)
                        toast({
                                title: "Error",
                                description: "Failed to mark enquiry as read",
                                variant: "destructive",
                        })
                }
        }

        const markAsUnread = async (id: string) => {
                try {
                        const { error } = await supabase
                                .from('enquiries')
                                .update({ is_read: false })
                                .eq('id', id)

                        if (error) throw error

                        setEnquiries(prev => prev.map(enq =>
                                enq.id === id ? { ...enq, is_read: false } : enq
                        ))

                        toast({
                                title: "Success",
                                description: "Enquiry marked as unread",
                        })
                } catch (error) {
                        console.error('Error marking enquiry as unread:', error)
                        toast({
                                title: "Error",
                                description: "Failed to mark enquiry as unread",
                                variant: "destructive",
                        })
                }
        }

        const deleteEnquiry = async (id: string) => {
                if (!confirm('Are you sure you want to delete this enquiry?')) return

                try {
                        const { error } = await supabase
                                .from('enquiries')
                                .delete()
                                .eq('id', id)

                        if (error) throw error

                        setEnquiries(prev => prev.filter(enq => enq.id !== id))

                        toast({
                                title: "Success",
                                description: "Enquiry deleted successfully",
                        })
                } catch (error) {
                        console.error('Error deleting enquiry:', error)
                        toast({
                                title: "Error",
                                description: "Failed to delete enquiry",
                                variant: "destructive",
                        })
                }
        }

        const replyToEnquiry = (customerEmail: string, customerName: string, journeyTitle: string, originalMessage?: string) => {
                const subject = `Re: Your enquiry about ${journeyTitle}`

                let body = `Dear ${customerName},\n\n`
                body += `Thank you for your interest in our "${journeyTitle}" experience.\n\n`

                if (originalMessage) {
                        body += `We have received your enquiry:\n"${originalMessage}"\n\n`
                }

                body += `Our team is reviewing your request and will provide you with detailed information including:\n`
                body += `• Available dates and pricing\n`
                body += `• Detailed itinerary\n`
                body += `• What's included in the package\n`
                body += `• Booking process and requirements\n\n`
                body += `We typically respond within 24 hours. If you have any urgent questions, please feel free to call us at [Your Phone Number].\n\n`
                body += `Looking forward to helping you plan your adventure!\n\n`
                body += `Best regards,\n`
                body += `[Your Name]\n`
                body += `Travel Consultant\n`
                body += `[Your Company Name]\n`
                body += `Phone: [Your Phone Number]\n`
                body += `Email: [Your Email Address]`

                window.open(`mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
        }

        if (loading) {
                return (
                        <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-muted-foreground">Loading enquiries...</p>
                        </div>
                )
        }

        return (
                <div className="space-y-6">
                        <div className="flex justify-between items-center">
                                <div>
                                        <h2 className="text-3xl font-bold">Enquiries Management</h2>
                                        <p className="text-muted-foreground">Manage customer enquiries and respond to them</p>
                                </div>
                                <Badge variant="secondary">
                                        Total: {enquiries.length} | Unread: {enquiries.filter(e => !e.is_read).length}
                                </Badge>
                        </div>

                        <div className="grid gap-6">
                                {enquiries.length === 0 ? (
                                        <Card>
                                                <CardContent className="text-center py-12">
                                                        <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                                        <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                                                                No Enquiries Yet
                                                        </h3>
                                                        <p className="text-muted-foreground">
                                                                Customer enquiries will appear here when they submit forms.
                                                        </p>
                                                </CardContent>
                                        </Card>
                                ) : (
                                        enquiries.map((enquiry) => (
                                                <Card key={enquiry.id} className={!enquiry.is_read ? "border-primary bg-primary/5" : ""}>
                                                        <CardHeader>
                                                                <div className="flex justify-between items-start">
                                                                        <div>
                                                                                <CardTitle className="flex items-center gap-2">
                                                                                        {enquiry.journey_title}
                                                                                        {!enquiry.is_read && (
                                                                                                <Badge variant="default" className="bg-blue-500">New</Badge>
                                                                                        )}
                                                                                </CardTitle>
                                                                                <CardDescription className="flex items-center gap-4 mt-2">
                                                                                        <span className="flex items-center gap-1">
                                                                                                <User className="w-4 h-4" />
                                                                                                {enquiry.name}
                                                                                        </span>
                                                                                        <span className="flex items-center gap-1">
                                                                                                <Mail className="w-4 h-4" />
                                                                                                {enquiry.email}
                                                                                        </span>
                                                                                        <span className="flex items-center gap-1">
                                                                                                <Calendar className="w-4 h-4" />
                                                                                                {new Date(enquiry.created_at).toLocaleDateString()}
                                                                                        </span>
                                                                                </CardDescription>
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={() => replyToEnquiry(
                                                                                                enquiry.email,
                                                                                                enquiry.name,
                                                                                                enquiry.journey_title,
                                                                                                enquiry.message
                                                                                        )}
                                                                                >
                                                                                        <Reply className="w-4 h-4 mr-1" />
                                                                                        Reply
                                                                                </Button>
                                                                                {enquiry.is_read ? (
                                                                                        <Button
                                                                                                variant="outline"
                                                                                                size="sm"
                                                                                                onClick={() => markAsUnread(enquiry.id)}
                                                                                        >
                                                                                                <EyeOff className="w-4 h-4 mr-1" />
                                                                                                Mark Unread
                                                                                        </Button>
                                                                                ) : (
                                                                                        <Button
                                                                                                variant="default"
                                                                                                size="sm"
                                                                                                onClick={() => markAsRead(enquiry.id)}
                                                                                        >
                                                                                                <Eye className="w-4 h-4 mr-1" />
                                                                                                Mark Read
                                                                                        </Button>
                                                                                )}
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={() => deleteEnquiry(enquiry.id)}
                                                                                >
                                                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                                                        Delete
                                                                                </Button>
                                                                        </div>
                                                                </div>
                                                        </CardHeader>
                                                        <CardContent>
                                                                {enquiry.message && (
                                                                        <div className="bg-muted/50 p-4 rounded-lg">
                                                                                <p className="text-sm whitespace-pre-wrap">{enquiry.message}</p>
                                                                        </div>
                                                                )}
                                                        </CardContent>
                                                </Card>
                                        ))
                                )}
                        </div>
                </div>
        )
}

export default EnquiriesAdmin