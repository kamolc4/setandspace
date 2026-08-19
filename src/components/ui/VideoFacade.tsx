"use client";

import { useState, useId } from "react";
import Image from "next/image";
import type { VideoProvider } from "@/data/projects";

interface VideoFacadeProps {
  provider: VideoProvider;
  videoId: string | null;
  posterSrc?: string;
  posterAlt: string;
  title: string;
  aspectRatio?: "16/9" | "9/16" | "4/3" | "1/1";
  className?: string;
}

function getEmbedUrl(provider: VideoProvider, id: string): string {
  if (provider === "vimeo") {
    return `https://player.vimeo.com/video/${id}?autoplay=1&color=A6856B&title=0&byline=0&portrait=0`;
  }
  if (provider === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  }
  return "";
}

export default function VideoFacade({
  provider,
  videoId,
  posterSrc,
  posterAlt,
  title,
  aspectRatio = "16/9",
  className = "",
}: VideoFacadeProps) {
  const [active, setActive] = useState(false);
  const titleId = useId();

  const hasVideo = provider !== "none" && videoId !== null;

  const paddingPercent =
    aspectRatio === "16/9" ? "56.25%" :
    aspectRatio === "9/16" ? "177.78%" :
    aspectRatio === "4/3"  ? "75%" :
    "100%";

  if (active && hasVideo) {
    return (
      <div
        className={className}
        style={{ position: "relative", paddingBottom: paddingPercent, height: 0 }}
      >
        <iframe
          src={getEmbedUrl(provider, videoId!)}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: "inherit",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        paddingBottom: paddingPercent,
        height: 0,
        cursor: hasVideo ? "pointer" : "default",
        backgroundColor: "var(--surface-alt)",
        borderRadius: "inherit",
        overflow: "hidden",
      }}
      onClick={() => hasVideo && setActive(true)}
      onKeyDown={(e) => {
        if (hasVideo && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setActive(true);
        }
      }}
      role={hasVideo ? "button" : undefined}
      tabIndex={hasVideo ? 0 : undefined}
      aria-label={hasVideo ? `Odtwórz film: ${title}` : undefined}
      aria-labelledby={titleId}
    >
      {/* Poster image */}
      {posterSrc ? (
        <Image
          src={posterSrc}
          alt={posterAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          className="transition-image"
        />
      ) : (
        /* Cinematic placeholder when no poster image available */
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(160deg, var(--dune) 0%, var(--surface-alt) 55%, var(--stone) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(4rem, 12vw, 8rem)",
              fontWeight: 300,
              color: "rgba(31,25,22,0.08)",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            S
          </span>
        </div>
      )}

      {/* Overlay */}
      {hasVideo && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(31,25,22,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.3s ease",
          }}
          className="video-overlay"
        >
          {/* Play button */}
          <div
            aria-hidden="true"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(241,233,224,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "transform 0.3s ease",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="var(--text-primary)"
              style={{ marginLeft: "2px" }}
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Hidden title for screen readers */}
      <span id={titleId} className="sr-only">
        {title}
      </span>
    </div>
  );
}
