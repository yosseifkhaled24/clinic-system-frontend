export function resolveApiImageUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return null;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

  // If DB seeded URL points to local backend, replace with live production origin
  if (imageUrl.includes("localhost:8000") || imageUrl.includes("127.0.0.1:8000")) {
    return imageUrl
      .replace(/http:\/\/(localhost|127\.0\.0\.1):8000/g, apiOrigin);
  }

  // If it's already an absolute URL
  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  // Handle relative paths like /storage/X/filename.jpg
  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;

  // Construct full URL from origin + path
  return `${apiOrigin}${path}`;
}
