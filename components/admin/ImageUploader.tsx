"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { uploadService } from "@/lib/upload-service"

type Props = {
  label?: string
  value?: string
  onChange: (url: string) => void
}

function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('No 2d context'))
      return
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    
    canvas.width = crop.width
    canvas.height = crop.height
    
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'))
          return
        }
        const file = new File([blob], fileName, { type: 'image/jpeg' })
        resolve(file)
      },
      'image/jpeg',
      0.9
    )
  })
}

function dataUrlToBlob(dataUrl: string) {
  try {
    // Ensure the data URL has proper format
    if (!dataUrl.startsWith('data:')) {
      throw new Error('Invalid data URL format')
    }
    
    const arr = dataUrl.split(",")
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg"
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) u8arr[n] = bstr.charCodeAt(n)
    return new Blob([u8arr], { type: mime })
  } catch (error) {
    console.error('Failed to convert data URL to blob:', error)
    throw error
  }
}

async function tryUploadToR2(blob: Blob): Promise<string | null> {
  try {
    const file = new File([blob], `cropped-image-${Date.now()}.jpg`, { type: "image/jpeg" })
    const url = await uploadService.uploadImage(file)
    return url
  } catch (error) {
    console.error("R2 upload failed:", error)
    return null
  }
}

export const ImageUploader: React.FC<Props> = ({ 
  label = "Image", 
  value, 
  onChange
}) => {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [localUrl, setLocalUrl] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [uploading, setUploading] = useState(false)
  const [originalImageSize, setOriginalImageSize] = useState<{width: number, height: number} | null>(null)

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setLocalUrl(url)
    
    setDialogOpen(true)
  }

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setOriginalImageSize({ width, height })
    
    // Set initial crop - 50% of image size by default
    const cropWidth = width * 0.5
    const cropHeight = height * 0.5
    
    // For free ratio, don't use makeAspectCrop with NaN
    // Instead create a simple crop object
    const crop: Crop = {
      unit: 'px',
      x: width * 0.25, // Center horizontally
      y: height * 0.25, // Center vertically
      width: cropWidth,
      height: cropHeight,
    }
    
    setCrop(crop)
  }, [])

  const handleApplyCrop = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !selectedFile) return
    
    // Validate crop values
    if (isNaN(completedCrop.width) || isNaN(completedCrop.height) || 
        completedCrop.width <= 0 || completedCrop.height <= 0) {
      console.error("Invalid crop dimensions:", completedCrop)
      return
    }
    
    setUploading(true)
    try {
      const croppedFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        `cropped-${selectedFile.name}`
      )
      
      // Create blob directly from the cropped file
      const blob = await croppedFile.arrayBuffer().then(buffer => new Blob([buffer], { type: 'image/jpeg' }))
      
      const r2Url = await tryUploadToR2(blob)

      if (r2Url) {
        onChange(r2Url)
        setDialogOpen(false)
        resetState()
      } else {
        // Fallback to base64 - convert blob directly
        const reader = new FileReader()
        reader.onloadend = () => {
          if (reader.result) {
            onChange(reader.result as string)
            setDialogOpen(false)
            resetState()
          }
        }
        reader.onerror = () => {
          console.error("Failed to read file as base64")
          setUploading(false)
        }
        reader.readAsDataURL(croppedFile)
      }
    } catch (error) {
      console.error("Error applying crop:", error)
      setUploading(false)
    }
  }, [completedCrop, selectedFile, onChange])

  const handleDirectUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    try {
      const url = await uploadService.uploadImage(selectedFile)
      onChange(url)
      setDialogOpen(false)
      resetState()
    } catch (error) {
      console.error("Direct upload failed:", error)
      setUploading(false)
    } finally {
      setUploading(false)
    }
  }

  const resetState = () => {
    if (localUrl) {
      URL.revokeObjectURL(localUrl)
    }
    setLocalUrl("")
    setSelectedFile(null)
    setCrop(undefined)
    setCompletedCrop(undefined)
    setOriginalImageSize(null)
    if (fileRef.current) {
      fileRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or paste image URL"
          className="flex-1"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileInputChange}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload & Crop"}
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open)
        if (!open) {
          resetState()
        }
      }}>
        <DialogContent className="sm:max-w-5xl max-w-[95vw] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          
          <div className="px-6">
            <div className="text-sm text-muted-foreground mb-4">
              Drag edges or corners to resize • Drag inside to move
            </div>
            
            {/* Crop Area */}
            <div className="relative bg-gray-100 rounded-lg border border-gray-300 overflow-hidden">
              {localUrl ? (
                <div className="max-h-[500px] overflow-auto">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => {
                      // Validate crop values before setting
                      if (percentCrop.width > 0 && percentCrop.height > 0) {
                        setCrop(percentCrop)
                      }
                    }}
                    onComplete={(c) => {
                      // Only set completed crop if valid
                      if (c.width > 0 && c.height > 0) {
                        setCompletedCrop(c)
                      }
                    }}
                    aspect={undefined} // Free ratio
                    circularCrop={false}
                    className="max-h-[500px]"
                    keepSelection={true}
                    minWidth={50}
                    minHeight={50}
                  >
                    <img
                      ref={imgRef}
                      src={localUrl}
                      alt="Crop preview"
                      style={{ maxWidth: '100%' }}
                      onLoad={onImageLoad}
                      crossOrigin="anonymous"
                    />
                  </ReactCrop>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-sm text-muted-foreground">
                  Loading image...
                </div>
              )}
              
              {/* Info overlays */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Free Ratio
              </div>
              
              {originalImageSize && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {originalImageSize.width} × {originalImageSize.height}
                </div>
              )}
              
              {completedCrop && (
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Crop: {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)} px
                </div>
              )}
            </div>
          </div>

          <div className="px-6 space-y-4 pb-6">
            <div className="text-sm text-muted-foreground">
              <strong>How to use:</strong> Click and drag any edge or corner to resize. Drag inside the box to move.
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={handleApplyCrop}
                className="flex-1"
                disabled={uploading || !completedCrop}
              >
                {uploading ? "Uploading..." : "Apply Crop & Upload"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDirectUpload}
                disabled={uploading || !selectedFile}
              >
                Upload Original
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setDialogOpen(false)
                  resetState()
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {value && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm">Preview</Label>
            {value.startsWith('data:') && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                Using base64 (upload failed)
              </span>
            )}
          </div>
          <div className="h-48 w-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border">
            <img
              src={value || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-full object-contain"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader