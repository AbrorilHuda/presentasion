"use client"

import Image from "next/image"

export default function ImgFit({
  src,
  alt,
  caption,
}: {
  src: string
  alt: string
  caption?: string
}) {
  return (
    <figure className="w-full max-w-full aspect-video bg-black/5 rounded-md overflow-hidden flex items-center justify-center">
      {/* For Next Image, we use fill within a relative container */}
      <div className="relative w-full h-full">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption ? <figcaption className="text-xs text-muted-foreground mt-2 text-center">{caption}</figcaption> : null}
    </figure>
  )
}
