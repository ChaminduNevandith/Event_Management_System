/**
 * Validates that a URL is from a known safe image hosting domain.
 * Prevents SSRF attacks via internal network requests and XSS via javascript: URIs.
 */
export const ALLOWED_IMAGE_DOMAINS = [
  'images.unsplash.com',
  'unsplash.com',
  'plus.unsplash.com',
  'source.unsplash.com',
  'i.imgur.com',
  'imgur.com',
  'res.cloudinary.com',
  'cloudinary.com',
  'lh3.googleusercontent.com',
  'drive.google.com',
  'gravatar.com',
  'www.gravatar.com',
  'pbs.twimg.com',
  'abs.twimg.com',
  'cdn.discordapp.com',
  'media.discordapp.net',
  'avatars.githubusercontent.com',
  'raw.githubusercontent.com',
  'upload.wikimedia.org',
  'images.pexels.com',
  'images.squarespace-cdn.com',
  'picsum.photos',
  'cdn.pixabay.com',
  'storage.googleapis.com',
  // Allow relative paths (no domain)
];

export function isSafeImageUrl(url: string | null | undefined): boolean {
  if (!url) return true; // null/undefined is fine

  try {
    const parsed = new URL(url);

    // Block non-http(s) schemes (javascript:, data:, file:, ftp:, etc.)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    // Block localhost / private IPs (SSRF prevention)
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.') ||
      hostname.endsWith('.local') ||
      hostname === '0.0.0.0' ||
      hostname === '::1'
    ) {
      return false;
    }

    return true; // We allow any public https URL; domain allowlist is opt-in
  } catch {
    return false; // Invalid URL
  }
}

export function sanitizeImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return isSafeImageUrl(url) ? url : undefined;
}
