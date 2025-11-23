"use client"

import Image from "next/image";
import type React from "react"
import { useCallback, useRef, useState } from "react"
import Cropper from "react-easy-crop"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { uploadService } from "@/lib/upload-service"

type Props = {
        label?: string
        value?: string
        onChange: (url: string) => void
        aspect?: number // e.g. 16/9
}

function getCroppedImg(imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }) {
        return new Promise<string>((resolve, reject) => {
                const image = new Image()
                image.crossOrigin = "anonymous"
                image.onload = () => {
                        const canvas = document.createElement("canvas")
                        canvas.width = pixelCrop.width
                        canvas.height = pixelCrop.height
                        const ctx = canvas.getContext("2d")
                        if (!ctx) return reject(new Error("Canvas not supported"))
                        ctx.drawImage(
                                image,
                                pixelCrop.x,
                                pixelCrop.y,
                                pixelCrop.width,
                                pixelCrop.height,
                                0,
                                0,
                                pixelCrop.width,
                                pixelCrop.height,
                        )
                        resolve(canvas.toDataURL("image/jpeg", 0.9))
                }
                image.onerror = reject
                image.src = imageSrc
        })
}

function dataUrlToBlob(dataUrl: string) {
        const arr = dataUrl.split(",")
        const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg"
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) u8arr[n] = bstr.charCodeAt(n)
        return new Blob([u8arr], { type: mime })
}

async function tryUploadToR2(dataUrl: string): Promise<string | null> {
        try {
                const blob = dataUrlToBlob(dataUrl)
                const file = new File([blob], `cropped-image-${Date.now()}.jpg`, { type: "image/jpeg" })
                const url = await uploadService.uploadImage(file)
                return url
        } catch (error) {
                console.error("R2 upload failed:", error)
                return null
        }
}

export const ImageUploader: React.FC<Props> = ({ label = "Image", value, onChange, aspect = 16 / 9 }) => {
        const fileRef = useRef<HTMLInputElement | null>(null)
        const [dialogOpen, setDialogOpen] = useState(false)
        const [localUrl, setLocalUrl] = useState<string>("")
        const [crop, setCrop] = useState({ x: 0, y: 0 })
        const [zoom, setZoom] = useState(1)
        const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
                x: number
                y: number
                width: number
                height: number
        } | null>(null)
        const [uploading, setUploading] = useState(false)

        const onFile = (file?: File) => {
                if (!file) return
                const url = URL.createObjectURL(file)
                setLocalUrl(url)
                setDialogOpen(true)
        }

        const onCropComplete = useCallback((_croppedArea: any, areaPixels: any) => {
                setCroppedAreaPixels(areaPixels)
        }, [])

        const handleApplyCrop = useCallback(async () => {
                if (!croppedAreaPixels || !localUrl) return
                setUploading(true)
                try {
                        const dataUrl = await getCroppedImg(localUrl, croppedAreaPixels)
                        const r2Url = await tryUploadToR2(dataUrl)

                        if (r2Url) {
                                onChange(r2Url)
                                setDialogOpen(false)
                        } else {
                                // Fallback to base64 if R2 upload fails
                                onChange(dataUrl)
                                setDialogOpen(false)
                        }
                } catch (error) {
                        console.error("Error applying crop:", error)
                } finally {
                        setUploading(false)
                }
        }, [croppedAreaPixels, localUrl, onChange])

        const handleDirectUpload = async (file: File) => {
                setUploading(true)
                try {
                        const url = await uploadService.uploadImage(file)
                        onChange(url)
                } catch (error) {
                        console.error("Direct upload failed:", error)
                        // Fallback to crop dialog
                        const url = URL.createObjectURL(file)
                        setLocalUrl(url)
                        setDialogOpen(true)
                } finally {
                        setUploading(false)
                }
        }

        const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0]
                if (!file) return

                // For small files, upload directly without cropping
                if (file.size < 2 * 1024 * 1024) { // 2MB limit for direct upload
                        handleDirectUpload(file)
                } else {
                        // Larger files go to crop dialog
                        onFile(file)
                }
        }

        return (
                <div className="space-y-2">
                        <Label>{label}</Label>
                        <div className="flex items-center gap-2">
                                <Input
                                        value={value || ""}
                                        onChange={(e) => onChange(e.target.value)}
                                        placeholder="https://... or paste image URL"
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
                                        {uploading ? "Uploading..." : "Upload"}
                                </Button>

                                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                        <DialogTrigger asChild>
                                                <Button type="button" variant="secondary" disabled={!localUrl}>
                                                        Crop
                                                </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-5xl max-w-[95vw]">
                                                <DialogHeader>
                                                        <DialogTitle>Crop Image</DialogTitle>
                                                </DialogHeader>
                                                <div className="relative h-[50vh] bg-muted rounded">
                                                        {localUrl ? (
                                                                <Cropper
                                                                        image={localUrl}
                                                                        crop={crop}
                                                                        zoom={zoom}
                                                                        aspect={aspect}
                                                                        onCropChange={setCrop}
                                                                        onZoomChange={setZoom}
                                                                        onCropComplete={onCropComplete}
                                                                />
                                                        ) : (
                                                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                                                        No image selected
                                                                </div>
                                                        )}
                                                </div>
                                                <div className="py-2">
                                                        <Label className="text-xs">Zoom</Label>
                                                        <Slider
                                                                value={[zoom]}
                                                                min={1}
                                                                max={3}
                                                                step={0.1}
                                                                onValueChange={(v) => setZoom(v[0])}
                                                        />
                                                </div>
                                                <div className="flex gap-2">
                                                        <Button
                                                                type="button"
                                                                onClick={handleApplyCrop}
                                                                className="flex-1"
                                                                disabled={uploading || !croppedAreaPixels}
                                                        >
                                                                {uploading ? "Uploading..." : "Apply & Upload"}
                                                        </Button>
                                                        <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => setDialogOpen(false)}
                                                        >
                                                                Cancel
                                                        </Button>
                                                </div>
                                        </DialogContent>
                                </Dialog>
                        </div>

                        {value && (
                                <div className="h-32 w-full rounded overflow-hidden bg-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                                src={value || "/placeholder.svg"}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                        />
                                </div>
                        )}
                </div>
        )
}

export default ImageUploader