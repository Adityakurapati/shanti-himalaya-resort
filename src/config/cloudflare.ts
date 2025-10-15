export const cloudflareConfig = {
  accountId: import.meta.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || "",
  bucketName: import.meta.env.NEXT_PUBLIC_R2_BUCKET_NAME || "",
  publicUrl: import.meta.env.NEXT_PUBLIC_R2_PUBLIC_URL || "",
}

// Server-only secret. Do NOT expose to client.
export const cloudflareSecrets = {
  apiToken: import.meta.env.CLOUDFLARE_API_TOKEN || "",
}
