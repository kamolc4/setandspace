export type VideoProvider = "vimeo" | "youtube";

export interface ParsedVideo {
  provider: VideoProvider;
  videoId: string;
}

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Parse a Vimeo or YouTube URL and return provider + videoId.
 * Returns null for unsupported or malformed URLs.
 * Works both server-side and client-side (no external dependencies).
 */
export function parseVideoUrl(url: string): ParsedVideo | null {
  if (!url?.trim()) return null;

  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");

    // YouTube: youtube.com/watch?v=ID  |  youtu.be/ID  |  youtube.com/shorts/ID
    if (host === "youtube.com" || host === "youtu.be") {
      let id: string | null = null;

      if (host === "youtu.be") {
        id = u.pathname.slice(1).split(/[?#]/)[0];
      } else {
        id = u.searchParams.get("v");
        if (!id) {
          const m = u.pathname.match(/\/(?:embed|v|shorts)\/([a-zA-Z0-9_-]{11})/);
          if (m) id = m[1];
        }
      }

      if (id && YOUTUBE_ID_RE.test(id)) {
        return { provider: "youtube", videoId: id };
      }
      return null;
    }

    // Vimeo: vimeo.com/ID  |  vimeo.com/video/ID  |  player.vimeo.com/video/ID
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const m = u.pathname.match(/\/(?:video\/)?(\d+)/);
      if (m) return { provider: "vimeo", videoId: m[1] };
      return null;
    }

    return null;
  } catch {
    return null;
  }
}

export function isAllowedVideoUrl(url: string): boolean {
  return parseVideoUrl(url) !== null;
}

export function getEmbedUrl(provider: VideoProvider, videoId: string): string {
  if (provider === "vimeo") {
    return `https://player.vimeo.com/video/${videoId}?autoplay=1&color=A6856B&title=0&byline=0&portrait=0`;
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
}

/** Public YouTube thumbnail (no API key needed). */
export function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function aspectRatioToFacade(ar: "PORTRAIT" | "LANDSCAPE" | "SQUARE"): "9/16" | "16/9" | "1/1" {
  if (ar === "PORTRAIT") return "9/16";
  if (ar === "SQUARE") return "1/1";
  return "16/9";
}
