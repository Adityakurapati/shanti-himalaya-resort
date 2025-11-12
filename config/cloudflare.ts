export const cloudflareClientConfig = {
  accountId: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || "",
  bucketName: process.env.NEXT_PUBLIC_R2_BUCKET_NAME || "",
  publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "",
};

// Server-only secret. Do NOT expose to client.
export const cloudflareSecrets = {
  apiToken: process.env.CLOUDFLARE_API_TOKEN || "",
};
