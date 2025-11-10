"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function SitemapAdmin() {
  const { toast } = useToast()
  const [counts, setCounts] = useState({ journeys: 0, destinations: 0, experiences: 0, blogs: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void fetchCounts()
  }, [])

  async function fetchCounts() {
    const [j, d, e, b] = await Promise.all([
      supabase.from("journeys").select("id", { count: "exact", head: true }),
      supabase.from("destinations").select("id", { count: "exact", head: true }),
      supabase.from("experiences").select("id", { count: "exact", head: true }),
      supabase.from("packages").select("id", { count: "exact", head: true }),
    ])
    setCounts({
      journeys: j.count || 0,
      destinations: d.count || 0,
      experiences: e.count || 0,
      blogs: b.count || 0,
    })
  }

  async function generateAndDownload() {
    setLoading(true)
    try {
      const base = window.location.origin
      const [journeys, destinations, experiences, blogs] = await Promise.all([
        supabase.from("journeys").select("slug,updated_at"),
        supabase.from("destinations").select("slug,updated_at"),
        supabase.from("experiences").select("slug,updated_at"),
        supabase.from("packages").select("id,updated_at"),
      ])

      const urls: { loc: string; lastmod?: string }[] = [
        { loc: `${base}/` },
        { loc: `${base}/journeys` },
        { loc: `${base}/destinations` },
        { loc: `${base}/experiences` },
        { loc: `${base}/blog` },
      ]

      journeys.data?.forEach((x: any) => urls.push({ loc: `${base}/journeys/${x.slug}`, lastmod: x.updated_at }))
      destinations.data?.forEach((x: any) =>
        urls.push({ loc: `${base}/destinations/${x.slug}`, lastmod: x.updated_at }),
      )
      experiences.data?.forEach((x: any) => urls.push({ loc: `${base}/experiences/${x.slug}`, lastmod: x.updated_at }))
      blogs.data?.forEach((x: any) => urls.push({ loc: `${base}/blog/${x.id}`, lastmod: x.updated_at }))

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
        .map(
          (u) =>
            `  <url>\n    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ""}\n  </url>`,
        )
        .join("\n")}\n</urlset>`

      const blob = new Blob([xml], { type: "application/xml" })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = "sitemap.xml"
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast({ title: "Sitemap generated", description: "Downloaded sitemap.xml" })
    } catch (e: any) {
      toast({ title: "Error generating sitemap", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Sitemap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Journeys: {counts.journeys} • Destinations: {counts.destinations} • Experiences: {counts.experiences} • Blog:{" "}
          {counts.blogs}
        </div>
        <Button onClick={generateAndDownload} disabled={loading}>
          {loading ? "Generating..." : "Download sitemap.xml"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Upload sitemap.xml to your domain root or search console. We can automate this with a small signing endpoint
          if you prefer.
        </p>
      </CardContent>
    </Card>
  )
}
