import { r2Service } from "@/lib/cloudflare-r2"
import { fallbackUploadService } from "./fallback-upload"

export class UploadService {
  async uploadImage(file: File): Promise<string> {
    try {
      // Try Cloudflare R2 via API route
      return await r2Service.uploadImage(file)
    } catch (r2Error) {
      console.warn("Cloudflare R2 upload failed, using fallback:", r2Error)

      // Use fallback service (base64 or placeholder)
      return await fallbackUploadService.uploadImage(file)
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      if (imageUrl.includes("placeholder.svg") || imageUrl.startsWith("data:")) {
        // It's a fallback image, use fallback service
        return await fallbackUploadService.deleteImage(imageUrl)
      } else {
        // It's a real uploaded image, use R2 service
        return await r2Service.deleteImage(imageUrl)
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      // Don't throw error for deletion failures
    }
  }
}

export const uploadService = new UploadService()
