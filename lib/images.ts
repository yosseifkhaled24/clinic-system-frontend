export function resolveApiImageUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return null;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

  console.log(`[resolveApiImageUrl] API Origin: ${apiOrigin}, Input: "${imageUrl}"`);

  // If it's already an absolute URL
  if (/^https?:\/\//i.test(imageUrl)) {
    console.log(`[resolveApiImageUrl] Already absolute URL`);
    return imageUrl;
  }

  // Handle relative paths like /storage/X/filename.jpg
  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  
  // Check if path starts with /storage (Spatie MediaLibrary)
  if (path.startsWith("/storage")) {
    // If backend is localhost, construct the full URL
    if (apiOrigin.includes("localhost") || apiOrigin.includes("127.0.0.1")) {
      const fullUrl = `${apiOrigin}${path}`;
      console.log(`[resolveApiImageUrl] Storage path detected, resolved to: ${fullUrl}`);
      return fullUrl;
    }
  }

  // For other paths, just append to origin
  const fullUrl = `${apiOrigin}${path}`;
  console.log(`[resolveApiImageUrl] Final resolved URL: ${fullUrl}`);
  
  return fullUrl;
}
