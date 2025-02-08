"use client";

import React, { useRef, useEffect } from "react";

interface VideoPlayerProps {
  src: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({
  src,
  title,
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      onProgress?.(progress);

      if (progress >= 99.9) {
        onComplete?.();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [onProgress, onComplete]);

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        controlsList="nodownload"
        title={title}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
