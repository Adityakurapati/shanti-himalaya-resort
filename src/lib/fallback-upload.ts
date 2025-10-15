export const fallbackUploadService = {
  async uploadImage(file: File): Promise<string> {
    const toDataUrl = (f: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(f)
      })
    return await toDataUrl(file)
  },
  async deleteImage(_imageUrl: string): Promise<void> {
    // no-op for data URLs
    return
  },
}
