import { cloudflareConfig } from "@/config/cloudflare"

export class CloudflareR2Service {
  private accountId: string
  private bucketName: string
  private publicUrl: string

  constructor() {
    this.accountId = cloudflareConfig.accountId
    this.bucketName = cloudflareConfig.bucketName
    this.publicUrl = cloudflareConfig.publicUrl
  }

  // Upload via API route (recommended for browser usage)
  async uploadImage(file: File): Promise<string> {
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileName", fileName)

      console.log("Uploading file:", fileName, "Size:", file.size, "Type:", file.type)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      console.log("Upload response status:", response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
          console.error("Upload error details:", errorData)
        } catch (parseError) {
          console.error("Could not parse error response:", parseError)
          const errorText = await response.text()
          console.error("Raw error response:", errorText)
          errorMessage = errorText || errorMessage
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("Upload successful:", data)
      return data.url
    } catch (error) {
      console.error("Error uploading to Cloudflare R2:", error)
      throw error
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const fileName = imageUrl.split("/").pop()
    if (!fileName) return

    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName }),
      })

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`)
      }
    } catch (error) {
      console.error("Error deleting from Cloudflare R2:", error)
      throw error
    }
  }
}

export const r2Service = new CloudflareR2Service()
