/**
 * Rate Limiting Utility using in-memory store
 * 
 * **Note:** For production with multiple instances, consider using Redis instead.
 * This implementation is suitable for single-instance deployments or development.
 * 
 * @example
 * ```ts
 * const result = rateLimiters.auth(`login:${email}`);
 * if (!result.success) {
 *   return { error: result.error };
 * }
 * ```
 */

type RateLimitStore = {
    [key: string]: {
        count: number;
        resetTime: number;
    };
};

const store: RateLimitStore = {};

/**
 * Configuration options for rate limiting
 */
interface RateLimitConfig {
    /** Maximum number of requests allowed in the time window */
    maxRequests: number;
    /** Time window in milliseconds */
    windowMs: number;
}

// Default: 5 requests per minute
const DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
};

// Stricter: 3 requests per 5 minutes (for auth)
const AUTH_CONFIG: RateLimitConfig = {
    maxRequests: 3,
    windowMs: 5 * 60 * 1000, // 5 minutes
};

// Moderate: 10 requests per minute (for API)
const API_CONFIG: RateLimitConfig = {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
};

/**
 * Check if a request is within rate limits without incrementing the counter
 * Use this for read-only checks
 * 
 * @param identifier - Unique identifier (user ID, IP address, etc.)
 * @param config - Rate limit configuration
 * @returns Object with allowed status, remaining requests, and reset time
 * 
 * @example
 * ```ts
 * const { allowed, remaining } = checkRateLimit(`api:${userId}`, API_CONFIG);
 * console.log(`Remaining requests: ${remaining}`);
 * ```
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;

    // Clean up expired entries
    if (store[key] && store[key].resetTime < now) {
        delete store[key];
    }

    // Initialize if not exists
    if (!store[key]) {
        store[key] = {
            count: 0,
            resetTime: now + config.windowMs,
        };
    }

    const record = store[key];
    const allowed = record.count < config.maxRequests;

    if (allowed) {
        record.count++;
    }

    return {
        allowed,
        remaining: Math.max(0, config.maxRequests - record.count),
        resetTime: record.resetTime,
    };
}

/**
 * Apply rate limiting to a request
 * Increments the counter if allowed
 * 
 * @param identifier - Unique identifier (user ID, IP address, etc.)
 * @param config - Rate limit configuration
 * @returns Object with success status, optional error message, remaining count, and reset time
 * 
 * @example
 * ```ts
 * const result = rateLimit(`api:${userId}`, API_CONFIG);
 * if (!result.success) {
 *   return apiErrors.rateLimited();
 * }
 * ```
 */
export function rateLimit(
    identifier: string,
    config: RateLimitConfig = DEFAULT_CONFIG
): { success: boolean; error?: string; remaining: number; resetTime: number } {
    const result = checkRateLimit(identifier, config);

    if (!result.allowed) {
        const resetDate = new Date(result.resetTime);
        return {
            success: false,
            error: `Rate limit exceeded. Please try again after ${resetDate.toLocaleTimeString()}`,
            remaining: 0,
            resetTime: result.resetTime,
        };
    }

    return {
        success: true,
        remaining: result.remaining,
        resetTime: result.resetTime,
    };
}

/**
 * Pre-configured rate limiters for common use cases
 * 
 * - `auth`: Strict limiting for login/signup (3 requests per 5 minutes)
 * - `survey`: Moderate limiting for survey submissions (3 per minute)
 * - `expert`: Moderate limiting for expert actions (10 per minute)
 * - `api`: Standard API limiting (10 per minute)
 * 
 * @example
 * ```ts
 * // In login action
 * const result = rateLimiters.auth(`login:${email}`);
 * if (!result.success) {
 *   return { success: false, message: result.error };
 * }
 * ```
 */
export const rateLimiters = {
    // For login/signup - strict
    auth: (identifier: string) => rateLimit(identifier, AUTH_CONFIG),

    // For survey submission - moderate
    survey: (identifier: string) => rateLimit(identifier, { maxRequests: 3, windowMs: 60 * 1000 }),

    // For expert actions - moderate
    expert: (identifier: string) => rateLimit(identifier, { maxRequests: 10, windowMs: 60 * 1000 }),

    // For general API - standard
    api: (identifier: string) => rateLimit(identifier, API_CONFIG),
};

/**
 * Generate a client identifier for rate limiting
 * Prefers user ID when available, falls back to IP address
 * 
 * @param userId - Authenticated user ID or null
 * @param ip - Client IP address
 * @returns Formatted identifier string
 * 
 * @example
 * ```ts
 * const id = getClientIdentifier(user?.id, requestIp);
 * const result = rateLimiters.api(id);
 * ```
 */
export function getClientIdentifier(userId: string | null, ip: string): string {
    return userId ? `user:${userId}` : `ip:${ip}`;
}
