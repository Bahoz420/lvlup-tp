"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface OptimizedVideoProps {
  src: string
  poster?: string
  width?: number
  height?: number
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  preload?: "auto" | "metadata" | "none"
  className?: string
  lazyLoad?: boolean
  playbackRate?: number
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedVideo({
  src,
  poster,
  width,
  height,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  preload = "metadata",
  className,
  lazyLoad = true,
  playbackRate = 1,
  onLoad,
  onError,
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(!lazyLoad)

  useEffect(() => {
    if (!videoRef.current || !lazyLoad) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" },
    )

    observer.observe(videoRef.current)

    return () => observer.disconnect()
  }, [lazyLoad])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoad = () => {
      setIsLoaded(true)
      onLoad?.()
    }

    const handleError = () => {
      onError?.()
    }

    video.addEventListener("loadeddata", handleLoad)
    video.addEventListener("error", handleError)

    // Setze Playback-Rate
    if (video.readyState >= 2) {
      video.playbackRate = playbackRate
    } else {
      video.addEventListener("canplay", () => {
        video.playbackRate = playbackRate
      })
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoad)
      video.removeEventListener("error", handleError)
    }
  }, [onLoad, onError, playbackRate])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <video
        ref={videoRef}
        width={width}
        height={height}
        poster={poster}
        autoPlay={isVisible && autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        preload={isVisible ? preload : "none"}
        playsInline
        className={cn("w-full h-auto transition-opacity duration-300", isLoaded ? "opacity-100" : "opacity-0")}
      >
        {isVisible && (
          <>
            {/* MP4-Quelle für maximale Kompatibilität */}
            <source src={src} type="video/mp4" />
            {/* WebM-Quelle für bessere Kompression in unterstützten Browsern */}
            {src.replace(/\.mp4$/, ".webm") && <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />}
            Ihr Browser unterstützt das Video-Tag nicht.
          </>
        )}
      </video>
    </div>
  )
}
