// Rate Limiting Utility using in-memory store
// For production, consider using Redis

type RateLimitStore = {
    [key: string]: {
        count: number;
        resetTime: number;
    };
};

const store: RateLimitStore = {};

interface RateLimitConfig {
    maxRequests: number;
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

// Pre-configured rate limiters
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

// Get client identifier from request
export function getClientIdentifier(userId: string | null, ip: string): string {
    return userId ? `user:${userId}` : `ip:${ip}`;
}
