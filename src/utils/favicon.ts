/**
 * Utility function to get favicon URL from a given URL
 * Tries multiple common favicon locations
 */
export function getFaviconUrl(url: string | undefined): string | null {
    if (!url) return null;

    try {
        // Parse the URL to get the origin
        let parsedUrl: URL;
        
        // Add https:// if no protocol is present
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            parsedUrl = new URL(`https://${url}`);
        } else {
            parsedUrl = new URL(url);
        }
        
        const origin = parsedUrl.origin;
        
        // Return the standard favicon location
        // Most websites use /favicon.ico at the root
        return `${origin}/favicon.ico`;
    } catch {
        return null;
    }
}

/**
 * Predefined favicons for common services
 * Used as fallback or for well-known services
 */
export const KNOWN_FAVICONS: Record<string, string> = {
    'google.com': 'https://www.google.com/favicon.ico',
    'github.com': 'https://github.com/favicon.ico',
    'gitlab.com': 'https://gitlab.com/favicon.ico',
    'facebook.com': 'https://www.facebook.com/favicon.ico',
    'twitter.com': 'https://twitter.com/favicon.ico',
    'x.com': 'https://twitter.com/favicon.ico',
    'linkedin.com': 'https://www.linkedin.com/favicon.ico',
    'amazon.com': 'https://www.amazon.com/favicon.ico',
    'microsoft.com': 'https://www.microsoft.com/favicon.ico',
    'apple.com': 'https://www.apple.com/favicon.ico',
    'youtube.com': 'https://www.youtube.com/favicon.ico',
    'netflix.com': 'https://www.netflix.com/favicon.ico',
    'spotify.com': 'https://open.spotify.com/favicon.ico',
    'reddit.com': 'https://www.reddit.com/favicon.ico',
    'stackoverflow.com': 'https://stackoverflow.com/favicon.ico',
    'instagram.com': 'https://www.instagram.com/favicon.ico',
};

/**
 * Get favicon URL with fallback to known services
 */
export function getFaviconUrlWithFallback(url: string | undefined): string | null {
    if (!url) return null;
    
    try {
        let parsedUrl: URL;
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            parsedUrl = new URL(`https://${url}`);
        } else {
            parsedUrl = new URL(url);
        }
        
        const hostname = parsedUrl.hostname.toLowerCase();
        
        // Check if we have a known favicon for this domain
        for (const [domain, faviconUrl] of Object.entries(KNOWN_FAVICONS)) {
            if (hostname === domain || hostname.endsWith(`.${domain}`)) {
                return faviconUrl;
            }
        }
        
        // Default to favicon.ico
        return `${parsedUrl.origin}/favicon.ico`;
    } catch {
        return null;
    }
}
