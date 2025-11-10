import { uploadImageToR2, deleteImageFromR2 } from "@/lib/actions/upload-actions"

export class UploadService {
  async uploadImage(file: File): Promise<string> {
    // Generate unique key for the file
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const key = `${timestamp}-${randomString}-${safeFileName}`

    const formData = new FormData()
    formData.append("file", file)
    formData.append("key", key)

    const result = await uploadImageToR2(formData)

    if (result.success && result.url) {
      return result.url
    } else {
      throw new Error(result.error || "Upload failed")
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl || imageUrl.startsWith("data:") || imageUrl.includes("placeholder.svg")) {
      return // Skip deletion for base64 and placeholder images
    }

    const result = await deleteImageFromR2(imageUrl)
    if (!result.success) {
      console.warn("Failed to delete image:", result.error)
      // Don't throw error for deletion failures
    }
  }
}

export const uploadService = new UploadService()