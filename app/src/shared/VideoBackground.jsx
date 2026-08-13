import { useEffect, useRef, useState } from 'react'

const FALLBACK_BG = 'linear-gradient(135deg, #2d6a5f 0%, #1d4a3f 100%)'

function Overlay({ gradient }) {
  return <div className="pointer-events-none absolute inset-0 z-[1] backdrop-blur-[2px]" style={{ background: gradient }} />
}

export default function VideoBackground({ overlayGradient }) {
  const videoRef = useRef(null)
  const [showVideo, setShowVideo] = useState(true)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowVideo(false)
      return
    }
    const conn = navigator.connection?.effectiveType
    if (conn === '2g' || conn === 'slow-2g') setShowVideo(false)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !showVideo) return

    const play = () => video.play().catch(() => {})
    play()

    const onVisibility = () => {
      if (document.hidden) video.pause()
      else play()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [showVideo])

  if (!showVideo || videoFailed) {
    return (
      <div className="fixed inset-0 -z-10" style={{ background: FALLBACK_BG }}>
        <Overlay gradient={overlayGradient} />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: FALLBACK_BG }}>
      <video
        ref={videoRef}
        className="absolute left-1/2 top-1/2 h-auto w-auto min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setVideoFailed(true)}
      >
        <source src="https://cdn.pixabay.com/video/2016/03/29/2569-160748715_large.mp4" type="video/mp4" />
      </video>
      <Overlay gradient={overlayGradient} />
    </div>
  )
}
