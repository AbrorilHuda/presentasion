"use client"

export default function Video({
  url,
  autoplay = true,
  muted = true,
  loop = true,
  controls = true,
  poster,
  caption,
}: {
  url: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  poster?: string
  caption?: string
}) {
  return (
    <figure className="w-full max-w-full aspect-video bg-black/5 rounded-md overflow-hidden">
      <video
        className="w-full h-full object-contain"
        src={url}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
        poster={poster}
      />
      {caption ? <figcaption className="text-xs text-muted-foreground mt-2 text-center">{caption}</figcaption> : null}
    </figure>
  )
}
