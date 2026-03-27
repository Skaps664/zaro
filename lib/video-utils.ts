export function normalizeYouTubeEmbedUrl(rawUrl?: string | null) {
  if (!rawUrl) return ""

  const value = rawUrl.trim()
  if (!value) return ""

  try {
    const url = new URL(value)

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v")
        if (id) return `https://www.youtube.com/embed/${id}`
      }

      if (url.pathname.startsWith("/shorts/")) {
        const id = url.pathname.split("/")[2]
        if (id) return `https://www.youtube.com/embed/${id}`
      }

      if (url.pathname.startsWith("/embed/")) {
        return value
      }
    }

    if (url.hostname === "youtu.be") {
      const id = url.pathname.replace("/", "")
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    return value
  } catch {
    return value
  }
}
